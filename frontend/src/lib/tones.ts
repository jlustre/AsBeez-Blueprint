/**
 * Colour tones, as literal Tailwind class strings.
 *
 * Tailwind only emits classes it can see spelled out in the source it scans.
 * Once tones moved into the database, `bg-${tone}-50` became invisible to it —
 * and the classes only kept working by accident, because Tailwind was also
 * scanning templates/storeprofile.html. Delete that reference file and the
 * page would quietly lose every colour.
 *
 * So the database stores a tone KEY ('amber'), and the literal classes live
 * here where the scanner can find them.
 */
type Tone = {
    /** Pill/chip: background, text and border. */
    chip: string;
    /** Square icon holder behind an icon. */
    iconBox: string;
    /** Stronger icon holder, used by the social rows. */
    iconBoxStrong: string;
};

const tones: Record<string, Tone> = {
    amber: {
        chip: 'bg-amber-50 text-amber-700 border-amber-200',
        iconBox: 'bg-amber-50 text-amber-700',
        iconBoxStrong: 'bg-amber-100 text-amber-700',
    },
    sky: {
        chip: 'bg-sky-50 text-sky-700 border-sky-200',
        iconBox: 'bg-sky-50 text-sky-700',
        iconBoxStrong: 'bg-sky-100 text-sky-700',
    },
    slate: {
        chip: 'bg-slate-50 text-slate-700 border-slate-200',
        iconBox: 'bg-slate-50 text-slate-700',
        iconBoxStrong: 'bg-slate-900 text-white',
    },
    emerald: {
        chip: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        iconBox: 'bg-emerald-50 text-emerald-700',
        iconBoxStrong: 'bg-emerald-100 text-emerald-700',
    },
    indigo: {
        chip: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        iconBox: 'bg-indigo-50 text-indigo-700',
        iconBoxStrong: 'bg-indigo-100 text-indigo-700',
    },
    fuchsia: {
        chip: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
        iconBox: 'bg-fuchsia-50 text-fuchsia-700',
        iconBoxStrong: 'bg-fuchsia-100 text-fuchsia-700',
    },
    orange: {
        chip: 'bg-orange-50 text-orange-700 border-orange-200',
        iconBox: 'bg-orange-50 text-orange-700',
        iconBoxStrong: 'bg-orange-100 text-orange-700',
    },
    rose: {
        chip: 'bg-rose-50 text-rose-700 border-rose-200',
        iconBox: 'bg-rose-50 text-rose-700',
        iconBoxStrong: 'bg-rose-100 text-rose-700',
    },
    blue: {
        chip: 'bg-blue-50 text-blue-700 border-blue-200',
        iconBox: 'bg-blue-50 text-blue-700',
        iconBoxStrong: 'bg-blue-100 text-blue-700',
    },
    violet: {
        chip: 'bg-violet-50 text-violet-700 border-violet-200',
        iconBox: 'bg-violet-50 text-violet-700',
        iconBoxStrong: 'bg-violet-100 text-violet-700',
    },
    red: {
        chip: 'bg-red-50 text-red-700 border-red-200',
        iconBox: 'bg-red-50 text-red-700',
        iconBoxStrong: 'bg-red-100 text-red-700',
    },
    pink: {
        chip: 'bg-pink-50 text-pink-700 border-pink-200',
        iconBox: 'bg-pink-50 text-pink-700',
        iconBoxStrong: 'bg-pink-100 text-pink-700',
    },
};

/** Every tone the admin tone picker may offer, so the two never drift apart. */
export const toneNames = Object.keys(tones).sort();

export function toneClasses(name: string | null | undefined): Tone {
    return (name && tones[name]) || tones.slate;
}
