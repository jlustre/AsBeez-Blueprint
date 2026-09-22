import { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, BadgeCheck, Eye, Globe, Loader2 } from 'lucide-react';

import { useTranslation } from '../../i18n';
import { publicMemberApi, type PublicMember } from '../../lib/member';
import { toneClasses } from '../../lib/tones';

function usernameFromLocation(): string {
    return new URLSearchParams(window.location.search).get('member') ?? '';
}

/**
 * A member's public profile, as other members and vendors see it.
 *
 * The API decides what is visible: a hidden profile is a 404 for everyone
 * except its owner and admins, who get it back flagged as a preview.
 */
export function PublicMemberPage() {
    const { t, locale } = useTranslation();
    const [username, setUsername] = useState(usernameFromLocation);
    const [member, setMember] = useState<PublicMember | null>(null);
    const [isPreview, setIsPreview] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const onHashChange = () => setUsername(usernameFromLocation());
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            setError('');

            if (!username) {
                setError(t('publicMember.noMemberNamed'));
                setLoading(false);
                return;
            }

            try {
                const { member: fetched, preview } = await publicMemberApi.get(username);

                if (!cancelled) {
                    setMember(fetched);
                    setIsPreview(preview);
                }
            } catch (caught) {
                if (!cancelled) {
                    setError(caught instanceof Error ? caught.message : t('publicMember.couldNotLoad'));
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();

        return () => { cancelled = true; };
    }, [username]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex items-center gap-3 text-slate-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm font-medium">{t('publicMember.loading')}</span>
                </div>
            </div>
        );
    }

    if (error || !member) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
                <div className="max-w-sm space-y-3 text-center">
                    <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
                    <p className="text-sm font-semibold text-slate-900">{error || t('publicMember.notFound')}</p>
                    <p className="text-xs text-slate-500">{t('publicMember.notFoundHint')}</p>
                    <a href="#member-profile" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                        <ArrowLeft className="h-4 w-4" />{t('publicMember.backToProfile')}
                    </a>
                </div>
            </div>
        );
    }

    const memberSince = member.member_since
        ? new Date(member.member_since).toLocaleDateString(locale, { month: 'long', year: 'numeric' })
        : null;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
            {isPreview && (
                <div className="sticky top-0 z-50 border-b border-amber-300 bg-amber-100 px-4 py-2.5">
                    <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2">
                        <p className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                            <Eye className="h-4 w-4" />{t('publicMember.previewBanner')}
                        </p>
                        <a href="#member-profile" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm hover:bg-slate-50">
                            <ArrowLeft className="h-3.5 w-3.5" />{t('storefront.backToEditing')}
                        </a>
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="h-28 bg-gradient-to-br from-amber-200 via-amber-100 to-yellow-50" />

                    <div className="px-6 pb-6">
                        <div className="-mt-12 flex items-end gap-4">
                            {member.avatar_url
                                ? <img src={member.avatar_url} alt={member.name} className="h-24 w-24 rounded-2xl object-cover shadow-lg ring-4 ring-white" />
                                : <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-amber-100 text-2xl font-extrabold text-amber-800 shadow-lg ring-4 ring-white">{member.initials}</div>}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <h1 className="text-xl font-extrabold tracking-tight">{member.name}</h1>
                            {member.verified && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
                                    <BadgeCheck className="h-3.5 w-3.5" />{t('publicMember.verifiedMember')}
                                </span>
                            )}
                        </div>

                        <p className="mt-0.5 text-xs text-slate-500">
                            @{member.username}
                            {member.pronouns ? ` · ${member.pronouns}` : ''}
                            {memberSince ? ` · ${t('publicMember.memberSince', { date: memberSince })}` : ''}
                        </p>

                        {member.occupation && <p className="mt-2 text-sm font-medium text-slate-700">{member.occupation}</p>}
                        {member.bio && <p className="mt-3 text-sm leading-relaxed text-slate-600">{member.bio}</p>}

                        {member.website && (
                            <a href={member.website} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:underline">
                                <Globe className="h-4 w-4" />{member.website.replace(/^https?:\/\//, '')}
                            </a>
                        )}

                        {member.interests.length > 0 && (
                            <div className="mt-4 border-t border-slate-100 pt-4">
                                <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{t('publicMember.interests')}</h2>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {member.interests.map((interest) => (
                                        <span key={interest.id} className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses(interest.tone).chip}`}>
                                            {interest.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {member.allow_vendor_contact && (
                            <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
                                {t('publicMember.openToVendors')}
                            </p>
                        )}
                    </div>
                </article>

                <p className="mt-6 text-center text-xs text-slate-500">
                    <span className="font-extrabold text-slate-800">As<span className="text-amber-500">Beez</span></span> {t('publicMember.footer')}
                </p>
            </div>
        </div>
    );
}
