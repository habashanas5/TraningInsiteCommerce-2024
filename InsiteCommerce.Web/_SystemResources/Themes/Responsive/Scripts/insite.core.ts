﻿(insite as any).core = (($: any) => {
    "use strict";

    const that: any = {};

    that.signInUrl = "/RedirectTo/SignInPage";
    that.dateTimeFormat = "";
    that.generalErrorText = "";
    that.uriHostsForResourceWhitelist = [];
    that.searchPath = "Search";

    that.displayModal = (html, onClose) => {
        const $html = $(html);
        if ($html.parents("body").length === 0) {
            $html.appendTo($("body"));
        }

        $html.foundation("reveal", "open");
        $(document).on("closed", $html, () => {
            $html.remove();
            if (typeof onClose === "function") {
                onClose();
            }
        });
    };

    that.closeModal = $modal => {
        $modal.find(".close-reveal-modal").click();
    };

    that.isCustomErrorEnabled = () => ($("html").attr("data-isCustomErrorEnabled").toLowerCase() === "true");

    that.datepicker = (selector, onCloseCallback, onSetCallback) => {
        if (typeof (selector) === "string") {
            selector = $(selector);
        }

        selector.each(function () {
            if (that.dateTimeFormat === "") {
                console.log("insite.core.dateTimeFormat has not been initialized to the format expected by the server");
                return;
            }
            const $this = $(this);
            $this.pickadate({
                format: that.dateTimeFormat.toLowerCase(),
                formatSubmit: that.dateTimeFormat.toLowerCase(),
                selectYears: true,
                onOpen() {
                    $this.blur();
                },
                onClose() {
                    $this.blur();
                    if (typeof (onCloseCallback) === "function") {
                        onCloseCallback();
                    }
                },
                onSet() {
                    if (typeof (onSetCallback) === "function") {
                        onSetCallback();
                    }
                },
                min: that.pickadateMinMax($this.attr("data-minDate")),
                max: that.pickadateMinMax($this.attr("data-maxDate"))
            });
        });
    };

    that.pickadateMinMax = data => {
        // pickadate allows min/max values of undefined, int (ie. 30 days), or a date which should be passed in according to javascript "new Date()" documentation
        if (typeof data === "undefined") {
            return data;
        }
        return isNaN(data) ? new Date(data) : Number(data);
    };

    that.timepicker = selector => {
        if (typeof (selector) === "string") {
            selector = $(selector);
        }

        let options = {} as any;

        try {
            if (window.sessionStorage.getItem("allowEditableTimes")) {
                options.editable = true
            }
        }
        catch(ex) {
            console.log(ex);
        }

        selector.pickatime(options);
    };

    that.setupAjaxError = (onClose, on401) => {
        $(document).ajaxError((e, jqxhr, settings) => {
            if (settings.error) { // for ajax calls that already have an error function defined, we don't want to show the error below
                return;
            }
            if (jqxhr.status === 401) { // for ajax requests after the login has expired, this will redirect to the login page with the proper return url
                if (typeof (on401) === "function") {
                    on401();
                } else {
                    window.location.href = window.location.href;
                }
            } else {
                if (jqxhr.status >= 500 && jqxhr.responseText !== "") {
                    if (!that.isCustomErrorEnabled()) {
                        const width = $(window).width() - 120;
                        if (typeof ($.modal) !== "undefined") {
                            $.modal.close();
                        }
                        that.displayModal(`<div class='reveal-modal cms-modal' style='width: ${width}px' data-reveal><button class='simplemodal-close button' style='float: right;'>X</button><div class='modal-wrap'><iframe id='errorFrame' style='width: 100%; height: 800px;'></iframe><a class='close-reveal-modal'>&#215;</a></div></div>`, onClose);
                        const iframeDocument = (document.getElementById("errorFrame") as any).contentWindow.document;
                        iframeDocument.open();
                        iframeDocument.write(jqxhr.responseText);
                        iframeDocument.close();
                    } else {
                        alert((insite as any).core.generalErrorText);
                    }
                }
            }
        });
    };

    that.setup = () => {
        $.ajaxSetup({
            type: "POST",
            cache: false
        });

        // validate that entry in all numeric text boxes is a number - put the class numerictextbox on all quantity inputs
        $(document).on("keydown", ".numerictextbox", event => {
            let inputIsNumeric = false;

            // ignore the shift keydown event, the actual key pressed with shift issues another event when it is pressed
            if (event.keyCode === 16) {
                return;
            }

            // this works for qwerty and azerty keyboard layouts (azerty you have to hit the Shift key to press a number)
            if (event.key !== undefined) {
                const allowedNonNumericKeys = ["Delete", "Backspace", "Enter", "Tab", "ArrowRight", "ArrowLeft"];
                const allowedNumericKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ",", "."];
                if (allowedNonNumericKeys.indexOf(event.key) >= 0) {
                    // let it happen, don't do anything
                } else if (allowedNumericKeys.indexOf(event.key) >= 0) {
                    inputIsNumeric = true;
                } else {
                    event.preventDefault();
                }
            }

            // allow 6 numbers above 0 and 5 decimal places
            // in the future we probably need to setup better validation after input with messaging, etc
            if (inputIsNumeric) {
                const input = [event.currentTarget.value.slice(0, event.currentTarget.selectionStart), event.key, event.currentTarget.value.slice(event.currentTarget.selectionStart)].join("");
                if (!/^\d{0,6}(\.\d{0,5})?$/.test(input) && !/^\d{0,6}(\,\d{0,5})?$/.test(input)) {
                    event.preventDefault();
                }
            }
        });

        // Select text inside text box for all Quantity
        // Add this behavior to all text fields
        $("input:text.qty").focus(function () {
            // Select field contents
            this.select();
        });

        that.setupAjaxError();
    };

    // From the Foundation 4 to 5, the section functionality was removed
    // this code emulates the functionality.
    $("body").on("click", ".section-container .title", function () {
        const $this = $(this);
        const $thisParent = $this.closest("section");

        if ($thisParent.hasClass("active")) {
            $thisParent.removeClass("active");
        } else {
            $thisParent.addClass("active");
        }
    });

    return that;
})(jQuery);