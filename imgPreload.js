(function() {
  (function($) {
    return $.fn.imgPreload = function(options) {
      var delay_completion, i, image_stack, placeholder_stack, replace, settings, spinner_stack, src, x, _i, _len;
      settings = {
        delay: 2000,
        animation_duration: 1000
      };
      if (options) {
        $.extend(settings, options);
      }
      image_stack = [];
      placeholder_stack = [];
      spinner_stack = [];
      window.delay_completed = false;
      delay_completion = function() {
        var x, _i, _len, _results;
        window.delay_completed = true;
        _results = [];
        for (_i = 0, _len = image_stack.length; _i < _len; _i++) {
          x = image_stack[_i];
          _results.push($(x).attr('load-after-delay') === 'true' ? (replace(x), $(x).attr('load-after-delay', false)) : void 0);
        }
        return _results;
      };
      setTimeout(delay_completion, settings.delay);
      this.each(function() {
        var $image, $placeholder, $spinner_img;
        $image = $(this);
        $spinner_img = $('<img>');
        $placeholder = $('<img>').attr({
          src: 'data:image/gif;base64,R0lGODlhAQABA\
                IABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
        });
        $placeholder.attr({
          width: $image.attr('width')
        });
        $placeholder.attr({
          height: $image.attr('height')
        });
        spinner_stack.push($spinner_img);
        placeholder_stack.push($placeholder);
        image_stack.push($image.replaceWith($placeholder));
        $('body').append($spinner_img);
        $spinner_img.css({
          position: 'absolute'
        });
        $spinner_img.css('z-index', 9999);
        $spinner_img.load(function() {
          $(this).css({
            left: ($placeholder.offset().left + $placeholder.width() / 2) - $(this).width() / 2
          });
          return $(this).css({
            top: ($placeholder.offset().top + $placeholder.height() / 2) - $(this).height() / 2
          });
        });
        return $spinner_img.attr({
          src: 'loader.gif'
        });
      });
      i = 0;
      for (_i = 0, _len = image_stack.length; _i < _len; _i++) {
        x = image_stack[_i];
        x.attr({
          no: i++
        });
        src = x.attr('src');
        x.attr({
          src: null
        });
        x.load(function() {
          if (window.delay_completed) {
            return replace(this);
          } else {
            return $(this).attr('load-after-delay', true);
          }
        });
        x.attr({
          src: src
        });
      }
      return replace = function(image) {
        var $image, no_;
        $image = $(image);
        no_ = $image.attr('no');
        placeholder_stack[no_].replaceWith($image);
        spinner_stack[no_].fadeOut(settings.animation_duration / 2);
        return $image.fadeOut(0).fadeIn(settings.animation_duration);
      };
    };
  })(jQuery);
}).call(this);
