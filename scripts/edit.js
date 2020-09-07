var data = null;

function loadSettings() {
  var confettiToggle = document.querySelector("#confetti");
  confettiToggle.checked = Boolean(data.settings.confetti);
}

function showDays(choreIdx, choreElm) {
  var chore = data.chores[choreIdx];

  var choreBottomElm = document.createElement('div');
  choreBottomElm.classList.add('choreBottom');

  for (var dayIdx in DAYS) {
    var dayStr = DAYS[dayIdx];
    var dayToggle = document.createElement('div');
    dayToggle.classList.add('dayOfWeek');
    dayToggle.classList.add(DAYS[dayIdx]);
    if (chore.days.includes(Number(dayIdx))) {
      dayToggle.classList.add('active');
    }
    dayToggle.addEventListener('click', generateToggleDay(choreIdx, dayIdx));
    dayToggle.innerHTML = dayStr;
    choreBottomElm.appendChild(dayToggle);
  }
  choreElm.appendChild(choreBottomElm);
}

function showChoreTitle(choreIdx, choreElm) {
  var chore = data.chores[choreIdx];

  var choreTopElm = document.createElement('div');
  choreTopElm.classList.add('choreTop');

  var choreTextElm = document.createElement('div');
  choreTextElm.classList.add('choreText');
  choreTextElm.innerHTML = "✏️ " + chore.title;
  choreTextElm.addEventListener('click', generateRenameChore(choreIdx));
  choreTopElm.appendChild(choreTextElm);

  var buttonsElm = document.createElement('div');
  buttonsElm.classList.add('buttons');

  var doneElm = document.createElement('div');
  doneElm.classList.add('button');
  doneElm.classList.add('dismiss');
  doneElm.innerHTML = "Dismiss";
  doneElm.addEventListener('click', generateRemoveChore(choreIdx));
  buttonsElm.appendChild(doneElm);

  choreTopElm.appendChild(buttonsElm);
  choreElm.appendChild(choreTopElm);
}

function showChore(choreIdx, editList) {
  var chore = data.chores[choreIdx];
  var choreElm = document.createElement('div');
  choreElm.classList.add('chore');

  showChoreTitle(choreIdx, choreElm);
  showDays(choreIdx, choreElm);

  editList.appendChild(choreElm);
}

function showChores() {
  var editList = document.querySelector('#editList');

  // Clear old chores
  while (editList.firstChild) {
    editList.removeChild(editList.lastChild);
  }

  for (var choreIdx in data.chores) {
    showChore(choreIdx, editList);
  }
}

function generateRemoveChore(choreIdx) {
  return function() {
    data.chores.splice(choreIdx, 1);
    saveData(data);
    loadChoresForDay(data);
    showChores();
  };
}

function generateRenameChore(choreIdx) {
  return function() {
    var oldTitle = data.chores[choreIdx].title;
    var newTitle = prompt("Rename chore", oldTitle);
    if (newTitle != null) {
      data.chores[choreIdx].title = newTitle;
      saveData(data);
      loadChoresForDay(data);
      showChores();
    }
  };
}

function generateToggleDay(choreIdx, dayIdx) {
  dayIdx = Number(dayIdx);
  return function() {
    var chore = data.chores[choreIdx];
      var isActive = chore.days.includes(dayIdx);

    if (!isActive) {
      chore.days.push(dayIdx);
    } else {
      for (var daysIdx in chore.days) {
        if (chore.days[daysIdx] == dayIdx) {
          chore.days.splice(daysIdx, 1);
          break;
        }
      }
    }
    // hard refresh
    saveData(data);
    loadChoresForDay(data);
    showChores();
  };
}

function connectButtons() {
  var confettiToggle = document.querySelector("#confetti");

  document.querySelector('#addChore')
    .addEventListener('click', function() {
      var title = prompt("What task do you need to add?", "Water plants");
      if (title != null) {
        data.chores.push(
          { 'title': title,
            'days': [0,1,2,3,4,5,6],
          });
        saveData(data);
        loadChoresForDay(data);
        showChores();
      }
    });

  document.querySelector('#done')
    .addEventListener('click', function() {
      saveData(data);
      window.location = './';
    });

  confettiToggle.addEventListener('click', function() {
    data.settings.confetti = confettiToggle.checked;
    saveData(data);
  });
}

window.onload = function() {
  connectButtons();
  data = getData();
  loadSettings();
  showChores();
};

