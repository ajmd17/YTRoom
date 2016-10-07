// bind sidebar expand events
$(document).ready(function() {
    const closedWidth = "60px";

    $("#btn-chat").click(function() {
        let windowWidth = window.innerWidth;
        let openedWidth = windowWidth > 600 ? "320px" : "160px";

        $("#sidebar-title").text("Chat");
        $(".sidebar").addClass("opened");
        $("#chat-messages").css({ "width": "100%", "display": "block" });

        $("#sidebar-wrapper").css({ "width": openedWidth });
        $("#content").css({ "margin-left": openedWidth });
    });
    $("#btn-queue").click(function() {
        let windowWidth = window.innerWidth;
        let openedWidth = windowWidth > 600 ? "320px" : "160px";

        $("#sidebar-title").text("Queue");
        $(".sidebar").addClass("opened");
        $("#video-queue").css({ "width": "100%", "display": "block" });

        $("#sidebar-wrapper").css({ "width": openedWidth });
        $("#content").css({ "margin-left": openedWidth });
    });

    $("#hide-sidebar").click(function() {
        let windowWidth = window.innerWidth;
        let openedWidth = windowWidth > 600 ? "320px" : "160px";
        
        $(".sidebar").removeClass("opened");
        $(".sidebar-panel").css({ "width": "0", "display": "none" });

        $("#sidebar-wrapper").css({ "width": closedWidth });
        $("#content").css({ "margin-left": closedWidth });
    });
});