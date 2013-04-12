/*
 * iSlider v1.3
 * @description: jQuery slide plugin
 * @author: haozi
 * @modify: 2013.04.10
*/
;(function($){
	function iSlider(element, options){
		this.options = {
			/*
			 * 切换效果
			 * {string} show/fade/vslide/hslide/vcover/hcover
			*/
			effect: 'hslide', 

			/*
			 * 间隔时间
			 * {number}
			*/
			speed: 4000,

			/*
			 * 初始显示项
			 * {number}
			*/
			index: 0,

			/*
			 * mouseover延迟时间
			 * {number}
			*/
			delay: 120,

			/*
			 * 是否定时切换
			 * {boolean}
			*/
			timing: true,

			/*
			 * ctrl是否可操作
			 * {boolean}
			*/
			ctrlHandle: true,

			/*
			 * ctrl和前后操作
			 * {array}
			*/
			trigger: ['mouseover','click'],

			/*
			 * 鼠标覆盖是否暂停
			 * {boolean}
			*/
			pauseHover: true,

			/*
			 * 当前显示className
			 * {string}
			*/
			active: 'active',

			/*
			 * 配置可操作 htmlElement
			 * roll 切换区域; 如: '.wrap .roll .item'
			 * ctrl 操作; 如: '.ctrl li'
			 * prev 前; 如: '.prev'
			 * next 后; 如: '.next'
			*/
			elements: {
	    		roll: '.slider-wrap .slider-roll .item',
				ctrl: '.slider-ctrl li',
	        	prev: '.slider-prev',
	        	next: '.slider-next'
			}
		};
		this._init(element, options);
	};

	$.fn.iSlider = function(options) {
		var s = new iSlider(this, options);
	};

	iSlider.prototype = {
		_paused: false,
		_stopflag: false,
		_timer: null,
		_type: null,
		_etag: null,
		_cur: 0,
		_mover: 'mouseover',
		
		_init: function(element, options){
			$.extend(true, this.options, options);
			
			if(!$(element) || !$(this.options.elements.roll)) return;

			var o = this, el = o.options.elements.roll.split(' ');

			o.tap = $(element);

			o.ctrl = o.tap.find(o.options.elements.ctrl);
			o.prev = o.tap.find(o.options.elements.prev);
			o.next = o.tap.find(o.options.elements.next);

			o.wrap = o.tap.find(el[0]);
			o.roll = o.wrap.find(el[1]);
			o.item = o.roll.find(el[2]);

			o.count = o.item.length;
			o.last = o.count-1;
			o._trigger = o.options.trigger;

			if(o.options.index!=0){
				o._cur = o.options.index;
			}

			o._type = 'init';
			o._effect();

			o._active();

			if(o.options.timing){
				o._set();
				if(o.options.pauseHover){
					o.tap.hover(function(){
						o._clear();
					},function(){
						o._set();
					})
				}
			}

			if(o.ctrl && o.options.ctrlHandle){
				o.ctrl.each(function(e){
					
					$(this).bind(o._trigger[0],function(){
						o._clear();
						o.etag = e;
						if(o._trigger[0]===o._mover){
							o._ctrlOut = setTimeout(function(){
								o._ctrl();
							},o.options.delay);
						}else{
							o._ctrl();
						}
					}).mouseout(function(){
						if(o._trigger[0]===o._mover) clearTimeout(o._ctrlOut);
					});

				});
			}

			if(o.prev){
				o.prev.bind(o._trigger[1],function(){
					o._clear();
					if(o._trigger[1]===o._mover){
						o._prevOut = setTimeout(function(){
							o._prev();
						},o.options.delay);
					}else{
						o._prev();
					}
				}).mouseout(function(){
					if(o._trigger[1]===o._mover) clearTimeout(o._prevOut);
				});
			}
			
			if(o.next){
				o.next.bind(o._trigger[1],function(){
					o._clear();
					if(o._trigger[1]===o._mover){
						o._nextOut = setTimeout(function(){
							o._next();
						},o.options.delay);
					}else{
						o._next();
					}
				}).mouseout(function(){
					if(o._trigger[1]===o._mover) clearTimeout(o._nextOut);
				});
			}
		},

		_clear: function(){
			var o = this;
			clearInterval(o._timer);
		},

		_set: function(){
			var o = this;
			o._timer = setInterval(function(){ 
				o._auto();
			},o.options.speed);
		},

		_ctrl: function(){
			var o = this;
			if(o.options.effect==='show' || o.options.effect==='fade' || o.options.effect==='vcover' || o.options.effect==='hcover'){
				o.item.eq(o.etag).stop(true,true);
			}else{
				o.roll.stop(true);
			}

			o._cur = o.etag;

			o._type = 'anim';
			o.u = -1;
			o._effect();
			o._active();
		},

		_prev: function(){
			var o = this;
			if(o._stopflag) return;
			o._stopflag = true;

			o._cur<=0 ? o._cur = o.last : o._cur--;

			o._type = 'anim';
			o.u = 0;

			o._effect();
			o._active();
		},

		_next: function(){
			var o = this;
			if(o._stopflag) return;
			o._stopflag = true;

			o._auto();
		},

		_auto: function(){
			var o = this;

			if(o._paused) return;
			o._paused = true;

			o._cur>=o.last ? o._cur=0 : o._cur++;

			o._type = 'anim';
			o.u = 1;

			o._effect();
			o._active();
		},

		_active: function(){
			var o = this, a = o.options.active;
			o.item.eq(o._cur).addClass(a).siblings().removeClass(a);
			o.ctrl.eq(o._cur).addClass(a).siblings().removeClass(a);
			o._paused = false;
		},

		_call: function(){
			var o = this;
			o._stopflag = false;
		},

		_effect: function(){
			var o = this, type = o._type;
			switch(o.options.effect){
				case 'show':
					switch(type){
						case 'init':
							o.item.eq(o._cur).show().siblings().hide();
						break;
						case 'anim':
							o.item.eq(o._cur).show().siblings().hide();
							o._call();
						break;
					}
				break;
				case 'fade':
					switch(type){
						case 'init':
							o.item.eq(o._cur).show().siblings().hide();
							o.item.css({
								position: 'absolute'
							});
						break;
						case 'anim':
							o.item.eq(o._cur).fadeIn(700).siblings().fadeOut(700);
							o._call();
						break;
					}
				break;
				case 'vcover':
					switch(type){
						case 'init':
							o.size = o.wrap.height();
							o.item.css({
								position: 'absolute',
								top: o.size+'px'
							});
							o.item.eq(o._cur).css({
								top: 0
							});
						break;
						case 'anim':
							o.item.not(o.item[o._cur]).css({
								zIndex: 0
							});
							o.item.eq(o._cur).css({
								zIndex: 1
							});
							o.item.eq(o._cur).animate({
								top: 0,
							},400,function(){
								o.item.not(o.item[o._cur]).css({
									top: o.size+'px',
								});
								o._call();
							});
							
						break;
					}
				break;
				case 'hcover':
					switch(type){
						case 'init':
							o.size = o.wrap.width();
							o.item.css({
								position: 'absolute',
								left: o.size+'px'
							});
							o.item.eq(o._cur).css({
								left: 0
							});
						break;
						case 'anim':
							o.item.not(o.item[o._cur]).css({
								zIndex: 0
							});
							o.item.eq(o._cur).css({
								zIndex: 1
							});
							o.item.eq(o._cur).animate({
								left: 0,
							},400,function(){
								o.item.not(o.item[o._cur]).css({
									left: o.size+'px',
								});
								o._call();
							});
							
						break;
					}
				break;
				case 'vslide':
					switch(type){
						case 'init':
							o.size = o.wrap.height();
							o.roll.css({
								top: '-'+o._cur*o.size+'px'
							});
							o.item.css({
								position: 'relative',
								height: o.size+'px'
							});
						break;
						case 'anim':
							if(o.u===0 && o._cur===o.last){
								o.item.eq(o.last).css({
									top: '-'+o.size*o.count+'px'
								});
								o.roll.animate({
									top: o.size+'px'
								},400,function(){
									o.roll.css({
										top: '-'+o.size*(o.last)+'px'
									});
									o.item.eq(o.last).css({
										top: 0
									});
									o._call();
								});
							}else if(o.u===1 && o._cur===0){
								o.item.eq(o._cur).css({
									top: o.size*o.count+'px'
								});
								o.roll.animate({
									top: '-'+o.size*o.count+'px'
								},400,function(){
									o.roll.css({
										top: 0
									});
									o.item.eq(o._cur).css({
										top: 0
									});
									o._call();
								});
							}else{
								o.roll.animate({
									top: '-'+o.size*o._cur+'px'
								},400,function(){
									o._call();
								});
							}
						break;
					}
				break;
				case 'hslide':
					switch(type){
						case 'init':
							o.size = o.wrap.width();
							o.roll.css({
								width: o.size*o.count+'px',
								left: '-'+o._cur*o.size+'px'
							});
							o.item.css({
								position: 'relative',
								width: o.size+'px',
								float: 'left'
							});
						break;
						case 'anim':
							if(o.u===0 && o._cur===o.last){
								o.item.eq(o._cur).css({
									left: '-'+o.size*o.count+'px'
								});
								o.roll.animate({
									left: o.size+'px'
								},function(){
									o.roll.css({
										left: '-'+o.size*(o._cur)+'px'
									});
									o.item.eq(o._cur).css({
										left: 0
									});
									o._call();
								});
							}else if(o.u===1 && o._cur===0){
								o.item.eq(o._cur).css({
									left: o.size*o.count+'px'
								});

								o.roll.animate({
									left: '-'+o.size*o.count+'px'
								},function(){

									o.roll.css({
										left: o._cur
									});
									o.item.eq(o._cur).css({
										left: o._cur
									});
									o._call();
								});
							}else{
								o.roll.animate({
									left: '-'+o.size*o._cur+'px'
								},400,function(){
									o._call();
								});
							}
						break;
					}
				break;
			}
		}
		
	};
}(jQuery));