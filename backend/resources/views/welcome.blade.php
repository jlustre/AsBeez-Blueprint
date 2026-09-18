<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'AsBeez Backend') }}</title>
    </head>
    <body style="font-family: ui-sans-serif, system-ui, sans-serif; margin: 0; padding: 3rem; background: #f8fafc; color: #0f172a;">
        <main style="max-width: 42rem; margin: 0 auto;">
            <p style="font-size: .75rem; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: #64748b;">AsBeez Backend</p>
            <h1 style="font-size: 2.25rem; margin: 1rem 0 .75rem;">Laravel services are ready.</h1>
            <p style="line-height: 1.7; color: #475569;">This backend owns domain logic, Livewire workflows, APIs, authentication, financial controls, and integrations. The React application is developed from the sibling <code>frontend</code> root.</p>
        </main>
    </body>
</html>
