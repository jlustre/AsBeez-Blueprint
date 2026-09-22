<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Supported locales
    |--------------------------------------------------------------------------
    |
    | The single source of truth for which languages the application offers.
    | The API advertises this list, the SetLocale middleware validates against
    | it, and the admin translation screens iterate it — so adding a language
    | is a change here plus its message file, nothing more.
    |
    | `native` is what a speaker of that language calls it, which is what a
    | language switcher should show: someone who cannot read the current
    | language cannot read "Spanish" either.
    |
    */

    'supported' => [
        'en' => ['name' => 'English', 'native' => 'English', 'dir' => 'ltr'],
        'es' => ['name' => 'Spanish', 'native' => 'Español', 'dir' => 'ltr'],
    ],

];
