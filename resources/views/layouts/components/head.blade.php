<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="manifest" href="{{ route('manifest') }}">
<link rel="icon" href="{{ asset('favicon.ico') }}">

<title>@yield('title')</title>

{!! \Sentry\Laravel\Integration::sentryMeta() !!}

@vite(['resources/css/app.css', 'resources/js/app.ts'])

@livewireStyles
