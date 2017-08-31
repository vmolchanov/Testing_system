"use strict";

(function () {

    var loginButton = document.querySelector(".user-block__signin-btn");
    var registerForm = document.getElementById("register-form");
    var signInPopup = new SignInPopup();
    var loginForm = document.querySelector(".signin-popup-form");
    var hamburger = document.querySelector(".hamburger");
    var menu = document.querySelector(".main-menu");

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();
            var form = new RegisterForm();
            form.submit();
        });
    }

    if (loginButton) {
        loginButton.addEventListener("click", function (event) {
            event.preventDefault();
            signInPopup.open();
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            var form = new LoginForm();
            form.submit();
        });
    }

    if (hamburger) {
        hamburger.addEventListener("click", function (event) {
            event.preventDefault();
            menu.classList.toggle("main-menu--show")
        });
    }

})();
