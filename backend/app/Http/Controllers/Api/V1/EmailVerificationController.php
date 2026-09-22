<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class EmailVerificationController extends Controller
{
    /**
     * Landing point for the link in the verification mail. The browser follows it
     * without a bearer token, so the signature on the URL is the only credential —
     * which is why the address hash is checked against the id before anything is
     * written, and why this returns a redirect rather than JSON.
     */
    public function verify(Request $request, string $id, string $hash): RedirectResponse
    {
        $user = User::find($id);

        if (! $user || ! hash_equals($hash, sha1($user->getEmailForVerification()))) {
            return redirect()->away($this->frontendUrl('failed'));
        }

        if ($user->hasVerifiedEmail()) {
            return redirect()->away($this->frontendUrl('already-verified'));
        }

        $user->markEmailAsVerified();
        event(new Verified($user));

        return redirect()->away($this->frontendUrl('verified'));
    }

    /**
     * Re-send the verification mail to the signed-in user.
     */
    public function resend(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => __('app.auth.already_verified')]);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => __('app.auth.verification_sent')]);
    }

    /**
     * Hand the SPA a fresh signed link so it can offer "open your verification
     * link again" without going through the mailbox. Useful in local development
     * where mail only reaches the log.
     */
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'verified' => $user->hasVerifiedEmail(),
            'verification_url' => $user->hasVerifiedEmail() ? null : URL::temporarySignedRoute(
                'verification.verify',
                now()->addMinutes((int) config('auth.verification.expire', 60)),
                ['id' => $user->getKey(), 'hash' => sha1($user->getEmailForVerification())],
            ),
        ]);
    }

    private function frontendUrl(string $status): string
    {
        return rtrim(config('app.frontend_url'), '/').'/?status='.$status.'#email-verified';
    }
}
