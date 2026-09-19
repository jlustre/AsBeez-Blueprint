<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

abstract class Controller
{
    // Laravel 11+ ships a bare base controller; store endpoints call
    // $this->authorize(), so the trait has to be pulled in explicitly.
    use AuthorizesRequests;
}
