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
            var searchPointer = "000";
            var checkName = fileName;
            var nameAvalible = true;
            var trueName = "";
            while (checkName.length < 120) {
                checkName += "0";
            }
            while (searchPointer != "100") {
                var hexName = sessionStorage.getItem(searchPointer);
                if (checkName == hexName.substr(4)) {
                    nameAvalible = false;
                    break;
                }
                else {
                    searchPointer = this.searchPointerIncrement(searchPointer);
                }
            }
            for (var i = 0; i < fileName.length; i = i + 2) {
                trueName += String.fromCharCode(parseInt(fileName.substr(i, 2), 16));
            }
            if (fileName.charAt(0) != null && nameAvalible) {
                if (fileName.length < 60) {
                    var hexaddress = sessionStorage.getItem("000").substr(4);
                    var decaddress = "";
                    var hexName = "1";
                    var pointerRef = "";
                    for (var i = 0; i < hexaddress.length; i += 2) {
                        decaddress += String.fromCharCode(parseInt(hexaddress.substr(i, 2), 16));
                    }
                    for (var i = 0; i < decaddress.substr(3, 3).length; i++) {
                        hexName += parseInt(decaddress.substr(3, 3).charAt(i));
                        pointerRef += parseInt(decaddress.substr(3, 3).charAt(i));
                    }
                    for (var i = 0; i < fileName.length; i++) {
                        hexName += fileName.charAt(i).toString(16);
                    }
                    while (hexName.length < 124) {
                        hexName += "0";
                    }
                    sessionStorage.setItem(decaddress.substr(0, 3), hexName);
                    var newBaseHead = "";
                    var newBaseTail = "";
                    var memoryInit = "1000";
                    while (memoryInit.length < 124) {
                        memoryInit += "0";
                    }
                    newBaseHead = this.searchPointerIncrement(decaddress.substr(0, 3));
                    newBaseTail = this.searchPointerIncrement(decaddress.substr(3));
                    var finalBase = sessionStorage.getItem("000").substr(0, 4);
                    for (var i = 0; i < newBaseHead.length; i++) {
                        finalBase += newBaseHead.charCodeAt(i).toString(16);
                    }
                    for (var i = 0; i < newBaseHead.length; i++) {
                        finalBase += newBaseTail.charCodeAt(i).toString(16);
                    }
                    while (finalBase.length < 124) {
                        finalBase += "0";
                    }
                    sessionStorage.setItem(pointerRef, memoryInit);
                    sessionStorage.setItem("000", finalBase);
                    _StdOut.putText("File Create: " + trueName, true);
                    this.updateDiskDisplay();
                }
                else {
                    _StdOut.putText("The name that you supplied is too long.", true);
                }
            }
            else {
                if (!nameAvalible) {
                    _StdOut.putText("The name that you supplied is already being used.", true);
                }
                else {
                    _StdOut.putText("You must supply a file name.", true);
                }
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
        };
        DeviceDriverHardDrive.prototype.writeToDrive = function (fileName, writenData) {
            var searchPointer = "000";
            var hexName = "";
            for (var i = 0; i < fileName.length - 1; i++) {
                hexName += parseInt(fileName.charAt(i), 16);
            }
            var programInput = "";
            for (var i = 0; i < writenData.length; i++) {
                programInput += writenData.charCodeAt(i).toString(16);
            }
            while (programInput.length < 120) {
                programInput += "0";
            }
            var saveReg = sessionStorage.getItem("000").substr(4);
            var destReg = "";
            for (var i = 0; i < saveReg.length; i++) {
                destReg += String.fromCharCode(parseInt(saveReg.substr(i, 2), 16)).replace(/[^a-zA-Z0-9]/g, "");
            }
            var ourName = "";
            for (var i = 0; i < fileName.length; i++) {
                ourName += fileName.charCodeAt(i).toString(16);
            }
            while (ourName.length < 120) {
                ourName += "0";
            }
            while (searchPointer != "101") {
                var hexName = sessionStorage.getItem(searchPointer);
                if (searchPointer == "100") {
                    _StdOut.putText("File with that name does not exist.", true);
                }
                if (ourName == hexName.substr(4)) {
                    var regPoint = sessionStorage.getItem(searchPointer).substr(1, 3);
                    var initPoint = "1000";
                    if (programInput.length > 120) {
                        var baseAddress = "";
                        var hexAddress = sessionStorage.getItem("000").substr(4);
                        for (var i = 0; i < hexAddress.length; i += 2) {
                            baseAddress += String.fromCharCode(parseInt(hexAddress.substr(i, 2), 16));
                        }
                        initPoint = "1" + baseAddress.substr(3);
                        this.bigWriteToDrive(initPoint.substr(1, 3), programInput.substr(120));
                    }
                    var oldData = sessionStorage.getItem(searchPointer).substr(4);
                    sessionStorage.setItem(searchPointer, "1" + regPoint + oldData);
                    sessionStorage.setItem(regPoint, initPoint + programInput.substr(0, 120));
                    _StdOut.putText("File: " + fileName + " has been written to.", true);
                    break;
                }
                else {
                    searchPointer = this.searchPointerIncrement(searchPointer);
                }
            }
            this.updateDiskDisplay();
        };
        DeviceDriverHardDrive.prototype.bigWriteToDrive = function (pointer, data) {
            var hexaddress = sessionStorage.getItem("000").substr(4);
            var finalBase = sessionStorage.getItem("000").substr(0, 4);
            var destReg = "1000";
            var decaddress = "";
            for (var i = 0; i < hexaddress.length; i += 2) {
                decaddress += String.fromCharCode(parseInt(hexaddress.substr(i, 2), 16));
            }
            var newBaseHead = decaddress.substr(0, 3);
            var newBaseTail = this.searchPointerIncrement(decaddress.substr(3));
            for (var i = 0; i < newBaseHead.length; i++) {
                finalBase += newBaseHead.charCodeAt(i).toString(16);
            }
            for (var i = 0; i < newBaseHead.length; i++) {
                finalBase += newBaseTail.charCodeAt(i).toString(16);
            }
            while (finalBase.length < 124) {
                finalBase += "0";
            }
            if (data.length > 120) {
                destReg = "1";
                destReg += newBaseTail;
                this.bigWriteToDrive(newBaseTail, data.substr(120));
            }
            else if (data.length < 120) {
                while (data.length < 120) {
                    data += "0";
                }
            }
            sessionStorage.setItem("000", finalBase);
            sessionStorage.setItem(pointer, destReg + data.substr(0, 120));
            this.updateDiskDisplay();
        };
        DeviceDriverHardDrive.prototype.searchPointerIncrement = function (pointer) {
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
        DeviceDriverHardDrive.prototype.hardDriveLs = function () {
            var searchPointer = "001";
            var nullresult = "";
            while (nullresult.length < 120) {
                nullresult += "0";
            }
            while (searchPointer != "100") {
                var fileName = "";
                var hexName = sessionStorage.getItem(searchPointer).substr(4);
                if (hexName != nullresult) {
                    for (var i = 0; i < hexName.length; i = i + 2) {
                        fileName += String.fromCharCode(parseInt(hexName.substr(i, 2), 16));
                    }
                    alert(fileName.length);
                    if (true) {
                        _StdOut.putText("Ls: " + fileName, true);
                        _StdOut.advanceLine();
                    }
                }
                searchPointer = this.searchPointerIncrement(searchPointer);
            }
        };
        DeviceDriverHardDrive.prototype.readFile = function (fileName) {
            var searchPointer = "000";
            var checkName = fileName;
            var nameAvalible = true;
            var trueName = "";
            for (var i = 0; i < fileName.length; i = i + 2) {
                trueName += String.fromCharCode(parseInt(fileName.substr(i, 2), 16));
            }
            while (checkName.length < 120) {
                checkName += "0";
            }
            while (searchPointer != "101") {
                var hexName = sessionStorage.getItem(searchPointer);
                if (searchPointer == "100") {
                    _StdOut.putText("No file with that name exists", true);
                    break;
                }
                if (checkName == hexName.substr(4)) {
                    var hexData = sessionStorage.getItem(hexName.substr(1, 3)).substr(4);
                    var translatedData = "";
                    for (var i = 0; i < hexData.length; i = i + 2) {
                        translatedData += String.fromCharCode(parseInt(hexData.substr(i, 2), 16));
                    }
                    _StdOut.putText(trueName + ": " + translatedData, true);
                    break;
                }
                else {
                    searchPointer = this.searchPointerIncrement(searchPointer);
                }
            }
        };
        DeviceDriverHardDrive.prototype.deleteFile = function (fileName) {
            var searchPointer = "000";
            var checkName = fileName;
            var nameAvalible = true;
            var trueName = "";
            for (var i = 0; i < fileName.length; i = i + 2) {
                trueName += String.fromCharCode(parseInt(fileName.substr(i, 2), 16));
            }
            while (checkName.length < 120) {
                checkName += "0";
            }
            while (searchPointer != "101") {
                var hexName = sessionStorage.getItem(searchPointer);
                if (searchPointer == "100") {
                    _StdOut.putText("No file with that name exists", true);
                    break;
                }
                if (checkName == hexName.substr(4)) {
                    var clearLoc = hexName.substr(1, 3);
                    alert(clearLoc);
                    var newReg = "";
                    while (newReg.length < 124) {
                        newReg += "0";
                    }
                    sessionStorage.setItem(clearLoc, newReg);
                    sessionStorage.setItem(searchPointer, newReg);
                    _StdOut.putText(trueName + " has been deleted.", true);
                    break;
                }
                else {
                    searchPointer = this.searchPointerIncrement(searchPointer);
                }
            }
            this.updateDiskDisplay();
        };
        return DeviceDriverHardDrive;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverHardDrive = DeviceDriverHardDrive;
})(TSOS || (TSOS = {}));
