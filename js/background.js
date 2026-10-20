// background.js - Task 4: change the page background color (Home page)
//
// Each click on the button moves to the next color in the list.
// After the last color it goes back to the first one.
// The smooth fade comes from "transition: background-color" on the body in style.css.

document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("color-btn");

    // Stop if the button is not on this page
    if (!button) {
        return;
    }

    // 4 clean, light tones so dark text stays easy to read and cycling is quick
    const colors = ["#f8f9fa", "#fff8e7", "#e8f4f8", "#edf7ed"];
    let index = 0;

    button.addEventListener("click", function () {
        // % (remainder) makes the index start again from 0 after the last color
        index = (index + 1) % colors.length;
        document.body.style.backgroundColor = colors[index];
    });
});