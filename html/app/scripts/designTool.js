/**
 * 说明:工具栏模块
 * 依赖:juqery, rangy
 * 作者:lihao
 * 时间:2015-6-10
 */
(function($){
  "use strict";
  /**
   * 去掉字符串两边的@trimRegex字符
   * @target  {[string]} 待处理的字符串
   * @trimRegex  {[string]} 会用正则new RegExp("^" + trimRegex + "+")和new RegExp(trimRegex + "+$")来匹配
   * @return {[string]} 返回的结果
   */
  var trim = function(target, trimRegex){
    return target.replace(new RegExp("^" + trimRegex + "+"), "").replace(new RegExp(trimRegex + "+$"), "");
  };
  /**
   * 获取@$ele的padding和border在x轴上的长度
   */
  var getXPaddingBorder = function($ele){
    return parseInt($ele.css("paddingLeft").replace("px",""))
      + parseInt($ele.css("paddingRight").replace("px","")) 
      + parseInt($ele.css("borderLeftWidth").replace("px",""))
      + parseInt($ele.css("borderRightWidth").replace("px",""));
  };
  /**
   * 获取@$ele的padding和border在y轴上的长度
   */
  var getYPaddingBorder = function($ele){
    return parseInt($ele.css("paddingTop").replace("px",""))
      + parseInt($ele.css("paddingBottom").replace("px","")) 
      + parseInt($ele.css("borderTopWidth").replace("px",""))
      + parseInt($ele.css("borderBottomWidth").replace("px",""));
  };
  /**
   * 获取@$select同级前一个或者后一个元素的值,如果不存在这样的元素就返回undeinfed
   * @$select  {[jqeury object]}  
   * @isNext  {Boolean} 后一个为true,前一个为false
   */
  var getNextValue = function($select, isNext){
    var $curOption = $('option[value="' + $select.val() + '"]', $select);
    if(isNext){
      var $next = $curOption.next();
      if($next.length > 0){
        return $next.val();
      }
    }
    else{
      var $prev = $curOption.prev();
      if($prev.length > 0){
        return $prev.val();
      } 
    }
  };
  /**
   * 获取$target的旋转角度
   * @target  {[jqeury object]}
   * @return {[int]} 返回角度
   */
  var getDegree = function($target){
    var style = $target.attr("style");
    var regex = /transform[\s]*:[\s]*rotate\(([-.\d]+)deg\)/i;
    var m = style.match(regex);
    return m ? m[1] : 0;
  };
  /**
   * 获取简化后的HTML(把innerText为空的标签删掉)
   * @target  {[jqeury object]}
   */
  var getSimplifiedHtml = function($target){
    return $target.html();
  };

  /**
   * 颜色选择器
   */
  $.fn.colorSelector = function(option){
    var res, _arguments = arguments;
    this.each(function(){
      var $this = $(this);
      if(option == undefined || typeof option == "object"){
          $this.data("_colorSelector_api", new $.fn.colorSelector.api(option, $this));    
      }
      else if(typeof option == "string"){
        var api = $this.data("_colorSelector_api") || {};
        var method = api[option];
        if(method){
          var args = [];
          for(var i=1; i<_arguments.length; i++){
            args.push(_arguments[i]);
          }
          res = method.apply(api, args);
        }
      }
    });
    return res ? res : this;
  };
  /**
   * 颜色选择器默认配置
   */
  $.fn.colorSelector.defaultOption = {
    /**
     * 透明色的class
     * @type {String}
     */
    transparentClass: "color-picker-none",
    /**
     * 所有颜色
     * @type {Array}
     */
    colors: ["rgb(255, 255, 255)", "rgb(169, 169, 169)", "rgb(128, 128, 128)", "rgb(0, 0, 0)", "rgb(242, 92, 147)", "rgb(113, 168, 217)", "rgb(182, 9, 39)", "rgb(218, 85, 37)", "rgb(245, 156, 0)", "rgb(1, 161, 135)", "rgb(33, 127, 188)", "rgb(51, 73, 96)", "rgb(145, 62, 176)"]
  };
  /**
   * 颜色选择器内部api
   */
  $.fn.colorSelector.api = function(option, $wrap){
    this.$wrap = $wrap;
    this.option = $.extend({}, $.fn.colorSelector.defaultOption, option);
    //初始化颜色
    $('<div class="color ' + this.option.transparentClass + '"></div>').appendTo($wrap);
    for(var i=0; i<this.option.colors.length; i++){
      $('<div class="color" style="background-color: ' + this.option.colors[i] + ';"></div>').appendTo($wrap);
    }
    //选择事件
    $wrap.children().on("mousedown", function(){
      var $this = $(this);
      $this.addClass("active").siblings().removeClass("active");
      var color = "transparent";
      if(!$this.is($this.parent().children(":first"))){
        color = $this.css("backgroundColor");
      }
      if(option && option.colorSelectedCallback){
        option.colorSelectedCallback.call($wrap, color);
      }
    });
  };
  $.fn.colorSelector.api.prototype = {
    /**
     * 设置工具栏颜色选项
     * @color {[string]} 颜色值,例: rgb(169, 169, 169)
     */
    setColor: function(color){      
      this.$wrap.children().removeClass("active");
      if(color && color != "rgba(0, 0, 0, 0)"){
        this.$wrap.children().each(function(index){
          if($(this).css("backgroundColor") == color){
            $(this).addClass("active");
            return false;
          }
        });
      }
      else{
        this.$wrap.children(":first").addClass("active");
      }
    }
  };

  /**
   * 设置宽度
   * @tool  {[jquery object]} 工具栏设置输入框
   * @target {[jquery object]} 目标对象
   * @vMin  {[int]} 最小值
   * @vMax  {[int]} 最大值
   */
  var widthChange = function($tool, $target, vMin, vMax){
    var w = $tool.val() - getXPaddingBorder($target);
    if((!vMin || vMin < w) && (!vMax || vMax > w)){
      $target.width(w + "px");
    }
  };
  /**
   * 设置高度
   * @tool  {[jquery object]} 工具栏设置输入框
   * @target {[jquery object]} 目标对象
   * @vMin  {[int]} 最小值
   * @vMax  {[int]} 最大值
   */
  var heightChange = function($tool, $target, vMin, vMax){
    var h = $tool.val() - getYPaddingBorder($target);
    if((!vMin || vMin < h) && (!vMax || vMax > h)){
      $target.height(h + "px");
    }
  };
  /**
   * 设置透明度(取值0~100)
   * @tool  {[jquery object]} 工具栏设置输入框
   * @target {[jquery object]} 目标对象
   */
  var opacityChange = function($tool, $target){
    var v = $tool.val();
    if(v >= 0 && v <= 100){
      $target.css("opacity", v / 100.0);
    }
  };
  /**
   * 设置旋转角度
   * @tool  {[jquery object]} 工具栏设置输入框
   * @target {[jquery object]} 目标对象
   */
  var degreeChange = function($tool, $target){
    var v = $tool.val();
    $target.css("transform", "rotate(" + v + "deg)");
  };
  /**
   * 设置圆角(最小值为0)
   * @tool  {[jquery object]} 工具栏设置输入框
   * @target {[jquery object]} 目标对象
   * @vMax  {[int]} 最大值
   */
  var radiusChange = function($tool, $target, vMax){
    var v = $tool.val();
    if(0 < v && (!vMax || vMax > v)){
      $target.css("borderRadius", v + "px");
    }
  };
  /**
   * 设置边框(最小值为0)
   * @tool  {[jquery object]} 工具栏设置输入框
   * @target {[jquery object]} 目标对象
   * @vMax  {[int]} 最大值
   */
  var borderChange = function($tool, $target, vMax){
    var v = $tool.val();
    if(0 < v && (!vMax || vMax > v)){
      $target.css("borderWidth", v + "px");
    }
  };

  /**
   * label对象的扩展
   */
  $.extend(partMaps.label.prototype, {
    exportForDesignTool: function(){
      return {
        lineHeight: this.$dom.css("lineHeight"),
        width: this.$dom.css("width").replace("px", ""),
        height: this.$dom.css("height").replace("px", ""),
        opacity: this.$dom.css("opacity"),
        degree: getDegree(this.$dom)
      };
    },
    exportJson: function(){
      return {
        top: this.$dom.css("top"),
        left: this.$dom.css("left"),
        html: getSimplifiedHtml(this.$dom),
        lineHeight: this.$dom.css("lineHeight"),
        width: this.$dom.css("width").replace("px", ""),
        height: this.$dom.css("height").replace("px", ""),
        opacity: this.$dom.css("opacity"),
        degree: getDegree(this.$dom)
      };
    }
  });

  /**
   * 文本工具栏UI
   */
  $.fn.labelDesign = function(option){
    var $root = $(this);
    /**
     * rang相关操作
     */
    var tools = {
      fontFamily: {
        'microsoft yahei': rangy.createCssClassApplier("part-font-yahei", {elementTagName: "font"}),
        '黑体': rangy.createCssClassApplier("part-font-heiti", {elementTagName: "font"}),
        'serif': rangy.createCssClassApplier("part-font-serif", {elementTagName: "font"}),
      },
      fontSize: {
        '12px': rangy.createCssClassApplier("part-font12"),
        '14px': rangy.createCssClassApplier("part-font14"),
        '16px': rangy.createCssClassApplier("part-font16"),
        '18px': rangy.createCssClassApplier("part-font18"),
        '24px': rangy.createCssClassApplier("part-font24"),
        '32px': rangy.createCssClassApplier("part-font32"),
        '48px': rangy.createCssClassApplier("part-font48")
      },
      bold: rangy.createCssClassApplier("part-bold", {
        elementTagName: "b"
      }),
      italic: rangy.createCssClassApplier("part-italic", {
        elementTagName: "i"
      }),
      underline: rangy.createCssClassApplier("part-underline", {
        elementTagName: "u"
      })
    };
    /**
     * 获取range
     */
    var getRange = function(){
      var sel = rangy.getSelection();
      if(sel.rangeCount){
        return sel.getRangeAt(0);
      }    
    };
    /**
     * 获取selection的第一个dom(这个dom必须在$parent里面才有效)
     */
    var getSelectionNode = function($parent){
      var range = getRange();
      if(range){
        var res = $(range.startContainer.parentNode);
        if(res.closest($parent).length > 0){
          return res;
        }
      }
    };
    /**
     * 文字字体改变
     */
    $(".event-tool-fontFamily", $root).on("change", function(){
      var v = $(this).val();
      if(v){
        var savedSel = rangy.saveSelection();        
        var range = getRange();
        for(var attr in tools.fontFamily){
          if(attr && attr != v){
            var t = tools.fontFamily[attr];
            t.undoToRange(range);
          }
        }
        tools.fontFamily[v].applyToRange(range);
        rangy.restoreSelection(savedSel, true);
      }
    });
    /**
     * 文字大小改变
     */
    $(".event-tool-fontSize", $root).on("change", function(){
      var v = $(this).val();
      if(v){
        var savedSel = rangy.saveSelection();        
        var range = getRange();
        for(var attr in tools.fontSize){
          if(attr && attr != v){
            var t = tools.fontSize[attr];
            t.undoToRange(range);
          }
        }
        tools.fontSize[v].applyToRange(range);
        rangy.restoreSelection(savedSel, false);
      }
    });
    /**
     * 字体增大减小
     */
    $(".event-tool-fontSize-ctrl", $root).on("mousedown", function(e){
      e.preventDefault();
      var isBigger = $(this).attr("tag") == "bigger";
      var v = getNextValue($(".event-tool-fontSize", $root), isBigger);
      if(v){
        $(".event-tool-fontSize", $root).val(v).change();
      }
    });
    /**
     * 行高改变
     */
    $(".event-tool-lineHeight", $root).on("change", function(){
      var v = $(this).val();
      api.$part.css("lineHeight", v);
    });
    /**
     * 设置粗体
     */
    $(".event-tool-fontSize-bold", $root).on("mousedown", function(e){
      e.preventDefault();
      tools.bold.toggleSelection();
    });
    /**
     * 设置斜体
     */
    $(".event-tool-fontSize-italic", $root).on("mousedown", function(e){
      e.preventDefault();
      tools.italic.toggleSelection();
    });
    /**
     * 设置下划线
     */
    $(".event-tool-fontSize-underline", $root).on("mousedown", function(e){
      e.preventDefault();
      tools.underline.toggleSelection();
    });
    /**
     * 设置宽度
     */
    $(".event-tool-width", $root).attr("min", option.minWidth).on("change", function(){
      widthChange($(this), api.$part, option.minWidth);
    });
    /**
     * 设置高度
     */
    $(".event-tool-height", $root).attr("min", option.minHeight).on("change", function(){
      heightChange($(this), api.$part, option.minHeight);
    });
    /**
     * 设置透明度
     */
    $(".event-tool-opacity", $root).on("change", function(){
      opacityChange($(this), api.$part);
    });
    /**
     * 设置旋转角度
     */
    $(".event-tool-degree", $root).on("change", function(){
      degreeChange($(this), api.$part);
    });

    var api = {
      /**
       * 绑定label对象
       * @label {[object]} label对象
       * @$part {[jquery object]} label所在的jq对象
       */
      setPart: function(label, $part){
        this.label = label;
        this.$part = $part;
        var pros = label.exportForDesignTool();
        $(".event-tool-lineHeight", $root).val(pros.lineHeight);
        $(".event-tool-width", $root).val(pros.width);
        $(".event-tool-height", $root).val(pros.height);
        $(".event-tool-opacity", $root).val(pros.opacity * 100);
        $(".event-tool-degree", $root).val(pros.degree);
        return this;
      },
      /**
       * 把$target的属性绑定到工具栏,优先从selection选取
       * @$target {[jquery object]} 是selection选取的第一个dom或者是鼠标点击的那个dom
       */
      setBind: function($target){
        var $dom = getSelectionNode(this.$part) || $target;
        if($dom){
          var targetPros = {
            fontFamily: trim($dom.css("font-family"), "['\"]").toLowerCase(),
            fontSize: $dom.css("font-size")
          };
          $(".event-tool-fontFamily", $root).val(targetPros.fontFamily);
          $(".event-tool-fontSize", $root).val(targetPros.fontSize);
        }
        return this;
      },
      /**
       * 更新文本工具栏界面上的宽高
       */
      updateSize: function(width, height){
        $(".event-tool-width", $root).val(width);
        $(".event-tool-height", $root).val(height);
      }
    };
    return api;
  };

  /**
   * button对象的扩展
   */
  $.extend(partMaps.button.prototype, {
    exportJson: function(){
      return {
        top: this.$dom.css("top"),
        left: this.$dom.css("left"),
        text: this.$dom.text(),
        link: this.$dom.attr("link"),
        borderWidth: this.$dom.css("borderWidth").replace("px", ""),
        radius: this.$dom.css("borderRadius").replace("px", ""),
        color: this.$dom.css("color"),
        bgColor: this.$dom.css("backgroundColor"),
        borderColor: this.$dom.css("borderColor"),
        width: this.$dom.css("width").replace("px", ""),
        height: this.$dom.css("height").replace("px", ""),
        opacity: this.$dom.css("opacity"),
        degree: getDegree(this.$dom)
      };
    }
  });

  /**
   * 按钮工具栏UI
   */
  $.fn.buttonDesign = function(option){
    var $root = $(this);
    /**
     * 设置文字
     */
    $(".event-tool-text", $root).change(function(){
      var v = $(this).val();
      api.$part.html(v);
    });
    /**
     * 设置链接
     */
    $(".event-tool-link", $root).change(function(){
      var v = $(this).val();
      api.$part.attr("link", v);
    });
    /**
     * 设置颜色
     */
    $(".tool-colors", $root).colorSelector({
      colorSelectedCallback: function(color){
        //设置文字颜色
        if(this.hasClass("event-tool-fontColor")){
          api.$part.css("color", color);
        }
        //设置背景色
        else if(this.hasClass("event-tool-bgColor")){
          api.$part.css("backgroundColor", color);          
        }
        //设置边框色
        else if(this.hasClass("event-tool-borderColor")){
          api.$part.css("borderColor", color);          
        }
      }
    });
    /**
     * 设置圆角
     */
    $(".event-tool-radius", $root).on("change", function(){
      radiusChange($(this), api.$part, 0);
    });
    /**
     * 设置边框
     */
    $(".event-tool-border", $root).on("change", function(){
      borderChange($(this), api.$part, 0);
    });
    /**
     * 设置宽度
     */
    $(".event-tool-width", $root).on("change", function(){
      widthChange($(this), api.$part, $(this).attr("min"));
    });
    /**
     * 设置高度
     */
    $(".event-tool-height", $root).on("change", function(){
      heightChange($(this), api.$part, $(this).attr("min"));
    });
    /**
     * 设置透明度
     */
    $(".event-tool-opacity", $root).on("change", function(){
      opacityChange($(this), api.$part);
    });
    /**
     * 设置旋转角度
     */
    $(".event-tool-degree", $root).on("change", function(){
      degreeChange($(this), api.$part);
    });

    var api = {
      /**
       * 绑定button对象
       * @button {[object]} button对象
       * @$part {[jquery object]} button所在的jq对象
       */
      setPart: function(button, $part){
        this.button = button;
        this.$part = $part;
        var pros = button.exportJson();
        $(".event-tool-text", $root).val(pros.text);
        $(".event-tool-link", $root).val(pros.link);
        $(".event-tool-radius", $root).val(pros.radius);
        $(".event-tool-border", $root).val(pros.borderWidth);
        $(".event-tool-fontColor", $root).colorSelector("setColor", pros.color);
        $(".event-tool-bgColor", $root).colorSelector("setColor", pros.bgColor);
        $(".event-tool-borderColor", $root).colorSelector("setColor", pros.borderColor);
        $(".event-tool-width", $root).val(pros.width);
        $(".event-tool-height", $root).val(pros.height);
        $(".event-tool-opacity", $root).val(pros.opacity * 100);
        $(".event-tool-degree", $root).val(pros.degree);
        return this;
      }
    };
    return api;
  };


  var tool_label, tool_button;
  /**
   * 工具栏
   */
  window.designTool = {
    /**
     * 隐藏其他工具栏显示toolName工具栏
     * @toolName [string] 工具栏名字[label,button,image等]中的一个
     */
    show: function(toolName){
      $('#toolsBtn ul li[tag="' + toolName + '"] a').tab("show");
      // $root.siblings().hide();
      // $root.show();
      return this;
    },
    /**
     * 初始化label工具栏
     */
    initLabelTool: function(option){
      rangy.init();
      tool_label = $("#tool_label").labelDesign(option);
      return this;
    },
    /**
     * 初始化button工具栏
     */
    initButtonTool: function(option){
      tool_button = $("#tool_button").buttonDesign(option);
      return this;
    },
    /**
     * 激活对应part的工具栏
     * @part [object] part对象
     * @$part [juqery object] part所属的jquery对象
     * @$target [juqery object] 鼠标所指的jquery对象
     */
    setBind: function(part, $part, $target){
      if(part){
        this.show(part.name);
        switch(part.name){
          case "label":
            tool_label.setPart(part, $part).setBind($target);
            break;
          case "button":
            tool_button.setPart(part, $part);
            break;
        }
      }
      return this;
    },
    /**
     * 更新工具栏界面上的宽高
     */
    updateSize: function(part, width, height){
      if(part){
        switch(part.name){
          case "label":
            tool_label.updateSize(width, height);
            break;

        }
      }
      return this;
    }
  };

  return window.designTool;
})(jQuery);