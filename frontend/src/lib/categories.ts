import { apiRequest } from './api';

/**
 * The minimum a row needs to be placed in the tree. Kept structural rather
 * than tied to one payload: the taxonomy reaches the client through several
 * endpoints that each carry a different set of extra fields.
 */
export type CategoryLike = {
    id: number;
    parent_id: number | null;
    name: string;
};

export type CategoryOption<T extends CategoryLike = CategoryLike> = T & {
    /** 0 for a root, 1 for its children, and so on. */
    depth: number;
    /** 'Electronics › Computers & Accessories › Laptops' */
    path: string;
};

/**
 * Flattens the category registry into the order a person reads it.
 *
 * The API sends one flat list ordered by `position`, which is only unique
 * among siblings — so on the wire a root, its grandchild and an unrelated
 * root all share position 0 and arrive interleaved. Fine for a lookup by id,
 * useless for a picker, and increasingly so as the taxonomy grows.
 *
 * Rebuilding the tree here rather than asking the API to nest it keeps the
 * response shape flat for every other consumer, which is the shape they want.
 *
 * Orphans — a row whose parent is inactive, so filtered out of the payload —
 * are treated as roots rather than dropped: a category the vendor can no
 * longer see would silently disappear from their own store's chips.
 */
export function categoryOptions<T extends CategoryLike>(categories: T[]): CategoryOption<T>[] {
    const byParent = new Map<number | null, T[]>();
    const ids = new Set(categories.map((category) => category.id));

    for (const category of categories) {
        // An unreachable parent makes this row a root for display purposes.
        const key = category.parent_id !== null && ids.has(category.parent_id) ? category.parent_id : null;
        const siblings = byParent.get(key);

        if (siblings) {
            siblings.push(category);
        } else {
            byParent.set(key, [category]);
        }
    }

    const out: CategoryOption<T>[] = [];

    const walk = (parentId: number | null, depth: number, prefix: string): void => {
        for (const category of byParent.get(parentId) ?? []) {
            const path = prefix ? `${prefix} › ${category.name}` : category.name;

            out.push({ ...category, depth, path });
            walk(category.id, depth + 1, path);
        }
    };

    walk(null, 0, '');

    return out;
}

/**
 * Indents a label for a native `<select>`, which allows no markup inside an
 * option. Non-breaking spaces because the browser collapses ordinary ones.
 */
export function indentOption(option: CategoryOption): string {
    return `${' '.repeat(option.depth * 4)}${option.depth > 0 ? '└ ' : ''}${option.name}`;
}

/* ------------------------------------------------------------------ */
/* Navigation tree                                                     */
/* ------------------------------------------------------------------ */

export type CategoryTreeNode = {
    id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    tone: string;
    /** Listings filed directly in this category. */
    listing_count: number;
    /** Listings in this category and everything beneath it. */
    total_count: number;
    children: CategoryTreeNode[];
};

/**
 * Deep-links into the marketplace, filtered to one category.
 *
 * One place rather than a literal per caller: the top bar, the mega menu and
 * the homepage grid all point at the same rows, and a link shape that drifts
 * between them is a filter that works from one menu and not the other.
 */
export function categoryHref(slug: string): string {
    return `?category=${encodeURIComponent(slug)}#marketplace`;
}

/**
 * In flight or resolved, the one request for the taxonomy.
 *
 * The header now opens seven market menus off the same rows the mega menu
 * uses, and there are ~520 of them. Caching the promise rather than the
 * result means eight menus opened in quick succession still make one request,
 * and whichever opens first pays for the rest. A failure clears the cache so
 * the next open retries instead of replaying the error forever.
 */
let treeRequest: Promise<CategoryTreeNode[]> | null = null;

export const categoryApi = {
    /** The whole active taxonomy, nested. Public: browsing needs no account. */
    async tree(): Promise<CategoryTreeNode[]> {
        treeRequest ??= apiRequest<{ categories: CategoryTreeNode[] }>('/categories')
            .then((payload) => payload.categories)
            .catch((error: unknown) => {
                treeRequest = null;
                throw error;
            });

        return await treeRequest;
    },
};

export type CategoryMatch = {
    node: CategoryTreeNode;
    /** 'Electronics › Computers & Accessories' — the ancestors, for context. */
    trail: string;
};

/**
 * Finds categories whose name matches, anywhere in the tree.
 *
 * Matching is done here rather than server side: the whole taxonomy is
 * already in memory once the menu opens, so a round trip per keystroke would
 * buy nothing but latency.
 *
 * Ancestors are carried along because leaf names repeat across departments —
 * "Plumbing" is both a trade and a service — and a bare name cannot be told
 * apart from its twin.
 */
export function searchCategories(roots: CategoryTreeNode[], term: string, limit = 12): CategoryMatch[] {
    const needle = term.trim().toLowerCase();

    if (needle.length < 2) {
        return [];
    }

    const found: CategoryMatch[] = [];

    const walk = (nodes: CategoryTreeNode[], trail: string[]): void => {
        for (const node of nodes) {
            if (found.length >= limit) {
                return;
            }

            if (node.name.toLowerCase().includes(needle)) {
                found.push({ node, trail: trail.join(' › ') });
            }

            walk(node.children, [...trail, node.name]);
        }
    };

    walk(roots, []);

    return found;
}

/**
 * Splits a department's children into the shape the menu column renders.
 *
 * A child that has children of its own becomes a headed group; the rest are
 * gathered into one trailing group, so a department with no third level still
 * fills the column instead of showing a heading per link.
 */
export function categoryGroups(root: CategoryTreeNode): { heading: CategoryTreeNode | null; items: CategoryTreeNode[] }[] {
    const groups = root.children
        .filter((child) => child.children.length > 0)
        .map((child) => ({ heading: child, items: child.children }));

    const loose = root.children.filter((child) => child.children.length === 0);

    return loose.length > 0 ? [...groups, { heading: null, items: loose }] : groups;
}
