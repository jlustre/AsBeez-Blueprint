import { useState } from 'react';
import { LogIn, LogOut, MonitorSmartphone, UserRound } from 'lucide-react';

import { dashboardHashFor, useAuth } from '../../../auth/AuthProvider';
import { useTranslation, type TranslateFn } from '../../../i18n';
import { ForgotPasswordForm, SignInForm, SignUpForm, type AuthPanel } from '../../auth/AuthForms';
import { MenuCloseButton } from '../../ui/MenuCloseButton';

function panelCopy(t: TranslateFn): Record<AuthPanel, { title: string; subtitle: string }> {
  return {
    signin: { title: t('auth.signInTitle'), subtitle: t('auth.signInSubtitle') },
    signup: { title: t('auth.signUpTitle'), subtitle: t('auth.signUpSubtitle') },
    forgot: { title: t('auth.forgotTitle'), subtitle: t('auth.forgotSubtitle') },
  };
}

export function AccountMenu({ onClose }: { onClose: () => void }) {
  const { user, logout, logoutAll } = useAuth();
  const { t } = useTranslation();
  const [panel, setPanel] = useState<AuthPanel>('signin');

  if (user) {
    return (
      <div className="absolute right-0 top-full z-50 mt-3 w-72 rounded-xl border border-gray-200 bg-white p-4 text-charcoal shadow-2xl ring-1 ring-charcoal/10">
        <div className="mb-3 flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
          <div className="flex min-w-0 items-center gap-2">
            <UserRound className="h-5 w-5 shrink-0 text-amber" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{user.name}</p>
              <p className="text-xs text-gray-500">{t('auth.signedInAs', { email: user.email })}</p>
            </div>
          </div>
          <MenuCloseButton onClose={onClose} />
        </div>
        <div className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">{t('nav.dashboards')}</div>
        <div className="space-y-1 text-sm">
          <a href={dashboardHashFor(user.role)} onClick={onClose} className="block rounded-lg px-3 py-2 font-semibold hover:bg-softyellow">{t('auth.yourDashboard')}</a>
          {user.role === 'super-admin' ? <a href="#vendor-dashboard" onClick={onClose} className="block rounded-lg px-3 py-2 hover:bg-softyellow">{t('vendor.dashboard')}</a> : null}
          {user.role === 'super-admin' ? <a href="#member-dashboard" onClick={onClose} className="block rounded-lg px-3 py-2 hover:bg-softyellow">{t('member.dashboard')}</a> : null}
          <a href="#account-security" onClick={onClose} className="block rounded-lg px-3 py-2 hover:bg-softyellow">{t('auth.accountSecurity')}</a>
        </div>
        <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
          <button onClick={() => { void logout(); onClose(); }} className="flex w-full items-center gap-2 px-3 text-left text-sm font-semibold text-red-600 hover:text-red-700"><LogOut className="h-4 w-4" /> {t('auth.signOut')}</button>
          <button onClick={() => { void logoutAll(); onClose(); }} className="flex w-full items-center gap-2 px-3 text-left text-xs text-gray-500 hover:text-charcoal"><MonitorSmartphone className="h-3.5 w-3.5" /> {t('auth.signOutAll')}</button>
        </div>
      </div>
    );
  }

  const copy = panelCopy(t)[panel];

  return (
    <div className="absolute right-0 top-full z-50 mt-3 w-72 rounded-xl border border-gray-200 bg-white p-4 text-charcoal shadow-2xl ring-1 ring-charcoal/10">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <LogIn className="h-5 w-5 shrink-0 text-amber" />
          <div className="min-w-0">
            <p className="text-sm font-bold">{copy.title}</p>
            <p className="text-xs text-gray-500">{copy.subtitle}</p>
          </div>
        </div>
        <MenuCloseButton onClose={onClose} />
      </div>
      {panel === 'signin' ? <SignInForm onSwitch={setPanel} onDone={onClose} /> : null}
      {panel === 'signup' ? <SignUpForm onSwitch={setPanel} onDone={onClose} /> : null}
      {panel === 'forgot' ? <ForgotPasswordForm onSwitch={setPanel} /> : null}
    </div>
  );
}
