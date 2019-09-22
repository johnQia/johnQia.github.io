(function(window){
    //基本结构标签
   const THIS = "zq-this",ELEM_ARROW = "zq-carousel-arrow" ,ELEM_ITEM = ">[zq-carousel-item]>*",
         ELEM_DOT = "zq-carousel-dot";
        //ELEM_LEFT = "zq-carousel-left",ELEM_RIGHT = "zq-carousel-right", ELEM = ".zq-carousel",
       //ELEM_PREV = "zq-carousel-prev",ELEM_NEXT = "zq-carousel-next";

   function Carousel(){
       var that =this;
       that.options = this.config;

   }

   //默认配置项
   Carousel.prototype.config = {
       width: '600px'//默认宽度
       ,height: '280px'//默认高度
       ,full: false //是否全屏
       ,arrow: 'hover' //切换箭头默认显示状态：hover/always/none
       ,indicator: 'inside' //指示器位置：inside/outside/none
       ,autoplay: false //是否自动切换
       ,interval: 3000 //自动切换的时间间隔，不能低于800ms
       ,anim: 'fade' //动画类型：default/updown/fade 只支持fade
       ,trigger: 'click' //指示器的触发方式：click/hover
       ,index: 0, //初始开始的索引
       elemItem:null
   };

   //初始化信息
   Carousel.prototype.render = function (opt){
       let that = this;
       that.options =$.extend({},that.config,opt);
       that.options.elem = $(that.options.elem);
       if(that.options.elem[0]){
           that.elemItem = that.options.elem.find(ELEM_ITEM);
           that.options.index < 0 && (that.options.index = 0) ;
           that.options.index >= that.elemItem.length && (that.options.index = that.elemItem.length-1);
           that.options.full ? that.options.elem.css({position:"fiexd",width:"100%",height:"100%",zIndex:999}) :
                                that.options.elem.css({width:that.options.width,height:that.options.height});
           that.options.interval < 800 && (that.options.interval=800);
           that.options.elem.attr('zq-anim',that.options.anim);
           that.elemItem.eq(that.options.index).addClass(THIS);

           if( that.elemItem.length <=1 ){
               return
           }
           that.dot();that.arrow();that.autoplay();that.events();
       }else{
           throw new Error( '参数输入错误')
       }
   };
    Carousel.prototype.prevIndex = function(){
        let that = this , t=that.options,
            n = t.index - 1;
        return n < 0 ? ( n = that.elemItem.length -1 ): n;
    };
    Carousel.prototype.nextIndex = function(){
        let that = this , t=that.options,
            n = t.index + 1;
        return n >= that.elemItem.length ? n = 0 : n;
    };
    Carousel.prototype.addIndex=function(e){
        let that = this ,
            t=that.options,
            i = e || 1 ;
        t.index =  t.index + i;
        t.index >= that.elemItem.length  && (t.index = 0);
    };
    Carousel.prototype.subIndex=function(e){
        let that = this ,
            t=that.options,
            i = e || 1 ;
        t.index =  t.index - i;
        t.index < 0  && (t.index = that.elemItem.length -1 );
    };
    //自动轮播
    Carousel.prototype.autoplay = function (){
        let that=this,t=that.options;
        t.autoplay && (that.timer = setInterval(function(){
                                      that.slide();
                                    },t.interval))
    };
    //初始化箭头指向
    Carousel.prototype.arrow = function(){
        let that = this, t=that.options;
        let arrowDom = $(["<button class='"+ELEM_ARROW+"' zq-type='sub'>",
                            t.anim === "updown" ? "∧":"<",
                        "</button>"+
                        "<button class='"+ELEM_ARROW+"' zq-type='add'>",
                            t.anim === "updown" ? "∨" : ">",
                        "</button>"].join(""));

        t.elem.attr("zq-arrow",t.arrow);
        t.elem.find('.' + ELEM_ARROW)[0] && t.elem.find('.' + ELEM_ARROW).remove();
        t.elem.append(arrowDom);

        arrowDom.on('click',function(){
            let type=$(this).attr("zq-type");
            that.slide(type);
        });
    };
    //初始化指示器
    Carousel.prototype.dot = function(){
        let that = this,t=that.options,
            index = t.index;
        that.dotHtml = $(["<div class='"+ELEM_DOT+"'><ul class=''>",(function () {
                            let html = [];
                            for(let i = 0;i < that.elemItem.length; i++){
                                html.push("<li "+(i === index ? "class="+THIS : '') + "></li>");
                            }
                            return html.join("");
                        })(),"</ul></div>"].join(""));
        t.elem.attr('zq-indicator',t.indicator);
        t.elem.find('.'+ELEM_DOT)[0] && t.find('.'+ELEM_DOT).remove();
        t.elem.append(that.dotHtml);
        "updown" === t.anim && that.dotHtml.css("margin-top",-( that.dotHtml.height() / 2 ));
        that.dotHtml.find('li').on("hover" === t.trigger ?
                                "mouseover" : t.trigger
                                ,function () {
                                    let ind = $(this).index();
                                    ind > t.index ? that.slide("add",ind - t.index):
                                    ind < t.index && that.slide("sub",t.index - ind );
            })
    };
   //初始化轮播方向
    Carousel.prototype.slide=function( type , i ){
        let that = this,
            t = that.options;

        if(that.haveSlide) return;
        if("sub" === type){
            that.subIndex(i);
            that.elemItem.eq(t.index).addClass(THIS).siblings().removeClass(THIS);
        }else{
            that.addIndex(i);
            that.elemItem.eq(t.index).addClass(THIS).siblings().removeClass(THIS);
        }
        that.dotHtml.find("li").eq(t.index).addClass(THIS).siblings().removeClass(THIS);

    };
    Carousel.prototype.events = function () {
        let that = this,
            t = that.options;
        t.elem.data("haveEvents") || (t.elem.on("mouseenter", function () {
            clearInterval(that.timer)
        }).on("mouseleave", function () {
            that.autoplay()
        }), t.elem.data("haveEvents", !0))
    };


    window.carousel=  Carousel;
})(window);