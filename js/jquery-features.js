// jquery-features.js - Assignment 6 (Tasks 8 & 9: Clipboard Copy & Lazy Loading)
$(document).ready(function () {
    console.log("jQuery is ready! (jquery-features.js)");

    // ==========================================================
    // Task 8: Copied to Clipboard Button (With dynamic translations)
    // ==========================================================
    $(".copy-btn").on("click", function () {
        const $btn = $(this);
        const targetSelector = $btn.attr("data-copy-target");
        const textToCopy = $(targetSelector).text().trim();

        if (!textToCopy) return;

        // Pull active language translations set by language.js, fallback to English
        const langPack = window.currentAppLangPack || {
            btnCopied: "Copied!",
            toastCopyTitle: "Clipboard",
            toastCopyBody: "copied to your clipboard!"
        };

        navigator.clipboard.writeText(textToCopy).then(function () {
            const originalHtml = $btn.html();

            // Translate the "Copied!" checkmark text dynamically
            $btn.html('&#10003; ' + langPack.btnCopied)
                .removeClass("btn-outline-danger")
                .addClass("btn-success");

            // Translate the Toast popup Title and Message dynamically
            if (typeof window.showAppToast === "function") {
                const toastMessage = '"' + textToCopy + '" ' + langPack.toastCopyBody;
                window.showAppToast(toastMessage, langPack.toastCopyTitle);
            }

            setTimeout(function () {
                $btn.html(originalHtml)
                    .removeClass("btn-success")
                    .addClass("btn-outline-danger");
            }, 2000);
        });
    });

    // ==========================================================
    // Task 9: Image Lazy Loading (using native jQuery offset)
    // ==========================================================
    function lazyLoadImages() {
        const winTop = $(window).scrollTop();
        const winBottom = winTop + $(window).height();

        $(".lazy-img").each(function () {
            const $img = $(this);
            const dataSrc = $img.attr("data-src");

            if (!dataSrc) return;

            const imgTop = $img.offset().top;

            if (imgTop <= winBottom + 120) {
                $img.attr("src", dataSrc)
                    .removeAttr("data-src")
                    .on("load", function () {
                        $(this).addClass("loaded");
                    });
            }
        });
    }

    $(window).on("scroll", lazyLoadImages);
    lazyLoadImages(); // Run on load in case images are already visible
});