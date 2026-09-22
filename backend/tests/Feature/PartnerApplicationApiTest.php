<?php

namespace Tests\Feature;

use App\Models\PartnerApplication;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PartnerApplicationApiTest extends TestCase
{
    use RefreshDatabase;

    private User $member;

    protected function setUp(): void
    {
        parent::setUp();

        $this->member = User::factory()->role(User::ROLE_MEMBER)->create([
            'name' => 'Sam Ortega',
            'email' => 'sam@example.test',
        ]);
    }

    private function asMember(): static
    {
        return $this->actingAs($this->member);
    }

    public function test_the_application_requires_authentication(): void
    {
        $this->getJson('/api/v1/partner-application')->assertUnauthorized();
        $this->putJson('/api/v1/partner-application', [])->assertUnauthorized();
    }

    public function test_the_first_read_creates_a_draft_for_the_caller(): void
    {
        $this->asMember()
            ->getJson('/api/v1/partner-application')
            ->assertOk()
            ->assertJsonPath('application.status', 'draft')
            ->assertJsonPath('application.contact_name', 'Sam Ortega')
            ->assertJsonPath('application.contact_email', 'sam@example.test')
            ->assertJsonPath('application.completeness.completed', 1);

        $this->assertDatabaseCount('partner_applications', 1);
        $this->assertDatabaseHas('partner_application_events', [
            'action' => 'started',
            'actor' => 'applicant',
        ]);
    }

    public function test_a_second_read_reuses_the_same_draft(): void
    {
        $this->asMember()->getJson('/api/v1/partner-application')->assertOk();
        $this->asMember()->getJson('/api/v1/partner-application')->assertOk();

        $this->assertDatabaseCount('partner_applications', 1);
    }

    public function test_it_saves_step_fields_on_the_callers_row(): void
    {
        $this->asMember()->getJson('/api/v1/partner-application')->assertOk();

        $this->asMember()
            ->putJson('/api/v1/partner-application', [
                'current_step' => 5,
                'partnership_type' => 'professional-services',
                'business_name' => 'Cedar Trail Goods',
                'offering' => 'both',
                'categories' => ['home', 'beauty'],
                'primary_product_category' => 'home',
                'avg_product_price' => '$58.00',
                'store_name' => 'Cedar Trail',
            ])
            ->assertOk()
            ->assertJsonPath('application.business_name', 'Cedar Trail Goods')
            ->assertJsonPath('application.avg_product_price', '58.00')
            ->assertJsonPath('application.current_step', 5);

        $this->assertDatabaseHas('partner_applications', [
            'user_id' => $this->member->id,
            'business_name' => 'Cedar Trail Goods',
            'store_name' => 'Cedar Trail',
        ]);
    }

    public function test_another_member_cannot_read_or_write_that_row(): void
    {
        $this->asMember()->putJson('/api/v1/partner-application', [
            'business_name' => 'Cedar Trail Goods',
        ])->assertOk();

        $other = User::factory()->role(User::ROLE_MEMBER)->create();

        $this->actingAs($other)
            ->getJson('/api/v1/partner-application')
            ->assertOk()
            ->assertJsonPath('application.business_name', null);

        $this->assertDatabaseCount('partner_applications', 2);
    }

    public function test_submit_is_blocked_until_required_steps_are_filled(): void
    {
        $this->asMember()->getJson('/api/v1/partner-application')->assertOk();

        $this->asMember()
            ->postJson('/api/v1/partner-application/submit')
            ->assertUnprocessable();
    }

    public function test_a_complete_draft_can_be_submitted(): void
    {
        PartnerApplication::factory()->completeDraft()->create([
            'user_id' => $this->member->id,
            'reference' => 'ASB-APP-2026-00099',
        ]);

        $this->asMember()
            ->postJson('/api/v1/partner-application/submit')
            ->assertOk()
            ->assertJsonPath('application.status', 'submitted')
            ->assertJsonPath('application.can_edit', false);

        $this->asMember()
            ->putJson('/api/v1/partner-application', ['business_name' => 'Nope'])
            ->assertStatus(409);
    }

    public function test_it_stores_an_application_file(): void
    {
        $this->asMember()->getJson('/api/v1/partner-application')->assertOk();

        $file = UploadedFile::fake()->create('catalog.pdf', 120, 'application/pdf');

        $this->asMember()
            ->post('/api/v1/partner-application/files', [
                'kind' => 'catalog',
                'file' => $file,
            ], ['Accept' => 'application/json'])
            ->assertOk()
            ->assertJsonPath('application.files.0.kind', 'catalog')
            ->assertJsonPath('application.files.0.name', 'catalog.pdf');

        $stored = PartnerApplication::query()->first()?->files()->first();
        $this->assertNotNull($stored);
        Storage::disk(PartnerApplication::MEDIA_DISK)->assertExists($stored->path);
    }
}
