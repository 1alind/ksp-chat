$(document).ready(function () {
    var online = 'no';
    var pt = null;

    function banner(m, s, x, t) {
        let b = $("#banner");
        let v = b.is(":visible");
        if (s == "s") {
            if (v) {
                if (pt !== t) {
                    pt = t;
                    b.slideUp(1000, () => {
                        b.html(m).slideDown(1000);
                        rmbanner(x);
                    });
                }
            } else {
                b.html(m).slideDown(1000);
                rmbanner(x);
            }
        } else {
            b.slideUp(1000);
        }
    }

    function rmbanner(x) {
        setTimeout(function () {
            if ($("#banner").is(":visible")) {
                $("#banner").slideUp(1000);
            }
        }, x);
    }


    $.ajaxSetup({
        timeout: 2000
    });

    $("#sndbtn").click(() => {
        if (online == 'yes') {
            dbtn("#sndbtn", true, 1);
            let m = $("#input-message").val();
            if (m.length < 1) {
                $("#input-message").val("");
                dbtn("#sndbtn", false, 500);
                return;
            }
            let d = "msg=" + encodeURIComponent(m);
            $.post("/sendmsg", d, (res) => {
                if (res == "saved") {
                    rmbanner(100);
                    $("#input-message").val("");

                    dbtn("#sndbtn", false, 3000);

                } else if (res == "nice try ;)") {
                    $("#input-message").val("");
                    banner("nice try ;)", 's', 3000, 'n');

                    dbtn("#sndbtn", false, 3000);

                } else {
                    banner("error sending message.", 's', 3000, 'u');

                    dbtn("#sndbtn", false, 5000);
                    banner("waiting", "h");

                }
            });
        }
    });

    function fetchMessages() {
        if (online == 'yes') {
            let t = $("#loadtime").html();
            $("#loadtime").html(Date.now());
            $.get("/getmsgs", {
                t: t
            }, async (d) => {
                if (d.substring(0, 2) == "ok") {
                    rmbanner(100);
                    if (d !== 'ok') {
                        $('#chat-box').append(d.substring(2, d.length));
                    }
                } else {
                    alert(d);
                    banner("unknown error", 's', 3000, 'u');
                }
            });
        }
    }
    setInterval(fetchMessages, 3100);

    setTimeout(() => {
        $.get("/getsuer", (res) => {
            if (res == "done") {
                rmbanner(100);
                const room = getCookie("r");
                const user = getCookie('u');
                $("#roomValue").html("Room: " + room);
                $("#userValue").html("KSP: " + user);
            }
        });
    }, 1000);

    function getCookie(name) {
        const cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return null;
    }



    var chat = $("#chat-box");
    var chatHeight = chat.innerHeight();

    function autoScroll() {
        if (!chat[0].noScroll) {
            chat.stop().animate({
                scrollTop: chat[0].scrollHeight - chatHeight
            }, 400);
        }
    }

    chat.hover(function () {
        return this.noScroll ^= 1;
    });

    chat.scrollTop(chat[0].scrollHeight);

    setInterval(autoScroll, 300);


    if (document.cookie && document.cookie.includes("warn=yes")) {
        $("#warning-overlay").hide();
    }
    $("#hidewarning").on("click", () => {
        $("#warning-overlay").slideUp();
        document.cookie = "warn=yes; expires=21600; path=/";
    });

    function dbtn(b, s, x) {
        setTimeout(function () {
            $(b).prop("disabled", s);
        }, x);

    }



    function on() {
        $.ajax({
            url: '/online',
            method: 'GET',
            dataType: 'text',
            timeout: 500,
            success: function (d) {
                if (d == "online") {
                    online = 'yes';
                    banner("offline", 'h');
                } else {
                    banner("server error", 's', 10000000, "s");
                    online = 'no';
                }
            },
            error: function (xhr, status, error) {
                if (xhr.status == 0) {
                    online = 'no';
                    banner("offline", 's', 10000000, "o");
                } else if (xhr.status < 600 && xhr.status > 500) {
                    online = 'no';
                    banner("server error", 's', 10000000, "s");
                } else {
                    online = yes;
                    banner("offline", 'h');
                }
            }
        });
    }

    setInterval(on, 700);



});