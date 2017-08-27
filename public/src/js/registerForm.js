"use strict";

(function () {

    /**
     * @constructor
     */
    function RegisterForm() {
        this._emailInput = document.querySelector("#register-form input[name=email]");
    }


    /**
     * Метод используется для валидации формы
     * @returns {{isValid: boolean}} - объект с признаком результата валидации
     */
    RegisterForm.prototype.validate = function () {
        var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var isValidEmail = regexp.test(this._emailInput);
        if (isValidEmail) {
            return { isValid: true };
        }
        return { isValid: false };
    };


    /**
     * Метод выполняет валидацию полей и отправляет ajax-запрос, если валидация пройдена
     */
    RegisterForm.prototype.submit = function () {
        var isValid = this.validate();

        if (!isValid) {
            alert("Некорректный Email"); // TODO сделать сообщение о некорректном Email
            return;
        }

        /** @type {string} - тело POST запроса */
        var body = "email=" + encodeURIComponent(this._emailInput.value);
        var xhr = new XMLHttpRequest();
        var self = this;

        xhr.open("POST", "/users/register");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.addEventListener("readystatechange", function (event) {
            if (this.readyState === xhr.DONE) {
                var response = JSON.parse(this.responseText);

                if (response.status === "success") {
                    self._emailInput.value = "";
                }
                if (response.status === "error") {
                    alert(response.reason); // TODO сделать сообщение о некорректном Email
                }
            }
        });
        xhr.send(body);
    };

    window.RegisterForm = RegisterForm;

})();
