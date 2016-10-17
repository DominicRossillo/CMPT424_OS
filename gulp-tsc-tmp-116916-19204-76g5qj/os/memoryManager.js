var TSOS;
(function (TSOS) {
    var memoryManager = (function () {
        function memoryManager() {
        }
        memoryManager.prototype.clearMemory = function () {
            _Memory.clearAllMemory();
        };
        return memoryManager;
    }());
    TSOS.memoryManager = memoryManager;
})(TSOS || (TSOS = {}));
