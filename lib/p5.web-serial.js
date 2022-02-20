async function getPort(baud = 9600) {
    let port = await selectPort();

    // Wait for the serial port to open.
    await port.open({ baudRate: baud });

    // create read & write streams
    textDecoder = new TextDecoderStream();
    textEncoder = new TextEncoderStream();
    readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

    reader = textDecoder.readable
        .pipeThrough(new TransformStream(new LineBreakTransformer()))
        .getReader();
    writer = textEncoder.writable.getWriter();

    return { port, reader, writer }
}

async function selectPort() {
    // create selection interface
    document.body.style = "display: flex; flex-direction: column; justify-content: center; align-items: center;";

    let selContainer = document.createElement("div");
    selContainer.id = "selection-container"
    selContainer.style = "position: absolute; margin: 0 auto; background-color:white; color: black; border: 1px solid black; padding: 1em; border-radius: 0.5em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;";
    let portContainer = document.createElement("div");

    let portLabel = document.createElement("label")
    let portSel = document.createElement("select")
    let scanBtn = document.createElement("button")
    let connectBtn = document.createElement("button")

    portLabel.htmlFor = "port";
    portLabel.innerHTML = "Select a device";
    portSel.name = "port";
    portSel.innerHTML = "Select a device";
    portContainer.appendChild(portLabel)
    portContainer.appendChild(document.createElement("br"))
    portContainer.appendChild(portSel)

    selContainer.appendChild(portContainer)
    scanBtn.innerHTML = "Add a device";
    connectBtn.innerHTML = "Connect!";
    selContainer.appendChild(scanBtn)
    selContainer.appendChild(connectBtn)
    document.body.appendChild(selContainer)

    // Get all serial ports the user has previously granted the website access to.
    const ports = await navigator.serial.getPorts();
    if (ports.length) {
        ports.forEach((p, i) => {
            let opt = document.createElement("option")
            const { usbVendorId, usbProductId } = p.getInfo();
            let txtNode = document.createTextNode(`
                VID: 0x${usbVendorId.toString(16).padStart(4, '0')}
                PID: 0x${usbProductId.toString(16).padStart(4, '0')} 
            `)
            opt.appendChild(txtNode);
            opt.value = i;
            portSel.appendChild(opt);
        })
    } else {
        // no ports found
        portSel.style.display = "none";
    }

    return new Promise((resolve, reject) => {
        let port;

        scanBtn.addEventListener('click', async () => {
            // Prompt user to select any serial port.
            port = await navigator.serial.requestPort();
            if (!ports.includes(port)) ports.push(port);

            portSel.innerHTML = ''
            ports.forEach((p, i) => {
                let opt = document.createElement("option")
                let txtNode = document.createTextNode(
                    `PID: ${p.getInfo().usbProductId} VID: ${p.getInfo().usbVendorId}`
                )
                opt.appendChild(txtNode);
                opt.value = i;
                portSel.appendChild(opt);
            })
            portSel.value = ports.length - 1
        })

        connectBtn.addEventListener('click', async () => {
            if (ports.length) {
                port = ports[portSel.value];

                selContainer.style.display = "none";
                resolve(port);
            } else {
                alert(`pls select a port :P`);
            }
        })
    })
}

class LineBreakTransformer {
    constructor() {
        // A container for holding stream data until a new line.
        this.chunks = "";
    }

    transform(chunk, controller) {
        // Append new chunks to existing chunks.
        this.chunks += chunk;
        // For each line breaks in chunks, send the parsed lines out.
        const lines = this.chunks.split("\r\n");
        this.chunks = lines.pop();
        lines.forEach((line) => controller.enqueue(line));
    }

    flush(controller) {
        // When the stream is closed, flush any remaining chunks out.
        controller.enqueue(this.chunks);
    }
}