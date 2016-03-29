!function($,e,t,s){"use strict";function i(e,s){if(this.el=e,this.$el=$(e),this.s=$.extend({},l,s),this.s.dynamic&&"undefined"!==this.s.dynamicEl&&this.s.dynamicEl.constructor===Array&&!this.s.dynamicEl.length)throw"When using dynamic mode, you must also define dynamicEl as an Array.";return this.modules={},this.lGalleryOn=!1,this.lgBusy=!1,this.hideBartimeout=!1,this.isTouch="ontouchstart"in t.documentElement,this.s.slideEndAnimatoin&&(this.s.hideControlOnEnd=!1),this.s.dynamic?this.$items=this.s.dynamicEl:"this"===this.s.selector?this.$items=this.$el:""!==this.s.selector?this.s.selectWithin?this.$items=$(this.s.selectWithin).find(this.s.selector):this.$items=this.$el.find($(this.s.selector)):this.$items=this.$el.children(),this.$slide="",this.$outer="",this.init(),this}var l={mode:"lg-slide",cssEasing:"ease",easing:"linear",speed:600,height:"100%",width:"100%",addClass:"",startClass:"lg-start-zoom",backdropDuration:150,hideBarsDelay:6e3,useLeft:!1,closable:!0,loop:!0,escKey:!0,keyPress:!0,controls:!0,slideEndAnimatoin:!0,hideControlOnEnd:!1,mousewheel:!0,appendSubHtmlTo:".lg-sub-html",preload:1,showAfterLoad:!0,selector:"",selectWithin:"",nextHtml:"",prevHtml:"",index:!1,iframeMaxWidth:"100%",download:!0,counter:!0,appendCounterTo:".lg-toolbar",swipeThreshold:50,enableSwipe:!0,enableDrag:!0,dynamic:!1,dynamicEl:[],galleryId:1};i.prototype.init=function(){var t=this;t.s.preload>t.$items.length&&(t.s.preload=t.$items.length);var s=e.location.hash;s.indexOf("lg="+this.s.galleryId)>0&&(t.index=parseInt(s.split("&slide=")[1],10),$("body").addClass("lg-from-hash"),$("body").hasClass("lg-on")||setTimeout(function(){t.build(t.index),$("body").addClass("lg-on")})),t.s.dynamic?(t.$el.trigger("onBeforeOpen.lg"),t.index=t.s.index||0,$("body").hasClass("lg-on")||setTimeout(function(){t.build(t.index),$("body").addClass("lg-on")})):t.$items.on("click.lgcustom",function(e){try{e.preventDefault(),e.preventDefault()}catch(s){e.returnValue=!1}t.$el.trigger("onBeforeOpen.lg"),t.index=t.s.index||t.$items.index(this),$("body").hasClass("lg-on")||(t.build(t.index),$("body").addClass("lg-on"))})},i.prototype.build=function(e){var t=this;t.structure(),$.each($.fn.lightGallery.modules,function(e){t.modules[e]=new $.fn.lightGallery.modules[e](t.el)}),t.slide(e,!1,!1),t.s.keyPress&&t.keyPress(),t.$items.length>1&&(t.arrow(),setTimeout(function(){t.enableDrag(),t.enableSwipe()},50),t.s.mousewheel&&t.mousewheel()),t.counter(),t.closeGallery(),t.$el.trigger("onAfterOpen.lg"),t.$outer.on("mousemove.lg click.lg touchstart.lg",function(){t.$outer.removeClass("lg-hide-items"),clearTimeout(t.hideBartimeout),t.hideBartimeout=setTimeout(function(){t.$outer.addClass("lg-hide-items")},t.s.hideBarsDelay)})},i.prototype.structure=function(){var t="",s="",i=0,l="",o,a=this;for($("body").append('<div class="lg-backdrop"></div>'),$(".lg-backdrop").css("transition-duration",this.s.backdropDuration+"ms"),i=0;i<this.$items.length;i++)t+='<div class="lg-item"></div>';if(this.s.controls&&this.$items.length>1&&(s='<div class="lg-actions"><div class="lg-prev lg-icon">'+this.s.prevHtml+'</div><div class="lg-next lg-icon">'+this.s.nextHtml+"</div></div>"),".lg-sub-html"===this.s.appendSubHtmlTo&&(l='<div class="lg-sub-html"></div>'),o='<div class="lg-outer '+this.s.addClass+" "+this.s.startClass+'"><div class="lg" style="width:'+this.s.width+"; height:"+this.s.height+'"><div class="lg-inner">'+t+'</div><div class="lg-toolbar group"><span class="lg-close lg-icon"></span></div>'+s+l+"</div></div>",$("body").append(o),this.$outer=$(".lg-outer"),this.$slide=this.$outer.find(".lg-item"),this.s.useLeft?(this.$outer.addClass("lg-use-left"),this.s.mode="lg-slide"):this.$outer.addClass("lg-use-css3"),a.setTop(),$(e).on("resize.lg orientationchange.lg",function(){setTimeout(function(){a.setTop()},100)}),this.$slide.eq(this.index).addClass("lg-current"),this.doCss()?this.$outer.addClass("lg-css3"):(this.$outer.addClass("lg-css"),this.s.speed=0),this.$outer.addClass(this.s.mode),this.s.enableDrag&&this.$items.length>1&&this.$outer.addClass("lg-grab"),this.s.showAfterLoad&&this.$outer.addClass("lg-show-after-load"),this.doCss()){var d=this.$outer.find(".lg-inner");d.css("transition-timing-function",this.s.cssEasing),d.css("transition-duration",this.s.speed+"ms")}$(".lg-backdrop").addClass("in"),setTimeout(function(){a.$outer.addClass("lg-visible")},this.s.backdropDuration),this.s.download&&this.$outer.find(".lg-toolbar").append('<a id="lg-download" target="_blank" download class="lg-download lg-icon"></a>'),this.prevScrollTop=$(e).scrollTop()},i.prototype.setTop=function(){if("100%"!==this.s.height){var t=$(e).height(),s=(t-parseInt(this.s.height,10))/2,i=this.$outer.find(".lg");t>=parseInt(this.s.height,10)?i.css("top",s+"px"):i.css("top","0px")}},i.prototype.doCss=function(){var e=function(){var e=["transition","MozTransition","WebkitTransition","OTransition","msTransition","KhtmlTransition"],s=t.documentElement,i=0;for(i=0;i<e.length;i++)if(e[i]in s.style)return!0};return e()?!0:!1},i.prototype.isVideo=function(e,t){var s;if(s=this.s.dynamic?this.s.dynamicEl[t].html:this.$items.eq(t).attr("data-html"),!e&&s)return{html5:!0};var i=e.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i),l=e.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i),o=e.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i),a=e.match(/\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i);return i?{youtube:i}:l?{vimeo:l}:o?{dailymotion:o}:a?{vk:a}:void 0},i.prototype.counter=function(){this.s.counter&&$(this.s.appendCounterTo).append('<div id="lg-counter"><span id="lg-counter-current">'+(parseInt(this.index,10)+1)+'</span> / <span id="lg-counter-all">'+this.$items.length+"</span></div>")},i.prototype.addHtml=function(e){var t=null,s;if(this.s.dynamic?this.s.dynamicEl[e].subHtmlUrl?s=this.s.dynamicEl[e].subHtmlUrl:t=this.s.dynamicEl[e].subHtml:this.$items.eq(e).attr("data-sub-html-url")?s=this.$items.eq(e).attr("data-sub-html-url"):t=this.$items.eq(e).attr("data-sub-html"),!s)if("undefined"!=typeof t&&null!==t){var i=t.substring(0,1);t="."===i||"#"===i?$(t).html():t}else t="";".lg-sub-html"===this.s.appendSubHtmlTo?s?this.$outer.find(this.s.appendSubHtmlTo).load(s):this.$outer.find(this.s.appendSubHtmlTo).html(t):s?this.$slide.eq(e).load(s):this.$slide.eq(e).append(t),"undefined"!=typeof t&&null!==t&&(""===t?this.$outer.find(this.s.appendSubHtmlTo).addClass("lg-empty-html"):this.$outer.find(this.s.appendSubHtmlTo).removeClass("lg-empty-html")),this.$el.trigger("onAfterAppendSubHtml.lg",[e])},i.prototype.preload=function(e){var t=1,s=1;for(t=1;t<=this.s.preload&&!(t>=this.$items.length-e);t++)this.loadContent(e+t,!1,0);for(s=1;s<=this.s.preload&&!(0>e-s);s++)this.loadContent(e-s,!1,0)},i.prototype.loadContent=function(t,s,i){var l=this,o=!1,a,d,n,r,g,h,u=function(t){for(var s=[],i=[],l=0;l<t.length;l++){var o=t[l].split(" ");""===o[0]&&o.splice(0,1),i.push(o[0]),s.push(o[1])}for(var a=$(e).width(),n=0;n<s.length;n++)if(parseInt(s[n],10)>a){d=i[n];break}};if(l.s.dynamic){if(l.s.dynamicEl[t].poster&&(o=!0,n=l.s.dynamicEl[t].poster),h=l.s.dynamicEl[t].html,d=l.s.dynamicEl[t].src,l.s.dynamicEl[t].responsive){var c=l.s.dynamicEl[t].responsive.split(",");u(c)}r=l.s.dynamicEl[t].srcset,g=l.s.dynamicEl[t].sizes}else{if(l.$items.eq(t).attr("data-poster")&&(o=!0,n=l.$items.eq(t).attr("data-poster")),h=l.$items.eq(t).attr("data-html"),d=l.$items.eq(t).attr("href")||l.$items.eq(t).attr("data-src"),l.$items.eq(t).attr("data-responsive")){var m=l.$items.eq(t).attr("data-responsive").split(",");u(m)}r=l.$items.eq(t).attr("data-srcset"),g=l.$items.eq(t).attr("data-sizes")}var p=!1;l.s.dynamic?l.s.dynamicEl[t].iframe&&(p=!0):"true"===l.$items.eq(t).attr("data-iframe")&&(p=!0);var f=l.isVideo(d,t);if(!l.$slide.eq(t).hasClass("lg-loaded")){if(p)l.$slide.eq(t).prepend('<div class="lg-video-cont" style="max-width:'+l.s.iframeMaxWidth+'"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="'+d+'"  allowfullscreen="true"></iframe></div></div>');else if(o){var v="";v=f&&f.youtube?"lg-has-youtube":f&&f.vimeo?"lg-has-vimeo":"lg-has-html5",l.$slide.eq(t).prepend('<div class="lg-video-cont '+v+' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="'+n+'" /></div></div>')}else f?(l.$slide.eq(t).prepend('<div class="lg-video-cont "><div class="lg-video"></div></div>'),l.$el.trigger("hasVideo.lg",[t,d,h])):l.$slide.eq(t).prepend('<div class="lg-img-wrap"><img class="lg-object lg-image" src="'+d+'" /></div>');if(l.$el.trigger("onAferAppendSlide.lg",[t]),a=l.$slide.eq(t).find(".lg-object"),g&&a.attr("sizes",g),r){a.attr("srcset",r);try{picturefill({elements:[a[0]]})}catch(y){console.error("Make sure you have included Picturefill version 2")}}".lg-sub-html"!==this.s.appendSubHtmlTo&&l.addHtml(t),l.$slide.eq(t).addClass("lg-loaded")}l.$slide.eq(t).find(".lg-object").on("load.lg error.lg",function(){var e=0;i&&!$("body").hasClass("lg-from-hash")&&(e=i),setTimeout(function(){l.$slide.eq(t).addClass("lg-complete"),l.$el.trigger("onSlideItemLoad.lg",[t,i||0])},e)}),f&&f.html5&&!o&&l.$slide.eq(t).addClass("lg-complete"),s===!0&&(l.$slide.eq(t).hasClass("lg-complete")?l.preload(t):l.$slide.eq(t).find(".lg-object").on("load.lg error.lg",function(){l.preload(t)}))},i.prototype.slide=function(e,t,s){var i=this.$outer.find(".lg-current").index(),l=this;if(!l.lGalleryOn||i!==e){var o=this.$slide.length,a=l.lGalleryOn?this.s.speed:0,d=!1,n=!1;if(!l.lgBusy){if(this.s.download){var r;r=l.s.dynamic?l.s.dynamicEl[e].downloadUrl!==!1&&(l.s.dynamicEl[e].downloadUrl||l.s.dynamicEl[e].src):"false"!==l.$items.eq(e).attr("data-download-url")&&(l.$items.eq(e).attr("data-download-url")||l.$items.eq(e).attr("href")||l.$items.eq(e).attr("data-src")),r?($("#lg-download").attr("href",r),l.$outer.removeClass("lg-hide-download")):l.$outer.addClass("lg-hide-download")}if(this.$el.trigger("onBeforeSlide.lg",[i,e,t,s]),l.lgBusy=!0,clearTimeout(l.hideBartimeout),".lg-sub-html"===this.s.appendSubHtmlTo&&setTimeout(function(){l.addHtml(e)},a),this.arrowDisable(e),t){var g=e-1,h=e+1;0===e&&i===o-1?(h=0,g=o-1):e===o-1&&0===i&&(h=0,g=o-1),this.$slide.removeClass("lg-prev-slide lg-current lg-next-slide"),l.$slide.eq(g).addClass("lg-prev-slide"),l.$slide.eq(h).addClass("lg-next-slide"),l.$slide.eq(e).addClass("lg-current")}else l.$outer.addClass("lg-no-trans"),this.$slide.removeClass("lg-prev-slide lg-next-slide"),i>e?(n=!0,0!==e||i!==o-1||s||(n=!1,d=!0)):e>i&&(d=!0,e!==o-1||0!==i||s||(n=!0,d=!1)),n?(this.$slide.eq(e).addClass("lg-prev-slide"),this.$slide.eq(i).addClass("lg-next-slide")):d&&(this.$slide.eq(e).addClass("lg-next-slide"),this.$slide.eq(i).addClass("lg-prev-slide")),setTimeout(function(){l.$slide.removeClass("lg-current"),l.$slide.eq(e).addClass("lg-current"),l.$outer.removeClass("lg-no-trans")},50);l.lGalleryOn?(setTimeout(function(){l.loadContent(e,!0,0)},this.s.speed+50),setTimeout(function(){l.lgBusy=!1,l.$el.trigger("onAfterSlide.lg",[i,e,t,s])},this.s.speed)):(l.loadContent(e,!0,l.s.backdropDuration),l.lgBusy=!1,l.$el.trigger("onAfterSlide.lg",[i,e,t,s])),l.lGalleryOn=!0,this.s.counter&&$("#lg-counter-current").text(e+1)}}},i.prototype.goToNextSlide=function(e){var t=this;t.lgBusy||(t.index+1<t.$slide.length?(t.index++,t.$el.trigger("onBeforeNextSlide.lg",[t.index]),t.slide(t.index,e,!1)):t.s.loop?(t.index=0,t.$el.trigger("onBeforeNextSlide.lg",[t.index]),t.slide(t.index,e,!1)):t.s.slideEndAnimatoin&&(t.$outer.addClass("lg-right-end"),setTimeout(function(){t.$outer.removeClass("lg-right-end")},400)))},i.prototype.goToPrevSlide=function(e){var t=this;t.lgBusy||(t.index>0?(t.index--,t.$el.trigger("onBeforePrevSlide.lg",[t.index,e]),t.slide(t.index,e,!1)):t.s.loop?(t.index=t.$items.length-1,t.$el.trigger("onBeforePrevSlide.lg",[t.index,e]),t.slide(t.index,e,!1)):t.s.slideEndAnimatoin&&(t.$outer.addClass("lg-left-end"),setTimeout(function(){t.$outer.removeClass("lg-left-end")},400)))},i.prototype.keyPress=function(){var t=this;this.$items.length>1&&$(e).on("keyup.lg",function(e){t.$items.length>1&&(37===e.keyCode&&(e.preventDefault(),t.goToPrevSlide()),39===e.keyCode&&(e.preventDefault(),t.goToNextSlide()))}),$(e).on("keydown.lg",function(e){t.s.escKey===!0&&27===e.keyCode&&(e.preventDefault(),t.$outer.hasClass("lg-thumb-open")?t.$outer.removeClass("lg-thumb-open"):t.destroy())})},i.prototype.arrow=function(){var e=this;this.$outer.find(".lg-prev").on("click.lg",function(){e.goToPrevSlide()}),this.$outer.find(".lg-next").on("click.lg",function(){e.goToNextSlide()})},i.prototype.arrowDisable=function(e){!this.s.loop&&this.s.hideControlOnEnd&&(e+1<this.$slide.length?this.$outer.find(".lg-next").removeAttr("disabled").removeClass("disabled"):this.$outer.find(".lg-next").attr("disabled","disabled").addClass("disabled"),e>0?this.$outer.find(".lg-prev").removeAttr("disabled").removeClass("disabled"):this.$outer.find(".lg-prev").attr("disabled","disabled").addClass("disabled"))},i.prototype.setTranslate=function(e,t,s){this.s.useLeft?e.css("left",t):e.css({transform:"translate3d("+t+"px, "+s+"px, 0px)"})},i.prototype.touchMove=function(e,t){var s=t-e;Math.abs(s)>15&&(this.$outer.addClass("lg-dragging"),this.setTranslate(this.$slide.eq(this.index),s,0),this.setTranslate($(".lg-prev-slide"),-this.$slide.eq(this.index).width()+s,0),this.setTranslate($(".lg-next-slide"),this.$slide.eq(this.index).width()+s,0))},i.prototype.touchEnd=function(e){var t=this;"lg-slide"!==t.s.mode&&t.$outer.addClass("lg-slide"),this.$slide.not(".lg-current, .lg-prev-slide, .lg-next-slide").css("opacity","0"),setTimeout(function(){t.$outer.removeClass("lg-dragging"),0>e&&Math.abs(e)>t.s.swipeThreshold?t.goToNextSlide(!0):e>0&&Math.abs(e)>t.s.swipeThreshold?t.goToPrevSlide(!0):Math.abs(e)<5&&t.$el.trigger("onSlideClick.lg"),t.$slide.removeAttr("style")}),setTimeout(function(){t.$outer.hasClass("lg-dragging")||"lg-slide"===t.s.mode||t.$outer.removeClass("lg-slide")},t.s.speed+100)},i.prototype.enableSwipe=function(){var e=this,t=0,s=0,i=!1;e.s.enableSwipe&&e.isTouch&&e.doCss()&&(e.$slide.on("touchstart.lg",function(s){e.$outer.hasClass("lg-zoomed")||e.lgBusy||(s.preventDefault(),e.manageSwipeClass(),t=s.originalEvent.targetTouches[0].pageX)}),e.$slide.on("touchmove.lg",function(l){e.$outer.hasClass("lg-zoomed")||(l.preventDefault(),s=l.originalEvent.targetTouches[0].pageX,e.touchMove(t,s),i=!0)}),e.$slide.on("touchend.lg",function(){e.$outer.hasClass("lg-zoomed")||(i?(i=!1,e.touchEnd(s-t)):e.$el.trigger("onSlideClick.lg"))}))},i.prototype.enableDrag=function(){var t=this,s=0,i=0,l=!1,o=!1;t.s.enableDrag&&!t.isTouch&&t.doCss()&&(t.$slide.on("mousedown.lg",function(e){t.$outer.hasClass("lg-zoomed")||($(e.target).hasClass("lg-object")||$(e.target).hasClass("lg-video-play"))&&(e.preventDefault(),t.lgBusy||(t.manageSwipeClass(),s=e.pageX,l=!0,t.$outer.scrollLeft+=1,t.$outer.scrollLeft-=1,t.$outer.removeClass("lg-grab").addClass("lg-grabbing"),t.$el.trigger("onDragstart.lg")))}),$(e).on("mousemove.lg",function(e){l&&(o=!0,i=e.pageX,t.touchMove(s,i),t.$el.trigger("onDragmove.lg"))}),$(e).on("mouseup.lg",function(e){o?(o=!1,t.touchEnd(i-s),t.$el.trigger("onDragend.lg")):($(e.target).hasClass("lg-object")||$(e.target).hasClass("lg-video-play"))&&t.$el.trigger("onSlideClick.lg"),l&&(l=!1,t.$outer.removeClass("lg-grabbing").addClass("lg-grab"))}))},i.prototype.manageSwipeClass=function(){var e=this.index+1,t=this.index-1,s=this.$slide.length;this.s.loop&&(0===this.index?t=s-1:this.index===s-1&&(e=0)),this.$slide.removeClass("lg-next-slide lg-prev-slide"),t>-1&&this.$slide.eq(t).addClass("lg-prev-slide"),this.$slide.eq(e).addClass("lg-next-slide")},i.prototype.mousewheel=function(){var e=this;e.$outer.on("mousewheel.lg",function(t){t.deltaY&&(t.deltaY>0?e.goToPrevSlide():e.goToNextSlide(),t.preventDefault())})},i.prototype.closeGallery=function(){var e=this,t=!1;this.$outer.find(".lg-close").on("click.lg",function(){e.destroy()}),e.s.closable&&(e.$outer.on("mousedown.lg",function(e){t=$(e.target).is(".lg-outer")||$(e.target).is(".lg-item ")||$(e.target).is(".lg-img-wrap")?!0:!1}),e.$outer.on("mouseup.lg",function(s){($(s.target).is(".lg-outer")||$(s.target).is(".lg-item ")||$(s.target).is(".lg-img-wrap")&&t)&&(e.$outer.hasClass("lg-dragging")||e.destroy())}))},i.prototype.destroy=function(t){var s=this;t||s.$el.trigger("onBeforeClose.lg"),$(e).scrollTop(s.prevScrollTop),t&&(s.s.dynamic||this.$items.off("click.lg click.lgcustom"),$.removeData(s.el,"lightGallery")),this.$el.off(".lg.tm"),$.each($.fn.lightGallery.modules,function(e){s.modules[e]&&s.modules[e].destroy()}),this.lGalleryOn=!1,clearTimeout(s.hideBartimeout),this.hideBartimeout=!1,$(e).off(".lg"),$("body").removeClass("lg-on lg-from-hash"),s.$outer&&s.$outer.removeClass("lg-visible"),$(".lg-backdrop").removeClass("in"),setTimeout(function(){s.$outer&&s.$outer.remove(),$(".lg-backdrop").remove(),t||s.$el.trigger("onCloseAfter.lg")},s.s.backdropDuration+50)},$.fn.lightGallery=function(e){return this.each(function(){if($.data(this,"lightGallery"))try{$(this).data("lightGallery").init()}catch(t){console.error("lightGallery has not initiated properly")}else $.data(this,"lightGallery",new i(this,e))})},$.fn.lightGallery.modules={}}(jQuery,window,document);