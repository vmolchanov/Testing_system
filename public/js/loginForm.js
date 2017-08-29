"use strict";


(function () {

    /**
     * @constructor
     */
    function LoginForm() {
        this._emailInput = document.querySelector(".signin-popup-form__email input");
        this._passwordInput = document.querySelector(".signin-popup-form__password input");
    }


    /**
     * Метод используется для валидации формы
     * @returns {{isValid: boolean, errorFields: Array}} - объект с признаком результата валидации (isValid)
     *     и массивом названий полей, которые не прошли валидацию (errorFields)
     */
    LoginForm.prototype.validate = function () {
        var isValid = true;
        var errorFields = [];

        var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var isValidEmail = regexp.test(this._emailInput.value);

        if (!isValidEmail) {
            isValid = false;
            errorFields.push(this._emailInput.getAttribute("name"));
        }

        if (this._passwordInput.value.length === 0) {
            isValid = false;
            errorFields.push(this._passwordInput.getAttribute("name"));
        }

        return { isValid: isValid, errorFields: errorFields };
    };


    /**
     * Метод выполняет валидацию полей и отправляет ajax-запрос, если валидация пройдена
     */
    LoginForm.prototype.submit = function () {
        var validate = this.validate();

        this._emailInput.classList.remove("signin-popup-form--error");
        this._passwordInput.classList.remove("signin-popup-form--error");

        if (!validate.isValid) {
            if (validate.errorFields.find(field => field === this._emailInput.getAttribute("name"))) {
                this._emailInput.classList.add("signin-popup-form--error");
            }
            if (validate.errorFields.find(field => field === this._passwordInput.getAttribute("name"))) {
                this._passwordInput.classList.add("signin-popup-form--error");
            }
            return;
        }

        var xhr = new XMLHttpRequest();
        var data = "email=" + encodeURIComponent(this._emailInput.value) +
                   "&password=" + encodeURIComponent(this._passwordInput.value);

        xhr.open("POST", "users/login");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.addEventListener("readystatechange", function (event) {
            if (this.readyState === xhr.DONE) {
                console.log(this.responseText);
                // TODO реализовать логику для входа в систему
            }
        });
        xhr.send(data);
    };


    window.LoginForm = LoginForm;

})();
