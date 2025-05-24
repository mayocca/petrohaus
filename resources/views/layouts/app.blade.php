<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="petrohaus">
    <head>
        @include('layouts.components.head')
    </head>
    <body>
        @yield('content')

        @livewireScriptConfig
        @stack('scripts')
    </body>
</html>
