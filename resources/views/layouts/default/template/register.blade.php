<section class="wrapper bg-soft-primary">
    <div class="container pt-5 pb-15 py-lg-17 py-xl-19 pb-xl-20 position-relative">
        <img class="position-lg-absolute col-12 col-lg-6 col-xl-6 col-xxl-6 px-lg-5 px-xl-0 ms-n5 ms-sm-n8 ms-md-n10 ms-lg-0 mb-md-4 mb-lg-0" src="{{asset('theme')}}/img/concept/concept10.png" srcset="{{asset('theme')}}/img/concept/concept10@2x.png 2x" data-cue="fadeIn" alt=""  />
        <div class="row gx-0 align-items-center">
            <div class="col-md-10 fs-13 offset-md-1 col-lg-5 offset-lg-7 offset-xxl-6 ps-xxl-12 mt-md-n9 text-center text-lg-start" data-cues="slideInDown" data-group="page-title" data-delay="600">
                <h1 class="display-2 mb-4 mx-sm-n2 mx-md-0" id="LoginTitle">Créer votre compte</h1>
                <h3>Important</h3>
                <p>Lorsque vous cr&eacute;ez un compte Threedrenders, vous ne pouvez pas acc&eacute;der &agrave; votre tableau de bord <span class="underline orange">avant la validation de votre compte par l'adminisatraion</span> de la Direction du M&eacute;dicament et de la Pharmacie.</p>
                <p>Un email vous serai envoy&eacute; pour confirmer la validation de votre compte.</p>
                <p>Les donn&eacute;es fournies restent personnelles, la Direction d M&eacute;dicament et de la Pharmacie g&egrave;re vos informations de mani&egrave;re confidentielle et selon les dispositions de la l&eacute;gislation et la r&eacute;glementation en vigueur en mati&egrave;re de protection des donn&eacute;es personnelles.</p>
                <p>Toutefois, les donn&eacute;es et documents fournis dans le cadre de votre inscription au service en ligne mis &agrave; la disposition de nos clients, seront pris &agrave; titre d&eacute;claratif, ainsi tout usage frauduleux ou toute usurpation d'identit&eacute; sera directement conduite devant les tribunaux comp&eacute;tents.</p>
                <p>Nous invitons les utilisateurs de prendre le soins de renseigner les informations appropri&eacute;es et joindre les documents justifiant leur statut au sein de l'&eacute;tablissement concern&eacute; ainsi que l'autorisation ou la d&eacute;claration de ce dernier.</p>

                <a onclick="goToByScroll('registerForm', true)" class="btn btn-primary rounded-pill  mb-3 w-100" > Créer mon compte </a>


            </div>

        </div>

    </div>

</section>

