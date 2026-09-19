import { useState, type FormEvent, type ReactNode } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { useAuth } from '../../auth/AuthProvider';
import { ApiError, type FieldErrors, type UserRole } from '../../lib/api';

export type AuthPanel = 'signin' | 'signup' | 'forgot';

export const panelHash: Record<AuthPanel, string> = {
    signin: '#signin',
    signup: '#signup',
    forgot: '#forgot-password',
};

type SwitchHandler = (panel: AuthPanel) => void;

function describeError(error: unknown): { message: string; errors: FieldErrors } {
    if (error instanceof ApiError) {
        return { message: error.message, errors: error.errors };
    }

    return { message: error instanceof Error ? error.message : 'Something went wrong. Please try again.', errors: {} };
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
        {busy ? busyLabel : children}
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
            const described = describeError(caught);
            setError(described.message);
            setFieldErrors(described.errors);
        } finally {
            setBusy(false);
        }
    }

    return <form onSubmit={submit} className="space-y-3">
        <Field label="Email" name="email" type="email" value={email} onChange={setEmail} errors={fieldErrors} autoComplete="email" />
        <Field label="Password" name="password" type="password" value={password} onChange={setPassword} errors={fieldErrors} autoComplete="current-password" />
        {error && <FormAlert message={error} />}
        <SubmitButton busy={busy} busyLabel="Signing in…">Sign in</SubmitButton>
        <p className="text-center text-xs text-gray-600">
            <SwitchLink to="forgot" onSwitch={onSwitch}>Forgot your password?</SwitchLink>
        </p>
        <p className="text-center text-xs text-gray-600">
            New to AsBeez? <SwitchLink to="signup" onSwitch={onSwitch}>Sign up</SwitchLink>
        </p>
    </form>;
}

export function SignUpForm({ onSwitch, onDone }: { onSwitch?: SwitchHandler; onDone?: () => void }) {
    const { register } = useAuth();
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
            const described = describeError(caught);
            setError(described.message);
            setFieldErrors(described.errors);
        } finally {
            setBusy(false);
        }
    }

    return <form onSubmit={submit} className="space-y-3">
        <Field label="Full name" name="name" type="text" value={name} onChange={setName} errors={fieldErrors} autoComplete="name" />
        <Field label="Email" name="email" type="email" value={email} onChange={setEmail} errors={fieldErrors} autoComplete="email" />
        <Field label="Password" name="password" type="password" value={password} onChange={setPassword} errors={fieldErrors} autoComplete="new-password" />
        <Field label="Confirm password" name="password_confirmation" type="password" value={confirmation} onChange={setConfirmation} errors={fieldErrors} autoComplete="new-password" />
        <p className="text-xs text-gray-500">Use at least 12 characters.</p>
        <fieldset className="space-y-1">
            <legend className="text-xs font-semibold text-gray-600">I want to</legend>
            <div className="flex gap-2">
                {([['member', 'Buy & hire'], ['vendor', 'Sell & offer services']] as const).map(([option, label]) => (
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
        <SubmitButton busy={busy} busyLabel="Creating account…">Create account</SubmitButton>
        <p className="text-center text-xs text-gray-600">
            Already have an account? <SwitchLink to="signin" onSwitch={onSwitch}>Sign in</SwitchLink>
        </p>
    </form>;
}

export function ForgotPasswordForm({ onSwitch }: { onSwitch?: SwitchHandler }) {
    const { forgotPassword } = useAuth();
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
            const described = describeError(caught);
            setError(described.message);
            setFieldErrors(described.errors);
        } finally {
            setBusy(false);
        }
    }

    return <form onSubmit={submit} className="space-y-3">
        <p className="text-xs text-gray-500">Enter the address on your account and we will send a reset link.</p>
        <Field label="Email" name="email" type="email" value={email} onChange={setEmail} errors={fieldErrors} autoComplete="email" />
        {error && <FormAlert message={error} />}
        {sent && <FormSuccess message={sent} />}
        <SubmitButton busy={busy} busyLabel="Sending…">Send reset link</SubmitButton>
        <p className="text-center text-xs text-gray-600">
            <SwitchLink to="signin" onSwitch={onSwitch}>Back to sign in</SwitchLink>
        </p>
    </form>;
}

export function ResetPasswordForm({ token, email: initialEmail }: { token: string; email: string }) {
    const { resetPassword } = useAuth();
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
            const described = describeError(caught);
            setError(described.message);
            setFieldErrors(described.errors);
        } finally {
            setBusy(false);
        }
    }

    if (!token) {
        return <div className="space-y-3">
            <FormAlert message="This reset link is missing its token. Request a new one to continue." />
            <a href={panelHash.forgot} className="block rounded-lg bg-honey px-3 py-2.5 text-center text-sm font-bold text-charcoal hover:bg-amber">
                Request a new link
            </a>
        </div>;
    }

    if (done) {
        return <div className="space-y-3">
            <FormSuccess message={done} />
            <a href={panelHash.signin} className="block rounded-lg bg-honey px-3 py-2.5 text-center text-sm font-bold text-charcoal hover:bg-amber">
                Go to sign in
            </a>
        </div>;
    }

    return <form onSubmit={submit} className="space-y-3">
        <Field label="Email" name="email" type="email" value={email} onChange={setEmail} errors={fieldErrors} autoComplete="email" />
        <Field label="New password" name="password" type="password" value={password} onChange={setPassword} errors={fieldErrors} autoComplete="new-password" />
        <Field label="Confirm new password" name="password_confirmation" type="password" value={confirmation} onChange={setConfirmation} errors={fieldErrors} autoComplete="new-password" />
        <p className="text-xs text-gray-500">Use at least 12 characters. Signing in again will be required on every device.</p>
        {error && <FormAlert message={error} />}
        <SubmitButton busy={busy} busyLabel="Updating…">Reset password</SubmitButton>
    </form>;
}

export function ChangePasswordForm() {
    const { changePassword } = useAuth();
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
            const described = describeError(caught);
            setError(described.message);
            setFieldErrors(described.errors);
        } finally {
            setBusy(false);
        }
    }

    return <form onSubmit={submit} className="space-y-3">
        <Field label="Current password" name="current_password" type="password" value={currentPassword} onChange={setCurrentPassword} errors={fieldErrors} autoComplete="current-password" />
        <Field label="New password" name="password" type="password" value={password} onChange={setPassword} errors={fieldErrors} autoComplete="new-password" />
        <Field label="Confirm new password" name="password_confirmation" type="password" value={confirmation} onChange={setConfirmation} errors={fieldErrors} autoComplete="new-password" />
        {error && <FormAlert message={error} />}
        {done && <FormSuccess message={done} />}
        <SubmitButton busy={busy} busyLabel="Updating…">Update password</SubmitButton>
    </form>;
}
