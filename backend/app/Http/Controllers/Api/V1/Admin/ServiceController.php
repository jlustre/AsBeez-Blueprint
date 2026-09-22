<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Models\Product;

/**
 * Service administration.
 *
 * A service is a catalog listing whose type is `service`. Bookings, calendars,
 * providers-as-staff, ratings and payouts are omitted: those domains do not
 * exist yet.
 */
class ServiceController extends ProductController
{
    protected function catalogType(): ?string
    {
        return Product::TYPE_SERVICE;
    }

    protected function collectionKey(): string
    {
        return 'services';
    }

    protected function detailKey(): string
    {
        return 'service';
    }
}
