{{-- 
    Meta Header Component
    This component should be used within the <head> element to add meta tags and other head elements
    
    Usage:
    <x-meta-header 
        :title="$title"
        :description="$description" 
        :keywords="$keywords"
        :canonical="$canonical"
        :robots="$robots"
        :og-title="$ogTitle"
        :og-description="$ogDescription"
        :og-image="$ogImage"
        :og-url="$ogUrl"
        :twitter-card="$twitterCard"
        :twitter-title="$twitterTitle"
        :twitter-description="$twitterDescription"
        :twitter-image="$twitterImage"
        :author="$author"
    />
--}}

@props([
    'title' => config('app.name', 'Laravel'),
    'description' => null,
    'keywords' => null,
    'canonical' => null,
    'robots' => null,
    'ogTitle' => null,
    'ogDescription' => null,
    'ogImage' => null,
    'ogUrl' => null,
    'twitterCard' => 'summary_large_image',
    'twitterTitle' => null,
    'twitterDescription' => null,
    'twitterImage' => null,
    'author' => null,
])

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{ $title }}</title>

@if ($description)
    <meta name="description" content="{{ $description }}">
@endif

@if ($keywords)
    <meta name="keywords" content="{{ $keywords }}">
@endif

@if ($canonical)
    <link rel="canonical" href="{{ $canonical }}">
@endif

@if ($robots)
    <meta name="robots" content="{{ $robots }}">
@endif

@if ($author)
    <meta name="author" content="{{ $author }}">
@endif

{{-- Open Graph Meta Tags --}}
<meta property="og:title" content="{{ $ogTitle ?? $title }}">
@if ($ogDescription || $description)
    <meta property="og:description" content="{{ $ogDescription ?? $description }}">
@endif
@if ($ogImage)
    <meta property="og:image" content="{{ $ogImage }}">
@endif
@if ($ogUrl || $canonical)
    <meta property="og:url" content="{{ $ogUrl ?? $canonical }}">
@endif
<meta property="og:type" content="website">
<meta property="og:site_name" content="{{ config('app.name', 'Laravel') }}">

{{-- Twitter Card Meta Tags --}}
<meta name="twitter:card" content="{{ $twitterCard }}">
<meta name="twitter:title" content="{{ $twitterTitle ?? $ogTitle ?? $title }}">
@if ($twitterDescription || $ogDescription || $description)
    <meta name="twitter:description" content="{{ $twitterDescription ?? $ogDescription ?? $description }}">
@endif
@if ($twitterImage || $ogImage)
    <meta name="twitter:image" content="{{ $twitterImage ?? $ogImage }}">
@endif

{{-- CSS and other resources --}}
<link rel="preconnect" href="https://fonts.bunny.net">
<link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet">

{{-- Favicon --}}
<link rel="icon" href="{{ asset('favicon.ico') }}">

@vite(['resources/css/app.css', 'resources/ts/app.ts'])

{{ $slot ?? '' }} 