function createSnoozeElm(reminder, reminderIdx) {
  var snoozeElm = document.createElement('button');
  snoozeElm.classList.add('button', 'm-2', 'is-vcentered');

  if (reminder.snoozedUntil === null) {
    snoozeElm.innerText = "Today";
  } else {
    snoozeElm.innerText = DAYS[reminder.snoozedUntil];
  }
  snoozeElm.addEventListener('click', generateSnoozeReminder(reminderIdx));

  return snoozeElm;
}

function createReminderButtons(reminderIdx) {
  var buttons = document.createElement('div');
  buttons.classList.add('mt-4');

  var edit = document.createElement('button');
  buttons.appendChild(edit);
  edit.innerText = 'Rename';
  edit.classList.add('button', 'is-outlined', 'm-2');
  edit.addEventListener('click', generateRenameReminder(reminderIdx));

  var doneElm = document.createElement('button');
  buttons.appendChild(doneElm);
  doneElm.classList.add('button', 'is-danger', 'm-2');
  doneElm.innerHTML = "&#128473;";
  doneElm.addEventListener('click', generateRemoveReminder(reminderIdx));

  return buttons;
}

function createReminderTitleElm(reminder, reminderIdx) {
  var reminderElm = document.createElement('div');
  reminderElm.classList.add('box');

  var reminderText = document.createElement('h2');
  reminderElm.appendChild(reminderText);
  reminderText.innerText = reminder.title;
  reminderText.classList.add('title', 'is-3');

  reminderElm.appendChild(
    createReminderButtons(reminderIdx));

  var snoozeHelp = document.createElement('p');
  reminderElm.appendChild(snoozeHelp);
  snoozeHelp.innerText = 'Next occurance: ';
  snoozeHelp.classList.add('mt-2', 'is-vcentered');

  reminderElm.appendChild(
    createSnoozeElm(reminder, reminderIdx));

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

