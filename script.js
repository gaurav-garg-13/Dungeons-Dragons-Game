let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
  {
    name: "stick",
    power: 5
  },
  {
    name: "dagger",
    power: 30
  },
  {
    name: "claw hammer",
    power: 50
  },
  {
    name: "sword",
    power: 100
  }
];

const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60
  },
  {
    name: "dragon",
    level: 20,
    health: 300
  }
];


const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store.\""
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store."
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters."
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster."
  },
  {
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, easterEgg],
    text: "The monster screams 'AAArrgrr!!..' as it dies. You gained experience points and gold."
  },
  {
    name: "lose",
    "button text": ["Replay?", "Replay?", "Replay?"],
    "button functions": [restart, restart, restart],
    text: "You died."
  },
  {
    name: "win",
    "button text": ["Replay?", "Replay?", "Replay?"],
    "button functions": [restart, restart, restart],
    text: "You defeated the Dragon!. You become the Dragonborn."
  },
  {
    name: "easterEgg",
    "button text": ["Roll Dice", "Go to town", "Go to cave"],
    "button functions": [rollDice, goTown, goCave],
    text: "You find a secret game. Roll a 10 faced die. Ten numbers will be randomly chosen between 1 and 10. If the number you rolled matches one of the random numbers, you win a reward!. \n!!BEWARE!! There's also a penalty for loosing."
  }
]
// initialize buttons

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location){
  monsterStats.style.display = "none"
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerText = location.text;
}


function goStore(){
  update(locations[1]);
}

function goTown(){
  update(locations[0]);
}

function goCave(){
  update(locations[2])
}

function buyHealth(){
  if (gold>=10){
    gold-=10;
    health+=10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon(){
  if (currentWeapon < weapons.length-1){
    if (gold >= 30){
      gold-=30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a "+ newWeapon +  ".\n";
      inventory.push(newWeapon);
      text.innerText += "In your inventory you have: " + inventory+".";
    } else {
      text.innerText = "You do not have enough gold to buy " + weapons[currentWeapon + 1].name + ".";
    }
  } else{
    text.innerText = "You already have the most powerful weapon."; 
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon(){
  if (inventory.length > 1){
    gold+=15;
    goldText.innerText = gold;
    let currenWeapon = inventory.shift();
    text.innerText = "You sold a " + currenWeapon + ".";
    text.innerText += "In your inventory you have: " + inventory;
  } else{
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime(){
  fighting = 0;
  goFight();
}
function fightBeast(){
  fighting = 1;
  goFight();
}
function fightDragon(){
  fighting = 2;
  goFight();
}

function goFight(){
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";  
  monsterNameText.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
  
}

function attack(){
  text.innerText = "The " + monsters[fighting].name + " attacks.\n";
  text.innerText += "You attack it with your " + weapons[currentWeapon].name + ".\n";
  if (isMonsterHit() || health<=20){
    let damage = weapons[currentWeapon].power + Math.floor(Math.random() * xp) +1;
    monsterHealth -= damage;
    damage >= monsters[fighting].health * 0.3 ? text.innerText += "CRITICAL HIT!! " : text.innerText += "Hit! ";
    text.innerText += "You did " + damage + " damage.\n"
  } else{
    text.innerText += "You missed."
  }
  monsterHealthText.innerText = Math.max(monsterHealth, 0);
  if (monsterHealth<=0){
    fighting == 2 ? winGame() : defeatMonster();
    return;
  }

  health -=  getMonsterAttack(monsters[fighting].level);
  healthText.innerText = Math.max(0, health);
  if (health<=0){
    lose();
  }

  if (Math.random() < 0.05 && inventory.length !== 1){
    text.innerText += "Your " + inventory.pop() + " breaks.";
    currentWeapon--;
    text.innerText += "You now have " + weapons[currentWeapon].name + " .";
  }
  
}

function isMonsterHit(){
  return Math.random() > 0.2;
}

function getMonsterAttack(level){
  let hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return Math.max(hit, 0);
}

function dodge(){
  text.innerText = "You dodged.";
}

function defeatMonster(){
  gold+=Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose(){
  update(locations[5]);
}

function winGame(){
  update(locations[6]);
}

function restart(){
  xp = 0;
	health = 100;
	gold = 50;
	currentWeapon = 0;
	inventory = ["stick"];
	goldText.innerText = gold;
	healthText.innerText = health;
	xpText.innerText = xp;
	goTown();
}

function easterEgg(){
  update(locations[7]);
}

function rollDice(){
  let dice = Math.floor(Math.random() * 11);
  let numbers = [];
  while (numbers.length < 10){
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + dice + ". Here are the random numbers:\n";

    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\n";
    }

    if (numbers.indexOf(dice) !== -1) {
        text.innerText += "Right! You win 20 gold!"
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "Wrong! You lose 10 health!"
        health -= 10;
        healthText.innerText = health
        if (health <= 0) {
          lose();
        }
    }
}