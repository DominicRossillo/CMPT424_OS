var TSOS;
(function (TSOS) {
    //memory of the host
    var HardDrive = (function () {
        function HardDrive() {
        }
        HardDrive.prototype.initHardDriveTable = function () {
            var hardDriveDisplay = "";
            sessionStorage.clear;
            for (var i = 0; i <= 3; i++) {
                for (var j = 0; j <= 7; j++) {
                    for (var k = 0; k <= 7; k++) {
                        if (i == 0 && j == 0 && k == 0) {
                            hardDriveDisplay += "<tr id=\"hdRow" + i + j + k + "\"><td id=\"registerNum\">" + i + ":" + j + ":" + k + "</td><td id=\"activeFlag\">0</td><td id=\"hdPointer\">000</td><td id=\"data\">303031313030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000</td>";
                            sessionStorage.setItem('' + i + '' + j + '' + k, "303031313030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
                        }
                        else {
                            hardDriveDisplay += "<tr id=\"hdRow" + i + j + k + "\"><td id=\"registerNum\">" + i + ":" + j + ":" + k + "</td><td id=\"activeFlag\">0</td><td id=\"hdPointer\">000</td><td id=\"data\">000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000</td>";
                            sessionStorage.setItem('' + i + '' + j + '' + k, "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
                        }
                    }
                }
            }
            document.getElementById("hardDriveTable").innerHTML = hardDriveDisplay;
        };
        return HardDrive;
    }());
    TSOS.HardDrive = HardDrive;
})(TSOS || (TSOS = {}));
