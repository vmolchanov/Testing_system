"use strict";

(function () {

    function RegisterForm() {
        this._emailInput = document.querySelector("#request-for-the-use-form input[name=email]");
    }

    RegisterForm.prototype.validate = function () {
        var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var isValidEmail = regexp.test(this._emailInput);
        if (isValidEmail) {
            return { isValid: true };
        }
        return { isValid: false };
    };

    RegisterForm.prototype.submit = function () {
        var isValid = this.validate();

        if (!isValid) {
            alert("Некорректный Email"); // TODO сделать сообщение о некорректном Email
            return;
        }

        var query = "?email=" + encodeURIComponent(this._emailInput.value);

        var xhr = new XMLHttpRequest();

        xhr.open("GET", "/users/register" + query);
        xhr.addEventListener("readystatechange", function (event) {
            if (this.readyState === xhr.DONE) {
                console.log("xhr");
            }
        });
        xhr.send(null);
    };

    window.RegisterForm = RegisterForm;

})();
