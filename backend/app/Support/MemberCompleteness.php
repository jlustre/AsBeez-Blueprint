<?php

namespace App\Support;

use App\Models\User;

/**
 * How finished a member profile is.
 *
 * Mirrors StoreCompleteness: the template showed a hard-coded "78%" with a
 * fixed checklist, and both are derived here from the member's actual rows.
 */
class MemberCompleteness
{
    public function __construct(private readonly User $user)
    {
    }

    public static function for(User $user): self
    {
        return new self($user);
    }

    /**
     * @return array{percent: int, completed: int, total: int, remaining: int, tasks: list<array<string, mixed>>}
     */
    public function toArray(): array
    {
        $tasks = $this->tasks();
        $completed = count(array_filter($tasks, fn (array $t) => $t['done']));
        $total = count($tasks);

        return [
            'percent' => $total > 0 ? (int) round($completed / $total * 100) : 0,
            'completed' => $completed,
            'total' => $total,
            'remaining' => $total - $completed,
            'tasks' => $tasks,
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function tasks(): array
    {
        $user = $this->user->loadMissing(['profile', 'addresses', 'interests']);
        $profile = $user->profile;

        return [
            $this->task('avatar', 'Upload profile photo', filled($profile?->avatar_path), 'Upload', '#personal'),
            $this->task('name', 'Add your name', filled($profile?->first_name) && filled($profile?->last_name), 'Add name', '#personal'),
            $this->task('username', 'Choose a public username', filled($profile?->username), 'Choose', '#personal'),
            $this->task('bio', 'Add a short biography', mb_strlen((string) $profile?->bio) >= 30, 'Write bio', '#personal'),
            $this->task('email', 'Verify email address', $user->hasVerifiedEmail(), 'Verify', '#account-security'),
            $this->task('phone', 'Add a phone number', filled($profile?->phone), 'Add phone', '#personal'),
            $this->task('address', 'Add a delivery address', $user->addresses->isNotEmpty(), 'Add address', '#addresses'),
            $this->task('interests', 'Select marketplace interests', $user->interests->isNotEmpty(), 'Choose', '#interests'),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function task(string $key, string $label, bool $done, string $cta, string $href): array
    {
        return [
            'key' => $key,
            'label' => $label,
            'done' => $done,
            'cta' => $cta,
            'href' => $href,
        ];
    }
}
