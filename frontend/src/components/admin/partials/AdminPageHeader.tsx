import type { ComponentType, ReactNode } from 'react';

import { useTranslation } from '../../../i18n';
import { ghostButton, primaryButton } from './styles';

type AdminPageHeaderProps = {
  title: string;
  intro: string;
  crumb: string;
  badge?: string;
  icon?: ComponentType<{ className?: string }>;
  actions?: ReactNode;
};

export function AdminPageHeader({ title, intro, crumb, badge, icon: Icon, actions }: AdminPageHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="space-y-5">
      <nav aria-label={title}>
        <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <li><a href="#admin-dashboard" className="rounded hover:text-amber-700">{t('admin.badge')}</a></li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-slate-800">{crumb}</li>
        </ol>
      </nav>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          {Icon ? (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-sm"><Icon className="h-6 w-6" /></span>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
                  <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">{intro}</p>
                </div>
              </div>
              {badge ? <p className="mt-3 inline-flex rounded-full border border-amber-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">{badge}</p> : null}
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
                {badge ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">{badge}</span> : null}
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{intro}</p>
            </>
          )}
        </div>
        {actions ? <div className="grid gap-2 sm:flex">{actions}</div> : null}
      </div>
    </header>
  );
}

export function AdminToolbarButton({
  icon: Icon,
  children,
  disabled = true,
  primary = false,
  onClick,
  title,
}: {
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
  disabled?: boolean;
  primary?: boolean;
  onClick?: () => void;
  title?: string;
}) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      disabled={disabled}
      title={title ?? (disabled ? t('admin.notYetAvailable') : undefined)}
      onClick={onClick}
      className={primary ? primaryButton : ghostButton}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}
