const tutorial = document.querySelector('#tutorial');
const tutorialTitle = document.querySelector('#tutorialTitle');
const tutorialCopy = document.querySelector('#tutorialCopy');
const tutorialNext = document.querySelector('#tutorialNext');
const tutorialTry = document.querySelector('#tutorialTry');
const tutorialSkip = document.querySelector('#tutorialSkip');
const tutorialSteps = [...document.querySelectorAll('.tutorial-progress i')];
const tutorialData = [
  { title: 'Welcome to the Meridian', copy: 'You are field command. This briefing will point at the real controls and let you test them safely.', target: null, demo: null },
  { title: 'Set your mission profile', copy: 'Choose the danger level before deployment. Try Casual now; you can switch back to Standard at any time.', target: '.difficulty', demo: '[data-difficulty="casual"]' },
  { title: 'Choose your operative', copy: 'The selected operative receives each order and takes the incoming hit. Try moving command to Morrow.', target: '.roster', demo: '.operative[data-name="MORROW"]' },
  { title: 'Read before you act', copy: 'These are the live reserves. Focus powers special actions, ammunition fuels heavy fire, and health keeps the squad standing.', target: '.reserves', demo: null },
  { title: 'Make the call', copy: 'After launch, the six-button action grid becomes live. Use Try It to spotlight the choices, then make your own opening move.', target: '.choices', demo: null }
];
let tutorialIndex = 0;
function clearFocus() { document.querySelectorAll('.tutorial-focus').forEach((element) => element.classList.remove('tutorial-focus')); }
function closeTutorial() { clearFocus(); tutorial.hidden = true; localStorage.setItem('iron-meridian-tutorial', 'complete'); }
function renderTutorial() {
  const step = tutorialData[tutorialIndex];
  clearFocus();
  tutorialTitle.textContent = step.title;
  tutorialCopy.textContent = step.copy;
  tutorialSteps.forEach((indicator, index) => indicator.classList.toggle('active', index <= tutorialIndex));
  const target = step.target ? document.querySelector(step.target) : null;
  if (target) target.classList.add('tutorial-focus');
  tutorialTry.hidden = !step.target;
  tutorialNext.innerHTML = tutorialIndex === tutorialData.length - 1 ? 'BEGIN <strong>&rarr;</strong>' : 'NEXT <strong>&rarr;</strong>';
}
function openTutorial() { tutorialIndex = 0; tutorial.hidden = false; renderTutorial(); }
tutorialNext.addEventListener('click', () => { if (tutorialIndex === tutorialData.length - 1) { closeTutorial(); return; } tutorialIndex += 1; renderTutorial(); });
tutorialTry.addEventListener('click', () => { const demo = tutorialData[tutorialIndex].demo; if (demo) { const target = document.querySelector(demo); if (target) target.click(); } else { const target = document.querySelector(tutorialData[tutorialIndex].target); if (target) { target.classList.remove('tutorial-focus'); void target.offsetWidth; target.classList.add('tutorial-focus'); } } });
tutorialSkip.addEventListener('click', closeTutorial);
document.addEventListener('keydown', (event) => { if (event.key === '?' || (event.key === '/' && event.shiftKey)) openTutorial(); if (event.key === 'Escape' && !tutorial.hidden) closeTutorial(); });
if (!localStorage.getItem('iron-meridian-tutorial')) openTutorial();
