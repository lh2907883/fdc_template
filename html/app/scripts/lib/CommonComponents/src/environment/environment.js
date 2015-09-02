(function(){
	"use strict";//严格模式
	var environment=function(){
		var base=function(){
			var _x = navigator;
			if(_x){
				return {
					codename:_x.appCodeName,
					minorversion:_x.appMinorVersion,
					name:_x.appName,
					version:_x.appVersion,
					cookieenabled:_x.cookieEnabled,
					cpuclass:_x.cpuClass,
					online:_x.onLine,
					uaheader:_x.userAgent,
					platform:_x.platform,
					browserlanguage:_x.browserLanguage,
					systemlanguage:_x.systemLanguage,
					userlanguage:_x.userLanguage
				};
			}
		}
		var info=function(){
			var _baseusheader = base().uaheader;
			if(_baseusheader){
				var _client = function(){
						//项目
						var _project = "web";
						var	_ua = _baseusheader;
						var _sUserAgent = _ua.toLowerCase();
						var _project = _ua.indexOf("Html5Plus") >-1?"app":_project;
						//设备
						var _device = undefined;
			            var _devIsIpad = _sUserAgent.match(/ipad/i) == "ipad";
			            var _devIsIphone = _sUserAgent.match(/iphone/i) == "iphone";
			            var _devIsMobile = _sUserAgent.match(/mobile/i) == "mobile";
			            var _devIsMacOs = _sUserAgent.match(/mac os/i) == "mac os";
			            var _devIsAndroid = _sUserAgent.match(/android/i) == "android";
			            var _devIsWindows = _sUserAgent.match(/windows/i) == "windows";
			            var _devIsLinux = _sUserAgent.match(/linux/i) == "linux";
			            if (_devIsIpad) {
			                _device = "Ipad";
			            }else if(_devIsIphone){
			            	_device = "Iphone";
			            }else if(_devIsMobile){
			            	_device = "phone";
			            }else if(_devIsMacOs||_devIsAndroid||_devIsWindows||_devIsLinux){
			            	_device = "pc";
			            }
						//引擎
						var _engine = {
							_ie     : 0,
							_gecko  : 0,
							_webkit : 0,
							_khtml  : 0,
							_opera  : 0,
							_ver    : null
						};
						//平台
						var _platform = navigator.platform;
						//操作系统
						var _system = undefined;
						var _systemver = undefined;
						var _sysUserAgent = _sUserAgent.replace(/\ /g,"");
						if (/Mac OS/.test(_ua)){
								/Version\/(\S+)/.test(_ua);
								_system = "iOS";
								_systemver = RegExp["$1"];
						} else if (/Android\ (\S+)/.test(_ua)){
								_system = "Android";
								_systemver = RegExp["$1"];
								if(/\;/.test(_ua)){
									_systemver = _systemver.replace(/\;/g,"");
								}
						} else if (/Win(\S+)/.test(_platform)){
								_system = "Win";
								_systemver = RegExp["$1"];
						} else if (/Linux(\S+)/.test(_platform)){
								_system = "Linux";
								var _platform_arr=_platform.split(" ");
								_systemver = _platform_arr[1];
						} else{
							_system = undefined;
						    _systemver = undefined;
						}
						//浏览器
						var _browser = {
							_ie	    : 0,
							_firefox : 0,
							_opera   : 0,
							_chrome  : 0,
							_safari  : 0,
							_weixin	: 0,
							_qq		: 0,
							_miui    : 0,
							_ver     : null
						};
						//检测呈现引擎和浏览器
						if (window.opera){
							_engine._ver = _browser._ver = window.opera.version();
							_engine._opera = _browser._opera = "Opera";
						} else if ((/AppleWebKit\/(\S+)/.test(_ua)) || (/AppleWebkit\/(\S+)/.test(_ua))){
							_engine._ver = RegExp["$1"];
							_engine._webkit = "AppleWebKit";
							if (/Chrome\/(\S+)/.test(_ua)){
								_browser._ver = RegExp["$1"];
								_browser._chrome = "Chrome";
							}else if(/Firefox\/(\S+)/.test(_ua)){
								_browser._ver = RegExp["$1"];
								_browser._firefox = "Firefox";
							}else if(/MiuiBrowser\/(\S+)/.test(_ua)){
								_browser._ver = RegExp["$1"];
								_browser._miui = "Miui";
							}else if(/MicroMessenger\/(\S+)/.test(_ua)){
								_browser._ver = RegExp["$1"];
								_browser._qq = "Weixin";
							}else if(/MQQBrowser\/(\S+)/.test(_ua)){
								_browser._ver = RegExp["$1"];
								_browser._weixin = "QQ";
							}else if(/Safari\/(\S+)/.test(_ua)){
								_browser._ver = RegExp["$1"];
								_browser._safari = "Safari";
							}
						} else{
							var _isIE = _sUserAgent.indexOf("msie") > -1
							var _isIE7 = _sUserAgent.indexOf("msie 7") > -1
							var _isIE8 = _sUserAgent.indexOf("msie 8") > -1
							if(_isIE){
							    _browser._ver = "6";
								_browser._ie = "IE";
							}else if(_isIE7){
							    _browser._ver = "7";
								_browser._ie = "IE";
							}else if(isIE8){
							    _browser._ver = "8";
								_browser._ie = "IE";
							}
						}
						var _enginename = undefined;
						var _enginename = _engine._ie || _engine._gecko || _engine._webkit || _engine._khtml || _engine._opera;
						var _enginever = !_enginename?undefined:_engine._ver;
						var _browsername = undefined;
						var _browsername = _browser._ie || _browser._firefox || _browser._opera || _browser._chrome || _browser._safari || _browser._weixin || _browser._qq || _browser._miui;
						var _browserver = !_browsername?undefined:_browser._ver;
						return {
							_project: _project,
							_device: _device,
							_engine: _enginename,
							_enginever: _enginever,
							_platform: _platform,
							_system:  _system,
							_systemver:  _systemver,
							_browser:  _browsername,
							_browserver: _browserver
						};
				}
				return {
					project: _client()._project,
					device: _client()._device,
					engine: _client()._engine,
					engineversion: _client()._enginever,
					platform: _client()._platform,
					system:  _client()._system,
					systemversion:  _client()._systemver,
					browser:  _client()._browser,
					browserversion: _client()._browserver
				};
			}
		}

		return {base:{
					codename:base().codename,
					minorversion:base().minorversion,
					name:base().name,
					version:base().version,
					cookieenabled:base().cookieenabled,
					cpuclass:base().cpuclass,
					online:base().online,
					uaheader:base().uaheader,
					platform:base().platform,
					browserlanguage:base().browserlanguage,
					systemlanguage:base().systemlanguage,
					userlanguage:base().userlanguage
		},info:{
					project: info().project,
					device: info().device,
					engine: info().engine,
					engineversion: info().engineversion,
					platform: info().platform,
					system:  info().system,
					systemversion:  info().systemversion,
					browser:  info().browser,
					browserversion: info().browserversion
		}};
	}();

	window.environment=environment;

})();