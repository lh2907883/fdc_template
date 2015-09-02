/**
 * 说明:index.html的入口
 * 依赖:juqery
 * 作者:lihao
 * 时间:2015-6-10
 */
$(function(){
  "use strict";
  //测试的数据
  var projectJson = {
    title: '',
    pages: [
      [{
        parts:[{
          name: "label",
          html: "Good morning."
        },{
          name: "button",
          top: 50,
          left: 40
        }]
      },{
        parts:[{
          name: "label",
          width: "320px",
          height: "480px",
          //html: 'Association football is a spor<b class="bold">t played between two teams. It is usually called footba<u class="underline">ll, but in some countries, suc</u></b><u class="underline">h as the United States, it is called soccer.</u><i class="italic"><u class="underline"><b class="bold"> In Japan, New Zealand, South</b></u><b class="bold"> Africa, Australia, Canada and Republic of Ir</b></i><b class="bold">eland, both words ar<i class="italic">e comm<u class="underline">only used. Each team has 11 players on the field. One of these players is the goa</u></i></b><i class="italic"><u class="underline">lkeeper, and the other ten are known as "outfield players."</u> The game is played by ki</i>cking a ball into the opponent\'s goal. A match has 90 minutes of play, with a break of 15 minutes in the middle. The break in the middle is called half-time.'
          //html: 'Association football is a sport played between two teams. It is usually called football, but in some countries, such as the United States, it is called soccer. In Japan, New Zealand, South Africa, Australia, Canada and Republic of Ireland, both words are commonly used. Each team has 11 players on the field. One of these players is the goalkeeper, and the other ten are known as "outfield players." The game is played by kicking a ball into the opponent\'s goal. A match has 90 minutes of play, with a break of 15 minutes in the middle. The break in the middle is called half-time.'          
          //html: 'Association football is a sport played between two teams. It i<span class="part-font18">s usually called football, b</span>ut in <i class="part-italic"><u class="part-underline">some countr</u></i>ies, su<span class="part-font16">ch as the United States, it is</span> called soccer. In <b class="part-bold"><span class="part-font24">Japan</span></b>, New Zealand, South Africa, Australia, Canada and Republic of Ireland, both w<b class="part-bold">ords are commonly used. Each team <u class="part-underline">has 11 players on the fie</u></b><u class="part-underline">ld. One of these players is the </u><i class="part-italic"><u class="part-underline">goalk</u>eeper, and the other ten are known as "outfield players." <span class="part-font12">The </span></i><span class="part-font12">game is played by kicking a ball into the opponent\'s goal. A match<b class="part-bold"> has 90 minutes of play, with a b</b>reak of 15 minutes in the middle. The break in the middle is called half-time.</span>' 
          html: 'Association football is a sport played between two teams. It i<span class="part-font18">s usually called football, b</span>ut in <i class="part-italic"><u class="part-underline">some co</u></i>untries, su<span class="part-font16">ch as the United States, it is</span> called soccer. In <b class="part-bold"><span class="part-font24"></span></b><span class="part-font24">Japan</span><b class="part-bold"><span class="part-font24"></span></b>, New Zealand, South Africa, Australia, Canada and Republic of Ire<b class="part-bold"></b><b class="part-bold"></b><span class="part-font48">land, both words are</span><b class="part-bold"></b><b class="part-bold"></b><b class="part-bold"> commonly used. Each team <u class="part-underline">has 11 players on the fie</u></b><u class="part-underline">ld. One of these players is the </u><i class="part-italic"><u class="part-underline">goalk</u>eeper, and the other ten are known as "outfield players." <span class="part-font12">The </span></i><span class="part-font12">game is played by kicking a ball into the opponent goal. A match<b class="part-bold"> has 90 minutes of play, with a b</b>reak of 15 minutes in the middle. The break in the middle is called half-time.</span>'
        }]
      }],
      [{
        parts:[{
          name: "label",
          html: "心无所住"
        }]
      }]
    ]
  };
  //常数
  var MIN_WIDTH = 28,
    MIN_HEIGHT = 28;

  /**
   * 播放页面切换动画,动画完成的回调只触发一次
   * @param  {jquery object}   $target          [播放动画的jquery对象]
   * @param  {Boolean}  isGroupAnimation [为true表示pageGroup的动画(上下切换),否则就是page的动画(左右切换)]
   * @param  {string}   animateName      [动画的Class]
   * @param  {Function} callback         [动画播放完成后的回调]
   */
  var playAnimation = function($target, isGroupAnimation, animateName, callback){
    var allAnimation = isGroupAnimation ? 'slideInDown slideOutDown slideInUp slideOutUp animated' : 'slideInLeft slideOutLeft slideInRight slideOutRight animated'
    $target.removeClass(allAnimation)
      .addClass(animateName + ' animated')
      .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $target.removeClass(allAnimation).off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
        if(callback){
          callback();
        }
      });                    
  };

  /****************************************缩略图*******************************************/
  /**
   * 缩略图模板
   */
  var sPageTmpl = _.template($('#sPageTmpl').html());
  /**
   * 缩略图管理对象
   */
  var thumbView = $("#thumbView").listview({
    rmBtnSelector: "li .page-btnrm",
    /**
     * 显示item
     */
    renderItemCallback: function(data){
      var html = sPageTmpl(data);
      return $(html);
    },
    /**
     * 更新item
     */
    updateItemCallback: function(data){
      $("span.page-num", this).html(data.index + 1);
    },
    /**
     * 删除item
     */
    rmItemCallback: function(data){
      project.removePageGroup(data.index);
    },
    /**
     * 选中激活item
     */
    activeItemCallback: function(data){
      project.setCurrentGroup(data.index);
    }
  });
  /**
   * 添加pageGroup的事件处理
   */
  $("#btnNewPage").click(function(){
    var newGroup = project.newPageGroup().setToCurrent();
    //添加缩略图页面
    thumbView.addNew(newGroup);
  });

  /***************************************Project对象******************************************/
  /**
   * 还原groupPage到初始状态
   */
  var resetGroupPage = function(groupPage){
    //当前oldGroup的当前page隐藏
    var fromPage = groupPage.getCurrentPage();
    var ToPage = groupPage.pages[0];
    if(fromPage != ToPage){
      if(fromPage){
        playAnimation(fromPage.$ele, false, "slideOutRight", function(){
          fromPage.$ele.hide();
        });
      }
      if(ToPage){
        ToPage.$ele.show();
        playAnimation(ToPage.$ele, false, "slideInLeft");
      }
    }
    groupPage.setCurrentPage(0, true);
  };
  /**
   * 页面的呈现
   * @param  {[object]} page [页面对象]
   */
  var viewPage = function(page){
    if(page){
      page.$ele.pageViewer("render");
      $("#pagesWrap").resizeBox("reset");
    }
  };
  /**
   * 转换成的内存对象
   */
  var project = new Project(projectJson, {
    /**
     * 添加pageGroup之前的回调
     */
    preNewPageGroupCallback: function(pageGroup, index){
      //添加缩略图页面
      thumbView.addNew(pageGroup);
      //添加divGroup,并关联到pageGroup
      pageGroup.$ele = $('<div class="group" style="display:none;"></div>').appendTo($("#pagesWrap"));      
    },
    /**
     * 添加pageGroup之后的回调
     */
    newPageGroupCallback: function(pageGroup, index){
      var thumbWrap = $("#thumbView li:eq(" + index + ") .event-thumbView");
      if(thumbWrap.length > 0 && pageGroup.pages.length > 0){
        thumbWrap.empty();
        pageGroup.pages[0].$ele.clone().show().addClass("thumbView").appendTo(thumbWrap);
      }
    },
    /**
     * 删除pageGroup的回调
     */
    removePageGroupCallback: function(index, group){      
      group.$ele.remove();
    },
    /**
     * 当前pageGroup发生改变的回调
     */
    curPageGroupChangedCallback: function(curGroup, newIndex, oldGroup, oldIndex){
      //播放pageGroup的切换动画
      var curAnimate, oldAnimate;
      if(oldIndex > newIndex){
        curAnimate = "slideInDown";
        oldAnimate = "slideOutDown"
      }
      else{
        curAnimate = "slideInUp";
        oldAnimate = "slideOutUp";
      }
      if(oldGroup){
        resetGroupPage(oldGroup);
        playAnimation(oldGroup.$ele, true, oldAnimate, function(){
          oldGroup.$ele.hide();
        });
      }
      curGroup.$ele.show();
      curGroup.pages[0].$ele.show();
      curGroup.setCurrentPage(0, true);
      playAnimation(curGroup.$ele, true, curAnimate, function(){
        viewPage(curGroup.pages[0]);
      });
      //设置当前pageGroup的Pages导航
      pagesNavView.reload(curGroup.pages);
    },
    /**
     * 添加page之前的回调
     */
    preNewPageCallback: function(page, index){
      //添加sectionPage,并关联到page
      page.$ele = $('<section class="page" style="display:none;"></section>').appendTo(page.parent.$ele);
    },
    /**
     * 添加page之后的回调
     */
    newPageCallback: function(page, index){
      //初始化pageView
      page.$ele.pageViewer({
        pageObj: page
      }).pageViewer("init");
    },
    /**
     * 删除page的回调
     */
    removePageCallback: function(index, page){
      page.$ele.remove();
    },
    /**
     * 当前page发生改变的回调
     */
    curPageChangedCallback: function(curPage, newIndex, oldPage, oldIndex){
      //播放page的切换动画
      var curAnimate, oldAnimate;
      if(oldIndex > newIndex){
        curAnimate = "slideInLeft";
        oldAnimate = "slideOutRight"
      }
      else{
        curAnimate = "slideInRight";
        oldAnimate = "slideOutLeft";
      }
      if(oldPage){
        playAnimation(oldPage.$ele, false, oldAnimate, function(){
          oldPage.$ele.hide();
        });
      }
      curPage.$ele.show();
      playAnimation(curPage.$ele, false, curAnimate, function(){
        viewPage(curPage);
      });
    }
  });

  /***************************************Pages导航******************************************/
  /**
   * Pages导航管理对象
   */
  var pagesNavView = $("#pagesNavView").listview({
    rmBtnSelector: "li .rm",
    /**
     * 显示item
     */
    renderItemCallback: function(data){
      var html = '<li><span class="num">' + (data.index + 1) + '</span><span class="rm">×</span></li>';
      return $(html);
    },
    /**
     * 更新item
     */
    updateItemCallback: function(data){
      $("span.num", this).html(data.index + 1);
    },
    /**
     * 删除item
     */
    rmItemCallback: function(data){
      var curGroup = project.getCurrentGroup();
      curGroup.removePage(data.index);
    },
    /**
     * 选中激活item
     */
    activeItemCallback: function(data){
      var curGroup = project.getCurrentGroup();
      curGroup.setCurrentPage(data.index);
    }
  });
  /**
   * 添加page的事件处理
   */
  $("#newPage").click(function(){
    var curGroup = project.getCurrentGroup();
    if(curGroup){
      var newPage = curGroup.newPage().setToCurrent();
      //添加缩略图页面
      pagesNavView.addNew(newPage);
    }
  });

  /****************************************编辑模式*****************************************/
  /**
   * 初始化编辑模式
   */
  $("#pagesWrap").resizeBox({
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    resizeSelector: "> .group > .page > *",
    /**
     * 获取焦点
     */
    getFocusCallback: function(){
      $(this).attr("contenteditable", true);
    },
    /**
     * 失去焦点
     */
    lostFocusCallback: function(){
      $(this).removeAttr("contenteditable");
    },
    /**
     * 拖放结束
     */
    dragEndCallback: function(e){
      //拖放完成时要更新位置和长宽属性
      var part = this.data("_part");
      designTool.updateSize(part, e.width, e.height);
    },
    /**
     * item选择后设置工具栏
     */
    targetSelectedCallback: function(e){
      var part = $(this).data("_part");
      var $target = $(e.target);
      designTool.setBind(part, $(this), $target);
    }
  });

  /****************************************工具栏*******************************************/
  $("#toolsBtn ul li").click(function(){
    var curPage = project.getCurrentPage();
    if(curPage){
      var partName = $(this).attr("tag");
      //根据类型生成part
      var part = curPage.newPart(partName);
      //在UI上添加part
      curPage.$ele.pageViewer("addPartToView", part);
    }
  });
  /**
   * 文本框双击编辑
   */
  $("#pagesWrap").delegate("> .group > .page > article", "dblclick", function(){
    $("#pagesWrap").resizeBox("setFocus", $(this));
  });
  /**
   * 初始化工具栏
   */
  designTool.initLabelTool({minWidth: MIN_WIDTH, minHeight: MIN_HEIGHT})
    .initButtonTool();

  /*****************************************入口*******************************************/
  //触发显示第一页
  $("#thumbView").children(":first").click();
});
