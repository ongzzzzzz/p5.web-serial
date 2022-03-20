String val;     // Data received from serial port
int ledPin = LED_BUILTIN;  // Arduino built-in LED
bool ledState = false;

void setup() {
    pinMode(ledPin, OUTPUT);
    Serial.begin(9600);
}

void loop() {
    val = "";
    if (Serial.available()) {
        // If data is available to read,
        val = Serial.readStringUntil('\n');
        val.trim();
    }

    if (val == "clicked!") digitalWrite(ledPin, HIGH); 
    else if (val == "not clicked!") digitalWrite(ledPin, LOW);
}