function show() {
  var wheel = document.querySelector('#wheel');
  wheel.classList.add('mt-6');
  var reminderList = document.querySelector('#reminder');
  reminderList.classList.add('mt-6');
  var heading = document.querySelector('h1');

  var data = getData();
  var todaysChores = data.currentChoreStatus;
  heading.innerText = 'Tasks for ' + DAYS[data.currentDay];

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
      reminderElm.classList.add('is-4');
      reminderElm.classList.add('mt-4');

      var reminderText = document.createElement('span');
      reminderText.classList.add('title');
      reminderText.classList.add('is-4');
      reminderText.innerText = reminder.title;
      reminderElm.appendChild(reminderText);

      var snoozeElm = document.createElement('button');
      snoozeElm.classList.add('button');
      snoozeElm.classList.add('ml-5');
      snoozeElm.innerText = "Snooze";
      snoozeElm.addEventListener('click', generateTapSnooze(remIdx));
      reminderElm.appendChild(snoozeElm);

      var doneElm = document.createElement('button');
      doneElm.classList.add('button');
      doneElm.classList.add('ml-4');
      doneElm.innerText = "Complete";
      doneElm.addEventListener('click', generateTapDismiss(remIdx));
      reminderElm.appendChild(doneElm);

      reminderList.appendChild(reminderElm);
    }
  }

  for (var chIdx in todaysChores) {
    var chore = todaysChores[chIdx];
    var button = document.createElement('button');
    wheel.appendChild(button);
    button.classList.add('button');
    button.classList.add('m-2');
    styleTask(button, chore.isDone);
    button.innerText = chore.title;
    button.addEventListener('click', tapTask);
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

function styleTask(button, isDone) {
  if (isDone) {
    button.classList.add('done');
    button.classList.add('is-light');
    button.classList.remove('is-success');
    button.style = 'text-decoration: line-through;';
  } else {
    button.classList.add('is-success');
    button.classList.remove('is-light');
    button.classList.remove('done');
    button.style = 'text-decoration: none;';
  }
}

function tapTask(clickEvent) {
  var isDone = !(clickEvent.target.classList.contains('done'));
  var title = clickEvent.target.innerText;
  styleTask(clickEvent.target, isDone);
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

