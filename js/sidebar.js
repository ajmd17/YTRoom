$(window).resize(function() { 
    resizeChat();
    resizeContent();
});

// bind sidebar expand events
$(document).ready(function() {

    resizeChat();
    resizeContent();

    $("#btn-chat").click(function() {
        $("#sidebar-title").text("Chat");
        $(".sidebar").addClass("opened");
        $("#chat-messages").css({ "width": "100%", "display": "block" });

        resizeContent();
    });
    $("#btn-queue").click(function() {
        $("#sidebar-title").text("Queue");
        $(".sidebar").addClass("opened");
        $("#video-queue").css({ "width": "100%", "display": "block" });

        resizeContent();
    });

    $("#hide-sidebar").click(function() {
        let windowWidth = window.innerWidth;
        let openedWidth = windowWidth > 600 ? 320 : 160;
        
        $(".sidebar").removeClass("opened");
        $(".sidebar-panel").css({ "width": "0", "display": "none" });

        resizeContent();
    });
});

function resizeChat() {
    let windowHeight = window.innerHeight;
    let maxHeight = (windowHeight - 250).toString() + "px";
    $("#chat-items").css({ "max-height": maxHeight });
    $("#chat-items").css({ "height": maxHeight });
}

function resizeContent() {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let maxHeight = (windowHeight - $("header").height().toString()) + "px";
    $("#sidebar-wrapper").css({ "height": maxHeight });
    $("#content").css({ "height": maxHeight });

    let playerWidth = windowWidth > 600 ? windowWidth : windowWidth / 2;
    let openedWidth = windowWidth > 600 ? 320 : 160;
    let closedWidth = 60;

    if ($(".sidebar").hasClass("opened")) {
        $("#sidebar-wrapper").css({ "width": openedWidth.toString() + "px" });
        $("#content").css({ "margin-left": openedWidth.toString() + "px" });
        $("#content").css({ "width": (playerWidth - openedWidth).toString() + "px" });
    } else {
        $("#sidebar-wrapper").css({ "width": closedWidth.toString() + "px" });
        $("#content").css({ "margin-left": closedWidth.toString() + "px" });
        $("#content").css({ "width": (playerWidth - closedWidth).toString() + "px" });
    }
}