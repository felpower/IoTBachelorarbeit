#include <Adafruit_NeoPixel.h>
#include <Wire.h> 
#include <LiquidCrystal_I2C.h>
#include <string.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

//const int xPin = A0; //X attach to A0
const int yPin = A0; //Y attach to A1
const int buzzPin = D4;
const int btPin = D0; //Bt attach to digital 4
const int stripPin = D5;

const char* ssid = "InternetOfThingsPrivate"; 
const char* password = "internetofthings"; 
const char* mqtt_server = "192.168.12.1";

static const char TIME_TOPIC[] = "node6/shower";
static const char USER_TOPIC[] = "node6/users";
static const char REQUEST_USER_TOPIC[] = "node6/requestUsers";

static const int MAX_USER_STR_LENGTH = 250;

// Parameter 1 = number of pixels in strip,  neopixel stick has 8
// Parameter 2 = pin number (most are valid)
// Parameter 3 = pixel type flags, add together as needed:
//   NEO_RGB     Pixels are wired for RGB bitstream
//   NEO_GRB     Pixels are wired for GRB bitstream, correct for neopixel stick
//   NEO_KHZ400  400 KHz bitstream (e.g. FLORA pixels)
//   NEO_KHZ800  800 KHz bitstream (e.g. High Density LED strip), correct for neopixel stick
Adafruit_NeoPixel strip = Adafruit_NeoPixel(8, stripPin, NEO_RGB + NEO_KHZ800);
LiquidCrystal_I2C lcd(0x27,16,2);  // set the LCD address to 0x27 for a 16 chars and 2 line display
WiFiClient espClient;
PubSubClient client(espClient);

char residentsStr[MAX_USER_STR_LENGTH];
char* residents[10];
int position = 0;
int residentsNumber=0;
boolean joystickInSelection = false;
boolean selectTime = false;
boolean countDownRunning = false;
boolean usersSet = false;

int selectedTime = 5;
long startShowerTimestamp = 0;

void splitStrToArray(){
  int i=0;
  residents[i] = strtok(residentsStr,"|");
  while(residents[i]!=NULL && i < 8 ) //to reserve one slot for the guest user
  {
     residents[++i] = strtok(NULL,"|");
  }
  residents[i++] = "Guest";

  residentsNumber=i;
  char* currentPerson = residents[position];
  lcd.print("Who are you?");
  lcd.setCursor(0,1);
  lcd.print(currentPerson);

  for(int i = 0; i < residentsNumber; i++){
    Serial.println(residents[i]);
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  for (int i = 0; i < length && i < MAX_USER_STR_LENGTH; i++) {
    Serial.print((char)payload[i]);
    residentsStr[i] = (char)payload[i];
  }
  Serial.println(); 
  splitStrToArray();
  usersSet = true;
}

void setup()
{
  Serial.begin(9600); //initialize serial*/
  
  pinMode(btPin,INPUT); //set btpin as INPUT
  digitalWrite(btPin, LOW); //and LOW

  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  
  lcd.init();                      // initialize the lcd
  lcd.backlight();
  lcd.clear(); 
  
  strip.begin();
  for(int j = 0; j < strip.numPixels()-1; j++){
    strip.setPixelColor(j, 0);
  }
  strip.show();
}

void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}



void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ESP8266Client")) {
      client.subscribe(USER_TOPIC);
      client.publish(REQUEST_USER_TOPIC, "sendUsersPls");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void listUp(){
  lcd.clear();

  if(position<=0){
    position = residentsNumber-1;
  } else {
    position--;
  }
  char* currentPerson = residents[position];
  lcd.print("Who are you?");
  lcd.setCursor(0,1);
  lcd.print(currentPerson);
  Serial.print(position);
  Serial.print(currentPerson);
}

void listDown(){
  Serial.print(residentsNumber);
  lcd.clear();
  position = (position+1)%residentsNumber;
  char* currentPerson = residents[position];
  lcd.print("Who are you?");
  lcd.setCursor(0,1);
  lcd.print(currentPerson);
}

