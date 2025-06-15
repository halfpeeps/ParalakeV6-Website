window.onload = function() {
  var titleBanner = document.getElementById('title-banner');
  var mainBackground = document.getElementById('background');
  var authorLabel = document.getElementById('author');
  var logo = document.getElementById('logo');
  var imageFolder = window.location.origin + "/loading/bg_images/";
  var timeBetweenImages = 10000;
  var BG1 = document.getElementById("BG1");
  var BG2 = document.getElementById("BG2");

  var imageData = [
    { name: "race.jpg", author: "Super_" },
    { name: "night.jpg", author: "Super_" }
  ];

  var shuffle = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  var current = 0;
  var showingBG1 = true;

  var showImage = function(index) {
    var img = imageData[index];
    var url = "url('" + imageFolder + img.name + "')";
    var nextBG = showingBG1 ? BG2 : BG1;
    var currentBG = showingBG1 ? BG1 : BG2;

    nextBG.style.backgroundImage = url;
    nextBG.classList.add("active");
    currentBG.classList.remove("active");

    authorLabel.innerText = img.author;
    showingBG1 = !showingBG1;
  };

  var nextImage = function() {
    current = (current + 1) % imageData.length;
    showImage(current);
  };

  shuffle(imageData);

  var hints = [
    { title: "GAMEPLAY TIP", description: "Pressing F1 opens the main control panel." },
    { title: "GAMEPLAY TIP", description: "Use /help to ask questions." }
  ];

  shuffle(hints);

  var tipTitle = document.getElementById('tip-title');
  var tipText = document.getElementById('tip-text');
  var currentTip = 0;

  var showNextTip = function() {
    tipTitle.innerText = hints[currentTip].title;
    tipText.innerText = hints[currentTip].description;
    currentTip = (currentTip + 1) % hints.length;
  };

  showImage(current);
  setInterval(nextImage, timeBetweenImages);
  showNextTip();
  setInterval(showNextTip, 15000);
};
