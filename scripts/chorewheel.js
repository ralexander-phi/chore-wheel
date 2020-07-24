const DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const DEFAULT_CHORES = {
  'chores': [
    { 'title': 'Dishes',
      'days': [0,1,2,3,4,5,6],
    },
  ],
  'currentChoreStatus': null,
  'currentDay': null,
}

window.onload = function() {
  var wheel = document.querySelector('#wheel');
  var heading = document.querySelector('h1');

  function showChores() {
    var chores = JSON.parse(localStorage.getItem('chores'));
    var todaysChores = chores['currentChoreStatus'];
    heading.innerHTML = 'Tasks for ' + DAYS[chores['currentDay']];

    // Clear old chores
    while (wheel.firstChild) {
      wheel.removeChild(wheel.lastChild);
    }

    for (var idx in todaysChores) {
      var chore = todaysChores[idx];
      var itemElm = document.createElement('div');
      itemElm.classList.add('task');
      if (chore['isDone']) {
        itemElm.classList.add('done');
      }
      itemElm.innerHTML = chore['title'];
      itemElm.addEventListener('click', tapTask);
      wheel.appendChild(itemElm);
    }
  }

  function tapTask(clickEvent) {
    var chores = JSON.parse(localStorage.getItem('chores'));

    var isDone = false;
    if (clickEvent.target.classList.contains('done')) {
      clickEvent.target.classList.remove('done');
    } else {
      clickEvent.target.classList.add('done');
      isDone = true;
    }

    var title = clickEvent.target.innerHTML;
    for (var choreIdx in chores['currentChoreStatus']) {
      var chore = chores['currentChoreStatus'][choreIdx];
      if (chore['title'] == title) {
        chore['isDone'] = isDone;
      }
    }

    if (isDone) {
      checkWin(chores);
    }

    localStorage.setItem('chores', JSON.stringify(chores));
  }

  function checkWin(chores) {
    for (var choreIdx in chores['currentChoreStatus']) {
      var chore = chores['currentChoreStatus'][choreIdx];
      if (!chore['isDone']) {
        // This chore is not done
        return;
      }
    }

    confetti.start(2000);
  }

  function loadNextDay() {
    var chores = JSON.parse(localStorage.getItem('chores'));
    dayOfWeek = chores['currentDay'];
    dayOfWeek = (dayOfWeek + 1) % 7;
    chores['currentDay'] = dayOfWeek;
    localStorage.setItem('chores', JSON.stringify(chores));
    loadChoresForDay();
  }

  function loadChoresForDay() {
    var chores = JSON.parse(localStorage.getItem('chores'));
    chores['currentChoreStatus'] = [];
    var dayOfWeek = chores['currentDay'];
    for (choreIdx in chores['chores']) {
      var chore = chores['chores'][choreIdx];
      if (chore['days'].includes(dayOfWeek)) {
        // This task needs to be done today
        chores['currentChoreStatus'].push({
            'title': chore['title'],
            'isDone': false
          });
      }
    }
    localStorage.setItem('chores', JSON.stringify(chores));
  }

  function initChores() {
    var chores = localStorage.getItem('chores');
    if (chores === null) {
      console.log('No chores, loading defaults');
      chores = DEFAULT_CHORES;
      var today = new Date();
      chores['currentDay'] = new Date().getDay();
      localStorage.setItem('chores', JSON.stringify(chores));
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
  }

  function load() {
    initChores();
    showChores();
    connectButtons();
  }

  load();
}
