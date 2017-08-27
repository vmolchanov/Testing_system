"use strict";

(function () {

    var openSignInPopupBtn = document.querySelector(".user-block__signin-btn");
    var signInPopup = document.getElementById("signin-popup");
    var closeSignInPopupBtn = signInPopup.querySelector(".signin-popup__close");
    var overlay = document.querySelector(".signin-popup__overlay");
    var registerForm = document.getElementById("register-form");

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var form = new RegisterForm();
        form.submit();
    });

    openSignInPopupBtn.addEventListener("click", function (event) {
        event.preventDefault();
        signInPopup.classList.add("signin-popup--show");
        document.body.classList.add("no-scroll");
    });

    closeSignInPopupBtn.addEventListener("click", closeSigninPopup);

    overlay.addEventListener("click", closeSigninPopup);


    /**
     * @param event
     */
    function closeSigninPopup(event) {
        event.preventDefault();
        signInPopup.classList.remove("signin-popup--show");
        document.body.classList.remove("no-scroll");
    }

})();
