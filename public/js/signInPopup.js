"use strict";

(function () {

    /**
     * @constructor
     */
    function SignInPopup() {
        this._popup = document.getElementById("signin-popup");
        this._closeButton = document.querySelector(".signin-popup__close");
        this.overlay = document.querySelector(".signin-popup__overlay");

        var self = this;

        this.overlay.addEventListener("click", function (event) {
            self.close(event);
        });

        this._closeButton.addEventListener("click", function (event) {
            self.close(event);
        });
    }


    /**
     * Метод открывает модальное окно
     */
    SignInPopup.prototype.open = function () {
        this._popup.classList.add("signin-popup--show");
        document.body.classList.add("no-scroll");
    };


    /**
     * Метод закрывает модальное окно
     * @param {Object} event - объект события, которое вызвало закрытие модального окна
     */
    SignInPopup.prototype.close = function (event) {
        if (event) {
            event.preventDefault();
        }
        this._popup.classList.remove("signin-popup--show");
        document.body.classList.remove("no-scroll");
    };


    window.SignInPopup = SignInPopup;

})();