void printCurrentUser(){
  lcd.clear();
  char* currentPerson = residents[position];
  lcd.print(currentPerson);
  lcd.setCursor(0,1);
  lcd.print("Time: ");
  lcd.print(selectedTime);
  lcd.print(" min");
}
void timeUp(){
  if(selectedTime<=30){
    selectedTime += 5;
  }
  printCurrentUser();
}

void timeDown(){
  if(selectedTime-5>1) {
    selectedTime -= 5;
  }
  printCurrentUser();
}

void readJoystick(){
  //Serial.print("X: ");//print "X: "
  //Serial.print(analogRead(xPin),DEC); //read the value of A0 and print it in decimal
  int yValue = analogRead(yPin);
  int btnValue = digitalRead(btPin);
  
  if(yValue < 25 && !joystickInSelection){ //Joystick Up
    selectTime ? timeUp() : listUp();
    joystickInSelection = true;
  } else if (yValue > 1000 && !joystickInSelection){ //Joystick Down
    selectTime ? timeDown() : listDown();
    joystickInSelection = true;
  } else if(joystickInSelection && yValue >= 500 && yValue <=700) { //Joystick Neutral
    Serial.print(yValue);
    joystickInSelection = false;
  }
  
  if(btnValue==0 && !selectTime){
    printCurrentUser();
    selectTime = true;
  } else if(btnValue==0 && selectTime){
    selectTime = false;
    countDownRunning = true;
    startShowerTimestamp = millis();
  }
}

void playMagicSound(){
  tone(buzzPin, 1000);
  delay(500);
  
  noTone(buzzPin);
  delay(50);
  
  tone(buzzPin, 1000);
  delay(250);
  
  noTone(buzzPin);
  delay(50); 
  
  tone(buzzPin, 1000);
  delay(250);
  
  noTone(buzzPin);
  delay(50);
  
  tone(buzzPin, 1000);
  delay(250);
  
  noTone(buzzPin);
  delay(50);
  
  tone(buzzPin, 1000);
  delay(2000);

  noTone(buzzPin);
}

void timeIsUp(){
  lcd.clear();
  char* currentPerson = residents[position];
  lcd.print(currentPerson);
  lcd.setCursor(0,1);
  lcd.print("Get your ass out");
  publishShowerTime();
  selectTime = false;
  countDownRunning = false;
  startShowerTimestamp = 0;
  selectedTime = 5;
  position = 0;
  playMagicSound();
}

void showRemainingTimeWithStrip(){
  long timeInShower = millis() - startShowerTimestamp;
  double percent = (double)((double)timeInShower / (double)(selectedTime*1000));
  Serial.println(percent, DEC);
  
  int numberOfLEDs = strip.numPixels()-(strip.numPixels()*percent);

  int i = 0;
  for(i = 0; i < numberOfLEDs; i++){
    strip.setPixelColor(i, strip.Color(125, 0, 0));
  }

  for(int j = i; j < strip.numPixels()-1; j++){
    strip.setPixelColor(i, 0);
  }
  strip.show();
  Serial.print("LEDs: ");
  Serial.println(numberOfLEDs);
}

void publishShowerTime(){
  char* currentPerson = residents[position];
  char msg[50];
  snprintf (msg, 75, "%s|%d",currentPerson,selectedTime);
  client.publish(TIME_TOPIC, msg);
}

void loop(){
  if (!client.connected()) {
    reconnect(); //Connect to broker
  }
  client.loop();

  while(!usersSet){
    Serial.println("Waiting...");
    delay(500);
    //client.publish(REQUEST_USER_TOPIC, "sendUsersPls");
  }

  if(usersSet){
    if(!countDownRunning){
      readJoystick();
    } else if(millis() - startShowerTimestamp > selectedTime*1000) { //TODO: SEC TO MIN HERE, NOW JUST FOR PRESENTATION PURPOSE
      timeIsUp();
    } else {
      showRemainingTimeWithStrip();
    }
  }
  
  delay(100);//delay 100ms
}
