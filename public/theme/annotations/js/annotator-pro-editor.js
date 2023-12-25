	// VARIABLES
	var selected_drawable;
	var canvas;
	var active_object;
	var drawables = new Array();

	var canvas_defaults = {
		frameWidth : 640,
    maxZoom : 2,
    navigator : true,
    navigatorImagePreview : true,
    fullscreen : true,
      /*  frameWidth : 640,
        frameHeight : 480,
        maxZoom : "auto",
        navigator : false,
        navigatorImagePreview : false,
        fullscreen : false,*/
		rubberband : true
    }

	var annotation_defaults = {
        tint_color : "#bb2026",
		rotation:0,
        style : 1,
        popup_width : "auto",
        popup_height : "auto",
        popup_position : "top",
        content_type : "custom-html", // or "custom-html"
        title : "",
        text : "",
        text_color : "#ffffff",
        html : "",
        id : "3drenders-annotation-",
        spot_left : 0,
        spot_top : 0,
        spot_width : 44,
        spot_height : 44,
        spot_circle : true,
		show_popup:false
    };

	// CLASSES
	function NDD_Drawable_Canvas(obj, width, height, cb) {
		this.obj = $(obj);
		this.obj_img = undefined;
		this.img = new Image();
		this.width = width;
		this.height = height;

		this.obj_drawables_container = this.obj.find('.ndd-drawables-container');

		this.is_drawing = false;
		this.obj_temp = undefined;

		this.event_initial_x = 0;
		this.event_initial_y = 0;

		this.temp_pos_x = 0;
		this.temp_pos_y = 0;
		this.temp_width = 0;
		this.temp_height = 0;

		this.settings = $.extend({}, canvas_defaults);

		// events
		this.init(cb);
	}
	NDD_Drawable_Canvas.prototype = {
		init : function(cb) {
			var self = this;

			canvas = self;
			self.obj_img = self.obj.find('img');

			if (self.width != 0 && self.height != 0) {
				self.obj.css({
					width : toFixed(self.width / this.canvas.width * 100, 2) + '%',
					//self.width,
					height : toFixed(self.height / this.canvas.height * 100, 2) + '%'
					//self.height
				});

				self.img.src = self.obj_img.attr('src');

				cb();
			} else {
				self.img.onload = function() {
					self.width = self.img.width;
					self.height = self.img.height;

					if (self.width > $('#panel-canvas').width()) {
						var scale = self.width / $('#panel-canvas').width();

						self.width = $('#panel-canvas').width();
						self.height = self.height / scale;
					}

					if (self.height > $('#panel-canvas').height()) {
						var scale = self.height / $('#panel-canvas').height();

						self.height = $('#panel-canvas').height();
						self.width = self.width / scale;
					}

					self.obj.css({
						width : self.width,
						height : self.height
					});

					cb();
				}

				self.img.src = self.obj_img.attr('src');
			}
		},
		handle_event : function(e) {
			var self = this;

			if (e.type == "mousedown") {

			}

			if (e.type == "mousemove") {
				if (!self.is_drawing) {
					self.is_drawing = true;
					self.start_drawing(e.pageX, e.pageY);
				}

				if (self.is_drawing) {
					self.draw(e.pageX, e.pageY);
				}
			}

			if (e.type == "mouseup") {
				if (self.is_drawing) {
					self.is_drawing = false;
					self.stop_drawing();
				} else if ($(e.target).hasClass('ndd-drawable-canvas') || $(e.target).hasClass('ndd-drawable-canvas-image')) {
					var x = e.pageX - self.obj.offset().left;
					var y = e.pageY - self.obj.offset().top;

					self.create_circle_spot(x, y);
				}
			}
		},
		start_drawing : function(pageX, pageY) {
			var self = this;

			self.obj_drawables_container.append('<div class="ndd-drawable-rect ndd-spot-rect ndd-rect-style-3" id="temp"><div class="ndd-icon-main-element"></div><div class="ndd-icon-border-element"></div></div>');
			self.obj_temp = $('#temp');

			self.temp_pos_x = pageX - self.obj.offset().left;
			self.temp_pos_y = pageY - self.obj.offset().top;

			self.obj_temp.css({
				"left" : self.temp_pos_x,
				"top" : self.temp_pos_y,
				"width" : 0,
				"height" : 0
			});

			self.event_initial_x = pageX;
			self.event_initial_y = pageY;
		},
		draw : function(pageX, pageY) {
			var self = this;

			self.temp_width = pageX - self.event_initial_x;
			self.temp_height = pageY - self.event_initial_y;

			if (self.temp_pos_x + self.temp_width > self.width) {
				self.temp_width = self.width - self.temp_pos_x;
			}

			if (self.temp_pos_y + self.temp_height > self.height) {
				self.temp_height = self.height - self.temp_pos_y;
			}

			self.obj_temp.css({
				"width" : toFixed(self.temp_width / canvas.width * 100, 2) + '%',
				//self.temp_width,
				"height" : toFixed(self.temp_height / canvas.height * 100, 2) + '%'
				//self.temp_height
			});
		},
		stop_drawing : function() {
			var self = this;

			var x = self.obj_temp.offset().left - self.obj.offset().left;
			var y = self.obj_temp.offset().top - self.obj.offset().top;
			var width = (self.obj_temp.width() < 44) ? 44 : self.obj_temp.width();
			var height = (self.obj_temp.height() < 44) ? 44 : self.obj_temp.height();


				self.create_circle_spot(x, y);


			self.obj_temp.remove();
			self.obj_temp = undefined;
		},
		apply_settings : function(new_settings) {
			var self = this;

			self.settings = new_settings;
		},
		create_circle_spot : function(x, y) {
			var self = this;

			var drawable = new NDD_Drawable(x, y, self.obj_drawables_container, self);
			return drawable;
		},
		create_rect_spot : function(x, y, width, height) {
			var self = this;

			var drawable_rect = new NDD_Drawable_Rect(x, y, width, height, self.obj_drawables_container, self);
			return drawable_rect;
		}
	};

	function NDD_Drawable(x, y, obj_parent, canvas) {
		this.is_rect = false;

		this.canvas = canvas;
		this.obj_parent = obj_parent;
		this.obj_visible = undefined;
		this.obj_active_area = undefined;
		this.obj = undefined;
		this.id = generate_annotation_id();
		this.x = x;
		this.y = y;

		this.width = 44;
		this.height = 44;
		this.left = x - this.width/2;
		this.top = y - this.height/2;

		this.is_selected = false;
		this.is_moving = false;

		// moving
		this.event_initial_x = 0;
		this.event_initial_y = 0;
		this.initial_left = 0;
		this.initial_top = 0;

		// annotation
		this.annotation = undefined;

		this.settings = $.extend({}, annotation_defaults);
		this.settings.id = this.id;
		this.settings.spot_left = toFixed(this.left / this.canvas.width * 100, 2) + '%';
			//this.left;
		this.settings.spot_top = toFixed(this.top / this.canvas.height * 100, 2) + '%';
			//this.top;
		this.settings.spot_width = toFixed(this.width / this.canvas.width * 100, 2) + '%';
		this.settings.spot_height = toFixed(this.height / this.canvas.height * 100, 2) + '%';
		this.settings.spot_circle = true;
		

		this.init();
	}
	NDD_Drawable.prototype = {
		init : function() {
			var self = this;

			drawables[self.id] = self;

			self.obj_parent.append('<div class="ndd-drawable" id="' +self.id+ '"></div>');
			self.obj = $('#' + self.id);

			self.obj.append('<div class="ndd-spot-icon icon-style-'+ self.settings.style +'"><div class="ndd-icon-main-element"></div><div class="ndd-icon-border-element"></div></div>');
			self.obj_visible = self.obj.find('.ndd-spot-icon');

			self.obj.append('<div class="ndd-drawable-active-area"></div>');
			self.obj_active_area = self.obj.find('.ndd-drawable-active-area');

			self.obj.append('<div class="ndd-drawable-marquee"></div>');

			self.constrain_position();

			self.obj.css({
				left : toFixed((self.left + 22) / this.canvas.width * 100, 2) + '%',
				//self.left,
				top : toFixed((self.top + 22) / this.canvas.height * 100, 2) + '%',
				//self.top,
				'-webkit-transform' : 'rotate('+self.settings.rotation+'deg)',
				'-moz-transform' : 'rotate('+self.settings.rotation+'deg)',
				'-ms-transform' : 'rotate('+self.settings.rotation+'deg)',
				'-o-transform' : 'rotate('+self.settings.rotation+'deg)',
				'transform' : 'rotate('+self.settings.rotation+'deg)',
				width : toFixed(self.width / this.canvas.width * 100, 2) + '%',
				height : toFixed(self.height / this.canvas.height * 100, 2) + '%'
			});

			// annotation
			self.annotation = new NDD_Annotation(self.obj, self);
		},
		handle_event : function(e) {
			var self = this;

			if (e.type == "mousedown") {

			}

			if (e.type == "mousemove") {
				if (!self.is_moving) {
					self.is_moving = true;

					if (!self.is_selected) {
						self.select();
					}

					self.start_moving(e.pageX, e.pageY);
				}
				if (self.is_moving) {
					self.move(e.pageX, e.pageY);
				}
			}

			if (e.type == "mouseup") {
				if (self.is_moving) {
					self.is_moving = false;
					self.end_moving();
				} else {
					
					self.select();
				}
			}
		},
		select : function() {
			var self = this;
			apply_settings();

			if (self.is_selected) {
		
				// deselect
				self.obj.removeClass('ndd-selected');
				self.is_selected = false;
				selected_drawable = undefined;

				self.annotation.hide();
				$('#EditorTools').css('opacity',0);
				refresh_form();
			} else {
				// select
				if (selected_drawable != undefined) {
					selected_drawable.select();
					
				}
				$('#EditorTools').css('opacity',1);
				self.obj.addClass('ndd-selected');
				self.is_selected = true;
				selected_drawable = self;

				self.annotation.show();
				load_settings(self.settings);
			}
		},
		start_moving : function(pageX, pageY) {
			var self = this;

			self.event_initial_x = pageX;
			self.event_initial_y = pageY;
			self.initial_left = self.left;
			self.initial_top = self.top;

			self.obj.addClass("ndd-moving");
		},
		move : function(pageX, pageY) {
			var self = this;

			var dx = pageX - self.event_initial_x;
			var dy = pageY - self.event_initial_y;

			self.left = self.initial_left + dx;
			self.top = self.initial_top + dy;

			self.constrain_position();
			self.redraw();
		},
		end_moving : function() {
			var self = this;

			self.obj.removeClass("ndd-moving");
		},
		constrain_position : function() {
			var self = this;

			if (self.left > self.canvas.width - self.width) {
				self.left = self.canvas.width - self.width;
			}

			if (self.left < 0) {
				self.left = 0;
			}

			if (self.top > self.canvas.height - self.height) {
				self.top = self.canvas.height - self.height;
			}

			if (self.top < 0) {
				self.top = 0;
			}
		},
		redraw : function() {
			var self = this;

			self.obj.css({
				//left : self.left,
				//top : self.top
				'-webkit-transform' : 'rotate('+self.settings.rotation+'deg)',
				'-moz-transform' : 'rotate('+self.settings.rotation+'deg)',
				'-ms-transform' : 'rotate('+self.settings.rotation+'deg)',
				'-o-transform' : 'rotate('+self.settings.rotation+'deg)',
				'transform' : 'rotate('+self.settings.rotation+'deg)',
				left : toFixed((self.left + 22) / this.canvas.width * 100, 2) + '%',
				//self.left,
				top : toFixed((self.top + 22) / this.canvas.height * 100, 2) + '%'
			});
		},
		apply_settings : function(new_settings) {
			var self = this;

			self.settings = new_settings;
			if(self.settings.show_popup==false) self.obj.removeClass('ndd-annotation-visible');
			if(self.settings.show_popup==true){
				self.obj.addClass('ndd-annotation-visible');
				self.is_visible = true;

			}
			self.settings.rotation=$("#rotation").val();

			self.obj.css({
				//left : self.left,
				//top : self.top
				'-webkit-transform' : 'rotate('+self.settings.rotation+'deg)',
				'-moz-transform' : 'rotate('+self.settings.rotation+'deg)',
				'-ms-transform' : 'rotate('+self.settings.rotation+'deg)',
				'-o-transform' : 'rotate('+self.settings.rotation+'deg)',
				'transform' : 'rotate('+self.settings.rotation+'deg)'
			});

			self.obj_visible.find('.ndd-icon-main-element').css({
				"background-color" : self.settings.tint_color
			});

			self.obj_visible.find('.ndd-icon-border-element').css({
				"border-color" : self.settings.tint_color
			});

			self.settings.spot_circle = true;
			//self.settings.show_popup = true;
			self.settings.spot_left = toFixed(self.left/ this.canvas.width * 100, 2) + '%';
				//self.left;
			self.settings.spot_top = toFixed(self.top/ this.canvas.height * 100, 2) + '%';
				//self.top;
			self.settings.spot_width = toFixed(self.width / this.canvas.width * 100, 2) + '%';
			self.settings.spot_height = toFixed(self.height / this.canvas.height * 100, 2) + '%';

			// style
			self.obj_visible.removeClass('icon-style-0');
			self.obj_visible.removeClass('icon-style-1');
			self.obj_visible.removeClass('icon-style-2');
			self.obj_visible.removeClass('icon-style-3');
			self.obj_visible.removeClass('icon-style-4');
			self.obj_visible.removeClass('icon-style-5');
			self.obj_visible.removeClass('icon-style-6');
			self.obj_visible.removeClass('icon-style-7');
			self.obj_visible.removeClass('icon-style-8');
			self.obj_visible.removeClass('icon-style-9');
			self.obj_visible.removeClass('icon-style-10');
			self.obj_visible.removeClass('icon-style-11');
			self.obj_visible.removeClass('icon-style-12');
			self.obj_visible.removeClass('icon-style-13');

			self.obj_visible.addClass('icon-style-' + self.settings.style);
			self.obj_visible.find('img').remove();

			//if (self.settings.style > 4) {
				var i = self.settings.style - 4;
				self.obj_visible.append('<img src="https://stagin.piktar.tech/public/frontend/stagintheme/img/annotator-pro/icon_loc_0'+ i +'.png">');
			//}
		}
	};

	function NDD_Drawable_Rect(x, y, width, height, obj_parent, canvas) {
		this.is_rect = true;

		this.canvas = canvas;
		this.obj_parent = obj_parent;
		this.obj = undefined;
		this.obj_visible = undefined;
		this.obj_visible_main_element = undefined;
		this.id = generate_annotation_id();
		this.x = x;
		this.y = y;

		this.width = width;
		this.height = height;

		this.is_selected = false;
		this.is_moving = false;
		this.is_scaling = false;

		// moving
		this.event_initial_x = 0;
		this.event_initial_y = 0;
		this.initial_left = 0;
		this.initial_top = 0;

		// scaling
		this.initial_width = 0;
		this.initial_height = 0;
		this.scale_amount_x = 0;
		this.scale_amount_y = 0;

		// annotation
		this.annotation = undefined;

		this.settings = $.extend({}, annotation_defaults);
		this.settings.id = this.id;
		this.settings.spot_left = toFixed(this.x/ this.canvas.width * 100, 2) + '%';
			//this.x;
		this.settings.spot_top = toFixed(this.y/ this.canvas.height * 100, 2) + '%';
			//this.y;
		this.settings.spot_width = toFixed(this.width / this.canvas.width * 100, 2) + '%';
		this.settings.spot_height = toFixed(this.height / this.canvas.height * 100, 2) + '%';
		this.settings.spot_circle = false;
	

		this.init();
	}
	NDD_Drawable_Rect.prototype = {
		init : function() {
			var self = this;

			drawables[self.id] = self;

			self.obj_parent.append('<div class="ndd-drawable-rect" id="' +self.id+ '"></div>');
			self.obj = $('#' + self.id);

			self.obj.append('<div class="ndd-spot-rect ndd-rect-style-1"><div class="ndd-icon-main-element"></div><div class="ndd-icon-border-element"></div></div>');
			self.obj_visible = self.obj.find('.ndd-spot-rect');
			self.obj_visible_main_element = self.obj.find('.ndd-icon-main-element');
			self.obj.append('<div class="ndd-drawable-active-area"></div>');

			self.constrain_position();

			self.obj.css({
				//left : self.x,
				//top : self.y,
				left : toFixed((self.x) / this.canvas.width * 100, 2) + '%',
				//self.left,
				top : toFixed((self.y) / this.canvas.height * 100, 2) + '%',
				width : '100%',
				//self.width,
				height :'100%'
				//self.height
			});

			// handles
			self.obj.append('<div class="ndd-drawable-rect-handle-1 ndd-drawable-rect-handle"></div><div class="ndd-drawable-rect-handle-2 ndd-drawable-rect-handle"></div><div class="ndd-drawable-rect-handle-3 ndd-drawable-rect-handle"></div><div class="ndd-drawable-rect-handle-4 ndd-drawable-rect-handle"></div><div class="ndd-drawable-rect-handle-5 ndd-drawable-rect-handle"></div><div class="ndd-drawable-rect-handle-6 ndd-drawable-rect-handle"></div><div class="ndd-drawable-rect-handle-7 ndd-drawable-rect-handle"></div><div class="ndd-drawable-rect-handle-8 ndd-drawable-rect-handle"></div>');

			// annotation
			self.annotation = new NDD_Annotation(self.obj, self);
		},
		handle_event : function(e) {
			var self = this;

			if (e.type == "mousedown") {

			}

			if (e.type == "mousemove") {
				if ($(e.target).hasClass('ndd-drawable-rect-handle') && !self.is_scaling && !self.is_moving) {
					self.is_scaling = true;

					self.start_scaling(e.pageX, e.pageY, e);
				}

				if ($(e.target).hasClass('ndd-drawable-active-area') && !self.is_moving && !self.is_scaling) {
					self.is_moving = true;

					if (!self.is_selected) {
						self.select();
					}

					self.start_moving(e.pageX, e.pageY);
				}

				if (self.is_moving) {
					self.move(e.pageX, e.pageY);
				}

				if (self.is_scaling) {
					self.scale(e.pageX, e.pageY);
				}
			}

			if (e.type == "mouseup") {
				if (self.is_moving) {
					self.is_moving = false;
					self.end_moving();
				} else if (self.is_scaling) {
					self.is_scaling = false;

					self.end_scaling();
				} else {
					self.select();
				}
			}
		},
		select : function() {
			var self = this;
			apply_settings();

			if (self.is_selected) {
				// deselect
				self.obj.removeClass('ndd-selected');
				self.is_selected = false;
				selected_drawable = undefined;

				self.annotation.hide();
				refresh_form();
			} else {
				// select
				if (selected_drawable != undefined) {
					selected_drawable.select();
				}

				self.obj.addClass('ndd-selected');
				self.is_selected = true;
				selected_drawable = self;

				self.annotation.show();
				load_settings(self.settings);
			}
		},
		start_scaling : function(pageX, pageY, event) {
			var self = this;

			self.event_initial_x = pageX;
			self.event_initial_y = pageY;
			self.initial_left = self.x;
			self.initial_top = self.y;
			self.initial_width = self.width;
			self.initial_height = self.height;

			if ($(event.target).hasClass("ndd-drawable-rect-handle-1")) {
				self.scale_amount_x = -1;
				self.scale_amount_y = -1;
			}

			if ($(event.target).hasClass("ndd-drawable-rect-handle-2")) {
				self.scale_amount_x = 0;
				self.scale_amount_y = -1;
			}

			if ($(event.target).hasClass("ndd-drawable-rect-handle-3")) {
				self.scale_amount_x = 1;
				self.scale_amount_y = -1;
			}

			if ($(event.target).hasClass("ndd-drawable-rect-handle-4")) {
				self.scale_amount_x = 1;
				self.scale_amount_y = 0;
			}

			if ($(event.target).hasClass("ndd-drawable-rect-handle-5")) {
				self.scale_amount_x = 1;
				self.scale_amount_y = 1;
			}

			if ($(event.target).hasClass("ndd-drawable-rect-handle-6")) {
				self.scale_amount_x = 0;
				self.scale_amount_y = 1;
			}

			if ($(event.target).hasClass("ndd-drawable-rect-handle-7")) {
				self.scale_amount_x = -1;
				self.scale_amount_y = 1;
			}

			if ($(event.target).hasClass("ndd-drawable-rect-handle-8")) {
				self.scale_amount_x = -1;
				self.scale_amount_y = 0;
			}
		},
		scale : function(pageX, pageY) {
			var self = this;

			var dx = pageX - self.event_initial_x;
			var dy = pageY - self.event_initial_y;

			dx *= self.scale_amount_x;
			dy *= self.scale_amount_y;

			// prevent negative scale
			if (self.width < self.initial_width) {
				if (Math.abs(dx) > self.initial_width - 44) {
					if (dx > 0) {
						dx = self.initial_width - 44;
					} else {
						dx = -self.initial_width + 44;
					}
				}
			}

			if (self.height < self.initial_height) {
				if (Math.abs(dy) > self.initial_height - 44) {
					if (dy > 0) {
						dy = self.initial_height - 44;
					} else {
						dy = -self.initial_height + 44;
					}
				}
			}

			// prevent going out of bounds (negative)
			if (dx > self.initial_left && self.scale_amount_x == -1) {
				dx = self.initial_left;
			}
			if (dy > self.initial_top && self.scale_amount_y == -1) {
				dy = self.initial_top;
			}

			// prevent going out of bounds (positive)
			if (dx > self.canvas.width - self.initial_left - self.initial_width && self.scale_amount_x == 1) {
				dx = self.canvas.width - self.initial_left - self.initial_width;
			}
			if (dy > self.canvas.height - self.initial_top - self.initial_height && self.scale_amount_y == 1) {
				dy = self.canvas.height - self.initial_top - self.initial_height;
			}

			// scaling direction
			if (self.scale_amount_x == -1) {
				self.x = self.initial_left - dx;
			}

			if (self.scale_amount_y == -1) {
				self.y = self.initial_top - dy;
			}

			// apply scale
			self.width = self.initial_width + dx;
			self.height = self.initial_height + dy;

			// positive scaling
			// if (self.width > self.this.canvas.width - self.x) {
			// 	self.width = self.this.canvas.width - self.x;
			// }

			// if (self.height > self.this.canvas.height - self.y) {
			// 	self.height = self.this.canvas.height - self.y;
			// }

			// redraw rect
			self.redraw();

			// redraw annotation
			self.annotation.initialize_dimentions();
		},
		end_scaling : function() {
			var self = this;
		},
		start_moving : function(pageX, pageY) {
			var self = this;

			self.event_initial_x = pageX;
			self.event_initial_y = pageY;
			self.initial_left = self.x;
			self.initial_top = self.y;

			self.obj.addClass("ndd-moving");
		},
		move : function(pageX, pageY) {
			var self = this;

			var dx = pageX - self.event_initial_x;
			var dy = pageY - self.event_initial_y;

			self.x = self.initial_left + dx;
			self.y = self.initial_top + dy;

			self.constrain_position();
			self.redraw();
		},
		end_moving : function() {
			var self = this;

			self.obj.removeClass("ndd-moving");
		},
		constrain_position : function() {
			var self = this;

			if (self.x > self.canvas.width - self.width) {
				self.x = self.canvas.width - self.width;
			}

			if (self.x < 0) {
				self.x = 0;
			}

			if (self.y > self.canvas.height - self.height) {
				self.y = self.canvas.height - self.height;
			}

			if (self.y < 0) {
				self.y = 0;
			}
		},
		redraw : function() {
			var self = this;

			self.obj.css({
				width : toFixed(self.width / this.canvas.width * 100, 2) + '%',
				//self.width,
				height : toFixed(self.height / this.canvas.height * 100, 2) + '%',
				//self.height,
				left : toFixed((self.x) / this.canvas.width * 100, 2) + '%',
				//self.left,
				top : toFixed((self.y) / this.canvas.height * 100, 2) + '%'
				//left : self.x,
				//top : self.y
			});

			if (self.settings.style == 1) {
				self.obj_visible_main_element.css({
					width : toFixed(self.width / this.canvas.width * 100, 2) + '%',
					//self.width,
					height : toFixed(self.height / this.canvas.height * 100, 2) + '%'
				//self.height
				});
			}

			if (self.settings.style == 2) {
				self.obj_visible_main_element.css({
					width : toFixed((self.width - 10) / this.canvas.width * 100, 2) + '%',
						//self.width - 10,
					height : toFixed((self.height - 10) / this.canvas.height * 100, 2) + '%'
						//self.height - 10
				});
			}

			if (self.settings.style == 3) {
				self.obj_visible_main_element.css({
					width : toFixed((self.width - 6) / this.canvas.width * 100, 2) + '%',
					height : toFixed((self.height - 10) / this.canvas.height * 100, 2) + '%'
				});
			}

			if (self.settings.style == 4) {

			}
		},
		apply_settings : function(new_settings) {
			var self = this;

			self.settings = new_settings;

			self.obj_visible.find('.ndd-icon-main-element').css({
				"background-color" : 'rgba('+ hexToRgb(self.settings.tint_color).r +', '+ hexToRgb(self.settings.tint_color).g +', '+ hexToRgb(self.settings.tint_color).b +', 0.2)'
			});

			self.obj_visible.find('.ndd-icon-border-element').css({
				"border-color" : self.settings.tint_color
			});

			this.settings.spot_left = toFixed(this.x/ this.canvas.width * 100, 2) + '%';
				//this.x;
			this.settings.spot_top = toFixed(this.y/ this.canvas.height * 100, 2) + '%';
				//this.y;
			this.settings.spot_width = toFixed(this.width / this.canvas.width * 100, 2) + '%';
			this.settings.spot_height = toFixed(this.height / this.canvas.height * 100, 2) + '%';
			this.settings.spot_circle = false;

			// style
			self.obj_visible.removeClass('ndd-rect-style-0');
			self.obj_visible.removeClass('ndd-rect-style-1');
			self.obj_visible.removeClass('ndd-rect-style-2');
			self.obj_visible.removeClass('ndd-rect-style-3');
			self.obj_visible.removeClass('ndd-rect-style-4');

			self.obj_visible.addClass('ndd-rect-style-' + self.settings.style);

			self.redraw();
		}
	};

	function NDD_Annotation(parent, drawable) {
		this.obj_parent = parent;
		this.drawable = drawable;
		this.obj = undefined;
		this.obj_box = undefined;
		this.obj_arrow = undefined;
		this.obj_content = undefined;

		this.title = drawable.settings.title;
		this.text = drawable.settings.text;
		this.html = drawable.settings.html;
		this.content_type = drawable.settings.content_type;
		this.show_popup = drawable.settings.show_popup;
		this.position = "top"; // top, bottom, left, right

		this.width = "auto";
		this.height = "auto";
		this.left = 0;
		this.top = 0;

		this.initialized_dimentions = false;
		this.is_visible = false;

		this.init();
	}
	NDD_Annotation.prototype = {
		init : function() {
			var self = this;

			self.obj_parent.append('<div class="ndd-annotation-container"></div>');
			self.obj = self.obj_parent.find('.ndd-annotation-container');

			self.obj.append('<div class="ndd-annotation-box"></div>');
			// self.obj.append('<div class="ndd-annotation-arrow-up"></div>');

			self.obj_box = self.obj.find('.ndd-annotation-box');
			// self.obj_arrow = self.obj.find('.ndd-annotation-arrow-up');

			self.obj_box.append('<div class="ndd-annotation-content"></div>');
			self.obj_box.append('<div class="ndd-annotation-arrow-down"></div>');

			self.obj_content = self.obj_box.find('.ndd-annotation-content');
			self.obj_arrow = self.obj_box.find('.ndd-annotation-arrow-down');

			// sample content
			self.obj_content.append('<h1>'+ self.title +'</h1><p>'+ self.text +'</p>');
		},
		show : function() {
			var self = this;
			
			if(self.drawable.settings.show_popup==false) return;
			self.obj.addClass('ndd-annotation-visible');
			self.is_visible = true;

			if (!self.initialized_dimentions) {
				self.initialize_dimentions();
			}
		},
		hide : function() {
			var self = this;
			//if(self.show_popup==false) return;
			self.is_visible = false;

			self.obj.removeClass('ndd-annotation-visible');
		},
		initialize_dimentions : function() {
			var self = this;

			if (self.width == "auto") {
				self.obj_box.css({
					width : "auto",
					'-webkit-transform' : 'rotate(0deg)',
					'-moz-transform' : 'rotate(0deg)',
					'-ms-transform' : 'rotate(0deg)',
					'-o-transform' : 'rotate(0deg)',
					'transform' : 'rotate(0deg)',
				});

				self.width = self.obj_box.width();
			} else {
				self.obj_box.css({
					width : self.width,
					'-webkit-transform' : 'rotate(0deg)',
					'-moz-transform' : 'rotate(0deg)',
					'-ms-transform' : 'rotate(0deg)',
					'-o-transform' : 'rotate(0deg)',
					'transform' : 'rotate(0deg)',
				});
			}

			if (self.height == "auto") {
				self.obj_box.css({
					height : "auto",
					'-webkit-transform' : 'rotate(0deg)',
					'-moz-transform' : 'rotate(0deg)',
					'-ms-transform' : 'rotate(0deg)',
					'-o-transform' : 'rotate(0deg)',
					'transform' : 'rotate(0deg)',
				});

				self.height = self.obj_box.height();
			} else {
				self.obj_box.css({
					height :self.height,
					'-webkit-transform' : 'rotate(0deg)',
					'-moz-transform' : 'rotate(0deg)',
					'-ms-transform' : 'rotate(0deg)',
					'-o-transform' : 'rotate(0deg)',
					'transform' : 'rotate(0deg)',
				});
			}

			if (self.drawable.settings.popup_position == "top") {
				self.left = -self.width/2 + self.drawable.width/2;
				self.top = -self.height - 20;

				if (self.drawable.settings.style != 1 && self.drawable.settings.style != 2 && self.drawable.settings.style != 3 && self.drawable.settings.style != 4) {
					self.top -= 20;
				}

				self.obj_arrow.removeClass('ndd-annotation-arrow-up');
				self.obj_arrow.removeClass('ndd-annotation-arrow-left');
				self.obj_arrow.removeClass('ndd-annotation-arrow-right');
				self.obj_arrow.addClass('ndd-annotation-arrow-down');

				self.obj_arrow.css({
					left : self.width/2 - 10,
					top : "100%",
					'-webkit-transform' : 'rotate(0deg)',
					'-moz-transform' : 'rotate(0deg)',
					'-ms-transform' : 'rotate(0deg)',
					'-o-transform' : 'rotate(0deg)',
					'transform' : 'rotate(0deg)',
				});
			}

			if (self.drawable.settings.popup_position == "bottom") {
				self.left = -self.width/2 + self.drawable.width/2;
				self.top = self.drawable.height + 20;

				self.obj_arrow.removeClass('ndd-annotation-arrow-down');
				self.obj_arrow.removeClass('ndd-annotation-arrow-left');
				self.obj_arrow.removeClass('ndd-annotation-arrow-right');
				self.obj_arrow.addClass('ndd-annotation-arrow-up');

				self.obj_arrow.css({
					left : self.width/2 - 10,
					top : -10,
					'-webkit-transform' : 'rotate(0deg)',
					'-moz-transform' : 'rotate(0deg)',
					'-ms-transform' : 'rotate(0deg)',
					'-o-transform' : 'rotate(0deg)',
					'transform' : 'rotate(0deg)',
				});
			}

			if (self.drawable.settings.popup_position == "left") {
				self.left = -self.width - 20;
				self.top = -self.height/2 + self.drawable.height/2;

				self.obj_arrow.removeClass('ndd-annotation-arrow-down');
				self.obj_arrow.removeClass('ndd-annotation-arrow-left');
				self.obj_arrow.removeClass('ndd-annotation-arrow-up');
				self.obj_arrow.addClass('ndd-annotation-arrow-right');

				self.obj_arrow.css({
					left : "100%",
					top : self.height/2 - 10,
					'-webkit-transform' : 'rotate(0deg)',
					'-moz-transform' : 'rotate(0deg)',
					'-ms-transform' : 'rotate(0deg)',
					'-o-transform' : 'rotate(0deg)',
					'transform' : 'rotate(0deg)',
				});
			}

			if (self.drawable.settings.popup_position == "right") {
				self.left = self.drawable.width + 20;
				self.top = -self.height/2 + self.drawable.height/2;

				self.obj_arrow.removeClass('ndd-annotation-arrow-down');
				self.obj_arrow.removeClass('ndd-annotation-arrow-right');
				self.obj_arrow.removeClass('ndd-annotation-arrow-up');
				self.obj_arrow.addClass('ndd-annotation-arrow-left');

				self.obj_arrow.css({
					left : -10,
					top : self.height/2 - 10,
					'-webkit-transform' : 'rotate(0deg)',
					'-moz-transform' : 'rotate(0deg)',
					'-ms-transform' : 'rotate(0deg)',
					'-o-transform' : 'rotate(0deg)',
					'transform' : 'rotate(0deg)',
				});
			}

			self.obj.css({
				left : self.left,
				top : self.top,
				'-webkit-transform' : 'rotate(0deg)',
				'-moz-transform' : 'rotate(0deg)',
				'-ms-transform' : 'rotate(0deg)',
				'-o-transform' : 'rotate(0deg)',
				'transform' : 'rotate(0deg)',
			});
		},
		apply_settings : function(new_settings) {
			var self = this;
			
			if(self.drawable.settings.show_popup==false) self.obj.removeClass('ndd-annotation-visible');
			if(self.drawable.settings.show_popup==true){
				self.obj.addClass('ndd-annotation-visible');
				self.is_visible = true;

			if (!self.initialized_dimentions) {
				self.initialize_dimentions();
			}
			}

			// tint color
			self.obj_box.css({
				"background-color" : new_settings.tint_color
			});

			// width
			self.width = new_settings.popup_width;

			// height
			self.height = new_settings.popup_height;

			// popup position
			if (new_settings.popup_position == "top") {
				self.obj_arrow.css({
					"border-color" : 'transparent',
					"border-top-color" : new_settings.tint_color
				});
			}
			if (new_settings.popup_position == "bottom") {
				self.obj_arrow.css({
					"border-color" : 'transparent',
					"border-bottom-color" : new_settings.tint_color
				});
			}
			if (new_settings.popup_position == "left") {
				self.obj_arrow.css({
					"border-color" : 'transparent',
					"border-left-color" : new_settings.tint_color
				});
			}
			if (new_settings.popup_position == "right") {
				self.obj_arrow.css({
					"border-color" : 'transparent',
					"border-right-color" : new_settings.tint_color
				});
			}

			// content
			self.title = new_settings.title;
			self.text = new_settings.text;
			self.html = new_settings.html;
			self.content_type = new_settings.content_type;

			if (self.content_type == "text") {
				self.obj_content.html('<h1>'+ self.title +'</h1><p>'+ self.text +'</p>');
			} else {
				self.obj_content.html(self.html);
			}

			// text color
			self.obj_content.css({
				color : new_settings.text_color
			});
			self.obj_content.find('h1').css({
				color : new_settings.text_color
			});
			self.obj_content.find('p').css({
				color : new_settings.text_color
			});

			if (self.is_visible) {
				self.initialize_dimentions();
			} else {
				self.initialized_dimentions = false;
			}
		}
	};

	// FUNCTIONS

	function init_canvas(width, height, cb) {
		var tmp = new NDD_Drawable_Canvas($('.ndd-drawable-canvas'), width, height, function() {
			cb();
		});
	}

	function init_global_events() {
		$(document).on('mousedown', function(e) {
			active_object = undefined;

			if ($(e.target).hasClass('ndd-drawable-canvas') || $(e.target).hasClass('ndd-drawable-canvas-image')) {
				e.preventDefault();

				active_object = canvas;
				active_object.handle_event(e);

				return false;
			}

			if ($(e.target).hasClass('ndd-drawable-active-area')) {
				e.preventDefault();

				active_object = drawables[$(e.target).parent().attr('id')];
				active_object.handle_event(e);

				return false;
			}

			if ($(e.target).hasClass('ndd-drawable-rect-handle')) {
				e.preventDefault();

				active_object = drawables[$(e.target).closest('.ndd-drawable-rect').attr('id')];
				active_object.handle_event(e);

				return false;
			}
		});

		$(document).on('mousemove', function(e) {
			if (active_object != undefined) {
				e.preventDefault();

				active_object.handle_event(e);

				return false;
			}
		});

		$(document).on('mouseup', function(e) {
			if (active_object != undefined) {
				active_object.handle_event(e);
			}

			active_object = undefined;
		});
	}

	function form_events() {
		$('form input, form button, form textarea').on('change', function() {
			refresh_form();
			validate_form(function(success) {
				if (success) {
					apply_settings();
					generate_jquery();

					//if ($('#radio-editor-mode-preview-label').hasClass('active')) {
						generate_preview();
					//}
				}
			});
		});

		$(document).on('keyup', function(e) {
			if (e.keyCode == 46 && selected_drawable != undefined) {
				$('#modal-delete').modal();
			}
		});

		$('#delete-annotation-button').on('click', function() {
			if (selected_drawable != undefined) {
				selected_drawable.obj.remove();

				drawables[selected_drawable.id] = undefined;
				selected_drawable = undefined;

				refresh_form();
				generate_jquery();

				//if ($('#radio-editor-mode-preview-label').hasClass('active')) {
					generate_preview();
				//}
			}
		});

		$('#radio-editor-mode-jquery-label').on('click', function() {
			generate_jquery();
		});

		$('#radio-editor-mode-preview-label').on('mouseup', function() {
			setTimeout(function() {
				generate_preview();
			}, 30);
		});

		$('#button-select-jquery').on('click', function() {
			selectText('well-jquery');
		});

		$('#textarea-load').on('change', function() {
			$('#button-load').removeClass('btn-success').removeClass('btn-danger').addClass('btn-primary');
			$('#button-load').html('Load');

			if ($(this).val().length > 0) {
				$('#button-load').removeAttr('disabled');
			} else {
				//$('#button-load').attr('disabled', 'disabled');
			}
		});

		$('#textarea-load').on('keyup', function() {
			$('#button-load').removeClass('btn-success').removeClass('btn-danger').addClass('btn-primary');
			$('#button-load').html('Load');

			if ($(this).val().length > 0) {
				$('#button-load').removeAttr('disabled');
			} else {
				//$('#button-load').attr('disabled', 'disabled');
			}
		});

		$('#button-load').on('click', function() {
			if (load_jquery($('#textarea-load').val())) {
				$(this).removeClass('btn-primary').addClass('btn-success').attr('disabled', 'disabled');
				$(this).html('<span class="glyphicon glyphicon-ok"></span> Success');
			} else {
				$(this).removeClass('btn-primary').addClass('btn-danger').attr('disabled', 'disabled');
				$(this).html('<span class="glyphicon glyphicon-remove"></span> Error');
			}
		});
	}

	function refresh_form() {
		
		/*if ($('#radio-editor-mode-edit').get(0).checked) {
			$('#panel-editor').show();
			$('#panel-preview').hide();

		}

		if ($('#radio-editor-mode-preview').get(0).checked) {
			$('#panel-editor').hide();
			$('#panel-preview').show();

		}*/



		$('#color-tint-color-hex').html($('#color-tint-color').val());

		
		$('#color-text-color-hex').html($('#color-text-color').val());

		if ($('#show_popup').get(0).checked) {
			
			$('#color-text-color').removeAttr('disabled');
			$('#textarea-html').removeAttr('disabled');
			$('#popupPositions').css('pointer-events','all');
			
		}else{
			$('#color-text-color').attr('disabled', 'disabled');
			$('#textarea-html').attr('disabled', 'disabled');
			$('#popupPositions').css('pointer-events','none');
			
		}

		if ($('#input-id').val().length > 0) {
			$('#input-deep-link-url').html('#/ndd_ann/' + $('#input-id').val() + '/');
			$('#input-deep-link-url-help').html('Example: <code>' + escapeHTML('<a href="#/ndd_ann/' + $('#input-id').val() + '/"></a>') + '</code>');
		} else {
			$('#input-deep-link-url').html('');
			$('#input-deep-link-url-help').html('');
		}

		// Icon styles
		if (selected_drawable != undefined) {
			if (selected_drawable.is_rect) {
				$('#btn-group-style-rect').show();
				$('#btn-group-style-circle').hide();
			} else {
				$('#btn-group-style-rect').hide();
				$('#btn-group-style-circle').show();
			}
		}



		if (selected_drawable == undefined) {
			disable_form();
		} else {
			enable_form();
		}
	}

	function validate_form(cb) {
		var int_regex = /\D+/; // any number of non-digit characters
		var success = true;

		

		// ID
		$('#input-id').val($('#input-id').val().trim());

		cb(success);
	}

	function load_settings(settings) {
		// Tint Color
		$('#color-tint-color').val(settings.tint_color);

		// Style
		if (selected_drawable != undefined) {
			if (selected_drawable.is_rect) {
				if (settings.style == 1) {
				    $('#radio-popup-style-rect-1').prop('checked', true).parent().addClass('active');
				    $('[id*="radio-popup-style-rect-"]').not($('#radio-popup-style-rect-1')).removeAttr('checked').prop('checked', false).parent().removeClass('active');
				}

				if (settings.style == 2) {
				    $('#radio-popup-style-rect-2').prop('checked', true).parent().addClass('active');
				    $('[id*="radio-popup-style-rect-"]').not($('#radio-popup-style-rect-2')).removeAttr('checked').prop('checked', false).parent().removeClass('active');
				}

				if (settings.style == 3) {
				    $('#radio-popup-style-rect-3').prop('checked', true).parent().addClass('active');
				    $('[id*="radio-popup-style-rect-"]').not($('#radio-popup-style-rect-3')).removeAttr('checked').prop('checked', false).parent().removeClass('active');
				}

				if (settings.style == 4) {
				    $('#radio-popup-style-rect-4').prop('checked', true).parent().addClass('active');
				    $('[id*="radio-popup-style-rect-"]').not($('#radio-popup-style-rect-4')).removeAttr('checked').prop('checked', false).parent().removeClass('active');
				}
			} else {
				if (settings.style == 1) {
				    $('#radio-popup-style-1').prop('checked', true).parent().addClass('active');
				    $('[id*="radio-popup-style-"]').not($('#radio-popup-style-1')).removeAttr('checked').prop('checked', false).parent().removeClass('active');
				}
				if (settings.style == 2) {
				    $('#radio-popup-style-2').prop('checked', true).parent().addClass('active');
				    $('[id*="radio-popup-style-"]').not($('#radio-popup-style-2')).removeAttr('checked').prop('checked', false).parent().removeClass('active');
				}
				if (settings.style == 3) {
				    $('#radio-popup-style-3').prop('checked', true).parent().addClass('active');
				    $('[id*="radio-popup-style-"]').not($('#radio-popup-style-3')).removeAttr('checked').prop('checked', false).parent().removeClass('active');
				}
				if (settings.style == 4) {
				    $('#radio-popup-style-4').prop('checked', true).parent().addClass('active');
				    $('[id*="radio-popup-style-"]').not($('#radio-popup-style-4')).removeAttr('checked').prop('checked', false).parent().removeClass('active');
				}
				if (settings.style == 5) {
				    $('#radio-popup-style-5').prop('checked', true).parent().addClass('active');
				    $('[id*="radio-popup-style-"]').not($('#radio-popup-style-5')).removeAttr('checked').prop('checked', false).parent().removeClass('active');
				}
				if (settings.style == 6) {
				    $('#radio-popup-style-6').prop('checked', true).parent().addClass('active');
				    $('[id*="radio-popup-style-"]').not($('#radio-popup-style-6')).removeAttr('checked').prop('checked', false).parent().removeClass('active');
				}
				if (settings.style == 7) {
				    $('#radio-popup-style-7').prop('checked', true).parent().addClass('active');
				    $('[id*="radio-popup-style-"]').not($('#radio-popup-style-7')).removeAttr('checked').prop('checked', false).parent().removeClass('active');
				}
				if (settings.style == 8) {
				    $('#radio-popup-style-8').prop('checked', true).parent().addClass('active');
				    $('[id*="radio-popup-style-"]').not($('#radio-popup-style-8')).removeAttr('checked').prop('checked', false).parent().removeClass('active');
				}
				if (settings.style == 9) {
				    $('#radio-popup-style-9').prop('checked', true).parent().addClass('active');
				    $('[id*="radio-popup-style-"]').not($('#radio-popup-style-9')).removeAttr('checked').prop('checked', false).parent().removeClass('active');
				}
				if (settings.style == 10) {
				    $('#radio-popup-style-10').prop('checked', true).parent().addClass('active');
				    $('[id*="radio-popup-style-"]').not($('#radio-popup-style-10')).removeAttr('checked').prop('checked', false).parent().removeClass('active');
				}
				if (settings.style == 11) {
				    $('#radio-popup-style-11').prop('checked', true).parent().addClass('active');
				    $('[id*="radio-popup-style-"]').not($('#radio-popup-style-11')).removeAttr('checked').prop('checked', false).parent().removeClass('active');
				}
				if (settings.style == 12) {
				    $('#radio-popup-style-12').prop('checked', true).parent().addClass('active');
				    $('[id*="radio-popup-style-"]').not($('#radio-popup-style-12')).removeAttr('checked').prop('checked', false).parent().removeClass('active');
				}
				if (settings.style == 13) {
				    $('#radio-popup-style-13').prop('checked', true).parent().addClass('active');
				    $('[id*="radio-popup-style-"]').not($('#radio-popup-style-13')).removeAttr('checked').prop('checked', false).parent().removeClass('active');
				}
			}
		}


		
		if (settings.show_popup ) {
			$('#show_popup').get(0).checked = true;
			
			$('#color-text-color').removeAttr('disabled');
			$('#textarea-html').removeAttr('disabled');
			
			$('#popupPositions').css('pointer-events','all');
			
			
		}else{
			$('#color-text-color').attr('disabled', 'disabled');
			$('#textarea-html').attr('disabled', 'disabled');
			$('#popupPositions').css('pointer-events','none');
			
		
			$('#show_popup').get(0).checked = false;
			
		}

		// Popup position
		if (settings.popup_position == "top") {
			$('#radio-popup-position-top').parent().addClass('active');
			$('#radio-popup-position-top').get(0).checked = true;

			$('#radio-popup-position-bottom').removeAttr('checked').parent().removeClass('active');
			$('#radio-popup-position-left').removeAttr('checked').parent().removeClass('active');
			$('#radio-popup-position-right').removeAttr('checked').parent().removeClass('active');
		}
		if (settings.popup_position == "bottom") {
			$('#radio-popup-position-top').removeAttr('checked').parent().removeClass('active');

			$('#radio-popup-position-bottom').parent().addClass('active');
			$('#radio-popup-position-bottom').get(0).checked = true;

			$('#radio-popup-position-left').removeAttr('checked').parent().removeClass('active');
			$('#radio-popup-position-right').removeAttr('checked').parent().removeClass('active');
		}
		if (settings.popup_position == "left") {
			$('#radio-popup-position-top').removeAttr('checked').parent().removeClass('active');
			$('#radio-popup-position-bottom').removeAttr('checked').parent().removeClass('active');

			$('#radio-popup-position-left').parent().addClass('active');
			$('#radio-popup-position-left').get(0).checked = true;

			$('#radio-popup-position-right').removeAttr('checked').parent().removeClass('active');
		}
		if (settings.popup_position == "right") {
			$('#radio-popup-position-top').removeAttr('checked').parent().removeClass('active');
			$('#radio-popup-position-bottom').removeAttr('checked').parent().removeClass('active');
			$('#radio-popup-position-left').removeAttr('checked').parent().removeClass('active');

			$('#radio-popup-position-right').parent().addClass('active');
			$('#radio-popup-position-right').get(0).checked = true;
		}

		
		// Title
		$('#input-title').val(settings.title);

		// Text
		$('#textarea-text').val(settings.text);

		// Text color
		$('#color-text-color').val(settings.text_color);


		$("#rotation").val(settings.rotation);


		// HTML
		$('#textarea-html').val(settings.html);

		// ID
		$('#input-id').val(settings.id);

		

		refresh_form();
	}

	function apply_settings() {
		
		if (selected_drawable != undefined) {
			var current_settings = selected_drawable.settings;

			//rotation

			current_settings.rotation=$("#rotation").val();

			// Tint Color
			current_settings.tint_color = $('#color-tint-color').val();

			if (selected_drawable != undefined) {
				if (selected_drawable.is_rect) {
					// Popup style
					if ($('#radio-popup-style-rect-0').get(0).checked) {
						current_settings.style = 0;
					}
					if ($('#radio-popup-style-rect-1').get(0).checked) {
						current_settings.style = 1;
					}
					if ($('#radio-popup-style-rect-2').get(0).checked) {
						current_settings.style = 2;
					}
					if ($('#radio-popup-style-rect-3').get(0).checked) {
						current_settings.style = 3;
					}
					if ($('#radio-popup-style-rect-4').get(0).checked) {
						current_settings.style = 4;
					}
				} else {

					current_settings.style = 1;

					if($('#radio-popup-style-1').get(0)!=undefined){

					if ($('#radio-popup-style-1').get(0).checked) {
						current_settings.style = 1;
					}
					if ($('#radio-popup-style-2').get(0).checked) {
						current_settings.style = 2;
					}

					if ($('#radio-popup-style-4').get(0).checked) {
						current_settings.style = 4;
					}
					if ($('#radio-popup-style-5').get(0).checked) {
						current_settings.style = 5;
					}
					if ($('#radio-popup-style-6').get(0).checked) {
						current_settings.style = 6;
					}
					if ($('#radio-popup-style-7').get(0).checked) {
						current_settings.style = 7;
					}
					if ($('#radio-popup-style-8').get(0).checked) {
						current_settings.style = 8;
					}
					if ($('#radio-popup-style-9').get(0).checked) {
						current_settings.style = 9;
					}
					if ($('#radio-popup-style-10').get(0).checked) {
						current_settings.style = 10;
					}
					if ($('#radio-popup-style-11').get(0).checked) {
						current_settings.style = 11;
					}
					if ($('#radio-popup-style-12').get(0).checked) {
						current_settings.style = 12;
					}
					if ($('#radio-popup-style-13').get(0).checked) {
						current_settings.style = 13;
					}

					}
				}
			}

			
			// Popup position
			if ($('#radio-popup-position-top').get(0).checked) {
				current_settings.popup_position = "top";
			}
			if ($('#radio-popup-position-bottom').get(0).checked) {
				current_settings.popup_position = "bottom";
			}
			if ($('#radio-popup-position-left').get(0).checked) {
				current_settings.popup_position = "left";
			}
			if ($('#radio-popup-position-right').get(0).checked) {
				current_settings.popup_position = "right";
			}

			
			if ($('#show_popup').get(0).checked) {
				current_settings.show_popup = true;
			}else{
				
				current_settings.show_popup = false;
			}

			// Title
			current_settings.title = $('#input-title').val();

			// Text
			current_settings.text = $('#textarea-text').val();

			// Text color
			current_settings.text_color = $('#color-text-color').val();

			// HTML
			current_settings.html = $('#textarea-html').val();

			// ID
			current_settings.id = $('#input-id').val();

			selected_drawable.apply_settings(current_settings);
			selected_drawable.annotation.apply_settings(current_settings);
		}

		if (canvas != undefined) {
			var current_canvas_settings = canvas.settings;

			

			canvas.apply_settings(current_canvas_settings);
		}
	}

	function enable_form() { $('#panel-disabler').hide(); }

	function disable_form() { $('#panel-disabler').show(); }

	function generate_annotation_id() {
		return "3renders-annotation-" + Math.floor(Math.random() * 10000000) + 1;
	}

	function generate_jquery() {
		var frameWidth = (canvas.settings.frameWidth == "auto") ? '"100%"' : canvas.settings.frameWidth;
		var frameHeight = canvas.settings.frameHeight;
		var maxZoom = (canvas.settings.maxZoom == "auto") ? '"auto"' : canvas.settings.maxZoom;

		var annotations = new Array();

		for (drawable_id in drawables) {
			var drawable = drawables[drawable_id];

			if (drawable != undefined) {
				annotations.push(drawable.settings);
			}
		}

		var result = '$("#the-img-tag").annotatorPro({';
		var has_canvas_option = false;

		// frame width
		if (canvas.settings.frameWidth != canvas_defaults.frameWidth) {
			result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;frameWidth : " + frameWidth + ',';
			has_canvas_option = true;
		}

		// frame height
		if (canvas.settings.frameHeight != canvas_defaults.frameHeight) {
			result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;frameHeight : " + frameHeight + ',';
			has_canvas_option = true;
		}

		// max zoom
		if (canvas.settings.maxZoom != canvas_defaults.maxZoom) {
			result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;maxZoom : " + maxZoom + ',';
			has_canvas_option = true;
		}

		// navigator
		if (canvas.settings.navigator != canvas_defaults.navigator) {
			result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;navigator : " + canvas.settings.navigator + ',';
			has_canvas_option = true;
		}

		// navigator image preview
		if (canvas.settings.navigatorImagePreview != canvas_defaults.navigatorImagePreview) {
			result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;navigatorImagePreview : " + canvas.settings.navigatorImagePreview + ',';
			has_canvas_option = true;
		}

		// fullscreen
		if (canvas.settings.fullscreen != canvas_defaults.fullscreen) {
			result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;fullscreen : " + canvas.settings.fullscreen + ',';
			has_canvas_option = true;
		}

		// rubberbanding
		if (canvas.settings.rubberband != canvas_defaults.rubberband) {
			result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;rubberband : " + canvas.settings.rubberband + ',';
			has_canvas_option = true;
		}


		// ANNOTATIONS

		if (annotations.length > 0) {
			result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;annotations : [";
		} else {
			var regex = /\,$/g;
			result = result.replace(regex, '');
		}

		for (var i=0; i<annotations.length; i++) {

			var tint_color = annotations[i].tint_color;
			var style = annotations[i].style;
			var width = (annotations[i].popup_width == "auto") ? 'auto' : annotations[i].popup_width;
			var height = (annotations[i].popup_height == "auto") ? 'auto' : annotations[i].popup_height;
			var popup_position = annotations[i].popup_position;
			var content_type = annotations[i].content_type;
			var title = annotations[i].title;
			var text = annotations[i].text;
			var text_color = annotations[i].text_color;
			var html = escapeHTML(annotations[i].html);
			var id = annotations[i].id;
			var spot_left = annotations[i].spot_left;
				//toFixed(annotations[i].spot_left / this.canvas.width * 100, 2) + '%';
			var spot_top = annotations[i].spot_top;
				//toFixed(annotations[i].spot_top / this.canvas.height * 100, 2) + '%';
			var spot_circle = annotations[i].spot_circle;
			var show_popup = annotations[i].show_popup;

			if (spot_circle) {
				spot_left = annotations[i].spot_left;
					//toFixed((annotations[i].spot_left + 22) / this.canvas.width * 100, 2) + '%';
				spot_top = annotations[i].spot_top;
					//toFixed((annotations[i].spot_top + 22) / this.canvas.height * 100, 2) + '%';
			}

			var spot_width = toFixed(44 / canvas.width * 100, 2) + '%';
			var spot_height = toFixed(44 / canvas.height * 100, 2) + '%';

			if (!spot_circle) {
				spot_width = toFixed(annotations[i].spot_width / canvas.width * 100, 2) + '%';
				spot_height = toFixed(annotations[i].spot_height / canvas.height * 100, 2) + '%';
			}

			result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{";

			if (tint_color != annotation_defaults.tint_color) {
				result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tint_color : " + '"' + tint_color + '"' + ',';
			}
			if (style != annotation_defaults.style) {
				result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;style : " + style + ',';
			}
			if (width != annotation_defaults.popup_width) {
				result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;popup_width : " + '"' + width + '"' + ',';
			}
			if (height != annotation_defaults.popup_height) {
				result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;popup_height : " + '"' + height + '"' + ',';
			}
			if (popup_position != annotation_defaults.popup_position) {
				result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;popup_position : " + '"' + popup_position + '"' + ',';
			}
			if (content_type != annotation_defaults.content_type) {
				result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;content_type : " + '"' + content_type + '"' + ',';
			}
			if (title != annotation_defaults.title) {
				result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title : " + '"' + title + '"' + ',';
			}
			if (text != annotation_defaults.text) {
				result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;text : " + '"' + text + '"' + ',';
			}
			if (text_color != annotation_defaults.text_color) {
				result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;text_color : " + '"' + text_color + '"' + ',';
			}
			if (html != annotation_defaults.html) {
				result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;html : " + "'" + replaceAll(html, "'", '"') + "'" + ',';
			}
			if (id != annotation_defaults.id) {
				result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id : " + '"' + id + '"' + ',';
			}
			if (spot_left != annotation_defaults.spot_left) {
				result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;spot_left : " + '"' + spot_left + '"' + ',';
			}
			if (spot_top != annotation_defaults.spot_top) {
				result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;spot_top : " + '"' + spot_top + '"' + ',';
			}
			if (spot_width != annotation_defaults.spot_width) {
				result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;spot_width : " + '"' + spot_width + '"' + ',';
			}
			if (spot_height != annotation_defaults.spot_height) {
				result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;spot_height : " + '"' + spot_height + '"' + ',';
			}
			if (spot_circle != annotation_defaults.spot_circle) {
				result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;spot_circle : " + spot_circle;
			}
			
			if (show_popup != annotation_defaults.show_popup) {
				result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;show_popup : " + show_popup;
			}

			result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}";

			if (i != annotations.length - 1) {
				result += ',';
			}
		}

		if (annotations.length > 0) {
			result += "<br>&nbsp;&nbsp;&nbsp;&nbsp;]";
		}

		result += '<br>});';

		$('#well-jquery').html(result);

		var project=$('#fllorplan-current').val();
		$.post("https://stagin.piktar.tech/public/user/project/savefloorplandata",
			{
				id:project,
				content:result
			},
			function(data,status){


			});
		$('#well-jquery').wrapInner('<code></code>');
	}

	function generate_preview() {
		var plugin_container = $('#plugin-container');

		plugin_container.html('');
		plugin_container.append('<img src="'+ canvas.img.src +'" id="the-img-tag">');

		var frameWidth = (canvas.settings.frameWidth == "auto") ? '100%' : canvas.settings.frameWidth;
		var frameHeight = (canvas.settings.frameHeight == "auto") ? '100%' : canvas.settings.frameHeight;
		var maxZoom = (canvas.settings.maxZoom == "auto") ? 'auto' : canvas.settings.maxZoom;
		var navigator = canvas.settings.navigator;
		var navigatorImagePreview = canvas.settings.navigatorImagePreview;
		var fullscreen = canvas.settings.fullscreen;
		var rubberband = canvas.settings.rubberband;

		var annotations = new Array();

		for (drawable_id in drawables) {
			var drawable = drawables[drawable_id];

			if (drawable != undefined) {
				annotations.push(drawable.settings);
			}
		}

		for (var i=0; i<annotations.length; i++) {
			// var tint_color = annotations[i].tint_color;
			// var style = annotations[i].style;
			// var width = (annotations[i].popup_width == "auto") ? 'auto' : annotations[i].popup_width;
			// var height = (annotations[i].popup_height == "auto") ? 'auto' : annotations[i].popup_height;
			// var popup_position = annotations[i].popup_position;
			// var content_type = annotations[i].content_type;
			// var title = annotations[i].title;
			// var text = annotations[i].text;
			// var text_color = annotations[i].text_color;
			annotations[i].html = annotations[i].html;
			// var id = annotations[i].id;
			var spot_left = annotations[i].spot_left;
				//toFixed(annotations[i].spot_left / this.canvas.width * 100, 2) + '%';
			var spot_top = annotations[i].spot_top;
				//toFixed(annotations[i].spot_top / this.canvas.height * 100, 2) + '%';
			var spot_circle = annotations[i].spot_circle;

			if (spot_circle) {
				spot_left = annotations[i].spot_left;
					//toFixed((annotations[i].spot_left + 22) / this.canvas.width * 100, 2) + '%';
				spot_top = annotations[i].spot_top;
					//toFixed((annotations[i].spot_top + 22) / this.canvas.height * 100, 2) + '%';
			}

			var spot_width = toFixed(44 / this.canvas.width * 100, 2) + '%';
			var spot_height = toFixed(44 / this.canvas.height * 100, 2) + '%';

			if (!spot_circle) {
				spot_width = toFixed(annotations[i].spot_width / this.canvas.width * 100, 2) + '%';
				spot_height = toFixed(annotations[i].spot_height / this.canvas.height * 100, 2) + '%';
			}

			annotations[i] = {
				tint_color : annotations[i].tint_color,
				style : annotations[i].style,
				popup_width : annotations[i].popup_width,
				popup_height : annotations[i].popup_height,
				popup_position : annotations[i].popup_position,
				content_type : annotations[i].content_type,
				title : annotations[i].title,
				text : annotations[i].text,
				text_color : annotations[i].text_color,
				html : annotations[i].html,
				id : annotations[i].id,
				spot_left : spot_left,
				spot_top : spot_top,
				spot_width : spot_width,
				spot_height : spot_height,
				spot_circle : annotations[i].spot_circle,
				show_popup:annotations[i].show_popup
			}
		}

		$('#the-img-tag').annotatorPro({
			frameWidth : frameWidth,
			frameHeight : frameHeight,
			maxZoom : maxZoom,
			navigator : navigator,
			navigatorImagePreview : navigatorImagePreview,
			fullscreen : fullscreen,
			rubberband : rubberband,
			annotations : annotations
		});
	}

	function load_jquery(text) {
		try {
			var regex = /\$\(.+\).annotatorPro\(/g;
			var text_filtered = text.replace(regex, "var options = ");

			regex = /\)\;/g;
			text_filtered = text_filtered.replace(regex, '');

			eval(text_filtered);

			// delete old canvas
			$('.ndd-drawable-canvas').html('<img src="'+canvas.img.src+'" class="ndd-drawable-canvas-image"><div class="ndd-drawables-container"></div>');

			// reset global variables
			var canvasWidth = this.canvas.width;
			var canvasHeight = this.canvas.height;

			selected_drawable = undefined;
			canvas = undefined;
			active_object = undefined;
			drawables = new Array();

			// initialize canvas
			init_canvas(canvasWidth, canvasHeight, function() {
				var canvasSettings = $.extend({}, canvas_defaults);

				if (options.frameWidth != undefined) {
					canvasSettings.frameWidth = options.frameWidth;
				}

				if (options.frameHeight != undefined) {
					canvasSettings.frameHeight = options.frameHeight;
				}

				if (options.maxZoom != undefined) {
					canvasSettings.maxZoom = options.maxZoom;
				}

				if (options.navigator != undefined) {
					canvasSettings.navigator = options.navigator;
				}

				if (options.navigatorImagePreview != undefined) {
					canvasSettings.navigatorImagePreview = options.navigatorImagePreview;
				}

				if (options.fullscreen != undefined) {
					canvasSettings.fullscreen = options.fullscreen;
				}

				canvas.settings = canvasSettings;

				load_settings({});
				refresh_form();

				// rebuild annotations
				if (options.annotations != undefined) {
					for (var i=0; i<options.annotations.length; i++) {
						var annotation = options.annotations[i];

						var drawable = undefined;

						// annotation type
						var x, y, width, height, spot_circle;

						if (annotation.spot_circle === false) {
							// is rect
							x = annotation.spot_left;
								//parseFloat(annotation.spot_left)/100 * this.canvas.width;
							y = annotation.spot_top;
								//parseFloat(annotation.spot_top)/100 * this.canvas.height;
							width = annotation.spot_width;
								//parseFloat(annotation.spot_width)/100 * this.canvas.width;
							height = annotation.spot_height;
								//parseFloat(annotation.spot_height)/100 * this.canvas.height;
							spot_circle = false;

							drawable = canvas.create_rect_spot(x, y, width, height);
						} else {
							// is circle
							x = annotation.spot_left;
							//parseFloat(annotation.spot_left)/100 * this.canvas.width;
							y = annotation.spot_top;
								//parseFloat(annotation.spot_top)/100 * this.canvas.height;
							spot_circle = true;

							drawable = canvas.create_circle_spot(x, y);
						}

						// annotation style
						var drawable_settings = $.extend({}, annotation_defaults);

						if (annotation.tint_color != undefined) {
							drawable_settings.tint_color = annotation.tint_color;
						}

						if (annotation.style != undefined) {
							drawable_settings.style = annotation.style;
						}

						if (annotation.popup_width != undefined) {
							drawable_settings.popup_width = annotation.popup_width;
						}

						if (annotation.popup_height != undefined) {
							drawable_settings.popup_height = annotation.popup_height;
						}

						if (annotation.popup_position != undefined) {
							drawable_settings.popup_position = annotation.popup_position;
						}
						
						if (annotation.show_popup != undefined) {
							drawable_settings.show_popup = annotation.show_popup;
						}

						if (annotation.content_type != undefined) {
							drawable_settings.content_type = annotation.content_type;
						}

						if (annotation.title != undefined) {
							drawable_settings.title = annotation.title;
						}

						if (annotation.text != undefined) {
							drawable_settings.text = annotation.text;
						}

						if (annotation.text_color != undefined) {
							drawable_settings.text_color = annotation.text_color;
						}

						if (annotation.html != undefined) {
							drawable_settings.html = annotation.html;
						}

						drawable_settings.id = annotation.id;

						drawable_settings.spot_left = x;
						drawable_settings.spot_top = y;
						drawable_settings.spot_width = width;
						drawable_settings.spot_height = height;
						drawable_settings.spot_circle = spot_circle;

						drawable.apply_settings(drawable_settings);
						drawable.annotation.apply_settings(drawable_settings);
					}
				}
			});

			return true;
		} catch (e) {
			log(e)
			return false;
		}
	}
	function traceEvent(){
		console.log('event');
		if (selected_drawable != undefined) {
			//current_settings.rotation=$("#rotation").val();
			var rot=$("#rotation").val();

			selected_drawable.obj.css({
				//left : self.left,
				//top : self.top
				'-webkit-transform' : 'rotate('+rot+'deg)',
				'-moz-transform' : 'rotate('+rot+'deg)',
				'-ms-transform' : 'rotate('+rot+'deg)',
				'-o-transform' : 'rotate('+rot+'deg)',
				'transform' : 'rotate('+rot+'deg)'
			});

			apply_settings();
		}
	}

	/*$("#rotation").roundSlider({
		sliderType: "min-range",
		radius: 130,
		showTooltip: true,
		editableTooltip:false,

		value: 0,
		min:0,
		max:360,
		circleShape: "half-top",

		startAngle: 45,
		width: 8,
		handleSize: "+16",
		handleShape: "dot",
		//circleShape: "half-top",

	});*/

	function init() {


		// PopOver
		var settings = {
			trigger:'click',
			//placement:function(el){return el.data('placement')},
			title:'',
			content:'',
			width:300,
			multi:false,
			closeable:false,
			style:'',
			padding:true
		};


		//rotation

		var
			rotations = {content:' <input  oninput="traceEvent();" class="w-100" type="range" id="rotation" min="0" max="360" value="0">',
				title:''
			};
		$('#rotationb').webuiPopover('destroy').webuiPopover($.extend({},settings,rotations));


		//hotspot style
		var
			hotspotstyle = {content:'<input type="color" class="form-control" oninput="traceEvent();" onchange="traceEvent();" id="color-tint-color" value="#000000">\n' +
					'                        <span class="input-group-addon d-none" id="color-tint-color-hex">#000</span><div style="padding-left: 24px;" class="btn-group row w-100"> <label class="btn btn-default col-lg-3 col-md-4 rounded shadow m-1 active">\n' +
					'                            <input type="radio" name="radio-popup-position" class="d-none" onchange="traceEvent();" id="radio-popup-style-1" checked><div class="icon-in-label ndd-spot-icon icon-style-1"><div class="ndd-icon-main-element"></div><div class="ndd-icon-border-element"></div></div>\n' +
					'                        </label>\n' +
					'                        <label class="btn btn-default col-3  rounded shadow m-1" style="align-items: center; text-align: center; display: flex; flex-direction: column; padding: 8px 0px 0px 0px;">\n' +
					'                            <input type="radio" name="radio-popup-position" class="d-none" onchange="traceEvent();" id="radio-popup-style-5"><div class="icon-in-label ndd-spot-icon icon-style-5"><img src="https://stagin.piktar.tech/public/frontend/stagintheme/img/annotator-pro/icon_loc_01.png"></div>\n' +
					'                        </label>\n' +
					'                        <label class="btn btn-default col-3  rounded shadow m-1" style="align-items: center; text-align: center; display: flex; flex-direction: column; padding: 8px 0px 0px 0px;">\n' +
					'                            <input type="radio" name="radio-popup-position" class="d-none" onchange="traceEvent();" id="radio-popup-style-6"><div class="icon-in-label ndd-spot-icon icon-style-6"><img src="https://stagin.piktar.tech/public/frontend/stagintheme/img/annotator-pro/icon_loc_02.png"></div>\n' +
					'                        </label>\n' +
					'                        <label class="btn btn-default col-3  rounded shadow m-1" style="align-items: center; text-align: center; display: flex; flex-direction: column; padding: 8px 0px 0px 0px;">\n' +
					'                            <input type="radio" name="radio-popup-position" class="d-none" onchange="traceEvent();" id="radio-popup-style-7"><div class="icon-in-label ndd-spot-icon icon-style-7"><img src="https://stagin.piktar.tech/public/frontend/stagintheme/img/annotator-pro/icon_loc_03.png"></div>\n' +
					'                        </label>\n' +
					'                        <label class="btn btn-default col-3  rounded shadow m-1" style="align-items: center; text-align: center; display: flex; flex-direction: column; padding: 8px 0px 0px 0px;">\n' +
					'                            <input type="radio" name="radio-popup-position" class="d-none" onchange="traceEvent();" id="radio-popup-style-8"><div class="icon-in-label ndd-spot-icon icon-style-8"><img src="https://stagin.piktar.tech/public/frontend/stagintheme/img/annotator-pro/icon_loc_04.png"></div>\n' +
					'                        </label>\n' +
					'                        <label class="btn btn-default col-3  rounded shadow m-1" style="align-items: center; text-align: center; display: flex; flex-direction: column; padding: 8px 0px 0px 0px;">\n' +
					'                            <input type="radio" name="radio-popup-position" class="d-none" onchange="traceEvent();" id="radio-popup-style-9"><div class="icon-in-label ndd-spot-icon icon-style-9"><img src="https://stagin.piktar.tech/public/frontend/stagintheme/img/annotator-pro/icon_loc_05.png"></div>\n' +
					'                        </label>\n' +
					'                        <label class="btn btn-default col-3  rounded shadow m-1" style="align-items: center; text-align: center; display: flex; flex-direction: column; padding: 8px 0px 0px 0px;">\n' +
					'                            <input type="radio" name="radio-popup-position" class="d-none" onchange="traceEvent();" id="radio-popup-style-10"><div class="icon-in-label ndd-spot-icon icon-style-10"><img src="https://stagin.piktar.tech/public/frontend/stagintheme/img/annotator-pro/icon_loc_06.png"></div>\n' +
					'                        </label>\n' +
					'                        <label class="btn btn-default col-3  rounded shadow m-1" style="align-items: center; text-align: center; display: flex; flex-direction: column; padding: 8px 0px 0px 0px;">\n' +
					'                            <input type="radio" name="radio-popup-position" class="d-none" onchange="traceEvent();" id="radio-popup-style-11"><div class="icon-in-label ndd-spot-icon icon-style-11"><img src="https://stagin.piktar.tech/public/frontend/stagintheme/img/annotator-pro/icon_loc_07.png"></div>\n' +
					'                        </label>\n' +
					'                        <label class="btn btn-default col-3  rounded shadow m-1" style="align-items: center; text-align: center; display: flex; flex-direction: column; padding: 8px 0px 0px 0px;">\n' +
					'                            <input type="radio" name="radio-popup-position" class="d-none" onchange="traceEvent();" id="radio-popup-style-12"><div class="icon-in-label ndd-spot-icon icon-style-12"><img src="https://stagin.piktar.tech/public/frontend/stagintheme/img/annotator-pro/icon_loc_08.png"></div>\n' +
					'                        </label>\n' +
					'                        <label class="btn btn-default col-3  rounded shadow m-1" style="align-items: center; text-align: center; display: flex; flex-direction: column; padding: 8px 0px 0px 0px;">\n' +
					'                            <input type="radio" name="radio-popup-position" class="d-none" onchange="traceEvent();" id="radio-popup-style-13"><div class="icon-in-label ndd-spot-icon icon-style-13"><img src="https://stagin.piktar.tech/public/frontend/stagintheme/img/annotator-pro/icon_loc_09.png"></div>\n' +
					'                        </label>\n' +
					'                        <label class="btn btn-default col-3  rounded shadow m-1" style="align-items: center; text-align: center; display: flex; flex-direction: column; padding: 8px 0px 0px 0px;">\n' +
					'                            <input type="radio" name="radio-popup-position" class="d-none" onchange="traceEvent();" id="radio-popup-style-2"><div class="icon-in-label ndd-spot-icon icon-style-2"><div class="ndd-icon-main-element"></div><div class="ndd-icon-border-element"></div></div>\n' +
					'                        </label>\n' +
					'\n' +
					'                        <label class="btn btn-default col-3  rounded shadow m-1" style="align-items: center; text-align: center; display: flex; flex-direction: column; padding: 8px 0px 0px 0px;">\n' +
					'                            <input type="radio" name="radio-popup-position" class="d-none" onchange="traceEvent();" id="radio-popup-style-4"><div class="icon-in-label ndd-spot-icon icon-style-4"><div class="ndd-icon-main-element"></div><div class="ndd-icon-border-element"></div></div>\n' +
					'                        </label></div>',
				title:'',
				closeable:false,
				style:'',
				padding:false
			};
		$('#hotspotb').webuiPopover('destroy').webuiPopover($.extend({

		},settings,hotspotstyle));










	}

	if (window.addEventListener) { //when document is loaded initiate init
		document.addEventListener("DOMContentLoaded", init, false);
	} else if (window.attachEvent) {

		document.attachEvent("onDOMContentLoaded", init);
	}
	$(document).ready(function() {
		// return;
		init_canvas(0, 0, function() {
			init_global_events();
			form_events();
			load_settings({});
			refresh_form();
		});



		window.addEventListener("resize", function(){
			init_canvas(0, 0, function() {});
		});









	});


































function log(obj) { console.log(obj); }

function escapeHTML(str) { return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function toFixed ( number, precision ) {
    var multiplier = Math.pow( 10, precision + 1 ),
        wholeNumber = Math.floor( number * multiplier );
    return Math.round( wholeNumber / 10 ) * 10 / multiplier;
}

function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function selectText(containerid) {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().addRange(range);
    }
}
