/*
 * https://github.com/Brianfit/I-Ching/blob/master/yarrow-sort.js
 * https://www.onlineclarity.co.uk/learn/beginners/3-how-to-cast-a-reading/trace-the-changes/
 * 
 */

RECT_WIDTH=80;
RECT_HEIGHT=25;
WEAK=0;STRONG=1;

function Yao(i) {
  this.isChanging=function(){ return this.changing; };
  this.draw=function(){
      stroke(255);
      fill(255);
      rect(0, 0, RECT_WIDTH, RECT_HEIGHT);
      if (this.changing && this.lineStyle == WEAK){
         text("X", RECT_WIDTH+(RECT_WIDTH/2)-8, RECT_HEIGHT-2);
      }
      else if (this.changing && this.lineStyle == STRONG) {
        rect(RECT_WIDTH, 0, RECT_WIDTH, RECT_HEIGHT);
        fill(0);
        text("O", RECT_WIDTH+(RECT_WIDTH/2)-8, RECT_HEIGHT-2);
        fill(255);
      }
      else if (!this.changing && this.lineStyle == STRONG) {
        rect(RECT_WIDTH, 0, RECT_WIDTH, RECT_HEIGHT);
      }  
      else if (!this.changing && this.lineStyle == WEAK) {
        // nothing
      }
      rect(RECT_WIDTH*2, 0, RECT_WIDTH, RECT_HEIGHT);
    };

    this.numericValue=i;
    switch (i){
      case 6:
        this.changing=true;
        this.lineStyle=WEAK;
        break;
      case 7:
        this.changing=false;
        this.lineStyle=STRONG;
        break;
      case 8: 
        this.changing=false;
        this.lineStyle=WEAK;
        break;
      case 9:
        this.changing=true;
        this.lineStyle=STRONG;
        break;
    }
}

function Bagua() { // Trigram
  
  this.yaos=[];
  this.hasChanging=function(){
   var changing=false;
   for (var i=0; i<3; i++){
     if (this.yaos[i].isChanging()){
       changing=true;
     }
   }
   return changing;
 };

  for (var i=0; i<3; i++){
    this.yaos[i]=lineCast();
  }
  this.draw=function(){
    for (var i=0; i<3; i++){
      push();
      translate(0, i*(RECT_HEIGHT+5));
      this.yaos[i].draw();
      pop();
    }
  };
}

function Hexagram() {
  this.baguas=[];
  this.hasChanging=function(){
    var changing=false;
    for (var i=0; i<2; i++){
      if (this.baguas[i].hasChanging())
        changing=true;
    }
    return changing;
  };

  for (var i=0; i<2; i++){
    this.baguas[i]=new Bagua();
  }
  
  this.draw=function(){
    for (var i=1; i>=0; i--){
      push();
      translate(0, (1-i)*(RECT_HEIGHT+8)*3);
      this.baguas[i].draw();
      pop();
    }
    if (this.hasChanging()){
      
    }
  };
}

var stalks=50; 
var handPile;
var eastPile;
var westPile;
var eastRemainder;
var westRemainder;
var countValue1;
var countValue2;
var countValue3;
var lineValue;

function divideStalks(yarrowStalks){
// Divide 49 stalks into eastpile westpile
// Subtract one from westpile put in handpile
  westPile = Math.floor((Math.random() * yarrowStalks) + 1);
  eastPile = yarrowStalks - westPile;
  westPile--;
  handPile = 1;
}

function divideEastAndWest(){
  eastRemainder = (eastPile % 4);
  westRemainder = (westPile % 4);
  if (eastRemainder == 0)
    eastRemainder = 4;
  if (westRemainder == 0)
    westRemainder = 4;
  handPile += eastRemainder + westRemainder;
}

function lineCast(){
// This function creates the pictures of lines as broken or unbroken
// and changing or unchanging 

  stalks = 49; // Remove one stalk and set it aside

  divideStalks(stalks);
  // Divide 49 Yarrow stalks into two piles at random: East and West
  // Subtract a single stalk from the West and put it in your hand 
  // between thumb and pointer finger 
  divideEastAndWest();
  // Pick up stalks from the West pile in sets of 4 and set aside
  // until 4 or fewer stalks remain
  // Put those 4 or fewer stalks between your pointer and ring fingers
  // Now divide the West pile by 4 until 4 or fewer stalks remain
  // Remainder goes in hand again between ring and fourth finger
  // Now count the total remainder stalks in your hand
  // Remainder will always be 9 or 5 (1+x+x where x is 0-4)
  // If 9 stalks remain an arbitrary value of 2 was assigned to this step
  // If 5 stalks remain an arbitrary value of 3 was assigned.
  if (eastRemainder + westRemainder + 1 == 9)
    countValue1 = 2;
  if (eastRemainder + westRemainder + 1 == 5)
    countValue1 = 3;
  stalks -= handPile;
  // Remove stalks from you hand and set aside.
  divideStalks(stalks);
  // Now divide the pile of stalks before you into two piles again
  // And remove one from the West pile.
  divideEastAndWest();
  // And sort each pile again by sets of four stalks
  // Until 4 or fewer remain, place those remainder stalks in your hand 
  // As your stalks are now 49-9 = 40 or 49-5 = 44, minus 
  // the 1 you always take from the westpile
  // the number you are dividing by 4 is either 39 or 43:
  // the remainder will now always be 8 or 4
  // 1+1+2=4
  // 1+2+1=4
  // 1+3+4=8
  // 1+4+3=8
  // (4 can only occur once, as neither 39 nor 43 are evenly divisible
  // by 4)
  // If 8 stalks are in your hand, the arbitrary counting value is assigned 2
  // If 4 stalks, the counting value is assigned 3
  if (eastRemainder + westRemainder + 1 == 8) countValue2 = 2;
  if (eastRemainder + westRemainder + 1 == 4) countValue2 = 3;
  stalks -= handPile;
  // For the third and final time for this line, 
  // you set aside the 8 or 4 stalks in your HandPile
  divideStalks(stalks);
  // You now have 35, 31, or 39 stalks before you
  // Divide them into East and West piles for a third time
  divideEastAndWest();
  // Remove one from the west pile again
  // and repeat the removal of 4 stalks from each pile
  // the possible outcomes are again 8 or 4
  // and the same arbitrary count value is assigned as
  // in the last step: an 8 means that value = 2 and a 4 means 
  // it is assigned a 3.
  if (eastRemainder + westRemainder + 1 == 8) countValue3 = 2;
  if (eastRemainder + westRemainder + 1 == 4) countValue3 = 3;
  lineValue = countValue1 + countValue2 + countValue3;
  // You now have 3 counting values of 2 or 3 which you
  // add together. 
  // the results determine the nature of this single line:
  // If 7 Line = strong
  // If 8 Line = yielding
  // if 9 Line = strong but Changing
  // if 6 Line = yielding but Changing
  return new Yao(lineValue);
}
  
function _mousePressed(){  
    hex=new Hexagram();
}

var hex;
var theFont="Courier New, Courier, Monotype";

function setup() {
  var canvas=createCanvas(480, 320);
  canvas.parent('sketch-holder');
  canvas.mousePressed(_mousePressed);
  hex=new Hexagram();
}

function draw() {
  background(0);
  textFont(theFont);
  stroke(255);
  textSize(32);
//  text("Hexagram Generator \u4DC0", 100, 35);
  translate(width/2-(1.5*RECT_WIDTH), height/2-(3*RECT_HEIGHT));
  hex.draw();
}
