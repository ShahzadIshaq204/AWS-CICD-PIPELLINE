<section class="wrapper bg-soft-primary">
    <div class="container pt-5 pb-15 py-lg-17 py-xl-19 pb-xl-20 position-relative">
        <img class="position-lg-absolute col-12 col-lg-10 col-xl-11 col-xxl-10 px-lg-5 px-xl-0 ms-n5 ms-sm-n8 ms-md-n10 ms-lg-0 mb-md-4 mb-lg-0" src="{{asset('theme')}}/img/concept/concept16.png" srcset="{{asset('theme')}}/img/concept/concept16@2x.png 2x" alt=""  data-cue="fadeIn" alt="" style="top: -1%; left: -21%;" />
        <div class="row gx-0 align-items-center">
            <div class="col-md-10 offset-md-1 col-lg-5 offset-lg-7 offset-xxl-6 ps-xxl-12 mt-md-n9 text-center text-lg-start" data-cues="slideInDown" data-group="page-title" data-delay="600">
                <h1 class="display-2 mb-4 mx-sm-n2 mx-md-0">Paramètres du compte</h1>
                <div class="d-flex justify-content-center justify-content-lg-start" data-cues="slideInDown" data-group="page-title-buttons" data-delay="900">
                    <span><a class="btn btn-primary btn-icon btn-icon-start rounded me-2" href="{{url('account')}}"><i class="uil uil-user-square"></i> Votre espace privé</a></span>
                    <span><a class="btn btn-danger btn-icon btn-icon-start rounded" href="{{url('user/logout')}}"><i class="uil uil-unlock-alt"></i> Déconnexion</a></span>
                </div>
            </div>
            <!-- /column -->
        </div>
        <!-- /.row -->
    </div>
    <!-- /.container -->
</section><section class="wrapper bg-light">
    <div class="container py-14 py-md-16">
        <div class="card bg-soft-primary">
            <div class="card-body p-12">
                <div class="row gx-md-8 gx-xl-12 gy-10">
                    <div class="col-md-6">
                        <div class="row">
                    <div class="col-12 mb-2">
                        <h6 class="title  text-primary">Informations personnelles</h6>
                    </div>
                    <div class="col-12 mb-2">
                        <div class="form-floating ">
                            <input name="firstname" id="firstname" onchange="saveUserinfos(1, $(this).val());" type="text" class="form-control" placeholder="Nom" value="{{$curUser->first_name}}">
                            <label for="firstname">Nom *</label>

                        </div>
                    </div>
                    <div class="col-12 mb-2">
                        <div class="form-floating ">
                            <input name="lastname" id="lastname" onchange="saveUserinfos(2, $(this).val());" type="text" class="form-control" placeholder="Prénom" value="{{$curUser->last_name}}">
                            <label for="lastname">Prénom *</label>

                        </div>
                    </div>
                    <div class="col-12 mb-2">
                        <div class="form-floating ">
                            <input name="email" id="email" type="email"
                                   class="form-control" placeholder=" "
                                   value="{{$curUser->email}}" disabled>
                            <label for="email">Email *</label>

                        </div>
                    </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="row">
                    <div class="col-12 mb-2">
                        <h6 class="title  text-primary">Sécurité</h6>
                    </div>

                    <div class="col-12 mb-2">
                        <div class="form-floating ">
                            <input name="actualpassword" id="edactual_password" type="password" minlength="6" maxlength="18" class="form-control" placeholder="Mot de passe actuel">
                            <label for="edactual_password">Mot de passe actuel *</label>

                        </div>
                    </div>

                    <div class="col-12 ">
                        <div class="form-floating ">
                            <input oninput=" pwdstrength($('#pwdprogressbar'), $(this).val())" name="password" id="edpwd" type="password" class="form-control" minlength="6" maxlength="18" placeholder=" ">
                            <img width="48" src=""  id="pwdImg" class="position-absolute" style=" right: 9px; top: 9px; display: none; ">
                            <label for="edpwd">Nouveau mot de passe *</label>

                        </div>
                    </div>
                    <div class="col-12 mb-2">
                    <div id="progressBar" class="bg-light rounded shadow mt-2" style=" height: 20px; ">
                        <div id="pwdprogressbar" style=" height: 20px; border-radius: 12px;"></div>
                    </div>
                    </div>

                    <div class="col-12 mb-2">
                        <div class="form-floating ">
                            <input name="password_confirmation" id="edpassword_confirmation" type="password" mminlength="6" maxlength="18" class="form-control" placeholder=" ">
                            <label for="edpassword_confirmation">Confirmation du nouveau mot de passe *</label>

                        </div>
                    </div>
                            <div class="col-12 mb-2">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="edshowpassword" onclick="showPwd(this)">
                        <label class="form-check-label" for="edshowpassword"> Afficher les mots de passe </label>
                    </div>
                            </div>


                    <div class="col-12 mb-2">
                        <a href="javascript:void(0);" onclick="resetPasswordp()" class="btn btn-primary w-100"><i class="mdi mdi-save-content"></i> Changer le mot de passe</a>
                    </div>
                        </div>
                    </div>


                </div>
                <!-- /.row -->
            </div>
            <!--/.card-body -->
        </div>
        <!--/.card -->
    </div>
    <!-- /.container -->
