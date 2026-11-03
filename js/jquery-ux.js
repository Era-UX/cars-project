// jquery-ux.js - Assignment 6 (Tasks 4 & 5: UX Engagement Elements)
// Task 0: $(document).ready() setup check
$(document).ready(function () {
    console.log("jQuery is ready! (jquery-ux.js)");

    // ==========================================================
    // Task 4: Colorful and Stylized Scroll Progress Bar
    // ==========================================================
    $(window).on("scroll", function () {
        const scrollTop = $(window).scrollTop();
        const docHeight = $(document).height();
        const winHeight = $(window).height();
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;

        $("#scroll-progress-bar").css("width", Math.min(100, Math.max(0, scrollPercent)) + "%");
    });

    // ==========================================================
    // Task 5: Animated Number Counter
    // Counts up numbers smoothly when section is scrolled into view
    // ==========================================================
    let countersStarted = false;

    function runCounters() {
        $(".counter-value").each(function () {
            const $this = $(this);
            const target = parseInt($this.attr("data-target"), 10) || 0;

            $({ countNum: 0 }).animate(
                { countNum: target },
                {
                    duration: 1800,
                    easing: "swing",
                    step: function () {
                        $this.text(Math.floor(this.countNum));
                    },
                    complete: function () {
                        $this.text(this.countNum);
                    }
                }
            );
        });
    }

    function checkCounterVisibility() {
        const $statsSection = $("#stats-section");
        if (!$statsSection.length || countersStarted) {
            return;
        }

        const topOfWindow = $(window).scrollTop();
        const bottomOfWindow = topOfWindow + $(window).height();
        const sectionTop = $statsSection.offset().top;

        if (bottomOfWindow > sectionTop + 40) {
            countersStarted = true;
            runCounters();
        }
    }

    $(window).on("scroll", checkCounterVisibility);
    checkCounterVisibility();
});