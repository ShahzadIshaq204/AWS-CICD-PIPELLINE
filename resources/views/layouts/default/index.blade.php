<html lang="en">
@include('layouts.default.header')
<body>
<div class="content-wrapper">


        @include($pages)

</div>
@include('layouts.default.footer')
@yield('scripts')
</body>

</html>