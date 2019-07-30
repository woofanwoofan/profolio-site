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
            if(cur_column == ( column_interface + column_graphic - 2 ) ){
                $.work.attr(
                    {
                        'page-state': 2
                    }
                );
            }
            if(cur_column >= ( column_interface + column_graphic ) ){
                cur_column = column_interface + column_graphic - 1;
            }
            // console.log(cur_column);  
            if(cur_column <= ( column_interface -1 ) ){
                scroll_work.scrollIntoView($.interface_work_item.eq(cur_column).get(0));
                $.work_cate_item.removeClass('active');
                $.go_interface.addClass('active');
            } else {
                scroll_work.scrollIntoView($.graphic_work_item.eq(cur_column-column_interface).get(0));
                $.work_cate_item.removeClass('active');
                $.go_graphic.addClass('active');
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
            if(cur_column <= ( column_interface -1 ) ){
                scroll_work.scrollIntoView($.interface_work_item.eq(cur_column).get(0));
                $.work_cate_item.removeClass('active');
                $.go_interface.addClass('active');
            } else {
                scroll_work.scrollIntoView($.graphic_work_item.eq(cur_column-column_interface).get(0));
                $.work_cate_item.removeClass('active');
                $.go_graphic.addClass('active');
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
                    // for(var i = 0 ; i < column_interface; i ++){
                    //     console.log(i+' : '+scroll_work.isVisible($.interface_work_item.eq(i).get(0)));
                    //     if(scroll_work.isVisible($.interface_work_item.eq(i).get(0))){
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
                        // console.log('mouseleave');
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
                        
                            if( $(e.target).attr('go') == 'interface' ){
                                cur_column = 0;
                                $.work.attr(
                                    {
                                        'page-state': 0
                                    }
                                );
                            } else {
                                cur_column = column_interface;
                                $.work.attr(
                                    {
                                        'page-state': 2
                                    }
                                );
                            }
                        } else {
                            $.work_item_box.removeClass('smooth');
                            var go_scroll_left = 0;
                            if($(e.target).attr('go') == 'interface'){
                                go_scroll_left = 0;
                            } else {
                                go_scroll_left = $.graphic_work_item.eq(0).prop('offset-left') - $.work_item_box.prop('offset-left')
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
                            if(work_data[temp_cate][temp_index]['device'].indexOf("sp") !== -1 && work_data[temp_cate][temp_index]['device'].indexOf("pc") !== -1){
                                $.tab_box.html('<div class="tab-btn" id="tab-pc">PC</div><div class="tab-btn" id="tab-sp">SP</div>');
                                $.Body.attr({"show-pic":"pc"});
                                pc_content();
                                sp_content();
                            } else if(work_data[temp_cate][temp_index]['device'].indexOf("sp") !== -1){
                                $.tab_box.html('');
                                // console.log("sp");
                                $.Body.attr({"show-pic":"sp"});
                                sp_content();
                            } else if(work_data[temp_cate][temp_index]['device'].indexOf("pc") !== -1){
                                $.tab_box.html('');
                                // console.log("pc");
                                $.Body.attr({"show-pic":"pc"});
                                pc_content();
                            }
                        } else {
                            if(work_data[temp_cate][temp_index]['device'].indexOf("sp") !== -1 && work_data[temp_cate][temp_index]['device'].indexOf("pc") !== -1){
                                $.tab_box.html('<div class="tab-btn" id="tab-sp">SP</div><div class="tab-btn" id="tab-pc">PC</div>');
                                $.Body.attr({"show-pic":"sp"});
                                pc_content();
                                sp_content();
                            } else if(work_data[temp_cate][temp_index]['device'].indexOf("sp") !== -1){
                                $.tab_box.html('');
                                // console.log("sp");
                                $.Body.attr({"show-pic":"sp"});
                                sp_content();
                            } else if(work_data[temp_cate][temp_index]['device'].indexOf("pc") !== -1){
                                $.tab_box.html('');
                                // console.log("pc");
                                $.Body.attr({"show-pic":"pc"});
                                pc_content();
                            }
                        }
                        function pc_content(){
                            $.detail_content_pc.html('');
                            for(var i = 0; i < work_data[temp_cate][temp_index]['detail-printscreen'].length; i ++){
                                temp_detail_content_pc = 
                                '<img class="detail-printscreen" src="images/work/work-'+work_data[temp_cate][temp_index]['work-name']+'-'+i+'-pc.png">'+
                                ((work_data[temp_cate][temp_index]['detail-printscreen'][i] == '')?'':'<p class="detail-word">'+work_data[temp_cate][temp_index]['detail-printscreen'][i]+'</p>');
                                // console.log(temp_detail_content_pc);
                                $.detail_content_pc.append(temp_detail_content_pc);
                            }
                        }
                        function sp_content(){
                            $.detail_content_sp.html('');
                            for(var i = 0; i < work_data[temp_cate][temp_index]['detail-printscreen'].length; i ++){
                                temp_detail_content_sp = 
                                '<img class="detail-printscreen" src="images/work/work-'+work_data[temp_cate][temp_index]['work-name']+'-'+i+'-sp.png">'+
                                ((work_data[temp_cate][temp_index]['detail-printscreen'][i] == '')?'':'<p class="detail-word">'+work_data[temp_cate][temp_index]['detail-printscreen'][i]+'</p>');
                                $.detail_content_sp.append(temp_detail_content_sp);
                            }
                        }
                        if(work_data[temp_cate][temp_index]['link'] !== ""){
                            $.detail_link.attr({'href': work_data[temp_cate][temp_index]['link']});
                            $.Body.removeClass("no-detail-link");
                        } else {
                            $.detail_link.attr({'href': work_data[temp_cate][temp_index]['link']});
                            $.Body.addClass("no-detail-link");
                        }
                        
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
                    cur_cate = 0;// 0 : interface , 1 : graphic
                function check_cate(){
                    if(cur_cate !== pre_cate){
                        switch(cur_cate){
                            case 0:
                                $.work_cate_item.removeClass('active');
                                $.go_interface.addClass('active');
                            break;
                            case 1:
                                $.work_cate_item.removeClass('active');
                                $.go_graphic.addClass('active');
                            break;
                        }
                        pre_cate = cur_cate;
                    }
                }
                $.work_item_box.scroll(
                    function(){
                        if( $.graphic_work_item.eq(0).offset().left < parseInt($.Body.width()) * ( 2 / 3) ){
                            cur_cate = 1;
                        } else {
                            cur_cate = 0;
                        }
                        check_cate();
                        // console.log('scrollLeft : '+$.work_item_box.scrollLeft()+' offset: '+$.graphic_work_item.eq(0).offset().left);
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
        work_interface_array = [
            {
                'work-name':'hyundaiuiindex',
                'thumb-num': 0,
                'work-title':'現代汽車會員App',
                'detail-title': '提供會員預約進場服務及里程紀錄等功能性應用',
                'detail-time': '2018.04',
                'detail-tag-category':['UI','UX','App','Design'],
                'detail-tag-tool':['Ps','Ai'],
                'detail-printscreen':['','','','','','',''],
                'link':'',
                'device':['sp']
            },
            {
                'work-name':'jtiapp',
                'thumb-num': 0,
                'work-title':'傑太日煙叫貨系統App',
                'detail-title': '提供店家線上下訂商品及回饋',
                'detail-time': '2018.01',
                'detail-tag-category':['UI','UX','App','Design'],
                'detail-tag-tool':['Ps','Ai'],
                'detail-printscreen':['','','','','','','','',''],
                'link':'',
                'device':['sp']
            }
        ];
        work_graphic_array = [
            {
                'work-name':'rexonaindexcupid',
                'thumb-num': 0,
                'work-title':'Rexona蕊娜敢動精彩每一刻',
                'detail-title': '從品牌策略發想到設計執行，操作一波線上線下活動',
                'detail-time': '2016.07',
                'detail-tag-category':['Front-end','Website','RWD','UI','UX','Creative','Design','TVC'],
                'detail-tag-tool':['Ps','Ai'],
                'detail-printscreen':['','','','','','','','','','','','','',''],
                'link':'https://www.youtube.com/watch?v=I3itvsCHgZk',
                'device':['sp']
            },
            {
                'work-name':'rexonaindexcupid2',
                'thumb-num': 0,
                'work-title':'Rexona蕊娜異味指數',
                'detail-title': '從品牌策略發想到設計執行，操作一波線上線下活動',
                'detail-time': '2017.07',
                'detail-tag-category':['Website','RWD','UI','UX','Creative','Design','TVC'],
                'detail-tag-tool':['Ps','Ai'],
                'detail-printscreen':['','',''],
                'link':'https://www.youtube.com/watch?v=tuaeeWXTRx8',
                'device':['sp']
            },
            {
                'work-name':'bailanindex',
                'thumb-num': 0,
                'work-title':'白蘭官方網站',
                'detail-title': '白蘭洗衣精官方網站Re-design',
                'detail-time': '2017.03',
                'detail-tag-category':['Design','UI','UX','Website','RWD'],
                'detail-tag-tool':['Ps','Ai'],
                'detail-printscreen':['','','','',''],
                'link':'https://www.bailan.com.tw/',
                'device':['pc','sp']
            },
            {
                'work-name':'chocosense',
                'thumb-num': 0,
                'work-title':'可可紳士官方形象',
                'detail-title': '品牌定位、產品開發、形象設計、包裝設計、網站設計',
                'detail-time': '2019.07',
                'detail-tag-category':['Vi','Design','Package Design','UI','UX','Website','RWD'],
                'detail-tag-tool':['Ps','Ai'],
                'detail-printscreen':['','','','','','','','','','','','',''],
                'link':'https://www.chocosense.tw/',
                'device':['pc','sp']
            },
            {
                'work-name':'herdays',
                'thumb-num': 0,
                'work-title':'三十日官方網站',
                'detail-title': '天然草本呵護衛生棉官方形象及週邊設計',
                'detail-time': '2017.03',
                'detail-tag-category':['Design','UI','UX','Website'],
                'detail-tag-tool':['Ps','Ai'],
                'detail-printscreen':['','',],
                'link':'https://www.herdays.tw/',
                'device':['pc','sp']
            },
            {
                'work-name':'igift',
                'thumb-num': 0,
                'work-title':'愛禮物官方網站',
                'detail-title': '愛禮物愛禮物愛禮物愛禮物愛禮物愛禮物',
                'detail-time': '2017.03',
                'detail-tag-category':['Design','UI','UX','Website'],
                'detail-tag-tool':['Ps','Ai'],
                'detail-printscreen':['',],
                'link':'https://www.igift.tw/',
                'device':['pc','sp']
            },
            {
                'work-name':'KnorrQCS',
                'thumb-num': 0,
                'work-title':'康寶活動網站',
                'detail-title': '康寶活動網站介面設計',
                'detail-time': '2017.03',
                'detail-tag-category':['Design','UI','UX','Website'],
                'detail-tag-tool':['Ps','Ai'],
                'detail-printscreen':['','',],
                'link':'',
                'device':['sp']
            }
        ];
        work_data = {
            'interface': work_interface_array,
            'graphic': work_graphic_array
        }
        $.interface_work_site = $.Body.find('#work-interface-site');
        $.graphic_work_site = $.Body.find('#work-graphic-site');
        var temp_work_interface = '',
            temp_work_graphic = '';
        for(var i = 0; i < work_interface_array.length; i ++){
            temp_work_interface = 
                            '<div class="work-item" cate="interface" index="'+i+'">'+
                                '<img class="work-item-thumb" draggable="false" src="images/work/work-'+work_interface_array[i]['work-name']+'-'+'thumb'+'.png">'+
                                '<div class="work-title">'+ work_interface_array[i]['work-title']+'</div>'+
                                '<div class="work-more btn">'+
                                    '<div class="vertical-center">'+
                                        '<p>more</p>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
            $.interface_work_site.append(temp_work_interface);
        }
        for(var i = 0; i < work_graphic_array.length; i ++){
            temp_work_graphic = 
                            '<div class="work-item" cate="graphic" index="'+i+'">'+
                                '<img class="work-item-thumb" draggable="false" src="images/work/work-'+work_graphic_array[i]['work-name']+'-'+'thumb'+'.png">'+
                                '<div class="work-title">'+ work_graphic_array[i]['work-title']+'</div>'+
                                '<div class="work-more btn">'+
                                    '<div class="vertical-center">'+
                                        '<p>more</p>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
            $.graphic_work_site.append(temp_work_graphic);
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
        $.interface_work_item = $.Body.find('#work-interface-site .work-item');
        $.graphic_work_item = $.Body.find('#work-graphic-site .work-item');
        $.graphic_work_item_first = $.graphic_work_item.eq(0).get(0);
        $.go_interface = $.Body.find('[go="interface"]');
        $.go_graphic = $.Body.find('[go="graphic"]');
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
        window.column_interface = Math.ceil($.interface_work_item.length/2);
        window.column_graphic = Math.ceil($.graphic_work_item.length/2);
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
        //     $.interface_work_item.eq(0).prop(
        //         {
        //             'offset-left': Math.floor($.interface_work_item.eq(0).offset().left)
        //         }
        //     );
        //     $.graphic_work_item.eq(0).prop(
        //         {
        //             'offset-left': Math.floor($.graphic_work_item.eq(0).offset().left)
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
                $.interface_work_item.eq(0).prop(
                    {
                        'offset-left': Math.floor($.interface_work_item.eq(0).offset().left)
                    }
                );
                $.graphic_work_item.eq(0).prop(
                    {
                        'offset-left': Math.floor($.graphic_work_item.eq(0).offset().left)
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


