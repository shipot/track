/**
 * uletrack v3.01
 * 流量收集数据优先级（从低到高）
 * 1、全局window变量 setGlobal()
 * 2、自定义statdata setParams()
 * 3、uletrack.init方法传入params setParams()
 * 4、track.sendPageView方法传入params
 */
(function () {
    // 环境判断，非生产环境，track都提交到测试去
    // var isBeta = /(beta|localhost|127.0.0.1)/.test(location.hostname);
    // track提交地址
    // var trackAPIUrl = 'http://127.0.0.1:8080/v2';//(isBeta) ? 'https://track.beta.ule.com/track2/v2' : 'https://track.ule.com/track2/v2';
    var trackAPIUrl = '//sta.cmh.com.tw:444/apis/track/track2/v2';//(isBeta) ? 'https://track.beta.ule.com/track2/v2' : 'https://track.ule.com/track2/v2';
    // 设置cookie前缀
    var cookiePrefix = 'toc_';
    // track版本
    var trackVersion = 'u_t_3_1';

    // 全局变量说明
    // _utk_stat = {} 初始参数对象，用于提交PV时收集自定义字段（字段必须为track.js中定义过的）
    // _utk_showconsole，用于控制是否显示consolelog
    // _utk_hashstat，用于控制是否开启多路由单页应用的页面切换统计（自动PV统计）。
    // _utk_autostat，用于控制是否开启所有a/button的点击统计，没设置只统计包含data-stat自定义属性的点击
    // _utk_hashdata，用于hash切换时，提交PV时一起提交extdata
    // _utk_pageview='no'时，页面打开时，不自动提交PV
    var _utk_showconsole = true,_utk_autostat = true,_utk_hashstat = true;
    window._utk_stat = window._utk_stat || {};
    var u = navigator.userAgent;
    var isBW = u.indexOf('Name/BW') > -1//BW
    _utk_stat.appkey = 'ce1_2021_4_14';
    // if(isBW) {
    //     _utk_stat.appkey = 'bw_app';
    // } else {
    //     _utk_stat.appkey = 'bw_iweb';
    // }
    // //这里加上台车，台新，等专题的判断
    // try{
    //     var URL = window.location.href;
    //     //stage区分 hjy
    //     if (URL.indexOf('://cdn-i-stage.bwplus.com.tw:8877/') > -1){
    //         _utk_stat.appkey = 'testbw_app';
    //     }
    //     var pos = URL.indexOf('?');
    //     var uId = URL.substr(pos);
    //     var Urlobj = {};
    //     var arr =uId.slice(1,uId.length).split('&');
    //     arr.forEach(function(val){
    //         var arr1 = val.split('=');
    //         Urlobj[arr1[0]]=arr1[1];
    //     })
    //     var p1 = $.cookie("p1");
    //     if(Urlobj.p1 != null){
    //         p1 = Urlobj.p1;
    //     }
    //     if (p1 == 'corporate.d7e0368973af4290b13189dda878cd4d'){
    //         _utk_stat.appkey = 'bw_app_ts';
    //     }
    //     if (p1 == 'corporate.871aed2fd4e246c88c9bb14ecc202a48'){
    //         _utk_stat.appkey = 'bw_app_ttaxi';
    //     }
    // }catch(e){
    //     console.log(e);
    // }
    // 打印日志
    var printLog = function (a, b) {
        _utk_showconsole && window.console && console.log('[uletrack]', a || '', b || '');
    };
    //引入ua解析js
    var tmpLocationHref = location.href;
    if(tmpLocationHref.indexOf('/article/') == 0){
        document.write("<script type='text/javascript' src='/resource/js/ua-parser.js'></script>");
    }
    // MD5方法
    var MD5 = function (string) {
        function RotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }
        function AddUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }
        function F(x, y, z) {
            return (x & y) | ((~x) & z);
        }
        function G(x, y, z) {
            return (x & z) | (y & (~z));
        }
        function H(x, y, z) {
            return (x ^ y ^ z);
        }
        function I(x, y, z) {
            return (y ^ (x | (~z)));
        }
        function FF(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }
        function GG(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }
        function HH(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }
        function II(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }
        function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };
        function WordToHex(lValue) {
            var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        };
        function Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        };
        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
        var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
        string = Utf8Encode(string);
        x = ConvertToWordArray(string);
        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;
        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = AddUnsigned(a, AA);
            b = AddUnsigned(b, BB);
            c = AddUnsigned(c, CC);
            d = AddUnsigned(d, DD);
        }
        var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
        return temp.toLowerCase();
    };
    // Base64相关方法
    var Base64 = {
        // private property
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        // public method for encoding
        encode: function (input) {
            var output = '',
                chr1, chr2, chr3, enc1, enc2, enc3, enc4,
                i = 0;
            input = this._utf8_encode(input + '');
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }
            return output;
        },
        // public method for decoding
        decode: function (input) {
            var output = '',
                chr1, chr2, chr3,
                enc1, enc2, enc3, enc4,
                i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
            while (i < input.length) {
                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = this._utf8_decode(output);
            return output;
        },
        encode_urlsafe: function (input) {
            var str = this.encode(input);
            str = str.replace(/\+/g, "-");
            str = str.replace(/\//g, "_");
            str = str.replace(/\=/g, '');
            return str;
        },
        decode_urlsafe: function (input) {
            input = input.replace(/-/g, "\+");
            input = input.replace(/_/g, "\/");
            var mod4 = input.length % 4;
            if (mod4) {
                input += "====".substr(0, 4 - mod4);
            }
            return this.decode(input);
        },
        // private method for UTF-8 encoding
        _utf8_encode: function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = '', n, c = 0;

            for (n = 0; n < string.length; n++) {
                c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        },
        // private method for UTF-8 decoding
        _utf8_decode: function (utftext) {
            var string = '',
                i = 0,
                c = 0,
                c1 = 0,
                c2 = 0,
                c3 = 0;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        }
    };
    // string扩展方法
    var stringUtil = {
        _toBoolean: function (str) {
            return (str === 'false' || str === '' || str === '0') ? false : true;
        },
        _toNumber: function (str) {
            return (!isNaN(this)) ? Number(str) : str;
        },
        _toRealValue: function (str) {
            return (str === 'true' || str === 'false') ? this._toBoolean(str) : this._toNumber(str);
        },
        trim: function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, '');
        },
        trimScript: function (str) {
            return str.replace(/(<|%3c)(.[^>|%3e]*)script(.|\n)*\/script(.[^>|%3e]*)(>|%3e)/ig, '')
        },
        sliceAfter: function (str, ch) {
            return (str.indexOf(ch) >= 0) ? str.substring(str.indexOf(ch) + ch.length, str.length) : '';
        },
        sliceBefore: function (str, ch) {
            return (str.indexOf(ch) >= 0) ? str.substring(0, str.indexOf(ch)) : '';
        },
        toCamelCase: function (str) {
            if (str.indexOf('-') < 0 && str.indexOf('_') < 0) {
                return str;
            }
            return str.replace(/[-_][^-_]/g, function (match) {
                return match.charAt(1).toUpperCase();
            });
        },
        // 读取url中的参数
        getQueryValue: function (name) {
            var reg = new RegExp("(^|&|\\?|#)" + name + "=([^&|\\?]*)(&|\\?|\x24)", "");
            var match = location.href.match(reg);
            return (match) ? this.trimScript(match[2]) : '';
        },
        // 将属性值转成JSON
        parseAttrJSON: function (str) {
            var d = {},
                a = str.split(';');
            for (var i = 0; i < a.length; i++) {
                if (this.trim(a[i]) === '' || a[i].indexOf(':') < 1) continue;
                var item = this.trim(this.sliceBefore(a[i], ':')),
                    val = this.trim(this.sliceAfter(a[i], ':'));
                if (item !== '' && val !== '') d[this.toCamelCase(item)] = this._toRealValue(val);
            }
            return d;
        }
    };
    // cookie方法方法
    var CookieUtil = {
        get: function (key) {
            var ma = document.cookie.match(new RegExp('(^| )' + key + '=([^;]*)(;|\x24)', ''));
            if (ma) {
                try {
                    return decodeURIComponent(ma[2]);
                } catch (e) {
                    return unescape(ma[2]);
                }
            } else {
                return '';
            }
        },
        set: function (key, value, day, options) {
            var options = options || {};
            var path = '; path=' + (options.path || '/');
            var domain = '; domain=' + (options.domain || UrlUtil.getRootDomain());
            var expires = (day) ? ('; expires=' + new Date(new Date().getTime() + day * 86400 * 1000).toGMTString()) : '';
            var secure = (options.secure) ? '; secure=true' : '';
            // 对于srcid进行特殊处理，避免被两次decode
            if (key != cookiePrefix + 'srcid') {
                value = escape(value || '');
            }
            document.cookie = key + '=' + (value || '') + path + domain + expires + secure;
        },
        del: function (key, options) {
            var options = options || {};
            var path = '; path=' + (options.path || '/');
            var domain = '; domain=' + (options.domain || UrlUtil.getRootDomain());
            document.cookie = key + '=' + path + domain + '; expires=Thu,01-Jan-70 00:00:01 GMT';
        }
    };
    //获取cookie方法新增
    var cookieStyle = {
        setCookie: function(cname,cvalue,exdays) {
            var d = new Date();
            d.setTime(d.getTime()+(exdays*24*60*60*1000));
            var expires = "expires="+d.toGMTString();
            document.cookie = cname+"="+cvalue+"; "+expires + ";path=/";
        },
        getCookie: function(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
            }
            return "";
        }
    };
    // 邮乐相关cookie处理
    var UleCookie = {
        prefix: cookiePrefix,
        get: function (key) {
            return CookieUtil.get(this.prefix + key);
        },
        set: function (key, value, day) {
            CookieUtil.set(this.prefix + key, value, day);
        },
        del: function () {
            CookieUtil.del(this.prefix + key);
        }
    };
    // Utk相关处理
    var UtkCookie = {
        prefix: cookiePrefix,
        parse: function (str, sep) {
            var a1 = str.split(sep || '&&'), a2, data = {}, i;
            if (str != '') {
                for (i = 0; i < a1.length; i++) {
                    a2 = a1[i].split('=');
                    data[a2.shift()] = a2.join('=');
                }
            }
            return data;
        },
        stringify: function (data, sep) {
            var arr = [], item;
            for (item in data) {
                arr.push(item + '=' + data[item]);
            }
            return arr.join(sep || '&&');
        },
        load: function () {
            return this.parse(JSON.parse(this.parse(document.cookie, '; ')[this.prefix + 'utk'] || '""'));
        },
        save: function (utk) {
            var time = new Date(new Date().getTime() + 86400 * 1000 * 365).toGMTString();
            document.cookie = this.prefix + 'utk=' + JSON.stringify(this.stringify(utk)) + '; path=/; domain=' + UrlUtil.getRootDomain() + '; expires=' + time;
        },
        get: function (key) {
            return this.load()[key] || '';
        },
        set: function (key, value) {
            var utk = this.load();
            utk[key] = value;
            this.save(utk);
        },
        del: function (key) {
            var utk = this.load();
            delete utk[key];
            this.save(utk);
        }
    };
    // url相关方法
    var UrlUtil = {
        // 拼接Params字符串
        param: function (params) {
            var arr = [];
            for (var item in params) {
                arr.push(item + '=' + params[item]);
            }
            return arr.join('&');
        },
        // 判断是否是域名
        isDomain: function (domain) {
            return /\./.test(domain) && !/(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/.test(domain);
        },
        // 获取根域名
        getRootDomain: function () {
            var domain = location.hostname, a, b;
            if (this.isDomain(domain)) {
                a = domain.split('.');
                b = a.splice(a.length - 3, a.length);

                return '.' + b.join('.');
            } else {
                return domain;
            }
        },
        // 拆解出参数JSON
        getQueryJSON: function (str) {
            var a, b = {}, p, i, key, val;
            if (str) {
                if (str.indexOf('#') >= 0 && str.indexOf('?') > str.indexOf('#')) {
                    a = str.split('?')[1].split('&');
                } else {
                    str = str.split('#')[0];
                    if (str.indexOf('?') >= 0) {
                        a = str.split('?')[1].split('&');
                    } else {
                        a = str.split('&');
                    }
                }
            } else if (location.hash.indexOf('?') > 0) {
                a = location.hash.split('?')[1].split('&');
            } else if (location.search) {
                a = location.search.substr(1).split('&');
            } else {
                return {};
            }
            for (i = 0; i < a.length; i++) {
                p = a[i].split('=');
                if (p.length > 1) {
                    key = p.shift();
                    val = p.join('=');
                    try {
                        b[key] = decodeURIComponent(val.replace(/\+/g, " "));
                    } catch (e) {
                        b[key] = val.replace(/\+/g, " ");
                    }
                }
            }
            return b;
        },
        // 获取url参数
        getQueryValue: function (str, key) {
            var ma = str.match(new RegExp('(^|\\?|&|#)(' + key + ')=([^&#]*)(&|#|$)', ''));
            return (ma) ? ma[3] : '';
        },
        // 用于adid和srcid参数值的处理，特别是值中有中文和空格的情况时
        trimQueryValue: function (str) {
            try {
                // 先decode，如果有空格，只取空格前的部分
                return decodeURIComponent(str).split(' ')[0].replace(/[\u4e00-\u9fa5]/g, '');
            } catch (e) {
                return str;
            }
        },
        // 站外搜索来源处理
        getSE: function () {
            var se = [
                [1, '百度', 'baidu.com', 'word|wd', 'seo_baidu_0'],     // 百度，OK
                [2, '谷歌', 'google.com', 'q', 'seo_google_0'],    // 谷歌，OK
                [3, '谷歌', 'google.cn', 'q', 'seo_google_1'],    // 谷歌，OK
                [4, '搜狗', 'sogou.com', 'query', 'seo_sogou_0'],     // 搜狗，OK
                [6, '雅虎', 'search.yahoo.com', 'p', 'seo_yahoo_0'],     // 还能用
                [13, '必应', 'bing.com', 'q', 'seo_bing_0'],      // 必应，OK
                [14, '神马', 'sm.cn', 'q', 'seo_sm_0'],        // 神马搜索
                [15, '中搜', 'chinaso.com', 'q|keys', 'seo_chinaso_1'],   // 中国搜索
                [16, '360', 'so.com', 'q', 'seo_so_1']         // 360搜索，OK
            ];
            // var search_url = document.referrer, d, e;cookieStyle.setCookie
            var search_url = cookieStyle.getCookie("urlHref"), d, e;
            for (d = 0, e = se.length; d < e; d++) {
                if (search_url.indexOf(se[d][2]) >= 0) {
                    return [se[d][0], se[d][1], this.getQueryValue(search_url, se[d][3]), se[d][4]];
                }
            }
            return [0, '', '', ''];
        }
    };
    // 浏览器相关方法
    var BrowserUtil = {
        get: function () {
            var ua = navigator.userAgent.toLocaleLowerCase();
            var version = ua.match(/track_app_version:(\S*)/);
            var appVersion = "";
            if (version){
                appVersion = version[1];
            }
            var result = UAParser(ua);
            var app = this.getAPP(ua);
            var win = this.getWinSize();
            var data = {
                appName: app.name,
                appVer: appVersion,
                deviceId: app.deviceId,
                pageType: this.getPageType(ua),
                osType: this.getOSType(ua),
                platform: navigator.platform || '',
                cookieEnabled: navigator.cookieEnabled ? 1 : 0,
                storageEnabled: window.localStorage ? 1 : 0,
                language: navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || '',
                screenSize: window.screen.width + "x" + window.screen.height,
                screenDepth: window.screen.colorDepth,
                browserSize: win.size,
                isFullScreen: win.isFull,
                deviceModel: result.device.model,
                deviceBrand: result.device.vendor,
                deviceOsVersion: result.os.name + result.os.version
            };
            return data;
        },
        // 页面类型判断
        getPageType: function (ua) {
            return /android|iphone|ipod|ipad|ios/.test(ua) ? 'h5' : 'pc';
        },
        // 系统类型判断
        getOSType: function (ua) {
            var os;
            if (/android/.test(ua)) {
                os = 'android';
            } else if (/iphone|ipod|ipad|ios/.test(ua)) {
                os = 'ios';
            } else if (/mac/.test(ua)) {
                os = 'mac';
            } else if (/windows/.test(ua)) {
                os = 'win';
            } else if (/linux/.test(ua)) {
                os = 'linux';
            } else {
                os = 'other';
            }
            return os;
        },
        // 应用容器判断
        getAPP: function (ua) {
            var name = '', ver = '', deviceId = '', client;
            // 判断邮乐相关APP的userAgent
            var ma = ua.match(/(ios|android)_(ule|ylxd|ylxdsq|yzg|yzgxd|yzs|ylsj|hrysh)_(.[^_]*)_(.[^_|\s]*)/);
            if (ma) {
                // 邮乐/小店/邮掌柜/邮助手/邮乐商家APP
                name = ma[2];
                ver = ma[4];
                ma = ua.match(/_deviceid(.[^_]*)_/);
                if (ma) {
                    deviceId = ma[1];
                }
            } else if (window.YZG_GetLocalVersion) {
                // 邮掌柜PC客户端
                name = 'yzgpc';
                ver = YZG_GetLocalVersion();
            } else if (window.Yzg) {
                // 邮掌柜Pad/一体机
                name = (Yzg.isYzg) ? 'yzgpad' : 'yzghd';
                if (Yzg.exec) {
                    Yzg.exec('version', function (version) {
                        ver = version;
                    });
                }
            } else if (/psbc/.test(ua)) {
                // 邮储银行APP
                name = 'psbc';
            } else if (/creditcardapp/.test(ua)) {
                // 邮储信用卡APP
                name = 'psbcxyk';
            } else if (/alipayclient/.test(ua)) {
                name = 'alipay';
            } else if (/unionpay/.test(ua)) {
                name = 'unionpay';
            } else {
                ma = ua.match(/micromessenger\/(.[^(]*)/);
                if (ma) {
                    if (/miniprogram/.test(ua)) {
                        // 微信小程序
                        name = 'wxmp';
                    } else {
                        // 微信
                        name = 'wx';
                    }
                    ver = ma[1];
                }
            }
            // 小程序里，还需要特别区分一下不同的小程序，默认为邮乐商城小程序
            if (name == 'wxmp') {
                client = sessionStorage.getItem('xcx.type') || CookieUtil.get('client_type') || '';
                if (client) {
                    name = 'wxmp_' + client.split('_').pop();
                    ver = sessionStorage.getItem('xcx.version') || '1000';
                }
            }
            return {
                name: name,
                ver: ver,
                deviceId: deviceId
            };
        },
        // 判断
        getWinSize: function () {
            var dw = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;
            var dh = document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight;
            var sh = Math.floor(window.screen.height * dw / window.screen.width);
            return {
                size: dw + 'x' + dh,
                isFull: (sh - dh < 40) ? 1 : 0
            };
        },
        getDocHeight: function () {
            return document.documentElement.scrollHeight || document.documentElement.offsetHeight || document.body.scrollHeight || document.body.offsetHeight;
        }
    };
    // 数据相关处理
    var DataUtil = {
        // 对象属性值复制
        clone: function (data, keys) {
            var newdata = {}, item;
            for (item in data) {
                if ((keys && keys.indexOf(item) >= 0) || !keys) {
                    newdata[item] = data[item];
                }
            }
            return newdata;
        },
        // json对象扩展
        extend: function (data, ext) {
            var item;
            data = data || {}
            ext = ext || {}
            for (item in ext) {
                data[item] = ext[item];
            }
            return data;
        },
        concat: function (data1, data2) {
            var data = this.clone(data1);
            return this.extend(data, data2);
        },
        // 生产随机数
        random: function (len) {
            for (var b = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], c = 10; 1 < c; c--) {
                var d = Math.floor(10 * Math.random()), f = b[d];
                b[d] = b[c - 1];
                b[c - 1] = f
            }
            d = Math.pow(10, len) + (b.join('') * Math.pow(10, len - 10)) + (new Date()).getTime();
            return (d + '').substring(1, len + 1);
        },
        // 生成ClientKey值，16位随机数
        // deviceId：ios 40位， android 18位
        getClientKey: function () {
            return this.random(16);
        },
        // 生产会话ID
        getSessionId: function () {
            return this.random(16);
        },
        // 自定义参数对象生成
        formatExtend: function (extdata, extdata2) {
            // 自定义属性keys
            var itemKeys = [
                'teu',
                'con'
            ].join(',');
            // 自定义属性别名
            var itemAlias = {
                teu:'teu',
                con:'con'
            };
            var params = {}, item;
            for (item in extdata) {
                if (itemKeys.indexOf(item) >= 0) {
                    params[item] = extdata[item];
                } else if (itemAlias[item]) {
                    params[itemAlias[item]] = extdata[item];
                }
            }
            if (extdata2) {
                for (item in extdata2) {
                    if (typeof (params[item]) == 'undefined') {
                        params[item] = extdata2[item];
                    }
                }
            }
            return params;
        },
        // stat提交参数格式化
        formatParams: function (params, extend, enItems, usItems) {
            var trackParams = {}, item, cdata = [];
            enItems = ',' + enItems + ',';
            usItems = ',' + usItems + ',';
            for (item in params) {
                if (enItems.indexOf(',' + item + ',') >= 0) {
                    trackParams[item] = Base64.encode(params[item]);
                } else if (usItems.indexOf(',' + item + ',') >= 0) {
                    trackParams[item] = Base64.encode_urlsafe(params[item]);
                } else {
                    trackParams[item] = encodeURIComponent(params[item]);
                }
            }
            if (extend) {
                for (item in extend) {
                    cdata.push(item + '=' + encodeURIComponent(extend[item]));
                }
                trackParams.cdata = Base64.encode(cdata.join('&'));
            }
            return trackParams;
        }
    };
    //
    var TrackClass = function () {
        // APP设备ID
        var deviceId = '';
        /**
         * 预定义属性
         * ---- 系统相关
         * ap:  appkey
         * ost: 系统类型
         * apn: 应用名称
         * apv: 应用版本
         * pt:  页面类型
         * p:   系统平台
         * c:   是否支持cookie
         * s:   是否支持storage
         * ln:  语言环境
         * sr:  显示器分辨率
         * sd:  显示器分辨深度
         * bs:  浏览器宽高
         * fu:  判断是否全屏打开
         * tz:  用户时区
         * v:   track版本
         * ---- 用户相关
         * nv:  新访客
         * uv:  当前用户UVID，ClientKey
         * pv:  当前页面PVID
         * utc: 创建时间
         * utl: 上次访问时间
         * utn: 当前访问时间
         * rl:  当前访问与上次访问时间差
         * fv:  用户会话标示
         * fs:  用户会话来源
         * ---- 页面相关
         * dh:  当前页面高度
         * cur: 当前页面URL
         * cti: 当前页面title
         * rpv: 来源页面PVID
         * ref: 来源页面URL
         * rep: 来源页面位置
         * ---- 搜素相关
         * se:  搜索引擎ID
         * sn:  搜索引擎名称
         * sk:  搜索引擎关键词
         * lse: 搜索引擎信息
         * ---- 广告来源
         * adt:
         * adid:  外部广告来源
         * srcid: 内部广告来源
         * ---- 页面加载
         * lts: 资源加载时间
         * ltf: 页面加载时间
         * t:   提交时间，trackPageView时需要更新
         */
        this.base = {};
        this.user = {};
        // 自定义属性
        this.extend = {};
        // 初始化
        this.init = function () {
            var browser = BrowserUtil.get();
            this.base = {
                ap: '',
                ost: browser.osType,
                apn: browser.appName,
                apv: browser.appVer,
                pt: browser.pageType,
                p: browser.platform,
                c: browser.cookieEnabled,
                s: browser.storageEnabled,
                ln: browser.language,
                sr: browser.screenSize,
                sd: browser.screenDepth,
                bs: browser.browserSize,
                fu: browser.isFullScreen,
                tz: new Date().getTimezoneOffset(),
                v: trackVersion,
                osv: browser.deviceOsVersion,
                mpb: browser.deviceBrand,
                mpm: browser.deviceModel
            };
            deviceId = browser.deviceId;
        };
        // 设置全局参数
        this.setGlobal = function () {
            var extData = {
            };
            // extData.dw_uid = $.cookie('user_id');
            // extData.dw_did = $.cookie('device_id');
            // extData.a_id = $('meta[name="bwArticleId"]').attr("content");
            for (var item in extData) {
                if (typeof (extData[item]) != undefined) {
                    this.extend[item] = extData[item];
                }
            }
        };
        // 设置基础统计项
        this.setParams = function (params) {
            if (params.appkey) {
                this.base.ap = params.appkey;
                delete params.appkey;
            }
            var extdata = DataUtil.formatExtend(params);
            this.extend = DataUtil.extend(this.extend, extdata);
        };
        // 设置访客信息
        this.setVisit = function (url) {
            // 当前页面url
            var cur = url || location.href;
            // 当前页面标题
            var cti = document.title;
            // 当前页面pv {uv}_{pv}_{utn}
            var cpv = '';
            // 来源页面pv
            var rpv = '';
            // 来源页面url
            // var ref = document.referrer;
            var ref = cookieStyle.getCookie("urlHref");
            var refid = UrlUtil.getQueryValue(cur, 'refid');
            // 来源页面位置
            var rep = UtkCookie.get('pf');
            // 新访客
            var nv = 1;
            // 用户UVID/ClientKey/deviceId
            var uv = UtkCookie.get('uv') || deviceId || DataUtil.getClientKey();
            // 页面PVID
            var pv = MD5(cur);
            // 当前访问时间
            var utn = new Date().getTime();
            // 创建时间
            var utc = UtkCookie.get('utc') || utn;
            // 上次访问时间
            var utl = UtkCookie.get('utn') || utn;
            // 当前页与上页访问时间差
            var rl = utn - utl;
            // uv/pv和访问时间处理
            var opv = UtkCookie.get('pv');
            if (opv) {
                nv = 0;
                rpv = [uv, opv, utl].join('_');
            }
            cpv = [uv, pv, utn].join('_');
            //
            UtkCookie.set('uv', uv);
            UtkCookie.set('pv', pv);
            UtkCookie.set('utn', utn);
            UtkCookie.set('utl', utl);
            UtkCookie.set('utc', utc);
            //
            this.base.nv = nv;
            this.base.uv = uv;
            this.base.pv = cpv;
            this.base.utn = utn;
            this.base.utl = utl;
            this.base.utc = utc;
            this.base.rl = rl;
            // 访问页面和来源页面处理
            if (refid) {
                ref = Base64.decode_urlsafe(refid);
            }
            if (this.base.cur) {
                // hashchange时提交PV
                if (this.base.cur != cur) {
                    this.base.rpv = rpv;
                    this.base.ref = this.base.cur;
                    this.base.rep = rep;
                    this.base.cti = cti;
                    this.base.cur = cur;
                }
            } else {
                console.log(cookieStyle.getCookie("urlHref"));
                // 页面打开时提交PV
                this.base.cti = cti;
                this.base.cur = cur;
                this.base.ref = ref;
                //if (document.referrer) {
                this.base.rpv = rpv;
                this.base.rep = rep;
                //}
            }
            // 当前页高
            this.base.dh = BrowserUtil.getDocHeight();
        };
        // 记录用户会话
        this.setUsession = function () {
            var us = UleCookie.get('usession'), us_arr, us_id, us_adid, us_ref;
            if (!us) {
                us_id = DataUtil.getSessionId();
                us_adid = UleCookie.get('adid');
                us_ref = this.base.ref || '';
                if (us_adid) {
                    us = us_id + '|' + us_adid;
                } else {
                    us = us_id + '|wom';
                    if (us_ref && us_ref.indexOf('http') == 0) {
                        if (us_ref.indexOf(UrlUtil.getRootDomain()) < 0) {
                            us = us_id + '|ref_' + Base64.encode_urlsafe(us_ref);
                        }
                    }
                }
            }
            if (us.indexOf('|') > 0) {
                us_arr = us.split('|');
                if (us_arr.length >= 2) {
                    this.base.fv = us_arr[0];
                    this.base.fs = us_arr[1];
                }
            }
            UleCookie.set('usession', us, (1 / 48));
        };
        // 记录登录用户信息
        this.setUserInfo = function () {
            var logininfo = UtkCookie.get('logininfo');
            var mallcookie = CookieUtil.get('mall_cookie');
            this.user.u_mc = (mallcookie) ? 1 : 0;
            if (logininfo) {
                logininfo = Base64.decode_urlsafe(logininfo).split('||');
                this.user.u_uid = logininfo[0];
                this.user.u_uat = logininfo[2] || '';
            }
        };
        // 记录搜索和广告来源
        this.setSource = function () {
            var qs = UrlUtil.getQueryJSON(this.base.cur);
            var se = UrlUtil.getSE();
            var last_se = '';
            var adid = '';
            var srcid = '';
            // 站外搜素来源
            this.base.se = se[0];
            this.base.sn = se[1];
            this.base.sk = se[2];
            if (se[0] > 0) {
                if (se[2] != '') {
                    last_se = se[0] + "_" + Base64.encode_urlsafe(se[2]);
                    UleCookie.set('last_se', last_se, 1);
                }
            } else {
                last_se = UleCookie.get('last_se');
            }
            if (last_se) {
                this.base.lse = last_se;
            }
            // 站内搜素来源
            var site_se = UleCookie.get('site_se');
            if (site_se) {
                this.extend.s_kw = decodeURIComponent(site_se);
            }
            // adid外部渠道来源
            if (qs.adid) {
                adid = UrlUtil.trimQueryValue(qs.adid);
            } else if (se[0] > 0) {
                adid = se[3];
            }
            if (adid) {
                UleCookie.set('adid', encodeURIComponent(adid), 1);
            } else {
                adid = UleCookie.get('adid');
            }
            this.base.adid = adid;
            // srcid内部渠道来源
            if (qs.srcid) {
                srcid = UrlUtil.trimQueryValue(qs.srcid);
                UleCookie.set('srcid', encodeURIComponent(srcid));
            } else {
                srcid = UleCookie.get('srcid');
            }
            this.base.srcid = srcid;
        };
        // 提交Pageview
        this.setPageView = function (url) {
            this.setVisit(url);
            this.setUsession();
            this.setUserInfo();
            this.setSource();
        };
        this.getPageView = function (url, params) {
            this.base.dh = BrowserUtil.getDocHeight();
            this.setPageView(url);
            this.base.t = new Date().getTime();
            return DataUtil.extend(this.base, params || {});
        };
        this.sendPageView = function (url, extParams) {
            if (extParams && extParams.keyword) {
                UleCookie.set('site_se', encodeURIComponent(extParams.keyword), 1);
            }
            // 需要提交的预定义字段
            var baseData = this.getPageView(url);
            // 需要提交的自定义字段
            var extendData = DataUtil.concat(this.extend, DataUtil.formatExtend(extParams, this.user));
            // 生成最终提交的参数列表
            var trackParams = DataUtil.formatParams(baseData, extendData, 'cti', 'cur,ref');
            printLog('-------- sendPageView --------');
            printLog('base', baseData);
            printLog('extend', extendData);
            // 提交PV数据
            this.loadJS(trackAPIUrl + '?' + UrlUtil.param(trackParams));
        };
        // 提交Event
        this.getEvent = function (params) {
            var data = DataUtil.clone(this.base, 'ap,ost,osv,mpb,mpm,apn,apv,pt,uv,pv,cur,cti,adid,srcid,ln,sd,bs,tz,utc,fv,fs');
            data.utn = new Date().getTime();
            data.utl = UtkCookie.get('utn') || data.utn;
            data.dh = BrowserUtil.getDocHeight();
            DataUtil.extend(data, params);
            data.t = new Date().getTime();
            data.rl = data.t - this.base.t;
            if (params.tea == 'click') {
                UtkCookie.set('pf', params.tev || params.tel || '');
            }
            return data;
        };
        this.sendEvent = function (te, pageType, action, value, extend, extParams) {
            if (extParams && extParams.keyword) {
                UleCookie.set('site_se', encodeURIComponent(extParams.keyword), 1);
            }
            // 需要提交的预定义字段
            var baseData = this.getEvent({
                te: te || 1,
                tec: pageType || this.base.pt,
                tea: action || '',
                tel: value || '',
                tev: extend || ''
            });
            // 需要提交的自定义字段
            var extendData = DataUtil.concat(this.extend, DataUtil.formatExtend(extParams, this.user));
            // 生成最终提交的参数列表
            var trackParams = DataUtil.formatParams(baseData, extendData, 'cti', 'cur,ref');
            printLog('-------- sendEvent --------');
            printLog('base', baseData);
            printLog('extend', extendData);
            // 提交Event数据
            this.loadImg(trackAPIUrl + '?' + UrlUtil.param(trackParams));
        };
        // 加载JS
        this.loadJS = function (url) {
            var doc = document.getElementsByTagName("body")[0] || document.getElementsByTagName('head')[0];
            var spt = document.createElement("script");
            spt.type = 'text/javascript';
            spt.charset = 'utf-8';
            spt.src = url;
            spt.setAttribute('async', true);
            spt.onload = spt.onreadystatechange = function () {
                if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
                    spt.onload = spt.onreadystatechange = null;
                    doc.removeChild(spt);
                }
            };
            if (doc) {
                doc.appendChild(spt);
            }
            printLog('loadJS', url);
        };
        // 加载img
        this.loadImg = function (url) {
            var img = new Image(1, 1);
            img.id = "utrackimg";
            img.onload = img.onabort = img.onerror = function () {
            }
            img.src = url;
            printLog('loadImg', url);
        };
        //
        this.init();
    };

    var StatUtil = {
        addEvent: function (eventName, fn) {
            if (document.addEventListener) {
                document.addEventListener(eventName, fn);
            } else {
                document.attachEvent('on' + eventName, fn);
            }
        },
        bindMousedown: function (autostat) {
            var pageType = BrowserUtil.get().pageType;
            var postEvent = function (title, x, y, extdata) {
                var that = this;
                title = title.replace(/(^\s*)|(\s*$)/g, '');
                setTimeout(function () {
                    if (extdata && typeof (extdata) == 'string') {
                        extdata = stringUtil.parseAttrJSON(extdata);
                    }
                    track.sendEvent(null, pageType, 'click', title, x + ',' + y, extdata);
                }, 10);
            };
            this.addEvent('mousedown', function (e) {
                var ele = e.target, tag, i = 1, x = e.clientX || 0, y = e.clientY || 0, title = '', extdata = '';
                var statattr = 'data-stat', extattr = 'data-statobj';
                while (ele && ele.tagName && ele.tagName.toLowerCase() != 'body' && ele.tagName.toLowerCase() != 'html' && i < 4) {
                    tag = ele.tagName.toLowerCase();
                    if (ele.getAttribute(statattr)) {
                        title = ele.getAttribute(statattr);
                        extdata = ele.getAttribute(extattr);
                        postEvent(title, x, y, extdata);
                        printLog('自定义位置点击', title, x + ',' + y, extdata);
                        break;
                    } else if (_utk_autostat) {
                        if (tag == 'a') {
                            // 判断到是A标签
                            if (ele.getAttribute('title')) {
                                title = ele.getAttribute('title');
                            } else if (ele.innerText) {
                                title = ele.innerText;
                            } else if (ele.innerHTML.match(/(title|alt)="(.*?)"/)) {
                                title = ele.innerHTML.match(/(title|alt)="(.*?)"/)[2]
                            } else if (ele.innerHTML.indexOf('<img') >= 0) {
                                title = '未定义alt图片';
                            }
                            extdata = ele.getAttribute(extattr);
                            postEvent(title, x, y, extdata);
                            printLog('链接点击', title, x + ',' + y, extdata);
                            break;
                        } else if (tag == 'button') {
                            // 判断到是Button按钮
                            title = ele.innerText;
                            extdata = ele.getAttribute(extattr);
                            postEvent(title, x, y, extdata);
                            printLog('Button按钮点击', title, x + ',' + y, extdata);
                            break;
                        } else if (tag == 'input' && (ele.type == 'button' || ele.type == 'submit' || ele.type == 'reset')) {
                            // 判断到是Input按钮
                            title = ele.value;
                            extdata = ele.getAttribute(extattr);
                            postEvent(title, x, y, extdata);
                            printLog('Input按钮点击', title, x + ',' + y, extdata);
                            break;
                        }
                    }
                    ele = ele.parentNode;
                    i++;
                }
            });
        },
        bindHashchange: function (hashstat) {
            if (_utk_hashstat) {
                var hashChanged = function () {
                    setTimeout(function () {
                        track.sendPageView(location.href, window._utk_hashdata || {});
                        window._utk_hashdata = null;
                    }, 100);
                    // printLog('页面Hash切换', document.title, location.hash, document.referrer);
                    printLog('页面Hash切换', document.title, location.hash, cookieStyle.getCookie("urlHref"));
                };
                window.addEventListener('hashchange', function () {
                    hashChanged();
                });
                var pushState = history.pushState;
                history.pushState = function () {
                    hashChanged();
                    return pushState.apply(this, arguments);
                };
            }
        }
    };
    var qs = UrlUtil.getQueryJSON();
    var track = new TrackClass();
    var uletrack = {
        init: function (params) {
            track.setParams(params);
        },
        trackPageview: function (url, params) {
            track.sendPageView(url, params);
        },
        trackEvent: function (pageType, action, value, extend, params) {
            track.sendEvent(null ,pageType, action, value, extend, params);
        }
    };
    //初始化定义extend[]
    track.setGlobal();
    //extend[]扩展
    track.setParams(window._utk_stat || {});
    //StatUtil.bindMousedown();
    StatUtil.bindHashchange();
    if (!window._uletrack && !qs.no_track) {
        if (window._utk_pageview != 'no') {
            uletrack.trackPageview()
        }
        window._uletrack = uletrack;
    }
    cookieStyle.setCookie("urlHref",window.location.href,30);
    function TrackEvent() {
        TrackEvent.prototype.setEvent = function (te, action, value, extend, extdata) {
            console.log("ss");
            var pageType = BrowserUtil.get().pageType;
            setTimeout(function () {
                if (extdata && typeof (extdata) == 'string') {
                    extdata = stringUtil.parseAttrJSON(extdata);
                    //extdata = DataUtil.formatExtend(extdata)
                }
                track.sendEvent(te, pageType, action, value, extend, extdata);
            }, 10);
        };
    }
    window.TrackEvent=TrackEvent;
    //
    function TrackEvents() {
        TrackEvents.prototype.setEvents = function (te, action, value, extend, extdata) {
            console.log("TrackEvents");
            var pageType = BrowserUtil.get().pageType;
            setTimeout(function () {
                if (extdata && typeof (extdata) == 'string') {
                    extdata = stringUtil.parseAttrJSON(extdata);
                    //extdata = DataUtil.formatExtend(extdata)
                }
                track.sendEvent(te, pageType, action, value, extend, extdata);
            }, 10);
        };
    }
    window.TrackEvents=TrackEvents;
})();