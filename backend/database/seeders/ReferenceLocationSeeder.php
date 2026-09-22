<?php

namespace Database\Seeders;

use App\Models\Country;
use App\Models\CountryRegion;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use ResourceBundle;

/**
 * Seeds the country list and the subdivisions used by the address fields.
 *
 * Countries come from ICU (the intl extension), so the list is complete,
 * correctly named, needs no network and carries no dataset licence: the
 * alternative public datasets are ODbL, which is share-alike and not something
 * to commit to a commercial marketplace by accident.
 *
 * ICU does not ship subdivision names, so regions are authored here for the
 * markets that actually need a dropdown. Countries with no regions seeded fall
 * back to a free-text field on the form, which is the right behaviour anyway —
 * plenty of countries have no meaningful "state".
 */
class ReferenceLocationSeeder extends Seeder
{
    use WithoutModelEvents;

    /** Sorted above the alphabetical list, as the markets served first. */
    private const PINNED = ['PH' => 1, 'US' => 2, 'CA' => 3, 'AU' => 4, 'GB' => 5, 'MX' => 6];

    /**
     * Alpha-2 codes ICU lists that are not places anyone can be addressed at:
     * macro-regions, political unions, and ICU's own pseudo-locales used for
     * translation testing. Without this filter a seller could pick "Unknown
     * Region" or "Pseudo-Bidi" as their country.
     *
     * Exceptionally reserved codes for real territories (AC, TA, IC, EA, CP,
     * DG) and the user-assigned XK for Kosovo are deliberately kept: goods
     * genuinely ship there.
     */
    private const NOT_COUNTRIES = ['ZZ', 'QO', 'EU', 'EZ', 'UN', 'XA', 'XB'];

    public function run(): void
    {
        $this->seedCountries();
        $this->seedRegions();

        $this->command?->info(sprintf(
            'Reference geography: %d countries, %d regions across %d of them.',
            Country::count(),
            CountryRegion::count(),
            CountryRegion::distinct('country_code')->count('country_code'),
        ));
    }

