// JavaScript Document
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (elt /*, from*/) {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0)
                 ? Math.ceil(from)
                 : Math.floor(from);
            if (from < 0)
                from += len;
            for (; from < len; from++) {
                if (from in this &&
                    this[from] === elt)
                    return from;
            }
            return -1;
        };
    }

    var isIE = navigator.userAgent.search("MSIE") > -1; 
    var isIE7 = navigator.userAgent.search("MSIE 7") > -1; 
    var isIE8 = navigator.userAgent.search("MSIE 8") > -1; 
    var isIE9 = navigator.userAgent.search("MSIE 9") > -1; 
    var isIE10 = navigator.userAgent.search("MSIE 10") > -1;
    var isIE11 = !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);
    if(isIE11 == true){
        isIE = true;
    } 
    var isFirefox = navigator.userAgent.search("Firefox") > -1; 
    var isOpera = navigator.userAgent.search("Opera") > -1; 
    var isSafari = navigator.userAgent.search("Safari") > -1;

    var webMode = "PC";
    if( navigator.platform.indexOf("iPad") == 0 )    { webMode = "PAD";   }//IPAD
    if( navigator.platform.indexOf("iPhone") == 0 )  { webMode = "PHONE"; }//IPHONE
    if( navigator.platform.indexOf("iPod") == 0 )    { webMode = "PHONE"; }//IPOD
    if((navigator.userAgent.indexOf('iPhone') != -1) || (navigator.userAgent.indexOf('iPod') != -1) || (navigator.userAgent.indexOf('iPad') != -1)) { 
        webMode = "IOS";
    }
    if( navigator.userAgent.indexOf('Android') != -1){  webMode = "ANDROID"; }//ANDROID
    //if( navigator.userAgent.match(/Android/i) )     { webMode = "ANDROID"; }//ANDROID
    //if (navigator.userAgent.indexOf('iPod')!=-1) alert('iPod!');
    // if( navigator.userAgent.search("Mobile") != -1) {webMode = "ANDROID_MOBILE"} else {webMode = "ANDROID_TABLET" }
    // if( navigator.userAgent.search("Mobile") != -1)  { webMode = "PHONE"}
    if( navigator.platform.indexOf("Win") == 0 )     { webMode = "PC";   }//WIN
    if( navigator.platform.indexOf("Mac") == 0 )     { webMode = "PC";   }//MAC