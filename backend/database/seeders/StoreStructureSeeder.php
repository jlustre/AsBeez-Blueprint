<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\NavLink;
use App\Models\PolicyType;
use App\Models\SettingDefinition;
use App\Models\SocialPlatform;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use InvalidArgumentException;

/**
 * Seeds the admin-curated STRUCTURE: the option lists a store chooses from.
 *
 * These rows were previously hard-coded arrays inside the React store-profile
 * page. Moving them here is the migration path — the admin screens edit these
 * same rows, so the page stops shipping its own content.
 *
 * Tones are stored as KEYS ('amber'), never as Tailwind class strings: the
 * scanner cannot see classes that live in the database, so the literals stay
 * in the frontend tone registry.
 *
 * Every write is keyed on a natural key so re-seeding refreshes rather than
 * duplicating, and so an admin's later edits to unrelated rows survive.
 */
class StoreStructureSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->seedCategories();
        $this->seedSocialPlatforms();
        $this->seedPolicyTypes();
        $this->seedSettingDefinitions();
        $this->seedNavLinks();
    }

    /**
     * The marketplace taxonomy, as a tree.
     *
     * The roots are the seven markets the homepage sells — Physical Products,
     * Digital Products, Professional Services, Real Estate, Automotive,
     * Insurance and Travel. Everything else hangs beneath one of them, so the
     * grid on /home is exactly seven cards without the page hard-coding them.
     *
     * One nested array rather than a root list plus a children map: a new
     * branch is a single edit where it belongs, and nothing caps the depth.
     * Sibling order in the array becomes `position`, so reordering is cut
     * and paste instead of renumbering every neighbour.
     *
     * Shape: [name, slug, tone] with an optional fourth element holding
     * children of the same shape.
     *
     * Slugs are the natural key every other seeder, demo fixture and test
     * addresses a category by, so treat them as append-only: renaming one
     * silently orphans those references. That is why a handful of display
     * names no longer read like their slug — 'health-beauty' is "Beauty and
     * Personal Care" and 'business-office' is "Office and School Supplies".
     * The name is what a shopper sees and is free to change; the slug is the
     * key and is not.
     *
     * Nothing here deletes: a slug dropped from this array leaves its row
     * behind, still parented where it last was. So a department that goes
     * away is re-homed rather than removed.
     */
    private const CATEGORY_TREE = [
        ['Physical Products', 'physical-products', 'amber', [
            ['Electronics and Computers', 'electronics', 'slate', [
                ['Computers & Accessories', 'computers-accessories', 'slate', [
                    ['Laptops', 'laptops', 'slate'],
                    ['Desktops', 'desktops', 'slate'],
                    ['Peripherals', 'peripherals', 'slate'],
                ]],
                ['Phones & Tablets', 'phones-tablets', 'blue'],
                ['Audio & Headphones', 'audio-headphones', 'indigo'],
                ['Cameras & Photography', 'cameras-photography', 'slate'],
                ['Smart Home', 'smart-home', 'sky'],
                ['Gaming', 'gaming', 'violet'],
            ]],
            ['Home, Furniture, and Appliances', 'home-living', 'amber', [
                ['Furniture', 'furniture', 'amber'],
                ['Appliances', 'home-appliances', 'slate'],
                ['Kitchen & Dining', 'kitchen-dining', 'amber'],
                ['Home Decor', 'home-decor', 'orange'],
                ['Bed & Bath', 'bed-bath', 'sky'],
                ['Storage & Organisation', 'storage-organisation', 'slate'],
                ['Cleaning Supplies', 'cleaning-supplies', 'sky'],
            ]],
            ['Fashion, Shoes, and Accessories', 'fashion-apparel', 'pink', [
                ['Women\'s Clothing', 'womens-clothing', 'pink'],
                ['Men\'s Clothing', 'mens-clothing', 'slate'],
                ['Footwear', 'footwear', 'slate'],
                ['Bags & Accessories', 'bags-accessories', 'pink'],
                ['Vintage & Secondhand', 'vintage-secondhand', 'rose'],
            ]],
            ['Beauty and Personal Care', 'health-beauty', 'rose', [
                ['Skincare', 'skincare', 'rose'],
                ['Hair Care', 'hair-care', 'rose'],
                ['Cosmetics', 'cosmetics', 'pink'],
                ['Fragrance', 'fragrance', 'violet'],
                ['Bath & Body', 'bath-body', 'sky'],
                ['Grooming & Shaving', 'grooming-shaving', 'slate'],
            ]],
            ['Health and Wellness Products', 'health-wellness', 'emerald', [
                ['Supplements', 'supplements', 'emerald'],
                ['Wellness & Fitness', 'wellness-fitness', 'emerald'],
                ['Medical Supplies', 'medical-supplies', 'sky'],
                ['First Aid', 'first-aid', 'red'],
            ]],
            ['Grocery and Specialty Food', 'food-beverage', 'amber', [
                ['Honey & Pantry', 'honey-pantry', 'amber', [
                    ['Raw Honey', 'raw-honey', 'amber'],
                    ['Jams & Preserves', 'jams-preserves', 'amber'],
                    ['Oils & Vinegars', 'oils-vinegars', 'amber'],
                ]],
                ['Prepared Food', 'prepared-food', 'orange', [
                    ['Baked Goods', 'baked-goods', 'orange'],
                    ['Meal Prep', 'meal-prep', 'orange'],
                ]],
                ['Coffee & Tea', 'coffee-tea', 'amber'],
                ['Beverages', 'beverages', 'amber'],
                ['Snacks & Confectionery', 'snacks-confectionery', 'orange'],
                ['Specialty Diet', 'specialty-diet', 'emerald'],
            ]],
            ['Baby, Kids, and Toys', 'toys-kids-baby', 'fuchsia', [
                ['Toys & Games', 'toys-games', 'fuchsia'],
                ['Baby Gear', 'baby-gear', 'pink'],
                ['Baby Feeding', 'baby-feeding', 'amber'],
                ['Kids\' Clothing', 'kids-clothing', 'pink'],
            ]],
            ['Sports and Outdoors', 'sports-outdoors', 'emerald', [
                ['Fitness Equipment', 'fitness-equipment', 'emerald'],
                ['Camping & Hiking', 'camping-hiking', 'emerald'],
                ['Cycling', 'cycling', 'sky'],
                ['Water Sports', 'water-sports', 'blue'],
                ['Team Sports', 'team-sports', 'orange'],
                ['Hunting & Fishing', 'hunting-fishing', 'slate'],
            ]],
            ['Tools, Hardware, and Industrial Supplies', 'tools-hardware', 'slate', [
                ['Workshop & Tools', 'workshop-tools', 'slate'],
                ['Hardware & Fasteners', 'hardware-fasteners', 'slate'],
                ['Building Materials', 'building-materials', 'orange'],
                ['Safety & Workwear', 'safety-workwear', 'red'],
                ['Industrial Supplies', 'industrial-supplies', 'slate'],
            ]],
            ['Office and School Supplies', 'business-office', 'blue', [
                ['Office Supplies', 'office-supplies', 'slate'],
                ['School Supplies', 'school-supplies', 'blue'],
                ['Stationery & Paper', 'stationery-paper', 'sky'],
                ['Printing & Signage', 'printing-signage', 'orange'],
            ]],
            ['Pet Supplies', 'pets', 'orange', [
                ['Pet Food & Treats', 'pet-food', 'orange'],
                ['Pet Accessories', 'pet-accessories', 'amber'],
                ['Pet Health & Care', 'pet-health-products', 'emerald'],
            ]],
            ['Arts, Crafts, and Handmade Goods', 'arts-crafts', 'rose', [
                ['Handmade Art', 'handmade-art', 'rose'],
                ['Craft Supplies', 'craft-supplies', 'amber'],
                ['Sewing & Textiles', 'sewing-textiles', 'violet'],
            ]],
            ['Jewelry and Watches', 'jewellery-watches', 'violet', [
                ['Fine Jewelry', 'fine-jewellery', 'violet'],
                ['Fashion Jewelry', 'fashion-jewellery', 'pink'],
                ['Watches', 'watches', 'slate'],
                ['Wedding & Engagement', 'wedding-engagement', 'rose'],
            ]],
            ['Books and Physical Media', 'books-media', 'indigo', [
                ['Books', 'books', 'indigo'],
                ['Music & Vinyl', 'music-vinyl', 'violet'],
                ['Film & Video', 'film-video', 'slate'],
                ['Magazines & Comics', 'magazines-comics', 'orange'],
            ]],
            ['Collectibles', 'collectibles-antiques', 'amber', [
                ['Antiques', 'antiques', 'amber'],
                ['Trading Cards', 'trading-cards', 'blue'],
                ['Coins & Stamps', 'coins-stamps', 'slate'],
                ['Memorabilia', 'memorabilia', 'fuchsia'],
            ]],
            ['Garden and Outdoor Living', 'garden-outdoor', 'emerald', [
                ['Plants & Seeds', 'plants-seeds', 'emerald'],
                ['Garden Tools', 'garden-tools', 'emerald'],
                ['Outdoor Furniture', 'outdoor-furniture', 'emerald'],
                ['Grills & Outdoor Cooking', 'outdoor-cooking', 'orange'],
            ]],
            ['Local Products and Gifts', 'local-products-gifts', 'amber', [
                ['Gift Sets & Hampers', 'gift-sets', 'amber'],
                ['Local Artisan Goods', 'local-artisan', 'rose'],
                ['Souvenirs & Keepsakes', 'souvenirs', 'fuchsia'],
                ['Seasonal & Holiday', 'seasonal-holiday', 'red'],
            ]],
            ['Wholesale and Business Supplies', 'wholesale-business-supplies', 'slate', [
                ['Wholesale & Bulk', 'wholesale-bulk', 'amber'],
                ['Business Equipment', 'business-equipment', 'slate'],
                ['Packaging & Shipping', 'packaging-shipping', 'orange'],
                ['Restaurant & Hospitality', 'restaurant-supplies', 'red'],
                ['Retail Fixtures', 'retail-fixtures', 'sky'],
            ]],
        ]],
        ['Digital Products', 'digital-products', 'violet', [
            ['E-books and Publications', 'digital-ebooks', 'sky', [
                ['Fiction & Non-fiction', 'ebooks-general', 'sky'],
                ['Guides & How-to', 'ebooks-guides', 'blue'],
                ['Magazines & Zines', 'ebooks-magazines', 'orange'],
                ['Comics & Graphic Novels', 'ebooks-comics', 'fuchsia'],
            ]],
            ['Online Courses and Training Materials', 'digital-courses', 'blue', [
                ['Video Courses', 'courses-video', 'blue'],
                ['Workbooks & Worksheets', 'courses-workbooks', 'sky'],
                ['Certification & Exam Prep', 'courses-certification', 'indigo'],
                ['Coaching Programmes', 'courses-coaching', 'emerald'],
            ]],
            ['Software and Applications', 'digital-software', 'indigo', [
                ['Desktop Software', 'software-desktop', 'indigo'],
                ['Mobile Apps', 'software-mobile', 'blue'],
                ['Plugins & Extensions', 'software-plugins', 'violet'],
                ['Scripts & Code', 'software-scripts', 'slate'],
                ['Web Apps & SaaS', 'software-saas', 'sky'],
            ]],
            ['Website Themes and Templates', 'digital-templates', 'violet', [
                ['Website Themes', 'templates-themes', 'violet'],
                ['Landing Pages', 'templates-landing', 'fuchsia'],
                ['Email Templates', 'templates-email', 'sky'],
                ['UI Kits & Components', 'templates-ui-kits', 'indigo'],
            ]],
            ['Graphics, Photos, Video, and Audio', 'digital-graphics', 'pink', [
                ['Stock Photography & Video', 'digital-media', 'slate'],
                ['Illustrations & Vectors', 'graphics-illustrations', 'pink'],
                ['Fonts & Typography', 'graphics-fonts', 'violet'],
                ['Icons & Logos', 'graphics-icons', 'blue'],
                ['Motion Graphics & Presets', 'graphics-motion', 'fuchsia'],
            ]],
            ['Documents, Forms, and Business Templates', 'digital-documents', 'slate', [
                ['Contracts & Legal Forms', 'documents-contracts', 'slate'],
                ['Spreadsheets & Calculators', 'documents-spreadsheets', 'emerald'],
                ['Presentations & Pitch Decks', 'documents-presentations', 'orange'],
                ['Resumes & Cover Letters', 'documents-resumes', 'blue'],
                ['Policies & Procedures', 'documents-policies', 'indigo'],
            ]],
            ['Music, Sound Effects, and Digital Media', 'digital-audio', 'fuchsia', [
                ['Music Tracks', 'audio-music', 'fuchsia'],
                ['Sound Effects', 'audio-sfx', 'orange'],
                ['Loops & Samples', 'audio-loops', 'violet'],
                ['Podcasts & Audiobooks', 'audio-spoken', 'amber'],
            ]],
            ['Memberships and Digital Subscriptions', 'digital-memberships', 'emerald', [
                ['Membership Sites', 'memberships-sites', 'emerald'],
                ['Paid Newsletters', 'memberships-newsletters', 'amber'],
                ['Communities & Groups', 'memberships-communities', 'sky'],
                ['Content Libraries', 'memberships-libraries', 'indigo'],
            ]],
            ['Licenses and Activation Keys', 'digital-licenses', 'red', [
                ['Software Licenses', 'licenses-software', 'indigo'],
                ['Game Keys', 'licenses-game-keys', 'red'],
                ['Gift Cards & Vouchers', 'licenses-gift-cards', 'amber'],
                ['Commercial Use Licenses', 'licenses-commercial', 'slate'],
            ]],
            ['Data, Research, and Reports', 'digital-data-reports', 'blue', [
                ['Market Research', 'data-market-research', 'blue'],
                ['Datasets', 'data-datasets', 'slate'],
                ['Industry Reports', 'data-industry-reports', 'indigo'],
                ['Whitepapers', 'data-whitepapers', 'sky'],
            ]],
            ['AI Prompts and Automation Assets', 'digital-ai-assets', 'violet', [
                ['Prompt Packs', 'ai-prompt-packs', 'violet'],
                ['Custom Assistants & Agents', 'ai-agents', 'indigo'],
                ['Automation Workflows', 'ai-workflows', 'sky'],
                ['Models & Training Data', 'ai-models', 'slate'],
            ]],
            ['Printable Products', 'digital-printables', 'amber', [
                ['Planners & Journals', 'printables-planners', 'amber'],
                ['Wall Art & Posters', 'printables-wall-art', 'rose'],
                ['Invitations & Cards', 'printables-invitations', 'pink'],
                ['Worksheets & Activities', 'printables-worksheets', 'blue'],
                ['Patterns & Cut Files', 'printables-patterns', 'emerald'],
            ]],
            ['Games and Digital Entertainment', 'digital-games', 'orange', [
                ['Indie Games', 'games-indie', 'orange'],
                ['Game Assets & Mods', 'games-assets', 'violet'],
                ['Tabletop & Print-and-Play', 'games-tabletop', 'amber'],
                ['Virtual Items & Skins', 'games-virtual-items', 'fuchsia'],
            ]],
        ]],
        ['Professional Services', 'professional-services', 'sky', [
            ['Business and Professional', 'professionals', 'slate', [
                ['Accounting and Bookkeeping', 'accounting-tax', 'blue'],
                ['Legal Services', 'legal-services', 'slate'],
                ['Business Consulting', 'consulting', 'indigo'],
                ['Marketing and Advertising', 'marketing-advertising', 'fuchsia'],
                ['Web and Software Development', 'web-development', 'indigo'],
                ['Graphic and Creative Design', 'design-audit', 'violet'],
                ['Writing, Translation, and Administrative Support', 'writing-translation', 'sky'],
                ['Human Resources and Recruiting', 'hr-recruiting', 'emerald'],
                ['IT Support and Cybersecurity', 'it-support', 'slate'],
            ]],
            ['Home and Local', 'local-services', 'sky', [
                ['Cleaning', 'home-cleaning', 'sky'],
                ['Handyman and Repairs', 'handyman-repairs', 'orange', [
                    ['Carpentry', 'carpentry', 'orange'],
                    ['Appliance Repair', 'appliance-repair', 'slate'],
                    ['Pest Control', 'pest-control', 'slate'],
                ]],
                ['Construction and Renovation', 'construction-renovation', 'amber'],
                ['Plumbing, Electrical, and HVAC', 'trades-repair', 'orange', [
                    ['Plumbing', 'plumbing', 'orange'],
                    ['Electrical', 'electrical', 'orange'],
                    ['Heating & Cooling', 'heating-cooling', 'orange'],
                ]],
                ['Landscaping and Gardening', 'lawn-landscaping', 'emerald'],
                ['Moving and Delivery', 'moving-delivery', 'sky'],
                ['Photography and Event Services', 'local-events', 'fuchsia', [
                    ['Event Photography', 'event-photography', 'fuchsia'],
                    ['Catering', 'event-catering', 'fuchsia'],
                    ['Venues & Rentals', 'event-rentals', 'fuchsia'],
                ]],
            ]],
            ['Personal and Lifestyle', 'services-personal', 'rose', [
                ['Beauty and Wellness Services', 'personal-care-services', 'rose', [
                    ['Hair & Barber', 'hair-barber', 'rose'],
                    ['Nails & Spa', 'nails-spa', 'pink'],
                    ['Massage & Therapy', 'massage-therapy', 'emerald'],
                ]],
                ['Fitness and Coaching', 'fitness-coaching', 'emerald'],
                ['Tutoring and Education', 'education-tutoring', 'blue', [
                    ['Academic Tutoring', 'academic-tutoring', 'blue'],
                    ['Music Lessons', 'music-lessons', 'violet'],
                    ['Language Lessons', 'language-lessons', 'sky'],
                ]],
                ['Child, Senior, and Pet Care', 'pet-services', 'orange', [
                    ['Childcare', 'childcare-services', 'rose'],
                    ['Senior Care', 'senior-care', 'sky'],
                    ['Pet Grooming', 'pet-grooming', 'rose'],
                    ['Veterinary & Pet Health', 'pet-veterinary', 'emerald'],
                    ['Pet Boarding & Sitting', 'pet-boarding', 'sky'],
                ]],
                ['Personal Assistance', 'personal-assistance', 'amber'],
                ['Event Planning', 'event-planning', 'fuchsia'],
            ]],
            ['Jobs', 'jobs', 'slate', [
                ['Job Listings', 'job-listings', 'slate'],
                ['Full-time', 'jobs-full-time', 'slate'],
                ['Part-time', 'jobs-part-time', 'slate'],
                ['Contract & Freelance', 'jobs-contract', 'indigo'],
                ['Internships', 'jobs-internships', 'sky'],
                ['Volunteer', 'jobs-volunteer', 'emerald'],
            ]],
            ['Community', 'community', 'emerald', [
                ['Community Listings', 'community-listings', 'emerald'],
                ['Classes & Workshops', 'community-classes', 'blue'],
                ['Local Groups', 'community-groups', 'sky'],
                ['Lost & Found', 'community-lost-found', 'amber'],
                ['Free & Giveaway', 'community-free', 'emerald'],
            ]],
        ]],
        ['Real Estate', 'real-estate', 'blue', [
            ['Residential Property for Sale', 'property-for-sale', 'blue', [
                ['Houses', 'property-houses', 'blue'],
                ['Apartments & Condos', 'property-condos', 'sky'],
                ['Townhouses', 'property-townhouses', 'indigo'],
                ['Multi-family', 'property-multi-family', 'slate'],
            ]],
            ['Commercial Property for Sale', 'property-commercial', 'slate', [
                ['Office Buildings', 'property-office-sale', 'slate'],
                ['Retail & Storefronts', 'property-retail-sale', 'orange'],
                ['Industrial & Warehouse', 'property-industrial-sale', 'slate'],
                ['Hospitality & Leisure', 'property-hospitality', 'fuchsia'],
            ]],
            ['New Developments', 'property-new-developments', 'violet', [
                ['Pre-construction', 'property-preconstruction', 'violet'],
                ['Show Homes & Model Units', 'property-show-homes', 'pink'],
                ['Master-planned Communities', 'property-communities', 'emerald'],
            ]],
            ['Land and Lots', 'property-land', 'emerald', [
                ['Residential Lots', 'property-residential-lots', 'emerald'],
                ['Commercial Land', 'property-commercial-land', 'slate'],
                ['Agricultural Land', 'property-agricultural-land', 'amber'],
                ['Recreational Land', 'property-recreational-land', 'sky'],
            ]],
            ['Residential Rentals', 'property-for-rent', 'sky', [
                ['Houses for Rent', 'property-house-rentals', 'sky'],
                ['Apartments for Rent', 'property-apartment-rentals', 'blue'],
                ['Rooms & Shared', 'property-rooms', 'indigo'],
                ['Short-term Rentals', 'property-short-term', 'orange'],
            ]],
            ['Commercial Leasing', 'property-commercial-lease', 'indigo', [
                ['Office Space', 'property-office-lease', 'indigo'],
                ['Retail Space', 'property-retail-lease', 'orange'],
                ['Industrial & Warehouse Space', 'property-industrial-lease', 'slate'],
                ['Coworking & Flexible Space', 'property-coworking', 'violet'],
            ]],
            ['Vacation and Investment Properties', 'property-vacation-investment', 'amber', [
                ['Vacation Homes', 'property-vacation-homes', 'amber'],
                ['Rental Investments', 'property-rental-investment', 'emerald'],
                ['Timeshares & Fractional', 'property-timeshare', 'sky'],
                ['Overseas Property', 'property-overseas', 'blue'],
            ]],
            ['Real Estate Agents and Brokers', 'property-agents', 'rose', [
                ['Buyer\'s Agents', 'property-buyer-agents', 'rose'],
                ['Listing Agents', 'property-listing-agents', 'pink'],
                ['Commercial Brokers', 'property-commercial-brokers', 'slate'],
                ['Brokerages', 'property-brokerages', 'violet'],
            ]],
            ['Mortgage and Financing Connections', 'property-mortgage', 'emerald', [
                ['Mortgage Brokers', 'property-mortgage-brokers', 'emerald'],
                ['Lenders', 'property-lenders', 'blue'],
                ['Refinancing', 'property-refinancing', 'sky'],
                ['Pre-approval', 'property-preapproval', 'indigo'],
            ]],
            ['Property Management', 'property-services', 'orange', [
                ['Residential Management', 'property-residential-management', 'orange'],
                ['Commercial Management', 'property-commercial-management', 'slate'],
                ['Tenant Placement', 'property-tenant-placement', 'sky'],
                ['Maintenance Coordination', 'property-maintenance', 'amber'],
            ]],
            ['Home Inspection', 'property-inspection', 'red', [
                ['Pre-purchase Inspection', 'property-prepurchase-inspection', 'red'],
                ['Specialty Inspection', 'property-specialty-inspection', 'orange'],
                ['Energy & Efficiency Audits', 'property-energy-audit', 'emerald'],
            ]],
            ['Appraisal and Valuation', 'property-appraisal', 'blue', [
                ['Residential Appraisal', 'property-residential-appraisal', 'blue'],
                ['Commercial Appraisal', 'property-commercial-appraisal', 'slate'],
                ['Market Analysis', 'property-market-analysis', 'indigo'],
            ]],
            ['Escrow, Title, and Closing Services', 'property-escrow-title', 'slate', [
                ['Escrow Services', 'property-escrow', 'slate'],
                ['Title Search & Insurance', 'property-title', 'indigo'],
                ['Closing & Settlement', 'property-closing', 'blue'],
                ['Notary Services', 'property-notary', 'sky'],
            ]],
            ['Real Estate Legal Services', 'property-legal', 'violet', [
                ['Conveyancing', 'property-conveyancing', 'violet'],
                ['Landlord & Tenant Law', 'property-landlord-tenant', 'sky'],
                ['Zoning & Land Use', 'property-zoning', 'emerald'],
                ['Property Disputes', 'property-disputes', 'red'],
            ]],
        ]],
        ['Automotive', 'automotive', 'red', [
            ['New Vehicles', 'vehicles-new', 'red', [
                ['Cars & Sedans', 'vehicles-new-cars', 'red'],
                ['SUVs & Crossovers', 'vehicles-new-suvs', 'slate'],
                ['Trucks & Pickups', 'vehicles-new-trucks', 'orange'],
                ['Electric & Hybrid', 'vehicles-new-electric', 'emerald'],
            ]],
            ['Used Vehicles', 'vehicles-for-sale', 'orange', [
                ['Cars & Sedans', 'vehicles-used-cars', 'orange'],
                ['SUVs & Crossovers', 'vehicles-used-suvs', 'slate'],
                ['Trucks & Pickups', 'vehicles-used-trucks', 'amber'],
                ['Vans & Minivans', 'vehicles-used-vans', 'sky'],
            ]],
            ['Certified Pre-Owned Vehicles', 'vehicles-certified', 'blue', [
                ['Manufacturer Certified', 'vehicles-cpo-manufacturer', 'blue'],
                ['Dealer Certified', 'vehicles-cpo-dealer', 'indigo'],
            ]],
            ['Private-Party Vehicles', 'vehicles-private-party', 'amber', [
                ['Owner Listings', 'vehicles-owner-listings', 'amber'],
                ['Project & Salvage', 'vehicles-project-salvage', 'slate'],
                ['Classic & Collector', 'vehicles-classic', 'rose'],
            ]],
            ['Motorcycles and Powersports', 'vehicles-motorcycles', 'violet', [
                ['Motorcycles', 'powersports-motorcycles', 'violet'],
                ['Scooters & Mopeds', 'powersports-scooters', 'sky'],
                ['ATVs & UTVs', 'powersports-atv', 'orange'],
                ['Snowmobiles & Watercraft', 'powersports-snow-water', 'blue'],
            ]],
            ['Recreational Vehicles', 'vehicles-recreational', 'emerald', [
                ['Motorhomes', 'rv-motorhomes', 'emerald'],
                ['Travel Trailers', 'rv-travel-trailers', 'amber'],
                ['Campers & Pop-ups', 'rv-campers', 'sky'],
            ]],
            ['Commercial Vehicles', 'vehicles-commercial', 'slate', [
                ['Box Trucks & Vans', 'commercial-box-trucks', 'slate'],
                ['Heavy Trucks', 'commercial-heavy-trucks', 'orange'],
                ['Trailers', 'commercial-trailers', 'amber'],
                ['Construction & Farm Equipment', 'commercial-equipment', 'emerald'],
            ]],
            ['Boats and Marine Vehicles', 'vehicles-marine', 'blue', [
                ['Powerboats', 'marine-powerboats', 'blue'],
                ['Sailboats', 'marine-sailboats', 'sky'],
                ['Personal Watercraft', 'marine-pwc', 'indigo'],
                ['Marine Parts & Trailers', 'marine-parts', 'slate'],
            ]],
            ['Vehicle Parts and Accessories', 'auto-parts', 'slate', [
                ['Tyres & Wheels', 'tyres-wheels', 'slate'],
                ['Engine & Drivetrain', 'auto-parts-engine', 'red'],
                ['Body & Exterior', 'auto-parts-body', 'orange'],
                ['Interior & Electronics', 'auto-parts-interior', 'indigo'],
                ['Performance & Tuning', 'auto-parts-performance', 'violet'],
            ]],
            ['Vehicle Inspections and History Reports', 'auto-inspections', 'indigo', [
                ['Pre-purchase Inspection', 'auto-prepurchase-inspection', 'indigo'],
                ['Vehicle History Reports', 'auto-history-reports', 'blue'],
                ['Emissions & Safety Testing', 'auto-emissions-testing', 'emerald'],
            ]],
            ['Auto Repair and Maintenance', 'auto-repair', 'orange', [
                ['General Repair', 'auto-general-repair', 'orange'],
                ['Scheduled Maintenance', 'auto-maintenance', 'amber'],
                ['Body & Collision', 'auto-body-collision', 'red'],
                ['Tyre & Wheel Service', 'auto-tyre-service', 'slate'],
                ['Mobile Mechanics', 'auto-mobile-mechanics', 'sky'],
            ]],
            ['Detailing and Car Care', 'auto-detailing', 'sky', [
                ['Interior Detailing', 'auto-detail-interior', 'sky'],
                ['Exterior & Paint Correction', 'auto-detail-exterior', 'blue'],
                ['Ceramic Coating & Wraps', 'auto-detail-coating', 'violet'],
                ['Car Wash', 'auto-car-wash', 'emerald'],
            ]],
            ['Towing and Roadside Assistance', 'auto-towing', 'red', [
                ['Towing', 'auto-tow-service', 'red'],
                ['Jump Start & Lockout', 'auto-jump-lockout', 'amber'],
                ['Tyre Change & Fuel Delivery', 'auto-roadside-tyre-fuel', 'orange'],
            ]],
            ['Vehicle Financing Connections', 'auto-financing', 'emerald', [
                ['Auto Loans', 'auto-loans', 'emerald'],
                ['Lease Deals', 'auto-leasing', 'blue'],
                ['Trade-in & Valuation', 'auto-trade-in', 'sky'],
            ]],
            ['Warranties and Protection Products', 'auto-warranties', 'violet', [
                ['Extended Warranty', 'auto-extended-warranty', 'violet'],
                ['Service Contracts', 'auto-service-contracts', 'indigo'],
                ['GAP & Protection Plans', 'auto-gap-protection', 'slate'],
            ]],
            ['Local Car Rentals', 'auto-rentals', 'fuchsia', [
                ['Daily & Weekly Rentals', 'auto-rental-daily', 'fuchsia'],
                ['Van & Truck Rentals', 'auto-rental-truck', 'slate'],
                ['Peer-to-peer Rentals', 'auto-rental-p2p', 'sky'],
                ['Luxury & Specialty', 'auto-rental-luxury', 'violet'],
            ]],
        ]],
        ['Insurance', 'insurance', 'indigo', [
            ['Life Insurance', 'insurance-life', 'indigo', [
                ['Term Life', 'insurance-term-life', 'indigo'],
                ['Whole Life', 'insurance-whole-life', 'blue'],
                ['Universal Life', 'insurance-universal-life', 'violet'],
                ['Final Expense', 'insurance-final-expense', 'slate'],
            ]],
            ['Health Insurance', 'insurance-health', 'emerald', [
                ['Individual & Family Plans', 'insurance-health-individual', 'emerald'],
                ['Short-term Medical', 'insurance-health-short-term', 'sky'],
                ['Dental & Vision', 'insurance-dental-vision', 'blue'],
                ['Critical Illness', 'insurance-critical-illness', 'red'],
            ]],
            ['Medicare Solutions', 'insurance-medicare', 'blue', [
                ['Medicare Advantage', 'insurance-medicare-advantage', 'blue'],
                ['Medicare Supplement', 'insurance-medicare-supplement', 'sky'],
                ['Part D Prescription', 'insurance-medicare-part-d', 'indigo'],
            ]],
            ['Disability Insurance', 'insurance-disability', 'orange', [
                ['Short-term Disability', 'insurance-disability-short', 'orange'],
                ['Long-term Disability', 'insurance-disability-long', 'amber'],
                ['Business Overhead', 'insurance-disability-business', 'slate'],
            ]],
            ['Long-Term Care Insurance', 'insurance-long-term-care', 'rose', [
                ['Traditional Long-Term Care', 'insurance-ltc-traditional', 'rose'],
                ['Hybrid Life & Long-Term Care', 'insurance-ltc-hybrid', 'violet'],
                ['Home Care Coverage', 'insurance-ltc-home-care', 'pink'],
            ]],
            ['Annuities', 'insurance-annuities', 'amber', [
                ['Fixed Annuities', 'insurance-annuity-fixed', 'amber'],
                ['Indexed Annuities', 'insurance-annuity-indexed', 'orange'],
                ['Variable Annuities', 'insurance-annuity-variable', 'violet'],
                ['Immediate Income', 'insurance-annuity-immediate', 'emerald'],
            ]],
            ['Auto Insurance', 'insurance-auto', 'red', [
                ['Personal Auto', 'insurance-auto-personal', 'red'],
                ['Motorcycle & Powersports', 'insurance-auto-motorcycle', 'violet'],
                ['Commercial Auto', 'insurance-auto-commercial', 'slate'],
                ['Classic & Collector', 'insurance-auto-classic', 'amber'],
            ]],
            ['Homeowners and Renters Insurance', 'insurance-property', 'blue', [
                ['Homeowners', 'insurance-homeowners', 'blue'],
                ['Renters', 'insurance-renters', 'sky'],
                ['Condo', 'insurance-condo', 'indigo'],
                ['Landlord & Rental Property', 'insurance-landlord', 'slate'],
                ['Flood & Disaster', 'insurance-flood', 'emerald'],
            ]],
            ['Travel Insurance', 'insurance-travel', 'sky', [
                ['Trip Cancellation', 'insurance-travel-cancellation', 'sky'],
                ['Travel Medical', 'insurance-travel-medical', 'emerald'],
                ['Annual Multi-trip', 'insurance-travel-annual', 'blue'],
            ]],
            ['Business and Commercial Insurance', 'insurance-business', 'slate', [
                ['General Liability', 'insurance-general-liability', 'slate'],
                ['Professional Liability', 'insurance-professional-liability', 'indigo'],
                ['Commercial Property', 'insurance-commercial-property', 'blue'],
                ['Workers\' Compensation', 'insurance-workers-comp', 'orange'],
                ['Cyber Liability', 'insurance-cyber', 'violet'],
            ]],
            ['Group and Employee Benefits', 'insurance-group-benefits', 'emerald', [
                ['Group Health', 'insurance-group-health', 'emerald'],
                ['Group Life & Disability', 'insurance-group-life', 'indigo'],
                ['Retirement Plans', 'insurance-group-retirement', 'amber'],
                ['Voluntary Benefits', 'insurance-voluntary-benefits', 'sky'],
            ]],
            ['Specialty Insurance', 'insurance-specialty', 'fuchsia', [
                ['Pet Insurance', 'insurance-pet', 'orange'],
                ['Event & Liability', 'insurance-event', 'fuchsia'],
                ['Marine & Boat', 'insurance-marine', 'blue'],
                ['Umbrella', 'insurance-umbrella', 'slate'],
                ['Identity Theft', 'insurance-identity-theft', 'red'],
            ]],
            ['Insurance Agents and Agencies', 'insurance-brokers', 'violet', [
                ['Independent Agents', 'insurance-independent-agents', 'violet'],
                ['Captive Agents', 'insurance-captive-agents', 'indigo'],
                ['Agencies & Brokerages', 'insurance-agencies', 'slate'],
                ['Benefits Consultants', 'insurance-benefits-consultants', 'emerald'],
            ]],
            ['Educational Resources and Needs Analysis', 'insurance-education', 'sky', [
                ['Coverage Guides', 'insurance-guides', 'sky'],
                ['Needs Analysis Tools', 'insurance-needs-analysis', 'blue'],
                ['Quote Comparison', 'insurance-quote-comparison', 'emerald'],
                ['Glossary & FAQs', 'insurance-glossary', 'slate'],
            ]],
        ]],
        ['Travel', 'travel', 'emerald', [
            ['Hotels and Resorts', 'travel-accommodation', 'amber', [
                ['Hotels', 'travel-hotels', 'amber'],
                ['Resorts', 'travel-resorts', 'orange'],
                ['Boutique & Design Hotels', 'travel-boutique-hotels', 'violet'],
                ['Hostels & Guesthouses', 'travel-hostels', 'emerald'],
                ['Bed & Breakfast', 'travel-bnb', 'rose'],
            ]],
            ['Vacation Rentals', 'travel-vacation-rentals', 'orange', [
                ['Holiday Homes', 'travel-holiday-homes', 'orange'],
                ['Apartments & Condos', 'travel-rental-apartments', 'sky'],
                ['Cabins & Chalets', 'travel-cabins', 'emerald'],
                ['Villas', 'travel-villas', 'amber'],
            ]],
            ['Flights', 'travel-flights', 'sky', [
                ['One-way & Return', 'travel-flights-standard', 'sky'],
                ['Multi-city', 'travel-flights-multi-city', 'blue'],
                ['Business & First Class', 'travel-flights-premium', 'violet'],
                ['Charter & Private', 'travel-flights-charter', 'slate'],
            ]],
            ['Car Rentals', 'travel-car-rental', 'slate', [
                ['Airport Pick-up', 'travel-car-airport', 'slate'],
                ['City Rentals', 'travel-car-city', 'blue'],
                ['Campervans & Motorhomes', 'travel-car-campervan', 'emerald'],
                ['Chauffeur & Private Hire', 'travel-car-chauffeur', 'violet'],
            ]],
            ['Cruises', 'travel-cruises', 'blue', [
                ['Ocean Cruises', 'travel-cruise-ocean', 'blue'],
                ['River Cruises', 'travel-cruise-river', 'sky'],
                ['Expedition & Adventure', 'travel-cruise-expedition', 'emerald'],
                ['Luxury Cruises', 'travel-cruise-luxury', 'violet'],
            ]],
            ['Tours and Activities', 'travel-tours', 'fuchsia', [
                ['Day Tours & Excursions', 'travel-day-tours', 'fuchsia'],
                ['Attractions & Tickets', 'travel-attractions', 'pink'],
                ['Adventure & Outdoor', 'travel-adventure', 'emerald'],
                ['Food & Cultural Experiences', 'travel-food-culture', 'amber'],
                ['Multi-day Guided Tours', 'travel-guided-tours', 'orange'],
            ]],
            ['Travel Packages', 'travel-packages', 'rose', [
                ['Flight + Hotel', 'travel-package-flight-hotel', 'rose'],
                ['All-inclusive', 'travel-package-all-inclusive', 'amber'],
                ['Honeymoon & Romance', 'travel-package-honeymoon', 'pink'],
                ['Family Packages', 'travel-package-family', 'sky'],
            ]],
            ['Airport Transfers', 'travel-transport', 'orange', [
                ['Private Transfers', 'travel-transfer-private', 'orange'],
                ['Shared Shuttles', 'travel-transfer-shuttle', 'amber'],
                ['Ride-hailing & Taxi', 'travel-transfer-taxi', 'slate'],
            ]],
            ['Rail and Bus Travel', 'travel-rail-bus', 'indigo', [
                ['Rail Tickets & Passes', 'travel-rail', 'indigo'],
                ['Intercity Coach', 'travel-coach', 'slate'],
                ['Scenic & Sleeper Rail', 'travel-scenic-rail', 'emerald'],
            ]],
            ['Travel Agents and Advisors', 'travel-agents', 'violet', [
                ['Leisure Travel Advisors', 'travel-advisors-leisure', 'violet'],
                ['Destination Specialists', 'travel-advisors-destination', 'fuchsia'],
                ['Luxury Travel Advisors', 'travel-advisors-luxury', 'amber'],
                ['Agencies', 'travel-agencies', 'slate'],
            ]],
            ['Corporate Travel', 'travel-corporate', 'slate', [
                ['Business Travel Booking', 'travel-corporate-booking', 'slate'],
                ['Travel Policy & Expense', 'travel-corporate-policy', 'indigo'],
                ['Meetings & Conferences', 'travel-corporate-mice', 'blue'],
            ]],
            ['Group Travel', 'travel-group', 'emerald', [
                ['Tour Groups', 'travel-group-tours', 'emerald'],
                ['School & Student Trips', 'travel-group-student', 'blue'],
                ['Weddings & Celebrations', 'travel-group-weddings', 'pink'],
                ['Faith & Affinity Groups', 'travel-group-affinity', 'sky'],
            ]],
            ['Travel Insurance', 'travel-protection', 'red', [
                ['Trip Protection', 'travel-protection-trip', 'red'],
                ['Medical & Evacuation', 'travel-protection-medical', 'emerald'],
                ['Baggage & Delay', 'travel-protection-baggage', 'amber'],
            ]],
            ['Visa and Travel Document Assistance', 'travel-documents', 'blue', [
                ['Visa Applications', 'travel-visa', 'blue'],
                ['Passport Services', 'travel-passport', 'indigo'],
                ['Travel Authorisation', 'travel-eta', 'sky'],
                ['Translation & Notarisation', 'travel-doc-translation', 'slate'],
            ]],
        ]],
    ];

    private function seedCategories(): void
    {
        $seen = [];
        $this->guardCategoryTree(self::CATEGORY_TREE, $seen);
        $this->writeCategories(self::CATEGORY_TREE, null);
    }

    /**
     * Refuses to seed a tree that would fail quietly.
     *
     * A mistyped tone falls back to grey in the frontend registry and a
     * repeated slug reparents a whole branch onto its twin — neither shows up
     * as an error, so both are caught here instead of in production.
     *
     * @param  array<int, array<int, mixed>>  $nodes
     * @param  array<string, true>  $seen
     */
    private function guardCategoryTree(array $nodes, array &$seen): void
    {
        foreach ($nodes as $node) {
            [, $slug, $tone] = $node;

            if (isset($seen[$slug])) {
                throw new InvalidArgumentException("Duplicate category slug [{$slug}].");
            }

            if (! in_array($tone, Category::TONES, true)) {
                throw new InvalidArgumentException("Unknown tone [{$tone}] on category [{$slug}].");
            }

            $seen[$slug] = true;

            $this->guardCategoryTree($node[3] ?? [], $seen);
        }
    }

    /**
     * @param  array<int, array<int, mixed>>  $nodes
     */
    private function writeCategories(array $nodes, ?int $parentId): void
    {
        foreach ($nodes as $position => $node) {
            [$name, $slug, $tone] = $node;

            $category = Category::updateOrCreate(
                ['slug' => $slug],
                ['name' => $name, 'tone' => $tone, 'position' => $position, 'is_active' => true, 'parent_id' => $parentId],
            );

            $this->writeCategories($node[3] ?? [], $category->id);
        }
    }

    private function seedSocialPlatforms(): void
    {
        $platforms = [
            ['facebook', 'Facebook', 'url', 'blue', 0,
                'M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z'],
            ['instagram', 'Instagram', 'url', 'pink', 1,
                'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z'],
            ['tiktok', 'TikTok', 'url', 'slate', 2,
                'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z'],
            ['youtube', 'YouTube', 'url', 'red', 3,
                'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'],
            ['linkedin', 'LinkedIn', 'url', 'sky', 4,
                'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z'],
            ['x', 'X (Twitter)', 'url', 'slate', 5,
                'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'],
            ['whatsapp', 'WhatsApp', 'tel', 'emerald', 6,
                'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.83 9.83 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413'],
            ['messenger', 'Messenger', 'text', 'blue', 7,
                'M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.191 14.963-3.055-3.26-5.963 3.26L10.732 8.1l3.131 3.26L19.752 8.1l-6.561 6.863z'],
            ['custom', 'Custom link', 'url', 'amber', 8, null],
        ];

        foreach ($platforms as [$key, $label, $type, $tone, $position, $path]) {
            SocialPlatform::updateOrCreate(
                ['key' => $key],
                [
                    'label' => $label,
                    'input_type' => $type,
                    'tone' => $tone,
                    'position' => $position,
                    'icon_path' => $path,
                    'icon' => $path ? null : 'ExternalLink',
                    'placeholder' => $key === 'custom' ? 'https://your-link-here.com' : null,
                    'is_active' => true,
                ],
            );
        }
    }

    private function seedPolicyTypes(): void
    {
        $types = [
            ['shipping', 'Shipping policy', 'Standard & express delivery details', 'Truck', 'sky', true, 0],
            ['return_refund', 'Return & refund policy', '30-day returns on unopened items', 'RotateCcw', 'amber', true, 1],
            ['cancellation', 'Cancellation policy', 'How and when orders can be cancelled', 'X', 'rose', false, 2],
            ['privacy', 'Privacy policy', 'How customer data is collected and stored', 'ShieldCheck', 'indigo', true, 3],
            ['terms_and_conditions', 'Terms and conditions', 'Store-specific terms of service', 'FileText', 'emerald', false, 4],
            ['warranty', 'Warranty policy', 'Product and service warranty terms', 'ShieldCheck', 'amber', false, 5],
            ['custom', 'Custom store policies', 'Additional policies unique to your business', 'SquarePen', 'amber', false, 6],
        ];

        foreach ($types as [$key, $label, $hint, $icon, $tone, $required, $position]) {
            PolicyType::updateOrCreate(
                ['key' => $key],
                ['label' => $label, 'hint' => $hint, 'icon' => $icon, 'tone' => $tone,
                    'is_required' => $required, 'position' => $position],
            );
        }
    }

    private function seedSettingDefinitions(): void
    {
        $definitions = [
            ['store_visibility', 'store', 'Store visibility', 'Allow customers to find your store in search and category pages.', 'bool', null, '1', 0],
            ['vacation_mode', 'store', 'Vacation mode', 'Pause new orders and bookings while you\'re away. Your listings stay visible.', 'bool', null, '0', 1],
            ['accept_new_orders', 'store', 'Accept new orders', 'Temporarily stop accepting new product orders without going on vacation.', 'bool', null, '1', 2],
            ['display_product_ratings', 'store', 'Display product ratings', 'Show star ratings on product and service cards.', 'bool', null, '1', 3],
            ['display_sales_count', 'store', 'Display sales count', 'Show how many times each listing has been purchased or booked.', 'bool', null, '0', 4],
            ['allow_customers_to_follow_the_store', 'store', 'Allow customers to follow the store', 'Grow an audience and notify followers when you publish new listings.', 'bool', null, '1', 5],
            ['enable_customer_questions', 'store', 'Enable customer questions', 'Allow shoppers to ask pre-purchase questions on your listings.', 'bool', null, '1', 6],
            ['show_social_links_publicly', 'social', 'Show social links publicly', 'Display your social profiles on your storefront.', 'bool', null, '1', 7],
            ['allow_customers_to_message_the_store', 'social', 'Allow customers to message the store', 'Enable the in-app messaging widget for buyers.', 'bool', null, '1', 8],
            ['display_customer_service_phone_number', 'social', 'Display customer-service phone number', 'Show your phone number on the storefront header.', 'bool', null, '0', 9],
            ['min_order_amount', 'commerce', 'Minimum order amount', 'Orders below this amount cannot be placed.', 'number', null, '15.00', 10],
            ['default_currency', 'commerce', 'Default currency', null, 'select', '[{"value": "USD", "label": "USD \u2014 US Dollar"}, {"value": "CAD", "label": "CAD \u2014 Canadian Dollar"}, {"value": "EUR", "label": "EUR \u2014 Euro"}, {"value": "GBP", "label": "GBP \u2014 British Pound"}]', 'USD', 11],
            ['default_language', 'commerce', 'Default language', null, 'select', '[{"value": "en", "label": "English"}, {"value": "es", "label": "Spanish"}, {"value": "fr", "label": "French"}]', 'en', 12],
            ['store_timezone', 'commerce', 'Store time zone', null, 'select', '[{"value": "America/Chicago", "label": "America/Chicago (CT)"}, {"value": "America/New_York", "label": "America/New_York (ET)"}, {"value": "America/Los_Angeles", "label": "America/Los_Angeles (PT)"}, {"value": "America/Denver", "label": "America/Denver (MT)"}]', 'America/Chicago', 13],
        ];

        foreach ($definitions as [$key, $group, $label, $hint, $type, $options, $default, $position]) {
            SettingDefinition::updateOrCreate(
                ['key' => $key],
                [
                    'group' => $group,
                    'label' => $label,
                    'hint' => $hint,
                    'type' => $type,
                    'options' => $options ? json_decode($options, true) : null,
                    'default_value' => (string) $default,
                    'position' => $position,
                ],
            );
        }
    }

    private function seedNavLinks(): void
    {
        $links = [
            ['Catalog', 'Products', '142 active', 'Package', 'amber', 0],
            ['Catalog', 'Add New Product', 'Create a listing', 'PackagePlus', 'emerald', 1],
            ['Catalog', 'Services', '94 bookable', 'LayoutGrid', 'sky', 2],
            ['Catalog', 'Categories', '24 total', 'Layers', 'indigo', 3],
            ['Catalog', 'Collections', '8 curated', 'Boxes', 'fuchsia', 4],
            ['Catalog', 'Inventory', '6 low stock', 'Boxes', 'orange', 5],
            ['Catalog', 'Returns & Refunds', '3 pending', 'RotateCcw', 'rose', 6],
            ['Catalog', 'Draft Orders', '5 saved', 'FileText', 'slate', 7],
            ['Sales', 'Orders', 'View all orders', 'ShoppingBag', 'emerald', 8],
            ['Sales', 'Bookings', '3 upcoming', 'CalendarDays', 'sky', 9],
            ['Sales', 'Delivery & Pickup', 'Manage options', 'Truck', 'amber', 10],
            ['Sales', 'Shipping Settings', 'Rates & zones', 'Store', 'blue', 11],
            ['Customers', 'Customers', '1,248 total', 'Users', 'sky', 12],
            ['Customers', 'Messages', 'Customer messages', 'MessageSquare', 'amber', 13],
            ['Customers', 'Product Questions', '4 unanswered', 'MessageSquare', 'violet', 14],
            ['Customers', 'Reviews', 'Awaiting reply', 'Star', 'amber', 15],
            ['Marketing', 'Coupons & Promotions', '3 active', 'Ticket', 'rose', 16],
            ['Marketing', 'Advertising', 'Campaigns', 'Megaphone', 'amber', 17],
            ['Analytics & Finance', 'Store Analytics', 'Traffic & conversions', 'ChartColumn', 'blue', 18],
            ['Analytics & Finance', 'Sales Reports', 'Download exports', 'FileSpreadsheet', 'indigo', 19],
            ['Analytics & Finance', 'Payouts', 'Next: Jun 15', 'Banknote', 'emerald', 20],
            ['Analytics & Finance', 'Billing', 'Plan & invoices', 'Receipt', 'slate', 21],
            ['Store Configuration', 'Custom Domain', 'Connect your brand', 'ExternalLink', 'amber', 22],
            ['Store Configuration', 'Store Appearance', 'Colors & layout', 'Palette', 'fuchsia', 23],
            ['Store Configuration', 'Payment Methods', 'Cards & wallets', 'CreditCard', 'blue', 24],
            ['Store Configuration', 'Tax Settings', 'Rates & exemptions', 'Percent', 'emerald', 25],
            ['Store Configuration', 'Business Verification', 'Verified', 'ShieldCheck', 'amber', 26],
            ['Store Configuration', 'Team Members', 'Permissions & roles', 'UserCog', 'violet', 27],
            ['Store Configuration', 'Notifications', 'Email & push', 'Bell', 'sky', 28],
            ['Store Configuration', 'Integrations', 'Apps & APIs', 'Blocks', 'indigo', 29],
            ['Account & Support', 'Help & Support', 'Docs & contact', 'LifeBuoy', 'slate', 30],
        ];

        foreach ($links as [$group, $label, $hint, $icon, $tone, $position]) {
            NavLink::updateOrCreate(
                ['group' => $group, 'label' => $label],
                [
                    'hint' => $hint,
                    'icon' => $icon,
                    'tone' => $tone,
                    'position' => $position,
                    'roles' => ['super-admin', 'vendor'],
                    'is_active' => true,
                ],
            );
        }
    }
}
