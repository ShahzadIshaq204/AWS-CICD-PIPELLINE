$(document).ready(function() {
	
	// enable fileuploader plugin
	$('input[name="files"]').fileuploader({
        extensions: null,
		changeInput: ' ',
		theme: 'thumbnails',
        enableApi: true,
		addMore: true,
		thumbnails: {
			box: '<div class="fileuploader-items w-100">' +
                      '<ul class="fileuploader-items-list">' +
					      '<li class="fileuploader-thumbnails-input" style="width:Calc(100% - 16px); min-height: 450px;"><div class="fileuploader-thumbnails-input-inner"><div id="uploaderHint"><svg width="60" height="44" viewBox="0 0 60 44" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M46.8819 43.8285H37.1843H34.5729H34.009V30.8207H38.2632C39.3421 30.8207 39.9796 29.5947 39.3421 28.712L31.0666 17.2613C30.5394 16.5257 29.4483 16.5257 28.9211 17.2613L20.6457 28.712C20.0082 29.5947 20.6334 30.8207 21.7246 30.8207H25.9787V43.8285H25.4148H22.8034H11.5611C5.12464 43.473 0 37.4534 0 30.9311C0 26.4317 2.43972 22.5085 6.0564 20.3876C5.72538 19.4926 5.55374 18.5363 5.55374 17.531C5.55374 12.9335 9.26849 9.21877 13.866 9.21877C14.859 9.21877 15.8153 9.39041 16.7103 9.72143C19.3707 4.08187 25.1083 0.170959 31.7777 0.170959C40.4087 0.183219 47.5194 6.79131 48.3286 15.2139C54.9612 16.354 60 22.4963 60 29.4476C60 36.8771 54.2133 43.3136 46.8819 43.8285Z" fill="#0F7173"/> </svg><br><span class="text-primary h6">Drag and Drop or <br>Select a file to Upload</span><br><span class="text-muted fs-12">Supported format: JPEG, PNG</span></div></div></li>' +
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
                               '<span class="fileuploader-action-popup"></span>' +
                           '</div>' +
                           '<div class="content-holder"><h5>${name}</h5><span>${size2}</span></div>' +
                       	   '<div class="progress-holder">${progressBar}</div>' +
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
                               '<span class="fileuploader-action-popup"></span>' +
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

                    if(api.getChoosedFiles().length==0){
						$('.fileuploader-thumbnails-input-inner').css('background','rgba(15, 113, 115, 0.1)');
						$('.fileuploader-thumbnails-input').css({"min-height":"400px"});
					}
                });
            }
		},
        dragDrop: {
			container: '.fileuploader-thumbnails-input'
		},
		afterRender: function(listEl, parentEl, newInputEl, inputEl) {
			var plusInput = listEl.find('.fileuploader-thumbnails-input'),
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
				var data = {};
				
				if (result && result.files)
                    data = result;
                else
					data.hasWarnings = true;
                
				// if success
                if (data.isSuccess && data.files.length) {
                    item.name = data.files[0].name;
					item.html.find('.content-holder > h5').text(item.name).attr('title', item.name);
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
            }
        },
		onRemove: function(item) {
			$.delete('{{url('account/deletefiles')}}', {
				file: item.name
			});
		}

    });
});