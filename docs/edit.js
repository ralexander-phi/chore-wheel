var DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],LOCAL_STORAGE_KEY_NAME="5f6e898b-9338-49d9-b1da-84e2609bae9d-chores",LOCAL_STORAGE_OLD_KEY_NAME="chores",DEFAULT_CHORES={chores:[{title:"Cook dinner",days:[0,1,2,3,4,5,6]},{title:"Dishes",days:[0,1,2,3,4,5,6]},{title:"Laundry",days:[6]},{title:"Meal prep",days:[0]},{title:"Put trash out",days:[3]},{title:"Call mom",days:[5]},{title:"Vacuum",days:[2]},{title:"Mop",days:[4]}],reminders:[{title:"Edit to customize",snoozedUntil:null}],version:"2020-09-05",currentChoreStatus:null,currentDay:null,settings:{confetti:!0}};function getData(){var e=JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NAME));if(null===e&&(console.log("Checking old name"),e=JSON.parse(localStorage.getItem(LOCAL_STORAGE_OLD_KEY_NAME))),null!==e)return void 0===e.version?e=upgradeLegacy(e):"2020-09-05"===e.version?e=minorUpgrades(e):console.log("Unknown version!"),e;console.log("No chores, loading defaults"),e=DEFAULT_CHORES;new Date;return e.currentDay=(new Date).getDay(),loadChoresForDay(e)}function minorUpgrades(e){return void 0===e.settings&&(e.settings={}),void 0===e.settings.confetti&&(e.settings.confetti=!0),void 0===e.reminders&&(e.reminders=[]),saveData(e),e}function upgradeLegacy(e){return e.version="2020-09-05",saveData(e),localStorage.removeItem(LOCAL_STORAGE_OLD_KEY_NAME),e}function saveData(e){localStorage.setItem(LOCAL_STORAGE_KEY_NAME,JSON.stringify(e))}function loadChoresForDay(e){e.currentChoreStatus=[];var t=e.currentDay;for(var a in e.chores){var s=e.chores[a];s.days.includes(t)&&e.currentChoreStatus.push({title:s.title,isDone:!1})}for(var n in e.reminders){var o=e.reminders[n];o.snoozedUntil==e.currentDay&&(o.snoozedUntil=null)}return saveData(e),e}var data=null;function loadSettings(){document.querySelector("#confetti").checked=Boolean(data.settings.confetti)}function styleDay(e,t){t?(e.classList.add("is-info"),e.classList.remove("is-dark"),e.classList.remove("is-outlined"),e.style.fontWeight="bold"):(e.classList.remove("is-info"),e.classList.add("is-dark"),e.classList.add("is-outlined"),e.style="text-decoration: line-through;",e.style.fontWeight="normal")}function showDays(e,t){var a=data.chores[e],s=document.createElement("div");for(var n in s.classList.add("mt-3"),DAYS){var o=DAYS[n],r=document.createElement("button");r.classList.add("button"),r.classList.add("m-2"),r.classList.add(DAYS[n]),styleDay(r,a.days.includes(Number(n))),r.addEventListener("click",generateToggleDay(e,n)),r.innerText=o,s.appendChild(r)}t.appendChild(s)}function showChoreTitle(e,t){var a=data.chores[e],s=document.createElement("div"),n=document.createElement("t2");n.classList.add("title"),n.classList.add("is-3"),n.innerText=a.title,s.appendChild(n);var o=document.createElement("button");o.innerText="Edit",o.classList.add("button"),o.classList.add("is-dark"),o.classList.add("is-outlined"),o.classList.add("ml-4"),o.addEventListener("click",generateRenameChore(e)),s.appendChild(o);var r=document.createElement("div");r.classList.add("button"),r.classList.add("is-danger"),r.classList.add("is-outlined"),r.classList.add("ml-4"),r.innerText="Remove",r.addEventListener("click",generateRemoveChore(e)),s.appendChild(r),t.appendChild(s)}function showChore(e,t){data.chores[e];var a=document.createElement("div");a.classList.add("box"),a.classList.add("mt-6"),showChoreTitle(e,a),showDays(e,a),t.appendChild(a)}function showChores(){for(var e=document.querySelector("#editList");e.firstChild;)e.removeChild(e.lastChild);for(var t in data.chores)showChore(t,e)}function generateRemoveChore(e){return function(){data.chores.splice(e,1),saveData(data),loadChoresForDay(data),showChores()}}function generateRenameChore(a){return function(){var e=data.chores[a].title,t=prompt("Rename chore",e);null!=t&&(data.chores[a].title=t,saveData(data),loadChoresForDay(data),showChores())}}function generateToggleDay(a,s){return s=Number(s),function(){var e=data.chores[a];if(e.days.includes(s)){for(var t in e.days)if(e.days[t]==s){e.days.splice(t,1);break}}else e.days.push(s);saveData(data),loadChoresForDay(data),showChores()}}function connectButtons(){var e=document.querySelector("#confetti");document.querySelector("#addChore").addEventListener("click",function(){var e=prompt("What task do you need to add?","Water plants");null!=e&&(data.chores.push({title:e,days:[0,1,2,3,4,5,6]}),saveData(data),loadChoresForDay(data),showChores())}),document.querySelector("#done").addEventListener("click",function(){saveData(data),window.location="./"}),e.addEventListener("click",function(){data.settings.confetti=e.checked,saveData(data)})}window.onload=function(){connectButtons(),data=getData(),loadSettings(),showChores()};
//# sourceMappingURL=edit.js.map