"use strict";

(function () {

    function Timer(node, time) {
        this._node = node;
        this._time = time;
        this._interval = null;

        this._node.innerHTML = String(this._time / 1000);
    }

    Timer.prototype.start = function (callback) {
        var currentTime = this._time / 1000;
        var self = this;

        var interval = setInterval(function () {
            if (currentTime === 0) {
                clearInterval(interval);
                self._interval = null;
                callback();
                return;
            }
            currentTime--;
            self._node.innerHTML = String(currentTime);
        }, 1000);
    };

    Timer.prototype.stop = function () {
        if (this._interval) {
            clearInterval(this._interval);
            self._interval = null;
        }
    };

    window.Timer = Timer;

})();
