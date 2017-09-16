"use strict";

(function () {

    /**
     * @constructor
     */
    function SignInPopup() {
        this._popup = document.getElementById("signin-popup");
        this._closeButton = document.querySelector(".signin-popup__close");
        this._overlay = document.querySelector(".signin-popup__overlay");

        var self = this;

        if (this._overlay) {
            this._overlay.addEventListener("click", function (event) {
                self.close(event);
            });
        }

        if (this._closeButton) {
            this._closeButton.addEventListener("click", function (event) {
                self.close(event);
            });
        }
    }


    /**
     * Метод открывает модальное окно
     */
    SignInPopup.prototype.open = function () {
        this._popup.classList.add("signin-popup--show");
        this._popup.style.opacity = "1";
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

        var ANIMATION_TIME = 200; // 0.3 секунды

        var time = 0;
        var self = this;
        var interval = setInterval(function () {
            var opacity = parseFloat(self._popup.style.opacity);

            opacity -= 0.1;
            self._popup.style.opacity = String(opacity);
            time += ANIMATION_TIME / 10;

            if (time === ANIMATION_TIME) {
                clearInterval(interval);
                self._popup.classList.remove("signin-popup--show");
                document.body.classList.remove("no-scroll");
            }
        }, ANIMATION_TIME / 10);
    };


    window.SignInPopup = SignInPopup;

})();