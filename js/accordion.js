// accordion.js - Task 2: FAQ accordion (Models page)
//
// 1. JavaScript hides every answer when the page loads (max-height = 0).
// 2. Clicking a question opens its answer (max-height = the real height of the content).
// 3. Clicking the same question again hides the answer.
// The smooth sliding comes from "transition: max-height" on .faq-answer in style.css.

document.addEventListener("DOMContentLoaded", function () {
    const questions = document.querySelectorAll(".faq-question");

    // Stop if there is no FAQ on this page
    if (questions.length === 0) {
        return;
    }

    // Hide all answers by default
    questions.forEach(function (question) {
        const answer = question.nextElementSibling; // the answer div is right after the button
        answer.style.maxHeight = "0px";
    });

    // Open or close an answer when its question is clicked
    questions.forEach(function (question) {
        question.addEventListener("click", function () {
            const answer = question.nextElementSibling;
            const icon = question.querySelector(".faq-icon");
            const isOpen = question.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                answer.style.maxHeight = "0px";
                question.setAttribute("aria-expanded", "false");
                icon.textContent = "+";
            } else {
                // scrollHeight = the full height of the content, even when it is hidden
                answer.style.maxHeight = answer.scrollHeight + "px";
                question.setAttribute("aria-expanded", "true");
                icon.textContent = "\u2212"; // minus sign
            }
        });
    });

    // If the window is resized, the text may wrap differently, so update the open answers
    window.addEventListener("resize", function () {
        questions.forEach(function (question) {
            if (question.getAttribute("aria-expanded") === "true") {
                const answer = question.nextElementSibling;
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
});