const textDisplay = $("#textDisplay");
const textInput = $("#textInput");
const timeName = $("#timeName");
const messageBox = $("#messageBox");
const time = $("#time");
const restartBtn = $("#restartBtn");
const betBtns = $('.betBtn');

let wordNo = 1;
let wordsCorrect = 0;
let timer = 30;
let flag = 0;
let seconds;
let numWords;

const networkDetails = {
  "chainId": 80001, 
  "chainName": "Polygon Mumbai Testnet",
  "currencyName": "MATIC",
  "currencySymbol": "MATIC",
  "rpcUrl": "https://rpc-mumbai.maticvigil.com/",
  "blockExplorerUrl": "https://mumbai.polygonscan.com/",
  "moralisName": "mumbai"
}

const serverUrl = "https://bzqvr83sfvmq.usemoralis.com:2053/server";
const appId = "1Cw7gzY2y533U8ADF7eH8FtSpWtmFRDhsrJMD0e2";

const requiredChainId = networkDetails.chainId;
const contractAddress = "0xbCB8b2d93e415030E72320F296D2A1Bc320bC7B4";
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "difficulty",
				"type": "uint256"
			}
		],
		"name": "DifficultyUpdated",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "newGame",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_difficulty",
				"type": "uint256"
			}
		],
		"name": "setDifficulty",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getDifficulty",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

textInput.on("input", inputCheck);
textInput.on("keydown", backspaceCheck);
restartBtn.on("click", restart);
betBtns.on("click", initiateChallenge);

Moralis.start({ serverUrl, appId });
displayTest();

function backspaceCheck(event) {
  var key = event.keyCode || event.charCode;
  const wordEntered = textInput.val();

  if ((key == 8 || key == 46) && wordEntered == "" && wordNo > 1) {
    const currentID = "word" + wordNo;
    $('#' + currentID).removeClass('current');

    wordNo--;
    
    const nextId = "word" + wordNo;
    if ($('#' + nextId).hasClass('correct')) {
      wordsCorrect--;
    }
    colorSpan(nextId, 2);
  }
}

function inputCheck(event) {
  if (flag == 0) {
    flag = 1;
    timeStart();
  }

  var charEntered = this.value;
  if (/\s/g.test(charEntered)){  //check if the character entered is a whitespace
    checkWord();
  } else{
    currentWord();
  }
};

function restart() {
  wordsCorrect = 0;
  flag = 0;

  time.removeClass("current");
  time.text(timer);
  timeName.text("Time");
  textInput.prop('disabled', false);
  textInput.val('');;
  textInput.focus();
  betBtns.prop('disabled', false);

  
  clearInterval(seconds);
  displayTest();
};


function timeStart() {
  betBtns.prop('disabled', true);
  restartBtn.hide();
  seconds = setInterval(function() {
    time.text(time.text() -1);
    if (time.text() == "-1") {
      endGame();
    }
  }, 1000);
}

function timeOver() {
  textInput.prop('disabled', true);
  restartBtn.show();
  displayScore();
}

function endGame() {
  timeOver();
  clearInterval(seconds);
}

function displayScore(){
  let percentageAcc = Math.floor((wordsCorrect / numWords) * 100);
  time.addClass("current");
  time.text(percentageAcc + "%");
  timeName.text("PA");
}

function currentWord() {
  const wordEntered = textInput.val();
  const currentID = "word" + wordNo;
  const currentWord = $('#' + currentID).text();

  if (wordEntered == currentWord.substring(0, wordEntered.length)) {
    colorSpan(currentID, 2);
  } else{
    colorSpan(currentID, 3);
  }
}

function checkWord() {
  const wordEntered = textInput.val().trim();
  textInput.val('');

  const wordID = "word" + wordNo;
  const checkSpan = $('#' + wordID);
  wordNo++;

  if (checkSpan.text() == wordEntered) {
    colorSpan(wordID, 1);
    wordsCorrect++;
  } else{
    colorSpan(wordID, 3);
  }

  if (wordNo > numWords){
    endGame();
  } else{
    const nextId = "word" + wordNo;
    colorSpan(nextId, 2);
  }
}

function colorSpan(id, color) {
  const span = $('#' + id);
  if (color == 1 ) {
    span.removeClass('wrong');
    span.removeClass('current');
    span.addClass('correct');
  } else if (color == 2) {
    span.removeClass('correct');
    span.removeClass('wrong');
    span.addClass('current');
  } else {
    span.removeClass('correct');
    span.removeClass('current');
    span.addClass('wrong');
  }
}

async function displayTest() {
  wordNo = 1;
  textDisplay.html('');

  const nativeOptions = {
    chain: networkDetails.moralisName,
    address: contractAddress,
    abi: contractABI,
    function_name: "getDifficulty",
  };

  try {
    numWords = await Moralis.Web3API.native.runContractFunction(nativeOptions);
  } catch (error) {
    betBtns.prop("disabled", true);
    textInput.prop('disabled', true);
    displayMessage('01', 'Error loading Dapp. Could not read from smart contract.<br><br>Chain: ' + networkDetails.chainName + '<br>Address: ' + contractAddress);
    return;
  }

  let newWords = randomWords(numWords);
  newWords.forEach(function(word, i) {
    var wordSpan = $("<span></span>");
    wordSpan.text(word);
    wordSpan.attr("id", "word" + (i+1));
    textDisplay.append(wordSpan);
    textDisplay.append(" ");
  });

  const nextId = "word" + wordNo;
  colorSpan(nextId, 2);
}

