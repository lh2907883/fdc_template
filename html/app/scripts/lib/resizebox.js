/**
 * 说明:编辑模式下的调整元素大小的插件
 * 依赖:juqery
 * 作者:lihao
 * 时间:2015-6-10
 */
(function (factory) {
  "use strict";
  if (typeof define === "function" && define.amd) {
    // AMD模式
    define([ "jquery" ], factory);
  } else {
    // 全局模式
    factory(jQuery);
  }
}(function($) {
  /**
   * 拖动element的插件
   * @option  {[object]} 参数配置
   */
  $.fn.dragmove = function(option) {   
    var $this = $(this);
    if(option == undefined || typeof option == "object"){
      var api = $this.data("_dragmove_api");
      if(!api){
        var option = $.extend({}, $.fn.dragmove.defaultOption, option);
        $this.data("_dragmove_api", new $.fn.dragmove.api(option, $this));        
      }
    }
    else if(typeof option == "string"){
      var api = $this.data("_dragmove_api");
      var method = api[option];
      if(method){
        var args = [];
        for(var i=1; i<arguments.length; i++){
          args.push(arguments[i]);
        }
        var res = method.apply(api, args);
        if(res){
          return res;
        }
      }
    }
    return $this;  
  };
  /**
   * 拖动element的插件的默认配置
   */
  $.fn.dragmove.defaultOption = {
    /**
     * 拖动的回调, 如果绑定了dragmove,需要调用e.moveThis();才能移动,否则不移动
     * @dragmove {[function(e){}]}
     */
    dragmove: undefined, //
    /**
     * 表示只能在水平方向移动
     * @onlyX {[bool]}
     */
    onlyX: undefined,
    /**
     * 表示只能在垂直方向移动
     * @onlyY {[bool]}
     */
    onlyY: undefined
  }
  $.fn.dragmove.api = function(option, $ele){
    var $document = $(document),
      active = false, startX, startY;        
    var onDragMove = function(offset, e){
      if(option.dragMoveCallback){
        return option.dragMoveCallback.call($ele, {
          moveThis: function(){
            $ele.offset(offset);
          },
          //代表将要移动到的中心位置
          centerSize: {
            x: offset.left + $ele.width() / 2,
            y: offset.top + $ele.height() / 2
          },
          originE: e
        });
      }
      else{
        $ele.offset(offset);
      }
    };
    var onDragEnd = function(e){
      if(option.dragEndCallback){
        option.dragEndCallback.call($ele);
      }
    };
    //md.dragmove的回调是通过手动方式触发的,这种情况下事件参数在ex里面
    var mousedown = function(e, triggerData) {
      var ex = triggerData || e;
      active = true;
      if(option.onlyY !== true){
        startX = ex.originalEvent.pageX - $ele.offset().left;
      }
      if(option.onlyX !== true){
        startY = ex.originalEvent.pageY - $ele.offset().top;       
      }
    };

    var mousemove = function(e) {
      if ('mousemove' == e.type && active){
        e.preventDefault();
        var offset = {};
        if(option.onlyY !== true){
          offset.left = e.originalEvent.pageX - startX;
        }
        if(option.onlyX !== true){
          offset.top = e.originalEvent.pageY - startY;
        }
        onDragMove(offset, e);
      }
    };

    var mouseup = function(e) {
      if(active){
        onDragEnd(e);
      }
      active = false;              
    };  

    var api = {
      /*  args参数配置如下:
          //如果绑定了dragmove,需要调用e.moveThis();才能移动,否则不移动
          dragmove: function(e){},
          //onlyX,表示只能在水平方向移动
          onlyX: bool,
          //onlyY,表示只能在垂直方向移动
          onlyY: bool
       */
      enable: function(args){
         if(!this.isEnable){
          this.isEnable = true;
          $ele.on('mousedown.dragmove, md.dragmove', mousedown);  
          $document.on('mousemove.dragmove', mousemove).on('mouseup.dragmove', mouseup); 
         }
         return $ele;
      },
      /**
       * 禁用dragmove
       */
      disable: function(){
        if(this.isEnable){
          this.isEnable = false;
          $ele.off('mousedown.dragmove, md.dragmove', mousedown);  
          $document.off('mousemove.dragmove', mousemove).off('mouseup.dragmove', mouseup); 
        }
        return $ele;
      }
    };
    return api;
  };

  /**
   * 8个方向调整element大小位置的插件
   */
  $.fn.resizeBox = function (option) {
    var $this = $(this);
    if(option == undefined || typeof option == "object"){
      $this.data("_resizeBox_api", new $.fn.resizeBox.api(option, $this));
    }
    else if(typeof option == "string"){
      var api = $this.data("_resizeBox_api");
      var method = api[option];
      if(method){
        var args = [];
        for(var i=1; i<arguments.length; i++){
          args.push(arguments[i]);
        }
        var res = method.apply(api, args);
        if(res){
          return res;
        }
      }
    }
    return $this;   
  };
  /**
   * 默认参数
   */
  $.fn.resizeBox.defaultOption = {
    /**
     * 调整点的大小(默认8px)
     * @type {int}
     */
    handleSize: 8,
    /**
     * 目标element能调整的最小宽度(默认28px)
     * @type {int}
     */
    minWidth: 28,
    /**
     * 目标element能调整的最小高度(默认28px)
     * @type {int}
     */
    minHeight: 28,
    /**
     * 针对this的触发调整的选择器(默认是> *,表示在this下的第一层子元素)
     * @type {String}
     */
    resizeSelector: "> *",
    /**
     * 获取焦点时的回调
     * @getFocusCallback {function(){ }}
     */
    getFocusCallback: undefined, 
    /**
     * 失去焦点时的回调
     * @lostFocusCallback {function(){ }}
     */
    lostFocusCallback: undefined,
    /**
     * 拖动结束的回调 
     * @dragEndCallback {function(e){ }} e.top, e.left 表示当前target的左上坐标; e.width, e.height 表示当前target的宽高
     */
    dragEndCallback: undefined,
    /**
     * 选择后的回调 
     * @targetSelectedCallback {function(e){ }} this就是targetEle, e就是点击的原始事件信息
     */
    targetSelectedCallback: undefined 
  }
  /**
   * resizeBox的相关api
   */
  $.fn.resizeBox.api = function(option, $wrap){
    this._option = $.extend({}, $.fn.resizeBox.defaultOption, option);
    this._$wrap = $wrap;
    this.handlesManage = new $.fn.resizeBox.api.handlesManage($wrap, this._option);
    this.enable();
  }
  $.fn.resizeBox.api.prototype = {
    /**
     * 获取API对象
     */
    getApi: function(){
      return this;
    },
    /**
     * 重置resizeBox
     * @notTriggerEvent  {[bool]} notTriggerEvent为true表示不触发事件(默认触发)
     */
    reset: function(notTriggerEvent){
      this.handlesManage.reset();
    },
    /**
     * 启动$target的resize模式
     * @$target  {[jquery object]} 选择目标对象(启动它的调整大小)
     */
    resize: function($target, bResize){
      if(bResize !== false){
        this.handlesManage.reset();
      }
      this.handlesManage.bindToEle($target);
    },
    /**
     * 启用resizeBox
     */
    enable: function(){
      var _this = this;
      //设置选择
      _this._$wrap.delegate(_this._option.resizeSelector, "mousedown.resizeBox", function(e){
        if(!$(this).is(_this.$focusEle)){
          //console.log("设置选择");
          _this.handlesManage.bindToEle($(this));
        }
        //手动触发点击事件
        $(this).trigger("md.dragmove", e);
      }).delegate(_this._option.resizeSelector, "mouseup.resizeBox", function(e){
        if(_this._option.targetSelectedCallback){
          _this._option.targetSelectedCallback.call(_this.handlesManage.targetEle, e);
        }
      });
      //取消选择
      $(document).on("mousedown.resizeBox", function(e){
        var $target = $(e.target);
        //如果点击的是$focusEle或者它的内部
        if($target.closest(_this.$focusEle).length > 0){
          //console.log("取消选择 nothing todo1");
        }
        //如果点击的是锚点
        else if($target.is(".size-handle")){
          //console.log("取消选择 nothing todo2");

        }
        else{
          //如果存在$focusEle,就取消它的焦点
          if(_this.$focusEle != undefined){
            if(_this._option.lostFocusCallback){
              _this._option.lostFocusCallback.call(_this.$focusEle);
              _this.$focusEle = undefined;
            }
          }
          //如果点击的是targetEle或者它的内部
          if($target.closest(_this.handlesManage.targetEle).length > 0){
            //console.log("取消选择 nothing todo3");
          }
          else{                
            //其他地方就取消编辑
            //console.log("取消选择 reset");
            _this.reset();   
          }
        }
      });
    },
    /**
     * 禁用resizeBox
     */
    disable: function(){
      this.reset();
      this._$wrap.off(".resizeBox");
      $(document).off(".resizeBox");
    },
    /**
     * 把焦点设置给$ele
     * @$ele {[jquery object]}
     */
    setFocus: function($ele){
      this.$focusEle = $ele;
      this.$focusEle.dragmove("disable");
      if(this._option.getFocusCallback){
        this._option.getFocusCallback.call(this.$focusEle);
      }
    }
  };
  /**
   * 锚点的管理
   */
  $.fn.resizeBox.api.handlesManage = function($wrap, option){
    var $body = $("body");
    var hs = option.handleSize - 1;
    var getXPaddingBorder = function($ele){
      return parseInt($ele.css("paddingLeft").replace("px",""))
        + parseInt($ele.css("paddingRight").replace("px","")) 
        + parseInt($ele.css("borderLeftWidth").replace("px",""))
        + parseInt($ele.css("borderRightWidth").replace("px",""));
    };
    var getYPaddingBorder = function($ele){
      return parseInt($ele.css("paddingTop").replace("px",""))
        + parseInt($ele.css("paddingBottom").replace("px","")) 
        + parseInt($ele.css("borderTopWidth").replace("px",""))
        + parseInt($ele.css("borderBottomWidth").replace("px",""));
    };
    /**
     * 锚点的拖动回调
     */
    var handlesDragMove = function(e){
      var tarOffset = _this.targetEle.offset();
      var tarWidth = _this.targetEle.width();
      var tarHeight = _this.targetEle.height();
      var tag = $(this).attr("tag");
      var cs = e.centerSize;
      //x轴左方向
      if(/[w]/.test(tag)){
        var w = tarOffset.left - cs.x + tarWidth;
        if(w >= option.minWidth){
          _this.targetEle.offset({left:cs.x}).width(w);
        }
      }
      //x轴右方向
      if(/[e]/.test(tag)){
        var w = cs.x - tarOffset.left - getXPaddingBorder(_this.targetEle);
        if(w >= option.minWidth){
          _this.targetEle.width(w);
        }
      }
      //y轴上方向
        if(/[n]/.test(tag)){
        var h = tarOffset.top - cs.y + tarHeight;
          if(h >= option.minHeight){
            _this.targetEle.offset({top:cs.y}).height(h);
          }
        }
      //y轴下方向
      if(/[s]/.test(tag)){
        var h = cs.y - tarOffset.top - getYPaddingBorder(_this.targetEle);
        if(h >= option.minHeight){
          _this.targetEle.height(h);
        }
      }
      _this.setHandlesToElePosition();
    };
    /**
     * targetElement的拖动回调
     */
    var eleDragMove = function(e){
      e.moveThis();
      _this.setHandlesToElePosition();
    }
    /**
     * 拖动结束的回调
     */
    var dragEnd = function(){
      if(option.dragEndCallback){
        var tarOffset = _this.targetEle.offset();
        var tarWidth = _this.targetEle.width() + getXPaddingBorder(_this.targetEle);
        var tarHeight = _this.targetEle.height() + getYPaddingBorder(_this.targetEle);
        option.dragEndCallback.call(_this.targetEle, {
          top: tarOffset.top,
          left: tarOffset.left,
          width: tarWidth,
          height: tarHeight
        });
      }
    };
    /**
     * 八个方向的锚点
     */
    var handles =  {
      p_n: $('<div class="size-handle size-n" tag="n"></div>').css({width:hs, height:hs}).appendTo($body).hide().dragmove({dragMoveCallback: handlesDragMove, dragEndCallback: dragEnd, onlyY:true}),
      p_s: $('<div class="size-handle size-s" tag="s"></div>').css({width:hs, height:hs}).appendTo($body).hide().dragmove({dragMoveCallback: handlesDragMove, dragEndCallback: dragEnd, onlyY:true}),
      p_e: $('<div class="size-handle size-e" tag="e"></div>').css({width:hs, height:hs}).appendTo($body).hide().dragmove({dragMoveCallback: handlesDragMove, dragEndCallback: dragEnd, onlyX:true}),
      p_w: $('<div class="size-handle size-w" tag="w"></div>').css({width:hs, height:hs}).appendTo($body).hide().dragmove({dragMoveCallback: handlesDragMove, dragEndCallback: dragEnd, onlyX:true}),
      p_nw: $('<div class="size-handle size-nw" tag="nw"></div>').css({width:hs, height:hs}).appendTo($body).hide().dragmove({dragMoveCallback: handlesDragMove, dragEndCallback: dragEnd}),
      p_ne: $('<div class="size-handle size-ne" tag="ne"></div>').css({width:hs, height:hs}).appendTo($body).hide().dragmove({dragMoveCallback: handlesDragMove, dragEndCallback: dragEnd}),
      p_se: $('<div class="size-handle size-se" tag="se"></div>').css({width:hs, height:hs}).appendTo($body).hide().dragmove({dragMoveCallback: handlesDragMove, dragEndCallback: dragEnd}),
      p_sw: $('<div class="size-handle size-sw" tag="sw"></div>').css({width:hs, height:hs}).appendTo($body).hide().dragmove({dragMoveCallback: handlesDragMove, dragEndCallback: dragEnd})
    };
    /**
     * 上下左右边框
     */
    var lines = {
      l_top: $('<div class="size-line" style="height: 1px;"></div>').appendTo($body).hide(),
      l_bottom: $('<div class="size-line" style="height: 1px;"></div>').appendTo($body).hide(),
      l_left: $('<div class="size-line" style="width: 1px;"></div>').appendTo($body).hide(),
      l_right: $('<div class="size-line" style="width: 1px;"></div>').appendTo($body).hide()
    };
    var _this = {
      /**
       * 获取所有锚点
       */
      getHandles: function(){
        return handles;
      },            
      /**
       * 把锚点和边框设置到targetEle的位置上
       */
      setHandlesToElePosition: function(){
        var tarOffset = this.targetEle.offset();
        var tarWidth = _this.targetEle.width() + getXPaddingBorder(_this.targetEle);
        var tarHeight = _this.targetEle.height() + getYPaddingBorder(_this.targetEle);
        // var tarWidth = this.targetEle.width();
        // var tarHeight = this.targetEle.height();
        var halfSize = option.handleSize / 2;

        //设置handles位置
        handles.p_nw.show().offset({top: tarOffset.top - halfSize, left: tarOffset.left - halfSize});
        handles.p_n.show().offset({top: tarOffset.top - halfSize, left: tarOffset.left + tarWidth / 2 - halfSize});
        handles.p_ne.show().offset({top: tarOffset.top - halfSize, left: tarOffset.left + tarWidth - halfSize});
        handles.p_w.show().offset({top: tarOffset.top + tarHeight / 2 - halfSize, left: tarOffset.left - halfSize});
        handles.p_e.show().offset({top: tarOffset.top + tarHeight / 2 - halfSize, left: tarOffset.left + tarWidth - halfSize});
        handles.p_sw.show().offset({top: tarOffset.top + tarHeight - halfSize, left: tarOffset.left - halfSize});
        handles.p_s.show().offset({top: tarOffset.top + tarHeight - halfSize, left: tarOffset.left + tarWidth / 2 - halfSize});
        handles.p_se.show().offset({top: tarOffset.top + tarHeight - halfSize, left: tarOffset.left + tarWidth - halfSize});
        //设置边框
        lines.l_top.show().offset({top: tarOffset.top - 1, left: tarOffset.left - 1}).width(tarWidth + "px");
        lines.l_bottom.show().offset({top: tarOffset.top + tarHeight - 1, left: tarOffset.left - 1}).width(tarWidth + "px");
        lines.l_left.show().offset({top: tarOffset.top - 1, left: tarOffset.left - 1}).height(tarHeight + "px");
        lines.l_right.show().offset({top: tarOffset.top - 1, left: tarOffset.left + tarWidth - 1}).height(tarHeight + "px");
      },
      /**
       * 把锚点和边框绑定到targetEle上(设置位置,绑定事件)
       */
      bindToEle: function($ele){
        this.targetEle = $ele;
        this.setHandlesToElePosition();
        //绑定handle的drag事件
        handles.p_nw.dragmove("enable");
        handles.p_n.dragmove("enable");
        handles.p_ne.dragmove("enable");
        handles.p_w.dragmove("enable");
        handles.p_e.dragmove("enable");
        handles.p_sw.dragmove("enable");
        handles.p_s.dragmove("enable");
        handles.p_se.dragmove("enable");
        //绑定$ele的drag事件
        $ele.dragmove({dragMoveCallback: eleDragMove, dragEndCallback: dragEnd}).dragmove("enable");
      },
      /**
       * 隐藏所有锚点和边框,移除锚点的dragmove事件
       */
      reset: function(){
        handles.p_nw.hide().dragmove("disable");
        handles.p_n.hide().dragmove("disable");
        handles.p_ne.hide().dragmove("disable");
        handles.p_w.hide().dragmove("disable");
        handles.p_e.hide().dragmove("disable");
        handles.p_sw.hide().dragmove("disable");
        handles.p_s.hide().dragmove("disable");
        handles.p_se.hide().dragmove("disable");
        lines.l_top.hide();
        lines.l_bottom.hide();
        lines.l_left.hide();
        lines.l_right.hide();
        if(this.targetEle){
          this.targetEle.dragmove("disable");
          this.targetEle = undefined;
        }
      }
    };
    return _this;
  };
}));