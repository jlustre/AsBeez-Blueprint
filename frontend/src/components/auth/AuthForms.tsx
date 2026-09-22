import { useState, type FormEvent, type ReactNode } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { useAuth } from '../../auth/AuthProvider';
import { useTranslation, type TranslateFn } from '../../i18n';
import { ApiError, type FieldErrors, type UserRole } from '../../lib/api';
import { BusyLabel } from '../ui/Spinner';

export type AuthPanel = 'signin' | 'signup' | 'forgot';

export const panelHash: Record<AuthPanel, string> = {
    signin: '#signin',
    signup: '#signup',
    forgot: '#forgot-password',
};

type SwitchHandler = (panel: AuthPanel) => void;

function describeError(error: unknown, t: TranslateFn): { message: string; errors: FieldErrors } {
    if (error instanceof ApiError) {
        return { message: error.message, errors: error.errors };
    }

    return { message: error instanceof Error ? error.message : t('common.somethingWentWrong'), errors: {} };
}

function Field({
    label,
    name,
    type,
    value,
    onChange,
    errors,
    autoComplete,
    required = true,
}: {
    label: string;
    name: string;
    type: string;
    value: string;
    onChange: (value: string) => void;
    errors: FieldErrors;
    autoComplete?: string;
    required?: boolean;
}) {
    const message = errors[name]?.[0];
    const errorId = `${name}-error`;

    return <label className="block text-xs font-semibold text-gray-600">
        {label}
        <input
            name={name}
            type={type}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            required={required}
            autoComplete={autoComplete}
            aria-invalid={message ? true : undefined}
            aria-describedby={message ? errorId : undefined}
            className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm font-normal text-charcoal outline-none focus:border-honey ${message ? 'border-red-400' : 'border-gray-300'}`}
        />
        {message && <span id={errorId} className="mt-1 block font-medium text-red-600">{message}</span>}
    </label>;
}

function FormAlert({ message }: { message: string }) {
    return <p role="alert" className="flex items-start gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
        <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />
        <span>{message}</span>
    </p>;
}

function FormSuccess({ message }: { message: string }) {
    return <p role="status" className="flex items-start gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-successgreen">
        <CheckCircle2 className="mt-px h-3.5 w-3.5 shrink-0" />
        <span>{message}</span>
    </p>;
}

function SubmitButton({ busy, children, busyLabel }: { busy: boolean; children: ReactNode; busyLabel: string }) {
    return <button
        type="submit"
        disabled={busy}
        className="flex w-full items-center justify-center rounded-lg bg-honey px-3 py-2.5 text-sm font-bold text-charcoal hover:bg-amber disabled:cursor-not-allowed disabled:opacity-60"
    >
        {busy ? <BusyLabel label={busyLabel} /> : children}
    </button>;
}

/**
 * Renders as a real anchor so the destination is visible and middle-clickable,
 * but hands control to the parent when it wants to swap panels in place.
 */
function SwitchLink({ to, onSwitch, children }: { to: AuthPanel; onSwitch?: SwitchHandler; children: ReactNode }) {
    return <a
        href={panelHash[to]}
        onClick={onSwitch ? (event) => { event.preventDefault(); onSwitch(to); } : undefined}
        className="font-semibold text-amber underline hover:text-honey"
    >
        {children}
    </a>;
}

export function SignInForm({ onSwitch, onDone }: { onSwitch?: SwitchHandler; onDone?: () => void }) {
    const { login } = useAuth();
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [busy, setBusy] = useState(false);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setFieldErrors({});
        setBusy(true);

        try {
            await login(email, password);
            setEmail('');
            setPassword('');
            onDone?.();
        } catch (caught) {
            const described = describeError(caught, t);
            setError(described.message);
            setFieldErrors(described.errors);
        } finally {
            setBusy(false);
        }
    }

    return <form onSubmit={submit} className="space-y-3">
        <Field label={t('auth.email')} name="email" type="email" value={email} onChange={setEmail} errors={fieldErrors} autoComplete="email" />
        <Field label={t('auth.password')} name="password" type="password" value={password} onChange={setPassword} errors={fieldErrors} autoComplete="current-password" />
        {error && <FormAlert message={error} />}
        <SubmitButton busy={busy} busyLabel={t('auth.signingIn')}>{t('auth.signIn')}</SubmitButton>
        <p className="text-center text-xs text-gray-600">
            <SwitchLink to="forgot" onSwitch={onSwitch}>{t('auth.forgotPassword')}</SwitchLink>
        </p>
        <p className="text-center text-xs text-gray-600">
            {t('auth.newToAsBeez')} <SwitchLink to="signup" onSwitch={onSwitch}>{t('auth.signUp')}</SwitchLink>
        </p>
    </form>;
}

export function SignUpForm({ onSwitch, onDone }: { onSwitch?: SwitchHandler; onDone?: () => void }) {
    const { register } = useAuth();
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [role, setRole] = useState<UserRole>('member');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [busy, setBusy] = useState(false);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setFieldErrors({});
        setBusy(true);

        try {
            await register({ name, email, password, password_confirmation: confirmation, role });
            onDone?.();
        } catch (caught) {
            const described = describeError(caught, t);
            setError(described.message);
            setFieldErrors(described.errors);
        } finally {
            setBusy(false);
        }
    }

    return <form onSubmit={submit} className="space-y-3">
        <Field label={t('auth.fullName')} name="name" type="text" value={name} onChange={setName} errors={fieldErrors} autoComplete="name" />
        <Field label={t('auth.email')} name="email" type="email" value={email} onChange={setEmail} errors={fieldErrors} autoComplete="email" />
        <Field label={t('auth.password')} name="password" type="password" value={password} onChange={setPassword} errors={fieldErrors} autoComplete="new-password" />
        <Field label={t('auth.confirmPassword')} name="password_confirmation" type="password" value={confirmation} onChange={setConfirmation} errors={fieldErrors} autoComplete="new-password" />
        <p className="text-xs text-gray-500">{t('auth.passwordHint')}</p>
        <fieldset className="space-y-1">
            <legend className="text-xs font-semibold text-gray-600">{t('auth.iWantTo')}</legend>
            <div className="flex gap-2">
                {([['member', t('auth.roleMember')], ['vendor', t('auth.roleVendor')]] as const).map(([option, label]) => (
                    <label
                        key={option}
                        className={`flex-1 cursor-pointer rounded-lg border px-3 py-2 text-center text-xs font-semibold ${role === option ? 'border-honey bg-softyellow text-charcoal' : 'border-gray-300 text-gray-600'}`}
                    >
                        <input
                            type="radio"
                            name="role"
                            value={option}
                            checked={role === option}
                            onChange={() => setRole(option)}
                            className="sr-only"
                        />
                        {label}
                    </label>
                ))}
            </div>
            {fieldErrors.role?.[0] && <p className="text-xs font-medium text-red-600">{fieldErrors.role[0]}</p>}
        </fieldset>
        {error && <FormAlert message={error} />}
        <SubmitButton busy={busy} busyLabel={t('auth.creatingAccount')}>{t('auth.createAccount')}</SubmitButton>
        <p className="text-center text-xs text-gray-600">
            {t('auth.alreadyHaveAccount')} <SwitchLink to="signin" onSwitch={onSwitch}>{t('auth.signIn')}</SwitchLink>
        </p>
    </form>;
}

export function ForgotPasswordForm({ onSwitch }: { onSwitch?: SwitchHandler }) {
    const { forgotPassword } = useAuth();
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [busy, setBusy] = useState(false);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setSent('');
        setFieldErrors({});
        setBusy(true);

        try {
            setSent(await forgotPassword(email));
        } catch (caught) {
            const described = describeError(caught, t);
            setError(described.message);
            setFieldErrors(described.errors);
        } finally {
            setBusy(false);
        }
    }

    return <form onSubmit={submit} className="space-y-3">
        <p className="text-xs text-gray-500">{t('auth.resetEmailHint')}</p>
        <Field label={t('auth.email')} name="email" type="email" value={email} onChange={setEmail} errors={fieldErrors} autoComplete="email" />
        {error && <FormAlert message={error} />}
        {sent && <FormSuccess message={sent} />}
        <SubmitButton busy={busy} busyLabel={t('auth.sending')}>{t('auth.sendResetLink')}</SubmitButton>
        <p className="text-center text-xs text-gray-600">
            <SwitchLink to="signin" onSwitch={onSwitch}>{t('auth.backToSignIn')}</SwitchLink>
        </p>
    </form>;
}

export function ResetPasswordForm({ token, email: initialEmail }: { token: string; email: string }) {
    const { resetPassword } = useAuth();
    const { t } = useTranslation();
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [done, setDone] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [busy, setBusy] = useState(false);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setFieldErrors({});
        setBusy(true);

        try {
            setDone(await resetPassword({ token, email, password, password_confirmation: confirmation }));
        } catch (caught) {
            const described = describeError(caught, t);
            setError(described.message);
            setFieldErrors(described.errors);
        } finally {
            setBusy(false);
        }
    }

    if (!token) {
        return <div className="space-y-3">
            <FormAlert message={t('auth.resetMissingToken')} />
            <a href={panelHash.forgot} className="block rounded-lg bg-honey px-3 py-2.5 text-center text-sm font-bold text-charcoal hover:bg-amber">
                {t('auth.requestNewLink')}
            </a>
        </div>;
    }

    if (done) {
        return <div className="space-y-3">
            <FormSuccess message={done} />
            <a href={panelHash.signin} className="block rounded-lg bg-honey px-3 py-2.5 text-center text-sm font-bold text-charcoal hover:bg-amber">
                {t('auth.goToSignIn')}
            </a>
        </div>;
    }

    return <form onSubmit={submit} className="space-y-3">
        <Field label={t('auth.email')} name="email" type="email" value={email} onChange={setEmail} errors={fieldErrors} autoComplete="email" />
        <Field label={t('auth.newPassword')} name="password" type="password" value={password} onChange={setPassword} errors={fieldErrors} autoComplete="new-password" />
        <Field label={t('auth.confirmNewPassword')} name="password_confirmation" type="password" value={confirmation} onChange={setConfirmation} errors={fieldErrors} autoComplete="new-password" />
        <p className="text-xs text-gray-500">{t('auth.resetPasswordHint')}</p>
        {error && <FormAlert message={error} />}
        <SubmitButton busy={busy} busyLabel={t('auth.updating')}>{t('auth.resetPassword')}</SubmitButton>
    </form>;
}

export function ChangePasswordForm() {
    const { changePassword } = useAuth();
    const { t } = useTranslation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [done, setDone] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [busy, setBusy] = useState(false);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setDone('');
        setFieldErrors({});
        setBusy(true);

        try {
            setDone(await changePassword({
                current_password: currentPassword,
                password,
                password_confirmation: confirmation,
            }));
            setCurrentPassword('');
            setPassword('');
            setConfirmation('');
        } catch (caught) {
            const described = describeError(caught, t);
            setError(described.message);
            setFieldErrors(described.errors);
        } finally {
            setBusy(false);
        }
    }

    return <form onSubmit={submit} className="space-y-3">
        <Field label={t('auth.currentPassword')} name="current_password" type="password" value={currentPassword} onChange={setCurrentPassword} errors={fieldErrors} autoComplete="current-password" />
        <Field label={t('auth.newPassword')} name="password" type="password" value={password} onChange={setPassword} errors={fieldErrors} autoComplete="new-password" />
        <Field label={t('auth.confirmNewPassword')} name="password_confirmation" type="password" value={confirmation} onChange={setConfirmation} errors={fieldErrors} autoComplete="new-password" />
        {error && <FormAlert message={error} />}
        {done && <FormSuccess message={done} />}
        <SubmitButton busy={busy} busyLabel={t('auth.updating')}>{t('auth.updatePassword')}</SubmitButton>
    </form>;
}
