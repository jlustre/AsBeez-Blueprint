<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreResource;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

/**
 * Banner and logo upload.
 *
 * Everything addresses the disk by name (Store::MEDIA_DISK), so moving to S3
 * is a change in config/filesystems.php and nothing here.
 */
class StoreMediaController extends Controller
{
    /** Limits mirror the guidance the page already shows the vendor. */
    private const LIMITS = [
        'banner' => ['max_kb' => 5120, 'min_width' => 800, 'min_height' => 200, 'column' => 'banner_path'],
        'logo' => ['max_kb' => 2048, 'min_width' => 200, 'min_height' => 200, 'column' => 'logo_path'],
    ];

    private const PROFILE_RELATIONS = [
        'categories', 'hours', 'socials.platform', 'policies.type', 'verifications',
    ];

    public function upload(Request $request, Store $store, string $kind): JsonResponse
    {
        $this->authorize('update', $store);

        abort_unless(isset(self::LIMITS[$kind]), 404);
        $limits = self::LIMITS[$kind];

        $request->validate([
            'file' => [
                'required', 'file', 'image',
                // SVG is deliberately excluded: it is a script-bearing format,
                // and these files are served from the application's own origin,
                // so a crafted upload would be stored XSS. Re-adding it needs a
                // sanitiser, or serving media from a separate domain.
                'mimes:jpg,jpeg,png,webp',
                "max:{$limits['max_kb']}",
                Rule::dimensions()->minWidth($limits['min_width'])->minHeight($limits['min_height']),
            ],
        ], [
            'file.max' => "The {$kind} may not be larger than ".($limits['max_kb'] / 1024).'MB.',
            'file.dimensions' => "The {$kind} must be at least {$limits['min_width']}×{$limits['min_height']}px.",
        ]);

        $disk = Storage::disk(Store::MEDIA_DISK);
        $previous = $store->{$limits['column']};

        $path = $request->file('file')->store("stores/{$store->getKey()}/{$kind}", Store::MEDIA_DISK);

        $store->update([$limits['column'] => $path]);

        // Replaced files are not worth keeping; do this after the row is saved
        // so a failed write never leaves the store pointing at a deleted file.
        if ($previous && $previous !== $path) {
            $disk->delete($previous);
        }

        return $this->profile($store);
    }

    public function destroy(Store $store, string $kind): JsonResponse
    {
        $this->authorize('update', $store);

        abort_unless(isset(self::LIMITS[$kind]), 404);
        $column = self::LIMITS[$kind]['column'];

        if ($path = $store->{$column}) {
            Storage::disk(Store::MEDIA_DISK)->delete($path);
            $store->update([$column => null]);
        }

        return $this->profile($store);
    }

    private function profile(Store $store): JsonResponse
    {
        return response()->json([
            'store' => new StoreResource($store->fresh(self::PROFILE_RELATIONS)),
        ]);
    }
}
