<style>
    .modal-image-thumb{
        width: 100%;
        height: 400px;
        border-radius: 6px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
    }
</style>

<section class="wrapper bg-soft-primary h-100">
    <div class="container pb-15  position-relative">
        <div class="row gx-0 align-items-center">
            <img src="{{asset('/theme/')}}/img/svg/logo.svg" class=" col-lg-2 col-md-3 col-6 py-5"
                 srcset="{{asset('/theme/')}}/img/svg/logo.svg" alt="3drenders logo"/>
            <div class="col-md-12 text-center text-lg-start" >
                <div class="d-flex align-items-center justify-content-between">
                    <h3 class="mx-md-0">Feedback Tool</h3>
                    <div class="ml-auto">
                        <button type="button" onclick="goBackOffice()" class="btn btn-primary">
                            Admin panel
                        </button>
                    </div>
                </div>
              

                <div class="mb-6">
                    <div class="row text-start align-items-end">
                        <div class="col-lg-4 mb-3 mb-lg-0">
                            <label for="project_ref" class="form-label">Project id</label>
                            <input type="text" class="form-control" id="project_ref_input" aria-describedby="emailHelp">
                        </div>
                        <div class="col-lg-4 mb-3 mb-lg-0">
                            <label for="project_name" class="form-label">Project name</label>
                            <input type="text" class="form-control" id="project_name_input">
                        </div>

                        <div class="modal fade" id="imageViewerModal" tabindex="-1" aria-labelledby="" aria-hidden="true">
                            <div class="modal-dialog modal-lg modal-dialog-centered">
                                <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title"></h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="modal-image-thumb">
                                    </div>      
                                </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <input type="file" name="files" class="files" id="MainInputFile">
            </div>
            <div class="col-12 text-center mt-6 d-none" id="sharedLink">
               <div class="d-flex align-items-center align-content-center justify-content-center">
                   <input class="form-control w-50 bg-white text-primary font-weight-normal fs-13  copyInput" id="copyInput" type="text" tabindex="0" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top"  data-bs-content="This link has been copied to your clipboard" disabled value="{{url('annotations/getproject/'.$session_id)}}" >
                   <span style=" width: 20px; "></span>
                   <button class="border-0 rounded  btn-primary ml-n5 copyBtn"  onclick="copyToClipboard();"  id="copyBtn">Copy link</button>
                   <a href="{{url('account/deletesession')}}"><button class="border-0 rounded  btn-primary ml-n5 d-none copyBtn"  id="restSession">New request</button></a>
               </div>
            </div>
            
            <!-- /column -->
        </div>
        <!-- /.row -->
    </div>
    <!-- /.container -->
</section>


