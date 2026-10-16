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
