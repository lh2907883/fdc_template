/**
 * 说明:页面上的小部件(文本,按钮,图片等等)
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
   * 文本框
   * @param {[string] jsonData json数据
   */
  var LabelPart = function(jsonData, parent){
    this.jsonData = $.extend({}, LabelPart.defaultProperty, jsonData);
    this.name = this.jsonData.name;
    this.parent = parent;
  };
  /**
   * 文本框默认属性
   */
  LabelPart.defaultProperty = {
    name: "label",
    width: "160px",
    height: "28px",
    lineHeight: "28px",
    html: "文字 (双击编辑文字)"
  };
  LabelPart.prototype = {
    $dom: undefined,
    /**
     * 生成dom
     */
    buildDom: function(){
      return this.$dom = $('<article style="padding: 0 3px;"></article>').data("_part", this).css({
        position: "absolute",
        outline: "none",
        lineHeight: this.jsonData["lineHeight"],
        width: this.jsonData["width"],
        height: this.jsonData["height"],
        top: this.jsonData["top"],
        left: this.jsonData["left"]
      }).html(this.jsonData["html"]);
    }
  };

  /**
   * 按钮
   * @param {[string] jsonData json数据
   */
  var ButtonPart = function(jsonData, parent){
    this.jsonData = $.extend({}, ButtonPart.defaultProperty, jsonData);
    this.name = this.jsonData.name;
    this.parent = parent;
  };
  /**
   * 按钮默认属性
   */
  ButtonPart.defaultProperty = {
    name: "button",
    width: "130px",
    height: "32px",
    backgroundColor: "rgb(33, 127, 188)",
    color: "rgb(255, 255, 255)",
    borderWidth: "1px",
    borderColor: "transparent",
    borderRadius: "0",
    html: "按钮"
  };
  ButtonPart.prototype = {
    $dom: undefined,
    /**
     * 生成dom
     */
    buildDom: function(){
      return this.$dom = $("<button></button>").data("_part", this).css({
        position: "absolute",    
        textAlign: "center", 
        width: this.jsonData["width"],
        height: this.jsonData["height"],
        backgroundColor: this.jsonData["backgroundColor"],
        color: this.jsonData["color"],
        borderWidth: this.jsonData["borderWidth"],
        borderColor: this.jsonData["borderColor"],
        borderRadius: this.jsonData["borderRadius"],
        top: this.jsonData["top"],
        left: this.jsonData["left"]
      }).html(this.jsonData["html"]);
    }
  };

  /**
   * 图片
   * @param {[string] jsonData json数据
   */
  var ImagePart = function(jsonData){
    var init = function(){

    };
    init(jsonData);
  };
  ImagePart.prototype = {
    $dom: undefined,
    buildDom: function(){
      var dom = this.$dom = $("<article></article>").data("_part", this);


      return dom;
    }
  };

  /**
   * 所有的parts引用表
   */
  window.partMaps = {
    label: LabelPart,
    button: ButtonPart,
    image: ImagePart
  };
}));