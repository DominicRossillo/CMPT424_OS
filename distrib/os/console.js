///<reference path="../globals.ts" />
/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    var Console = (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer) {
            if (currentFont === void 0) { currentFont = _DefaultFontFamily; }
            if (currentFontSize === void 0) { currentFontSize = _DefaultFontSize; }
            if (currentXPosition === void 0) { currentXPosition = 0; }
            if (currentYPosition === void 0) { currentYPosition = _DefaultFontSize; }
            if (buffer === void 0) { buffer = ""; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };
        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };
        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };
        Console.prototype.resetX = function () {
            this.currentXPosition = 0;
        };
        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) {
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    bufferRecall.push(this.buffer);
                    recallCount = bufferRecall.length;
                    this.buffer = "";
                }
                else if (chr === String.fromCharCode(9)) {
                    // Tab key will look if what is entered is a sub string of any known commands and complete it
                    if (this.buffer.length > 0) {
                        for (var i = 0; i < (_OsShell.commandList.length); i++) {
                            if ((this.buffer) == (_OsShell.commandList[i].command).substr(0, (this.buffer.length))) {
                                var commandbuild = "";
                                for (var j = 0; j < (_OsShell.commandList[i].command).substr(this.buffer.length, (_OsShell.commandList[i].command).length - 1).length; j++) {
                                    var comchar = (_OsShell.commandList[i].command).substr(this.buffer.length, (_OsShell.commandList[i].command).length - 1).charAt(j); //chars added to complete the command
                                    this.putText(comchar);
                                    commandbuild += comchar;
                                }
                                this.buffer += commandbuild;
                            }
                        }
                        ;
                    }
                    else {
                        this.buffer = "";
                    }
                }
                else if (chr === String.fromCharCode(8)) {
                    this.remText((this.buffer).charAt((this.buffer).length - 1));
                    this.buffer = (this.buffer).slice(0, this.buffer.length - 1);
                }
                else if (chr === String.fromCharCode(38)) {
                    // alert("please")
                    if (recallCount > 0) {
                        recallCount--;
                        _DrawingContext.recallClear(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition);
                        this.buffer = bufferRecall[recallCount];
                        this.resetX();
                        this.putText(">" + this.buffer);
                    }
                }
                else if (chr === String.fromCharCode(40)) {
                    // alert("please")
                    if (recallCount < bufferRecall.length) {
                        recallCount++;
                        _DrawingContext.recallClear(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition);
                        this.buffer = bufferRecall[recallCount];
                        this.resetX();
                        this.putText(">" + this.buffer);
                    }
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
            }
        };
        Console.prototype.putText = function (text, record) {
            if (record === void 0) { record = false; }
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
        };
        Console.prototype.remText = function (text) {
            //deltext
            // Move the current X position.
            var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
            this.currentXPosition = (this.currentXPosition - offset);
            // Draw the text at the current X and Y coordinates.
            _DrawingContext.delText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
        };
        Console.prototype.advanceLine = function () {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            // TODO: Handle scrolling. (iProject 1)
        };
        return Console;
    }());
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
