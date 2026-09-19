<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\NavLink;
use App\Models\PolicyType;
use App\Models\SettingDefinition;
use App\Models\SocialPlatform;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

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

    private function seedCategories(): void
    {
        $categories = [
            ['Food & Beverage', 'food-beverage', 'amber', 0],
            ['Home & Living', 'home-living', 'amber', 1],
            ['Local Services', 'local-services', 'sky', 2],
            ['Fashion & Apparel', 'fashion-apparel', 'slate', 3],
            ['Electronics', 'electronics', 'slate', 4],
            ['Health & Beauty', 'health-beauty', 'slate', 5],
            ['Professionals', 'professionals', 'slate', 6],
            ['Jobs', 'jobs', 'slate', 7],
        ];

        foreach ($categories as [$name, $slug, $tone, $position]) {
            Category::updateOrCreate(
                ['slug' => $slug],
                ['name' => $name, 'tone' => $tone, 'position' => $position, 'is_active' => true],
            );
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
