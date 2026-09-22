import { useTranslation } from '../../i18n';
import type { User } from '../../lib/api';

/**
 * The signed-in account's own avatar, shared by all three dashboard shells.
 *
 * Falls back to initials rather than a placeholder photo: a stock face
 * standing in for the viewer reads as "this is you", which is worse than
 * showing nothing.
 *
 * `avatar_url` rides on the auth user rather than the member profile, so a
 * shell can paint it without fetching a profile it otherwise has no use for.
 * Uploading a new one therefore updates every shell as soon as auth refreshes.
 *
 * `className` and `fallbackTone` carry whole class sets rather than merging
 * overrides, for the same reason MenuCloseButton does: two competing utilities
 * for one property leave source order, not the call site, deciding the winner.
 */
export function Avatar({ user, className, fallbackTone = 'bg-slate-200 text-slate-700' }: {
    user: User | null;
    className: string;
    fallbackTone?: string;
}) {
    const { t } = useTranslation();
    const name = user?.name ?? t('member.member');

    if (user?.avatar_url) {
        return <img src={user.avatar_url} alt={t('member.avatarAlt', { name })} className={`${className} object-cover`} />;
    }

    return (
        <span
            role="img"
            aria-label={t('member.avatarAlt', { name })}
            className={`${className} ${fallbackTone} flex items-center justify-center text-xs font-bold`}
        >
            {user?.initials ?? '—'}
        </span>
    );
}