function randomWords(num) {
  var basicWords = ["a", "about", "above", "across", "act",  "add", "afraid", "after", "again", "age", "ago", "agree", "air", "all", "alone", "along", "always", "am", "amount", "an", "and", "angry", "another", "answer", "any", "anyone",  "appear", "apple", "are", "area", "arm", "army", "around", "arrive", "art", "as", "ask", "at", "aunt",  "away", "baby", "back", "bad", "bag", "ball", "bank", "base",  "bath", "be", "bean", "bear",  "bed", "beer", "before", "begin", "bell", "below", "best", "big", "bird", "birth",  "bit", "bite", "black", "bleed", "block", "blood", "blow", "blue", "board", "boat", "body", "boil", "bone", "book", "border", "born", "both",  "bowl", "box", "boy", "branch", "brave", "bread", "break", "breathe", "bridge", "bright", "bring", "brother", "brown", "brush", "build", "burn",  "bus", "busy", "but", "buy", "by", "cake", "call", "can",  "cap", "car", "card", "care", "carry", "case", "cat", "catch",  "chair", "chase", "cheap", "cheese",  "child",   "choice",  "circle", "city", "class", "clever", "clean", "clear", "climb", "clock", "cloth",  "cloud",  "close", "coffee", "coat", "coin", "cold",  "colour", "comb",  "common", "compare", "come",  "control", "cook", "cool", "copper", "corn", "corner", "correct", "cost",  "count",   "cover", "crash", "cross", "cry", "cup",  "cut", "dance",  "dark",  "day", "dead", "decide", "deep", "deer",  "desk",   "die",  "dirty",  "dish", "do", "dog", "door",  "down", "draw", "dream", "dress", "drink", "drive", "drop", "dry", "duck", "dust", "duty", "each", "ear", "early", "earn", "earth", "east", "easy", "eat", "effect", "egg", "eight",   "else", "empty", "end", "enemy", "enjoy",  "enter", "equal",  "even",  "event", "ever", "every",  "exact",   "except",  "expect",  "explain",  "eye", "face", "fact", "fail", "fall", "false", "family", "famous", "far", "farm",  "fast", "fat", "fault", "fear", "feed", "feel", "fever", "few", "fight", "fill", "film", "find", "fine",  "fire", "first", "fish", "fit", "five", "fix", "flag", "flat", "float", "floor", "flour",  "fly", "fold", "food", "fool", "foot", "for", "force",  "forest", "forget",  "fork", "form", "fox", "four", "free", "freeze", "fresh", "friend",  "from", "front", "fruit", "full", "fun", "funny",   "future", "game",  "gate","get", "gift", "give", "glad", "glass", "go", "goat", "god", "gold", "good",   "grass", "grave", "great", "green", "gray",  "group", "grow", "gun", "hair", "half", "hall",  "hand",  "happy", "hard", "hat", "hate", "have", "he", "head",  "hear", "heavy", "heart",  "hello", "help", "hen", "her", "here", "hers", "hide", "high", "hill", "him", "his", "hit", "hobby", "hold", "hole",  "home", "hope", "horse",  "hot", "hotel", "house", "how",  "hour", "hurry",  "hurt", "I", "ice", "idea", "if",  "in",   "into", "invent", "iron",  "is", "island", "it", "its", "jelly", "job", "join", "juice", "jump", "just", "keep", "key", "kill", "kind", "king",  "knee", "knife", "knock", "know", "lady", "lamp", "land", "large", "last", "late", "laugh", "lazy", "lead", "leaf", "learn", "leave", "leg", "left", "lend", "length", "less", "lesson", "let", "letter", "lie", "life", "light", "like", "lion", "lip", "list",  "live", "lock", "lonely", "long", "look", "lose", "lot", "love", "low", "lower", "luck",  "main", "make", "male", "man", "many", "map", "mark", "may", "me", "meal", "mean", "meat",  "meet",  "milk", "mind",  "miss",  "mix", "model",   "money",  "month", "moon", "more",  "most",  "mouth", "move", "much", "music", "must", "my", "name",  "near", "neck", "need", "needle",  "net", "never", "new", "news",  "next", "nice", "night", "nine", "no", "noble", "noise", "none", "nor", "north", "nose", "not",  "notice", "now",  "obey",  "ocean", "of", "off", "offer", "office", "often", "oil", "old", "on", "one", "only", "open",  "or", "orange", "order", "other", "our", "out",  "over", "own", "page", "pain", "paint", "pair", "pan", "paper",  "park", "part",  "party", "pass", "past", "path", "pay", "peace", "pen",   "per",  "piano", "pick",  "piece", "pig", "pin", "pink", "place", "plane", "plant",  "plate", "play", "please",  "plenty",  "point",  "polite", "pool", "poor",    "pour", "power",  "press", "pretty",  "price", "prince", "prison",  "prize",      "pull", "punish", "pupil", "push", "put", "queen",  "quick", "quiet", "radio", "rain", "rainy", "raise", "reach", "read", "ready", "real",  "red",   "rent",   "reply", "rest",  "rice", "rich", "ride", "right", "ring", "rise", "road", "rob", "rock", "room", "round", "rude", "rule", "ruler", "run", "rush", "sad", "safe", "sail", "salt", "same", "sand", "save", "say", "school",  "search", "seat", "second", "see", "seem", "sell", "send",  "serve", "seven", "sex", "shade",  "shake", "shape", "share", "sharp", "she", "sheep", "sheet",  "shine", "ship", "shirt", "shoe", "shoot", "shop", "short",   "shout", "show", "sick", "side",   "silly", "silver",  "simple", "single", "since", "sing", "sink", "sister", "sit", "six", "size", "skill", "skin", "skirt", "sky", "sleep", "slip", "slow", "small", "smell", "smile", "smoke", "snow", "so", "soap", "sock", "soft", "some",  "son", "soon", "sorry", "sound", "soup", "south", "space", "speak",  "speed", "spell", "spend", "spoon", "sport", "spread", "spring", "square", "stamp", "stand", "star", "start",  "stay", "steal", "steam", "step", "still",  "stone", "stop", "store", "storm", "story",  "street", "study", "stupid",  "such", "sugar",  "sun", "sunny",  "sure",  "sweet", "swim", "sword", "table", "take", "talk", "tall", "taste", "taxi", "tea", "teach", "team", "tear",   "tell", "ten", "tennis", "test", "than", "that", "the", "their", "then", "there",  "these", "thick", "thin", "thing", "think", "third", "this",  "threat", "three", "tidy", "tie", "title", "to", "today", "toe", "too", "tool", "tooth", "top", "total", "touch", "town", "train", "tram",  "tree",  "true", "trust", "twice", "try", "turn", "type", "ugly", "uncle", "under",  "unit", "until", "up", "use", "useful", "usual", "usually",  "very",  "voice", "visit", "wait", "wake", "walk", "want", "warm", "was", "wash", "waste", "watch", "water", "way", "we", "weak", "wear",  "week", "weight",  "were", "well", "west", "wet", "what", "wheel", "when", "where", "which", "while", "white", "who", "why", "wide", "wife", "wild", "will", "win", "wind",  "wine",  "wire", "wise", "wish", "with",  "woman",  "word", "work", "world", "worry", "yard", "yell",  "yet", "you", "young", "your", "zero", "zoo"];

  var selectedWords = [];
  for (var i=0; i<num; i++) {
    var randomNumber = Math.floor(Math.random() * basicWords.length);
    selectedWords.push(basicWords[randomNumber]);
  }

  return selectedWords;
}

