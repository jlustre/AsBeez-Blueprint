<?php

namespace Database\Seeders;

use App\Models\NavLink;
use App\Models\NotificationChannel;
use App\Models\NotificationTopic;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * Admin-curated structure for the member side: the notification matrix, and the
 * "Manage Your Account" navigation.
 *
 * Same split as the store structure — these rows define what a member may
 * choose from; the member's own answers live in their preference rows.
 */
class MemberStructureSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->seedChannels();
        $this->seedTopics();
        $this->seedNavLinks();

        $this->command?->info(sprintf(
            'Member structure: %d channels, %d topics, %d account links.',
            NotificationChannel::count(),
            NotificationTopic::count(),
            NavLink::where('context', 'member')->count(),
        ));
    }

    private function seedChannels(): void
    {
        // `requires` names the contact detail a channel needs; the API refuses
        // to switch on a channel the member has no address for.
        $channels = [
            ['email', 'Email', 'email', 0],
            ['sms', 'SMS', 'phone', 1],
            ['push', 'Push', null, 2],
            ['in_app', 'In-app', null, 3],
        ];

        foreach ($channels as [$key, $label, $requires, $position]) {
            NotificationChannel::updateOrCreate(
                ['key' => $key],
                ['label' => $label, 'requires' => $requires, 'position' => $position, 'is_active' => true],
            );
        }
    }

    private function seedTopics(): void
    {
        // [key, label, group, mandatory, default channels]
        $topics = [
            ['order_updates', 'Order updates', 'orders', true, ['email', 'sms', 'push', 'in_app']],
            ['delivery_notifications', 'Delivery notifications', 'orders', false, ['email', 'sms', 'push', 'in_app']],
            ['direct_messages', 'Direct messages', 'community', false, ['email', 'push', 'in_app']],
            ['question_replies', 'Product-question replies', 'community', false, ['email', 'push', 'in_app']],
            ['review_reminders', 'Review reminders', 'community', false, ['email', 'in_app']],
            ['store_updates', 'Followed-store updates', 'marketplace', false, ['email', 'push', 'in_app']],
            ['price_alerts', 'Price-drop and restock alerts', 'marketplace', false, ['email', 'push', 'in_app']],
            ['promotions', 'Coupons and promotions', 'marketing', false, ['email', 'in_app']],
            ['announcements', 'AsBeez announcements', 'marketing', false, ['email', 'in_app']],
            ['reward_updates', 'Referral and reward updates', 'rewards', false, ['email', 'push', 'in_app']],
            ['security_alerts', 'Security and sign-in alerts', 'security', true, ['email', 'push', 'in_app']],
        ];

        foreach ($topics as $position => [$key, $label, $group, $mandatory, $defaults]) {
            NotificationTopic::updateOrCreate(
                ['key' => $key],
                [
                    'label' => $label,
                    'group' => $group,
                    'is_mandatory' => $mandatory,
                    'default_channels' => $defaults,
                    'position' => $position,
                    'is_active' => true,
                ],
            );
        }
    }

    /**
     * The "Manage Your Account" grid, in the shared nav_links registry with a
     * member context so it never mixes with the vendor's store links.
     */
    private function seedNavLinks(): void
    {
        $groups = [
            'Profile and preferences' => [
                ['Profile Overview', 'View your membership summary.', 'UserCog', 'amber', '#member-profile'],
                ['Personal Information', 'Update your personal details.', 'UserCog', 'sky', '#member-profile'],
                ['Public Profile', 'Control your marketplace identity.', 'Star', 'violet', '#member-profile'],
                ['Interests and Preferences', 'Personalize recommendations.', 'Layers', 'fuchsia', '#member-profile'],
                ['Appearance', 'Theme and display settings.', 'Palette', 'indigo', '#'],
                ['Accessibility', 'Adjust your experience.', 'CircleHelp', 'slate', '#'],
                ['Language and Region', 'Language, currency, and time zone.', 'ExternalLink', 'emerald', '#'],
            ],
            'Shopping' => [
                ['Orders', 'Track all purchases.', 'ShoppingBag', 'emerald', '#'],
                ['Open Orders', 'Track active orders.', 'Package', 'amber', '#'],
                ['Order History', 'Review completed purchases.', 'Receipt', 'slate', '#'],
                ['Returns and Refunds', 'Manage return requests.', 'RotateCcw', 'rose', '#'],
                ['Cancellations', 'Review cancelled orders.', 'X', 'rose', '#'],
                ['Reorder Items', 'Buy previous items again.', 'PackagePlus', 'sky', '#'],
                ['Saved Carts', 'Return to saved shopping carts.', 'ShoppingBag', 'violet', '#'],
                ['Recently Viewed', 'Revisit products and services.', 'Clock', 'slate', '#'],
                ['Downloadable Purchases', 'Access digital products.', 'FileText', 'indigo', '#'],
                ['Service Bookings', 'Manage appointments.', 'CalendarDays', 'blue', '#'],
            ],
            'Saved items' => [
                ['Wishlist', 'View saved items.', 'Star', 'amber', '#'],
                ['Favorite Products', 'Browse favorite products.', 'Package', 'rose', '#'],
                ['Followed Stores', 'View your favorite vendors.', 'Store', 'emerald', '#'],
                ['Saved Searches', 'Run saved marketplace searches.', 'Layers', 'sky', '#'],
                ['Price-Drop Alerts', 'Manage price notifications.', 'Ticket', 'orange', '#'],
                ['Restock Alerts', 'Track unavailable items.', 'Bell', 'violet', '#'],
                ['Product Comparisons', 'Compare saved products.', 'ChartColumn', 'slate', '#'],
            ],
            'Communication' => [
                ['Messages', 'View all conversations.', 'MessageSquare', 'sky', '#'],
                ['Unread Messages', 'Read new messages.', 'MessageSquare', 'amber', '#'],
                ['Product Questions', 'Manage questions and replies.', 'CircleHelp', 'violet', '#'],
                ['Support Tickets', 'Track support requests.', 'LifeBuoy', 'rose', '#'],
                ['Notification Preferences', 'Choose communication channels.', 'Bell', 'emerald', '#communication'],
            ],
            'Reviews and community' => [
                ['My Reviews', 'View published feedback.', 'Star', 'amber', '#'],
                ['Pending Reviews', 'Review recent purchases.', 'SquarePen', 'orange', '#'],
                ['Questions and Answers', 'View community contributions.', 'CircleHelp', 'sky', '#'],
                ['Following', 'Profiles you follow.', 'Users', 'violet', '#'],
                ['Followers', 'Members following you.', 'Users', 'fuchsia', '#'],
                ['Community Guidelines', 'Read the marketplace rules.', 'FileText', 'slate', '#'],
                ['Report a Problem', 'Flag content or behaviour.', 'ShieldCheck', 'rose', '#'],
            ],
            'Payments and financial activity' => [
                ['Payment Methods', 'Manage cards and wallets.', 'CreditCard', 'blue', '#'],
                ['Wallet', 'View your balance.', 'Banknote', 'emerald', '#'],
                ['Gift Cards', 'Redeem and track gift cards.', 'Ticket', 'fuchsia', '#'],
                ['Store Credits', 'View available credits.', 'Percent', 'amber', '#'],
                ['Transactions', 'Review payment history.', 'Receipt', 'slate', '#'],
                ['Invoices', 'Download purchase invoices.', 'FileSpreadsheet', 'indigo', '#'],
                ['Billing Address', 'Manage billing details.', 'Layers', 'sky', '#'],
                ['Tax Information', 'Manage tax details.', 'Percent', 'violet', '#'],
            ],
            'Rewards and referrals' => [
                ['Rewards', 'View available rewards.', 'Star', 'amber', '#'],
                ['Redeem Points', 'Spend your points.', 'Ticket', 'emerald', '#'],
                ['Coupons', 'View your coupons.', 'Ticket', 'rose', '#'],
                ['Refer a Friend', 'Share your referral code.', 'Users', 'sky', '#'],
                ['Referral History', 'Track your referrals.', 'ChartColumn', 'violet', '#'],
                ['Membership Benefits', 'See what your tier includes.', 'Boxes', 'fuchsia', '#'],
            ],
            'Account settings and security' => [
                ['Account Settings', 'Manage your account.', 'UserCog', 'slate', '#'],
                ['Change Password', 'Update your password.', 'ShieldCheck', 'amber', '#account-security'],
                ['Two-Factor Authentication', 'Add a second factor.', 'ShieldCheck', 'emerald', '#'],
                ['Passkeys', 'Manage your passkeys.', 'ShieldCheck', 'sky', '#'],
                ['Active Sessions', 'Review signed-in devices.', 'Blocks', 'violet', '#'],
                ['Login History', 'Review recent sign-ins.', 'Clock', 'slate', '#'],
                ['Connected Accounts', 'Manage linked accounts.', 'ExternalLink', 'indigo', '#'],
                ['Privacy Settings', 'Control your data.', 'ShieldCheck', 'rose', '#'],
                ['Download My Data', 'Export your information.', 'FileSpreadsheet', 'blue', '#'],
            ],
            'Help and support' => [
                ['Help Center', 'Browse help articles.', 'LifeBuoy', 'slate', '#'],
                ['Contact Support', 'Get in touch with us.', 'MessageSquare', 'sky', '#'],
                ['Order Issues', 'Resolve a problem with an order.', 'Package', 'rose', '#'],
                ['Disputes', 'Track open disputes.', 'ShieldCheck', 'orange', '#'],
                ['Buyer Protection', 'Understand your cover.', 'ShieldCheck', 'emerald', '#'],
                ['Marketplace Policies', 'Read platform policies.', 'FileText', 'slate', '#'],
                ['Give Feedback', 'Tell us how we are doing.', 'SquarePen', 'fuchsia', '#'],
            ],
        ];

        $position = 0;

        foreach ($groups as $group => $links) {
            foreach ($links as [$label, $hint, $icon, $tone, $route]) {
                NavLink::updateOrCreate(
                    ['context' => 'member', 'group' => $group, 'label' => $label],
                    [
                        'hint' => $hint,
                        'icon' => $icon,
                        'tone' => $tone,
                        'route' => $route,
                        'position' => $position++,
                        'roles' => ['super-admin', 'vendor', 'member'],
                        'is_active' => true,
                    ],
                );
            }
        }
    }
}
