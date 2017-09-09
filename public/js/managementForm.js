"use strict";

(function () {

    /**
     * @constructor
     */
    function ManagementForm() {
        this._selectedUser = document.getElementById("selected-user");
        this._addTestButton = document.getElementById("add-test-btn");
        this._saveButton = document.getElementById("save-btn");
        this._testsContainer = document.getElementById("tests");
        this._saveProgress = document.getElementById("save-progress");

        var xhr = new XMLHttpRequest();
        var self = this;

        xhr.open("GET", "/users/availabletests?user=" + encodeURIComponent(this._selectedUser.value));
        xhr.addEventListener("readystatechange", function (event) {
            if (this.readyState === xhr.DONE) {
                var response = JSON.parse(this.responseText);

                if (response.status === "error") {
                    self._saveProgress.classList.add("management-form__save-progress--error");
                    self._saveProgress.innerHTML = response.reason;
                }
                if (response.status === "success") {
                    for (var test in response.availableTests) {
                        self._tests.find(item => item.getAttribute("name") === test).checked = true;
                    }
                }
            }
        });
        xhr.send(null);

        this._addTestButton.addEventListener("click", function (event) {
            event.preventDefault();
            location.href = location.origin + "/users/addtest";
        });

        this._selectedUser.addEventListener("change", this._onUserChange);

        this._onUserChange = this._onUserChange.bind(this);
    }


    /**
     * Метод отправляет ajax-запрос
     */
    ManagementForm.prototype.submit = function () {
        var tests = this._testsContainer.querySelectorAll(".management-form__test input[type=checkbox]");
        var data = { user: this._selectedUser.value, tests: [] };

        Array.prototype.forEach.call(tests, function (test) {
            if (test.checked) {
                data.tests.push(test.getAttribute("name"));
            }
        });

        var xhr = new XMLHttpRequest();
        var self = this;

        xhr.open("PUT", "/users/changetests");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.addEventListener("readystatechange", function (event) {
            if (this.readyState === xhr.DONE) {
                var response = JSON.parse(xhr.responseText);

                if (response.status === "error") {
                    self._saveProgress.classList.add("management-form__save-progress--error");
                    self._saveProgress.innerHTML = response.reason;
                }
                if (response.status === "success") {
                    self._saveProgress.classList.add("management-form__save-progress--success");
                    self._saveProgress.innerHTML = "Изменения были успешно сохранены";
                }
            }
        });
        xhr.send(JSON.stringify(data));
    };


    /**
     * Обработчик события изменения пользователя
     * @param {Object} event - объект события
     * @private
     */
    ManagementForm.prototype._onUserChange = function (event) {
        event.preventDefault();

        var xhr = new XMLHttpRequest();
        var self = this;

        xhr.open("GET", "/users/availabletests?user=" + encodeURIComponent(event.target.value));
        xhr.addEventListener("readystatechange", function (event) {
            if (this.readyState === xhr.DONE) {
                var response = JSON.parse(this.responseText);

                if (response.status === "error") {
                    self._saveProgress.classList.add("management-form__save-progress--error");
                    self._saveProgress.innerHTML = response.reason;
                }
                if (response.status === "success") {
                    response.availableTests.forEach(function(availableTest) {
                        self._tests.find(item => item.getAttribute("name") === test).checked = true;
                    });
                }
            }
        });
    };

    window.ManagementForm = ManagementForm;

})();