</section>
<!-- /section -->



@section('scripts')
    <script>
        function saveUserinfos(type='', value=''){

            if(type!='' && value!=''){
                url="{{url('user/saveinfos')}}/"+type;
                $.post(url,
                    {
                        data:value
                    },
                    function(data, status){

                        Swal.fire({
                            icon: data.status,
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            html:data.message,
                            timer: 1000,


                        });
                    });



            }else{

                Swal.fire({
                    icon: 'error',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    html:"Ce champs est obligatoire",
                    timer: 1000,


                });

            }

        }

        // change password
        //password strengh
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
            $('#edpwd').attr('type',$(e).is(':checked')?'text':'password');
            $('#edpassword_confirmation').attr('type',$(e).is(':checked')?'text':'password');
            $('#edactual_password').attr('type',$(e).is(':checked')?'text':'password');
        }
        function resetPasswordp(){
            var actualp=$('#edactual_password').val();
            var pwd=$('#edpwd').val();
            var cpwd=$('#edpassword_confirmation').val();
            msg='';
            if(actualp=='')msg=msg+"Le mot de passe actuel est un champs obligatoire<br>";
            if(pwd=='')msg=msg+"Le nouveau mot de passe  est un champs obligatoire<br>";
            if(cpwd=='' || cpwd!=pwd)msg=msg+"La confirmation du mot de passe n'est compatible avec le nouveau mot de passe";

            if(msg!=''){
                Swal.fire({
                    title: "Erreur",
                    html:msg,
                    imageUrl:"{{ asset('theme/img/pass_error.gif')}}",
                    imageWidth:120,
                    imageHeight:120,
                    allowOutsideClick:false,
                    showCancelButton: false,
                    confirmButtonColor: '#6bbea3',

                    confirmButtonText: "<i class='mdi mdi-check-circle'></i>D'accord",

                });

                return false;

            }


            var url="{{url('user/editpassword')}}";
            $.post(url,
                {
                    password:pwd,
                    password_confirmation:cpwd,
                    actual_password:actualp
                },
                function(data, status){



                    if(data.status=='success'){
                        var statussession = 'success';
                        var messagesession = "Le mot de passe a été modifié avec succès";

                        swalWithBootstrapButtons.fire({
                            icon: (statussession == 'success') ? '' : '',
                            text: messagesession,
                            confirmButtonText: "D'accord",

                            imageUrl: (statussession == 'error' || statussession == 'restric') ? '{{ asset('theme/img/pass_error.gif')}}' : '{{ asset('theme/img/pass_success.gif')}}',
                            imageWidth: 100,
                            imageHeight: 100,
                            showConfirmButton: true,

                            //timer: 5000
                        });
                        setTimeout(function(){
                            location.reload();
                        },2000);

                    }else{
                        Swal.fire({
                            icon: data.status,
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            html:data.message,
                            timer: 1000,


                        });
                    }


                });




        }
    </script>
@stop