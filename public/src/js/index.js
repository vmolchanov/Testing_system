"use strict";

(function () {

    var openSigninPopupBtn = document.querySelector(".user-block__signin-btn");
    var signinPopup = document.getElementById("signin-popup");
    var closeSigninPopupBtn = signinPopup.querySelector(".signin-popup__close");
    var overlay = document.querySelector(".signin-popup__overlay");

    openSigninPopupBtn.addEventListener("click", function (event) {
        event.preventDefault();
        signinPopup.classList.add("signin-popup--show");
        document.body.classList.add("no-scroll");
    });

    closeSigninPopupBtn.addEventListener("click", closeSigninPopup);

    overlay.addEventListener("click", closeSigninPopup);

    /**
     * @param event
     */
    function closeSigninPopup(event) {
        event.preventDefault();
        signinPopup.classList.remove("signin-popup--show");
        document.body.classList.remove("no-scroll");
    }

})();
