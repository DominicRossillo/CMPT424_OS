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
                    scrollingText.push(">" + this.buffer);
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    bufferRecall.push(this.buffer);
                    recallCount = bufferRecall.length;
                    this.buffer = "";
                }
                else if (chr === String.fromCharCode(9)) {
                    // Tab key will look if what is entered is a sub string of any known commands and complete it
                    // if nothing is writen this if will just return ""
                    if (this.buffer.length > 0) {
                        //loop to look at all commands in the command list
                        for (var i = 0; i < (_OsShell.commandList.length); i++) {
                            //if command at current index trimed to the same length as the user input then return that command
                            if ((this.buffer) == (_OsShell.commandList[i].command).substr(0, (this.buffer.length))) {
                                var commandbuild = "";
                                //for loop to generate the commmand we are finishing 
                                for (var j = 0; j < (_OsShell.commandList[i].command).substr(this.buffer.length, (_OsShell.commandList[i].command).length - 1).length; j++) {
                                    var comchar = (_OsShell.commandList[i].command).substr(this.buffer.length, (_OsShell.commandList[i].command).length - 1).charAt(j); //chars added to complete the command
                                    this.putText(comchar);
                                    commandbuild += comchar;
                                }
                                //add the end of the command to the buffer
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
                    //finds and draws the text over the previous char
                    this.remText((this.buffer).charAt((this.buffer).length - 1));
                    //changes the buffer to what it would be - the char we just overwrote 
                    this.buffer = (this.buffer).slice(0, this.buffer.length - 1);
                }
                else if (chr === String.fromCharCode(38)) {
                    //iff to make sure you dont index underflow 
                    if (recallCount > 0) {
                        recallCount--;
                        _DrawingContext.recallClear(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition);
                        //adds the line that we want to recall to the buffer and resets the x
                        this.buffer = bufferRecall[recallCount];
                        this.resetX();
                        this.putText(">" + this.buffer);
                    }
                }
                else if (chr === String.fromCharCode(40) && usearrow) {
                    // if to make sure you dont index overflow
                    if (recallCount < bufferRecall.length - 1) {
                        recallCount++;
                        _DrawingContext.recallClear(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition);
                        //adds the line that we want to recall to the buffer and resets the x
                        this.buffer = bufferRecall[recallCount];
                        this.resetX();
                        this.putText(">" + this.buffer);
                        usearrow = false;
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
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            if (record === void 0) { record = false; }
            if (text !== "") {
                //if the key being typed is past 475 on x then advances the line
                if (this.currentXPosition > 475) {
                    _StdOut.advanceLine();
                }
                else if (_DrawingContext.measureText(this.currentFont, this.currentFontSize, text) > 500) {
                    var headtext = text.substr(0, Math.floor(text.length / 2));
                    var tailtext = text.substr(Math.floor(text.length / 2), text.length);
                    // alert("putText() text : "+text)
                    // alert("putText() tailtext : "+tailtext)                  
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, headtext);
                    _StdOut.advanceLine();
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, tailtext);
                    //adds the split string into the srolling text array 
                    if (record) {
                        scrollingText.push(headtext);
                        scrollingText.push(tailtext);
                    }
                }
                else {
                    // Draw the text at the current X and Y coordinates.
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                    // Move the current X position.
                    var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                    this.currentXPosition = this.currentXPosition + offset;
                    if (record) {
                        scrollingText.push(text);
                    }
                }
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
            //if to make sure we arent leaving the bounds of the canvas
            if (this.currentYPosition < 500 - this.currentFontSize) {
                this.currentXPosition = 0;
                /*
                 * Font size measures from the baseline to the highest point in the font.
                 * Font descent measures from the baseline to the lowest point in the font.
                 * Font height margin is extra spacing between the lines.
                 */
                this.currentYPosition += _DefaultFontSize +
                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                    _FontHeightMargin;
            }
            else {
                //else we are going to inc scrollOffset and print everything from scrollingText, Starting from the off set
                scrollOffSet++;
                this.init();
                for (var i = scrollOffSet; i < scrollingText.length; i++) {
                    this.putText(scrollingText[i]);
                    this.advanceLine();
                }
            }
        };
        return Console;
    }());
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
