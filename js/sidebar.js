

// bind sidebar expand events
$(document).ready(function() {
    $(window).resize(function() {
        resizeContent();
    });

    $(window).on('orientationchange', function() {
        var $sidebar = $('.sidebar');
        // remove sidebar
        if ($sidebar.hasClass('opened')) {
            // re-show content incase it was hidden
            $sidebar.removeClass('opened');
            $('#content').show();
            $('.sidebar-panel').css({ 
                'width': '0', 
                'display': 'none'
            });
        }
        resizeContent();
    });

    // resize content straight away
    resizeContent();

    $('#btn-chat').click(function() {
        // on mobile displays, take up entire width
        if (window.innerWidth <= 600) {
            $('#content').hide();
        }

        $('.sidebar').addClass('opened');
        $('#sidebar-title').text('Chat');
        $('#chat-messages').css({ 
            'width': '100%', 
            'display': 'block'
        });

        resizeContent();
    });

    $('#btn-queue').click(function() {
        // on mobile displays, take up entire width
        if (window.innerWidth <= 600) {
            $('#content').hide();
        }

        $('.sidebar').addClass('opened');
        $('#sidebar-title').text('Queue');
        $('#add-to-queue-btn').show();
        $('#video-queue').css({ 
            'width': '100%', 
            'display': 'block'
        });

        resizeContent();
    });

    $('#btn-watchers').click(function() {
        // on mobile displays, take up entire width
        if (window.innerWidth <= 600) {
            $('#content').hide();
        }

        $('.sidebar').addClass('opened');
        $('#sidebar-title').text('Watchers');
        $('#watchers-list').css({ 
            'width': '100%', 
            'display': 'block' 
        });

        resizeContent();
    });

    $('#hide-sidebar').click(function() {
        $('.sidebar').removeClass('opened');
        $('#add-to-queue-btn').hide();
        $('#content').show();
        $('.sidebar-panel').css({ 
            'width': '0', 
            'display': 'none'
        });

        resizeContent();
    });
});

function resizeChat() {
    var windowHeight = window.innerHeight;
    var maxHeight = (windowHeight - 210).toString() + 'px';
    $('#chat-items').css({ 'max-height': maxHeight, 'height': maxHeight });
}

function resizeContent() {
    resizeChat();

    // for mobile devices, resize according to screen size.
    // for desktop devices, use browser window size.
    var playerWidth = (screen.width > 600) ? window.innerWidth : screen.width;
    var playerHeight = (screen.width > 600) ? window.innerHeight : screen.height;
    var openedWidth = (window.innerWidth > 600) ? 320 : window.innerWidth;
    var closedWidth = 60;

    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var maxHeight = (windowHeight - $('nav').height()).toString() + 'px';

    var $content = $('#content');
    var $sidebarWrapper = $('#sidebar-wrapper');

    $sidebarWrapper.css({ 'height': maxHeight });
    $content.css({ 'height': maxHeight });

    if ($('.sidebar').hasClass('opened')) {
        if (window.innerWidth > 600) {
            // re-show content incase it was hidden
            $content.show();
        } else {
            $content.hide();
        }

        $sidebarWrapper.css({ 'width': openedWidth.toString() + 'px' });
        $content.css({ 'margin-left': openedWidth.toString() + 'px' });
        $content.css({ 'width': (playerWidth - openedWidth).toString() + 'px' });
    } else {
        $sidebarWrapper.css({ 'width': closedWidth.toString() + 'px' });
        $content.css({ 'margin-left': closedWidth.toString() + 'px' });
        $content.css({ 'width': (playerWidth - closedWidth).toString() + 'px' });
    }
}
