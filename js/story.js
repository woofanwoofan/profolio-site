require.config(
{
    paths:
    {
        JerJerDetect: '../scripts/JerJerDetect',
        jquery: '../scripts/jquery-3.3.1.min',
        velocity: '../scripts/velocity.min',
        easing: '../scripts/jquery.easing.1.3.min',
        imagesloaded: '../scripts/imagesloaded.pkgd.min',
        fastclick: '../scripts/fastclick.min',
        pixi: '../scripts/pixi.min',
        nicescroll: '../scripts/jquery.nicescroll.min',
        tracking: '../js/tracking',
        slick: '../slick/slick.min',
        aos: '../scripts/aos'
    },
    shim:
    {
        easing:
        {
            deps: ['jquery']
        },
        velocity:
        {
            deps: ['jquery']
        },
        index_:
        {
            deps: ['jquery']
        },
        imagesloaded:
        {
            deps: ['jquery']
        },
        nicescroll:
        {
            deps: ['jquery']
        },
        slick:
        {
            deps: ['jquery']
        },
        jquery:
        {
            deps: ['aos', 'fastclick']
        }
    }
});
require(['JerJerDetect', 'jquery', 'velocity', 'easing', 'fastclick', 'tracking', 'nicescroll', 'imagesloaded', 'slick', 'aos'], function(jerjer, $, velocity, easing, FastClick, tracking, nicescroll, imagesloaded, slick, AOS)
{
    (function($)
    {
        $.fn.MainDataInIt = function()
        {
            
        }
        $.fn.DragScroll = function()
        {
            var getPointerEvent = function(event)
            {
                return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event;
            };
            var _self = $(this),
                touchStarted = false,
                currX = 0,
                currY = 0,
                cachedX = 0,
                cachedY = 0,
                startPozX = 0,
                stayPozX = 0,
                nowPozX = (0.5*1200-0.5*124),
                clickFlag = true,
                event_array = [
                    ['mousedown', 'touchstart'],
                    ['mousemove', 'touchmove'],
                    ['mouseup', 'touchend'],
                ],
                temp_speed = 0,
                run = false,
                pointer_start,
                pointer_move,
                pointer_end,
                pre_index = 0,
                temp_index = 0,
                _self_index = 0,
                target_index = 0,
                temp_speed_abs = 0,
                drag_ratio = 0.6,
                total_num = $.time_flag.length,
                temp_count = 0,
                temp_delta = 0,
                temp_translate_x = 0,
                temp_rotate_y = 0,
                expand_max = 300/2,
                rotate_max = 100/2,
                correct_num = 0,
                out_range = 0,
                decade_rate = (webMode=="PC")?0.9:0.8,
                click_mode = false,
                ease_num = 0,
                ease_speed = 0,
                temp_speed_direction,
                first_scroll = false;

            $.time_frame.css({'width': total_num*124+'px'});
            _self.on(
                ((webMode == "PC") ? event_array[0][0] : event_array[0][1]),
                function(e)
                {

                    trackEvent(curpagename,((webMode == "PC") ? event_array[0][0] : event_array[0][1]));
                    // $.Body.addClass('touch_start');
                    if(webMode == "PC")
                    {
                    	e.preventDefault();
                    } else if ($.w_w < 400)
                    {
                    }
                    pointer_start = getPointerEvent(e);
                    // caching the current x
                    cachedX = currX = pointer_start.pageX*drag_ratio;
                    // caching the current y
                    cachedY = currY = pointer_start.pageY;
                    // a touch event is detected      
                    touchStarted = true;
                    //$.videoBox0.html('Touchstart');
                    startPozX = currX;
                    stayPozX = nowPozX
                    setTimeout(function()
                    {
                        if ((cachedX === currX) && !touchStarted && (cachedY === currY))
                        {
                            // Here you get the tap event
                            clickFlag = true;
                            // console.log('tap');
                        }
                        else
                        {
                            clickFlag = false;
                        }
                    }, 300);
                }
            );

            _self.on(
                ((webMode == "PC") ? event_array[1][0] : event_array[1][1]),
                function(e)
                {
                    if(webMode == "PC")
                    {
                    	e.preventDefault();
                    }
                    pointer_move = getPointerEvent(e);
                    currX = pointer_move.pageX*drag_ratio;
                    currY = pointer_move.pageY;
                    if (touchStarted)
                    {
                        // here you are swiping
                        // console.log('swiping');
                        nowPozX = Math.max(Math.min(( currX - startPozX ) + stayPozX,538+62+out_range), -((out_range + total_num*124) - 600) );

                        $.time_frame.css(
                        {
                            'left':  nowPozX + 'px'
                        });
                        // setPoz();
                    }
                }
            );
            _self.on(
                ((webMode == "PC") ? event_array[2][0] : event_array[2][1]),
                function(e)
                {
                    // here we can consider finished the touch event
                    e.preventDefault();
                    touchStarted = false;
                    $.Body.removeClass('touch_start');
                    // console.log('mouseup or touchend');
                    // _self.html('mouseup or touchend');
                    // console.log(temp_speed);
                    // stayPozX = nowPozX;                            
                }
            );

            if (webMode == "PC")
            {
                _self.on(
                    "mouseleave",
                    function(e)
                    {
                        if(touchStarted)
                        {
                            // here we can consider finished the touch event
                            e.preventDefault();
                            touchStarted = false;
                            console.log('mouseleave');
                    		$.Body.removeClass('touch_start');
                            // _self.html('mouseup or touchend');

                            // stayPozX = nowPozX;                                                
                        }
                    }
                );
            }


            var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
            window.requestAnimationFrame = requestAnimationFrame;
            function setPoz()
            {

                if(nowPozX > 538)
                {
                    nowPozX = 538;
                } else if(nowPozX < -(total_num*124 - 600 -62))
                {
                    nowPozX = -(total_num*124 - 600 -62);
                }            	
                $.story_item.each(
                    function(){
                        _self_index = $(this).index();
                        temp_count = 0.5*Math.PI*(_self_index+(nowPozX -538)/124)/(total_num-1);
                        temp_delta = (nowPozX -538) + temp_index*124;

                        if(_self_index == temp_index)
                        {
                            temp_rotate_y = -rotate_max*( temp_delta )/62;
                            if(temp_delta >= 0)/*right*/
                            {
                                temp_translate_x = 124*_self_index+(nowPozX -538) + expand_max*( temp_delta )/62;  
                            } else /*left*/
                            {
                                temp_translate_x = 124*_self_index+(nowPozX -538) + expand_max*( temp_delta )/62;  
                            }
                        } else if(  temp_delta >= 0 && _self_index == temp_index - 1 )
                        {
                            temp_rotate_y = rotate_max+rotate_max*( 62 - temp_delta )/62;
                            temp_translate_x = 124*_self_index+(nowPozX -538) + expand_max*( -62 )/62 - expand_max*( 62 - temp_delta )/62;
                        }else if(  temp_delta < 0 && _self_index == temp_index + 1 )
                        {
                            temp_rotate_y = -rotate_max*2-rotate_max*( temp_delta )/62;
                                temp_translate_x = 124*_self_index+(nowPozX -538) + expand_max*( 62 )/62 + expand_max*( 62 + temp_delta )/62;  
                        } else if(_self_index < temp_index)
                        {
                            temp_rotate_y = rotate_max*2;
                            temp_translate_x = 124*_self_index+(nowPozX -538) - expand_max - expand_max;  
                        } else if(_self_index > temp_index)
                        {
                            temp_rotate_y = -rotate_max*2;
                            temp_translate_x = 124*_self_index+(nowPozX -538) + expand_max + expand_max;  
                        }
                        $(this).css(
                           {
                               'transform':'translateX('+  0.8*temp_translate_x +'px) '+'translateZ('+  0  +'px)'+'scale('+ (1- Math.min(0.7*1*Math.abs(Math.sin(temp_count)) ,0.7) ) +') '+'rotateY('+  temp_rotate_y +'deg)',
                               'z-index': Math.floor(500-500*Math.abs(Math.sin(temp_count))),
                               'opacity':Math.abs(Math.pow(Math.floor(500-500*Math.abs(Math.sin(temp_count)))/500,3))
                           }
                       );
                        $.time_flag.eq(_self_index).css(
                           {
                               'opacity':Math.abs(Math.pow(Math.floor(500-500*Math.abs(Math.sin(temp_count)))/500,3))
                           }
                       );
                    }
                );
            }
            setPoz();
            function loop()
            {
                if(touchStarted)
                {
                    temp_index = -1*Math.ceil((nowPozX-600)/124);
                    temp_speed = currX - cachedX;
                    cachedX = currX;
                    // console.log(temp_index);
                } else {
                    if(nowPozX > 538)
                    {
                        nowPozX = 538;
                    } else if(nowPozX < -(total_num*124 - 600 -62))
                    {
                        nowPozX = -(total_num*124 - 600 -62);
                    }
                    // temp_speed_abs = Math.abs(temp_speed);
                    if(!click_mode)
                    {
                        temp_index = -1*Math.ceil((nowPozX-600)/124);
                        if(temp_index < 0)
                        {
                            temp_index = 0;
                        } else if(temp_index >= 10)
                        {
                            temp_index = 9;
                        }

                        if(Math.abs(temp_speed) < 0.5)
                        {

                            correct_num = 600-62- temp_index*124;

                            if(Math.abs(correct_num - nowPozX) < 1)
                            {
                                nowPozX = correct_num;
                            } else {

                                ease_speed = (correct_num - nowPozX)/5;
                                if(!first_scroll){
                                    first_scroll = true;
                                    $.Window.scrollTop($.time_line.offset().top-87);
                                }
                            }

                        } else {
                        }
                        temp_speed *= decade_rate;
                        nowPozX += (temp_speed+ease_speed);
                        $.time_frame.css(
                            {
                                'left': nowPozX + 'px'
                            }
                        );
                    } else {
                    	correct_num = 600-62- temp_index*124;
                        temp_speed = (correct_num - nowPozX)/2;
                    	// console.log(temp_index,'click');
                        if(Math.abs(correct_num - nowPozX) < 2)
                        {
                            click_mode = false;
                        }
                        if(!first_scroll){
                            first_scroll = true;
                            $.Window.scrollTop($.time_line.offset().top-87);
                        }
                        temp_speed *= decade_rate;
                        nowPozX += (temp_speed+ease_speed);
                        $.time_frame.css(
                            {
                                'left': nowPozX + 'px'
                            }
                        );
                    }   
                }



                setPoz();

                requestAnimationFrame(
                    function()
                    {
                        loop();
                    }
                );

            }
            loop();
            $.Body.on(
                'click',
                '#time_arrow_l,#time_arrow_r,.time_flag,.story_item',
                function(e)
                {
                    temp_click = $(this);
                    switch (true)
                    {
                        case temp_click.attr('id') == 'time_arrow_l':
                            temp_index -= 1;
                            if(temp_index < 0)
                            {
                                temp_index = 0;
                            }
                            correct_num = 600-62- temp_index*124;
                            click_mode = true;
                            trackEvent(curpagename,'time_arrow_l');
                        break;
                        case temp_click.attr('id') == 'time_arrow_r':
                            temp_index += 1;
                            if(temp_index >= total_num)
                            {
                                temp_index = total_num-1;
                            }
                            correct_num = 600-62- temp_index*124;
                            click_mode = true;
                            trackEvent(curpagename,'time_arrow_r');
                        break;
                        case temp_click.hasClass('time_flag'):
                            temp_index = temp_click.index('.time_flag');
                            correct_num = 600-62- temp_index*124;
                            click_mode = true;
                            trackEvent(curpagename,'time_flag_'+temp_index);
                        break;
                        case temp_click.hasClass('story_item'):
                            temp_index = temp_click.index('.story_item');
                            correct_num = 600-62- temp_index*124;
                            click_mode = true;
                            if($.Body.hasClass('end')){
                                trackEvent(curpagename,'story_item_'+temp_index);
                            }
                        break;
                    }
                }
            );
            $.story_item.eq(total_num-1).trigger('click');
            $.Body.addClass('show')
            $.ani = $({'ani': 100});
            // var pre_ani = total_num-1,
            //     cur_ani = total_num-1;
            $.ani.delay(1000).animate(
            	{
            		ani: 0
            	},
            	{
            		step:function(now,fx){
            			touchStarted = true;
            			$.time_frame.css({'left': nowPozX+'px'})
            			nowPozX = 538 -124*(total_num-1)*(now/100);
            			// console.log(nowPozX);
            			// cur_ani = Math.floor(now);
            			// if(pre_ani !== cur_ani){
               //              console.log(Math.floor(cur_ani));
               //              pre_ani = cur_ani;
               //              $.story_item.eq(cur_ani).trigger('click');
            			// }
            		},
            		duration: 1200,
            		easing:'easeInOutCirc',
            		complete:function(){
                        touchStarted = false;
                        $.Body.addClass('end');
            		}
            	}
            );
            // console.log(total_num)

            // var temp_animate_count = 1,
            //     temp_animate = setInterval(
            // 	function(){
            // 		$.story_item.eq(total_num-1-temp_animate_count).trigger('click');
            // 		temp_animate_count++;
            // 		// console.log(total_num-1-temp_animate_count);
            // 		if(temp_animate_count == total_num){
            //             clearInterval(temp_animate);
            // 		}
            // 	},
            // 	100
            // );
        }
        $.fn.ResizeInIt = function()
        {
            $.centerPadding = 0 + 'px';
            var mobile_ratio = 980 / 1463,
                mobile_point = 395;

            function resizing()
            {
                $.w_w = $.Window.width();
                $.w_h = $.Window.height();
                if ($.w_w > mobile_point)
                {
                    $.Body.css(
                    {
                        'font-size': 100 + '%'
                    });
                    $.nav_checkbox.get(0).checked = false;
                }
                else
                {
                    $.Body.css(
                    {
                        'font-size': 100 * ($.w_w / mobile_point) + '%'
                    });
                }
                if ($.w_w > 1200)
                {
                    $.limit_font.css(
                    {
                        'font-size': 100 + '%'
                    });
                }
                else if ($.w_w <= 1200 && $.w_w >= mobile_point)
                {
                    $.limit_font.css(
                    {
                        'font-size': (($.w_w / 1200) * 100) + '%'
                    });
                }
                else
                {
                    $.limit_font.css(
                    {
                        'font-size': (($.w_w / mobile_point) * 100) + '%'
                    });
                }
            }
            $.Window.resize(resizing).trigger('resize');
        }
        $.fn.ComCss = function(property)
        {
            var _self = $(this);
            _self['propObj'] = {};
            for (x in property)
            {
                _self.propObj['-webkit-' + x] = property[x];
                _self.propObj['-moz-' + x] = property[x];
                _self.propObj['-ms-' + x] = property[x];
                _self.propObj[x] = property[x];
            }
            _self.css(_self.propObj);
            for (x in _self.propObj)
            {
                // delete _self.propObj[x];
            }
            delete _self.propObj;
            property = null;
            _self = null;
        }
    })(jQuery);
    $(function()
    {
        FastClick.attach(document.body);
        $.Body = $('body');
        $.Window = $(window);
        $.Loading = $.Body.find('div#loading');
        $.slider_sec = $.Body.find('#slider_sec');
        $.loading_line = $.Body.find('div#loading_line');
        $.limit = $.Body.find('.limit');
        $.nav_checkbox = $.Body.find('#nav-checkbox');
        $.limit_font = $.Body.find('.font_limit');
        $.time_line = $.Body.find('#time_line');
        $.time_frame = $.Body.find('#time_frame');
        $.data_box = $.Body.find('#data_box');
        $.time_flag = $.Body.find('.time_flag');
        $.story_item = $.Body.find('.story_item');
        if (webMode == 'PC')
        {
            $.Body.addClass('pc');
        }
        $.Body.ResizeInIt();

        var loadedImageCount = 0,
            imageCount = 0;
        $.time_line.DragScroll();
        $('#slider_sec').imagesLoaded()
            .always(
                function(instance)
                {
                    // console.log('all images loaded');
                    $.Loading.velocity(
                    {
                        'opacity': 0
                    },
                    {
                        duration: 200,
                        easing: "swing",
                        queue: "",
                        begin: undefined,
                        progress: undefined,
                        complete: function()
                        {
                            $.Loading.css(
                            {
                                'display': 'none'
                            });
                            $.Body.MainDataInIt();
                            AOS.init();
                            // $('head').append('<link href="http://fonts.googleapis.com/earlyaccess/notosanstc.css" rel="stylesheet" type="text/css"/>');
                        },
                        display: undefined,
                        visibility: undefined,
                        loop: false,
                        delay: 500,
                        /*false*/
                        mobileHA: true
                    });
                }
            )
            .done(
                function(instance)
                {
                    // console.log('all images successfully loaded');
                }
            )
            .fail(
                function()
                {
                    // console.log('all images loaded, at least one is broken');
                }
            )
            .progress(
                function(instance, image)
                {
                    var result = image.isLoaded ? 'loaded' : 'broken';
                    // console.log( 'image is ' + result + ' for ' + image.img.src );
                    // imageCount ++;
                    // $.loading_line.css({'width': 100*(imageCount/instance.images.length)+'%'});
                }
            );
    });
});
