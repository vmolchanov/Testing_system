"use strict";

(function () {

    /**
     * @constructor
     */
    function ManagementForm() {
        this._selectedUser = document.getElementById("selected-user");
        this._addTestButton = document.getElementById("add-test-btn");
        this._saveButton = document.getElementById("save-btn");
        this._tests = document.querySelectorAll("[id^=test]");
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
    }


    ManagementForm.prototype.submit = function () {

    };

    window.ManagementForm = ManagementForm;

})();

