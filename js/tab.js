(function(win){
    const ELEM_TITLE = "zq-tab-title", ELEM_CONTENT = "zq-tab-content", SHOW = "zq-show",
            HIDE = "zq-hide",THIS = "zq-this";
    function Tab(){
        this.options = this.config;
    }
    Tab.prototype.config={
        allowClose:false, //是否带删除功能
        index:0,  //下标开始
        trigger:"click" // 事件
    };
    Tab.prototype.render=function(opt){
        let that = this ;
            that.options = $.extend({},that.config,opt);
            that.options.elem = $(that.options.elem);
            if(that.options.elem[0]){
                that.elemTitle =  that.options.elem.find("."+ELEM_TITLE);
                that.elemContent = that.options.elem.find("."+ELEM_CONTENT);
                that.elemLi =  that.elemTitle.find("li");
                that.options.index < 0 && (that.options.index = 0);
                that.options.index > that.elemLi.length &&( that.options.index =  that.elemLi.length -1);
                that.init();
                that.change();
            }else{
                throw new Error('参数输入错误')
            }
    };
    Tab.prototype.init = function(){
       let that = this;
        that.options.allowClose && (that.options.elem.attr("zq-allowClose", that.options.allowClose),
                                    that.elemTitle.find("li").append('<i></i>'),
                                    that.elemTitle.find("li i").on("click",function(){
                                       let i = $(this).parent().index(),
                                            zq_id = that.elemTitle.find("."+THIS).attr("zq-id");
                                        $(this).parent().remove();
                                        that.elemContent.find("div").eq(i).remove();
                                        zq_id < i && zq_id !== undefined && (that.options.index = zq_id);
                                        zq_id > i && zq_id !== undefined  &&(that.options.index = i);

                                        that.elemTitle.find("li").eq( that.options.index).addClass(THIS).siblings().removeClass(THIS);
                                        that.elemContent.find("div").eq( that.options.index).addClass(THIS).siblings().removeClass(THIS);
                                    })


        );
        that.elemTitle.find("li").eq( that.options.index).addClass(THIS).siblings().removeClass(THIS);
        that.elemContent.find("div").eq( that.options.index).addClass(THIS).siblings().removeClass(THIS);

    };
    Tab.prototype.change = function(){
        let that = this;

        that.elemTitle.find("li").on("hover" === that.options.trigger ?
                                     "mouseover" : that.options.trigger,
                                     function () {
                                        $(this).addClass(THIS).attr("zq-id",$(this).index()).siblings().removeClass(THIS);
                                        that.elemContent.find("div").eq($(this).index()).addClass(THIS).siblings().removeClass(THIS);
        })
    };

    win.tab = Tab;
})(window);
