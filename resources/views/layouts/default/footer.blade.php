
<div class="progress-wrap">
    <svg class="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
        <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
    </svg>
</div>

<div class="modal fade" id="mainModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-md">
        <div class="modal-content text-center">
            <div class="modal-body">
                <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                <div id="mainModalContent"></div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="loginModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content text-center">
            <div class="modal-body">
                <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                <h3 class="mb-4 LoginTitle">Accédez à votre espace privé 3drenders</h3>
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
                {!! Form::open(array('url'=>'user/f/signin', 'class'=>'form-horizontal needs-validation','id'=>'LoginAjax' , 'parsley-validate'=>'','novalidate'=>' ','onsubmit'=>'return false;')) !!}
                <div class="form-floating mb-4">
                    <input type="email" class="form-control" name="email" placeholder="Email" id="loginEmail" required>
                    <label for="loginEmail">Email</label>
                    <div class="invalid-feedback"> Merci de renseigner votre mot adresse email. </div>
                </div>
                <div class="form-floating mb-4">
                    <input type="password" class="form-control" name="password" placeholder="Mot de passe" id="loginPassword" required>
                    <label for="loginPassword">Mot de passe</label>
                    <div class="invalid-feedback"> Merci de renseigner votre mot de passe. </div>
                </div>
                <button class="btn btn-primary rounded-pill btn-login w-100 mb-2" type="submit">Connexion</button>

                </form>
                <!-- /form -->
                <p class="mb-1"><a href="javascript:void(0);" class="hover">Forgot Password?</a></p>
                <p class="mb-0">Vous n'avez pas de compte? <a href="{{ url('user/f/register')}}" class="hover">S'inscrire</a></p>

            </div>
            <!--/.modal-content -->
        </div>
        <!--/.modal-body -->
    </div>
    <!--/.modal-dialog -->
</div>
<!--/.modal -->

<div class="modal fade modal-bottom-center" id="cookiesModal" tabindex="-1">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-body p-6">
                <div class="row">
                    <div class="col-md-12 col-lg-8 my-auto align-items-center">
                        <h4 class="mb-2">Politique des cookies</h4>
                        <p class="mb-0">En poursuivant votre navigation sur ce site, vous acceptez l'utilisation de cookies &agrave; des fins statistiques.&nbsp;<a tabindex="0" href="{{url('static/politique-de-cookies')}}" target="_blank">En savoir plus</a></p>
                    </div>
                    <!--/column -->
                    <div class="col-md-5 col-lg-4 text-md-end my-auto">
                        <a href="#" class="btn btn-primary rounded-pill" data-bs-dismiss="modal" aria-label="Close" onclick="createCookie('cookiesAccepted', true, 365)">J'accepte</a>
                    </div>
                    <!--/column -->
                </div>
                <!--/.row -->
            </div>
            <!--/.modal-body -->
        </div>
        <!--/.modal-content -->
    </div>
    <!--/.modal-dialog -->
</div>
<!--/.modal -->

<script src="{{asset('/theme/')}}/dist/bootstrap.bundle.min.js"></script>
<script src="{{asset('/theme/')}}/dist/jquery-3.5.1.min.js"></script>


<script src="{{asset('/theme/')}}/js/plugins.js"></script>
<script src="{{asset('/theme/')}}/js/theme.js"></script>
<script src="{{asset('/theme/')}}/js/jquery.form.js"></script>
<script src="{{asset('/theme/')}}/js/sweetalert2.all.min.js"></script>
<script src="{{asset('/theme/')}}/dist/jquery.fileuploader.min.js"></script>
<script src="{{asset('/theme/')}}/dist/toast.js"></script>
<script src="{{asset('/theme/')}}/dist/smooth-scrollbar.js"></script>
<script src="{{asset('/theme/')}}/annotations/js/jquery.webui-popover.min.js"></script>
<script src="{{asset('/theme/')}}/annotations/js/jquery.editable.js"></script>
<script type="text/javascript">
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    });

    @if(\Session::has('status'))



    var statussession = '{{session('status')}}';
    var messagesession = "{!! Session::get('message') !!}";
    var titlesession = '{!! session('title') !!}';


    swalWithBootstrapButtons.fire({
        title:titlesession,
        html: messagesession,
        showCloseButton: true,
        confirmButtonText: "@Lang('core.ok')",

        showConfirmButton: false,

        //timer: 5000
    });
    @endif

    $(document).ready(function(){

        $('.forgot').on('click',function(){
            $('#tab-forgot').toggle();
            $('#tab-sign-in').toggle();
            $('#LoginTitle').html()=='Sign In'?$('#LoginTitle').html('Reset your password'):$('#LoginTitle').html('Sign In');
        })



    });



    function goTolink(url){
        window.location.href = url;
    }


    function goToByScroll(id, timeout=false) {
        // Remove "link" from the ID
        id = id.replace("link", "");
        // Scroll
        if(timeout){
            setTimeout(function () {
                $('html,body').animate({
                    scrollTop: $("#" + id).offset().top
                }, 'slow');
            },500)
        }else{

        }
    }

    function createCookie(name, value, days) {
        var expires;

        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
    }

    function readCookie(name) {
        var nameEQ = encodeURIComponent(name) + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0)
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    function eraseCookie(name) {
        createCookie(name, "", -1);
    }


</script>
