const tutorial = document.querySelector('#tutorial');
const tutorialTitle = document.querySelector('#tutorialTitle');
const tutorialCopy = document.querySelector('#tutorialCopy');
const tutorialNext = document.querySelector('#tutorialNext');
const tutorialSkip = document.querySelector('#tutorialSkip');
const tutorialSteps = [...document.querySelectorAll('.tutorial-progress i')];
const tutorialData = [
  ['Welcome to the Meridian', 'You are field command. Keep your squad alive, break the relay warden, and bring the signal core home.'],
  ['Set your mission profile', 'Standard is the intended route. Casual lowers incoming damage, while Ironman raises the danger and pays a larger reward.'],
  ['Read the field', 'Select an operative to direct their position. Watch health on the roster, focus and ammunition in ship reserves, and the live transmission log.'],
  ['Make the call', 'Launch the operation, then choose from six actions. Guard and suppress reduce return fire, medicae restores the selected operative, and the relic is only usable once.']
];
let tutorialIndex = 0;
function closeTutorial() { tutorial.hidden = true; localStorage.setItem('iron-meridian-tutorial', 'complete'); }
function renderTutorial() { const [title, copy] = tutorialData[tutorialIndex]; tutorialTitle.textContent = title; tutorialCopy.textContent = copy; tutorialSteps.forEach((step, index) => step.classList.toggle('active', index <= tutorialIndex)); tutorialNext.innerHTML = tutorialIndex === tutorialData.length - 1 ? 'BEGIN <strong>&rarr;</strong>' : 'NEXT <strong>&rarr;</strong>'; }
function openTutorial() { tutorialIndex = 0; tutorial.hidden = false; renderTutorial(); }
tutorialNext.addEventListener('click', () => { if (tutorialIndex === tutorialData.length - 1) { closeTutorial(); return; } tutorialIndex += 1; renderTutorial(); });
tutorialSkip.addEventListener('click', closeTutorial);
document.addEventListener('keydown', (event) => { if (event.key === '?' || (event.key === '/' && event.shiftKey)) openTutorial(); if (event.key === 'Escape' && !tutorial.hidden) closeTutorial(); });
if (!localStorage.getItem('iron-meridian-tutorial')) openTutorial();
