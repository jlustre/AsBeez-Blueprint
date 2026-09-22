<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password as PasswordBroker;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class PasswordController extends Controller
{
    /**
     * Mail a reset link. The response is deliberately identical whether or not
     * the address is registered, so this cannot be used to enumerate accounts.
     */
    public function forgot(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email:rfc'],
        ]);

        $status = PasswordBroker::sendResetLink(['email' => $validated['email']]);

        if ($status === PasswordBroker::RESET_THROTTLED) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json([
            'message' => __('app.auth.reset_sent'),
        ]);
    }

    public function reset(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email:rfc'],
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
        ]);

        $status = PasswordBroker::reset($validated, function (User $user, string $password): void {
            $user->forceFill([
                'password' => $password,
                'remember_token' => Str::random(60),
            ])->save();

            // A reset is the recovery path from a compromise: drop every session.
            $user->tokens()->delete();

            event(new PasswordReset($user));
        });

        if ($status !== PasswordBroker::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json(['message' => __('app.auth.reset_done')]);
    }

    /**
     * Change the password of the signed-in user. Other devices are signed out;
     * the caller's own token survives so the SPA does not bounce to the login screen.
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'confirmed', 'different:current_password', Password::defaults()],
        ]);

        $user = $request->user();

        if (! Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => [__('app.auth.password_incorrect')],
            ]);
        }

        $user->forceFill(['password' => $validated['password']])->save();

        $currentTokenId = $request->user()->currentAccessToken()->getKey();
        $user->tokens()->whereKeyNot($currentTokenId)->delete();

        return response()->json(['message' => __('app.auth.password_updated')]);
    }
}
