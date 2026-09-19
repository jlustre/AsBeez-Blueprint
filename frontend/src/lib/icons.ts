import {
    Banknote,
    Bell,
    Blocks,
    Boxes,
    CalendarDays,
    ChartColumn,
    CircleHelp,
    Clock,
    CreditCard,
    ExternalLink,
    FileSpreadsheet,
    FileText,
    Layers,
    LayoutGrid,
    LifeBuoy,
    Megaphone,
    MessageSquare,
    Package,
    PackagePlus,
    Palette,
    Percent,
    Receipt,
    RotateCcw,
    ShieldCheck,
    ShoppingBag,
    SquarePen,
    Star,
    Store,
    Ticket,
    Truck,
    UserCog,
    Users,
    X,
    type LucideIcon,
} from 'lucide-react';

/**
 * Icon names travel from the database as strings, so they need resolving to a
 * component here.
 *
 * This is a curated map rather than `import * as lucide` on purpose: a
 * namespace import defeats tree-shaking and would pull the entire icon set
 * into the bundle. Adding an icon to an admin dropdown means adding it here
 * too — `iconByName` falls back rather than crashing if that is forgotten.
 */
const registry: Record<string, LucideIcon> = {
    Banknote,
    Bell,
    Blocks,
    Boxes,
    CalendarDays,
    ChartColumn,
    CircleHelp,
    Clock,
    CreditCard,
    ExternalLink,
    FileSpreadsheet,
    FileText,
    Layers,
    LayoutGrid,
    LifeBuoy,
    Megaphone,
    MessageSquare,
    Package,
    PackagePlus,
    Palette,
    Percent,
    Receipt,
    RotateCcw,
    ShieldCheck,
    ShoppingBag,
    SquarePen,
    Star,
    Store,
    Ticket,
    Truck,
    UserCog,
    Users,
    X,
};

/** Every name the admin icon picker may offer, so the two never drift apart. */
export const iconNames = Object.keys(registry).sort();

export function iconByName(name: string | null | undefined): LucideIcon {
    return (name && registry[name]) || CircleHelp;
}
