const textDisplay = $("#textDisplay");
const textInput = $("#textInput");
const timeLabel = $("#timeLabel");
const alerts = $("#alerts");
const messages = $("#messages");
const time = $("#time");
const bets = $("#bets");
const bet = $("#bet");
const betLabel = $("#betLabel");
const restartBtn = $("#restartBtn");
const betBtns = $('.betBtn');

let wordNo = 1;
let wordsCorrect = 0;
let timer = 30;
let flag = 0;
let gameId = -1;
let seconds;
let numWords;
let contractDetails;

textInput.on("input", inputCheck);
textInput.on("keydown", backspaceCheck);
restartBtn.on("click", restart);
betBtns.on("click", initiateChallenge);

init();

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
  wordNo = 1;
  wordsCorrect = 0;
  flag = 0;
  gameId = -1;

  time.removeClass("current");
  time.text(timer);
  timeLabel.text("Time");
  textDisplay.html('');
  restartBtn.hide();
  betLabel.text("Bet");
  bet.text('.00');
  clearAlerts();
  hideMessages();
  hideMessage();
  showBets();
  unhighlightStats();
  enableInput();
  enableBets();

  clearInterval(seconds);
  displayTest();
};

function timeStart() {
  clearAlerts();
  hideBets();
  showPracticeStart();
  showMessages();
  disableBets();

  seconds = setInterval(function() {
    time.text(time.text() -1);  
    if (time.text() == "-1") {
      timeEnd();
    }
  }, 1000);
}

