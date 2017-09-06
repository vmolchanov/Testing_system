"use strict";

(function () {

    var loginButton = document.querySelector(".user-block__signin-btn");
    var registerForm = document.getElementById("register-form");
    var signInPopup = new SignInPopup();
    var loginForm = document.querySelector(".signin-popup-form");
    var hamburger = document.querySelector(".hamburger");
    var menu = document.querySelector(".main-menu");
    var resetForm = document.getElementById("reset-form");
    var timerElement = document.getElementById("timer");
    var managementFormElement = document.getElementById("management-form");
    var addTestFormElement = document.getElementById("add-test-form");

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();
            var form = new RegisterForm();
            form.submit();
        });
    }

    if (loginButton) {
        loginButton.addEventListener("click", function (event) {
            if (!this.classList.contains("user-block__signin-btn--logout") &&
                !this.classList.contains("user-block__signin-btn--login-page")) {

                event.preventDefault();
                signInPopup.open();
            }
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

    if (resetForm) {
        resetForm.addEventListener("submit", function (event) {
            event.preventDefault();
            var form = new ResetForm();
            form.submit();
        });
    }

    if (timerElement) {
        var timer = new Timer(timerElement, 3000);
        timer.start(function () {
            location.href = location.origin + "/users/login";
        });
    }

    if (managementFormElement) {
        var managementForm = new ManagementForm();
    }

    if (addTestFormElement) {
        var addTestForm = new AddTestForm();
    }

})();
