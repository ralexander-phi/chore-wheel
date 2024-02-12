var DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],LOCAL_STORAGE_KEY_NAME="5f6e898b-9338-49d9-b1da-84e2609bae9d-chores",DEFAULT_CHORES={chores:[{title:"Cook dinner",days:[0,1,2,3,4,5,6]},{title:"Dishes",days:[0,1,2,3,4,5,6]},{title:"Laundry",days:[6]},{title:"Meal prep",days:[0]},{title:"Put trash out",days:[3]},{title:"Call mom",days:[5]},{title:"Vacuum",days:[2]},{title:"Mop",days:[4]}],reminders:[{title:"Buy milk",snoozedUntil:null}],version:"2020-09-05",currentChoreStatus:null,currentDay:null,settings:{confetti:!0}};function getData(){var e=JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NAME));return null==e?(console.log("No chores, loading defaults"),e=DEFAULT_CHORES,new Date,e.currentDay=(new Date).getDay(),loadDay(e)):("2020-09-05"===e.version?e=minorUpgrades(e):console.log("Unknown version!"),e)}function minorUpgrades(e){return void 0===e.settings&&(e.settings={}),void 0===e.settings.confetti&&(e.settings.confetti=!0),void 0===e.reminders&&(e.reminders=[]),saveData(e),e}function saveData(e){localStorage.setItem(LOCAL_STORAGE_KEY_NAME,JSON.stringify(e))}function loadDay(e){return saveData(e=loadRemindersForDay(e=loadChoresForDay(e))),e}function loadChoresForDay(e){e.currentChoreStatus=[];var t,a=e.currentDay;for(t in e.chores){var n=e.chores[t];n.days.includes(a)&&e.currentChoreStatus.push({title:n.title,isDone:!1})}return e}function loadRemindersForDay(e){for(var t in e.reminders){t=e.reminders[t];t.snoozedUntil==e.currentDay&&(t.snoozedUntil=null)}return e}var data=null;function loadSettings(){document.querySelector("#confetti").checked=Boolean(data.settings.confetti)}function styleDay(e,t){t?(e.classList.add("is-primary","has-text-weight-bold"),e.classList.remove("is-dark","is-outlined","strikethrough")):(e.classList.remove("is-primary","has-text-weight-bold"),e.classList.add("is-dark","is-outlined","strikethrough"))}function showDays(e,t){var a,n=data.chores[e],o=document.createElement("div");for(a in o.classList.add("mt-3"),DAYS){var r=DAYS[a],s=document.createElement("button"),d=(s.classList.add("button","m-2"),n.days.includes(Number(a)));styleDay(s,d),s.addEventListener("click",generateToggleDay(e,a)),s.innerText=r,o.appendChild(s)}t.appendChild(o)}function showChoreTitle(e,t){var a=data.chores[e],n=document.createElement("div"),o=document.createElement("h2"),a=(o.classList.add("title","is-3"),o.innerText=a.title,n.appendChild(o),document.createElement("button")),o=(a.innerText="Rename",a.classList.add("button","m-2"),a.addEventListener("click",generateRenameChore(e)),n.appendChild(a),document.createElement("div"));o.classList.add("button","is-danger","m-2"),o.innerHTML="&#128473;",o.addEventListener("click",generateRemoveChore(e)),n.appendChild(o),t.appendChild(n)}function showChore(e,t){data.chores[e];var a=document.createElement("div");a.classList.add("box","mt-6"),showChoreTitle(e,a),showDays(e,a),t.appendChild(a)}function showChores(){for(var e,t=document.querySelector("#editList");t.firstChild;)t.removeChild(t.lastChild);for(e in data.chores)showChore(e,t)}function generateRemoveChore(e){return function(){data.chores.splice(e,1),saveData(data),loadDay(data),showChores()}}function generateRenameChore(t){return function(){var e=data.chores[t].title,e=prompt("Rename chore",e);null!=e&&(data.chores[t].title=e,saveData(data),loadDay(data),showChores())}}function generateToggleDay(a,n){return n=Number(n),function(){var e=data.chores[a];if(e.days.includes(n)){for(var t in e.days)if(e.days[t]==n){e.days.splice(t,1);break}}else e.days.push(n);saveData(data),loadDay(data),showChores()}}function connectButtons(){var e=document.querySelector("#confetti");document.querySelector("#addChore").addEventListener("click",function(){var e=prompt("What task do you need to add?","Water plants");null!=e&&(data.chores.push({title:e,days:[0,1,2,3,4,5,6]}),saveData(data),loadDay(data),showChores())}),document.querySelector("#done").addEventListener("click",function(){saveData(data),window.location="./"}),e.addEventListener("click",function(){data.settings.confetti=e.checked,saveData(data)})}window.onload=function(){connectButtons(),data=getData(),loadSettings(),showChores()};
//# sourceMappingURL=edit.js.map