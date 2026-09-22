<?php

/*
 * Application messages returned by the API.
 *
 * Anything a controller says back to a user belongs here rather than inline,
 * so the response speaks the caller's language.
 */
return [

    'auth' => [
        'logged_out' => 'Logged out successfully.',
        'logged_out_all' => 'Logged out of all devices.',
        'credentials_incorrect' => 'The provided credentials are incorrect.',
        'password_updated' => 'Password updated.',
        'password_incorrect' => 'The provided password is incorrect.',
        'reset_sent' => 'If that address has an account, a reset link is on its way.',
        'reset_done' => 'Your password has been reset. Please sign in.',
        'verification_sent' => 'Verification link sent.',
        'already_verified' => 'Your email address is already verified.',
    ],

    'store' => [
        'archived' => 'Store archived.',
        'policy_removed' => 'Policy removed.',
        'policy_needs_body' => 'A policy needs a body before it can be published.',
        'verification_requested' => 'Verification requested. An administrator will review it.',
        'already_verified' => 'That check is already verified.',
        'weekday_once' => 'Each weekday may appear only once.',
        'unknown_setting' => 'Unknown setting: :keys',
    ],

    'member' => [
        'address_added' => 'Address :label added.',
        'address_updated' => 'Address updated.',
        'address_removed' => 'Address removed.',
        'address_default_updated' => 'Default address updated.',
    ],

    'admin' => [
        'translations_saved' => 'Translations saved.',
    ],

    'members' => [
        'cannot_change_own_status' => 'You cannot change the status of your own account.',
        'already_in_status' => 'This account already has that status.',
        'status_updated' => 'Member status updated.',
        'note_added' => 'Note added.',
    ],

    'vendors' => [
        'cannot_change_own_status' => 'You cannot change the status of your own partner account.',
        'already_in_status' => 'This partner already has that status.',
        'status_updated' => 'Partner status updated.',
        'note_added' => 'Partner note added.',
        'store_status_updated' => 'Store status updated.',
    ],

    'products' => [
        'already_in_status' => 'This listing already has that status.',
        'status_updated' => 'Product status updated.',
        'note_added' => 'Product note added.',
    ],

    'orders' => [
        'already_in_status' => 'This transaction already has that status.',
        'status_updated' => 'Order status updated.',
        'note_added' => 'Order note added.',
    ],

    'disputes' => [
        'already_in_status' => 'This dispute already has that status.',
        'status_updated' => 'Dispute status updated.',
        'note_added' => 'Dispute note added.',
    ],

    'financials' => [
        'already_in_status' => 'This financial entry already has that status.',
        'status_updated' => 'Financial entry status updated.',
        'note_added' => 'Financial note added.',
    ],

    'categories' => [
        'created' => 'Category created.',
        'updated' => 'Category updated.',
        'invalid_parent' => 'A category cannot be nested under itself or one of its descendants.',
    ],

    'content' => [
        'visibility_updated' => 'Content visibility updated.',
        'cannot_hide' => 'This content type cannot be hidden from this screen.',
    ],

    'ppf' => [
        'settings_updated' => 'Platform fee page settings saved.',
        'tier_created' => 'Fee tier created.',
        'tier_updated' => 'Fee tier updated.',
        'tier_deleted' => 'Fee tier deleted.',
        'market_created' => 'Fee market created.',
        'market_updated' => 'Fee market updated.',
        'market_deleted' => 'Fee market deleted.',
        'plan_created' => 'Fee plan created.',
        'plan_updated' => 'Fee plan updated.',
        'plan_deleted' => 'Fee plan deleted.',
        'faq_created' => 'Fee question created.',
        'faq_updated' => 'Fee question updated.',
        'faq_deleted' => 'Fee question deleted.',
        'unknown_copy_keys' => 'Unknown page copy keys: :keys',
        'invalid_parent' => 'A market cannot be nested under itself or one of its descendants.',
    ],

    'commissions' => [
        'created' => 'PPF rule created.',
        'updated' => 'PPF rule updated.',
        'already_in_status' => 'This PPF rule already has that status.',
        'status_updated' => 'PPF rule status updated.',
        'note_added' => 'PPF note added.',
        'settings_updated' => 'PPF settings saved.',
    ],

    'location' => [
        'region_mismatch' => 'The selected state or province is not valid for that country.',
    ],

];
