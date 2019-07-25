require.config(
    {
        paths: {
            'JerJerDetect': '../scripts/JerJerDetect',
            'jquery': '../scripts/jquery-1.10.2.min',
            'jquery_ui':'../scripts/jquery-ui.min',
            'easing': '../scripts/jquery.easing.1.3.min',
            'pixi': '../scripts/pixi.min',
            'tracking': '../js/tracking',
            'imagesloaded':'../scripts/imagesloaded.pkgd.min',
            'smooth-scrollbar': '../scripts/smooth-scrollbar',
            'overscroll': '../scripts/overscroll'
        },
        shim: {
            'easing': {
                deps: ['jquery'],
                exports: 'mine'
            }
        }
    }
);
require(
    [
        'JerJerDetect',
        'jquery',
        'jquery_ui',
        'easing',
        'tracking',
        'pixi',
        'imagesloaded',
        'smooth-scrollbar',
        'overscroll'
    ], function(
        JerJerDetect,
        jquery,
        jquery_ui,
        easing,
        tracking,
        pixi,
        imagesloaded,
        Scrollbar,
        OverscrollPlugin
    ) {
    (function ($){
        $.fn.MainDataInIt = function () {
            $.Body.ResizeInIt();
            $.Body.ScrollInIt();
            $.Body.ClickInIt();
            if(webMode == 'PC'){
                $.Body.DragInIt();
            }
        }
        $.fn.move_forward = function () {
            cur_column += 1;
            $.work.attr(
                {
                    'page-state': 1
                }
            );
            if(cur_column == ( column_campaign + column_official - 2 ) ){
                $.work.attr(
                    {
                        'page-state': 2
                    }
                );
            }
            if(cur_column >= ( column_campaign + column_official ) ){
                cur_column = column_campaign + column_official - 1;
            }
            // console.log(cur_column);  
            if(cur_column <= ( column_campaign -1 ) ){
                scroll_work.scrollIntoView($.campaign_work_item.eq(cur_column).get(0));
                $.work_cate_item.removeClass('active');
                $.go_campaign.addClass('active');
            } else {
                scroll_work.scrollIntoView($.official_work_item.eq(cur_column-column_campaign).get(0));
                $.work_cate_item.removeClass('active');
                $.go_official.addClass('active');
            }
        }
        $.fn.move_backward = function () {
            cur_column -= 1;
            $.work.attr(
                {
                    'page-state': 1
                }
            );
            if(cur_column <= 0){
                $.work.attr(
                    {
                        'page-state': 0
                    }
                );
            }
            if(cur_column <= -1){
                cur_column = 0;
            }
            // console.log(cur_column);  
            if(cur_column <= ( column_campaign -1 ) ){
                scroll_work.scrollIntoView($.campaign_work_item.eq(cur_column).get(0));
                $.work_cate_item.removeClass('active');
                $.go_campaign.addClass('active');
            } else {
                scroll_work.scrollIntoView($.official_work_item.eq(cur_column-column_campaign).get(0));
                $.work_cate_item.removeClass('active');
                $.go_official.addClass('active');
            }
        }
        $.fn.DragInIt = function () {

            var getPointerEvent = function(event)
            {
                return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event;
            };
            var dragStarted = false,
                currX = 0,
                currY = 0,
                cachedX = 0,
                cachedY = 0,
                startPozX = 0,
                startScrollLeft = 0,
                drag_ratio = 0.3,
                clickFlag = true,
                pointer_start,
                pointer_move,
                pointer_end;
            $.work_list.on(
                'mousedown',
                function(e)
                {
                    if(webMode == "PC")
                    {
                        e.preventDefault();
                    }
                    pointer_start = getPointerEvent(e);
                    // caching the current x
                    cachedX = currX = pointer_start.pageX*drag_ratio;
                    // caching the current y
                    cachedY = currY = pointer_start.pageY;
                    // a touch event is detected      
                    dragStarted = true;
                    //$.videoBox0.html('Touchstart');
                    startPozX = currX;

                    startScrollLeft = scroll_work.scrollLeft;

                    setTimeout(function()
                    {
                        if ((cachedX === currX) && !dragStarted && (cachedY === currY))
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
            $.work_list.on(
                'mousemove',
                function(e)
                {
                    if(webMode == "PC")
                    {
                        e.preventDefault();
                    }
                    pointer_move = getPointerEvent(e);
                    currX = pointer_move.pageX*drag_ratio;
                    currY = pointer_move.pageY;
                    if (dragStarted)
                    {
                        // here you are swiping
                        // console.log('swiping');
                        scroll_work.scrollTo( ( startPozX - currX ) + startScrollLeft );
                    }
                }
            );
            $.work_list.on(
                'mouseup',
                function(e)
                {
                    // here we can consider finished the touch event
                    e.preventDefault();
                    dragStarted = false;
                    // console.log('mouseup or touchend and clickFlag = ' + clickFlag);
                    // console.log(currX - startPozX);
                    // for(var i = 0 ; i < column_campaign; i ++){
                    //     console.log(i+' : '+scroll_work.isVisible($.campaign_work_item.eq(i).get(0)));
                    //     if(scroll_work.isVisible($.campaign_work_item.eq(i).get(0))){
                    //         cur_column = i;
                    //         return;
                    //     }
                    // }   
                    if( ( currX - startPozX ) < 0 ) {
                        // console.log('drag left');
                        $.Body.move_forward();
                    } else if (( currX - startPozX ) > 0 ){
                        // console.log('drag right');
                        $.Body.move_backward();
                    }                
                }
            );
            $.work_list.on(
                "mouseleave",
                function(e)
                {
                    if(dragStarted)
                    {
                        // here we can consider finished the touch event
                        e.preventDefault();
                        dragStarted = false;
                        console.log('mouseleave');
                        $.work_list.trigger('mouseup');
                        // _self.html('mouseup or touchend');

                        // stayPozX = nowPozX;                                                
                    }
                }
            );   

            var touchStarted = false,
                tapFlag = false,
                touchX,
                touchY,
                touch_move,
                touchStartPoz = {x: 0,y: 0},
                touch_move,
                touch_end,
                wrapperStartScrollTop;
            /*
            $.work_list.on(
                'touchstart',
                function(e)
                {
                    touch_move = getPointerEvent(e);
                    // caching the current x
                    touchX = touch_move.pageX;
                    touchStartPoz.x = touchX;
                    // caching the current y
                    touchY = touch_move.pageY;
                    touchStartPoz.y = touchY;
                    touchStarted = true;
                    // console.log(touchStarted);
                    wrapperStartScrollTop = scroll_wrapper.scrollTop;
                    setTimeout(function()
                    {
                        if ((touchStartPoz.x === touchX) && !touchStarted && (touchStartPoz.y === touchY))
                        {
                            // Here you get the tap event
                            tapFlag = true;
                            console.log('tap');
                        }
                        else
                        {
                            tapFlag = false;
                        }
                    }, 300);
                }  
            ); 

            $.work_list.on(
                'touchmove',
                function(e)
                {
                    touch_move = getPointerEvent(e);
                    touchX = touch_move.pageX;
                    touchY = touch_move.pageY;
                    if (touchStarted)
                    {
                        // here you are swiping
                        // console.log('swiping');
                        // scroll_wrapper.scrollTo( ( touchStartPoz.y - touchY ) + wrapperStartScrollTop );
                        // console.log(( touchStartPoz.y - touchY ));
                    }
                }  
            ); 
            $.work_list.on(
                'touchend',
                function(e)
                {
                    touchStarted = false;
                    // console.log(touchStarted);
                }  
            ); 
            */
        }
        $.fn.ClickInIt = function () {
            $('.work-item-thumb').click(function(){});
            $('#detail-burger').click(function(){});

            $.Body.on('click','#back,.menu-li,.work-cate-item,.work-more,.work-item-thumb,#detail-burger,.page-btn,.tab-btn',function(e){
                // console.log(e.target);
                switch(true){
                    case $(e.target).hasClass('tab-btn'):
                        if($(e.target).is("#tab-pc")){
                            $.Body.attr({"show-pic":"pc"});
                        } else {
                            $.Body.attr({"show-pic":"sp"});
                        }
                    break;
                    case $(e.target).attr('id') == 'back':
                        if(webMode=='PC'){
                            scroll_wrapper.scrollIntoView(document.getElementById('banner'));
                        } else {
                            $.wrapper.animate(
                                {
                                    scrollTop: 0
                                },
                                {
                                    duration: 300,
                                    easing: 'easeInOutCirc'
                                }
                            );
                        }
                    break;
                    case $(e.target).hasClass('menu-li') :
                        document.getElementById('nav-m').checked = false;
                        if(webMode=='PC'){
                            scroll_wrapper.scrollIntoView(document.getElementById($(e.target).attr('go')+'-anchor'));
                        } else {
                            $.anchor.each(
                                function(){
                                    var _self = $(this);
                                    if(_self.attr('id') == $(e.target).attr('go')+'-anchor'){
                                        $.wrapper.animate(
                                            {
                                                scrollTop: _self.prop('offset-top')
                                            },
                                            {
                                                duration: 300,
                                                easing: 'easeInOutCirc'
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    break;
                    case $(e.target).hasClass('work-cate-item') :
                        $.work_cate_item.removeClass('active');
                        $(e.target).addClass('active');
                        if(webMode == 'PC'){
                            scroll_work.scrollIntoView(document.getElementById('work-'+$(e.target).attr('go')+'-site'));
                        
                            if( $(e.target).attr('go') == 'campaign' ){
                                cur_column = 0;
                                $.work.attr(
                                    {
                                        'page-state': 0
                                    }
                                );
                            } else {
                                cur_column = column_campaign;
                                $.work.attr(
                                    {
                                        'page-state': 2
                                    }
                                );
                            }
                        } else {
                            $.work_item_box.removeClass('smooth');
                            var go_scroll_left = 0;
                            if($(e.target).attr('go') == 'campaign'){
                                go_scroll_left = 0;
                            } else {
                                go_scroll_left = $.official_work_item.eq(0).prop('offset-left') - $.work_item_box.prop('offset-left')
                            }
                            // console.log(go_scroll_left);
                            $.work_item_box.animate(
                                {
                                    scrollLeft: go_scroll_left
                                },
                                {
                                    duration: 300,
                                    easing: 'easeInOutCirc',
                                    complete:function(){
                                        $.work_item_box.addClass('smooth');
                                    }
                                }
                            );
                        }
                    break;
                    case $(e.target).hasClass('work-more') || ($(e.target).hasClass('work-item-thumb') && webMode!=='PC' ) :
                        var temp_cate = $(e.target).parentsUntil('.work-list-sub','.work-item').attr('cate'),
                            temp_index = parseInt($(e.target).parentsUntil('.work-list-sub','.work-item').attr('index')),
                            temp_category_list = '',
                            temp_tool_list = '',
                            temp_detail_content_pc = '',
                            temp_detail_content_sp = '';

                        $.detail_title.html(work_data[temp_cate][temp_index]['detail-title']);
                        $.detail_time.html(work_data[temp_cate][temp_index]['detail-time']);

                        $.detail_tag_category_list.html('');
                        for(var i = 0; i < work_data[temp_cate][temp_index]['detail-tag-category'].length; i ++){
                            temp_category_list = '<div class="tag">'+work_data[temp_cate][temp_index]['detail-tag-category'][i]+'</div>';
                            $.detail_tag_category_list.append(temp_category_list);
                        }
                        $.detail_tag_tool_list.html('');
                        for(var i = 0; i < work_data[temp_cate][temp_index]['detail-tag-tool'].length; i ++){
                            temp_tool_list = '<div class="tag">'+work_data[temp_cate][temp_index]['detail-tag-tool'][i]+'</div>';
                            $.detail_tag_tool_list.append(temp_tool_list);
                        }
                        if(webMode == 'PC'){
                            $.tab_box.html('<div class="tab-btn" id="tab-pc">PC</div><div class="tab-btn" id="tab-sp">SP</div>');
                            $.Body.attr({"show-pic":"pc"});
                        } else {
                            $.tab_box.html('<div class="tab-btn" id="tab-sp">SP</div><div class="tab-btn" id="tab-pc">PC</div>');
                            $.Body.attr({"show-pic":"sp"});
                        }
                        $.detail_content_pc.html('');
                        for(var i = 0; i < work_data[temp_cate][temp_index]['detail-printscreen'].length; i ++){
                            temp_detail_content_pc = 
                            '<img class="detail-printscreen" src="images/work/work-'+work_data[temp_cate][temp_index]['work-name']+'-'+i+'.png">'+
                            ((work_data[temp_cate][temp_index]['detail-printscreen'][i] == '')?'':'<p class="detail-word">'+work_data[temp_cate][temp_index]['detail-printscreen'][i]+'</p>');
                            console.log(temp_detail_content_pc);
                            $.detail_content_pc.append(temp_detail_content_pc);
                        }
                        $.detail_content_sp.html('');
                        for(var i = 0; i < work_data[temp_cate][temp_index]['detail-printscreen'].length; i ++){
                            temp_detail_content_sp = 
                            '<img class="detail-printscreen" src="images/work/work-'+work_data[temp_cate][temp_index]['work-name']+'-'+i+'.png">'+
                            ((work_data[temp_cate][temp_index]['detail-printscreen'][i] == '')?'':'<p class="detail-word">'+work_data[temp_cate][temp_index]['detail-printscreen'][i]+'</p>');
                            $.detail_content_sp.append(temp_detail_content_sp);
                        }
                        $.detail_link.attr({'href': work_data[temp_cate][temp_index]['link']});
                        if(webMode=='PC'){
                            scroll_detail.scrollTo(0,0);
                        } else {
                            $.work_detail_list.scrollTop(0);
                        }
                        $.Body.addClass('show-detail');
                    break;
                    case $(e.target).attr('id') == 'detail-burger':
                        $.Body.removeClass('show-detail');
                    break;
                    case $(e.target).hasClass('page-btn') && webMode == 'PC':
                        if($(e.target).attr('go') == 'forward'){
                            $.Body.move_forward();
                        } else {
                            $.Body.move_backward();
                        }
                    break;
                }
            });
        }
        $.fn.ResizeInIt = function () {
            window.pre_state = -1;
            window.cur_state = 0;
            function check_state(){
                // console.log('update');
                if(webMode=='PC'){
                    scroll_wrapper.scrollTo(0,scroll_wrapper.scrollTop+1);
                }
                if(pre_state !== cur_state){
                    switch(true){
                        case cur_state == 0 || cur_state == 1 || cur_state == 2 || cur_state == 3:
                            // console.log(0);
                            $.m_mode = false;
                        break;
                        case cur_state == 4:
                            // console.log(4);
                            $.m_mode = true;

                        break;
                    }
                    pre_state = cur_state;
                }
            }
            function resizing(){
                cur_state = parseInt($.media_width.width());
                check_state();
            }
            $.Window.resize(resizing).trigger('resize');
        }
        $.fn.ScrollInIt = function () {
            var pre_contact_visible = false,
                cur_contact_visible = false,
                temp_contact_start = 0;
                function check_contact(y){
                    cur_contact_visible = scroll_wrapper.isVisible( $.contact_title.get(0) );
                    if(cur_contact_visible !== pre_contact_visible){
                        if(cur_contact_visible){
                            temp_contact_start = y;
                            // console.log(y , temp_contact_start);
                        } else {

                        }
                        pre_contact_visible = cur_contact_visible;
                    }                    
                    if(cur_contact_visible == pre_contact_visible && cur_contact_visible){
                        $.contact.css(
                            {
                                'opacity': Math.min(1,1 * ( ( (y-20) - temp_contact_start ) / 50 ))
                            }
                        );
                    }
                }
            if(webMode=='PC'){
                scroll_wrapper.addListener(function(status) {
                    var offset = status.offset;
                    if(offset.y < ( 156 - 78 ) ) {
                        $.nav.css(
                            {
                                'height': ($.m_mode?'calc( 100vw * ( 125 / 960 ) )':( 156 - offset.y ) +'px'),
                                '-webkit-box-shadow': '0px 0px 10px rgba(0,0,0,' + 0.4 * ( offset.y / (  156 - 78 ) ) + ')'
                            }
                        );
                    } else {
                        $.nav.css(
                            {
                                'height': ($.m_mode?'calc( 100vw * ( 125 / 960 ) )':78+'px'),
                                '-webkit-box-shadow': '0px 0px 10px rgba(0,0,0,' + 0.4 + ')'
                            }
                        );
                    }
                    check_contact(offset.y);
                    // console.log(   scroll_wrapper.isVisible( $.contact_title.get(0) ) ,'y : '+offset.y, 'contact_title : '+ (parseInt($.contact_title.prop('offset-top')) - $.Body.height()) , offset.y + $.Body.height() );
                    // if(offset.y - 100 >= (parseInt($.contact_title.prop('offset-top')) - $.Body.height())){
                    //     $.contact.css(
                    //         {
                    //             'opacity': Math.min(1,1 * ( ( ( offset.y - 100 ) - (parseInt($.contact_title.prop('offset-top')) - $.Body.height())) / 100 ))
                    //         }
                    //     );
                    // } else {
                    //     $.contact.css(
                    //         {
                    //             'opacity':0
                    //         }
                    //     );
                    // }
                });
            } else { 
                $.wrapper.scroll(
                    function(){
                        if($.wrapper.scrollTop() < ( 156 - 78 ) ) {
                            $.nav.css(
                                {
                                    'height': ($.m_mode?'calc( 100vw * ( 125 / 960 ) )':( 156 - $.wrapper.scrollTop() ) +'px'),
                                    '-webkit-box-shadow': '0px 0px 10px rgba(0,0,0,' + 0.4 * ( $.wrapper.scrollTop() / (  156 - 78 ) ) + ')'
                                }
                            );
                        } else {
                            $.nav.css(
                                {
                                    'height': ($.m_mode?'calc( 100vw * ( 125 / 960 ) )':78+'px'),
                                    '-webkit-box-shadow': '0px 0px 10px rgba(0,0,0,' + 0.4 + ')'
                                }
                            );
                        }
                    }
                );  
                var pre_cate = -1,
                    cur_cate = 0;// 0 : campaign , 1 : official
                function check_cate(){
                    if(cur_cate !== pre_cate){
                        switch(cur_cate){
                            case 0:
                                $.work_cate_item.removeClass('active');
                                $.go_campaign.addClass('active');
                            break;
                            case 1:
                                $.work_cate_item.removeClass('active');
                                $.go_official.addClass('active');
                            break;
                        }
                        pre_cate = cur_cate;
                    }
                }
                $.work_item_box.scroll(
                    function(){
                        if( $.official_work_item.eq(0).offset().left < parseInt($.Body.width()) * ( 2 / 3) ){
                            cur_cate = 1;
                        } else {
                            cur_cate = 0;
                        }
                        check_cate();
                        // console.log('scrollLeft : '+$.work_item_box.scrollLeft()+' offset: '+$.official_work_item.eq(0).offset().left);
                    }
                );
            }
        }
        $.fn.ComCss = function (property) {
            var _self = $(this);
                _self['propObj'] = {};
            for(x in property){ 
                _self.propObj['-webkit-'+x] = property[x];
                _self.propObj['-moz-'+x] = property[x];
                _self.propObj['-ms-'+x] = property[x];
                _self.propObj[x] = property[x];
            }
            _self.css(_self.propObj);
            /*for(x in _self.propObj){ 
                delete _self.propObj[x];
            }*/
            delete _self.propObj;
            property = null;
            _self = null;      
        }
    })(jQuery);
    $(function(){
        $.Body = $('body');
        $.Window = $(window);
        work_campaign_array = [
            {
                'work-name':'BailanTheater',
                'thumb-num': 0,
                'work-title':'洗濯するお母さんあるある',
                'detail-title': '洗濯するお母さんあるある',
                'detail-time': '2017.06',
                'detail-tag-category':['Front-end','Website','RWD'],
                'detail-tag-tool':['html','css','sass','js','pixi.js'],
                'detail-printscreen':['','',''],
                'link':'https://www.bailan.com.tw/BailanTheater/'
            },
            {
                'work-name':'2015momsday',
                'thumb-num': 0,
                'work-title':'お母さんのことよーく知ってますか？',
                'detail-title': 'お母さんのことよーく知ってますか？',
                'detail-time': '2015.04',
                'detail-tag-category':['Front-end','Website','PC & MOBILE','時限クイズ'],
                'detail-tag-tool':['html','css','js'],
                'detail-printscreen':['',''],
                'link':'http://www.lianan.com.tw/2015momsday/'
            },
            {
                'work-name':'dinnerathome',
                'thumb-num': 0,
                'work-title':'幸せは家で食事',
                'detail-title': '幸せは家で食事',
                'detail-time': '2017.05.15',
                'detail-tag-category':['Front-end','Website','PC only'],
                'detail-tag-tool':['html','css','js'],
                'detail-printscreen':[''],
                'link':'https://jerjer.web.fc2.com/works/dinnerathome/'
            },
            {
                'work-name':'lipton-rainforest',
                'thumb-num': 0,
                'work-title':'お茶で熱帯雨林を守りましょう',
                'detail-title': 'お茶で熱帯雨林を守りましょう',
                'detail-time': '2017.05.15',
                'detail-tag-category':['Front-end','Website','PC & MOBILE'],
                'detail-tag-tool':['html','css','js'],
                'detail-printscreen':['',''],
                'link':'https://jerjer.web.fc2.com/works/lipton_rainforest/'
            },
            {
                'work-name':'Loreal-hyd2014',
                'thumb-num': 0,
                'work-title':'敏感肌を救う',
                'detail-title': '敏感肌を救う',
                'detail-time': '2014.10',
                'detail-tag-category':['Front-end','Website','PC only'],
                'detail-tag-tool':['html','css','js'],
                'detail-printscreen':['','',''],
                'link':'https://jerjer.web.fc2.com/works/Loreal_hyd2014/'
            },
            {
                'work-name':'Rexona-2017',
                'thumb-num': 6,
                'work-title':'あなたの座右の銘は何なんですか？',
                'detail-title': 'あなたの座右の銘は何なんですか？',
                'detail-time': '2017.06',
                'detail-tag-category':['Front-end','Website','PC & MOBILE'],
                'detail-tag-tool':['html','css','js','pixi.js','css clip'],
                'detail-printscreen':['','','','','',''],
                'link':'https://jerjer.web.fc2.com/works/Rexona_2017/'
            },
            {
                'work-name':'lux-channel5',
                'thumb-num': 0,
                'work-title':'脱出ゲーム',
                'detail-title': '脱出ゲーム',
                'detail-time': '2016.02',
                'detail-tag-category':['Front-end','Website','PC & MOBILE','game'],
                'detail-tag-tool':['html','css','js'],
                'detail-printscreen':['','',''],
                'link':'https://jerjer.web.fc2.com/works/lux_channel5/'
            },
            {
                'work-name':'soup-clean-label',
                'thumb-num': 0,
                'work-title':'シンプルで美味しい',
                'detail-title': 'シンプルで美味しい',
                'detail-time': '2015.03',
                'detail-tag-category':['Front-end','Website','RWD'],
                'detail-tag-tool':['html','css','js'],
                'detail-printscreen':['','',''],
                'link':'https://campaign.knorr.com.tw/soup-clean-label/'
            },
            {
                'work-name':'2016micellarwater',
                'thumb-num': 0,
                'work-title':'メイクのプロおすすめ！一番お得なメイク落とし',
                'detail-title': 'メイクのプロおすすめ！一番お得なメイク落とし',
                'detail-time': '2016.09',
                'detail-tag-category':['Front-end','Website','PC & MOBILE','game'],
                'detail-tag-tool':['html','css','js','pixi.js'],
                'detail-printscreen':['','',''],
                'link':'https://jerjer.web.fc2.com/works/2016micellarwater/'
            },
            {
                'work-name':'2017deepbreath',
                'thumb-num': 0,
                'work-title':'お肌の深呼吸',
                'detail-title': 'お肌の深呼吸',
                'detail-time': '2017.05',
                'detail-tag-category':['Front-end','Website','PC & MOBILE'],
                'detail-tag-tool':['html','css','js'],
                'detail-printscreen':['',''],
                'link':'https://jerjer.web.fc2.com/works/2017deepbreath/'
            }
        ];
        work_official_array = [
            {
                'work-name':'bailan',
                'thumb-num': 0,
                'work-title':'bailan公式サイト',
                'detail-title': 'bailan公式サイト',
                'detail-time': '2017.04',
                'detail-tag-category':['Front-end','Website','RWD'],
                'detail-tag-tool':['html','css','sass','js','pixi.js'],
                'detail-printscreen':['','',''],
                'link':'https://www.bailan.com.tw/'
            },
            {
                'work-name':'heineken',
                'thumb-num': 0,
                'work-title':'heineken台湾店舗情報公式サイト',
                'detail-title': 'heineken台湾店舗情報公式サイト',
                'detail-time': '2018.03',
                'detail-tag-category':['Front-end','Website','RWD'],
                'detail-tag-tool':['html','css','js','google map api'],
                'detail-printscreen':['',''],
                'link':'https://www.heineken.com/tw/beermap'
            },
            {
                'work-name':'mitsubishi-motors',
                'thumb-num': 0,
                'work-title':'mitsubishi-motors台湾公式サイト',
                'detail-title': 'mitsubishi-motors台湾公式サイト',
                'detail-time': '2017.10',
                'detail-tag-category':['Front-end','Website','RWD'],
                'detail-tag-tool':['html','css','sass','js'],
                'detail-printscreen':['','',''],
                'link':'https://www.mitsubishi-motors.com.tw/'
            },
            {
                'work-name':'neutral',
                'thumb-num': 0,
                'work-title':'neutral台湾公式サイト',
                'detail-title': 'neutral台湾公式サイト',
                'detail-time': '2016.07',
                'detail-tag-category':['Front-end','Website','RWD'],
                'detail-tag-tool':['html','css','js'],
                'detail-printscreen':['',''],
                'link':'https://www.neutral.com.tw/'
            }
        ];
        work_data = {
            'campaign': work_campaign_array,
            'official': work_official_array
        }
        $.campaign_work_site = $.Body.find('#work-campaign-site');
        $.official_work_site = $.Body.find('#work-official-site');
        var temp_work_campaign = '',
            temp_work_official = '';
        for(var i = 0; i < work_campaign_array.length; i ++){
            temp_work_campaign = 
                            '<div class="work-item" cate="campaign" index="'+i+'">'+
                                '<img class="work-item-thumb" draggable="false" src="images/work/work-'+work_campaign_array[i]['work-name']+'-'+'thumb'+'.png">'+
                                '<div class="work-title">'+ work_campaign_array[i]['work-title']+'</div>'+
                                '<div class="work-more btn">'+
                                    '<div class="vertical-center">'+
                                        '<p>more</p>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
            $.campaign_work_site.append(temp_work_campaign);
        }
        for(var i = 0; i < work_official_array.length; i ++){
            temp_work_official = 
                            '<div class="work-item" cate="official" index="'+i+'">'+
                                '<img class="work-item-thumb" draggable="false" src="images/work/work-'+work_official_array[i]['work-name']+'-'+'thumb'+'.png">'+
                                '<div class="work-title">'+ work_official_array[i]['work-title']+'</div>'+
                                '<div class="work-more btn">'+
                                    '<div class="vertical-center">'+
                                        '<p>more</p>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
            $.official_work_site.append(temp_work_official);
        }
        $.detail_title = $.Body.find('#detail-title');
        $.detail_time = $.Body.find('#detail-time');
        $.detail_tag_category_list = $.Body.find('#detail-tag-category .tag-list');
        $.detail_tag_tool_list = $.Body.find('#detail-tag-tool .tag-list');
        $.tab_box = $.Body.find('#tab-box');
        $.detail_content_pc = $.Body.find('#detail-content-pc');
        $.detail_content_sp = $.Body.find('#detail-content-sp');
        $.detail_link = $.Body.find('#detail-link');
        $.loading = $.Body.find('div#loading');
        $.media_width = $('#media-width');
        $.loading_elem = $.loading.get(0);
        $.loading_line = $.Body.find('div#loading-line');
        $.nav = $('nav');
        $.nav_elem = $('nav').get(0);
        $.loading_ani = $({'ani': 0});
        $.m_mode = false;
        $.wrapper = $.Body.find('#wrapper');
        $.work = $.Body.find('#work');
        $.work_cate_item = $.Body.find('.work-cate-item');
        $.work_item_box = $.Body.find('#work-item-box');
        $.work_list = $.Body.find('#work-list');
        $.campaign_work_item = $.Body.find('#work-campaign-site .work-item');
        $.official_work_item = $.Body.find('#work-official-site .work-item');
        $.official_work_item_first = $.official_work_item.eq(0).get(0);
        $.go_campaign = $.Body.find('[go="campaign"]');
        $.go_official = $.Body.find('[go="official"]');
        $.anchor = $.Body.find('.anchor');
        $.work_detail_list = $.Body.find('#work-detail-list');
        $.contact = $.Body.find('#contact');
        $.contact_title = $.Body.find('#contact-title');
        $.contact_title.prop(
            {
                'offset-top': Math.floor($.contact_title.offset().top)
            }
        );
        window.cur_column = 0;
        window.column_campaign = Math.ceil($.campaign_work_item.length/2);
        window.column_official = Math.ceil($.official_work_item.length/2);
        // webMode = 'mobile';
        // if(webMode == 'PC'){
        //     $.Body.addClass('pc');
        //     Scrollbar.use(OverscrollPlugin);
        //     scroll_wrapper = Scrollbar.init(
        //         document.getElementById('wrapper'),
        //         {
        //             continuousScrolling : true,
        //             plugins: {
        //                 overscroll: 'bounce'
        //             }
        //         }
        //     );
        //     scroll_work = Scrollbar.init(
        //         document.getElementById('work-item-box'),
        //         {
        //             continuousScrolling : true,
        //             plugins: {
        //                 overscroll: (webMode!=='PC')?'bounce':false,
        //             }
        //         }
        //     );
        //     scroll_detail = Scrollbar.init(
        //         document.getElementById('work-detail-list'),
        //         {
        //             continuousScrolling : true
        //         }
        //     );
        // } else {
        //     $.wrapper.scrollTop(0);
        //     $.anchor.each(
        //         function(){
        //             // console.log(Math.floor($(this).offset().top));
        //             $(this).prop(
        //                 {
        //                     'offset-top': Math.floor($(this).offset().top)
        //                 }
        //             );
        //         }
        //     );
        //     $.work_item_box.scrollLeft(0);
        //     $.work_item_box.prop(
        //         {
        //             'offset-left': Math.floor($.work_item_box.offset().left)
        //         }
        //     );
        //     $.campaign_work_item.eq(0).prop(
        //         {
        //             'offset-left': Math.floor($.campaign_work_item.eq(0).offset().left)
        //         }
        //     );
        //     $.official_work_item.eq(0).prop(
        //         {
        //             'offset-left': Math.floor($.official_work_item.eq(0).offset().left)
        //         }
        //     );
        // }

        $.Body.imagesLoaded()
        .always( function( instance ) {
            // console.log('all images loaded');
            if(webMode == 'PC'){
                $.Body.addClass('pc');
                Scrollbar.use(OverscrollPlugin);
                scroll_wrapper = Scrollbar.init(
                    document.getElementById('wrapper'),
                    {
                        continuousScrolling : true,
                        plugins: {
                            overscroll: 'bounce'
                        }
                    }
                );
                scroll_work = Scrollbar.init(
                    document.getElementById('work-item-box'),
                    {
                        continuousScrolling : true,
                        plugins: {
                            overscroll: (webMode!=='PC')?'bounce':false,
                        }
                    }
                );
                scroll_detail = Scrollbar.init(
                    document.getElementById('work-detail-list'),
                    {
                        continuousScrolling : true
                    }
                );
            } else {
                $.wrapper.scrollTop(0);
                $.anchor.each(
                    function(){
                        // console.log(Math.floor($(this).offset().top));
                        $(this).prop(
                            {
                                'offset-top': Math.floor($(this).offset().top)
                            }
                        );
                    }
                );
                $.work_item_box.scrollLeft(0);
                $.work_item_box.prop(
                    {
                        'offset-left': Math.floor($.work_item_box.offset().left)
                    }
                );
                $.campaign_work_item.eq(0).prop(
                    {
                        'offset-left': Math.floor($.campaign_work_item.eq(0).offset().left)
                    }
                );
                $.official_work_item.eq(0).prop(
                    {
                        'offset-left': Math.floor($.official_work_item.eq(0).offset().left)
                    }
                );
            }
            $.Body.MainDataInIt();
            $.loading.delay(300).fadeOut(200,function(){
                $.Body.attr(
                    {
                        'state':'intro'
                    }
                );
            });
        })
        .done( function( instance ) {
            // console.log('all images successfully loaded');
        })
        .fail( function() {
            // console.log('all images loaded, at least one is broken');
        })
        .progress( function( instance, image ) {
            var progress_value = Math.floor(10000*(instance.progressedCount/instance.images.length))/100;
            var result = image.isLoaded ? 'loaded' : 'broken';
            // console.log( 'image is ' + result + ' for ' + image.img.src );
            $.loading_line.css({'width':progress_value+'%'});
            // $.loading_line.html(progress_value+'%');
            $.loading_ani.stop().animate(
                {
                    ani:progress_value
                },
                {
                    step:function(now,fx){
                        // $.loading_line.html('<span>'+Math.floor(10000*(now/100))/100+'%'+'</span>');
                    },
                    duration: 300,
                    easing:'easeInOutCirc',
                    complete: function(){

                    }
                }
            );
        });
    });
});


