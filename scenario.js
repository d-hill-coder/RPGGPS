const scenarioButtons = [...document.querySelectorAll('[data-scenario]')];
const scenarioData = {
  relay: {
    title: 'Wake the Silent Relay',
    copy: 'Descend into Relay Khepri. A dormant distress signal has begun repeating in a dead language. Silence it, or answer.',
     operation: 'OPERATION 17-A', objective: 'Recover the signal core', optional: 'Optional: leave no witnesses', threat: 'SEVERE', reward: '+340 XP', rewardCredits: 340, enemy: 100, pressure: 1, focusDrain: 4, map: 'KHEPRI // 04'
  },
  convoy: {
    title: 'Hold the Ash Convoy',
    copy: 'Six crawler transports are trapped beneath the ash storm. Keep the engines alive long enough to move the last survivors through the kill zone.',
     operation: 'OPERATION 22-C', objective: 'Escort the final crawler', optional: 'Optional: recover the black box', threat: 'CRITICAL', reward: '+480 XP', rewardCredits: 480, enemy: 125, pressure: 0.85, focusDrain: 2, map: 'DUST ROAD // 09'
  },
  blacksite: {
    title: 'Echoes Below',
    copy: 'A sealed research vault is broadcasting your squad identifiers. Enter the blacksite, find the source, and do not trust the voices inside.',
     operation: 'OPERATION 31-X', objective: 'Locate the vault architect', optional: 'Optional: extract the forbidden archive', threat: 'UNKNOWN', reward: '+720 XP', rewardCredits: 720, enemy: 85, pressure: 1.35, focusDrain: 7, map: 'VAULT NULL // 01'
  }
};
let selectedScenario = localStorage.getItem('iron-meridian-scenario') || 'relay';
function renderScenario(key) {
  const scenario = scenarioData[key];
  if (!scenario) return;
  selectedScenario = key;
  localStorage.setItem('iron-meridian-scenario', key);
  const missionCopy = document.querySelector('.mission-copy');
  if (missionCopy) {
    missionCopy.querySelector('div>small').textContent = scenario.operation;
    missionCopy.querySelector('h2').textContent = scenario.title;
    missionCopy.querySelector('p').textContent = scenario.copy;
  }
  const statValues = document.querySelectorAll('.stats b');
  if (statValues[0]) statValues[0].textContent = scenario.threat;
  if (statValues[1]) statValues[1].textContent = scenario.reward;
  document.querySelector('.objective strong').textContent = scenario.objective;
  document.querySelector('.objective small').textContent = scenario.optional;
  document.querySelector('.map-label').textContent = scenario.map;
   scenarioButtons.forEach((button) => button.classList.toggle('selected', button.dataset.scenario === key));
   window.activeScenario = scenario;
}
scenarioButtons.forEach((button) => button.addEventListener('click', () => renderScenario(button.dataset.scenario)));
renderScenario(selectedScenario);
