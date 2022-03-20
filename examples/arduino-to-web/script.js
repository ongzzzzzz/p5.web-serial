let port, reader, writer;

async function setup() {
	createCanvas(windowWidth, windowHeight);
	noLoop();
	({ port, reader, writer } = await getPort());
	loop();
}

async function draw() {
	try {
		while (true) {
			const { value, done } = await reader.read();

			if (done) {
				// Allow the serial port to be closed later.
				reader.releaseLock();
				break;
			}
			if (value == "Change") {
        		// random RGB color
				background(random(255), random(255), random(255));
				console.log(value);
			}
		}
	} catch (e) { console.error(e) }
}
