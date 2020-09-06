function showChores() {
  var wheel = document.querySelector('#wheel');
  var heading = document.querySelector('h1');

  var chores = getChores();
  var todaysChores = chores.currentChoreStatus;
  heading.innerHTML = 'Tasks for ' + DAYS[chores.currentDay];

  // Clear old chores
  while (wheel.firstChild) {
    wheel.removeChild(wheel.lastChild);
  }

  for (var idx in todaysChores) {
    var chore = todaysChores[idx];
    var itemElm = document.createElement('div');
    itemElm.classList.add('task');
    if (chore.isDone) {
      itemElm.classList.add('done');
    }
    itemElm.innerHTML = chore.title;
    itemElm.addEventListener('click', tapTask);
    wheel.appendChild(itemElm);
  }
}

function updateChoreCompletion(title, isDone) {
  var chores = getChores();
  for (var choreIdx in chores.currentChoreStatus) {
    var chore = chores.currentChoreStatus[choreIdx];
    if (chore.title == title) {
      chore.isDone = isDone;
    }
  }
  if (isDone) {
    checkWin(chores);
  }
  saveChores(chores);
}

function tapTask(clickEvent) {
  var isDone = false;
  if (clickEvent.target.classList.contains('done')) {
    clickEvent.target.classList.remove('done');
  } else {
    clickEvent.target.classList.add('done');
    isDone = true;
  }

  var title = clickEvent.target.innerHTML;
  updateChoreCompletion(title, isDone);
}

function checkWin(chores) {
  for (var choreIdx in chores.currentChoreStatus) {
    var chore = chores.currentChoreStatus[choreIdx];
    if (!chore.isDone) {
      // This chore is not done
      return;
    }
  }

  onWin(chores);
}

function onWin(chores) {
  if (confetti && chores.settings && chores.settings.confetti) {
    confetti.start(3000);
  }
}

function loadNextDay() {
  var chores = getChores();
  dayOfWeek = chores.currentDay;
  dayOfWeek = (dayOfWeek + 1) % 7;
  chores.currentDay = dayOfWeek;
  loadChoresForDay(chores);
}

function initChores() {
  var chores = getChores();
  if (window.location.hash === '#reload') {
    loadChoresForDay(chores);
  }
}

function connectButtons() {
  document.querySelector('#nextDay')
    .addEventListener('click', function() {
      loadNextDay();
      showChores();
    });
  document.querySelector('#editChores')
    .addEventListener('click', function() {
      window.location = 'edit.html';
    });
  document.querySelector('#about')
    .addEventListener('click', function() {
      window.location = 'about.html';
    });
}

window.onload = function() {
  // Previously used service workers should be removed
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (var i = 0; i < registrations.length; i++) {
      registrations[i].unregister();
    }
  });

  connectButtons();
  initChores();
  showChores();
};

