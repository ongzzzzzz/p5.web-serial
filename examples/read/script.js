let port, reader, writer;

async function setup() {
	createCanvas(windowWidth, windowHeight);
	background("black");

	noLoop();
	({ port, reader, writer } = await getPort());
	loop();
}

async function draw() {
	if (port) {
		try {
			while (true) {
				const { value, done } = await reader.read();
				if (done) {
					reader.releaseLock();
					break;
				}
				if (value) console.log(value);
			}
		} catch (e) { console.error(e) }
	}
}