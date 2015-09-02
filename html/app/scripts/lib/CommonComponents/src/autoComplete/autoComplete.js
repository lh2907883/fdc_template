/**
 * 说明:自动联想插件
 * 依赖:juqery.js
 * 作者:lihao
 * 时间:2015-6-25
 */
(function($){
  $.fn.autoComplete = function(option){
    //var $this = $(this);
    var ret = this;
    this.each(function(){
      var $this = $(this);
      if(option == undefined || typeof option == "object"){
        $this.data("_autoComplete_api", new $.fn.autoComplete.api(option, $this));
      }
      else if(typeof option == "string"){
        var api = $this.data("_autoComplete_api");
        var method = api[option];
        if(method){
          var args = [];
          for(var i=1; i<arguments.length; i++){
            args.push(arguments[i]);
          }
          var res = method.apply(api, args);
          if(res != undefined){
            ret = res;
          }
        }
      }
    });
    return ret;
  };
  $.fn.autoComplete.defaultOption = {
    /**
     * [必填]根据输入框的值获取数据源, 在取得数据源之后请调用e.source方法
     * @param  {[string]} inputValue [输入框的值]
     * @param  {[object]} e: {
     *    /**
     *     * 调用e.source方法设置数据源
     *     * @param  {[array]} dataSource [数据源]
     *     * @needFilter  {[bool]} 是否需要根据inputvalue来筛选数据源,默认要
     *     *//*
     *    source: function(dataSource, needFilter){}
     * }
     */
    getSourceCallback: function(inputValue, e){
      return e.source([], false);
    },
    /**
     * 菜单项的title信息
     */
    title: undefined,
    /**
     * 数据源中的显示字段,如果为空就显示数据源的item
     * @type {[string]}
     */
    displayMember: undefined,
    /**
     * 数据源中的取值字段(input的值是拿到数据源中valueMember字段中搜索的),如果为空就取数据源的item
     * @type {[string]}
     */
    valueMember: undefined,
    /**
     * 菜单项的最大高度(超出高度显示滚动条)默认不限制高度
     * @type {[int]}
     */
    maxHeight: undefined,
    /**
     * 菜单项的宽度,默认不设置
     * @type {[int]}
     */
    width: undefined,
    /**
     * 当输入框内字符串长度达到minLength时，激活Autocomplete
     */
    minLength: 2,
    /**
     * 对联想的菜单项做个数限制,最多只能显示maxDataLength条,默认不限制
     * @type {[type]}
     */
    maxDataLength: undefined,
    /**
     * 决定是否激活Autocomplete的一个回调函数,如果设置了这个参数,就会忽略minLength
     * @param  {[string]} inputValue [输入框的值]
     * @return {[bool]}       [返回true表示激活,否则不激活]
     */
    checkActiveCallback: undefined, //function(inputValue){}
    /**
     * 显示菜单项之前的一个回调,返回fasle可以阻止显示
     * @param  {[string]} inputValue [输入框的值]
     * @return {[bool]}       [是否阻止菜单项的显示]
     */
    beforeShowCallback: undefined //function(inputValue){}
  };
  $.fn.autoComplete.api = function(option, $input){
    option = $.extend({}, $.fn.autoComplete.defaultOption, option);
    var _this = this;
    /**
     * 获取上下padding和边框总和
     */
    var getYPaddingBorder = function($ele){
      return parseInt($ele.css("paddingTop").replace("px",""))
        + parseInt($ele.css("paddingBottom").replace("px","")) 
        + parseInt($ele.css("borderTopWidth").replace("px",""))
        + parseInt($ele.css("borderBottomWidth").replace("px",""));
    };
    /**
     * 检查菜单项是否展示
     */
    this.checkMenu = function(){
      var v = $input.val();
      if(option.checkActiveCallback){
        if(option.checkActiveCallback(v)){
          this.showMenu();
          return;
        }
      }
      else if(v.length >= option.minLength){
        this.showMenu();
        return;
      }
      this.hideMenu();
    };
    /**
     * 展示菜单项
     */
    this.showMenu = function(){
      var v = $input.val();
      var menu = $.fn.autoComplete.getMenu();
      var offset = $input.offset();
      var height = $input.height() + getYPaddingBorder($input);
      if((!option.beforeShowCallback) || option.beforeShowCallback(v) !== false){
        option.getSourceCallback(v, {
          source: function(dataSource, needFilter){
            var source = dataSource;
            if(needFilter !== false){
              var regex = new RegExp(v, "i");
              source = $.grep(dataSource, function(item, index){
                var vItem = option.displayMember ? item[option.displayMember] : item;
                return regex.test(vItem);
              });              
            }
            if(option.maxDataLength){
              source.splice(option.maxDataLength, source.length - option.maxDataLength);
            }
            if(source.length > 0){
              menu.data("_autoComplete_api", _this);
              _this.buildMenu(source);
              menu.show();
              menu.offset({
                left: offset.left,
                top: offset.top + height
              });
            }
            else{
              _this.hideMenu();
            }
          }
        });
      }
    };
    this.hideMenu = function(){
      $.fn.autoComplete.getMenu().hide();
    };
    /**
     * 构造菜单项
     */
    this.buildMenu = function(source){
      var menu = $.fn.autoComplete.getMenu();
      //设置最大高度
      option.maxHeight ? menu.css("maxHeight", option.maxHeight + "px") : menu.css("maxHeight", "none");
      //设置最小宽度
      option.minWidth ? menu.css("minWidth", option.minWidth + "px") : menu.css("minWidth", "none");
      menu.empty().data("data", source);
      if(option.title){
        menu.append($('<div class="head active">' + option.title + '</div>'));
      }
      //当前激活项是"请选择邮箱类型"就是0;
      this.current = 0;
      for(var i=0; i<source.length; i++){
        var item = source[i];
        var dItem = option.displayMember ? item[option.displayMember] : item;
        menu.append($('<div class="item">' + dItem + '</div>'));
      }
      this.itemCount = source.length + 1;
    };
    /**
     * 设置激活项
     * @param {int} activeIndex [激活项的index]
     */
    this.setActive = function(activeIndex){
      var menu = $.fn.autoComplete.getMenu();
      var index = activeIndex % this.itemCount;
      if(index < 0){
        index += this.itemCount;
      }
      menu.children(".active").removeClass("active");
      menu.children(":eq(" + index + ")").addClass("active");
      this.current = index;
    };
    /**
     * 当前选择项
     */
    var currentData;
    /**
     * 选择菜单项
     */
    this.select = function(){
      if(this.current != 0){
        var menu = $.fn.autoComplete.getMenu();
        var source = menu.data("data");
        var item = source[this.current - 1];
        var text = option.displayMember ? item[option.displayMember] : item;
        currentData = item;
        $input.val(text);
      }
      this.hideMenu();
    };
    $input.on("keydown", function(e){
      switch(e.which) {
        //up
        case 38:
          e.preventDefault();
          _this.setActive(_this.current - 1);
          break;
        //down
        case 40:
          e.preventDefault();
          _this.setActive(_this.current + 1);
          break;
        //enter
        case 13:
          _this.select();
          break;
        //Esc
        case 27:
          _this.hideMenu();
          break;
      }
    }).on("paste keyup", function(e){
      if(e.which != 13 && e.which != 27 
            && e.which != 38 && e.which != 40){       
        _this.checkMenu();
      }
    }).on("blur", _this.hideMenu);

    /**
     * 获取当前选择值
     */
    this.getValue = function(){
      return option.valueMember ? currentData[option.valueMember] : currentData;
    }
    /**
     * 获取当前选择项
     */
    this.getData = function(){
      return currentData;
    }
  };
  $.fn.autoComplete.api.prototype = {};
  /**
   * 获取一个全局的唯一菜单项
   */
  $.fn.autoComplete.getMenu = function(){
    if(!$.fn.autoComplete.getMenu.menu){
      $("head").append('<style type="text/css">.autoComplete{position:absolute;border:1px solid #ccc;z-index:9999;background-color:#fff;overflow-y:auto;overflow-x:hidden}.autoComplete .head,.autoComplete .item{padding:5px;padding-right:20px}.autoComplete .item.active,.autoComplete .item:hover{background-color:#f1f6fa;cursor:pointer} </style>');
      $.fn.autoComplete.getMenu.menu = $('<div class="autoComplete" style="display:none;"></div>').appendTo('body')
        .delegate("div.item", "mousedown", function(){
          var api = $.fn.autoComplete.getMenu().data("_autoComplete_api");
          if(api){
            var index = $(this).index();
            api.setActive(index);
            api.select();
          }
        });
    }
    return $.fn.autoComplete.getMenu.menu;
  }

})(jQuery);