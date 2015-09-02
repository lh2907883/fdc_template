/**
 * 说明:管理页面json数据和页面之间的关系
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
   * 表示页面
   * @pageJson [string] 页面数据
   * @parent [object] 页面的父对象,就是它的groupPage
   * @option [object] project的事件回调
   * @pIndex [int] 在父对象内的索引位置
   */
  var Page = function(pageJson, parent, option, pIndex){
    this.parent = parent;
    this.option = option;
    if(this.option && this.option.preNewPageCallback){
      this.option.preNewPageCallback(this, pIndex);
    }
    this.parts = [];
    var arrPartJson = pageJson.parts || [];
    for(var i=0; i<arrPartJson.length; i++){
      var item = arrPartJson[i];
      this.newPart(item.name, item);
    }
    if(this.option && this.option.newPageCallback){
      this.option.newPageCallback(this, pIndex);
    }
  };
  Page.prototype = {
    /**
     * 页面的部件集合（包括文字，图片，按钮。。）
     */
    parts: undefined,
    /**
     * 把这个Page设置为当前Page
     */
    setToCurrent: function(notTriggerEvent){
      for(var i=0; i<this.parent.pages.length; i++){
        if(this == this.parent.pages[i]){
          this.parent.setCurrentPage(i, notTriggerEvent);
          return this;
        }
      }
    },
    /**
     * 添加part,并返回这个part
     * @partName [string] part的类型,是[label,button,imgae等等]的其中一种
     * @partJson [string] json数据,不传会生成一个默认的part
     */
    newPart: function(partName, partJson){
      var newPart = new partMaps[partName](partJson || {}, this);
      this.parts.push(newPart);
      return newPart;
    }
  };

  /**
   * 表示页面组,就是水平方向上的一组页面
   * @pageJson [string] 页面组数据
   * @parent [object] 页面组的父对象,就是它的project
   * @option [object] project的事件回调
   * @pIndex [int] 在父对象内的索引位置
   */
  var PageGroup = function(pageGroupJson, parent, option, pIndex){
    this.parent = parent;
    this.option = option;
    if(this.option.preNewPageGroupCallback){
      this.option.preNewPageGroupCallback(this, pIndex);
    }
    this.pages = [];
    for(var i=0; i<pageGroupJson.length; i++){
      this.newPage(pageGroupJson[i]);
    }
    if(this.option.newPageGroupCallback){
      this.option.newPageGroupCallback(this, pIndex);
    }
  };
  PageGroup.prototype = {
    current: undefined,
    pages: undefined,
    /**
     * 把这个PageGroup设置为当前PageGroup
     */
    setToCurrent: function(notTriggerEvent){
      for(var i=0; i<this.parent.pageGroups.length; i++){
        if(this == this.parent.pageGroups[i]){
          this.parent.setCurrentGroup(i, notTriggerEvent);
          return this;
        }
      }
    },
    /**
     * 设置当前page,触发curPageChangedCallback
     * @index [int] 索引
     * @notTriggerEvent [bool] 默认情况下会触发curPageChangedCallback事件,而在@notTriggerEvent===true的时候,不会触发
     */
    setCurrentPage: function(index, notTriggerEvent){
      if(this.current != index && index >= 0 && index < this.pages.length){
        var oldIndex = this.current;
        var oldPage = oldIndex != undefined ? this.pages[oldIndex] : undefined;
        this.current = index;
        if(notTriggerEvent !== true && this.option.curPageChangedCallback){
          this.option.curPageChangedCallback(this.pages[index], index, oldPage, oldIndex);
        }
      }
    },
    /**
     * 获取当前page
     */
    getCurrentPage: function(){
      if(this.current != undefined){
        return this.pages[this.current];
      }
    },
    /**
     * 添加一个新的page,并返回这个page
     * @groupJson [string] json数据,不传会生成一个空page
     */
    newPage: function(pageJson){
      var newIndex = this.pages.length;
      var newPage = new Page(pageJson || {}, this, this.option, newIndex);
      this.pages.push(newPage);
      return newPage;
    },
    /**
     * 删除Page
     * @index [int] 要删除的Page的索引
     */
    removePage: function(index){
      if(index >= 0 && index < this.pages.length){
        var page = this.pages[index];
        this.pages.splice(index, 1);
        if(this.current == index){
          var toIndex = this.current - 1;
          this.current = undefined;
          this.setCurrentPage(toIndex);
        }
        else if(this.current > index){
          this.current -= 1;
        }
        if(this.option.removePageCallback){
          this.option.removePageCallback(index, page);
        }
      }
      return this;
    }
  };

  /**
   * 表示应用
   * @pageJson [string] json数据
   * @option [object] project的事件回调
   */
  var Project = function(projectJson, option){
    this.option = $.extend({}, Project.defaultOption, option);
    this.current = undefined;
    this.pageGroups = [];
    for(var i=0; i<projectJson.pages.length; i++){
      this.newPageGroup(projectJson.pages[i]);
    }
  };
  Project.prototype = {
    current: undefined,
    title: undefined,
    pageGroups: undefined,
    /**
     * 转换成json数据格式
     */
    toJson: function(){},
    /**
     * 获取当前pageGroup的当前Page
     */
    getCurrentPage: function(){
      var res = undefined;
      var curGroup = this.getCurrentGroup();
      if(curGroup){
        res = curGroup.getCurrentPage();
      }
      return res;
    },
    /**
     * 设置当前pageGroup,触发curPageGroupChangedCallback事件
     * @index [int] 索引
     * @notTriggerEvent [bool] 默认情况下会触发curPageGroupChangedCallback事件,而在@notTriggerEvent===true的时候,不会触发
     */
    setCurrentGroup: function(index, notTriggerEvent){
      if(this.current != index && index >= 0 && index < this.pageGroups.length){
        var oldIndex = this.current;
        var oldGroup = oldIndex != undefined ? this.pageGroups[oldIndex] : undefined;
        this.current = index;
        if(notTriggerEvent !== true && this.option.curPageGroupChangedCallback){
          this.option.curPageGroupChangedCallback(this.pageGroups[index], index, oldGroup, oldIndex);
        }
      }
    },
    /**
     * 获取当前pageGroup
     */
    getCurrentGroup: function(){
      if(this.current != undefined){
        return this.pageGroups[this.current];
      }
    },
    /**
     * 添加一个新的pageGroup,并返回这个pageGroup
     * @groupJson [string] json数据,不传会生成一个带有空page的PageGroup
     */
    newPageGroup: function(groupJson){ 
      var newIndex = this.pageGroups.length;
      var newGroup = new PageGroup(groupJson || [{}], this, this.option, newIndex);
      this.pageGroups.push(newGroup);
      return newGroup;
    },
    /**
     * 删除PageGroup
     * @index [int] 要删除的PageGroup的索引
     */
    removePageGroup: function(index){
      if(index >= 0 && index < this.pageGroups.length){
        var group = this.pageGroups[index];
        this.pageGroups.splice(index, 1);
        if(this.current == index){
          var toIndex = this.current - 1;
          this.current = undefined;
          this.setCurrentGroup(toIndex);
        }
        else if(this.current > index){
          this.current -= 1;
        }
        if(this.option.removePageGroupCallback){
          this.option.removePageGroupCallback(index, group);
        }
      }
      return this;
    }
  };

  /**
   * 表示Project的事件回调
   */
  Project.defaultOption = {
    /**
     * 添加pageGroup之前的回调 function(pageGroup, index){}
     */
    preNewPageGroupCallback: undefined,
    /**
     * 添加pageGroup之后的回调(此时pageGroup里面的pages都生成好了) function(pageGroup, index){}
     */
    newPageGroupCallback: undefined,
    /**
     * 删除pageGroup的回调 function(index, group){},
     */
    removePageGroupCallback: undefined,
    /**
     * 当前pageGroup发生改变的回调 function(curGroup, newIndex, oldGroup, oldIndex){}
     */
    curPageGroupChangedCallback: undefined,
    /**
     * 添加page之前的回调function(page, index){}
     */
    preNewPageCallback: undefined,
    /**
     * 添加page之后的回调(此时page里面的parts都生成好了) function(page, index){}
     */
    newPageCallback: undefined,
    /**
     * 删除page的回调 function(index, page){}
     */
    removePageCallback: undefined,
    /**
     * 当前page发生改变的回调 function(curPage, newIndex, oldPage, oldIndex){}
     */
    curPageChangedCallback: undefined
  };
  window.Project = Project;
  return Project;
}));