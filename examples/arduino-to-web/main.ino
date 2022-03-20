const int buttonPin = 8;

void setup() {
    pinMode(buttonPin, INPUT_PULLUP);
    Serial.begin(9600);
}

void loop() {
    if (digitalRead(buttonPin) == LOW) {
        Serial.println("Change");
        delay(150);
    }
}