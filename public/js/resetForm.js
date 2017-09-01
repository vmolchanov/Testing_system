"use strict";

(function () {

    /**
     * @constructor
     */
    function ResetForm() {
        this._emailInput = document.querySelector("#reset-form input[name=email]");
        this._errorField = document.getElementById("reset-error");

        this._emailInput.focus();
    }


    /**
     * Метод используется для валидации формы
     * @returns {{isValid: boolean}} - объект с признаком результата валидации
     */
    ResetForm.prototype.validate = function () {
        var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var isValidEmail = regexp.test(this._emailInput.value);
        if (isValidEmail) {
            return { isValid: true };
        }
        return { isValid: false };
    };


    /**
     * Метод выполняет валидацию полей и отправляет ajax-запрос, если валидация пройдена
     */
    ResetForm.prototype.submit = function () {
        var isValid = this.validate();

        this._errorField.classList.add("signin-popup-form__error-msg--hide");

        if (!isValid) {
            this._errorField.innerHTML = "Некорректный email";
            this._errorField.classList.remove("signin-popup-form__error-msg--hide");
            return;
        }

        /** @type {string} - тело PUT запроса */
        var body = "email=" + encodeURIComponent(this._emailInput.value);
        var xhr = new XMLHttpRequest();
        var self = this;

        xhr.open("PUT", "/restoration");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.addEventListener("readystatechange", function (event) {
            if (this.readyState === xhr.DONE) {
                var response = JSON.parse(this.responseText);

                if (response.status === "success") {
                    self._emailInput.value = "";
                    alert("Пароль был успешно изменен и отправлен на email");
                }
                if (response.status === "error") {
                    self._errorField.innerHTML = response.reason;
                    self._errorField.classList.remove("signin-popup-form__error-msg--hide");
                }
            }
        });
        xhr.send(body);
    };

    window.ResetForm = ResetForm;

})();
