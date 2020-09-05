var DEFAULT_CHORES = {
  'chores': [
    { 'title': 'Cook dinner', 'days': [0,1,2,3,4,5,6] },
    { 'title': 'Dishes', 'days': [0,1,2,3,4,5,6] },
    { 'title': 'Laundry', 'days': [6] },
    { 'title': 'Meal prep', 'days': [0] },
    { 'title': 'Put trash out', 'days': [3] },
    { 'title': 'Call mom', 'days': [5] },
    { 'title': 'Vacuum', 'days': [2] },
    { 'title': 'Mop', 'days': [4] },
  ],
  'currentChoreStatus': null,
  'currentDay': null,
  'settings': {
    'confetti': true,
  },
};

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
  saveChores(chores);
  loadChoresForDay();
}

function loadChoresForDay() {
  var chores = getChores();
  chores.currentChoreStatus = [];
  var dayOfWeek = chores.currentDay;
  for (var choreIdx in chores.chores) {
    var chore = chores.chores[choreIdx];
    if (chore.days.includes(dayOfWeek)) {
      // This task needs to be done today
      chores.currentChoreStatus.push({
          'title': chore.title,
          'isDone': false
        });
    }
  }
  saveChores(chores);
}

function initChores() {
  var reloadDay = false;
  if (window.location.hash == '#reload') {
    reloadDay = true;
  }

  var chores = getChores();
  if (chores === null) {
    console.log('No chores, loading defaults');
    chores = DEFAULT_CHORES;
    var today = new Date();
    chores.currentDay = new Date().getDay();
    saveChores(chores);
    reloadDay = true;
  }
  if (reloadDay) {
    loadChoresForDay();
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
  initChores();
  showChores();
  connectButtons();
};

