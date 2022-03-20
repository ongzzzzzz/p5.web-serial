# p5.web-serial
A p5.js library for using the Web Serial API to access devices like Arduino, no setup required.

# What is this and why?
This library is a wrapper for the [Web Serial API](https://web.dev/serial), which enables you to communicate with devices like Arduino without having to run a local server! 

![arduino + p5.js](images/arduino-p5js.png)

The Web Serial API is available on all desktop platforms (Chrome OS, Linux, macOS, and Windows) in Chrome 89. More about compatibliity can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility).

# Getting Started
To use this library, create a new p5.js sketch and import the library in the `index.html` file. 

You can download `p5.web-serial.js` and use it directly in your code:
```html
<script language="javascript" type="text/javascript" src="p5.web-serial.js"></script>
```
Or, you can also use a CDN link available via jsdelivr:
```html
<script language="javascript" type="text/javascript" src="https://cdn.jsdelivr.net/gh/ongzzzzzz/p5.web-serial/lib/p5.web-serial.js"></script>
```
After importing the library, head over to your `script.js` file, and make sure the `setup()` function looks like:
```js
let port, reader, writer;
async function setup() {
	createCanvas(windowWidth, windowHeight);

    // additional code here...

	noLoop();
	({ port, reader, writer } = await getPort());
	loop();
}
```
Note the `async` keyword, definitions of `port, reader, writer` and the `noLoop()` and `loop()` function calls. 

# Examples
Check out the [examples](https://github.com/ongzzzzzz/p5.web-serial/tree/main/examples) folder for more details.

## Sending data from the browser to the Arduino:
***make sure to put `\n` at the end of every `writer.write()`!** (so arduino can know where it needs to read until)*
```js
async function draw() {
	if (port) {
		try {
			if (mouseIsPressed) {
                // do something...
				await writer.write("clicked!\n");
			}
			else {
                // do something...
				await writer.write("not clicked!\n");
			}
		} catch (e) { console.error(e) }
	}
}
```
```cpp
void loop() {
    val = "";
    if (Serial.available()) {
        val = Serial.readStringUntil('\n');
        val.trim();
    }

    if (val == "clicked!") digitalWrite(ledPin, HIGH); 
    else if (val == "not clicked!") digitalWrite(ledPin, LOW);
}
```

## Sending data from the Arduino to the browser:
reading data on the p5js side is a little uhhhh messy (lol) for now, but it works!
```js
async function draw() {
	try {
		while (true) {
			const { value, done } = await reader.read();

			if (done) {
				// Allow the serial port to be closed later.
				reader.releaseLock();
				break;
			}
			if (value == "69420") {
                // do something...
                console.log("nice");
            }
		}
	} catch (e) { console.error(e) }
}
```
***remember to use `Serial.println()` and not `Serial.print()`** - this is to let the browser know where it needs to read until!*
```cpp
void loop() {
    if (digitalRead(buttonPin) == LOW) {
        Serial.println("69420");
        delay(150);
    }
}
```

# Resources
- [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API)
- [web.dev writeup](https://web.dev/serial)

# Issues
Report issues in the [issues tab](https://github.com/ongzzzzzz/p5.web-serial/issues) :3

# Contributing
just open a pull request :D ~free labour~ contributions always welcome!

# Screenshots / GIFs


# License
[MIT License](https://github.com/ongzzzzzz/p5.web-serial/blob/main/LICENSE)



<!-- todo: 
check for support
polyfill 
requires https
add screemshots/gifs

add customisability? like change LineBreakTransformer
-->