function timeEnd() {
  clearInterval(seconds);
  restartBtn.show();
  disableInput();
  processResult();
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
    timeEnd();
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

function init() {
  fetch('/contract/details')
    .then(response => {
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      return response.json();
    })
    .then(data => {
      console.log
      contractDetails = data;
      console.log(contractDetails);
      displayTest();
    })
    .catch(error => {
      disableBets();
      disableInput();
      displayAlert('01', 'Error loading Dapp. Could not get smart contract details.');
    })
}

function displayTest() {
  fetch('/contract/getDifficulty')
    .then(response => {
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      return response.json();
    })
    .then(data => {
      numWords = data.difficulty;

      const newWords = randomWords(numWords);
      newWords.forEach(function(word, i) {
        let wordSpan = $("<span></span>");
        wordSpan.text(word);
        wordSpan.attr("id", "word" + (i+1));
        textDisplay.append(wordSpan);
        textDisplay.append(" ");
      });
    
      const nextId = "word" + wordNo;
      colorSpan(nextId, 2);
    })
    .catch(error => {
      disableBets();
      disableInput();
      displayAlert('01', 'Error loading Dapp. Could not read from smart contract.<br><br>Chain: ' + networkDetails.chainName + '<br>Address: ' + contractDetails.address);
    })
}

function randomWords(num) {
  var basicWords = ["a", "about", "above", "across", "act",  "add", "afraid", "after", "again", "age", "ago", "agree", "air", "all", "alone", "along", "always", "am", "amount", "an", "and", "angry", "another", "answer", "any", "anyone",  "appear", "apple", "are", "area", "arm", "army", "around", "arrive", "art", "as", "ask", "at", "aunt",  "away", "baby", "back", "bad", "bag", "ball", "bank", "base",  "bath", "be", "bean", "bear",  "bed", "beer", "before", "begin", "bell", "below", "best", "big", "bird", "birth",  "bit", "bite", "black", "bleed", "block", "blood", "blow", "blue", "board", "boat", "body", "boil", "bone", "book", "border", "born", "both",  "bowl", "box", "boy", "branch", "brave", "bread", "break", "breathe", "bridge", "bright", "bring", "brother", "brown", "brush", "build", "burn",  "bus", "busy", "but", "buy", "by", "cake", "call", "can",  "cap", "car", "card", "care", "carry", "case", "cat", "catch",  "chair", "chase", "cheap", "cheese",  "child",   "choice",  "circle", "city", "class", "clever", "clean", "clear", "climb", "clock", "cloth",  "cloud",  "close", "coffee", "coat", "coin", "cold",  "colour", "comb",  "common", "compare", "come",  "control", "cook", "cool", "copper", "corn", "corner", "correct", "cost",  "count",   "cover", "crash", "cross", "cry", "cup",  "cut", "dance",  "dark",  "day", "dead", "decide", "deep", "deer",  "desk",   "die",  "dirty",  "dish", "do", "dog", "door",  "down", "draw", "dream", "dress", "drink", "drive", "drop", "dry", "duck", "dust", "duty", "each", "ear", "early", "earn", "earth", "east", "easy", "eat", "effect", "egg", "eight",   "else", "empty", "end", "enemy", "enjoy",  "enter", "equal",  "even",  "event", "ever", "every",  "exact",   "except",  "expect",  "explain",  "eye", "face", "fact", "fail", "fall", "false", "family", "famous", "far", "farm",  "fast", "fat", "fault", "fear", "feed", "feel", "fever", "few", "fight", "fill", "film", "find", "fine",  "fire", "first", "fish", "fit", "five", "fix", "flag", "flat", "float", "floor", "flour",  "fly", "fold", "food", "fool", "foot", "for", "force",  "forest", "forget",  "fork", "form", "fox", "four", "free", "freeze", "fresh", "friend",  "from", "front", "fruit", "full", "fun", "funny",   "future", "game",  "gate","get", "gift", "give", "glad", "glass", "go", "goat", "god", "gold", "good",   "grass", "grave", "great", "green", "gray",  "group", "grow", "gun", "hair", "half", "hall",  "hand",  "happy", "hard", "hat", "hate", "have", "he", "head",  "hear", "heavy", "heart",  "hello", "help", "hen", "her", "here", "hers", "hide", "high", "hill", "him", "his", "hit", "hobby", "hold", "hole",  "home", "hope", "horse",  "hot", "hotel", "house", "how",  "hour", "hurry",  "hurt", "I", "ice", "idea", "if",  "in",   "into", "invent", "iron",  "is", "island", "it", "its", "jelly", "job", "join", "juice", "jump", "just", "keep", "key", "kill", "kind", "king",  "knee", "knife", "knock", "know", "lady", "lamp", "land", "large", "last", "late", "laugh", "lazy", "lead", "leaf", "learn", "leave", "leg", "left", "lend", "length", "less", "lesson", "let", "letter", "lie", "life", "light", "like", "lion", "lip", "list",  "live", "lock", "lonely", "long", "look", "lose", "lot", "love", "low", "lower", "luck",  "main", "make", "male", "man", "many", "map", "mark", "may", "me", "meal", "mean", "meat",  "meet",  "milk", "mind",  "miss",  "mix", "model",   "money",  "month", "moon", "more",  "most",  "mouth", "move", "much", "music", "must", "my", "name",  "near", "neck", "need", "needle",  "net", "never", "new", "news",  "next", "nice", "night", "nine", "no", "noble", "noise", "none", "nor", "north", "nose", "not",  "notice", "now",  "obey",  "ocean", "of", "off", "offer", "office", "often", "oil", "old", "on", "one", "only", "open",  "or", "orange", "order", "other", "our", "out",  "over", "own", "page", "pain", "paint", "pair", "pan", "paper",  "park", "part",  "party", "pass", "past", "path", "pay", "peace", "pen",   "per",  "piano", "pick",  "piece", "pig", "pin", "pink", "place", "plane", "plant",  "plate", "play", "please",  "plenty",  "point",  "polite", "pool", "poor",    "pour", "power",  "press", "pretty",  "price", "prince", "prison",  "prize",      "pull", "punish", "pupil", "push", "put", "queen",  "quick", "quiet", "radio", "rain", "rainy", "raise", "reach", "read", "ready", "real",  "red",   "rent",   "reply", "rest",  "rice", "rich", "ride", "right", "ring", "rise", "road", "rob", "rock", "room", "round", "rude", "rule", "ruler", "run", "rush", "sad", "safe", "sail", "salt", "same", "sand", "save", "say", "school",  "search", "seat", "second", "see", "seem", "sell", "send",  "serve", "seven", "shade",  "shake", "shape", "share", "sharp", "she", "sheep", "sheet",  "shine", "ship", "shirt", "shoe", "shoot", "shop", "short",   "shout", "show", "sick", "side",   "silly", "silver",  "simple", "single", "since", "sing", "sink", "sister", "sit", "six", "size", "skill", "skin", "skirt", "sky", "sleep", "slip", "slow", "small", "smell", "smile", "smoke", "snow", "so", "soap", "sock", "soft", "some",  "son", "soon", "sorry", "sound", "soup", "south", "space", "speak",  "speed", "spell", "spend", "spoon", "sport", "spread", "spring", "square", "stamp", "stand", "star", "start",  "stay", "steal", "steam", "step", "still",  "stone", "stop", "store", "storm", "story",  "street", "study", "stupid",  "such", "sugar",  "sun", "sunny",  "sure",  "sweet", "swim", "sword", "table", "take", "talk", "tall", "taste", "taxi", "tea", "teach", "team", "tear",   "tell", "ten", "tennis", "test", "than", "that", "the", "their", "then", "there",  "these", "thick", "thin", "thing", "think", "third", "this",  "threat", "three", "tidy", "tie", "title", "to", "today", "toe", "too", "tool", "tooth", "top", "total", "touch", "town", "train", "tram",  "tree",  "true", "trust", "twice", "try", "turn", "type", "ugly", "uncle", "under",  "unit", "until", "up", "use", "useful", "usual", "usually",  "very",  "voice", "visit", "wait", "wake", "walk", "want", "warm", "was", "wash", "waste", "watch", "water", "way", "we", "weak", "wear",  "week", "weight",  "were", "well", "west", "wet", "what", "wheel", "when", "where", "which", "while", "white", "who", "why", "wide", "wife", "wild", "will", "win", "wind",  "wine",  "wire", "wise", "wish", "with",  "woman",  "word", "work", "world", "worry", "yard", "yell",  "yet", "you", "young", "your", "zero", "zoo"];

  var selectedWords = [];
  for (var i=0; i<num; i++) {
    var randomNumber = Math.floor(Math.random() * basicWords.length);
    selectedWords.push(basicWords[randomNumber]);
  }

  return selectedWords;
}

async function initiateChallenge() {
  if (flag == 1) {
    return; 
  }

  clearAlerts();
  disableBets();
  disableInput();

  // Check metamask 
  const metaInstalled = await Moralis.isMetaMaskInstalled();
  if (!metaInstalled) {
    displayAlert('02', 'Could not connect to the blockchain. Please install  <a target="_blank" href="https://metamask.io/">MetaMask</a> to place a bet.');
    enableBets();
    enableInput();
    return;
  }

  // Enable web3
  await Moralis.enableWeb3();

  // Switch to required network
  const currentChainId = await Moralis.getChainId();
  if (currentChainId != requiredChainId) {
    const requiredNetworkName = getNetworkName(requiredChainId);
    displayAlert('02', 'MetaMask must be connected to the <b>' + requiredNetworkName + '</b> to place a bet.<br><br> <a class="alert-link" data-bs-dismiss="alert" href="#" onClick="switchNetwork()">Switch to this Network</a>');
    enableBets();
    enableInput();
    return;
  }

  // Get bet value
  const betValue = parseFloat($(this).data().value);

  // Set transaction options
  const options = {
    contractAddress: contractDetails.address,
    abi: contractDetails.abi,
    functionName: "newGame",
    msgValue: Moralis.Units.ETH(betValue)
  };

  // Make transaction
  try {
    transaction = await Moralis.executeFunction(options);
    hideBets();
    showMessages();
    showPending();
    const result = await transaction.wait(1);
    const contractEvent = result.events.filter((event) => event.args)[0];
    gameId = contractEvent.args.id.toNumber();
    let player = contractEvent.args.id.toNumber();
    let betValue = Moralis.Units.FromWei(contractEvent.args.bet);
    betValue = formatFloat(betValue);
    bet.text(betValue);
    highlightStats();
    showStart();
    enableInput();
  } catch(error) {
    if (error.code != 4001) {
      console.log(error);
      let msg = 'Error sending transaction to smart contract';
      let err = error.data ? ': <br>' + error.data.message : '.';
      displayAlert('02', msg + err);
    }
    hideMessages();
    showBets();
    hideMessage();
    enableBets();
    enableInput();
    return;
  }
};

async function switchNetwork() {
  try {
    await Moralis.switchNetwork(requiredChainId);
  } catch(error) {
    if (error.code == 4902) {
      await Moralis.addNetwork(
        networkDetails.chainId, 
        networkDetails.chainName, 
        networkDetails.currencyName, 
        networkDetails.currencySymbol, 
        networkDetails.rpcUrl,
        networkDetails.blockExplorerUrl
      );
    }
  }
}

function getNetworkName(chainID){
  networks = {
      1:"Ethereum Mainnet",
      4:"Ethereum Rinkeby",
      97:"Binance Smart Chain Testnet",
      43114: "Avalanche Mainnet",
      43113: "Avalanche Testnet",
      80001:"Polygon Mumbai Testnet"
  }
  return networks[chainID];
}

function formatFloat(val) {
  val = val.toString();
  val = val[0] == '0' && val.length > 0 ? val.slice(1) : val
  val = val.length == 2 ? val + '0' : val;
  return val;
}


function displayAlert(alertType, message){
  alertTypes = {
    "00": "alert-success",
    "01": "alert-danger",
    "02": "alert-warning"
  }
  let alert = `<div class="alert ${alertTypes[alertType]} alert-dismissible" role="alert">${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
  alerts.html(alert);
}

function processResult() {
  const win = wordsCorrect >= numWords;
  const percentCorrect = Math.floor((wordsCorrect / numWords) * 100);
  time.text(percentCorrect + "%");
  timeLabel.text("PC");
  betLabel.text("Won");

  if (gameId == -1) {
    if (win) {
      messages.html('<p>Nice practice run! Start a new challenge and place a bet to win AVAX.</p>');
    } else {
      messages.html('<p>Almost! Start a new challenge to keep practicing, and place a bed to win AVAX.</p>');
    }
    return; 
  }

  if (win) {
    messages.html(
      '<div class="spinner-border spinner-border-sm text-light" role="status"></div><p class="inline"> Woohoo! You won! Releasing winnings now...</p>'
    );
    let wonValue = (bet.text() * 2);
    wonValue = formatFloat(wonValue);
    bet.text(wonValue);
  } else {
    messages.html('<p>Almost! Start a new challenge to win AVAX.</p>');
    bet.text('.00');
  }

  fetch('/contract/endgame/' + gameId + '/' + +win)
    .then(response => {
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      const transaction = data.transaction;
      console.log(transaction);
      if (win) {
        messages.html(
          `Your AVAX reward has been sent! View transaction <a class="yellow" target="_blank" href="${networkDetails.blockExplorerUrl}/tx/${transaction.transactionHash}">here</a>.`
        );
      }
    })
    .catch(error => {
      disableBets();
      disableInput();
      displayAlert('01', 'Error processing result.');
    })
}

function clearAlerts() {
  alerts.html('');
}

function disableBets() {
  betBtns.prop('disabled', true);
}

function enableBets() {
  betBtns.prop('disabled', false);
}

function enableInput() {
  textInput.prop('disabled', false);
  textInput.val('');
  textInput.focus();
}

function disableInput() {
  textInput.val('');
  textInput.prop('disabled', true);
}

function showPending() {
  messages.html('<div class="spinner-border spinner-border-sm text-light" role="status"></div><p class="inline"> Transaction pending...</p>');
}

function showStart() {
  messages.html('<p>AVAX bet received. Begin typing below to start.</p>')
}

function showPracticeStart() {
  messages.html('Practice challenge started.')
}

function hideMessage() {
  messages.html('');
}

function highlightStats() {
  bet.addClass('current');
  time.addClass('current');
}

function unhighlightStats() {
  bet.removeClass('current');
  time.removeClass('current');
}

function showBets() {
  bets.show();
}

function hideBets() {
  bets.hide();
}

function showMessages() {
  messages.show();
}

function hideMessages() {
  messages.hide();
}