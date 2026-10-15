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
