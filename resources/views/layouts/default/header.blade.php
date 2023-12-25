@php
    $cUser=\SiteHelpers::getCUser();
@endphp<!DOCTYPE html>


<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="{{asset('/theme/')}}/img/favicon.png">
    <title>@if(isset($title)){{ $title }} | @endif {{ config('threedrenders.cnf_appname') }}</title>
    <link rel="stylesheet" href="{{asset('/theme/')}}/css/plugins.css">
    <link rel="stylesheet" href="{{asset('/theme/')}}/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="{{asset('/theme/')}}/dist/jquery.fileuploader.min.css">
    <link rel="stylesheet" href="{{asset('/theme/')}}/dist/jquery.fileuploader-theme-thumbnails.css">
    <link href="{{asset('/theme/')}}/annotations/js/jquery.webui-popover.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="   {{asset('/theme/')}}/annotations/js/spectrum.min.css">



</head>