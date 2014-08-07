define([
    './os',
    './event',
    './spinner'
],function(){
    /*
    * ios7 style Editor 
    * by gctang
    */
    var showClass = 'js-show';

     var tapEvent = 'tap';

    if($.os.ios < 5){
        tapEvent = "click";
    }

    var tapDialogEventName = tapEvent + '.editor';

    function Editor($element, options){
        this.$element = $element;
        this.options  = options;

        //placeholder 显示最多文字
        this.MAX_DEFAULT_LENGTH  = options.MAX_DEFAULT_LENGTH || 14;
        this.textEl = $('.content', this.$element);
        this.defaultWords = this.options.content || this.textEl.attr("placeholder") || '';
    }
   
    Editor.DEFAULTS = {
        backdrop: true,
        show: true,
        enterText: "发表",
        cancelText: "取消"
    };

    Editor.prototype.toggle = function(){
        this[!this.isShown ? 'show' : 'hide']();
    };

    Editor.prototype.render = function() {
       
        // 安卓下placeholder文字过长，展示不了
        var that = this;
        if (this.isLongwords || this.defaultWords.length > this.MAX_DEFAULT_LENGTH) {
            this.isLongwords = true;

            // 默认文字样式修改
            this.textEl
                .attr("placeholder", "")
                .val(this.defaultWords)
                .css("color", "#BBB")
                .focus(function() {
                    if ($(this).val() == that.defaultWords) {
                        $(this).val('');
                        $(this).css("color", "#000");
                    }
                })
                .blur(function() {
                    if ($(this).val() == '') {
                        $(this).val(that.defaultWords);
                        $(this).css("color", "#BBB");
                    }
                });
        }else{

            // 默认提示文字
            this.options.content && this.textEl.attr("placeholder", this.options.content);
        }

        // 按钮文字,有传文字或节点没写内容
        if(this.options.enterText || $('[cmd="enter"]', this.$element).text().trim() == ''){
            $('[cmd="enter"]', this.$element).text(this.options.enterText || Editor.DEFAULTS.enterText);
        }

        if(this.options.cancelText || $('[cmd="cancel"]', this.$element).text().trim() == ''){
            $('[cmd="cancel"]', this.$element).text(this.options.cancelText || Editor.DEFAULTS.cancelText);
        }
    };
    
    Editor.prototype.show = function(){
        var that = this;

        this.render();

        $(document).on('touchmove.dialog', function(e){
            e.preventDefault();
        });

        this.$element[0].offsetWidth; // force reflow

        this.$element
            .addClass(showClass)
            .attr('aria-hidden', false)
            .on( tapDialogEventName, '[cmd]', function(e){
                var $target = $(e.currentTarget);

                if($target.data("dismiss")) that.hide();

                var cmd = $target.attr("cmd");
                typeof that.options[cmd] == "function" && that.options[cmd]();
            });

       /* setTimeout(function(){ */
            /* that.textEl[0].focus(); */
       /* },800) */
        

    };

    Editor.prototype.hide = function(){
        $(document).off('touchmove.dialog');
        
        this.$element
            .removeClass(showClass)
            .attr('aria-hidden', true)
            .off(tapDialogEventName);

        this.textEl.val('');
        this.textEl[0].blur();
    };


    $.Editor = Editor;

    $.fn.editor = function (option){
         return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('editor');

            if (!data) {
                var options = $.extend({}, Editor.DEFAULTS, $this.data(), typeof option == 'object' && option);

                data = new Editor($this, options);
                $this.data('editor', data);
            }

            if (typeof option == 'string') {
                data[option]();
            }else if (option.show){
                data.show();
            } 
        })
    };

});
