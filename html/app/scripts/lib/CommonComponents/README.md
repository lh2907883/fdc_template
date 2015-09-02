# CommonComponents(web开发组件)


[![npm version](https://badge.fury.io/js/engine.io.svg)](http://badge.fury.io/js/engine.io)
[![Build Status](https://travis-ci.org/chinakids/CommonComponents.svg?branch=master)](https://travis-ci.org/chinakids/CommonComponents)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

开发用公共组件库

###1.安装

Install: `bower install https://github.com/chinakids/CommonComponents.git --save`


###2.Environment（浏览器环境检测）

src:`src/environment/environment.js`



使用：

	window.environment

结果：

	{
		base: {
			Objectbrowserlanguage: undefined,
			codename: "Mozilla",
			cookieenabled: true,
			cpuclass: undefined,
			minorversion: undefined,
			name: "Netscape",
			online: true,
			platform: "MacIntel",
			systemlanguage: undefined,
			uaheader: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.76 Safari/537.36",
			userlanguage: undefined,
			version: "5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.76 Safari/537.36"
			}
		info:{
			Objectbrowser: "Chrome",
			browserversion: "41.0.2272.76",
			device: "pc",
			engine: "AppleWebKit",
			engineversion: "537.36",
			platform: "MacIntel",
			project: "web",
			system: "iOS",
			systemversion: ""
			}
	}


###3.autoComplete (基于juqery的自动联想插件)

src:`src/autoComplete/autoComplete.js`

使用：
	
	var emailSource = ["sina.com", "163.com", "qq.com", "126.com", "vip.sina.com", "sina.cn", "hotmail.com", "gmail.com", "sodu.com", "139.com", "wo.com.cn", "189.cn", "21cn.com"];
	$("#login_acc_user").autoComplete({
      //maxHeight: 200,
      minWidth: 250,
	  //表示在输入@符号时激活自动联想菜单
	  checkActiveCallback: function(inputValue){
	    return /^[^@\s]+@$/.test(inputValue);
	  },
	  //在每次激活时都会调用这个方法获取数据源,使用e.source来设置数据源
	  getSourceCallback: function(inputValue, e){
	    e.source($.map(emailSource, function(item){
	      return inputValue + item;
	    }), false);
	  }
	});

	
