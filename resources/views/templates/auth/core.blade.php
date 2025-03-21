@extends('templates/wrapper', [
    'css' => ['body' => 'bg-neutral-900']
])

@section('title')
    PROHostVPS Control Panel
@endsection

@section('container')
    <div id="app"></div>
    <style>
        body {
            background: linear-gradient(135deg, #0f0f0f 0%, #1f1f1f 100%);
            background-attachment: fixed;
        }
    </style>
@endsection
