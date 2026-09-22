<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Country;
use App\Models\CountryRegion;
use App\Models\NavLink;
use App\Models\PolicyType;
use App\Models\SettingDefinition;
use App\Models\SocialPlatform;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use ResourceBundle;

/**
 * Read side of the admin-curated registries.
 *
 * This is what lets the profile pages stop shipping their own option lists:
 * categories, social platforms, policy types, setting definitions and the
 * navigation grids all come from here — already rendered in the caller's
 * language, which SetLocale has resolved by the time this runs.
 */
class StructureController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $role = $request->user()?->role;
        $locale = App::getLocale();

        return response()->json([
            // Lets the client confirm which language it was served.
            'locale' => $locale,

            'categories' => Category::active()
                ->orderBy('position')
                ->get()
                ->map(fn (Category $c) => [
                    'id' => $c->id,
                    'parent_id' => $c->parent_id,
                    'name' => $c->tr('name'),
                    'slug' => $c->slug,
                    'tone' => $c->tone,
                ]),

            'social_platforms' => SocialPlatform::active()
                ->orderBy('position')
                ->get()
                ->map(fn (SocialPlatform $p) => [
                    'id' => $p->id,
                    'key' => $p->key,
                    'label' => $p->tr('label'),
                    'icon' => $p->icon,
                    'icon_path' => $p->icon_path,
                    'input_type' => $p->input_type,
                    'placeholder' => $p->tr('placeholder'),
                    'tone' => $p->tone,
                ]),

            'policy_types' => PolicyType::orderBy('position')
                ->get()
                ->map(fn (PolicyType $t) => [
                    'id' => $t->id,
                    'key' => $t->key,
                    'label' => $t->tr('label'),
                    'hint' => $t->tr('hint'),
                    'icon' => $t->icon,
                    'tone' => $t->tone,
                    'is_required' => $t->is_required,
                ]),

            'setting_definitions' => SettingDefinition::orderBy('position')
                ->get()
                ->map(fn (SettingDefinition $d) => [
                    'id' => $d->id,
                    'key' => $d->key,
                    'group' => $d->group,
                    'label' => $d->tr('label'),
                    'hint' => $d->tr('hint'),
                    'type' => $d->type,
                    'options' => $d->options,
                    'default_value' => $d->default_value,
                ]),

            // Address reference data. Regions are keyed by country so the form
            // can cascade one select off the other without another round trip;
            // a country with no entry here gets a free-text field instead.
            'countries' => $this->countries($locale),
            'regions' => $this->regions(),

            // Keyed by context so one call serves both the vendor's store grid
            // and the member's account grid without either seeing the other.
            'nav_links' => NavLink::active()
                ->orderBy('position')
                ->get()
                // A link with no roles is visible to any signed-in user;
                // otherwise the caller's role has to be listed.
                ->filter(fn (NavLink $link) => blank($link->roles) || in_array($role, $link->roles, true))
                ->groupBy('context')
                ->map(fn ($links) => $links->map(fn (NavLink $link) => [
                    'id' => $link->id,
                    'group' => $link->tr('group'),
                    'label' => $link->tr('label'),
                    'hint' => $link->tr('hint'),
                    'icon' => $link->icon,
                    'tone' => $link->tone,
                    'route' => $link->route,
                    'badge_source' => $link->badge_source,
                ])->values()),
        ]);
    }

    /**
     * Country names come from ICU in the active locale, so every country is
     * translated without a single stored translation row.
     *
     * @return list<array{code: string, name: string}>
     */
    private function countries(string $locale): array
    {
        $bundle = ResourceBundle::create($locale, 'ICUDATA-region');
        $names = [];

        if ($bundle) {
            foreach ($bundle['Countries'] as $code => $name) {
                $names[$code] = $name;
            }
        }

        return Country::active()
            ->orderBy('position')
            ->orderBy('name')
            ->get(['code', 'name'])
            // Falls back to the stored English name when ICU has no entry.
            ->map(fn (Country $c) => ['code' => $c->code, 'name' => $names[$c->code] ?? $c->name])
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function regions(): array
    {
        return CountryRegion::orderBy('country_code')
            ->orderBy('position')
            ->get(['country_code', 'code', 'name', 'type'])
            ->groupBy('country_code')
            ->map(fn ($group) => $group->map->only(['code', 'name', 'type'])->values())
            ->all();
    }
}
