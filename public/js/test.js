"use strict";

(function () {

    /**
     * @constructor
     */
    function TestingForm() {

    }


    TestingForm.prototype.submit = function () {
        var answers = document.querySelectorAll("input[id^=answer]");
        var data = {};

        Array.prototype.forEach.call(answers, function (answer) {
            if (answer.checked) {
                data[answer.getAttribute("id")] = "on";
            }
        });

        var xhr = new XMLHttpRequest();

        xhr.open("POST", location.pathname);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.addEventListener("readystatechange", function (event) {
            if (this.readyState === xhr.DONE) {
                var response = xhr.responseText;
                document.open();
                document.write(response);
                document.close();
            }
        });
        xhr.send(JSON.stringify(data));
    };

    window.TestingForm = TestingForm;

})();