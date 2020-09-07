function show() {
  var wheel = document.querySelector('#wheel');
  var reminderList = document.querySelector('#reminder');
  var heading = document.querySelector('h1');

  var data = getData();
  var todaysChores = data.currentChoreStatus;
  heading.innerHTML = 'Tasks for ' + DAYS[data.currentDay];

  // Clear
  while (wheel.firstChild) {
    wheel.removeChild(wheel.lastChild);
  }
  while (reminderList.firstChild) {
    reminderList.removeChild(reminderList.lastChild);
  }

  if (data.reminders.length == 0) {
    // Pass
  } else {
    for (var remIdx in data.reminders) {
      var reminder = data.reminders[remIdx];

      if (reminder.snoozedUntil !== null) {
        // This reminder is snoozed
        continue;
      }

      var reminderElm = document.createElement('div');
      reminderElm.classList.add('reminder');

      var reminderText = document.createElement('div');
      reminderText.classList.add('reminderText');
      reminderText.innerHTML = reminder.title;
      reminderElm.appendChild(reminderText);

      var buttonsElm = document.createElement('div');
      buttonsElm.classList.add('buttons');

      var snoozeElm = document.createElement('div');
      snoozeElm.classList.add('button');
      snoozeElm.classList.add('snooze');
      snoozeElm.innerHTML = "Snooze";
      snoozeElm.addEventListener('click', generateTapSnooze(remIdx));
      buttonsElm.appendChild(snoozeElm);

      var sepElm = document.createElement('div');
      sepElm.classList.add('buttonSep');
      buttonsElm.appendChild(sepElm);

      var doneElm = document.createElement('div');
      doneElm.classList.add('button');
      doneElm.classList.add('dismiss');
      doneElm.innerHTML = "Dismiss";
      doneElm.addEventListener('click', generateTapDismiss(remIdx));
      buttonsElm.appendChild(doneElm);

      reminderElm.appendChild(buttonsElm);
      reminderList.appendChild(reminderElm);
    }
  }

  for (var chIdx in todaysChores) {
    var chore = todaysChores[chIdx];
    var choreElm = document.createElement('div');
    choreElm.classList.add('task');
    if (chore.isDone) {
      choreElm.classList.add('done');
    }
    choreElm.innerHTML = chore.title;
    choreElm.addEventListener('click', tapTask);
    wheel.appendChild(choreElm);
  }
}

function updateChoreCompletion(title, isDone) {
  var data = getData();
  for (var choreIdx in data.currentChoreStatus) {
    var chore = data.currentChoreStatus[choreIdx];
    if (chore.title == title) {
      chore.isDone = isDone;
    }
  }
  if (isDone) {
    checkWin(data);
  }
  saveData(data);
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

function generateTapDismiss(remIdx) {
  return function(clickEvent) {
    var data = getData();
    data.reminders.splice(remIdx, 1);
    saveData(data);
    show();
  };
}

function generateTapSnooze(remIdx) {
  return function(clickEvent) {
    var data = getData();
    // Push it to tomorrow
    data.reminders[remIdx].snoozedUntil = ((data.currentDay + 1) % 7);
    saveData(data);
    show();
  };
}

function checkWin(data) {
  for (var choreIdx in data.currentChoreStatus) {
    var chore = data.currentChoreStatus[choreIdx];
    if (!chore.isDone) {
      // This chore is not done
      return;
    }
  }

  onWin(data);
}

function onWin(data) {
  if (confetti && data.settings && data.settings.confetti) {
    confetti.start(3000);
  }
}

function loadNextDay() {
  var data = getData();
  dayOfWeek = data.currentDay;
  dayOfWeek = (dayOfWeek + 1) % 7;
  data.currentDay = dayOfWeek;
  loadChoresForDay(data);
}

function connectButtons() {
  document.querySelector('#nextDay')
    .addEventListener('click', function() {
      loadNextDay();
      show();
    });

  document.querySelector('#editChores')
    .addEventListener('click', function() {
      window.location = 'edit.html';
    });

  document.querySelector('#editReminders')
    .addEventListener('click', function() {
      window.location = 'remind.html';
    });

  document.querySelector('#about')
    .addEventListener('click', function() {
      window.location = 'about.html';
    });
}

function init() {
  // Previously used service workers should be removed
  if (typeof(navigator.serviceWorker) !== 'undefined') {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for (var i = 0; i < registrations.length; i++) {
        registrations[i].unregister();
      }
    });
  }
}

window.onload = function() {
  init();
  connectButtons();
  show();
};

