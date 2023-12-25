<html lang="en">
@include('layouts.default.header')
<body style="background-image: url({{url('theme/images/login-bg.jpg')}})">
<div class="content-wrapper">
    <section class="wrapper "  id="ThreeDRendersFormTop">
        <div class="container pt-15 pb-15  position-relative">
            <div class="row gx-0 align-items-center">
                <div class="col-md-4 "></div>
                <div class="col-md-4 text-center text-lg-start" data-cues="slideInDown" data-group="page-title" data-delay="600">
                    <div class="mb-10">
                        <div class="text-center">
                            <a href="{{url('')}}"><img width="175" src="{{asset('/theme/')}}/img/svg/logo.svg" srcset="{{asset('/theme/')}}/img/svg/logo.svg 2x" alt="" /></a>
                            <button type="button" class="btn-close btn-close-white offcanvas-close offcanvas-nav-close" aria-label="Close"></button>
                        </div>

                    </div>
                    <h1 class="display-2 text-primary mb-4 mx-sm-n2 mx-md-0 text-center" id="LoginTitle">Sign In</h1>
                    <p style="width:54px; height:4px; position: absolute; left: Calc(50% - 27px); " class="bg-primary mt-2 text-center"></p>
                    <div class="ajaxLoading  w-100 text-center" style="display:none;"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>

                    <div id="" class="form-signin" style="padding-top: 30px;">
                        <div class="messages"></div>

                        <p id="MessageZone" class="message alert alert-danger " style="display:none;" ></p>

                        @if(Session::has('status'))
                            @if(session('status') =='success')
                                <p class="alert alert-success">
                                    {!! Session::get('message') !!}
                                </p>
                            @else
                                <p class="alert alert-danger">
                                    {!! Session::get('message') !!}
                                </p>
                            @endif
                        @endif

                        <ul class="parsley-error-list">
                            @foreach($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>



                        <div id="tab-sign-in" class="authentication-form">




                            {!! Form::open(array('url'=>'user/signin', 'class'=>'form-horizontal needs-validation','id'=>'ThreeDRendersForm' , 'parsley-validate'=>'','novalidate'=>' ')) !!}

                            <div class="form-group">
                                <label class="text-primary h6">Email Address:</label>
                                <input type="email" id="inputEmail" class="form-control"  name="email"  placeholder="" required autofocus>

                                <div class="invalid-feedback"> Please provide a valide email address. </div>
                            </div>
                            <div class="form-group mt-5">
                                <label class="text-primary h6">Password:</label>
                                <input type="password" id="inputPassword"  name="password" class="form-control" placeholder="" required>

                                <div class="invalid-feedback"> Please insert a valid password. </div>
                            </div>
                            <div class="row">

                                <div class="col-12 text-right">
                                    <a href="javascript:void(0)" class="forgot text-muted"> Forgot your password ? </a>
                                </div>
                            </div>

                            @if(config('threedrenders.cnf_recaptcha') =='true')
                                <div class="form-group has-feedback  animated fadeInLeft delayp1">
                                    <label class="text-left"> Are u human ? </label>
                                    <div class="g-recaptcha" data-sitekey="6Le2bjQUAAAAABascn2t0WsRjZbmL6EnxFJUU1H_"></div>
                                    <div class="clr"></div>
                                </div>
                            @endif
                            <div class="text-center mt-5 pl-3 pr-3">
                                <button class="btn  btn-primary w-75" type="submit">Sign In</button>
                            </div>







                            </form>
                        </div>


                        <div class=" m-t" id="tab-forgot" style="display: none">
                            {!! Form::open(array('url'=>'user/request', 'class'=>'form-vertical needs-validation', 'parsley-validate'=>'','novalidate'=>' ')) !!}
                            <div class="form-group has-feedback">
                                <div class="">
                                    <label class="text-primary h6">Email Address:</label>
                                    <input type="text" name="credit_email" placeholder="Please enter the email you use to sign in" class="form-control" required/>
                                    <div class="invalid-feedback"> Please enter the email you use to sign in </div>
                                </div>
                            </div>
                            <div class="form-group has-feedback text-center row mt-5 p-3">

                                <button type="submit" class="btn btn-sm  btn-primary col-12 "> Request password reset </button>
                                <a href="javascript:;" class="forgot btn btn-sm btn-warning col-12 mt-3"> Back to Sign in </a>
                            </div>

                            <div class="clr"></div>


                            </form>
                        </div>



                    </div>



                </div>
                <div class="col-md-4 "></div>
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container -->
    </section>
    <!-- /section -->
    @section('scripts')


    @stop

</div>
@include('layouts.default.footer')
@yield('scripts')
</body>

</html>