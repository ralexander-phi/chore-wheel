var DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

function getChores() {
  return JSON.parse(localStorage.getItem('chores'));
}

function saveChores(chores) {
  localStorage.setItem('chores', JSON.stringify(chores));
}