    private function seedCountries(): void
    {
        $bundle = ResourceBundle::create('en', 'ICUDATA-region');

        if (! $bundle) {
            $this->command?->error('The intl extension is unavailable; no countries seeded.');

            return;
        }

        $rows = [];

        foreach ($bundle['Countries'] as $code => $name) {
            // ICU also carries numeric regions (001 = World, 150 = Europe) and
            // a few deprecated aliases; only real alpha-2 codes are wanted.
            if (! preg_match('/^[A-Z]{2}$/', (string) $code) || in_array($code, self::NOT_COUNTRIES, true)) {
                continue;
            }

            $rows[] = [
                'code' => $code,
                'name' => $name,
                'is_active' => true,
                'position' => self::PINNED[$code] ?? 100,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // upsert keeps any is_active an administrator has since toggled off
        // out of scope — only the name and ordering are refreshed.
        foreach (array_chunk($rows, 100) as $chunk) {
            DB::table('countries')->upsert($chunk, ['code'], ['name', 'position', 'updated_at']);
        }

        // Clears rows left behind by an earlier seed that did not filter these.
        Country::whereIn('code', self::NOT_COUNTRIES)->delete();
    }

    private function seedRegions(): void
    {
        foreach ($this->regions() as $countryCode => $regions) {
            if (! Country::whereKey($countryCode)->exists()) {
                continue;
            }

            $position = 0;

            foreach ($regions as $code => $definition) {
                [$name, $type] = is_array($definition) ? $definition : [$definition, 'state'];

                CountryRegion::updateOrCreate(
                    ['country_code' => $countryCode, 'code' => $code],
                    ['name' => $name, 'type' => $type, 'position' => $position++],
                );
            }
        }
    }

    /**
     * ISO 3166-2 subdivisions, without the country prefix.
     *
     * @return array<string, array<string, string|array{0: string, 1: string}>>
     */
    private function regions(): array
    {
        return [
            'PH' => $this->philippines(),
            'US' => $this->unitedStates(),
            'CA' => $this->canada(),
            'AU' => $this->australia(),
            'GB' => [
                'ENG' => ['England', 'country'],
                'SCT' => ['Scotland', 'country'],
                'WLS' => ['Wales', 'country'],
                'NIR' => ['Northern Ireland', 'country'],
            ],
            'MX' => $this->mexico(),
        ];
    }

    /**
     * @return array<string, string|array{0: string, 1: string}>
     */
    private function unitedStates(): array
    {
        return [
            'AL' => 'Alabama', 'AK' => 'Alaska', 'AZ' => 'Arizona', 'AR' => 'Arkansas',
            'CA' => 'California', 'CO' => 'Colorado', 'CT' => 'Connecticut', 'DE' => 'Delaware',
            'FL' => 'Florida', 'GA' => 'Georgia', 'HI' => 'Hawaii', 'ID' => 'Idaho',
            'IL' => 'Illinois', 'IN' => 'Indiana', 'IA' => 'Iowa', 'KS' => 'Kansas',
            'KY' => 'Kentucky', 'LA' => 'Louisiana', 'ME' => 'Maine', 'MD' => 'Maryland',
            'MA' => 'Massachusetts', 'MI' => 'Michigan', 'MN' => 'Minnesota', 'MS' => 'Mississippi',
            'MO' => 'Missouri', 'MT' => 'Montana', 'NE' => 'Nebraska', 'NV' => 'Nevada',
            'NH' => 'New Hampshire', 'NJ' => 'New Jersey', 'NM' => 'New Mexico', 'NY' => 'New York',
            'NC' => 'North Carolina', 'ND' => 'North Dakota', 'OH' => 'Ohio', 'OK' => 'Oklahoma',
            'OR' => 'Oregon', 'PA' => 'Pennsylvania', 'RI' => 'Rhode Island', 'SC' => 'South Carolina',
            'SD' => 'South Dakota', 'TN' => 'Tennessee', 'TX' => 'Texas', 'UT' => 'Utah',
            'VT' => 'Vermont', 'VA' => 'Virginia', 'WA' => 'Washington', 'WV' => 'West Virginia',
            'WI' => 'Wisconsin', 'WY' => 'Wyoming',
            'DC' => ['District of Columbia', 'district'],
            'AS' => ['American Samoa', 'territory'],
            'GU' => ['Guam', 'territory'],
            'MP' => ['Northern Mariana Islands', 'territory'],
            'PR' => ['Puerto Rico', 'territory'],
            'VI' => ['U.S. Virgin Islands', 'territory'],
        ];
    }

    /**
     * @return array<string, string|array{0: string, 1: string}>
     */
    private function canada(): array
    {
        return [
            'AB' => ['Alberta', 'province'],
            'BC' => ['British Columbia', 'province'],
            'MB' => ['Manitoba', 'province'],
            'NB' => ['New Brunswick', 'province'],
            'NL' => ['Newfoundland and Labrador', 'province'],
            'NS' => ['Nova Scotia', 'province'],
            'ON' => ['Ontario', 'province'],
            'PE' => ['Prince Edward Island', 'province'],
            'QC' => ['Quebec', 'province'],
            'SK' => ['Saskatchewan', 'province'],
            'NT' => ['Northwest Territories', 'territory'],
            'NU' => ['Nunavut', 'territory'],
            'YT' => ['Yukon', 'territory'],
        ];
    }

    /**
     * @return array<string, string|array{0: string, 1: string}>
     */
    private function australia(): array
    {
        return [
            'NSW' => 'New South Wales',
            'QLD' => 'Queensland',
            'SA' => 'South Australia',
            'TAS' => 'Tasmania',
            'VIC' => 'Victoria',
            'WA' => 'Western Australia',
            'ACT' => ['Australian Capital Territory', 'territory'],
            'NT' => ['Northern Territory', 'territory'],
        ];
    }

    /**
     * @return array<string, string|array{0: string, 1: string}>
     */
    private function mexico(): array
    {
        return [
            'AGU' => 'Aguascalientes', 'BCN' => 'Baja California', 'BCS' => 'Baja California Sur',
            'CAM' => 'Campeche', 'CHP' => 'Chiapas', 'CHH' => 'Chihuahua',
            'CMX' => ['Ciudad de México', 'district'], 'COA' => 'Coahuila', 'COL' => 'Colima',
            'DUR' => 'Durango', 'GUA' => 'Guanajuato', 'GRO' => 'Guerrero', 'HID' => 'Hidalgo',
            'JAL' => 'Jalisco', 'MEX' => 'México', 'MIC' => 'Michoacán', 'MOR' => 'Morelos',
            'NAY' => 'Nayarit', 'NLE' => 'Nuevo León', 'OAX' => 'Oaxaca', 'PUE' => 'Puebla',
            'QUE' => 'Querétaro', 'ROO' => 'Quintana Roo', 'SLP' => 'San Luis Potosí',
            'SIN' => 'Sinaloa', 'SON' => 'Sonora', 'TAB' => 'Tabasco', 'TAM' => 'Tamaulipas',
            'TLA' => 'Tlaxcala', 'VER' => 'Veracruz', 'YUC' => 'Yucatán', 'ZAC' => 'Zacatecas',
        ];
    }

    /**
     * Philippine provinces plus the National Capital Region.
     *
     * @return array<string, string|array{0: string, 1: string}>
     */
    private function philippines(): array
    {
        return [
            'NCR' => ['Metro Manila (NCR)', 'region'],
            'ABR' => ['Abra', 'province'], 'AGN' => ['Agusan del Norte', 'province'],
            'AGS' => ['Agusan del Sur', 'province'], 'AKL' => ['Aklan', 'province'],
            'ALB' => ['Albay', 'province'], 'ANT' => ['Antique', 'province'],
            'APA' => ['Apayao', 'province'], 'AUR' => ['Aurora', 'province'],
            'BAS' => ['Basilan', 'province'], 'BAN' => ['Bataan', 'province'],
            'BTN' => ['Batanes', 'province'], 'BTG' => ['Batangas', 'province'],
            'BEN' => ['Benguet', 'province'], 'BIL' => ['Biliran', 'province'],
            'BOH' => ['Bohol', 'province'], 'BUK' => ['Bukidnon', 'province'],
            'BUL' => ['Bulacan', 'province'], 'CAG' => ['Cagayan', 'province'],
            'CAN' => ['Camarines Norte', 'province'], 'CAS' => ['Camarines Sur', 'province'],
            'CAM' => ['Camiguin', 'province'], 'CAP' => ['Capiz', 'province'],
            'CAT' => ['Catanduanes', 'province'], 'CAV' => ['Cavite', 'province'],
            'CEB' => ['Cebu', 'province'], 'NCO' => ['Cotabato', 'province'],
            'COM' => ['Davao de Oro', 'province'], 'DAV' => ['Davao del Norte', 'province'],
            'DAS' => ['Davao del Sur', 'province'], 'DVO' => ['Davao Occidental', 'province'],
            'DAO' => ['Davao Oriental', 'province'], 'DIN' => ['Dinagat Islands', 'province'],
            'EAS' => ['Eastern Samar', 'province'], 'GUI' => ['Guimaras', 'province'],
            'IFU' => ['Ifugao', 'province'], 'ILN' => ['Ilocos Norte', 'province'],
            'ILS' => ['Ilocos Sur', 'province'], 'ILI' => ['Iloilo', 'province'],
            'ISA' => ['Isabela', 'province'], 'KAL' => ['Kalinga', 'province'],
            'LUN' => ['La Union', 'province'], 'LAG' => ['Laguna', 'province'],
            'LAN' => ['Lanao del Norte', 'province'], 'LAS' => ['Lanao del Sur', 'province'],
            'LEY' => ['Leyte', 'province'], 'MAG' => ['Maguindanao', 'province'],
            'MAD' => ['Marinduque', 'province'], 'MAS' => ['Masbate', 'province'],
            'MSC' => ['Misamis Occidental', 'province'], 'MSR' => ['Misamis Oriental', 'province'],
            'MOU' => ['Mountain Province', 'province'], 'NEC' => ['Negros Occidental', 'province'],
            'NER' => ['Negros Oriental', 'province'], 'NSA' => ['Northern Samar', 'province'],
            'NUE' => ['Nueva Ecija', 'province'], 'NUV' => ['Nueva Vizcaya', 'province'],
            'MDC' => ['Occidental Mindoro', 'province'], 'MDR' => ['Oriental Mindoro', 'province'],
            'PLW' => ['Palawan', 'province'], 'PAM' => ['Pampanga', 'province'],
            'PAN' => ['Pangasinan', 'province'], 'QUE' => ['Quezon', 'province'],
            'QUI' => ['Quirino', 'province'], 'RIZ' => ['Rizal', 'province'],
            'ROM' => ['Romblon', 'province'], 'WSA' => ['Samar', 'province'],
            'SAR' => ['Sarangani', 'province'], 'SIQ' => ['Siquijor', 'province'],
            'SOR' => ['Sorsogon', 'province'], 'SCO' => ['South Cotabato', 'province'],
            'SLE' => ['Southern Leyte', 'province'], 'SUK' => ['Sultan Kudarat', 'province'],
            'SLU' => ['Sulu', 'province'], 'SUN' => ['Surigao del Norte', 'province'],
            'SUR' => ['Surigao del Sur', 'province'], 'TAR' => ['Tarlac', 'province'],
            'TAW' => ['Tawi-Tawi', 'province'], 'ZMB' => ['Zambales', 'province'],
            'ZAN' => ['Zamboanga del Norte', 'province'], 'ZAS' => ['Zamboanga del Sur', 'province'],
            'ZSI' => ['Zamboanga Sibugay', 'province'],
        ];
    }
}
