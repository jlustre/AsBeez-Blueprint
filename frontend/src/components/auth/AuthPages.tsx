import { useEffect, useState, type ReactNode } from 'react';
import { CheckCircle2, MailWarning, ShieldAlert, XCircle } from 'lucide-react';

import { dashboardHashFor, useAuth } from '../../auth/AuthProvider';
import { useTranslation, type MessageKey } from '../../i18n';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { BusyLabel } from '../ui/Spinner';
import { ChangePasswordForm, ForgotPasswordForm, ResetPasswordForm, SignInForm, SignUpForm } from './AuthForms';

function readQuery(key: string): string {
    return new URLSearchParams(window.location.search).get(key) ?? '';
}

function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
    const { t } = useTranslation();
    return <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-10 text-charcoal antialiased">
        <a href="#" className="mb-6 text-3xl font-extrabold" aria-label={t('nav.homepage')}>
            <span className="text-honey">As</span>Beez
        </a>
        <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-soft">
            <h1 className="text-lg font-bold">{title}</h1>
            {subtitle && <p className="mt-1 mb-4 text-xs text-gray-500">{subtitle}</p>}
            <div className={subtitle ? '' : 'mt-4'}>{children}</div>
        </div>
        <div className="mt-6 flex items-center gap-4">
            <a href="#" className="text-xs font-semibold text-gray-500 underline hover:text-amber">{t('auth.backToMarketplace')}</a>
            {/* Offered before sign-in: the preference has nowhere to be stored yet. */}
            <LanguageSwitcher className="text-gray-500" compact />
        </div>
    </div>;
}

export function SignInPage() {
    const { t } = useTranslation();
    return <AuthCard title={t('auth.signInTitle')} subtitle={t('auth.signInSubtitle')}>
        <SignInForm />
    </AuthCard>;
}

export function SignUpPage() {
    const { t } = useTranslation();
    return <AuthCard title={t('auth.signUpTitle')} subtitle={t('auth.signUpSubtitle')}>
        <SignUpForm />
    </AuthCard>;
}

export function ForgotPasswordPage() {
    const { t } = useTranslation();
    return <AuthCard title={t('auth.forgotTitle')} subtitle={t('auth.forgotSubtitle')}>
        <ForgotPasswordForm />
    </AuthCard>;
}

export function ResetPasswordPage() {
    // The mailed link carries these in the query string, ahead of the route hash.
    const { t } = useTranslation();
    const [token] = useState(() => readQuery('token'));
    const [email] = useState(() => readQuery('email'));

    return <AuthCard title={t('auth.resetTitle')} subtitle={t('auth.resetSubtitle')}>
        <ResetPasswordForm token={token} email={email} />
    </AuthCard>;
}

export function AccountSecurityPage() {
    const { t } = useTranslation();
    const { user, logoutAll } = useAuth();

    if (!user) {
        return <SignInPage />;
    }

    return <AuthCard title={t('auth.accountSecurity')} subtitle={t('auth.signedInAs', { email: user.email })}>
        <ChangePasswordForm />
        <div className="mt-5 border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-500">{t('auth.trustedDevice')}</p>
            <button
                onClick={() => void logoutAll()}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-charcoal hover:border-amber hover:text-amber"
            >
                {t('auth.signOutAll')}
            </button>
        </div>
    </AuthCard>;
}

/**
 * Shown when a signed-in user reaches a dashboard their role does not cover.
 * The API enforces this too; this only keeps the UI honest.
 */
export function AccessDeniedPage() {
    const { t } = useTranslation();
    const { user } = useAuth();

    return <AuthCard title={t('auth.noAccessTitle')}>
        <div className="space-y-4 text-center">
            <ShieldAlert className="mx-auto h-10 w-10 text-amber" />
            <p className="text-sm text-gray-600">
                {user ? t('auth.noAccessBody', { role: user.role.replace('-', ' ') }) : t('auth.noAccessSignIn')}
            </p>
            <a
                href={user ? dashboardHashFor(user.role) : '#signin'}
                className="block rounded-lg bg-honey px-3 py-2.5 text-sm font-bold text-charcoal hover:bg-amber"
            >
                {user ? t('auth.goToDashboard') : t('auth.goToSignIn')}
            </a>
        </div>
    </AuthCard>;
}

const verificationCopy: Record<string, { title: MessageKey; body: MessageKey; tone: 'ok' | 'error' }> = {
    verified: { title: 'auth.emailVerified', body: 'auth.emailVerifiedBody', tone: 'ok' },
    'already-verified': { title: 'auth.alreadyVerified', body: 'auth.alreadyVerifiedBody', tone: 'ok' },
    failed: { title: 'auth.verifyFailed', body: 'auth.verifyFailedBody', tone: 'error' },
};

export function EmailVerifiedPage() {
    const { user, refresh } = useAuth();
    const { t } = useTranslation();
    const status = readQuery('status');
    const copy = verificationCopy[status] ?? verificationCopy.failed;
    const Icon = copy.tone === 'ok' ? CheckCircle2 : XCircle;

    // Pull the fresh email_verified_at so an open session stops nagging.
    useEffect(() => {
        if (copy.tone === 'ok' && user && !user.email_verified_at) {
            void refresh();
        }
    }, [copy.tone, user, refresh]);

    return <AuthCard title={copy.title}>
        <div className="space-y-4 text-center">
            <Icon className={`mx-auto h-10 w-10 ${copy.tone === 'ok' ? 'text-successgreen' : 'text-red-600'}`} />
            <p className="text-sm text-gray-600">{copy.body}</p>
            <a
                href={user ? '#member-dashboard' : '#signin'}
                className="block rounded-lg bg-honey px-3 py-2.5 text-sm font-bold text-charcoal hover:bg-amber"
            >
                {user ? t('auth.goToDashboard') : t('auth.goToSignIn')}
            </a>
        </div>
    </AuthCard>;
}

/**
 * Nag bar for signed-in users who have not confirmed their address yet. Shown
 * above dashboards rather than blocking them, so a new account stays usable.
 */
export function VerifyEmailBanner() {
    const { user, resendVerification } = useAuth();
    const { t } = useTranslation();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    if (!user || user.email_verified_at) {
        return null;
    }

    async function resend() {
        setMessage('');
        setError('');
        setBusy(true);

        try {
            setMessage(await resendVerification());
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : t('auth.couldNotSend'));
        } finally {
            setBusy(false);
        }
    }

    return <div className="border-b border-amber/40 bg-softyellow px-4 py-2.5 text-charcoal">
        <div className="amazon-container flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <MailWarning className="h-4 w-4 shrink-0 text-amber" />
            <span>{t('auth.confirmEmail', { email: user.email })}</span>
            <button
                onClick={resend}
                disabled={busy}
                className="font-semibold underline hover:text-amber disabled:opacity-60"
            >
                {busy ? <BusyLabel label={t('auth.sending')} /> : t('auth.resendLink')}
            </button>
            {message && <span role="status" className="font-medium text-successgreen">{message}</span>}
            {error && <span role="alert" className="font-medium text-red-700">{error}</span>}
        </div>
    </div>;
}
