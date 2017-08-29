"use strict";

(function () {

    var loginButton = document.querySelector(".user-block__signin-btn");
    var registerForm = document.getElementById("register-form");
    var signInPopup = new SignInPopup();
    var loginForm = document.querySelector(".signin-popup-form");

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var form = new RegisterForm();
        form.submit();
    });

    loginButton.addEventListener("click", function (event) {
        event.preventDefault();
        signInPopup.open();
    });

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var form = new LoginForm();
        form.submit();
    });

})();
