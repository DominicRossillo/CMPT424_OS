var TSOS;
(function (TSOS) {
    var Scheduler = (function () {
        function Scheduler(type) {
            if (type === void 0) { type = "rr"; }
            this.type = type;
        }
        Scheduler.prototype.callScheduler = function () {
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
