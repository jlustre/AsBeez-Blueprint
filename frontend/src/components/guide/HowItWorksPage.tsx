import { useEffect, useState } from 'react';

import { useTranslation } from '../../i18n';
import { emptyHome, homeApi, type HomeCategory } from '../../lib/home';
import { EXAMPLE_NAME, MATRIX_SHARE, USA_RP_FOR_CELL, formatCount } from '../../lib/matrix';
import { Header } from '../home/Header';
import { Footer } from '../home/partials';
import {
  BenefitPair,
  ConversionGraphic,
  ExampleStory,
  FlywheelGraphic,
  GuideCallout,
  GuideCta,
  GuideHero,
  GuideList,
  GuideQuote,
  GuideSection,
  GuideSteps,
  GuideTable,
  GuideToc,
  LifecycleGlance,
  ManyCellsGraphic,
  MatrixCapacityTable,
  MatrixMathNote,
  MatrixPotentialCards,
  MatrixTreeChart,
  PlacementGraphic,
  ReferralMeter,
  ThresholdSplitTable,
  UnitCards,
} from './partials';

function sectionFromHash(): string {
  return window.location.hash.replace(/^#how-it-works\/?/, '');
}

export function HowItWorksPage() {
  const { t, locale } = useTranslation();
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [section, setSection] = useState(sectionFromHash);

  useEffect(() => {
    const onHashChange = () => setSection(sectionFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (!section) {
      return;
    }

    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [section]);

  useEffect(() => {
    let cancelled = false;

    homeApi.show()
      .then((payload) => {
        if (!cancelled) {
          setCategories(payload.categories);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCategories(emptyHome.categories);
        }
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-cream text-charcoal antialiased">
      <Header categories={categories} />
      <GuideHero />
      <main className="amazon-container py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <GuideToc />
          <div>
            <GuideCallout title={t('guide.designNoticeTitle')}>
              <p>{t('guide.designNotice')}</p>
            </GuideCallout>
            <div className="mt-6">
              <LifecycleGlance />
            </div>

            <GuideSection id="terms" eyebrow={t('guide.tocTerms')} title={t('guide.termsTitle')}>
              <GuideTable
                caption={t('guide.termsTableCaption')}
                headers={[t('guide.termsColTerm'), t('guide.termsColMeans')]}
                rows={[
                  [t('guide.termMember'), t('guide.termMemberMeans')],
                  [t('guide.termVendor'), t('guide.termVendorMeans')],
                  [t('guide.termPpf'), t('guide.termPpfMeans')],
                  [t('guide.termRp'), t('guide.termRpMeans')],
                  [t('guide.termAbc'), t('guide.termAbcMeans')],
                  [t('guide.termAhc'), t('guide.termAhcMeans')],
                  [t('guide.termMatrix'), t('guide.termMatrixMeans')],
                  [t('guide.termReferral'), t('guide.termReferralMeans')],
                  [t('guide.termHive'), t('guide.termHiveMeans')],
                ]}
              />
            </GuideSection>

            <GuideSection id="why" eyebrow={t('guide.tocWhy')} title={t('guide.whyTitle')}>
              <p>{t('guide.whyP1')}</p>
              <p>{t('guide.whyP2')}</p>
              <GuideQuote cite={t('guide.quoteFounderCite')}>{t('guide.quoteFounder')}</GuideQuote>
            </GuideSection>

            <GuideSection id="what" eyebrow={t('guide.tocWhat')} title={t('guide.whatTitle')}>
              <p>{t('guide.whatP1')}</p>
              <p>{t('guide.whatP2')}</p>
              <GuideList items={[t('guide.whatItem1'), t('guide.whatItem2'), t('guide.whatItem3'), t('guide.whatItem4'), t('guide.whatItem5')]} />
              <p>{t('guide.whatP3')}</p>
            </GuideSection>

            <GuideSection id="journey" eyebrow={t('guide.tocJourney')} title={t('guide.journeyTitle')}>
              <p>{t('guide.journeyP1')}</p>
              <GuideSteps steps={[
                { title: t('guide.journeyStep1'), copy: t('guide.journeyStep1Copy') },
                { title: t('guide.journeyStep2'), copy: t('guide.journeyStep2Copy') },
                { title: t('guide.journeyStep3'), copy: t('guide.journeyStep3Copy') },
                { title: t('guide.journeyStep4'), copy: t('guide.journeyStep4Copy') },
                { title: t('guide.journeyStep5'), copy: t('guide.journeyStep5Copy') },
              ]} />
              <p>{t('guide.journeyP2')}</p>
              <GuideTable
                caption={t('guide.journeyTableCaption')}
                headers={[t('guide.journeyColStage'), t('guide.journeyColWho'), t('guide.journeyColCan')]}
                rows={[
                  [t('guide.journeyRow1Stage'), t('guide.journeyRow1Who'), t('guide.journeyRow1Can')],
                  [t('guide.journeyRow2Stage'), t('guide.journeyRow2Who'), t('guide.journeyRow2Can')],
                  [t('guide.journeyRow3Stage'), t('guide.journeyRow3Who'), t('guide.journeyRow3Can')],
                  [t('guide.journeyRow4Stage'), t('guide.journeyRow4Who'), t('guide.journeyRow4Can')],
                ]}
              />
            </GuideSection>

            <div className="py-8">
              <BenefitPair />
            </div>

            <GuideSection id="members" eyebrow={t('guide.tocMembers')} title={t('guide.membersTitle')}>
              <p>{t('guide.membersP1')}</p>
              <GuideList items={[t('guide.membersItem1'), t('guide.membersItem2'), t('guide.membersItem3'), t('guide.membersItem4'), t('guide.membersItem5'), t('guide.membersItem6')]} />
              <p>{t('guide.membersP2')}</p>
            </GuideSection>

            <GuideSection id="vendors" eyebrow={t('guide.tocVendors')} title={t('guide.vendorsTitle')}>
              <p>{t('guide.vendorsP1')}</p>
              <GuideList items={[t('guide.vendorsItem1'), t('guide.vendorsItem2'), t('guide.vendorsItem3'), t('guide.vendorsItem4'), t('guide.vendorsItem5'), t('guide.vendorsItem6')]} />
              <p>{t('guide.vendorsP2')}</p>
              <p>{t('guide.vendorsCommission')}</p>
              <p>{t('guide.vendorsP3')}</p>
            </GuideSection>

            <GuideSection id="cells" eyebrow={t('guide.tocCells')} title={t('guide.cellsTitle')}>
              <p>{t('guide.cellsP1')}</p>
              <p>{t('guide.cellsP2')}</p>
              <GuideList items={[t('guide.cellsItem1'), t('guide.cellsItem2'), t('guide.cellsItem3'), t('guide.cellsItem4'), t('guide.cellsItem5')]} />
              <p>{t('guide.cellsP3')}</p>
              <GuideTable
                caption={t('guide.cellsTableCaption')}
                headers={[t('guide.cellsColCountry'), t('guide.cellsColRp')]}
                rows={[
                  [t('guide.cellsUsa'), t('guide.cellsUsaRp')],
                  [t('guide.cellsCanada'), t('guide.cellsCanadaRp')],
                  [t('guide.cellsPh'), t('guide.cellsPhRp')],
                  [t('guide.cellsSg'), t('guide.cellsSgRp')],
                ]}
              />
              <p>{t('guide.cellsP4')}</p>
              <GuideCallout title={t('guide.cellsNotTitle')}>
                <p>{t('guide.cellsNot')}</p>
              </GuideCallout>
            </GuideSection>

            <GuideSection id="rewards" eyebrow={t('guide.tocRewards')} title={t('guide.rewardsTitle')}>
              <p>{t('guide.rewardsP1')}</p>
              <GuideQuote cite={t('guide.quoteCommerceCite')}>{t('guide.quoteCommerce')}</GuideQuote>
              <p>{t('guide.rewardsP2')}</p>
              <p>{t('guide.rewardsCommission')}</p>
              <UnitCards />
              <GuideList items={[t('guide.rewardsItem1'), t('guide.rewardsItem2'), t('guide.rewardsItem3'), t('guide.rewardsItem4')]} />
              <p>{t('guide.rewardsP3')}</p>
              <p>{t('guide.rewardsP4')}</p>
              <GuideTable
                caption={t('guide.rewardsTableCaption')}
                headers={[t('guide.rewardsColUnit'), t('guide.rewardsColMeans')]}
                rows={[
                  [t('guide.rewardsRpName'), t('guide.rewardsRpMeans')],
                  [t('guide.rewardsAbcName'), t('guide.rewardsAbcMeans')],
                  [t('guide.rewardsAhcName'), t('guide.rewardsAhcMeans')],
                ]}
              />
              <p>{t('guide.rewardsP5')}</p>
              <p>{t('guide.splitP1')}</p>
              <ThresholdSplitTable locale={locale} />
              <p>{t('guide.splitP2')}</p>
              <ConversionGraphic />
            </GuideSection>

            <GuideSection id="example" eyebrow={t('guide.tocExample')} title={t('guide.exampleTitle', { name: EXAMPLE_NAME })}>
              <p>{t('guide.exampleP1', { name: EXAMPLE_NAME, matrix: Math.round(MATRIX_SHARE * 100), points: formatCount(USA_RP_FOR_CELL, locale) })}</p>
              <GuideCallout title={t('guide.exampleNoticeTitle')}>
                <p>{t('guide.exampleNotice')}</p>
              </GuideCallout>
              <ExampleStory locale={locale} />
              <p>{t('guide.exampleP2', { name: EXAMPLE_NAME })}</p>
            </GuideSection>

            <GuideSection id="matrix" eyebrow={t('guide.tocMatrix')} title={t('guide.matrixTitle')}>
              <p>{t('guide.matrixP1')}</p>
              <GuideQuote cite={t('guide.quoteMatrixCite')}>{t('guide.quoteMatrix')}</GuideQuote>
              <p>{t('guide.matrixShape')}</p>
              <MatrixTreeChart />
              <p>{t('guide.matrixP2')}</p>
              <GuideList items={[t('guide.matrixItem1'), t('guide.matrixItem2'), t('guide.matrixItem3'), t('guide.matrixItem4'), t('guide.matrixItem5'), t('guide.matrixItem6')]} />
              <GuideCallout title={t('guide.matrixPlaceTitle')}>
                <p>{t('guide.matrixPlaceP')}</p>
              </GuideCallout>
              <PlacementGraphic />
              <p>{t('guide.matrixP3')}</p>
              <p>{t('guide.matrixTableIntro', { matrix: Math.round(MATRIX_SHARE * 100) })}</p>
              <MatrixCapacityTable locale={locale} />
              <MatrixMathNote locale={locale} />
            </GuideSection>

            <GuideSection id="referrals" eyebrow={t('guide.tocReferrals')} title={t('guide.referralsTitle')}>
              <p>{t('guide.referralsP1')}</p>
              <p>{t('guide.referralsP2')}</p>
              <ReferralMeter />
              <GuideTable
                caption={t('guide.referralsTableCaption')}
                headers={[t('guide.referralsColCount'), t('guide.referralsColLevels')]}
                rows={[
                  [t('guide.referralsRow0'), t('guide.referralsRow0Levels')],
                  [t('guide.referralsRow3'), t('guide.referralsRow3Levels')],
                  [t('guide.referralsRow6'), t('guide.referralsRow6Levels')],
                  [t('guide.referralsRow9'), t('guide.referralsRow9Levels')],
                ]}
              />
              <p>{t('guide.referralsP3')}</p>
            </GuideSection>

            <GuideSection id="potential" eyebrow={t('guide.tocPotential')} title={t('guide.potentialTitle')}>
              <GuideCallout title={t('guide.oneAbcTitle')}>
                <p>{t('guide.oneAbcCopy')}</p>
              </GuideCallout>
              <p>{t('guide.potentialP1')}</p>
              <GuideCallout title={t('guide.potentialNoticeTitle')}>
                <p>{t('guide.potentialNotice')}</p>
              </GuideCallout>
              <p>{t('guide.potentialP2')}</p>
              <MatrixPotentialCards locale={locale} />
              <ManyCellsGraphic />
              <p>{t('guide.manyAbcP1')}</p>
              <GuideList items={[t('guide.manyAbcItem1'), t('guide.manyAbcItem2'), t('guide.manyAbcItem3'), t('guide.manyAbcItem4')]} />
              <GuideCallout title={t('guide.othersBuyTitle')}>
                <p>{t('guide.othersBuyP1')}</p>
              </GuideCallout>
              <p>{t('guide.potentialP3')}</p>
              <GuideList items={[t('guide.potentialItem1'), t('guide.potentialItem2'), t('guide.potentialItem3'), t('guide.potentialItem4')]} />
              <p>{t('guide.potentialP4')}</p>
            </GuideSection>

            <GuideSection id="hive" eyebrow={t('guide.tocHive')} title={t('guide.hiveTitle')}>
              <p>{t('guide.hiveP1')}</p>
              <p>{t('guide.hiveP2')}</p>
              <FlywheelGraphic />
              <GuideList items={[t('guide.hiveItem1'), t('guide.hiveItem2'), t('guide.hiveItem3'), t('guide.hiveItem4')]} />
              <p>{t('guide.hiveP3')}</p>
            </GuideSection>

            <GuideSection id="expectations" eyebrow={t('guide.tocHonest')} title={t('guide.honestTitle')}>
              <p>{t('guide.honestP1')}</p>
              <GuideList items={[t('guide.honestItem1'), t('guide.honestItem2'), t('guide.honestItem3'), t('guide.honestItem4'), t('guide.honestItem5'), t('guide.honestItem6')]} />
              <p>{t('guide.honestP2')}</p>
            </GuideSection>
          </div>
        </div>
      </main>
      <GuideCta />
      <Footer />
    </div>
  );
}