<section class="wrapper bg-light" id="registerForm">
    <div class="container py-14 py-md-16">
        <div class="row">
            <div class="col-xl-10 mx-auto">
                <div class="row gy-10 gx-lg-8 gx-xl-12">
                    <div class="col-lg-12">
                        <form id="ThreedrendersForm" class="contact-form needs-validation" method="post" action="{{url('user/create')}}" novalidate>
                            <div class="messages"></div>
                            <div class="row gx-4">
                                <div class="col-md-6">
                                    <div class="form-floating mb-4">
                                        <input id="lastname" type="text" name="lastname" class="form-control" placeholder="Jane" required>
                                        <label for="lastname">Nom *</label>

                                        <div class="invalid-feedback">
                                            Merci de renseigner votre nom
                                        </div>
                                    </div>
                                </div>
                                <!-- /column -->
                                <div class="col-md-6">
                                    <div class="form-floating mb-4">
                                        <input id="firstname" type="text" name="firstname" class="form-control" placeholder="Doe" required>
                                        <label for="firstname">Prénom *</label>
                                        <div class="invalid-feedback">
                                            Merci de renseigner votre prénom
                                        </div>
                                    </div>
                                </div>
                                <!-- /column -->
                                <div class="col-md-6">
                                    <div class="form-floating mb-4">
                                        <input id="form_email" type="email" name="email" class="form-control" placeholder="jane.doe@example.com" required>
                                        <label for="form_email">Email *</label>

                                        <div class="invalid-feedback">
                                            Merci de renseigner une adresse email valide
                                        </div>
                                    </div>
                                </div>
                                <!-- /column -->
                                <div class="col-md-6">
                                    <div class="form-select-wrapper">
                                        <div class="form-floating mb-4">
                                        <select class="form-select" id="form-select" name="question" required>
                                            <option selected disabled value="">---</option>
                                            <option value="1">Ami d'enfance</option>
                                            <option value="2">Livre préféré</option>
                                            <option value="3">Film préféré</option>
                                            <option value="4">Plat préféré</option>
                                        </select>
                                            <label for="form_email">Question secrète *</label>
                                        <div class="invalid-feedback">
                                            Merci de sélectionner une question
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- /column -->
                                <div class="col-12">
                                    <div class="form-floating mb-4">
                                        <input id="reponse" type="text" name="reponse" class="form-control" maxlength="50" placeholder=" " required>
                                        <label for="reponse">Réponse à la question secrète *</label>

                                        <div class="invalid-feedback">
                                            Merci de renseigner une réponse
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 ">
                                    <div class="form-floating ">
                                        <input oninput="pwdstrength($('#pwdprogressbar'), $(this).val())" name="password" id="password" type="password" class="form-control" minlength="6" maxlength="18" placeholder=" " required>

                                        <img width="48" src=""  id="pwdImg" class="position-absolute" style=" right: 9px; top: 9px; display: none; ">
                                        <label for="password">Mot de passe *</label>
                                        <div class="invalid-feedback">
                                            Merci de renseigner un mot de passe valide
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 mb-2">
                                    <div id="progressBar" class="bg-light rounded shadow mt-2" style=" height: 20px; ">
                                        <div id="pwdprogressbar" style=" height: 20px; border-radius: 12px;"></div>
                                    </div>
                                </div>

                                <div class="col-12 mb-2">
                                    <div class="form-floating ">
                                        <input name="password_confirmation" id="edpassword_confirmation" type="password" minlength="6" maxlength="18" class="form-control" placeholder=" " required>
                                        <label for="edpassword_confirmation">Confirmation du  mot de passe *</label>
                                        <div class="invalid-feedback">
                                            Merci de confirmer le mot de passe
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 mb-2">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="edshowpassword" onclick="showPwd(this)">
                                        <label class="form-check-label" for="edshowpassword"> Afficher les mots de passe </label>
                                    </div>
                                </div>
                                <div class="form-group col-md-6">
                                    <img class="rounded shadow" id="captcha" src="{{url('get/captcha')}}" width="130">

                                    <a href="javascript:void(0);" class="text-primary p-1" onclick="$('#captcha').attr('src' ,'{{url('get/captcha')}}?v=' + Math.random()); $('#captcha_code_input').val('');return false;"><i class="uil uil-refresh"></i></a>
                                    <a href="javascript:void(0);" class="text-primary p-1" onclick="play();"><i class="uil uil-volume"></i></a>
                                </div>
                                <div class="form-group col-md-6">
                                    <input id="captcha_code_input" type="text" class="form-control pl-5"  name="captcha" placeholder="Saisir le code (*)" required="" maxlength="5">
                                    <div class="invalid-feedback">
                                        Merci de saisir le code de sécurité
                                    </div>
                                </div>
                                <!-- /column -->
                                <div class="col-12">
                                    <div class="form-check mb-4">
                                        <input class="form-check-input" type="checkbox" name="terms" value="accepted" id="invalidCheck" required>
                                        <label class="form-check-label" for="invalidCheck">
                                            J'accepte <a href="#" class="hover">Les conditions d'utilisation</a>.<br>
                                            <small>Les informations recueillies sur cette page font l’objet d’un traitement destiné à une validation création de compte.<br>
                                                Conformément à la loi n° 09-08 vous bénéficiez d’un droit d’accès et de rectification aux informations qui vous concernent, que vous pouvez exercer en vous adressant à : privacy@threedrenders.sante.gov.ma</small>
                                        </label>
                                        <div class="invalid-feedback">
                                            Vous devez accepter les conditions pour enregistrer votre inscription.
                                        </div>
                                    </div>
                                </div>
                                <!-- /column -->
                                <div class="col-12 text-center">
                                    <input type="submit" class="btn btn-primary rounded-pill btn-send mb-3 w-100" value="Créer mon compte">
                                    <p class="text-muted"><strong>*</strong> Ces champs sont obligatoires.</p>
                                </div>
                                <!-- /column -->
                            </div>
                            <!-- /.row -->
                        </form>
                        <!-- /form -->
                    </div>

                </div>
                <!--/.row -->
            </div>
            <!-- /column -->
        </div>
        <!-- /.row -->
    </div>
    <!-- /.container -->
</section>
<!-- /section -->

@section('scripts')

<script>

    function pwdstrength (element, password){
        var desc = [{'width':'0px'}, {'width':'20%'}, {'width':'40%'}, {'width':'60%'}, {'width':'80%'}, {'width':'100%'}];
        var descClass = ['', 'bg-danger',  'bg-orange', 'bg-warning',  'bg-green', 'bg-success'];
        var score = 0;


        if(password.length > 6){
            score++;
        }

        if (password.match(/[a-z]/)){
            score++;
        }

        if(password.match(/[A-Z]/)){
            score++;
        }

        if(password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)){
            score++;
        }

        if (password.length > 5){
            score++;
        }

        console.log(imgShown);
        element.removeClass( descClass[score-1] ).addClass( descClass[score] ).css( desc[score] );

        if(score>=4 ){
            if(imgShown==0){

            $('#pwdImg').attr('src','{{ asset('theme/img/pass_success.gif')}}?v=' + Math.random());
            $('#pwdImg').show();
                imgShown=1;
            }

        } else{

            $('#pwdImg').attr('src',' ');
            $('#pwdImg').hide();
            imgShown=0;
        }
    }


    function showPwd(e){

        $('#edpassword_confirmation').attr('type',$(e).is(':checked')?'text':'password');
        $('#password').attr('type',$(e).is(':checked')?'text':'password');
    }

    function play() {

        var audio = new Audio('{{url('getaudiocaptcha')}}?v=' + Math.random());
        audio.play();
    }

    window.onload = () => {
        const edpassword_confirmation = document.getElementById('edpassword_confirmation');
        edpassword_confirmation.onpaste = e => e.preventDefault();
    }
</script>
@stop