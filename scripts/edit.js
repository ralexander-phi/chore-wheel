const DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

window.onload = function() {
  var chores = null;

  function loadChores() {
    chores = JSON.parse(localStorage.getItem('chores'));
  }

  function saveChores() {
    localStorage.setItem('chores', JSON.stringify(chores));
  }

  function showChores() {
    var editList = document.querySelector('#editList');

    // Clear old chores
    while (editList.firstChild) {
      editList.removeChild(editList.lastChild);
    }

    for (var choreIdx in chores['chores']) {
      var chore = chores['chores'][choreIdx];
      var choreElm = document.createElement('div');
      choreElm.classList.add('choreSchedule');

      var titleLineElm = document.createElement('div');
      titleLineElm.classList.add('choreTitleLine');

      var choreTitleElm = document.createElement('div');
      choreTitleElm.classList.add('choreTitle');
      choreTitleElm.innerHTML = chore['title'];
      titleLineElm.appendChild(choreTitleElm);

      var removeChoreElm = document.createElement('div');
      removeChoreElm.innerHTML = "remove";
      removeChoreElm.classList.add('removeText');
      removeChoreElm.addEventListener('click', generateRemoveChore(choreIdx));
      titleLineElm.appendChild(removeChoreElm);

      choreElm.appendChild(titleLineElm);

      for (var dayIdx in DAYS) {
        var dayStr = DAYS[dayIdx];
        var dayToggle = document.createElement('div');
        dayToggle.classList.add('dayOfWeek');
        if (chore['days'].includes(Number(dayIdx))) {
          dayToggle.classList.add('active');
        }
        dayToggle.addEventListener('click', generateToggleDay(choreIdx, dayIdx));
        dayToggle.innerHTML = dayStr;
        choreElm.appendChild(dayToggle);
      }


      editList.appendChild(choreElm);
    }
  }

  function generateRemoveChore(choreIdx) {
    return function() {
      chores['chores'].splice(choreIdx, 1);
      saveChores();
      showChores();
    }
  }

  function generateToggleDay(choreIdx, dayIdx) {
    dayIdx = Number(dayIdx);
    return function() {
      var chore = chores['chores'][choreIdx];
      console.log(chore['title']);
      console.log(chore.days);
       var isActive = chore.days.includes(dayIdx);

      if (!isActive) {
        console.log('Add');
        chore.days.push(dayIdx);
      } else {
        console.log('Remove');
        for (var daysIdx in chore.days) {
          if (chore.days[daysIdx] == dayIdx) {
            console.log('Removing day ' + DAYS[dayIdx]);
            chore.days.splice(daysIdx, 1);
            break;
          }
        }
      }
      // hard refesh
      saveChores();
      showChores();
    }
  }

  function connectButtons() {
    document.querySelector('#addChore')
      .addEventListener('click', function() {
        var title = prompt("What task do you need to add?", "Water plants");
        chores['chores'].push(
          { 'title': title,
            'days': [0,1,2,3,4,5,6],
          });
        saveChores();
        showChores();
      });
    document.querySelector('#done')
      .addEventListener('click', function() {
        saveChores();
        window.location = 'index.html';
      });
  }

  function load() {
    loadChores();
    connectButtons();
    showChores();
  }

  load();
}