@section('scripts')
    <script>
        var $fileuploader = null;
        var uploadedFiles = [];

       
        async function goBackOffice(){
            await $.get('{{url('account/auth')}}', null, function(result) {
                try { 
                    const uri = encodeURIComponent(btoa(JSON.stringify(result)))
                    // todo
                    window.open('{{config('app.admin_url')}}' + "/auth?token="+uri, "_blank");
                    // window.open("http://localhost:3000/auth?token="+uri, "_blank");
                } catch(e) { 
                    console.log(e); 
                }
            });
        }

        async function fetchUploadedFiles(){
            await $.get('{{url('account/getfileslist/'.$session_id)}}', null, function(result) {
                try { 
                    uploadedFiles = result.map(file => {
                        delete file.data; return file;
                    }) 
                } catch(e) { 
                    console.log(e); 
                    // todo reload page 
                }
            });
        }

        function buildSelectOption(item) {
            // todo show created_at field
            const imageUrl = '{{url('uploads/proofs/')}}/'+ item.filePath
            return `<option value="${item.id}" data-img-url="${imageUrl}">${item.oldname} - ${item?.created_at?.split(" ")?.[0]}</option>`
        }

        function getMatchingUploadedFiles(payload){
            $.post('{{url('account/project/matching-files/')}}', payload, function(response) {
                try {
                    for(let i=0; i < response.uploaded_files.length; i++){
                        let options = "<option value='' selected>--- select a image to compare with ---</option>";
                        const uploadedFile = response.uploaded_files[i]
                        for( let j=0; j < uploadedFile.matched_files.length; j++ ){
                            options += buildSelectOption(uploadedFile.matched_files[j])
                        }
                        
                        if(uploadedFile.matched_files.length){
                            $("#matching-files-container__"+uploadedFile.id).removeClass("d-none")
                        }else{
                            $("#matching-files-container__"+uploadedFile.id).addClass("d-none")
                        }
                        $("#matching-files-select__"+uploadedFile.id).html(options) 
                    }
                    console.log(response, "response")
                } catch(e) {
                    console.log(e); // todo reload page 
                }
            });
        }
    
        async function addProjectSession(projectFormValues){
            const updatedUploadedFiles = [...uploadedFiles.map(file => {
                let selectedOption = $(`#matching-files-select__${file.id} :selected`).val()
                selectedOption = selectedOption ? parseInt(selectedOption) : null
                return {...file, before_upload_file_id : selectedOption}
            })]
            // todo trigger alert when some option are not selected 

            const payload = { "project": projectFormValues, "uploaded_files": updatedUploadedFiles}            
            $.post('{{url('account/project/add-files/')}}', payload, function(response) {});
        }

        function initFormValues(){
            $("#project_ref_input").val("")
            $("#project_name_input").val("")
        }

    $(document).ready(async function() {
        // todo fix issues on refresh page 
        // todo add debounce on input typing
       
        // clear inputs on page load       
        initFormValues()

        // fetch uploaded files 
        await fetchUploadedFiles();
        // todo when project exist fill projectId and fetch files matched with seleted before version

        $("#project_ref_input").on("input", function() {
            const projectRefValue = $(this).val(); 
            const payload = { "project_ref" : projectRefValue, "uploaded_files" : uploadedFiles}
            if(projectRefValue && uploadedFiles.length){
                getMatchingUploadedFiles(payload)
            }else{
                for(let i=0; i < uploadedFiles.length; i++){
                    $("#matching-files-select__"+uploadedFiles[i].id).html("") 
                    $("#matching-files-container__"+uploadedFiles[i].id).addClass('d-none') 
                }
            }
        });

        $("#imageViewerModal").on('hidden.bs.modal', function (event) {
            $('.modal-title').text("")
            $('.modal-image-thumb').css("background-image", ``)
        })


    // enable fileuploader plugin
     $fileuploader =$('input[name="files"]').fileuploader({
        fileMaxSize: 20,
        extensions: ['image/*'],
    changeInput: ' ',
    theme: 'thumbnails',
    enableApi: true,
    removeConfirmation: true,
    addMore: true,
    thumbnails: {
    box: '<div class="fileuploader-items w-100">' +
        '<div class="fileuploader-thumbnails-input" style="width:Calc(100% - 16px); min-height: 450px; margin:0;"><div class="fileuploader-thumbnails-input-inner h-100"><div id="uploaderHint"><svg width="60" height="44" viewBox="0 0 60 44" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M46.8819 43.8285H37.1843H34.5729H34.009V30.8207H38.2632C39.3421 30.8207 39.9796 29.5947 39.3421 28.712L31.0666 17.2613C30.5394 16.5257 29.4483 16.5257 28.9211 17.2613L20.6457 28.712C20.0082 29.5947 20.6334 30.8207 21.7246 30.8207H25.9787V43.8285H25.4148H22.8034H11.5611C5.12464 43.473 0 37.4534 0 30.9311C0 26.4317 2.43972 22.5085 6.0564 20.3876C5.72538 19.4926 5.55374 18.5363 5.55374 17.531C5.55374 12.9335 9.26849 9.21877 13.866 9.21877C14.859 9.21877 15.8153 9.39041 16.7103 9.72143C19.3707 4.08187 25.1083 0.170959 31.7777 0.170959C40.4087 0.183219 47.5194 6.79131 48.3286 15.2139C54.9612 16.354 60 22.4963 60 29.4476C60 36.8771 54.2133 43.3136 46.8819 43.8285Z" fill="#0F7173"/> </svg><br><span class="text-primary h6">Drag and Drop or <br>Select a file to Upload</span><br><span class="text-muted fs-12">Supported format: JPEG, PNG</span></div></div></div>' +
        '<ul class="fileuploader-items-list p-2" style="max-height: 450px; min-height: 310px; overflow: auto" scrollbar>' +
        '</ul>' +
        '</div>',
    item: '<li class="fileuploader-item">' +
        '<div class="fileuploader-item-inner">' +
            '<div class="type-holder">${extension}</div>' +
            '<div class="actions-holder">' +
                '<button type="button" class="fileuploader-action fileuploader-action-remove" title="${captions.remove}"><i class="uil uil-times text-red"></i></button>' +
                '</div>' +
            '<div class="thumbnail-holder">' +
                '${image}' +
                '<span class="nfileuploader-action-popup"></span>' +
            '</div>' +
            '<div class="content-holder"><h5>${name}</h5><span>${size2}</span></div>' +
            '<div class="progress-holder">${progressBar}</div>' +
            `<div class="matching-files-container d-flex align-items-center gap-2 my-2">
                <select class="matching-files-select form-select form-select-sm">
                </select>
                <button type="button" class="image-viewer-btn btn p-2 text-white" 
                    style="background-color: #0F7173;"
                >
                    Show
                </button>
            </div>` +
            '</div>' +
        '</li>',
    item2: '<li class="fileuploader-item">' +
        '<div class="fileuploader-item-inner">' +
            '<div class="type-holder">${extension}</div>' +
            '<div class="actions-holder">' +
                '<a href="${file}" class="fileuploader-action fileuploader-action-download" title="${captions.download}" download><i class="fileuploader-icon-download"></i></a>' +
                '<button type="button" class="fileuploader-action fileuploader-action-remove" title="${captions.remove}"><i class="uil uil-times text-red"></i></button>' +
                '</div>' +
            '<div class="thumbnail-holder">' +
                '${image}' +
                '<span class="nfileuploader-action-popup"></span>' +
            '</div>' +
            '<div class="content-holder"><h5 title="${name}">${name}</h5><span>${size2}</span></div>' +
            '<div class="progress-holder">${progressBar}</div>' +
            '</div>' +
        '</li>',
    startImageRenderer: true,
    canvasImage: false,
    _selectors: {
    list: '.fileuploader-items-list',
    item: '.fileuploader-item',
    start: '.fileuploader-action-start',
    retry: '.fileuploader-action-retry',
    remove: '.fileuploader-action-remove'
    },
    onItemShow: function(item, listEl, parentEl, newInputEl, inputEl) {
    var plusInput = listEl.find('.fileuploader-thumbnails-input'),
    api = $.fileuploader.getInstance(inputEl.get(0));
    $('.fileuploader-thumbnails-input-inner').css('background','transparent');
    $('.fileuploader-thumbnails-input').css({"min-height":"200px"});
    //  plusInput.insertBefore(item.html)[api.getOptions().limit && api.getChoosedFiles().length >= api.getOptions().limit ? 'hide' : 'show']();

    if(item.format == 'image') {
    item.html.find('.fileuploader-item-icon').hide();
    }
    },
    onItemRemove: function(html, listEl, parentEl, newInputEl, inputEl) {
    var plusInput = listEl.find('.fileuploader-thumbnails-input'),
    api = $.fileuploader.getInstance(inputEl.get(0));

    html.children().animate({'opacity': 0}, 200, function() {
    html.remove();

    if (api.getOptions().limit && api.getChoosedFiles().length - 1 < api.getOptions().limit)
    plusInput.show();


    if(api.getChoosedFiles().length==0 && api.getAppendedFiles().length==0){
    $('.fileuploader-thumbnails-input-inner').css('background','rgba(15, 113, 115, 0.1)');
    $('.fileuploader-thumbnails-input').css({"min-height":"400px"});
        $('#sharedLink').addClass('d-none');
    }else{
        $('#sharedLink').removeClass('d-none');
    }
    });
    }
    },
    dragDrop: {
    container: '.fileuploader-thumbnails-input'
    },
    afterRender: function(listEl, parentEl, newInputEl, inputEl) {
    var plusInput = $('.fileuploader-thumbnails-input'),
    api = $.fileuploader.getInstance(inputEl.get(0));

    plusInput.on('click', function() {
    api.open();
    });

    api.getOptions().dragDrop.container = plusInput;
    },


    // while using upload option, please set
    // startImageRenderer: false
    // for a better effect
    upload: {
    url: '{{url('account/addfiles')}}',
    data: null,
    type: 'POST',
    enctype: 'multipart/form-data',
    start: true,
    synchron: true,
    beforeSend: null,

    onSuccess: function(result, item) {

        $('#sharedLink').removeClass('d-none');
    var data = {};

    if (result && result.files)
    data = result;
    else
    data.hasWarnings = true;

    // if success
    if (data.isSuccess && data.files.length) {
        item.name = data.files[0].name;
        item.filename = data.files[0].filename;
        item.html.find('.content-holder > h5').text(item.filename).attr('title', item.name);

        // matching files dropdown
        item.html.find('.image-viewer-btn').attr('id', "image-viewer-btn__" + data.files[0].id);
        item.html.find('.matching-files-select').attr('id', "matching-files-select__" + data.files[0].id);
        item.html.find('.matching-files-container').attr('id', "matching-files-container__" + data.files[0].id);
        $("#matching-files-container__" + data.files[0].id).addClass('d-none');

        // update files list
        uploadedFiles.push(data.files[0])
        // get matching files 
        if($("#project_ref_input").val()){
            const payload = { 
                "project_ref" : $("#project_ref_input").val(), 
                "uploaded_files" : data.files
            }
            getMatchingUploadedFiles(payload) 
        }

        // modal image viewer 
        $("#image-viewer-btn__" + data.files[0].id).on("click", function() {
            const selectedOption = $(`#matching-files-select__${data.files[0].id} :selected`)
            const uploadImageUrl = selectedOption?.attr("data-img-url")
            const modalTitle = selectedOption?.text()

            if(uploadImageUrl){
                $('.modal-title').text(modalTitle)
                $('.modal-image-thumb').css("background-image", `url("${uploadImageUrl}")`)
                $("#imageViewerModal").modal('show')
            }else{
                alert("No image selected!")
            }
        });
       
    }

    // if warnings
    if (data.hasWarnings) {
    for (var warning in data.warnings) {
    alert(data.warnings[warning]);
    }

    item.html.removeClass('upload-successful').addClass('upload-failed');
    return this.onError ? this.onError(item) : null;
    }

    item.html.find('.fileuploader-action-remove').addClass('fileuploader-action-success');

    setTimeout(function() {
    item.html.find('.progress-holder').hide();
    item.renderThumbnail();

    item.html.find('.fileuploader-action-popup, .fileuploader-item-image').show();
    }, 400);
        $(window).off('beforeunload');
    },
    onError: function(item) {
    item.html.find('.progress-holder, .fileuploader-action-popup, .fileuploader-item-image').hide();
    },
    onProgress: function(data, item) {
    var progressBar = item.html.find('.progress-holder');

    if(progressBar.length > 0) {
    progressBar.show();
    progressBar.find('.fileuploader-progressbar .bar').width(data.percentage + "%");
    }

    item.html.find('.fileuploader-action-popup, .fileuploader-item-image').hide();
        $(window).on('beforeunload', function (e)
        {
            return "Data will be lost if you leave the page, are you sure?";
        });

    }
    },
    onRemove: function(item) {
        $.post('{{url('account/deletefile')}}/'+item.name+'/{{$session_id}}', {} ,function(response) {
            uploadedFiles = uploadedFiles.filter(file => !file.name.includes(item.name))
        });
    }

    })

        // preload the files // todo fixme ( customize item2 upload on success )
        $.get('{{url('account/getfileslist/'.$session_id)}}', null, function(result) {
            var api = $.fileuploader.getInstance($fileuploader),
                preload = [];

            try {
                // preload the files
                preload = result;

                api.append(preload);
                // console.log(JSON.stringify(result));
                if(JSON.stringify(result)=="[]"){
                    $('#sharedLink').addClass('d-none');
                } else{
                    $('#sharedLink').removeClass('d-none');
                    var plusInput = $('.fileuploader-thumbnails-input');
                    plusInput.hide(500);
                }
            } catch(e) {

                console.log(e);
            }
        });

        Scrollbar.initAll({

            // Momentum reduction damping factor, a float value between (0, 1)
            damping: .1,

            // Minimal size for scrollbar thumb.
            thumbMinSize: 20,

            // Render scrolling by integer pixels
            renderByPixels: true,

            // Whether allow upper scrollable content to continue scrolling when current scrollbar reaches edge.
            // When set to 'auto', it will be enabled on nested scrollbars, and disabled on first-class scrollbars.
            continuousScrolling: 'auto',

            // Keep scrollbar tracks always visible.
            alwaysShowTracks: false,

            // Element to be used as a listener for mouse wheel scroll events.
            // By default, the container element is used.
            wheelEventTarget: null,

            // plugins
            plugins: {}

        });


    });

        function copyToClipboard() {
            var dummy = document.createElement("textarea");
            var text="{{url('annotations/getproject/'.$session_id)}}";
            document.body.appendChild(dummy);
            dummy.value = text;
            dummy.select();
            document.execCommand("copy");
            document.body.removeChild(dummy);
            var toast = new iqwerty.toast.Toast();
           // toast.setText('Link is copied').setDuration(2000).show();

            setTimeout(function () {
                // window.location.href = '{{url('account/deletesession')}}';
                $('#copyInput').popover('show')

                $('#MainInputFile').attr('disabled','true');
                $('#restSession').removeClass('d-none');
                $('#copyBtn').addClass('d-none');
                $('.popover').addClass('popover-custom');
                var plusInput = $('.fileuploader-thumbnails-input');
                plusInput.hide(500);

                // add new project session
                const projectRefValue = $("#project_ref_input").val();
                const projectNameValue = $("#project_name_input").val();
                addProjectSession({
                    "project_ref": projectRefValue,
                    "project_name": projectNameValue
                })

                // disable all dropdown and inputs
                $(".matching-files-select").attr("disabled", "disabled");
                $("#project_ref_input").attr("disabled", "disabled");
                $("#project_name_input").attr("disabled", "disabled");
            },200);


        }



    </script>
@stop