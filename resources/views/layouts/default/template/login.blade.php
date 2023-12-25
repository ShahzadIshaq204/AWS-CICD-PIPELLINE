<section class="wrapper bg-soft-primary">
    <div class="container pt-5 pb-15 py-lg-17 py-xl-19 pb-xl-20 position-relative">
        <img class="position-lg-absolute col-12 col-lg-6 col-xl-6 col-xxl-6 px-lg-5 px-xl-0 ms-n5 ms-sm-n8 ms-md-n10 ms-lg-0 mb-md-4 mb-lg-0" src="{{asset('theme')}}/img/concept/concept10.png" srcset="{{asset('theme')}}/img/concept/concept10@2x.png 2x" data-cue="fadeIn" alt=""  />
        <div class="row gx-0 align-items-center">
            <div class="col-md-10 offset-md-1 col-lg-5 offset-lg-7 offset-xxl-6 ps-xxl-12 mt-md-n9 text-center text-lg-start" data-cues="slideInDown" data-group="page-title" data-delay="600">
                <h1 class="display-2 mb-4 mx-sm-n2 mx-md-0" id="LoginTitle">Accédez à votre espace privé Threedrenders</h1>
                <div class="ajaxLoading  w-100 text-center" style="display:none;"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>

                <div class="form-signin">

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




                        {!! Form::open(array('url'=>'user/f/signin', 'class'=>'form-horizontal needs-validation','id'=>'LoginAjax' , 'parsley-validate'=>'','novalidate'=>' ')) !!}

                        <div class="form-group">
                            <input type="email" id="inputEmail" class="form-control"  name="email"  placeholder="Adresse email" required autofocus>

                            <div class="invalid-feedback"> Merci de renseigner votre mot adresse email. </div>
                        </div>
                        <div class="form-group mt-5">
                            <input type="password" id="inputPassword"  name="password" class="form-control" placeholder="Mot de passe" required>

                            <div class="invalid-feedback"> Merci de renseigner votre mot de passe. </div>
                        </div>
                        <div class="row">

                            <div class="col-12 text-right">
                                <a href="javascript:void(0)" class="forgot text-muted"> Mot de passe oublié ? </a>
                            </div>
                        </div>

                        @if(config('threedrenders.cnf_recaptcha') =='true')
                            <div class="form-group has-feedback  animated fadeInLeft delayp1">
                                <label class="text-left"> Are u human ? </label>
                                <div class="g-recaptcha" data-sitekey="6Le2bjQUAAAAABascn2t0WsRjZbmL6EnxFJUU1H_"></div>
                                <div class="clr"></div>
                            </div>
                        @endif
                        <div class="text-center mt-5">
                            <button class="btn  btn-primary w-100" type="submit">Connexion</button>
                        </div>




                        <div class=" pt-2 pb-2 " >
                            <p class="text-center text-muted ">
                                Vous n'avez pas de compte?
                                <a href="{{ url('user/f/register')}}">Créer votre compte </a>
                            </p>
                        </div>


                        </form>
                    </div>


                    <div class=" m-t" id="tab-forgot" style="display: none">
                        {!! Form::open(array('url'=>'user/f/request', 'class'=>'form-vertical needs-validation', 'parsley-validate'=>'','novalidate'=>' ')) !!}
                        <div class="form-group has-feedback">
                            <div class="">

                                <input type="text" name="credit_email" placeholder="Renseignez votre adresse email" class="form-control" required/>
                                <div class="invalid-feedback"> Merci de renseigner votre mot adresse email. </div>
                            </div>
                        </div>
                        <div class="form-group has-feedback text-center row mt-5 p-3">

                            <button type="submit" class="btn btn-sm  btn-primary col-12 "> Valider </button>
                            <a href="javascript:;" class="forgot btn btn-sm btn-warning col-12 mt-3"> Annuler </a>
                        </div>

                        <div class="clr"></div>


                        </form>
                    </div>



                </div>



            </div>
            <!-- /column -->
        </div>
        <!-- /.row -->
    </div>
    <!-- /.container -->
</section>
<!-- /section -->
@section('scripts')


@stop