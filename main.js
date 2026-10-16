const moods = {
  happy: {title:'Happy is home.', description:"Squady's everyday mood: curious, approachable, and ready to help."},
  surprised: {title:'Wait, what?', description:'A fresh idea or unexpected discovery deserves a little curiosity.'},
  tired: {title:'Quiet mode.', description:'A gentler moment. Sometimes the best next step is to simplify.'},
  'in-love': {title:'That feels good.', description:'Celebrate the ideas, work and connections worth getting excited about.'},
  frustrated: {title:'We can fix this.', description:'A playful expression for a tricky challenge, never a judgment of the user.'}
};
const image = document.querySelector('#squady');
const title = document.querySelector('#mood-heading');
const description = document.querySelector('#mood-description');
document.querySelectorAll('[data-mood]').forEach(button => {
  button.addEventListener('click', () => {
    const mood = button.dataset.mood;
    if (!(mood in moods)) return;
    image.src = `assets/squady-${mood}.webp`;
    image.alt = `Squady looking ${mood.replace('-', ' ')}`;
    title.textContent = moods[mood].title;
    description.textContent = moods[mood].description;
    document.querySelectorAll('[data-mood]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  });
});
document.querySelector('#motion-toggle').addEventListener('change', e => {
  document.body.classList.toggle('motion-off', !e.target.checked);
});

/* Experiment 002: Squady Reacts — a tiny, privacy-friendly interaction */
const scene = document.querySelector('#squady-scene');
const reactionMessage = document.querySelector('#reaction-message');
const motionToggle = document.querySelector('#motion-toggle');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const canAnimate = () => motionToggle.checked && !prefersReducedMotion.matches;
const surprises = [
  { mood: 'surprised', line: 'Oh! You found me.' },
  { mood: 'in-love', line: 'That made my day. 🧡' },
  { mood: 'happy', line: 'High five, creative human!' },
  { mood: 'tired', line: 'Tiny break? Big ideas need space.' }
];
let surpriseIndex = 0;
function selectMood(mood) {
  const button = document.querySelector('[data-mood="' + mood + '"]');
  if (button) button.click();
}
scene.setAttribute('role', 'button');
scene.setAttribute('tabindex', '0');
scene.setAttribute('aria-label', 'Surprise Squady');
scene.addEventListener('pointermove', (event) => {
  if (!canAnimate() || event.pointerType === 'touch') return;
  const rect = scene.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
  const y = ((event.clientY - rect.top) / rect.height - .5) * 2;
  scene.style.setProperty('--look-x', (x * 11).toFixed(1) + 'px');
  scene.style.setProperty('--look-y', (y * 7).toFixed(1) + 'px');
});
scene.addEventListener('pointerleave', () => {
  scene.style.setProperty('--look-x', '0px');
  scene.style.setProperty('--look-y', '0px');
});
function surpriseSquady() {
  const surprise = surprises[surpriseIndex % surprises.length];
  surpriseIndex++;
  selectMood(surprise.mood);
  reactionMessage.textContent = surprise.line;
  if (canAnimate()) {
    scene.classList.remove('celebrate');
    void scene.offsetWidth;
    scene.classList.add('celebrate');
  }
}
scene.addEventListener('click', surpriseSquady);
scene.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    surpriseSquady();
  }
});
motionToggle.addEventListener('change', () => {
  if (!canAnimate()) {
    scene.classList.remove('celebrate');
    scene.style.setProperty('--look-x', '0px');
    scene.style.setProperty('--look-y', '0px');
  }
});

/* Experiment 003 — local, deterministic conversation simulation */
const ideaForm = document.querySelector('#idea-form');
const detailForm = document.querySelector('#detail-form');
const followup = document.querySelector('#followup-step');
const previewForm = document.querySelector('#preview-form');
const previewEmpty = document.querySelector('#preview-empty');
const resetBrief = document.querySelector('#reset-brief');
const copyStatus = document.querySelector('#copy-status');
let currentIdea = '';
function workstream(text) {
  const s = text.toLowerCase();
  if (/site|web|landing|shop|page|app|ux|ui/.test(s)) return 'Website / digital experience';
  if (/brand|identity|logo|rebrand|position/.test(s)) return 'Branding / identity';
  if (/video|content|social|photo|reel|campaign|creative/.test(s)) return 'Creative / content';
  if (/growth|lead|customer|conversion|market|launch|email/.test(s)) return 'Growth / strategy';
  return "Other / let's figure it out";
}
function questionFor(type) {
  if(type === 'Website / digital experience') return "Love the direction. What's the main thing visitors should do when they land there?";
  if(type === 'Branding / identity') return "Who should this brand connect with, and what feeling should it leave?";
  if(type === 'Creative / content') return "Where will people see this, and what should they take away?";
  if(type === 'Growth / strategy') return "What would a successful outcome look like for this project?";
  return "Sounds interesting! Who is this for, and what would you love it to achieve?";
}
ideaForm.addEventListener('submit', event => {
  event.preventDefault();
  currentIdea = document.querySelector('#idea-input').value.trim();
  if (!currentIdea) return;
  document.querySelector('#followup-question').textContent = questionFor(workstream(currentIdea));
  followup.hidden = false;
  previewForm.hidden = true;
  previewEmpty.hidden = false;
  resetBrief.hidden = false;
  followup.scrollIntoView({behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',block:'nearest'});
});
detailForm.addEventListener('submit', event => {
  event.preventDefault();
  const detail = document.querySelector('#detail-input').value.trim();
  const type = workstream(currentIdea);
  const shortTitle = currentIdea.replace(/[.!?]+$/, '').slice(0,76);
  document.querySelector('#brief-name').value = shortTitle || 'New creative request';
  document.querySelector('#brief-type').value = type;
  document.querySelector('#brief-goal').value = currentIdea;
  document.querySelector('#brief-context').value = detail;
  previewEmpty.hidden = true;
  previewForm.hidden = false;
  copyStatus.textContent = '';
  previewForm.scrollIntoView({behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',block:'nearest'});
});
previewForm.addEventListener('submit',event=>event.preventDefault());
document.querySelector('#copy-brief').addEventListener('click',async()=>{
  const draft = ['SQUADY LAB · DRAFT REQUEST','Title: '+document.querySelector('#brief-name').value,'Workstream: '+document.querySelector('#brief-type').value,'Goal: '+document.querySelector('#brief-goal').value,'Context: '+(document.querySelector('#brief-context').value || 'Not specified'),'Not submitted. No credits charged.'].join('\n\n');
  try {await navigator.clipboard.writeText(draft);copyStatus.textContent='Copied! You can paste this into your notes.';}
  catch {copyStatus.textContent='Copy unavailable in this browser. Select the fields above to copy manually.';}
});
resetBrief.addEventListener('click',()=>{
  ideaForm.reset(); detailForm.reset(); previewForm.reset(); followup.hidden=true; previewForm.hidden=true; previewEmpty.hidden=false;resetBrief.hidden=true;copyStatus.textContent='';document.querySelector('#idea-input').focus();
});
