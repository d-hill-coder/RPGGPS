const log = document.querySelector('#log');
const launch = document.querySelector('#launch');
const stateLabel = document.querySelector('#state');
const message = document.querySelector('#message');
const choices = [...document.querySelectorAll('.choices button')];
const operatives = [...document.querySelectorAll('.operative')];
const squad = { VOSS: { hp: 88, max: 88 }, MORROW: { hp: 64, max: 64 }, 'SABLE-9': { hp: 42, max: 42 } };
const actions = {
  breach: { title: 'Plasma volley', hint: 'Spend ammunition for heavy damage.', damage: 31, ammo: 18, focus: -6, recoil: 8 },
  ghost: { title: 'Measured fire', hint: 'Conserve supplies and stay mobile.', damage: 19, ammo: 6, focus: 2, recoil: 4 },
  signal: { title: 'Decode the chorus', hint: 'Risk focus to expose a weak point.', damage: 25, ammo: 0, focus: -12, recoil: 2 },
  guard: { title: 'Brace formation', hint: 'Recover focus and reduce the next hit.', damage: 5, ammo: 0, focus: 9, recoil: 1 },
  relic: { title: 'Relic discharge', hint: 'A single devastating charge.', damage: 52, ammo: 0, focus: -18, recoil: 0 }
};
let game = { phase: 'ready', enemy: 100, round: 0, focus: 72, ammo: 64, relic: true, selected: 'VOSS', guarded: false };

function addLog(who, text, warning = false) {
  const entry = document.createElement('p');
  entry.className = warning ? 'warn' : '';
  entry.innerHTML = `<time>${new Date().toLocaleTimeString([], { hour12: false })}</time><span><b>${who}</b> ${text}</span>`;
  log.append(entry);
  log.scrollTop = log.scrollHeight;
}
function clamp(value) { return Math.max(0, Math.min(100, value)); }
function updateReserves() {
  const values = document.querySelectorAll('.resource>strong');
  if (values[0]) values[0].textContent = `${game.focus}%`;
  if (values[1]) values[1].textContent = `${game.ammo}%`;
  const bars = document.querySelectorAll('.bar i');
  if (bars[0]) bars[0].style.width = `${game.focus}%`;
  if (bars[1]) bars[1].style.width = `${game.ammo}%`;
  operatives.forEach((operative) => {
    const unit = squad[operative.dataset.name];
    operative.querySelector('em').textContent = unit.hp;
    operative.querySelector('u').style.width = `${(unit.hp / unit.max) * 100}%`;
  });
}
function renderBattleMessage(title, copy) {
  message.innerHTML = `<b>${game.round || '+'}</b><span><strong>${title}</strong><small>${copy}</small><small style="display:block;color:#e27766;margin-top:10px;font-family:'Space Mono'">RELAY WARDEN &nbsp; ${game.enemy}%</small><i style="display:block;width:${game.enemy}%;height:5px;background:#e27766;margin-top:4px"></i></span>`;
}
function setChoices(enabled, list) {
  choices.forEach((button, index) => {
    const action = list[index];
    button.disabled = !enabled || !action;
    button.dataset.choice = action || '';
    button.querySelector('strong').textContent = action ? actions[action].title : 'Awaiting orders';
    button.querySelector('small').textContent = action ? actions[action].hint : 'Unavailable';
  });
}
function beginOperation() {
  game = { phase: 'combat', enemy: 100, round: 1, focus: 72, ammo: 64, relic: true, selected: 'VOSS', guarded: false };
  Object.values(squad).forEach((unit) => { unit.hp = unit.max; });
  launch.innerHTML = 'OPERATION LIVE <strong>&rarr;</strong>';
  stateLabel.textContent = 'CONTACT // ROUND 1';
  renderBattleMessage('The relay warden wakes.', 'Three heat signatures converge. Select an action for the squad.');
  setChoices(true, ['breach', 'ghost', 'signal']);
  updateReserves();
  addLog('COMMAND', 'Drop confirmed. Khepri has acknowledged your presence.', true);
}
function finishOperation(won) {
  game.phase = won ? 'victory' : 'defeat';
  stateLabel.textContent = won ? 'RELAY SECURED' : 'SQUAD LOST';
  setChoices(false, []);
  if (won) {
    renderBattleMessage('Signal core recovered.', 'The dead language goes quiet. Operation complete. +340 XP awarded.');
    document.querySelector('.objective em').textContent = '1 / 1';
    addLog('COMMAND', 'Victory confirmed. The Helios Veil remains ours.');
  } else {
    renderBattleMessage('The relay consumes the light.', 'All squad coherence is gone. Reset the operation and try a different approach.');
    addLog('COMMAND', 'Operation failed. No signal returned.', true);
  }
  launch.innerHTML = 'RESTART OPERATION <strong>&rarr;</strong>';
  launch.onclick = beginOperation;
}
function resolveAction(choice) {
  if (game.phase !== 'combat') return;
  const move = actions[choice];
  if (choice === 'relic' && !game.relic) return;
  if (move.ammo > game.ammo) { addLog('SYSTEM', 'Insufficient ammunition for that action.', true); return; }
  game.round += 1;
  game.enemy = clamp(game.enemy - move.damage);
  game.ammo = clamp(game.ammo - move.ammo);
  game.focus = clamp(game.focus + move.focus);
  if (choice === 'relic') game.relic = false;
  const actor = squad[game.selected];
  actor.hp = clamp(actor.hp - (game.guarded ? 2 : move.recoil));
  game.guarded = choice === 'guard';
  addLog(game.selected, `${move.title} lands for ${move.damage} damage.`);
  if (game.enemy <= 0) { updateReserves(); finishOperation(true); return; }
  const enemyHit = game.guarded ? 5 : 11 + (game.round % 3);
  actor.hp = clamp(actor.hp - enemyHit);
  game.focus = clamp(game.focus - (game.guarded ? 0 : 4));
  updateReserves();
  if (Object.values(squad).every((unit) => unit.hp <= 0) || game.focus <= 0) { finishOperation(false); return; }
  stateLabel.textContent = `CONTACT // ROUND ${game.round}`;
  renderBattleMessage('The warden returns fire.', `${game.selected} takes ${enemyHit} damage. Choose the squad's next move.`);
  setChoices(true, game.relic ? ['guard', 'signal', 'relic'] : ['guard', 'ghost', 'signal']);
}
launch.onclick = beginOperation;
choices.forEach((button) => button.addEventListener('click', () => resolveAction(button.dataset.choice)));
operatives.forEach((operative) => operative.addEventListener('click', () => {
  operatives.forEach((item) => item.classList.remove('active'));
  operative.classList.add('active');
  game.selected = operative.dataset.name;
  if (game.phase === 'combat') addLog(game.selected, 'Formation acknowledged. Awaiting vector.');
}));
document.querySelector('#clear').onclick = () => { log.innerHTML = '<p><time>--:--:--</time><span><b>SYSTEM</b> Transmission log cleared.</span></p>'; };
document.querySelector('#sound').onclick = (event) => { event.currentTarget.textContent = event.currentTarget.textContent === '×' ? '♫' : '×'; };
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
