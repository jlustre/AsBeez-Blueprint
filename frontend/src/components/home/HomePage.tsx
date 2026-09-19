import { Header } from './Header';
import { Hero } from './Hero';
import { CategoryGrid, DealsRail, FeaturePanels, Recommendations, ServicesGrid } from './Cards';
import { Footer, HowItWorks, Newsletter, SellerBanner, TrustGrid } from './TrustSections';

export function HomePage() {
  return <div className="min-h-screen overflow-x-hidden bg-cream text-charcoal antialiased">
    <Header />
    <main>
      <Hero />
      <CategoryGrid />
      <FeaturePanels />
      <DealsRail />
      <ServicesGrid />
      <SellerBanner />
      <HowItWorks />
      <TrustGrid />
      <Recommendations />
      <Newsletter />
    </main>
    <Footer />
  </div>;
}
