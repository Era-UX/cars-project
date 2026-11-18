// jquery-search.js - Real-Time Search, Autocomplete for 8 Models & FAQ Highlighting
if (typeof window.jQuery !== "undefined") {
    $(document).ready(function () {
        console.log("jQuery is ready! (jquery-search.js)");

        const SEARCH_KEY = "autoworld_search_query";

        const suggestionsPool = [
            "Aurora S", "Echelon LX", "Trailblazer X", "Summit AWD",
            "Volt Pro", "Ionix GT-E", "Raptor GT", "Apex RS",
            "Dual Motor EV", "Long Range Tri-Motor EV", "2.0L Turbo",
            "2.5L Hybrid", "3.0L V6", "2.4L Turbo AWD", "4.0L V8", "3.8L Twin-Turbo",
            "Sedan", "SUV", "Electric", "Sports", "2025", "2026"
        ];

        const $searchInput = $("#model-search-input");
        const $autocompleteList = $("#autocomplete-list");
        const $clearSearchBtn = $("#clear-search-btn");
        const $noResultsAlert = $("#no-search-results");

        $(".filter-btn").on("click", function () {
            if ($searchInput.val().length > 0 && !$(this).data("triggeredBySearch")) {
                $searchInput.val("");
                localStorage.removeItem(SEARCH_KEY);
                $autocompleteList.hide();
                $noResultsAlert.hide();
            }
        });

        function performLiveFilter(query) {
            const cleanQuery = query.toLowerCase().trim();

            if (cleanQuery.length > 0) {
                const $allBtn = $(".filter-btn[data-filter='All']");
                if ($allBtn.length && !$allBtn.hasClass("btn-danger")) {
                    $allBtn.data("triggeredBySearch", true).trigger("click").data("triggeredBySearch", false);
                }
            }

            let visibleCards = 0;

            $("#catalog-grid > div").each(function () {
                const cardText = $(this).text().toLowerCase();
                if (cardText.indexOf(cleanQuery) > -1) {
                    $(this).stop(true, true).fadeIn(200);
                    visibleCards++;
                } else {
                    $(this).stop(true, true).fadeOut(200);
                }
            });

            if (cleanQuery.length > 0 && visibleCards === 0) {
                $noResultsAlert.fadeIn(150);
            } else {
                $noResultsAlert.hide();
            }

            $(".catalog-table tbody tr").each(function () {
                const rowText = $(this).text().toLowerCase();
                if (rowText.indexOf(cleanQuery) > -1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }

        $searchInput.on("keyup", function () {
            const val = $(this).val();
            localStorage.setItem(SEARCH_KEY, val);
            performLiveFilter(val);
            handleAutocomplete(val);
        });

        $clearSearchBtn.on("click", function () {
            $searchInput.val("");
            localStorage.removeItem(SEARCH_KEY);
            $autocompleteList.hide();
            $noResultsAlert.hide();
            $(".filter-btn[data-filter='All']").trigger("click");
            performLiveFilter("");
        });

        function handleAutocomplete(val) {
            const cleanVal = val.trim().toLowerCase();
            $autocompleteList.empty();

            if (cleanVal.length === 0) {
                $autocompleteList.hide();
                return;
            }

            const matches = suggestionsPool.filter(function (item) {
                return item.toLowerCase().indexOf(cleanVal) > -1;
            });

            if (matches.length === 0) {
                $autocompleteList.hide();
                return;
            }

            matches.forEach(function (match) {
                const $item = $("<div></div>")
                    .addClass("autocomplete-item")
                    .text(match);

                $item.on("click", function () {
                    $searchInput.val(match);
                    localStorage.setItem(SEARCH_KEY, match);
                    $autocompleteList.hide();
                    performLiveFilter(match);
                });

                $autocompleteList.append($item);
            });

            $autocompleteList.slideDown(150);
        }

        $(document).on("click", function (event) {
            if (!$(event.target).closest(".search-wrapper").length) {
                $autocompleteList.hide();
            }
        });

        const urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.get("category")) {
            const savedSearch = localStorage.getItem(SEARCH_KEY);
            if (savedSearch && $searchInput.length) {
                $searchInput.val(savedSearch);
                performLiveFilter(savedSearch);
            }
        }

        const $faqSearchInput = $("#faq-search-input");

        $(".faq-item").each(function () {
            const $questionText = $(this).find(".faq-question span:first-child");
            const $answerText = $(this).find(".faq-answer p");

            $questionText.data("original-text", $questionText.text());
            $answerText.data("original-text", $answerText.text());
        });

        $faqSearchInput.on("keyup", function () {
            const query = $(this).val().trim();

            $(".faq-item").each(function () {
                const $item = $(this);
                const $questionSpan = $item.find(".faq-question span:first-child");
                const $answerP = $item.find(".faq-answer p");

                const origQ = $questionSpan.data("original-text");
                const origA = $answerP.data("original-text");

                if (!query) {
                    $questionSpan.text(origQ);
                    $answerP.text(origA);
                    $item.show();
                    return;
                }

                const safeQuery = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
                const regex = new RegExp("(" + safeQuery + ")", "gi");
                let matched = false;

                if (regex.test(origQ)) {
                    $questionSpan.html(origQ.replace(regex, '<mark class="search-highlight">$1</mark>'));
                    matched = true;
                } else {
                    $questionSpan.text(origQ);
                }

                if (regex.test(origA)) {
                    $answerP.html(origA.replace(regex, '<mark class="search-highlight">$1</mark>'));
                    matched = true;
                } else {
                    $answerP.text(origA);
                }

                if (matched) {
                    $item.fadeIn(150);
                } else {
                    $item.fadeOut(150);
                }
            });
        });
    });
}