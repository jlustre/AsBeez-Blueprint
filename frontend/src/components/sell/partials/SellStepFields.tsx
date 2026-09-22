import { useTranslation } from '../../../i18n';
import { MARKETS } from '../../../lib/markets';
import type { PartnerApplication } from '../../../lib/partner';
import {
  categoryKeys,
  categoryLabel,
  parsePrice,
  type Offering,
  type SellFormState,
} from '../sellForm';
import { Field, UploadDrop, fieldClass } from './SellFields';

export function SellStepFields({
  currentStep,
  form,
  application,
  disabled,
  onChange,
  onUpload,
}: {
  currentStep: number;
  form: SellFormState;
  application: PartnerApplication | null;
  disabled: boolean;
  onChange: (patch: Partial<SellFormState>) => void;
  onUpload: (kind: string, files: FileList | null) => void;
}) {
  switch (currentStep) {
    case 1:
      return <PartnershipFields form={form} disabled={disabled} onChange={onChange} />;
    case 2:
      return <ProfileFields form={form} disabled={disabled} onChange={onChange} />;
    case 3:
      return <ContactFields form={form} disabled={disabled} onChange={onChange} />;
    case 4:
      return <BusinessFields form={form} disabled={disabled} onChange={onChange} />;
    case 5:
      return <ProductsServicesFields form={form} disabled={disabled} onChange={onChange} onUpload={onUpload} application={application} />;
    case 6:
      return <BrandFields form={form} disabled={disabled} onChange={onChange} onUpload={onUpload} application={application} />;
    case 7:
      return <OperationsFields form={form} disabled={disabled} onChange={onChange} />;
    case 8:
      return <PayoutFields form={form} disabled={disabled} onChange={onChange} />;
    case 9:
      return <TaxFields form={form} disabled={disabled} onChange={onChange} />;
    case 10:
      return <IdentityFields form={form} disabled={disabled} onChange={onChange} onUpload={onUpload} application={application} />;
    case 11:
      return <AgreementFields form={form} disabled={disabled} onChange={onChange} />;
    case 12:
      return <ReviewFields form={form} application={application} />;
    default:
      return null;
  }
}

/**
 * Which of the seven markets this store sells in.
 *
 * One market per application, not a multi-select: a store belongs to one
 * market, and a vendor who sells in two opens a second store. `stores` is a
 * hasMany on the owner, so nothing stops them.
 *
 * It no longer sets `offering` alongside itself. The two asked the same
 * question when both were products/services/both; now that this names a
 * market, the later step still has to ask what the store actually lists.
 */
