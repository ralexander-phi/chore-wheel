var data = null;

function loadSettings() {
  var confettiToggle = document.querySelector("#confetti");
  confettiToggle.checked = Boolean(data.settings.confetti);
}

function showDays(choreIdx, choreElm) {
  var chore = data.chores[choreIdx];
  for (var dayIdx in DAYS) {
    var dayStr = DAYS[dayIdx];
    var dayToggle = document.createElement('div');
    dayToggle.classList.add('dayOfWeek');
    if (chore.days.includes(Number(dayIdx))) {
      dayToggle.classList.add('active');
    }
    dayToggle.addEventListener('click', generateToggleDay(choreIdx, dayIdx));
    dayToggle.innerHTML = dayStr;
    choreElm.appendChild(dayToggle);
  }
}

function showChoreTitle(choreIdx, choreElm) {
  var chore = data.chores[choreIdx];
  var titleLineElm = document.createElement('div');
  titleLineElm.classList.add('choreTitleLine');

  var choreTitleElm = document.createElement('div');
  choreTitleElm.classList.add('choreTitle');
  choreTitleElm.innerHTML = chore.title;
  titleLineElm.appendChild(choreTitleElm);

  var removeChoreElm = document.createElement('div');
  removeChoreElm.innerHTML = "remove";
  removeChoreElm.classList.add('textButton');
  removeChoreElm.classList.add('removeText');
  removeChoreElm.addEventListener('click', generateRemoveChore(choreIdx));
  titleLineElm.appendChild(removeChoreElm);

  var renameChoreElm = document.createElement('div');
  renameChoreElm.innerHTML = "rename";
  renameChoreElm.classList.add('textButton');
  renameChoreElm.classList.add('renameText');
  renameChoreElm.addEventListener('click', generateRenameChore(choreIdx));
  titleLineElm.appendChild(renameChoreElm);

  choreElm.appendChild(titleLineElm);
}

function showChore(choreIdx, editList) {
  var chore = data.chores[choreIdx];
  var choreElm = document.createElement('div');
  choreElm.classList.add('choreSchedule');

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

