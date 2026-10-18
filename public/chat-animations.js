(() => {
  const style = document.createElement('style');
  style.textContent = '.tier-chat-action{display:flex;align-items:center;justify-content:center;gap:12px;min-height:0;max-height:0;overflow:hidden;opacity:0;transition:all .25s ease;background:#fff0f8;border-radius:16px;margin:0 10px;font-size:38px}.tier-chat-action.show{min-height:94px;max-height:120px;opacity:1;margin:8px 10px;padding:8px}.tier-chat-action .act-baby{display:inline-block;font-size:48px;animation:chatBabyBounce .65s ease-in-out infinite alternate}.tier-chat-action .act-prop{display:inline-block;animation:chatPropPop .6s ease-out both}@keyframes chatBabyBounce{from{transform:translateY(4px) rotate(-5deg)}to{transform:translateY(-7px) rotate(5deg)}}@keyframes chatPropPop{from{transform:scale(.2) rotate(-25deg)}to{transform:scale(1) rotate(0)}}@keyframes chatHug{0%{transform:scale(1)}50%{transform:scale(1.25) rotate(-8deg)}100%{transform:scale(1)}}@media(prefers-reduced-motion:reduce){.tier-chat-action,.tier-chat-action *{animation:none!important;transition:none!important}}';
  document.head.appendChild(style);
  const findChat = () => {
    const log = document.querySelector('.tier-chat-log');
    if (!log || log.dataset.actionsReady) return;
    log.dataset.actionsReady = 'yes';
    const stage = document.createElement('div');
    stage.className = 'tier-chat-action';
    stage.setAttribute('aria-hidden', 'true');
    stage.innerHTML = '<span class="act-baby">☁️👶🏻</span><span class="act-prop">💗</span>';
    log.parentNode.insertBefore(stage, log);
    let timer;
    const showAction = (message, userMessage) => {
      const text = (message + ' ' + userMessage).toLowerCase();
      let prop = '💗', label = '♡';
      if (/cookie|snack|biscuit/.test(text)) { prop = '🍪'; label = 'COOKIE DELIVERY!!!'; }
      else if (/hug|cuddle|comfort|sad|lonely|upset|anxious|stress/.test(text)) { prop = '🫂'; label = 'BIG SQUISHY HUG!!!'; }
      else if (/flower|garden|bloom/.test(text)) { prop = '💐'; label = 'FLOWERS FOR YOU!!!'; }
      else if (/high.five|high five|thank/.test(text)) { prop = '🙌'; label = 'HIGH FIVE!!!'; }
      else if (/dance|giggle|joke|laugh|funny/.test(text)) { prop = '🎉'; label = 'TINY HAPPY DANCE!!!'; }
      else if (/heart|love|miss you/.test(text)) { prop = '💖'; label = 'HEARTS FOR YOU!!!'; }
      else if (/sleep|bedtime|tired|nap/.test(text)) { prop = '🌙'; label = 'SLEEPY CLOUD CUDDLES'; }
      else if (/wave|hello|hiii|hey|hi!/.test(text)) { prop = '👋'; label = 'HIIII FRIEND!!!'; }
      else if (/confetti|happy|excited|great/.test(text)) { prop = '✨'; label = 'SPARKLE PARTY!!!'; }
      stage.innerHTML = '<span class="act-baby">☁️👶🏻</span><span class="act-prop">' + prop + '</span><span style="font-size:12px;font-weight:700;color:#6e477c">' + label + '</span>';
      stage.classList.remove('show');
      void stage.offsetWidth;
      stage.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(() => stage.classList.remove('show'), 2400);
    };
    const observer = new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) {
        if (node.nodeType !== 1 || !node.classList.contains('tier-bubbles-says')) continue;
        const previous = log.querySelector('.tier-you-say:last-of-type');
        showAction(node.textContent || '', previous ? previous.textContent : '');
      }
    });
    observer.observe(log, { childList: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', findChat);
  else findChat();
  new MutationObserver(findChat).observe(document.documentElement, { childList: true, subtree: true });
})();