#include <HX711_ADC.h>
#include <UlnoiotI2c.h>
#include <math.h>

//HX711 constructor (dout pin, sck pin)
HX711_ADC LoadCell(9, 10);

void myreceive( char *msg, int len ) {
    Serial.print("Received a message of length: ");
    Serial.println(len);
    Serial.print("Message:");
    Serial.println(msg); // is properly 0 terminated - but len can used to
}

// I2C bus definition
UlnoiotI2c ui2c(1000,myreceive);

long t;

void setup() {
  Serial.begin(9600);
  Serial.println("Wait...");
  LoadCell.begin();
  long stabilisingtime = 2000; // Time used to improve stabilising
  LoadCell.start(stabilisingtime);
  LoadCell.setCalFactor(420.0); // user set calibration factor (float)
  Serial.println("Startup + tare is complete");
}

void loop() {
  //update() should be called at least as often as HX711 sample rate; >10Hz@10SPS, >80Hz@80SPS
  //longer delay in scetch will reduce effective sample rate
  LoadCell.update();

  //get smoothed value from data set + current calibration factor
  if (millis() > t + 1000) {
    float i = LoadCell.getData();
    float v = LoadCell.getCalFactor();
    Serial.print("Load_cell output val: ");
    Serial.print(i);

    // Send to I2C
    char mystr[20];
    // ui2c.suspend(100);
    snprintf(mystr, 19, "%d", round(i));
    ui2c.write(mystr);
    Serial.println(mystr);
    
    Serial.print("      Load_cell calFactor: ");
    Serial.println(v);
    t = millis();
  }

  //receive from serial terminal
  if (Serial.available() > 0) {
    float i;
    char inByte = Serial.read();
    if (inByte == 'l') i = -1.0;
    else if (inByte == 'L') i = -10.0;
    else if (inByte == 'h') i = 1.0;
    else if (inByte == 'H') i = 10.0;
    else if (inByte == 't') LoadCell.tareNoDelay();
    if (i != 't') {
      float v = LoadCell.getCalFactor() + i;
      LoadCell.setCalFactor(v);
    }
  }

  //check if last tare operation is complete
  if (LoadCell.getTareStatus() == true) {
    Serial.println("Tare complete");
  }
}

