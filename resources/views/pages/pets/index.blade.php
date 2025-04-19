@extends('layouts.app')

@section('title', 'Pets')

@section('content')
    <div x-data="{
        init() {
            console.log('Hello Pets!');
        }
    }">
        Hello Pets!
    </div>
@endsection