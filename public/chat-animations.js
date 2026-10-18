(() => {
  if (window.__babyWorldReplyPopups) return;
  window.__babyWorldReplyPopups = true;

  const css = document.createElement('style');
  css.textContent = `
    .bw-reply-popup{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:24px;pointer-events:none;opacity:0;visibility:hidden;transition:opacity .22s ease,visibility .22s ease}
    .bw-reply-popup.is-visible{opacity:1;visibility:visible}
    .bw-reply-popup-backdrop{position:absolute;inset:0;background:rgba(61,37,91,.22);backdrop-filter:blur(3px);animation:bwBackdropIn .22s ease both}
    .bw-reply-popup-card{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;width:min(560px,92vw);min-height:300px;padding:clamp(24px,5vw,52px);border:5px solid #39284c;border-radius:38px;background:linear-gradient(145deg,#fff8fc 0%,#ffe0ef 52%,#e9e1ff 100%);box-shadow:0 22px 70px rgba(42,22,65,.28),8px 9px 0 #39284c;text-align:center;transform:translateY(24px) scale(.72) rotate(-3deg);animation:bwPopupIn .48s cubic-bezier(.2,1.45,.45,1) forwards}
    .bw-reply-popup.is-leaving .bw-reply-popup-card{animation:bwPopupOut .25s ease forwards}
    .bw-reply-popup-baby{font-size:clamp(86px,15vw,150px);line-height:1.1;filter:drop-shadow(0 7px 0 rgba(57,40,76,.08));animation:bwBabyAct .58s ease-in-out infinite alternate}
    .bw-reply-popup-prop{position:absolute;top:18%;right:17%;font-size:clamp(42px,7vw,76px);animation:bwPropIn .65s cubic-bezier(.2,1.5,.5,1) both}
    .bw-reply-popup-title{margin:0;color:#6e397f;font:900 clamp(22px,4vw,38px)/1.1 'Fredoka',sans-serif;letter-spacing:.02em}
    .bw-reply-popup-caption{margin:0;max-width:38ch;color:#50385f;font:700 clamp(14px,2vw,19px)/1.35 'Comic Neue',sans-serif}
    .bw-reply-popup-sparkles{position:absolute;inset:0;overflow:hidden;border-radius:32px;pointer-events:none}
    .bw-reply-popup-sparkles span{position:absolute;font-size:clamp(20px,4vw,36px);animation:bwSparkle 1.25s ease-out both}
    .bw-reply-popup-sparkles span:nth-child(1){left:9%;top:18%}.bw-reply-popup-sparkles span:nth-child(2){right:10%;top:35%;animation-delay:.12s}.bw-reply-popup-sparkles span:nth-child(3){left:16%;bottom:16%;animation-delay:.2s}.bw-reply-popup-sparkles span:nth-child(4){right:17%;bottom:13%;animation-delay:.08s}
    @keyframes bwBackdropIn{from{opacity:0}to{opacity:1}}
    @keyframes bwPopupIn{0%{transform:translateY(24px) scale(.65) rotate(-5deg)}70%{transform:translateY(-7px) scale(1.04) rotate(1deg)}100%{transform:translateY(0) scale(1) rotate(0)}}
    @keyframes bwPopupOut{to{transform:translateY(15px) scale(.8);opacity:0}}
    @keyframes bwBabyAct{from{transform:translateY(3px) rotate(-5deg)}to{transform:translateY(-12px) rotate(5deg)}}
    @keyframes bwPropIn{from{transform:scale(.1) rotate(-35deg);opacity:0}to{transform:scale(1) rotate(8deg);opacity:1}}
    @keyframes bwSparkle{0%{transform:scale(.2) rotate(-30deg);opacity:0}45%{transform:scale(1.25) rotate(15deg);opacity:1}100%{transform:scale(.8) translateY(-18px);opacity:.25}}
    @media(prefers-reduced-motion:reduce){.bw-reply-popup,.bw-reply-popup *{animation:none!important;transition:none!important}.bw-reply-popup-card{transform:none}}
  `;
  document.head.appendChild(css);

  let popup, timer, lastReply = '';
  const ensurePopup = () => {
    if (popup) return popup;
    popup = document.createElement('div');
    popup.className = 'bw-reply-popup';
    popup.setAttribute('role','status');
    popup.setAttribute('aria-live','polite');
    popup.innerHTML = '<div class="bw-reply-popup-backdrop"></div><div class="bw-reply-popup-card"><div class="bw-reply-popup-sparkles"><span>✨</span><span>💖</span><span>🌟</span><span>✿</span></div><div class="bw-reply-popup-baby">☁️👶🏻</div><div class="bw-reply-popup-prop">💖</div><h2 class="bw-reply-popup-title">BUBBLES SAYS HIIII!!!</h2><p class="bw-reply-popup-caption">A tiny message, delivered with BIG feelings!!!</p></div>';
    document.body.appendChild(popup);
    return popup;
  };

  const pickReaction = (message, userMessage) => {
    const text = (message + ' ' + userMessage).toLowerCase();
    if (/cookie|snack|biscuit/.test(text)) return ['🍪','COOKIE DELIVERY!!!','Bubbles brought you a teeny tiny treat!!!'];
    if (/hug|cuddle|comfort|sad|lonely|upset|anxious|stress|cry/.test(text)) return ['🫂','BIG SQUISHY HUG!!!','Come here, friend. Maximum squishies!!!'];
    if (/flower|garden|bloom/.test(text)) return ['💐','FLOWERS FOR YOU!!!','Freshly picked from the baby garden!!!'];
    if (/high.?five|thank/.test(text)) return ['🙌','HIGH FIVE!!!','SMACK! That was an excellent high five!!!'];
    if (/dance|giggle|joke|laugh|funny/.test(text)) return ['🎉','TINY HAPPY DANCE!!!','WIGGLE WIGGLE WIGGLE!!!'];
    if (/heart|love|miss you|adore/.test(text)) return ['💖','HEARTS FOR YOU!!!','Bubbles has approximately one million hearts for you!!!'];
    if (/sleep|bedtime|tired|nap/.test(text)) return ['🌙','SLEEPY CLOUD CUDDLES','A soft little cloud hug before dreamland!!!'];
    if (/wave|hello|hiii|hey|\bhi\b/.test(text)) return ['👋','HIIII FRIEND!!!','BUBBLES IS WAVING WITH BOTH TINY HANDS!!!'];
    if (/confetti|happy|excited|great|yay|wonderful/.test(text)) return ['✨','SPARKLE PARTY!!!','EVERYBODY GETS A SPARKLE!!!'];
    if (/sorry|apolog/.test(text)) return ['🩷','IT’S OKAY, FRIEND!!!','Sending a soft little heart your way.'];
    return ['💗','A LITTLE LOVE POP!!!','Bubbles sent you a tiny happy moment!!!'];
  };

  const showPopup = (reply, userMessage = '') => {
    if (!reply || reply === lastReply) return;
    lastReply = reply;
    const [prop,title,caption] = pickReaction(reply,userMessage);
    const el = ensurePopup();
    el.querySelector('.bw-reply-popup-prop').textContent = prop;
    el.querySelector('.bw-reply-popup-title').textContent = title;
    el.querySelector('.bw-reply-popup-caption').textContent = caption;
    el.classList.remove('is-leaving','is-visible');
    void el.offsetWidth;
    el.classList.add('is-visible');
    clearTimeout(timer);
    timer = setTimeout(() => {
      el.classList.add('is-leaving');
      setTimeout(() => el.classList.remove('is-visible','is-leaving'),260);
    }, 2300);
  };

  const attach = () => {
    const log = document.querySelector('.tier-chat-log');
    if (!log || log.dataset.bwPopupReady) return;
    log.dataset.bwPopupReady = 'yes';
    const panel = log.closest('.tier-chat-panel') || log.parentElement;
    let lastUser = '';
    const observer = new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) {
        if (!node || node.nodeType !== 1) continue;
        const replies = [];
        if (node.matches?.('.tier-bubbles-says')) replies.push(node);
        node.querySelectorAll?.('.tier-bubbles-says').forEach(el => replies.push(el));
        for (const reply of replies) {
          const text = (reply.textContent || '').trim();
          if (!text || text === lastReply) continue;
          const users = Array.from(log.querySelectorAll('.tier-you-say'));
          const preceding = users.filter(el => {
            const relation = el.compareDocumentPosition(reply);
            return Boolean(relation & Node.DOCUMENT_POSITION_FOLLOWING);
          }).pop();
          showPopup(text, preceding?.textContent || lastUser);
        }
        if (node.matches?.('.tier-you-say')) lastUser = node.textContent || '';
      }
    });
    observer.observe(log, {childList:true,subtree:true});
    if (panel) {
      panel.addEventListener('submit', event => {
        const input = panel.querySelector('.tier-chat-form input');
        if (input) lastUser = input.value || lastUser;
      }, true);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach);
  else attach();
  new MutationObserver(attach).observe(document.documentElement,{childList:true,subtree:true});
})();