function PartnershipFields({ form, disabled, onChange }: { form: SellFormState; disabled: boolean; onChange: (patch: Partial<SellFormState>) => void }) {
  const { t } = useTranslation();

  return (
    <fieldset disabled={disabled}>
      <legend className="text-sm font-semibold">{t('sell.partnershipLegend')} <span className="text-red-600">*</span></legend>
      <p className="mb-3 mt-1 text-sm text-slate-500">{t('sell.partnershipMarketHint')}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {MARKETS.map((market) => {
          const selected = form.partnershipType === market.slug;

          return (
            <label
              key={market.slug}
              className={`cursor-pointer rounded-xl border p-3 text-left transition hover:border-amber-300 hover:bg-amber-50/60 ${selected ? 'border-amber-400 bg-amber-50 ring-1 ring-amber-300' : 'border-slate-200'}`}
            >
              <input
                className="sr-only"
                type="radio"
                name="partnership"
                checked={selected}
                onChange={() => onChange({ partnershipType: market.slug })}
              />
              <span className={`block text-sm font-semibold ${selected ? 'text-amber-900' : 'text-slate-900'}`}>{t(market.name)}</span>
              <span className="mt-0.5 block text-xs leading-5 text-slate-500">{t(market.hint)}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function ProfileFields({ form, disabled, onChange }: { form: SellFormState; disabled: boolean; onChange: (patch: Partial<SellFormState>) => void }) {
  const { t } = useTranslation();

  return (
    <fieldset disabled={disabled} className="grid gap-5 sm:grid-cols-2">
      <Field label={t('sell.businessName')} required>
        <input className={fieldClass} value={form.businessName} onChange={(event) => onChange({ businessName: event.target.value })} />
      </Field>
      <Field label={t('sell.displayName')}>
        <input className={fieldClass} value={form.displayName} onChange={(event) => onChange({ displayName: event.target.value })} />
      </Field>
      <Field label={t('sell.tagline')}>
        <input className={fieldClass} value={form.tagline} onChange={(event) => onChange({ tagline: event.target.value })} />
      </Field>
      <Field label={t('sell.website')}>
        <input type="url" className={fieldClass} value={form.website} onChange={(event) => onChange({ website: event.target.value })} placeholder="https://" />
      </Field>
      <Field label={t('sell.profileCountry')} hint={t('sell.countryHint')}>
        <input className={fieldClass} maxLength={2} value={form.profileCountry} onChange={(event) => onChange({ profileCountry: event.target.value.toUpperCase() })} />
      </Field>
      <div className="sm:col-span-2">
        <Field label={t('sell.about')}>
          <textarea className={fieldClass} rows={4} value={form.about} onChange={(event) => onChange({ about: event.target.value })} />
        </Field>
      </div>
    </fieldset>
  );
}

function ContactFields({ form, disabled, onChange }: { form: SellFormState; disabled: boolean; onChange: (patch: Partial<SellFormState>) => void }) {
  const { t } = useTranslation();

  return (
    <fieldset disabled={disabled} className="grid gap-5 sm:grid-cols-2">
      <Field label={t('sell.contactName')} required>
        <input className={fieldClass} value={form.contactName} onChange={(event) => onChange({ contactName: event.target.value })} />
      </Field>
      <Field label={t('sell.contactEmail')} required>
        <input type="email" className={fieldClass} value={form.contactEmail} onChange={(event) => onChange({ contactEmail: event.target.value })} />
      </Field>
      <Field label={t('sell.contactPhone')}>
        <input className={fieldClass} value={form.contactPhone} onChange={(event) => onChange({ contactPhone: event.target.value })} />
      </Field>
      <Field label={t('sell.contactRole')}>
        <input className={fieldClass} value={form.contactRole} onChange={(event) => onChange({ contactRole: event.target.value })} />
      </Field>
    </fieldset>
  );
}

function BusinessFields({ form, disabled, onChange }: { form: SellFormState; disabled: boolean; onChange: (patch: Partial<SellFormState>) => void }) {
  const { t } = useTranslation();

  return (
    <fieldset disabled={disabled} className="grid gap-5 sm:grid-cols-2">
      <Field label={t('sell.legalName')} required>
        <input className={fieldClass} value={form.legalName} onChange={(event) => onChange({ legalName: event.target.value })} />
      </Field>
      <Field label={t('sell.entityType')} required>
        <select className={fieldClass} value={form.entityType} onChange={(event) => onChange({ entityType: event.target.value })}>
          <option value="">{t('sell.chooseOption')}</option>
          <option value="sole_proprietor">{t('sell.entitySole')}</option>
          <option value="llc">{t('sell.entityLlc')}</option>
          <option value="corporation">{t('sell.entityCorp')}</option>
          <option value="partnership">{t('sell.entityPartnership')}</option>
          <option value="nonprofit">{t('sell.entityNonprofit')}</option>
          <option value="other">{t('sell.entityOther')}</option>
        </select>
      </Field>
      <Field label={t('sell.registrationNumber')}>
        <input className={fieldClass} value={form.registrationNumber} onChange={(event) => onChange({ registrationNumber: event.target.value })} />
      </Field>
      <Field label={t('sell.yearEstablished')}>
        <input type="number" className={fieldClass} value={form.yearEstablished} onChange={(event) => onChange({ yearEstablished: event.target.value })} />
      </Field>
      <Field label={t('sell.addressLine')}>
        <input className={fieldClass} value={form.addressLine} onChange={(event) => onChange({ addressLine: event.target.value })} />
      </Field>
      <Field label={t('sell.city')} required>
        <input className={fieldClass} value={form.city} onChange={(event) => onChange({ city: event.target.value })} />
      </Field>
      <Field label={t('sell.state')}>
        <input className={fieldClass} value={form.state} onChange={(event) => onChange({ state: event.target.value })} />
      </Field>
      <Field label={t('sell.postalCode')}>
        <input className={fieldClass} value={form.postalCode} onChange={(event) => onChange({ postalCode: event.target.value })} />
      </Field>
      <Field label={t('sell.businessCountry')} required hint={t('sell.countryHint')}>
        <input className={fieldClass} maxLength={2} value={form.businessCountry} onChange={(event) => onChange({ businessCountry: event.target.value.toUpperCase() })} />
      </Field>
    </fieldset>
  );
}

function ProductsServicesFields({
  form,
  disabled,
  onChange,
  onUpload,
  application,
}: {
  form: SellFormState;
  disabled: boolean;
  onChange: (patch: Partial<SellFormState>) => void;
  onUpload: (kind: string, files: FileList | null) => void;
  application: PartnerApplication | null;
}) {
  const { t } = useTranslation();
  const showProducts = form.offering !== 'services';
  const showServices = form.offering !== 'products';
  const highPriceError = parsePrice(form.highPrice) > 250;
  const catalogNames = application?.files.filter((file) => file.kind === 'catalog').map((file) => file.name) ?? [];
  const serviceNames = application?.files.filter((file) => file.kind === 'service_listing').map((file) => file.name) ?? [];

  return (
    <fieldset disabled={disabled} className="space-y-7">
      <div>
        <legend className="mb-3 text-sm font-semibold">{t('sell.offerLegend')} <span className="text-red-600">*</span></legend>
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1">
          {(['products', 'services', 'both'] as Offering[]).map((value) => (
            <label key={value} className={`cursor-pointer rounded-lg px-3 py-2.5 text-center text-sm font-semibold hover:bg-white ${form.offering === value ? 'bg-white text-amber-800 shadow-sm ring-1 ring-amber-300' : ''}`}>
              <input className="sr-only" type="radio" name="offering" checked={form.offering === value} onChange={() => onChange({ offering: value })} />
              {t(value === 'products' ? 'sell.offerProducts' : value === 'services' ? 'sell.offerServices' : 'sell.offerBoth')}
            </label>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-900">
        <strong>{t('sell.verifyAlert')}</strong> {t('sell.verifyAlertCopy')}
      </div>
      <div>
        <p className="text-base font-bold text-slate-950">{t('sell.categoriesTitle')}</p>
        <p className="mt-1 text-sm text-slate-500">{t('sell.categoriesHint')}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {categoryKeys.map((id) => {
            const selected = form.categories.includes(id);

            return (
              <label key={id} className={`cursor-pointer rounded-full px-3 py-2 text-sm ${selected ? 'bg-amber-100 font-semibold text-amber-900 ring-1 ring-amber-400' : 'bg-white ring-1 ring-slate-300 hover:ring-amber-400'}`}>
                <input type="checkbox" checked={selected} onChange={() => onChange({ categories: selected ? form.categories.filter((item) => item !== id) : [...form.categories, id] })} className="mr-2 accent-amber-600" />
                {t(categoryLabel[id])}
              </label>
            );
          })}
        </div>
      </div>
      {showProducts ? (
        <section className="rounded-2xl border border-slate-200 p-5">
          <h3 className="text-lg font-bold">{t('sell.productTitle')}</h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label={t('sell.primaryProduct')} required hint={t('sell.publicOnStore')}>
              <select className={fieldClass} value={form.primaryProduct} onChange={(event) => onChange({ primaryProduct: event.target.value })}>
                <option value="">{t('sell.chooseOption')}</option>
                <option value="home">{t('sell.catHome')}</option>
                <option value="electronics">{t('sell.catElectronics')}</option>
                <option value="beauty">{t('sell.catBeauty')}</option>
                <option value="food">{t('sell.catFood')}</option>
              </select>
            </Field>
            <Field label={t('sell.productCount')}>
              <input type="number" min="0" value={form.productCount} onChange={(event) => onChange({ productCount: event.target.value })} className={fieldClass} />
            </Field>
            <Field label={t('sell.condition')}>
              <select className={fieldClass} value={form.condition} onChange={(event) => onChange({ condition: event.target.value })}>
                <option value="">{t('sell.chooseOption')}</option>
                <option value="new">{t('sell.conditionNew')}</option>
                <option value="refurbished">{t('sell.conditionRefurbished')}</option>
                <option value="used">{t('sell.conditionUsed')}</option>
              </select>
            </Field>
            <Field label={t('sell.avgProductPrice')}>
              <input type="text" value={form.avgProductPrice} onChange={(event) => onChange({ avgProductPrice: event.target.value })} className={fieldClass} />
            </Field>
            <Field label={t('sell.lowPrice')}>
              <input type="text" value={form.lowPrice} onChange={(event) => onChange({ lowPrice: event.target.value })} className={fieldClass} />
            </Field>
            <Field label={t('sell.highPrice')} error={highPriceError ? t('sell.highPriceError') : undefined}>
              <input type="text" value={form.highPrice} onChange={(event) => onChange({ highPrice: event.target.value })} className={`${fieldClass} ${highPriceError ? 'border-red-400 focus:ring-red-500' : ''}`} />
            </Field>
            <Field label={t('sell.inventory')}>
              <select className={fieldClass} value={form.inventory} onChange={(event) => onChange({ inventory: event.target.value })}>
                <option value="">{t('sell.chooseOption')}</option>
                <option value="own">{t('sell.inventoryOwn')}</option>
                <option value="made">{t('sell.inventoryMade')}</option>
                <option value="drop">{t('sell.inventoryDrop')}</option>
              </select>
            </Field>
            <Field label={t('sell.relationship')}>
              <select className={fieldClass} value={form.relationship} onChange={(event) => onChange({ relationship: event.target.value })}>
                <option value="">{t('sell.chooseOption')}</option>
                <option value="brand">{t('sell.relBrand')}</option>
                <option value="reseller">{t('sell.relReseller')}</option>
                <option value="distributor">{t('sell.relDistributor')}</option>
              </select>
            </Field>
            <Field label={t('sell.origin')}>
              <input type="text" value={form.origin} onChange={(event) => onChange({ origin: event.target.value })} className={fieldClass} />
            </Field>
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm font-medium">
              <input type="checkbox" checked={form.regulated} onChange={(event) => onChange({ regulated: event.target.checked })} className="h-4 w-4 accent-amber-600" />
              {t('sell.regulated')}
            </label>
          </div>
          <UploadDrop label={t('sell.uploadCatalog')} hint={t('sell.uploadCatalogHint')} accept=".pdf,.jpg,.jpeg,.png,.csv" multiple files={catalogNames} disabled={disabled} onFiles={(event) => onUpload('catalog', event.target.files)} />
        </section>
      ) : null}
      {showServices ? (
        <section className="rounded-2xl border border-slate-200 p-5">
          <h3 className="text-lg font-bold">{t('sell.serviceTitle')}</h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label={t('sell.primaryService')} required>
              <select className={fieldClass} value={form.primaryService} onChange={(event) => onChange({ primaryService: event.target.value })}>
                <option value="">{t('sell.chooseOption')}</option>
                <option value="homeServices">{t('sell.catHomeServices')}</option>
                <option value="pro">{t('sell.catPro')}</option>
                <option value="beauty">{t('sell.catBeauty')}</option>
                <option value="education">{t('sell.catEducation')}</option>
              </select>
            </Field>
            <Field label={t('sell.delivery')}>
              <select className={fieldClass} value={form.delivery} onChange={(event) => onChange({ delivery: event.target.value })}>
                <option value="">{t('sell.chooseOption')}</option>
                <option value="both">{t('sell.deliveryBoth')}</option>
                <option value="inPerson">{t('sell.deliveryInPerson')}</option>
                <option value="remote">{t('sell.deliveryRemote')}</option>
              </select>
            </Field>
            <Field label={t('sell.serviceArea')}>
              <input className={fieldClass} value={form.serviceArea} onChange={(event) => onChange({ serviceArea: event.target.value })} />
            </Field>
            <Field label={t('sell.duration')}>
              <select className={fieldClass} value={form.duration} onChange={(event) => onChange({ duration: event.target.value })}>
                <option value="">{t('sell.chooseOption')}</option>
                <option value="1-2">{t('sell.durationValue')}</option>
              </select>
            </Field>
            <Field label={t('sell.avgServicePrice')}>
              <input className={fieldClass} value={form.avgServicePrice} onChange={(event) => onChange({ avgServicePrice: event.target.value })} />
            </Field>
            <Field label={t('sell.teamSize')}>
              <input type="number" min="0" className={fieldClass} value={form.teamSize} onChange={(event) => onChange({ teamSize: event.target.value })} />
            </Field>
            <Field label={t('sell.licenses')} hint={t('sell.licensesHint')}>
              <input className={fieldClass} value={form.licenses} placeholder={t('sell.licensesPlaceholder')} onChange={(event) => onChange({ licenses: event.target.value })} />
            </Field>
            <Field label={t('sell.insurance')}>
              <select className={fieldClass} value={form.insurance} onChange={(event) => onChange({ insurance: event.target.value })}>
                <option value="">{t('sell.chooseOption')}</option>
                <option value="general">{t('sell.insGeneral')}</option>
                <option value="professional">{t('sell.insProfessional')}</option>
                <option value="none">{t('sell.insNone')}</option>
              </select>
            </Field>
          </div>
          <UploadDrop label={t('sell.uploadService')} hint={t('sell.uploadServiceHint')} accept=".pdf,.docx,.jpg,.jpeg,.png" files={serviceNames} disabled={disabled} onFiles={(event) => onUpload('service_listing', event.target.files)} />
        </section>
      ) : null}
    </fieldset>
  );
}

function BrandFields({ form, disabled, onChange, onUpload, application }: { form: SellFormState; disabled: boolean; onChange: (patch: Partial<SellFormState>) => void; onUpload: (kind: string, files: FileList | null) => void; application: PartnerApplication | null }) {
  const { t } = useTranslation();
  const logos = application?.files.filter((file) => file.kind === 'logo').map((file) => file.name) ?? [];

  return (
    <fieldset disabled={disabled} className="grid gap-5 sm:grid-cols-2">
      <Field label={t('sell.storeName')} required>
        <input className={fieldClass} value={form.storeName} onChange={(event) => onChange({ storeName: event.target.value })} />
      </Field>
      <Field label={t('sell.storeSlug')} hint={t('sell.storeSlugHint')}>
        <input className={fieldClass} value={form.storeSlug} onChange={(event) => onChange({ storeSlug: event.target.value })} />
      </Field>
      <Field label={t('sell.publicEmail')}>
        <input type="email" className={fieldClass} value={form.publicEmail} onChange={(event) => onChange({ publicEmail: event.target.value })} />
      </Field>
      <Field label={t('sell.publicPhone')}>
        <input className={fieldClass} value={form.publicPhone} onChange={(event) => onChange({ publicPhone: event.target.value })} />
      </Field>
      <div className="sm:col-span-2">
        <Field label={t('sell.brandStory')}>
          <textarea className={fieldClass} rows={4} value={form.brandStory} onChange={(event) => onChange({ brandStory: event.target.value })} />
        </Field>
        <UploadDrop label={t('sell.uploadLogo')} hint={t('sell.uploadLogoHint')} accept=".jpg,.jpeg,.png,.webp" files={logos} disabled={disabled} onFiles={(event) => onUpload('logo', event.target.files)} />
      </div>
    </fieldset>
  );
}

function OperationsFields({ form, disabled, onChange }: { form: SellFormState; disabled: boolean; onChange: (patch: Partial<SellFormState>) => void }) {
  const { t } = useTranslation();

  return (
    <fieldset disabled={disabled} className="grid gap-5 sm:grid-cols-2">
      <Field label={t('sell.fulfillment')} required>
        <select className={fieldClass} value={form.fulfillmentMethod} onChange={(event) => onChange({ fulfillmentMethod: event.target.value })}>
          <option value="">{t('sell.chooseOption')}</option>
          <option value="own_stock">{t('sell.fulfillOwn')}</option>
          <option value="made_to_order">{t('sell.fulfillMade')}</option>
          <option value="dropship">{t('sell.fulfillDrop')}</option>
          <option value="service_only">{t('sell.fulfillService')}</option>
        </select>
      </Field>
      <Field label={t('sell.shipsFrom')}>
        <input className={fieldClass} value={form.shipsFrom} onChange={(event) => onChange({ shipsFrom: event.target.value })} />
      </Field>
      <Field label={t('sell.handlingDays')}>
        <input type="number" min="0" className={fieldClass} value={form.handlingDays} onChange={(event) => onChange({ handlingDays: event.target.value })} />
      </Field>
      <Field label={t('sell.serviceRadius')}>
        <input type="number" min="0" className={fieldClass} value={form.serviceRadiusKm} onChange={(event) => onChange({ serviceRadiusKm: event.target.value })} />
      </Field>
      <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm font-medium sm:col-span-2">
        <input type="checkbox" checked={form.operatesRemotely} onChange={(event) => onChange({ operatesRemotely: event.target.checked })} className="h-4 w-4 accent-amber-600" />
        {t('sell.operatesRemotely')}
      </label>
    </fieldset>
  );
}

function PayoutFields({ form, disabled, onChange }: { form: SellFormState; disabled: boolean; onChange: (patch: Partial<SellFormState>) => void }) {
  const { t } = useTranslation();

  return (
    <fieldset disabled={disabled} className="grid gap-5 sm:grid-cols-2">
      <Field label={t('sell.payoutMethod')} required>
        <select className={fieldClass} value={form.payoutMethod} onChange={(event) => onChange({ payoutMethod: event.target.value })}>
          <option value="">{t('sell.chooseOption')}</option>
          <option value="bank">{t('sell.payoutBank')}</option>
          <option value="paypal">{t('sell.payoutPaypal')}</option>
          <option value="other">{t('sell.payoutOther')}</option>
        </select>
      </Field>
      <Field label={t('sell.payoutHolder')} required>
        <input className={fieldClass} value={form.payoutAccountHolder} onChange={(event) => onChange({ payoutAccountHolder: event.target.value })} />
      </Field>
      <Field label={t('sell.payoutCountry')} hint={t('sell.countryHint')}>
        <input className={fieldClass} maxLength={2} value={form.payoutCountry} onChange={(event) => onChange({ payoutCountry: event.target.value.toUpperCase() })} />
      </Field>
      <Field label={t('sell.payoutCurrency')}>
        <input className={fieldClass} maxLength={3} value={form.payoutCurrency} onChange={(event) => onChange({ payoutCurrency: event.target.value.toUpperCase() })} />
      </Field>
    </fieldset>
  );
}

function TaxFields({ form, disabled, onChange }: { form: SellFormState; disabled: boolean; onChange: (patch: Partial<SellFormState>) => void }) {
  const { t } = useTranslation();

  return (
    <fieldset disabled={disabled} className="grid gap-5 sm:grid-cols-2">
      <Field label={t('sell.taxRegistered')} required>
        <select className={fieldClass} value={form.taxRegistered === null ? '' : form.taxRegistered ? 'yes' : 'no'} onChange={(event) => onChange({ taxRegistered: event.target.value === '' ? null : event.target.value === 'yes' })}>
          <option value="">{t('sell.chooseOption')}</option>
          <option value="yes">{t('sell.yes')}</option>
          <option value="no">{t('sell.no')}</option>
        </select>
      </Field>
      <Field label={t('sell.taxCountry')} hint={t('sell.countryHint')}>
        <input className={fieldClass} maxLength={2} value={form.taxCountry} onChange={(event) => onChange({ taxCountry: event.target.value.toUpperCase() })} />
      </Field>
      {form.taxRegistered ? (
        <Field label={t('sell.taxId')} required>
          <input className={fieldClass} value={form.taxId} onChange={(event) => onChange({ taxId: event.target.value })} />
        </Field>
      ) : null}
    </fieldset>
  );
}

function IdentityFields({ form, disabled, onChange, onUpload, application }: { form: SellFormState; disabled: boolean; onChange: (patch: Partial<SellFormState>) => void; onUpload: (kind: string, files: FileList | null) => void; application: PartnerApplication | null }) {
  const { t } = useTranslation();
  const identity = application?.files.filter((file) => file.kind === 'identity' || file.kind === 'license').map((file) => file.name) ?? [];

  return (
    <fieldset disabled={disabled} className="grid gap-5 sm:grid-cols-2">
      <Field label={t('sell.identityType')} required>
        <select className={fieldClass} value={form.identityDocumentType} onChange={(event) => onChange({ identityDocumentType: event.target.value })}>
          <option value="">{t('sell.chooseOption')}</option>
          <option value="passport">{t('sell.idPassport')}</option>
          <option value="national_id">{t('sell.idNational')}</option>
          <option value="drivers_license">{t('sell.idDriver')}</option>
          <option value="business_license">{t('sell.idBusiness')}</option>
        </select>
      </Field>
      <Field label={t('sell.identityName')} required>
        <input className={fieldClass} value={form.identityFullName} onChange={(event) => onChange({ identityFullName: event.target.value })} />
      </Field>
      <div className="sm:col-span-2">
        <Field label={t('sell.licenses')} hint={t('sell.licensesHint')}>
          <input className={fieldClass} value={form.licenses} onChange={(event) => onChange({ licenses: event.target.value })} />
        </Field>
        <UploadDrop label={t('sell.uploadIdentity')} hint={t('sell.uploadIdentityHint')} accept=".pdf,.jpg,.jpeg,.png" files={identity} disabled={disabled} onFiles={(event) => onUpload('identity', event.target.files)} />
      </div>
    </fieldset>
  );
}

function AgreementFields({ form, disabled, onChange }: { form: SellFormState; disabled: boolean; onChange: (patch: Partial<SellFormState>) => void }) {
  const { t } = useTranslation();

  return (
    <fieldset disabled={disabled} className="space-y-4">
      <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm">
        <input type="checkbox" checked={form.acceptedTerms} onChange={(event) => onChange({ acceptedTerms: event.target.checked })} className="mt-1 h-4 w-4 accent-amber-600" />
        <span><strong>{t('sell.acceptTerms')}</strong> {t('sell.acceptTermsCopy')}</span>
      </label>
      <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm">
        <input type="checkbox" checked={form.acceptedPpa} onChange={(event) => onChange({ acceptedPpa: event.target.checked })} className="mt-1 h-4 w-4 accent-amber-600" />
        <span><strong>{t('sell.acceptPpa')}</strong> {t('sell.acceptPpaCopy')}</span>
      </label>
      <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm">
        <input type="checkbox" checked={form.acceptedSellerStandards} onChange={(event) => onChange({ acceptedSellerStandards: event.target.checked })} className="mt-1 h-4 w-4 accent-amber-600" />
        <span><strong>{t('sell.acceptStandards')}</strong> {t('sell.acceptStandardsCopy')}</span>
      </label>
    </fieldset>
  );
}

function ReviewFields({ form, application }: { form: SellFormState; application: PartnerApplication | null }) {
  const { t } = useTranslation();
  const rows = [
    [t('sell.businessName'), form.businessName],
    [t('sell.legalName'), form.legalName],
    [t('sell.storeName'), form.storeName],
    [t('sell.offerLegend'), form.offering],
    [t('sell.contactEmail'), form.contactEmail],
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">{t('sell.reviewIntro')}</p>
      <dl className="grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-slate-50 p-3">
            <dt className="text-xs text-slate-500">{label}</dt>
            <dd className="font-semibold">{value || t('sell.reviewMissing')}</dd>
          </div>
        ))}
      </dl>
      {application && !application.can_submit ? <p className="text-sm text-orange-800">{t('sell.reviewBlocked')}</p> : null}
    </div>
  );
}
