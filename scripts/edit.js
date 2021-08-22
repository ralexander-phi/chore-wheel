var data = null;

function loadSettings() {
  var confettiToggle = document.querySelector("#confetti");
  confettiToggle.checked = Boolean(data.settings.confetti);
}

function styleDay(elm, isActive) {
  if (isActive) {
    elm.classList.add('is-primary', 'has-text-weight-bold');
    elm.classList.remove('is-dark', 'is-outlined', 'strikethrough');
  } else {
    elm.classList.remove('is-primary', 'has-text-weight-bold');
    elm.classList.add('is-dark', 'is-outlined', 'strikethrough');
  }
}

function showDays(choreIdx, choreElm) {
  var chore = data.chores[choreIdx];

  var choreBottomElm = document.createElement('div');
  choreBottomElm.classList.add('mt-3');

  for (var dayIdx in DAYS) {
    var dayStr = DAYS[dayIdx];
    var dayToggle = document.createElement('button');
    dayToggle.classList.add('button', 'm-2');
    var isActive = chore.days.includes(Number(dayIdx));
    styleDay(dayToggle, isActive);
    dayToggle.addEventListener('click', generateToggleDay(choreIdx, dayIdx));
    dayToggle.innerText = dayStr;
    choreBottomElm.appendChild(dayToggle);
  }
  choreElm.appendChild(choreBottomElm);
}

function showChoreTitle(choreIdx, choreElm) {
  var chore = data.chores[choreIdx];

  var choreTopElm = document.createElement('div');

  var choreTextElm = document.createElement('h2');
  choreTextElm.classList.add('title', 'is-3');
  choreTextElm.innerText = chore.title;
  choreTopElm.appendChild(choreTextElm);

  var choreEditElm = document.createElement('button');
  choreEditElm.innerText = 'Rename';
  choreEditElm.classList.add('button', 'm-2');
  choreEditElm.addEventListener('click', generateRenameChore(choreIdx));
  choreTopElm.appendChild(choreEditElm);

  var doneElm = document.createElement('div');
  doneElm.classList.add('button', 'is-danger', 'm-2');
  doneElm.innerHTML = "&#128473;";
  doneElm.addEventListener('click', generateRemoveChore(choreIdx));
  choreTopElm.appendChild(doneElm);

  choreElm.appendChild(choreTopElm);
}

function showChore(choreIdx, editList) {
  var chore = data.chores[choreIdx];
  var choreElm = document.createElement('div');
  choreElm.classList.add('box', 'mt-6');

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
    loadDay(data);
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
      loadDay(data);
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
    loadDay(data);
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
        loadDay(data);
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

