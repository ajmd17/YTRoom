$(window).resize(function() {
    resizeContent();
});

$(window).on('orientationchange', function() {
    // remove sidebar
    if ($('.sidebar').hasClass('opened')) {
        // re-show content incase it was hidden
        $('#content').show();
        $('.sidebar').removeClass('opened');
        $('.sidebar-panel').css({ 'width': '0', 'display': 'none' });
    }
    resizeContent();
});

// bind sidebar expand events
$(document).ready(function() {
    resizeContent();

    $('#btn-chat').click(function() {
        // on mobile displays, take up entire width
        if (window.innerWidth <= 600) {
            $('#content').hide();
        }

        $('#sidebar-title').text('Chat');
        $('.sidebar').addClass('opened');
        $('#chat-messages').css({ 'width': '100%', 'display': 'block' });

        resizeContent();
    });

    $('#btn-queue').click(function() {
        // on mobile displays, take up entire width
        if (window.innerWidth <= 600) {
            $('#content').hide();
        }

        $('#sidebar-title').text('Queue');
        $('.sidebar').addClass('opened');
        $('#video-queue').css({ 'width': '100%', 'display': 'block' });
        $('#add-to-queue-btn').show();

        resizeContent();
    });

    $('#btn-watchers').click(function() {
        // on mobile displays, take up entire width
        if (window.innerWidth <= 600) {
            $('#content').hide();
        }

        $('#sidebar-title').text('Watchers');
        $('.sidebar').addClass('opened');
        $('#watchers-list').css({ 'width': '100%', 'display': 'block' });

        resizeContent();
    });

    $('#hide-sidebar').click(function() {
        $('.sidebar').removeClass('opened');
        $('.sidebar-panel').css({ 'width': '0', 'display': 'none' });
        $('#add-to-queue-btn').hide();
        $('#content').show();

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
    var playerWidth = screen.width > 600 ? window.innerWidth : screen.width;// > 600 ? windowWidth : windowWidth / 2;
    var playerHeight = screen.width > 600 ? window.innerHeight : screen.height;// > 600 ? windowWidth : windowWidth / 2;
    var openedWidth = window.innerWidth > 600 ? 320 : window.innerWidth /*full width*/;
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
