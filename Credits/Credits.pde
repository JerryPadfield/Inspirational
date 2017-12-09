import processing.sound.*;

String text="Inspirational Working Methods";
//String text="Cage's Method";
//String text="The I Ching";
//String text="Influence";
String subtitle="1: John Cage";

float counter=0;
PFont theFont;
static final float MIN_BLUR=1;
boolean RECORDING=false;
float blurFactor=6;
SequenceState state=SequenceState.START;
float offset=0;
String [] filmmakers = { "Annemarie Bala", "Touqeer Ahmad", "Jerry Padfield" };
String firstName;
int filmmaker=2;
static final int STROKEWEIGHT=1;
static final int TEXT_SIZE=32;
static final int FRAMERATE=12;
//PShader blur;
static final float NOISE_INC=0.03;

enum SequenceState {
  START,
  END
};
SoundFile keySound, spaceSound, carriageReturn;

void setup(){
 // size(1280, 720);
 fullScreen(); noCursor();
  theFont=createFont("Courier New", TEXT_SIZE);
  textFont(theFont);
  strokeWeight(STROKEWEIGHT);
  frameRate(FRAMERATE);
  keySound = new SoundFile(this, "keysound.wav");
  spaceSound=new SoundFile(this, "spacebar.mp3");
  carriageReturn=new SoundFile(this, "carriage.wav");
//  blur=loadShader("blur.glsl");
  firstName=getFirstWord(filmmakers[filmmaker]);
}
void screenshot(){
  if (state==SequenceState.START){
    saveFrame("data/frame-######.png");
  } else {
    saveFrame("data/"+firstName+"/frame"+filmmaker+"-######.png");
  }
}

private String getFirstWord(String text) {
    if (text.indexOf(' ') > -1) { // Check if there is more than one word.
      return text.substring(0, text.indexOf(' ')); // Extract first word.
    } else {
      return text; // Text is the first word itself.
    }
}

void draw(){
   surface.setTitle(int(frameRate) + " fps");
  if (state==SequenceState.START){
    drawStartSequence();
  } else if (state==SequenceState.END){
    drawEndSequence();
  }
  //println("In draw: "+frameCount);
  if (RECORDING){
    screenshot();
    if (frameCount==120){
      exit();
    }
  }

}

String credit1="1: John Cage";
String credit2="by "+filmmakers[filmmaker]; //Touqeer Ahmad, Annemarie Bala, Jerry Padfield";
String credit3="(c) 2017";

void drawEndSequence(){
  background(255);
  stroke(0);fill(0);
 // drawLine();
//  blurFactor-=0.1;
//  if (blurFactor<=MIN_BLUR) blurFactor=MIN_BLUR;
//  filter(BLUR, blurFactor);
//  filter(THRESHOLD, 0.9);
  textAlign(CENTER);
  int j=0;
  for (int i=0;i<text.length(); i++){
    textSize(TEXT_SIZE+noise(counter+=NOISE_INC)*24);
    text(text.charAt(i), 128+j, 180);
    j+=TEXT_SIZE+2;
  }
  j=0;
  for (int i=0;i<credit1.length(); i++){
    textSize(TEXT_SIZE-12+noise(counter+=NOISE_INC)*24);
    text(credit1.charAt(i), 128+j, 230);
    j+=TEXT_SIZE+4;
  }
  j=0;
  for (int i=0;i<credit2.length(); i++){
    textSize(TEXT_SIZE-12+noise(counter+=NOISE_INC)*24);
    text(credit2.charAt(i), j+128, 260);
    j+=TEXT_SIZE+4;
  }
  j=0;
  for (int i=0;i<credit3.length(); i++){
    textSize(TEXT_SIZE-12+noise(counter+=NOISE_INC)*24);
    text(credit3.charAt(i), j+128, 290);
    j+=TEXT_SIZE+4;
  }
}
int lettersCounter2=0;
int lettersCounter=0;
boolean firstRowDrawn=false;
void drawStartSequence(){
  background(255);
  stroke(0);fill(0);
  textAlign(CENTER);
  int j=0;
  int tl=text.length();
  
  if ((int)random(21) % 3 == 0 && lettersCounter <tl){ // fix
    lettersCounter++;
    if (text.charAt(lettersCounter-1)!=' ')
      keySound.play();
    else {
       spaceSound.play();
    }
  }
  if (lettersCounter>=tl){
    lettersCounter=tl;
    if (!firstRowDrawn){
      firstRowDrawn=true;
      carriageReturn.play();
    }
  }
  for (int i=0;i<lettersCounter; i++){
    textSize(TEXT_SIZE+noise(counter+=NOISE_INC)*24);
//    text(text.charAt(i), width/2+j-128, height/2);
      text(text.charAt(i), 128+j, 180);
    j+=TEXT_SIZE+2;
  }
  //blurFactor-=0.1;
  //if (blurFactor<=MIN_BLUR) blurFactor=MIN_BLUR;
 // filter(BLUR, blurFactor);
//  filter(THRESHOLD, 0.9);
  //drawLine();
}

void drawLine(){
  float f=0;
  offset=random(0, 255);
  for (int i=0; i<width; i++){
    beginShape(LINES);
     vertex(i, height/2+noise(offset+(f+=0.01))*height/2.2);
     vertex(i+1, height/2+noise(offset+f+0.01)*height/2.2);
    endShape();
  }
}

public void keyPressed(){
  if (key == 'S' || key == 's'){
    screenshot();
  }
}