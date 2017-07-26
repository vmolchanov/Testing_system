"use strict";

(function () {

    var openSignInPopupBtn = document.querySelector(".user-block__signin-btn");
    var signInPopup = document.getElementById("signin-popup");
    var closeSignInPopupBtn = signInPopup.querySelector(".signin-popup__close");
    var overlay = document.querySelector(".signin-popup__overlay");
    var signInForm = document.querySelector(".signin-popup-form");

    openSignInPopupBtn.addEventListener("click", function (event) {
        event.preventDefault();
        signInPopup.classList.add("signin-popup--show");
        document.body.classList.add("no-scroll");
    });

    closeSignInPopupBtn.addEventListener("click", closeSigninPopup);

    overlay.addEventListener("click", closeSigninPopup);

    signInForm.addEventListener("submit", function (event) {
        event.preventDefault();

        console.log("here");

        var email = this.querySelector("input[type=email]").value;
        var password = this.querySelector("input[type=password]").value;

        var queryString = "email=" + encodeURIComponent(email) + "&pass=" + encodeURIComponent(password);

        if (email.indexOf("@") !== -1 && email.indexOf("@") !== email.length - 1) {
            var xhr = new XMLHttpRequest();

            xhr.open("POST", "/signin");
            xhr.addEventListener("readystatechange", function (event) {
                if (this.readyState === XMLHttpRequest.DONE) {
                    console.log(this.status);
                }
            });
            xhr.send(queryString);
        }
    });

    /**
     * @param event
     */
    function closeSigninPopup(event) {
        event.preventDefault();
        signInPopup.classList.remove("signin-popup--show");
        document.body.classList.remove("no-scroll");
    }

})();
