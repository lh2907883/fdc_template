/**
 * 说明:页面视图
 * 依赖:juqery
 * 作者:lihao
 * 时间:2015-6-10
 */
(function($){
  "use strict";
  /**
   * 页面视图
   */
  $.fn.pageViewer = function(option){
    var $this = $(this);
    if(option == undefined || typeof option == "object"){
      $this.data("_pageViewer_api", new $.fn.pageViewer.api(option, $this));
    }
    else if(typeof option == "string"){
      var api = $this.data("_pageViewer_api");
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
   * 页面视图的默认参数
   */
  $.fn.pageViewer.defaultOption = {
    /**
     * 相关联的page对象
     */
    pageObj: undefined, //new Page({})
  };
  $.fn.pageViewer.api = function(option, $root){
    option = $.extend({}, $.fn.pageViewer.defaultOption, option);
    //page对象
    var page = option.pageObj;
    var api = {
      /**
       * 页面初始化
       */
      init: function(){
        if(!this.inited){
          this.inited = true;
          //依次生成part,并append到$root上
          for(var i=0; i<page.parts.length; i++){
            this.addPartToView(page.parts[i]);
          }
        }
      },
      /**
       * 页面呈现,会播放part动画
       */
      render: function(){
        this.init();
        //todo: 播放part动画
      },
      /**
       * 在界面上添加示part
       * @part {[object Part]} part对象
       */
      addPartToView: function(part){
        part.buildDom().appendTo($root);
      }
    };
    return api;
  };
})(jQuery);