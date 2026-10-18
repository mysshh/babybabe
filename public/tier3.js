/* Tier 3: visitor memory, playful Bubbles chat, and shared dream guestbook. */
(() => {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const safeText = (value, max) => String(value || '').trim().slice(0, max);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Returning-visitor memory stays on this device; no account or tracking server.
  const hero = $('.hero-copy');
  if (hero) {
    const memory = document.createElement('div');
    memory.className = 'tier-memory';
    memory.setAttribute('aria-live', 'polite');
    let name = '';
    let visits = 1;
    try {
      name = safeText(localStorage.getItem('bwVisitorName'), 32);
      visits = Math.max(1, Number(localStorage.getItem('bwVisitCount') || 0) + 1);
      localStorage.setItem('bwVisitCount', String(visits));
    } catch (_) {}
    memory.innerHTML = '<p class="tier-memory-greeting"></p><div class="tier-memory-actions"><label for="bw-name">WHAT SHOULD I CALL YOU, FRIEND?</label><input id="bw-name" maxlength="32" autocomplete="nickname" placeholder="Your cute nickname"><button type="button" id="bw-remember">REMEMBER ME! ♡</button><button type="button" id="bw-clear-memory" class="tier-quiet-button">not my name?</button></div>';
    hero.appendChild(memory);
    const greeting = $('.tier-memory-greeting', memory);
    const nameInput = $('#bw-name', memory);
    nameInput.value = name;
    const greet = () => { greeting.textContent = name ? (visits > 1 ? 'YOU CAME BACK, ' + name.toUpperCase() + '!!! I MISSED YOUR FACE!!! ♡' : 'HIIII ' + name.toUpperCase() + '!!! YOU ARE MY NEW BESTIE!!! ♡') : (visits > 1 ? 'YOU CAME BACK!!! BUBBLES REMEMBERS THIS DEVICE!!! ☁️' : 'FIRST TIME HERE? HIIII TINY DREAMER!!! ☁️'); };
    greet();
    $('#bw-remember', memory).addEventListener('click', () => {
      const next = safeText(nameInput.value, 32);
      if (!next) { greeting.textContent = 'PICK A TINY NICKNAME FIRST, FRIEND!!! ♡'; nameInput.focus(); return; }
      name = next;
      try { localStorage.setItem('bwVisitorName', name); } catch (_) {}
      greet();
      if (typeof window.say === 'function') window.say('HI ' + name.toUpperCase() + '!!! BUBBLES REMEMBERS YOU!!!');
    });
    $('#bw-clear-memory', memory).addEventListener('click', () => {
      name = ''; nameInput.value = '';
      try { localStorage.removeItem('bwVisitorName'); } catch (_) {}
      greet();
    });
  }

  // Lightweight scripted chat: instant, no external AI key, no chat data sent away.
  const chat = document.createElement('aside');
  chat.className = 'tier-chat';
  chat.innerHTML = '<button type="button" class="tier-chat-toggle" aria-expanded="false" aria-controls="tier-chat-panel">CHAT WITH BUBBLES ☁️</button><section id="tier-chat-panel" class="tier-chat-panel" hidden><div class="tier-chat-head"><strong>BUBBLES’ TINY CHAT!!!</strong><button type="button" class="tier-chat-close" aria-label="Close chat">×</button></div><div class="tier-chat-log" role="log" aria-live="polite"><p class="tier-chat-bubble tier-bubbles-says">HIIII FRIEND!!! Tell me about your day, your dreams, or your snack situation!!! ♡</p></div><form class="tier-chat-form"><label class="tier-sr-only" for="tier-chat-input">Message Bubbles</label><input id="tier-chat-input" maxlength="240" placeholder="Say something tiny..." autocomplete="off" required><button type="submit">SEND ♡</button></form><p class="tier-chat-note">Tiny scripted replies · your messages stay in this page.</p></section>';
  document.body.appendChild(chat);
  const toggle = $('.tier-chat-toggle', chat), panel = $('#tier-chat-panel', chat), log = $('.tier-chat-log', chat), form = $('.tier-chat-form', chat), input = $('#tier-chat-input', chat);
  function addBubble(message, fromBubbles) {
    const p = document.createElement('p');
    p.className = 'tier-chat-bubble ' + (fromBubbles ? 'tier-bubbles-says' : 'tier-you-say');
    p.textContent = message;
    log.appendChild(p);
    while (log.children.length > 16) log.removeChild(log.firstElementChild);
    log.scrollTop = log.scrollHeight;
  }
  function replyFor(message) {
    const m = message.toLowerCase();
    if (/\b(hi|hello|hey|hiii|hola)\b/.test(m)) return 'HIIIIIII!!! *tiny cloud wave* I am doing 900 giggles per minute!!! How are YOU? ☁️';
    if (/\b(sad|upset|bad day|lonely|cry|anxious|stress|stressed)\b/.test(m)) return 'Oh, friend. *gentle cloud hug* You do not have to fix everything this second. Want to tell me one little thing that happened? ♡';
    if (/\b(happy|good day|excited|great|love)\b/.test(m)) return 'THAT IS A BIG HAPPY!!! I am sprinkling imaginary confetti directly onto your head!!! ✨';
    if (/\b(dream|hope|wish|future)\b/.test(m)) return 'Dreams are tiny seeds wearing sparkly hats!!! What is one little step that could help yours grow? 🌱';
    if (/\b(joke|funny|laugh)\b/.test(m)) return 'Why did the cloud stay home? It was feeling a little under the weather!!! BA-DUM-PLOP!!! ☁️';
    if (/\b(name|who are you)\b/.test(m)) return 'I AM BUBBLES!!! Professional cloud baby, snack enthusiast, and your certified tiny cheerleader!!! ♡';
    if (/\b(thank|thanks)\b/.test(m)) return 'YOU ARE SO WELCOME!!! I accept payment in high-fives and one imaginary cookie!!! 🍪';
    return ['I am listening with my whole teeny-tiny cloud heart. Tell me a little more? ♡','OHHH!!! My one brain cell is thinking very hard about this!!! What happened next? ☁️','That sounds important to you, friend. I am right here for a tiny chat. 💗','If I could, I would send you a cloud-shaped hug right now!!! 🫂'][Math.floor(Math.random()*4)];
  }
  toggle.addEventListener('click', () => { const open = panel.hidden; panel.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); if (open) input.focus(); });
  $('.tier-chat-close', chat).addEventListener('click', () => { panel.hidden = true; toggle.setAttribute('aria-expanded','false'); toggle.focus(); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const message = safeText(input.value, 240);
    if (!message) return;
    addBubble(message, false); input.value = '';
    window.setTimeout(() => addBubble(replyFor(message), true), reduced ? 0 : 220);
  });

  // Shared guestbook backed by the project's PostgreSQL API.
  const guestbook = $('.guestbook-inner');
  if (guestbook) {
    const section = document.createElement('div');
    section.className = 'tier-guestbook';
    section.innerHTML = '<div class="tier-guestbook-title"><span>💌</span><div><h3>THE DREAM WISH JAR!!!</h3><p>Leave a little wish for the next dreamer to find.</p></div></div><form id="tier-wish-form"><label for="tier-wish-name">YOUR NICKNAME <span>(optional)</span></label><input id="tier-wish-name" name="nickname" maxlength="32" placeholder="A little dreamer"><label for="tier-wish-text">YOUR TINY WISH</label><textarea id="tier-wish-text" name="wish" maxlength="280" rows="3" placeholder="I hope the world gets a little kinder..." required></textarea><label for="tier-wish-mood">PICK YOUR WISH MOOD</label><select id="tier-wish-mood" name="mood"><option>💗</option><option>✨</option><option>🌈</option><option>🌱</option><option>☁️</option><option>🫂</option></select><div class="tier-honey" aria-hidden="true"><label for="tier-wish-website">Leave this empty</label><input id="tier-wish-website" name="website" tabindex="-1" autocomplete="off"></div><button type="submit" id="tier-wish-submit">SEND MY WISH INTO THE CLOUDS ☁️</button><p id="tier-wish-status" aria-live="polite">Little wishes make a big world softer. ♡</p></form><div class="tier-wishes-heading"><h4>WISHES FROM OUR DREAMERS</h4><button type="button" id="tier-wish-refresh">REFRESH ♡</button></div><div id="tier-wish-list" aria-live="polite"><p class="tier-wish-empty">Fetching tiny wishes...</p></div>';
    guestbook.appendChild(section);
    const wishForm = $('#tier-wish-form', section), status = $('#tier-wish-status', section), list = $('#tier-wish-list', section), submit = $('#tier-wish-submit', section);
    const escDate = value => { const d = new Date(value); return Number.isNaN(d.getTime()) ? 'A little while ago' : d.toLocaleDateString(undefined,{month:'short',day:'numeric'}); };
    async function loadWishes() {
      try {
        const response = await fetch('/api/dream-guestbook', {headers:{'Accept':'application/json'}});
        if (!response.ok) throw new Error('Wish jar is taking a tiny nap.');
        const data = await response.json();
        list.replaceChildren();
        if (!Array.isArray(data.wishes) || !data.wishes.length) { list.innerHTML = '<p class="tier-wish-empty">The jar is waiting for its very first wish. Make history!!! ✨</p>'; return; }
        data.wishes.forEach(w => {
          const card = document.createElement('article'); card.className = 'tier-wish-card';
          const mood = document.createElement('span'); mood.className = 'tier-wish-mood'; mood.textContent = safeText(w.mood,12) || '💗';
          const body = document.createElement('p'); body.textContent = safeText(w.wish,280);
          const by = document.createElement('small'); by.textContent = '♡ ' + (safeText(w.nickname,32) || 'A little dreamer') + ' · ' + escDate(w.created_at);
          card.append(mood,body,by); list.appendChild(card);
        });
      } catch (_) { list.innerHTML = '<p class="tier-wish-empty">The wish jar could not connect just now. Try refreshing in a moment, little dreamer. ♡</p>'; }
    }
    wishForm.addEventListener('submit', async e => {
      e.preventDefault();
      submit.disabled = true; status.textContent = 'SENDING YOUR WISH THROUGH THE CLOUDS... ☁️';
      const payload = {nickname:safeText($('#tier-wish-name',section).value,32), wish:safeText($('#tier-wish-text',section).value,280), mood:safeText($('#tier-wish-mood',section).value,12), website:safeText($('#tier-wish-website',section).value,100)};
      try {
        const response = await fetch('/api/dream-guestbook', {method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)});
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'The clouds got tangled. Try again?');
        wishForm.reset(); status.textContent = 'YOUR WISH IS IN THE JAR!!! THANK YOU, DREAMER!!! 💗'; await loadWishes();
      } catch (err) { status.textContent = err.message || 'Could not send that wish right now.'; }
      finally { submit.disabled = false; }
    });
    $('#tier-wish-refresh', section).addEventListener('click', loadWishes);
    loadWishes();
  }
})();