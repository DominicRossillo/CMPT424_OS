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
            var hexaddress = sessionStorage.getItem("000").substring(0, 3);
            var decaddress = "";
            var hexName = "";
            for (var i = 0; i < hexaddress.length; i++) {
                decaddress += String.fromCharCode(parseInt(hexaddress.substr(i, 2), 16));
            }
            for (var i = 0; i < fileName.length; i++) {
                hexName = hex = fileName.charCodeAt(i).toString(16);
            }
            sessionStorage.setItem(decaddress.substring(0, 3));
            alert("address " + address);
        };
        return DeviceDriverHardDrive;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverHardDrive = DeviceDriverHardDrive;
})(TSOS || (TSOS = {}));
