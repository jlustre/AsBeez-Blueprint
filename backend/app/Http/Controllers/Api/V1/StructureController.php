<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\NavLink;
use App\Models\PolicyType;
use App\Models\SettingDefinition;
use App\Models\SocialPlatform;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Read side of the admin-curated registries.
 *
 * This is what lets the store-profile page stop shipping its own option lists:
 * categories, social platforms, policy types, setting definitions and the
 * "Manage Your Store" links all come from here. Phase 3's admin screens write
 * to the same rows.
 */
class StructureController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $role = $request->user()?->role;

        return response()->json([
            'categories' => Category::active()
                ->orderBy('position')
                ->get(['id', 'parent_id', 'name', 'slug', 'tone']),

            'social_platforms' => SocialPlatform::active()
                ->orderBy('position')
                ->get(['id', 'key', 'label', 'icon', 'icon_path', 'input_type', 'placeholder', 'tone']),

            'policy_types' => PolicyType::orderBy('position')
                ->get(['id', 'key', 'label', 'hint', 'icon', 'tone', 'is_required']),

            'setting_definitions' => SettingDefinition::orderBy('position')
                ->get(['id', 'key', 'group', 'label', 'hint', 'type', 'options', 'default_value']),

            'nav_links' => NavLink::active()
                ->orderBy('position')
                ->get(['id', 'group', 'label', 'hint', 'icon', 'tone', 'route', 'badge_source', 'roles'])
                // A link with no roles is public to any signed-in user; otherwise
                // the caller's role has to be listed.
                ->filter(fn (NavLink $link) => blank($link->roles) || in_array($role, $link->roles, true))
                ->values(),
        ]);
    }
}
