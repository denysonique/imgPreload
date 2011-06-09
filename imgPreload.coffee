(($) ->
    $.fn.imgPreload = (options)->
        
        settings =
            fake_delay: 10
            animation_duration: 1000
            spinner_src: 'spinner.gif'

        $.extend(settings, options) if options

        image_stack        = [] #stack of images to be preloaded
        placeholder_stack  = [] #stack of placeholder images
        spinner_stack      = []

        window.delay_completed = false
        delay_completion = ->
            window.delay_completed = true
            for x in image_stack
                if $(x).attr('data-load-after-delay') is 'true'
                    replace x
                    $(x).removeAttr('data-load-after-delay')

        setTimeout delay_completion, settings.fake_delay
            
        @each ->
            $image = $(this)
            #we need to save the offset, as after replaceWith() something weird happens
            #when a page is using some particular layouts
            offset_top = $image.offset().top
            offset_left = $image.offset().left

            $spinner_img = $('<img>')#.attr src: 'loader.gif'
            $placeholder = $('<img>').attr src: 'data:image/gif;base64,R0lGODlhAQABA
                IABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
            $placeholder.attr width: $image.attr('width')
            $placeholder.attr height: $image.attr('height')



            spinner_stack.push $spinner_img
            placeholder_stack.push $placeholder

            image_stack.push $image.replaceWith($placeholder)

            $('body').append $spinner_img
            $spinner_img.css position: 'absolute'
            $spinner_img.css 'z-index', 9999
            $spinner_img.load -> #place the spinner at the centre of the preloaded image

                $(this).css left: (offset_left +
                    $placeholder.width() / 2) - $(this).width() / 2
                $(this).css top: (offset_top +
                    $placeholder.height() / 2) - $(this).height() / 2
            $spinner_img.attr src: settings.spinner_src


        i = 0
        for x in image_stack
            x.attr no: i++

            src = x.attr 'src'
            x.attr src: '' #win need to unload the images, IE...
            
            x.load ->
                if window.delay_completed
                    replace this
                    
                else
                    $(@).attr 'data-load-after-delay', true

            x.attr src: src #put the src back

        #replace the loader image with the loaded image

        replace = (image) ->
            $image = $(image)
            no_ = $image.attr 'no'
            placeholder_stack[no_].replaceWith($image)
            spinner_stack[no_].fadeOut(settings.animation_duration / 2, -> $(@).remove())
            
            $image.fadeOut(0).fadeIn settings.animation_duration

        return this
    
)(jQuery) 
