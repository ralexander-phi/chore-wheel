var DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

// Where is data saved in local storage?
var LOCAL_STORAGE_KEY_NAME = '5f6e898b-9338-49d9-b1da-84e2609bae9d-chores';

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
  'reminders': [
    { 'title': 'Buy milk', 'snoozedUntil': null },
  ],
  'version': '2020-09-05',
  'currentChoreStatus': null,
  'currentDay': null,
  'settings': {
    'confetti': true,
  },
};

function getData() {
  var data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NAME));

  if (data == null) {
    console.log('No chores, loading defaults');
    data = DEFAULT_CHORES;
    var today = new Date();
    data.currentDay = new Date().getDay();
    return loadDay(data);
  }

  if (data.version === '2020-09-05') {
    data = minorUpgrades(data);
  } else {
    console.log('Unknown version!');
  }
  return data;
}

// For minor data format changes, just update on load
function minorUpgrades(data) {
  // Confetti
  if (typeof data.settings === 'undefined') {
    data.settings = {};
  }
  if (typeof data.settings.confetti === 'undefined') {
    data.settings.confetti = true;
  }

  // Reminders
  if (typeof(data.reminders) === 'undefined') {
    data.reminders = [];
  }

  saveData(data);
  return data;
}

function saveData(data) {
  localStorage.setItem(LOCAL_STORAGE_KEY_NAME, JSON.stringify(data));
}

function loadDay(data) {
  data = loadChoresForDay(data);
  data = loadRemindersForDay(data);
  saveData(data);
  return data;
}

function loadChoresForDay(data) {
  data.currentChoreStatus = [];
  var dayOfWeek = data.currentDay;
  for (var choreIdx in data.chores) {
    var chore = data.chores[choreIdx];
    if (chore.days.includes(dayOfWeek)) {
      // This task needs to be done today
      data.currentChoreStatus.push({
          'title': chore.title,
          'isDone': false
        });
    }
  }
  return data;
}

function loadRemindersForDay(data) {
  for (var reminderIdx in data.reminders) {
    var reminder = data.reminders[reminderIdx];
    if (reminder.snoozedUntil == data.currentDay) {
      // This reminder is now active
      reminder.snoozedUntil = null;
    }
  }
  return data;
}
