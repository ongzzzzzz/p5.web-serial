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
			if (mouseIsPressed) {
				background("RED");
				await writer.write("clicked!\n");
			}
			else {
				background("BLACK");
				await writer.write("not clicked!\n");
			}
		} catch (e) { console.error(e) }
	}
}