const messages = {
  give: 'GIVE — Structure makes space. Take an idea, then pass it on.',
  ask: 'ASK — What happens when we leave a little room for the unknown?',
  speak: 'SPEAK — Your point of view belongs here. Leave a human trace.',
  press: 'PRESS — There it is. A little intention becomes a little movement.'
};
document.querySelectorAll('.sample').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.sample').forEach(item => item.classList.remove('is-activated'));
    void button.offsetWidth;
    button.classList.add('is-activated');
    document.querySelector('#interaction-message').textContent = messages[button.dataset.mode];
  });
});
document.querySelector('#grid-toggle').addEventListener('click', event => {
  const active = document.body.classList.toggle('show-grid');
  event.currentTarget.setAttribute('aria-pressed', String(active));
  event.currentTarget.innerHTML = `${active ? 'HIDE' : 'REVEAL'} THE GRID <span>${active ? '−' : '＋'}</span>`;
});
const navigation = [...document.querySelectorAll('nav a')];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) navigation.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: '-10% 0px -55% 0px', threshold: 0 });
document.querySelectorAll('#language, #playground, #principles').forEach(section => observer.observe(section));
