<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        @include('layouts.components.head')
    </head>
    <body>
        @yield('content')

        @livewireScriptConfig
        @stack('scripts')
    </body>
</html>
