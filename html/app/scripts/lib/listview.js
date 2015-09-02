/**
 * 说明:列表视图插件
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
}(function($){
  /**
   * 列表视图插件
   */
  $.fn.listview = function(option){
    var $root = $(this);
    var option = $.extend({}, $.fn.listview.defaultOption, option);
    /**
     * 生成itemview
     * @index  {[int]} 索引
     * @item  {[object]} 绑定的数据对象
     */
    var build = function(index, item){
      var data = {
        index: index,
        item: item
      };
      var $item = option.renderItemCallback(data);
      $item.data("_listViewItemData", data).appendTo($root);
      return $item;
    };
    /**
     * 删除$itemview,更新后面的index
     * @$itemview  {[jquery object]} 列表项对象
     */
    var rmItemView = function($itemview){
      var d = $itemview.data("_listViewItemData");
      if(option.rmItemCallback && option.rmItemCallback.call($itemview, d) === false){
        return;
      }
      //更新后面的index
      var index = d.index;
      $itemview.nextAll().each(function(i, item){
        var data = $(item).data("_listViewItemData");
        var newData = {
          index: index++,
          item: data.item
        };
        $(item).data("_listViewItemData", newData);
        if(option.updateItemCallback){
          option.updateItemCallback.call($(item), newData);
        }
      });
      //如果$itemview是激活状态,删除它之前先激活它的前一个item
      if($itemview.hasClass("active")){
        var itemToActive = $itemview.prev();
        if(itemToActive.length == 0){
          itemToActive = $itemview.next();
        }
        if(itemToActive.length != 0){
          itemToActive.addClass("active");
          option.activeItemCallback.call(itemToActive, itemToActive.data("_listViewItemData"));
        }
      }
      $itemview.remove();
    };

    //注册删除按钮的点击事件
    if(option.rmBtnSelector){
      $root.delegate(option.rmBtnSelector, "click", function(){
        //找到$itemview,并删除
        var $tar = $(this);
        while(true){
          var $p = $tar.parent();
          if($p.is($root)){
            break;
          }
          else{
            $tar = $p;
          }
        }
        rmItemView($tar);
        return false;
      });
    }
    //注册$itemview的点击事件
    $root.delegate("> *", "click", function(){
      $root.children().removeClass("active");
      var data = $(this).addClass("active").data("_listViewItemData")
      if(option.activeItemCallback){
        option.activeItemCallback.call($(this), data);
      }
    });

    /**
     * api对象
     */
    var api = {
      /**
       * 添加数据对象
       * @item {[object]}
       */
      addNew: function(item){
        var newIndex = $root.children().length;
        build(newIndex, item);
        return this;
      },
      /**
       * 清除数据源,清空列表UI
       */
      clear: function(){
        option.listSource = [];
        $root.empty();
        return this;
      },
      /**
       * 重新加载数据源,生成UI
       * @listSource  {[array]} 数据源
       */
      reload: function(listSource){
        $root.empty();
        if(listSource != undefined){
          option.listSource = listSource;
        }
        $.each(option.listSource, build);
        return this;
      }
    };
    return api.reload();
  };
  /**
   * 列表视图插件的默认配置
   */
  $.fn.listview.defaultOption = {
    /**
     * 必填项:表示数据源
     * @listSource [Array]
     */
    listSource: [],
    /**
     * 必填项:表示渲染每个item的方法,data.item为数据项,data.index为索引,需要返回$juqeryDom对象
     * @renderItemCallback [function(data){ }]
     */
    renderItemCallback: undefined,
    /**
     * 选填项:表示每个itemview里面删除按钮的选择器
     * @rmBtnSelector {[string]}
     */
    rmBtnSelector: undefined,
    /**
     * 选填项:$itemview的data发生改变时的回调,data.item为数据项,data.index为索引,通常是data.index发生改变(比如删除操作导致的)
     * @updateItemCallback [function($itemview, data){ }]
     */
    updateItemCallback: undefined,
    /**
     * 选填项:$itemview删除时的回调,data.item为数据项,data.index为索引,返回false可以取消删除操作
     * @rmItemCallback [function(data){ }]
     */
    rmItemCallback: undefined,
    /**
     * 选填项:$itemview点击时的回调,data.item为数据项,data.index为索引
     * @activeItemCallback [function(data){ }]
     */
    activeItemCallback: undefined
  };
}));