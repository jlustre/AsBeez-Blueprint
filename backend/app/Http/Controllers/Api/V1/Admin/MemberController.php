<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\MemberAdminEvent;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * Member administration.
 *
 * Scoped to accounts whose role is `member`: vendors and administrators are
 * people too, but they are managed from their own screens, and mixing them
 * into one list makes every count on this page ambiguous.
 *
 * What this deliberately does not report: orders, lifetime spend, reward
 * points, risk scores and membership tiers. Those domains do not exist yet,
 * and a column of invented numbers on an administration screen is worse than
 * an empty one — somebody will eventually act on it.
 */
class MemberController extends Controller
{
    private const SORTS = [
        'newest' => ['created_at', 'desc'],
        'oldest' => ['created_at', 'asc'],
        'name-asc' => ['name', 'asc'],
        'name-desc' => ['name', 'desc'],
        'recently-active' => ['last_active_at', 'desc'],
    ];

    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:120'],
            'status' => ['nullable', Rule::in(User::STATUSES)],
            'verification' => ['nullable', Rule::in(['verified', 'unverified'])],
            'registered_from' => ['nullable', 'date'],
            'registered_to' => ['nullable', 'date', 'after_or_equal:registered_from'],
            'sort' => ['nullable', Rule::in(array_keys(self::SORTS))],
            'per_page' => ['nullable', 'integer', Rule::in([10, 25, 50, 100])],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        [$column, $direction] = self::SORTS[$filters['sort'] ?? 'newest'];

        $members = $this->baseQuery()
            ->with('profile')
            ->when($filters['search'] ?? null, fn ($query, $term) => $this->applySearch($query, $term))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when(($filters['verification'] ?? null) === 'verified', fn ($query) => $query->whereNotNull('email_verified_at'))
            ->when(($filters['verification'] ?? null) === 'unverified', fn ($query) => $query->whereNull('email_verified_at'))
            ->when($filters['registered_from'] ?? null, fn ($query, $from) => $query->whereDate('created_at', '>=', $from))
            ->when($filters['registered_to'] ?? null, fn ($query, $to) => $query->whereDate('created_at', '<=', $to))
            ->orderBy($column, $direction)
            // last_active_at is null for anyone who has not signed in since the
            // column existed, and null ordering differs across engines; id
            // breaks the tie so pagination cannot repeat or drop a row.
            ->orderBy('id', 'desc')
            ->paginate($filters['per_page'] ?? 25)
            ->withQueryString();

