///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverHardDrive = (function (_super) {
        __extends(DeviceDriverHardDrive, _super);
        function DeviceDriverHardDrive() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            _super.call(this);
            this.driverEntry = this.krnHdDriverEntry;
        }
        DeviceDriverHardDrive.prototype.krnHdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };
        DeviceDriverHardDrive.prototype.initHardDrive = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            // alert("in init hd table")
            _HardDrive.initHardDriveTable();
            // More?
        };
        DeviceDriverHardDrive.prototype.formatHardDrive = function () {
            _HardDrive.initHardDriveTable();
        };
        DeviceDriverHardDrive.prototype.createFile = function (fileName) {
            if (fileName.length < 60) {
                var hexaddress = sessionStorage.getItem("000").substr(4);
                var decaddress = "";
                var hexName = "1000";
                for (var i = 0; i < hexaddress.length; i += 2) {
                    decaddress += String.fromCharCode(parseInt(hexaddress.substr(i, 2), 16));
                }
                for (var i = 0; i < fileName.length; i++) {
                    hexName += parseInt(fileName.charAt(i), 16);
                }
                while (hexName.length < 124) {
                    hexName += "0";
                }
                sessionStorage.setItem(decaddress.substr(0, 3), hexName);
                var newBase = "";
                if (decaddress.charAt(2) == "7") {
                    if (decaddress.charAt(1) == "7") {
                        if (decaddress.charAt(0) == "3") {
                        }
                        else {
                            newBase = "" + (parseInt(decaddress.charAt(0)) + 1) + 0 + 0;
                        }
                    }
                    else {
                        newBase = "" + decaddress.charAt(0) + (parseInt(decaddress.charAt(1)) + 1) + 0;
                    }
                }
                else {
                    newBase = "" + decaddress.charAt(0) + decaddress.charAt(1) + (parseInt(decaddress.charAt(2)) + 1);
                }
                var finalBase = sessionStorage.getItem("000").substr(0, 4);
                for (var i = 0; i < newBase.length; i++) {
                    finalBase += newBase.charCodeAt(i).toString(16);
                }
                for (var i = 0; i < decaddress.substr(3).length; i++) {
                    finalBase += decaddress.substr(3).charCodeAt(i).toString(16);
                }
                while (finalBase.length < 124) {
                    finalBase += "0";
                }
                sessionStorage.setItem("000", finalBase);
                this.updateDiskDisplay();
            }
            else {
                _StdOut.putText("The name that you supplied is too long.", true);
            }
        };
        DeviceDriverHardDrive.prototype.updateDiskDisplay = function () {
            var hardDriveDisplay = "";
            var hardDriveValues = "";
            var active = "";
            var pointer = "";
            var data = "";
            for (var i = 0; i <= 3; i++) {
                for (var j = 0; j <= 7; j++) {
                    for (var k = 0; k <= 7; k++) {
                        hardDriveValues = sessionStorage.getItem("" + i + j + k);
                        active = hardDriveValues.substr(0, 1);
                        pointer = hardDriveValues.substr(1, 3);
                        data = hardDriveValues.substr(4);
                        hardDriveDisplay += "<tr id=\"hdRow" + i + j + k + "\"><td id=\"registerNum\">" + i + ":" + j + ":" + k + "</td><td id=\"activeFlag\">" + active + "</td><td id=\"hdPointer\">" + pointer + "</td><td id=\"data\">" + data + "</td>";
                    }
                }
            }
            document.getElementById("hardDriveTable").innerHTML = hardDriveDisplay;
            alert("wowzer");
        };
        DeviceDriverHardDrive.prototype.writeToDrive = function (fileName, writenData) {
            var searchPointer = "000";
            while (searchPointer != "100") {
                sessionStorage.getItem(searchPointer);
                searchPointer = this.searchPointerIncrement(searchPointer);
            }
        };
        DeviceDriverHardDrive.prototype.searchPointerIncrement = function (pointer) {
            var hexPoint = "";
            for (var i = 0; i < pointer.length; i++) {
                hexPoint += parseInt(fileName.charAt(i), 16);
            }
            var newBase = "";
            if (pointer.charAt(2) == "7") {
                if (pointer.charAt(1) == "7") {
                    if (pointer.charAt(0) == "3") {
                    }
                    else {
                        newBase = "" + (parseInt(pointer.charAt(0)) + 1) + 0 + 0;
                    }
                }
                else {
                    newBase = "" + pointer.charAt(0) + (parseInt(pointer.charAt(1)) + 1) + 0;
                }
            }
            else {
                newBase = "" + pointer.charAt(0) + pointer.charAt(1) + (parseInt(pointer.charAt(2)) + 1);
            }
            return newBase;
        };
        return DeviceDriverHardDrive;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverHardDrive = DeviceDriverHardDrive;
})(TSOS || (TSOS = {}));