async function initiateChallenge() {
  
  // Check metamask 
  try {
    await Moralis.enableWeb3();
    const metaInstalled = await Moralis.Web3.isMetaMaskInstalled();
  } catch(error) {
    displayMessage('01', '<a target="_blank" href="https://metamask.io/">MetaMask</a> must be installed to communicate with the blockchain.');
    return;
  } 

  // Switch to required network
  const currentChainId = await Moralis.getChainId();
  if (currentChainId != requiredChainId) {
    const requiredNetworkName = getNetworkName(requiredChainId);
    try {
      await Moralis.switchNetwork(requiredChainId);
    } catch(error) {
      if (error.code == 4902) {
        displayMessage('02', 'MetaMask must be connected to the <b>' + requiredNetworkName + '</b> to place a bet.<br><br> <a class="alert-link" data-bs-dismiss="alert" href="#" onClick="addNetwork()">Add This Network</a>');
      }
      return;
    }
  }

  // Get bet value
  const maticBet = parseFloat($(this).data().value);

  const options = {
    contractAddress: contractAddress,
    abi: contractABI,
    functionName: "newGame",
    msgValue: Moralis.Units.ETH(maticBet)
  };

  const receiptallowance = await Moralis.executeFunction(options);
  console.log(receiptallowance);


  alert('new game created');
};

async function addNetwork() {
  await Moralis.addNetwork(
    networkDetails.chainId, 
    networkDetails.chainName, 
    networkDetails.currencyName, 
    networkDetails.currencySymbol, 
    networkDetails.rpcUrl,
    networkDetails.blockExplorerUrl
  );
}

function getNetworkName(chainID){
  networks = {
      1:"Ethereum Mainnet",
      4:"Ethereum Rinkeby",
      97:"Binance Smart Chain Testnet",
      43114: "Avalanche Mainnet",
      80001:"Polygon Mumbai Testnet"
  }
  return networks[chainID];
}

function displayMessage(messageType, message){
  messages = {
      "00": '<div class="alert alert-success alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>',
      "01": '<div class="alert alert-danger alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>',
      "02": '<div class="alert alert-warning alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>',
  }
  messageBox.html(messages[messageType]);
}