        return response()->json([
            'members' => $members->getCollection()->map(fn (User $member) => $this->summarise($member))->all(),
            'meta' => [
                'page' => $members->currentPage(),
                'per_page' => $members->perPage(),
                'total' => $members->total(),
                'last_page' => $members->lastPage(),
                'from' => $members->firstItem(),
                'to' => $members->lastItem(),
            ],
            'stats' => $this->stats(),
            'statuses' => User::STATUSES,
        ]);
    }

    public function show(User $member): JsonResponse
    {
        $this->ensureMember($member);
        $member->load(['profile', 'adminEvents.author', 'addresses', 'statusChangedBy']);

        $address = $member->addresses->firstWhere('is_default_shipping', true)
            ?? $member->addresses->first();

        return response()->json([
            'member' => $this->summarise($member) + [
                'display_name' => $member->profile?->display_name,
                'language' => $member->profile?->language,
                'timezone' => $member->profile?->timezone,
                'is_public' => (bool) $member->profile?->is_public,
                'status_reason' => $member->status_reason,
                'status_changed_by' => $member->statusChangedBy?->name,
                'address_count' => $member->addresses->count(),
                'location' => $address ? [
                    'city' => $address->city,
                    'state' => $address->state,
                    'country' => $address->country,
                ] : null,
                'events' => $member->adminEvents->map(fn (MemberAdminEvent $event) => [
                    'id' => $event->id,
                    'type' => $event->type,
                    'body' => $event->body,
                    'from_status' => $event->from_status,
                    'to_status' => $event->to_status,
                    'author' => $event->author?->name,
                    'created_at' => $event->created_at?->toIso8601String(),
                ])->all(),
            ],
        ]);
    }

    /**
     * Moves an account through its lifecycle, leaving a record behind.
     */
    public function updateStatus(Request $request, User $member): JsonResponse
    {
        $this->ensureMember($member);

        // An administrator locking themselves out helps nobody, and this is
        // the members list, so the account should not be here anyway.
        if ($member->is($request->user())) {
            throw ValidationException::withMessages([
                'status' => __('app.members.cannot_change_own_status'),
            ]);
        }

        $validated = $request->validate([
            'status' => ['required', Rule::in(User::STATUSES)],
            'reason' => [
                Rule::requiredIf(fn () => in_array($request->input('status'), User::STATUSES_NEEDING_REASON, true)),
                'nullable', 'string', 'max:2000',
            ],
        ]);

        $from = $member->status;

        if ($from === $validated['status']) {
            throw ValidationException::withMessages([
                'status' => __('app.members.already_in_status'),
            ]);
        }

        DB::transaction(function () use ($member, $validated, $from, $request): void {
            $member->forceFill([
                'status' => $validated['status'],
                'status_reason' => $validated['reason'] ?? null,
                'status_changed_at' => now(),
                'status_changed_by' => $request->user()->id,
            ])->save();

            $member->adminEvents()->create([
                'author_id' => $request->user()->id,
                'type' => MemberAdminEvent::TYPE_STATUS,
                'body' => $validated['reason'] ?? null,
                'from_status' => $from,
                'to_status' => $validated['status'],
            ]);
        });

        return $this->show($member->fresh());
    }

    /** An internal remark. Never shown to the member. */
    public function storeNote(Request $request, User $member): JsonResponse
    {
        $this->ensureMember($member);

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $member->adminEvents()->create([
            'author_id' => $request->user()->id,
            'type' => MemberAdminEvent::TYPE_NOTE,
            'body' => $validated['body'],
        ]);

        return $this->show($member);
    }

    /** The audit feed across every member, newest first. */
    public function events(Request $request): JsonResponse
    {
        $events = MemberAdminEvent::query()
            ->with(['user:id,name', 'author:id,name'])
            ->whereHas('user', fn ($query) => $query->where('role', User::ROLE_MEMBER))
            ->latest()
            ->limit((int) $request->integer('limit', 10))
            ->get();

        return response()->json([
            'events' => $events->map(fn (MemberAdminEvent $event) => [
                'id' => $event->id,
                'type' => $event->type,
                'body' => $event->body,
                'from_status' => $event->from_status,
                'to_status' => $event->to_status,
                'member' => $event->user?->name,
                'member_id' => $event->user_id,
                'author' => $event->author?->name,
                'created_at' => $event->created_at?->toIso8601String(),
            ])->all(),
        ]);
    }

    /* ------------------------------------------------------------------ */

    private function baseQuery()
    {
        return User::query()->where('role', User::ROLE_MEMBER);
    }

    /**
     * Matches the identifiers an administrator is likely to be handed: a name,
     * an email, a username, a phone number, or the member id itself.
     */
    private function applySearch($query, string $term)
    {
        $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $term).'%';

        return $query->where(function ($query) use ($like, $term): void {
            $query->where('name', 'like', $like)
                ->orWhere('email', 'like', $like)
                ->orWhereHas('profile', fn ($profile) => $profile
                    ->where('username', 'like', $like)
                    ->orWhere('phone', 'like', $like));

            if (ctype_digit($term)) {
                $query->orWhere('id', (int) $term);
            }
        });
    }

    /**
     * @return array<string, int>
     */
    private function stats(): array
    {
        $counts = $this->baseQuery()
            ->selectRaw('count(*) as total')
            ->selectRaw('sum(case when email_verified_at is not null then 1 else 0 end) as verified')
            ->selectRaw('sum(case when created_at >= ? then 1 else 0 end) as new_this_month', [now()->startOfMonth()])
            ->first();

        $byStatus = $this->baseQuery()
            ->groupBy('status')
            ->selectRaw('status, count(*) as total')
            ->pluck('total', 'status');

        $stats = [
            'total' => (int) $counts->total,
            'verified' => (int) $counts->verified,
            'unverified' => (int) $counts->total - (int) $counts->verified,
            'new_this_month' => (int) $counts->new_this_month,
        ];

        foreach (User::STATUSES as $status) {
            $stats[$status] = (int) ($byStatus[$status] ?? 0);
        }

        return $stats;
    }

    /**
     * @return array<string, mixed>
     */
    private function summarise(User $member): array
    {
        $profile = $member->profile;

        return [
            'id' => $member->id,
            'name' => $member->name,
            'email' => $member->email,
            'username' => $profile?->username,
            'phone' => $profile?->phone,
            'avatar_url' => $profile?->avatarUrl(),
            'initials' => $profile?->initials() ?? mb_strtoupper(mb_substr($member->name, 0, 1)),
            'status' => $member->status,
            'email_verified_at' => $member->email_verified_at?->toIso8601String(),
            'joined_at' => $member->created_at?->toIso8601String(),
            'last_active_at' => $member->last_active_at?->toIso8601String(),
            'status_changed_at' => $member->status_changed_at?->toIso8601String(),
        ];
    }

    /** Route-model binding accepts any user; this list is only about members. */
    private function ensureMember(User $member): void
    {
        abort_unless($member->role === User::ROLE_MEMBER, 404);
    }
}
