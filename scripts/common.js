var DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

// Where is data saved in local storage?
var LOCAL_STORAGE_KEY_NAME = '5f6e898b-9338-49d9-b1da-84e2609bae9d-chores';
// An older name used
var LOCAL_STORAGE_OLD_KEY_NAME = 'chores';

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
  'version': '2020-09-05',
  'currentChoreStatus': null,
  'currentDay': null,
  'settings': {
    'confetti': true,
  },
};

function getChores() {
  chores = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NAME));
  if (chores === null) {
    console.log('Checking old name');
    chores = JSON.parse(localStorage.getItem(LOCAL_STORAGE_OLD_KEY_NAME));
  }

  if (chores !== null) {
    if (typeof chores.version === 'undefined') {
      chores = upgradeLegacy(chores);
    } else if (chores.version === '2020-09-05') {
      // latest
    } else {
      console.log('Unknown version!');
    }
    return chores;
  } else {
    console.log('No chores, loading defaults');
    chores = DEFAULT_CHORES;
    var today = new Date();
    chores.currentDay = new Date().getDay();
    return loadChoresForDay(chores);
  }
}

function upgradeLegacy(chores) {
  chores.version = '2020-09-05';
  saveChores(chores);

  // Get rid of the old data
  localStorage.removeItem(LOCAL_STORAGE_OLD_KEY_NAME);

  return chores;
}

function saveChores(chores) {
  localStorage.setItem(LOCAL_STORAGE_KEY_NAME, JSON.stringify(chores));
}

function loadChoresForDay(chores) {
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
  return chores;
}
