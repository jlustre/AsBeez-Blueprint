<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Support\PpfCatalog;
use Illuminate\Http\JsonResponse;

/**
 * Public Platform Participation Fee page.
 *
 * Published schedule copy and proposed rates only. Calculated commissions,
 * enrolled partner tiers, and live quotes are omitted.
 */
class PpfController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json(PpfCatalog::public());
    }
}
