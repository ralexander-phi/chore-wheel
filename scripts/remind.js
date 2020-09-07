function createReminderTitleElm(reminder, reminderIdx) {
  var reminderElm = document.createElement('div');
  reminderElm.classList.add('reminder');

  var reminderText = document.createElement('div');
  reminderText.classList.add('reminderText');
  reminderText.innerHTML = "✏️ " + reminder.title;
  reminderText.addEventListener('click', generateRenameReminder(reminderIdx));
  reminderElm.appendChild(reminderText);

  var buttonsElm = document.createElement('div');
  buttonsElm.classList.add('buttons');

  var snoozeElm = document.createElement('div');
  snoozeElm.classList.add('button');
  snoozeElm.classList.add('snooze');

  if (reminder.snoozedUntil === null) {
    snoozeElm.innerHTML = "Active";
  } else {
    snoozeElm.innerHTML = "Snoozed until " + DAYS[reminder.snoozedUntil];
  }
  snoozeElm.addEventListener('click', generateSnoozeReminder(reminderIdx));
  buttonsElm.appendChild(snoozeElm);

  var sepElm = document.createElement('div');
  sepElm.classList.add('buttonSep');
  buttonsElm.appendChild(sepElm);

  var doneElm = document.createElement('div');
  doneElm.classList.add('button');
  doneElm.classList.add('dismiss');
  doneElm.innerHTML = "Dismiss";
  doneElm.addEventListener('click', generateRemoveReminder(reminderIdx));
  buttonsElm.appendChild(doneElm);

  reminderElm.appendChild(buttonsElm);
  return reminderElm;
}

function showReminders() {
  var editList = document.querySelector('#reminder');

  // Clear old chores
  while (editList.firstChild) {
    editList.removeChild(editList.lastChild);
  }

  var data = getData();
  for (var reminderIdx in data.reminders) {
    var reminder = data.reminders[reminderIdx];
    var reminderElm = createReminderTitleElm(reminder, reminderIdx);
    editList.appendChild(reminderElm);
  }
}

function generateRemoveReminder(reminderIdx) {
  return function() {
    var data = getData();
    data.reminders.splice(reminderIdx, 1);
    saveData(data);
    showReminders();
  };
}

function generateSnoozeReminder(reminderIdx) {
  return function() {
    var data = getData();
    var reminder = data.reminders[reminderIdx];
    // Toggle it
    if (reminder.snoozedUntil === null) {
      reminder.snoozedUntil = ((data.currentDay + 1) % 7);
    } else {
      reminder.snoozedUntil = ((reminder.snoozedUntil + 1) % 7);
      if (reminder.snoozedUntil == data.currentDay) {
        reminder.snoozedUntil = null;
      }
    }
    saveData(data);
    showReminders();
  };
}

function generateRenameReminder(reminderIdx) {
  return function() {
    var data = getData();
    var oldTitle = data.reminders[reminderIdx].title;
    var newTitle = prompt("Edit reminder", oldTitle);
    if (newTitle != null) {
      data.reminders[reminderIdx].title = newTitle;
      saveData(data);
      showReminders();
    }
  };
}

function connectButtons() {
  document.querySelector('#addReminder')
    .addEventListener('click', function() {
      var title = prompt("What do you need to remember?", "Doctors appointment");
      if (title != null) {
        var data = getData();
        data.reminders.push(
          { 'title': title,
            'snoozedUntil': null,
          });
        saveData(data);
        showReminders();
      }
    });

  document.querySelector('#done')
    .addEventListener('click', function() {
      window.location = './';
    });
}

window.onload = function() {
  connectButtons();
  showReminders();
};

