const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let toastTimer,audioContext,soundEnabled=true;
function say(message){const t=$("#toast");t.textContent=message;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2400)}
function beep(freq=620,duration=.22){if(!soundEnabled)return;try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;audioContext ||=new AC();if(audioContext.state==="suspended")audioContext.resume();const o=audioContext.createOscillator(),g=audioContext.createGain();o.type="square";o.frequency.setValueAtTime(freq,audioContext.currentTime);o.frequency.exponentialRampToValueAtTime(freq*1.7,audioContext.currentTime+duration*.55);g.gain.setValueAtTime(.0001,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.07,audioContext.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+duration);o.connect(g);g.connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+duration+.03)}catch(e){}}function babyGiggle(){if(!soundEnabled)return;try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;audioContext ||=new AC();if(audioContext.state==="suspended")audioContext.resume();const t=audioContext.currentTime;[0,.12,.24,.36,.51,.64,.79,.94,1.09,1.24].forEach((d,i)=>{const o=audioContext.createOscillator(),g=audioContext.createGain(),v=[560,760,640,920,600,840,680,1020,620,880][i];o.type="triangle";o.frequency.setValueAtTime(v,t+d);o.frequency.exponentialRampToValueAtTime(v*1.55,t+d+.045);o.frequency.exponentialRampToValueAtTime(v*.92,t+d+.095);g.gain.setValueAtTime(.0001,t+d);g.gain.exponentialRampToValueAtTime(.11,t+d+.012);g.gain.setValueAtTime(.065,t+d+.035);g.gain.exponentialRampToValueAtTime(.0001,t+d+.115);o.connect(g);g.connect(audioContext.destination);o.start(t+d);o.stop(t+d+.13)});say("HEHEHEHEHE!!! BABY GIGGLES!!!")}catch(e){}}
$("#musicToggle").addEventListener("click",e=>{soundEnabled=!soundEnabled;e.currentTarget.textContent=soundEnabled?"🔊 SOUND ON?":"🔇 SOUND OFF!";e.currentTarget.setAttribute("aria-pressed",String(!soundEnabled));if(soundEnabled)beep(700);say(soundEnabled?"NOISES ARE BACK!!!":"SHHHHHH... QUIET TIME!!!")});
$("#waveBtn").addEventListener("click",()=>{say("HIIIIIIII FRIEND!!! YOU LOOK VERY COOL TODAY!!! 👋");beep(700);$("#babyCharacter").animate([{transform:"rotate(0) translateY(0)"},{transform:"rotate(12deg) translateY(-12px)"},{transform:"rotate(-10deg) translateY(-5px)"},{transform:"rotate(0) translateY(0)"}],{duration:600})});
function boop(){const face=$(".mouth");face.style.width=face.style.width==="35px"?"22px":"35px";face.style.borderBottomWidth="5px";say(["HEHEHE!!!","BOOP!!!","THAT TICKLES!!!","U R MY FRIEND NOW!!!"][Math.floor(Math.random()*4)]);beep(540+Math.random()*400)}
$("#babyCharacter").addEventListener("click",boop);$("#babyCharacter").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();boop()}});
const doodles=["☀","♡","★","☁","✿","♫","✦","☺","🌈","🍓","🦋","☂"];
$("#drawBtn").addEventListener("click",()=>{const d=doodles[Math.floor(Math.random()*doodles.length)],f=doodles[Math.floor(Math.random()*doodles.length)];$("#doodleResult").innerHTML="LOOK!!! <span style='font-size:28px;color:#ff5b9b'>"+d+" "+f+" "+d+"</span>";beep(500);say("U MADE A MASTERPIECE!!!")});
$("#soundBtn").addEventListener("click",()=>{[523,659,784].forEach((f,i)=>setTimeout(()=>beep(f,.3),i*140));$("#soundResult").textContent=["PLOOP!!!","BING BONG!!!","BEE-DOO-BOP!!!","PIP PIP PLOOO!!!"][Math.floor(Math.random()*4)];say("MUSIC BABY!!!")});
let growth=0;$("#growBtn").addEventListener("click",()=>{growth++;const flowers=$$(".flower");flowers.forEach((f,i)=>{f.style.transform="scale("+(1+Math.min(growth,5)*.13)+") rotate("+(growth%2?8:-8)+"deg)";f.style.filter="hue-rotate("+(growth*25)+"deg)"});$("#gardenResult").textContent=growth>=5?"OMG A BIG HAPPY FLOWER JUNGLE!!! 🌼🌸🌷":"GROW LEVEL "+growth+"!!! 🌱";beep(500+growth*80);if(growth===5)say("LOOK AT OUR BIG GARDEN!!!")});
const pages=[{count:"STORY PAGE 1!!!",heading:"A TINY LITTLE PLOP!!!",text:"One day, a little cloud went PLOP! And out came ME!!! Bubbles!!! I had two socks, zero plans, and a VERY BIG idea.",color:"#94e8ff",face:":D"},{count:"STORY PAGE 2!!!",heading:"THE GREAT GIGGLE!!!",text:"I bounced on a rainbow, sneezed a glitter sneeze, and accidentally made the whole sky pink. Everybody laughed. So I decided my job would be making little things that make people go YAY!!!",color:"#ffb5d6",face:"^‿^"},{count:"STORY PAGE 3!!!",heading:"A WEBSITE FOR EVERYBABY!!!",text:"Then I found a magic rectangle called a computer. I put my doodles, my toys, and my VERY IMPORTANT face on it. Now every baby can come visit!!! THAT MEANS YOU!!!",color:"#cbb4ff",face:"♡‿♡"}];let page=0;
function renderPage(){$("#storyCount").textContent=pages[page].count;$("#storyHeading").textContent=pages[page].heading;$("#storyText").textContent=pages[page].text;$("#storyPicture").style.background=pages[page].color;/* story face is updated via .story-baby below */const face=$(".story-baby");face.textContent=pages[page].face;$("#storyBack").disabled=page===0;$("#storyNext").textContent=page===pages.length-1?"READ AGAIN!!! ↻":"NEXT PAGE!!! ➜"}
$("#storyBack").addEventListener("click",()=>{if(page>0)page--;renderPage()});$("#storyNext").addEventListener("click",()=>{page=(page+1)%pages.length;renderPage();beep(600)});

// BABY ARCADE: catch snacks, avoid suspicious socks, achieve crumb-based greatness.
(()=>{
 const arena=$("#arcadeArena"),start=$("#arcadeStart"),scoreLabel=$("#arcadeScore"),timeLabel=$("#arcadeTime"),rankLabel=$("#arcadeRank"),status=$("#arcadeStatus"),idle=$("#arcadeIdle");
 if(!arena||!start)return;
 let running=false,score=0,seconds=35,spawnTimer,clockTimer,round=0;
 const snacks=["🍪","🍓","🧀","🧁","🍉","🥨","🍕"],socks=["🧦","🧦","💩"];
 const ranks=[{n:0,t:"POTATO"},{n:3,t:"CRUMB INTERN"},{n:7,t:"SNACK WIZARD"},{n:12,t:"COOKIE CEO"},{n:18,t:"SUPREME GOBLIN"}];
 function update(){scoreLabel.textContent="SNACKS: "+score;timeLabel.textContent="TIME: "+seconds;rankLabel.textContent="RANK: "+ranks.filter(r=>score>=r.n).at(-1).t}
 function endGame(){running=false;clearInterval(spawnTimer);clearInterval(clockTimer);arena.querySelectorAll(".arcade-target").forEach(x=>x.remove());const title=score>=12?"COOKIE CEO!!! THE SNACK ECONOMY FEARS YOU.":score>=6?"CERTIFIED CRUMB GREMLIN!!!":"A VERY BRAVE LITTLE POTATO!!!";const card=document.createElement("div");card.className="arcade-end";card.innerHTML="<div>"+(score>=12?"🏆":score>=6?"🥨":"🥔")+"</div><strong>"+title+"</strong><p>You caught "+score+" snacks and "+(round-score)+" questionable objects. Bubbles is proud and mildly sticky.</p>";arena.appendChild(card);status.textContent=score>=12?"YOU HAVE ASCENDED TO SNACK HEAVEN!!!":score>=6?"NOT BAD, LITTLE CRUMB!!!":"THE SOCKS WON THIS ROUND. DISGUSTING.";start.textContent="PLAY AGAIN, YOU LITTLE MENACE!!! 🔁";if(score>=6&&typeof scorePoint==="function")scorePoint(3);beep(score>=6?880:330,.28)}
 function spawn(){if(!running)return;const bad=Math.random()<.29,el=document.createElement("button");el.type="button";el.className="arcade-target "+(bad?"sock-target":"snack-target");el.textContent=bad?socks[Math.floor(Math.random()*socks.length)]:snacks[Math.floor(Math.random()*snacks.length)];el.setAttribute("aria-label",bad?"Suspicious sock: avoid it":"Catch snack "+el.textContent);el.style.left=(3+Math.random()*82)+"%";el.style.top=(5+Math.random()*70)+"%";el.style.setProperty("--tilt",(Math.random()*35-17)+"deg");el.addEventListener("click",()=>{if(!running)return;round++;if(bad){score=Math.max(0,score-2);status.textContent=["EW!!! SOCK JUICE!!! -2","THAT SOCK HAS A JOB AND IT IS CRIME. -2","BUBBLES LICKED IT ONCE. NEVER AGAIN. -2"][Math.floor(Math.random()*3)];beep(180,.22)}else{score++;status.textContent=["NOM NOM NOM!!! +1 SNACK","CRONCH!!! A PERFECT LITTLE CRONCH. +1","THE BABY GOBLIN APPROVES. +1","EXCELLENT SNACK GRABBING, LEGEND. +1"][Math.floor(Math.random()*4)];beep(650+Math.random()*350,.12)}update();el.classList.add("caught");setTimeout(()=>el.remove(),180)});arena.appendChild(el);setTimeout(()=>{if(el.isConnected&&!el.classList.contains("caught")){el.classList.add("escaped");setTimeout(()=>el.remove(),250)}},2800)}
 start.addEventListener("click",()=>{if(running)return;clearInterval(spawnTimer);clearInterval(clockTimer);arena.querySelectorAll(".arcade-target,.arcade-end").forEach(x=>x.remove());idle.hidden=true;running=true;score=0;seconds=35;round=0;start.textContent="THE SNACKENING IS HAPPENING!!!";status.textContent="TAKE YOUR TIME!!! GRAB THE FOOD, NOT THE SOCKS!!!";update();spawn();spawnTimer=setInterval(spawn,1050);clockTimer=setInterval(()=>{seconds--;update();if(seconds<=0)endGame()},1000)});
 update();
})();

// GAME 02: Who Stole My Pacifier?! — a tiny, silly shell-shuffle detective game.
(()=>{
 const stage=$("#pacifierStage"),cups=$$("#pacifierCups .pacifier-cup"),start=$("#pacifierStart"),prompt=$("#pacifierPrompt"),status=$("#pacifierStatus"),scoreLabel=$("#pacifierScore");
 if(!stage||!cups.length||!start)return;
 let target=1,found=0,playing=false,roundToken=0;
 function paint(){cups.forEach((cup,i)=>{cup.classList.remove("revealed","correct","wrong","shuffling");cup.querySelector(".cup-cloud").textContent="☁️";cup.querySelector(".cup-number").textContent="CLOUD "+(i+1);cup.disabled=!playing})}
 function reveal(){cups.forEach((cup,i)=>{cup.classList.add("revealed");cup.querySelector(".cup-cloud").textContent=i===target?"🍼":"☁️";cup.querySelector(".cup-number").textContent=i===target?"BINKY!!!":"JUST A CLOUD"})}
 function begin(){roundToken++;const token=roundToken;playing=false;target=Math.floor(Math.random()*3);paint();prompt.textContent="WATCH THE BINKY!!! 👀";status.textContent="IT'S UNDER ONE OF THESE CLOUDS...";cups[target].querySelector(".cup-cloud").textContent="🍼";cups[target].classList.add("revealed");cups.forEach(c=>c.disabled=true);
 setTimeout(()=>{if(token!==roundToken)return;cups[target].querySelector(".cup-cloud").textContent="☁️";cups.forEach(c=>c.classList.remove("revealed"));prompt.textContent="SHUFFLE SHUFFLE SHUFFLE!!!";let swaps=0;const shuffle=setInterval(()=>{if(token!==roundToken){clearInterval(shuffle);return}const a=Math.floor(Math.random()*3),b=(a+1+Math.floor(Math.random()*2))%3;cups[a].classList.add("shuffling");cups[b].classList.add("shuffling");setTimeout(()=>{cups[a].classList.remove("shuffling");cups[b].classList.remove("shuffling")},260);if(target===a)target=b;else if(target===b)target=a;swaps++;if(swaps>=4){clearInterval(shuffle);playing=true;cups.forEach(c=>c.disabled=false);prompt.textContent="WHERE'S THE BINKY?!";status.textContent="PICK CLOUD 1, 2, OR 3!!!";start.textContent="SHUFFLE AGAIN!!! 🔁"}},330)},900)}
 cups.forEach((cup,i)=>cup.addEventListener("click",()=>{if(!playing)return;playing=false;cups.forEach(c=>c.disabled=true);const correct=i===target;if(correct){found++;cup.classList.add("correct");cup.querySelector(".cup-cloud").textContent="🍼";status.textContent=["YOU FOUND IT!!! BABY DETECTIVE!!! 🕵️","BINKY RECOVERED!!! THE BABY CAN BREATHE!!!","GENIUS!!! THE CLOUDS HAVE BEEN QUESTIONED."][found%3];prompt.textContent="MYSTERY SOLVED!!! 🎉";if(typeof scorePoint==="function")scorePoint(2);beep(850,.15);setTimeout(()=>beep(1100,.18),130)}else{cup.classList.add("wrong");cups[target].classList.add("correct");cups[target].querySelector(".cup-cloud").textContent="🍼";status.textContent="NOOOPE!!! THAT CLOUD IS JUST FLUFF. TRY AGAIN!!!";prompt.textContent="THE BINKY WAS OVER HERE!!!";beep(240,.18)}scoreLabel.textContent="BINKIES FOUND: "+found;start.textContent="PLAY ANOTHER ROUND!!! 🔁";}));
 start.addEventListener("click",begin);paint();
})();

// GAME 03: Tiny memory test — see three icons, then find them at your own pace.
(()=>{
 const start=$("#brainStart"),prompt=$("#brainPrompt"),options=$("#brainOptions"),status=$("#brainStatus");
 if(!start||!options)return;
 const all=["🍓","🐸","🌈","🧦","⭐","🍪"];
 let chosen=[],found=new Set(),playing=false;
 function drawOptions(){options.querySelectorAll("button").forEach(btn=>{btn.disabled=!playing;btn.classList.toggle("found",found.has(btn.textContent));btn.textContent=btn.dataset.item||btn.textContent})}
 options.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{
   if(!playing||found.has(btn.dataset.item))return;
   if(chosen.includes(btn.dataset.item)){found.add(btn.dataset.item);btn.classList.add("found");status.textContent=["YES!!! BRAIN WRINKLE ACQUIRED.","CORRECT!!! THE POTATO IS EVOLVING.","BIG BRAIN BABY!!!"][found.size%3];beep(650+found.size*100,.15)}
   else{status.textContent="NOPE! THAT ONE IS JUST A SILLY LITTLE GUY. TRY AGAIN.";beep(230,.15)}
   if(found.size===chosen.length){playing=false;drawOptions();prompt.textContent="MEMORY CHAMPION!!! 🏆";status.textContent="YOU REMEMBERED ALL THREE!!! BUBBLES IS VERY IMPRESSED.";start.textContent="PLAY AGAIN, SMART POTATO!!! 🔁";if(typeof scorePoint==="function")scorePoint(2)}
 }));
 start.addEventListener("click",()=>{
   chosen=[];found=new Set();playing=false;
   const pool=[...all];while(chosen.length<3){const i=Math.floor(Math.random()*pool.length);chosen.push(pool.splice(i,1)[0])}
   options.querySelectorAll("button").forEach((btn,i)=>{btn.dataset.item=all[i];btn.textContent=chosen.includes(all[i])?all[i]:"❔";btn.disabled=true;btn.classList.remove("found")});
   prompt.textContent=chosen.join("   ")+"   LOOK LOOK LOOK!!!";status.textContent="MEMORIZE THOSE THREE LITTLE GUYS...";start.textContent="I SAW THEM!!! START GUESSING";
   setTimeout(()=>{prompt.textContent="WHICH THREE DID YOU SEE?";options.querySelectorAll("button").forEach(btn=>{btn.textContent=btn.dataset.item;btn.disabled=false});playing=true;status.textContent="TAP THE THREE YOU REMEMBER. NO TIMER!!!"},2600);
 });
})();

const happyFaces=$("#happyFaces");$$("[data-face]").forEach(btn=>btn.addEventListener("click",()=>{const span=document.createElement("span");span.textContent=btn.dataset.face;span.style.color=["#ff5b9b","#7a3d88","#368ab1"][Math.floor(Math.random()*3)];happyFaces.appendChild(span);if(happyFaces.children.length>14)happyFaces.firstElementChild.remove();$("#happyMessage").textContent="YAY!!! "+btn.dataset.face+" IS IN THE HAPPY JAR!!!";beep(680);}));
$("#hugBtn").addEventListener("click",()=>{$("#hugResult").textContent="BIG SQUISHY HUGGGGG!!! 🤗♡🤗";beep(520);setTimeout(()=>beep(740),140);});
const babyFortunes=[
 {title:"A SNACK IS IN YOUR FUTURE.",note:"THE COOKIE KNOWS. THE COOKIE ALWAYS KNOWS. 🍪"},
 {title:"YOU WILL FIND A TINY TREASURE.",note:"IT MAY BE A COIN. IT MAY BE A CRUMB. VALUE IS A SOCIAL CONSTRUCT. ✨"},
 {title:"SOMEONE THINKS YOU ARE COOL.",note:"IT IS BUBBLES. BUBBLES IS SOMEONE. 💖"},
 {title:"TODAY IS A GOOD DAY TO WIGGLE.",note:"WIGGLE FIRST. ASK QUESTIONS NEVER. 🕺"},
 {title:"YOUR BRAIN CELL WILL RETURN.",note:"IT WENT TO BUY MILK. IT WILL BE BACK. 🧠"},
 {title:"A BIG GIGGLE IS APPROACHING.",note:"PROBABLY AT A VERY INCONVENIENT TIME. 🤭"},
 {title:"YOU ARE 100% LITTLE LEGEND.",note:"OFFICIAL STAMP. NO APPEALS. 👑"},
 {title:"A CLOUD IS ROOTING FOR YOU.",note:"THAT CLOUD IS ME. I AM VERY SOFT. ☁️"},
 {title:"YOU SHALL CONQUER A SOCK.",note:"THE LEFT ONE. THE RIGHT ONE REMAINS MYSTERIOUS. 🧦"},
 {title:"YOUR VIBE IS SPARKLY SOUP.",note:"NOBODY KNOWS WHAT THAT MEANS. IT IS A COMPLIMENT. 🪩"},
 {title:"A SURPRISE WILL GO PLOP.",note:"KEEP YOUR EYES OPEN AND YOUR SNACKS CLOSER. 🌈"},
 {title:"YOU DESERVE A LITTLE REST.",note:"EVEN LEGENDS NEED A NAP. ZZZ... 🌙"}
];
let currentFortune=null;
function readFortuneAloud(){if(!currentFortune)return;const hint=$("#fortuneVoiceHint");if(!("speechSynthesis" in window)||!("SpeechSynthesisUtterance" in window)){hint.textContent="OH NOOO!!! THIS BROWSER DOES NOT HAVE A TALKING BABY VOICE. TRY A DIFFERENT BROWSER!";return}window.speechSynthesis.cancel();const line=currentFortune.title+" "+currentFortune.note;const utterance=new SpeechSynthesisUtterance(line);utterance.lang="en-US";utterance.rate=.86;utterance.pitch=1.75;const voices=window.speechSynthesis.getVoices();const voice=voices.find(v=>/^en(-|_)/i.test(v.lang)&&/female|child|samantha|zira|aria|jenny/i.test(v.name))||voices.find(v=>/^en(-|_)/i.test(v.lang));if(voice)utterance.voice=voice;utterance.onstart=()=>{hint.textContent="BA BA BA... BUBBLES IS READING!!! 🍼";$("#fortuneVoiceBtn").textContent="🔊 BUBBLES IS TALKING..."};utterance.onend=()=>{$("#fortuneVoiceBtn").textContent="🍼 READ IT AGAIN!!!";hint.textContent="THE PROPHECY HAS BEEN DELIVERED. GOO GOO GAA GAA!!!"};utterance.onerror=()=>{$("#fortuneVoiceBtn").textContent="🍼 READ IT TO ME, BABY!!! 🔊";hint.textContent="THE BABY VOICE GOT THE HICCUPS. TAP TO TRY AGAIN!!!"};window.speechSynthesis.speak(utterance)}
$("#fortuneVoiceBtn").disabled=!("speechSynthesis" in window);
$("#fortuneVoiceBtn").addEventListener("click",readFortuneAloud);
$("#fortuneBtn").addEventListener("click",()=>{
 if("speechSynthesis" in window)window.speechSynthesis.cancel();
 const paper=$("#fortunePaper"),pick=babyFortunes[Math.floor(Math.random()*babyFortunes.length)];currentFortune=pick;
 paper.classList.remove("fortune-pop");void paper.offsetWidth;paper.classList.add("fortune-pop");
 paper.innerHTML="<span>THE CLOUDS HAVE SPOKEN!!!</span><strong>"+pick.title+"</strong><small>"+pick.note+"</small>";
 $("#fortuneStatus").textContent=["THE PROPHECY IS PROBABLY ACCURATE!!!","BUBBLES CONSULTED ONE (1) CRAYON.","THE FUTURE SMELLS LIKE BISCUITS.","DO NOT QUESTION THE MAGIC CLOUD."][Math.floor(Math.random()*4)];
 $("#fortuneVoiceBtn").disabled=false;$("#fortuneVoiceBtn").textContent="🍼 READ IT TO ME, BABY!!! 🔊";$("#fortuneVoiceHint").textContent="PSSST... WANT BUBBLES TO READ IT OUT LOUD?";
 beep(620,.14);setTimeout(()=>beep(850,.16),100);if(typeof scorePoint==="function")scorePoint(1);
});
let secrets=0;function secretClick(){secrets++;const secret=$("#secretButton");if(secrets<5){secret.animate([{transform:"scale(1) rotate(0)"},{transform:"scale(1.35) rotate(20deg)"},{transform:"scale(1) rotate(0)"}],{duration:350});say(["teehee...","wrong flower!!!","getting warmer!!!","ONE MORE!!!"][secrets-1]);beep(400+secrets*70)}else{say("SECRET UNLOCKED!!! BUBBLES THINKS YOU ARE THE BEST BABY EVER!!! ♡");secret.textContent="♡";secret.classList.add("secret-unlocked");secret.setAttribute("aria-label","Secret unlocked! You are Bubbles' best baby ever");secret.title="YOU FOUND THE SECRET!!!";const note=document.createElement("div");note.id="secretNote";note.setAttribute("role","status");note.innerHTML="<strong>YOU FOUND MY SECRET!!! ♡</strong><span>YOU ARE BUBBLES' BEST BABY EVER!!!</span><span>🌈 ⭐ 🌼 THANK YOU FOR PLAYING!!! 🌼 ⭐ 🌈</span>";document.body.appendChild(note);for(let i=0;i<22;i++)setTimeout(()=>shoutAt(Math.random()*window.innerWidth,Math.random()*window.innerHeight),i*45);[523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,.24),i*130));secret.removeEventListener("click",secretClick)}}$("#secretButton").addEventListener("click",secretClick);
renderPage();

// Tiny toy-like surprises all around Baby World.
const popEmojis=["💖","⭐","🌈","🫧","🌼","🍓","🦋","✨","☁️","🎀"];
document.addEventListener("click",e=>{if(e.target.closest("button,a"))return;const pop=document.createElement("span");pop.className="click-pop";pop.textContent=popEmojis[Math.floor(Math.random()*popEmojis.length)];pop.style.left=e.clientX+"px";pop.style.top=e.clientY+"px";document.body.appendChild(pop);setTimeout(()=>pop.remove(),900)});
const floatyLayer=document.createElement("div");floatyLayer.setAttribute("aria-hidden","true");document.body.appendChild(floatyLayer);
function sendPlaything(){if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const thing=document.createElement("span");thing.className="floating-plaything";thing.textContent=popEmojis[Math.floor(Math.random()*popEmojis.length)];thing.style.left=(Math.random()*94)+"vw";const duration=9+Math.random()*10;thing.style.animationDuration=duration+"s";thing.style.fontSize=(22+Math.random()*24)+"px";floatyLayer.appendChild(thing);setTimeout(()=>thing.remove(),duration*1000)}
for(let i=0;i<7;i++)setTimeout(sendPlaything,i*550);setInterval(sendPlaything,2400);
$$(".hero-stickers .sticker").forEach((sticker,i)=>{sticker.addEventListener("click",()=>{sticker.animate([{transform:"scale(1) rotate(0deg)"},{transform:"scale(1.55) rotate(20deg)"},{transform:"scale(1) rotate(-10deg)"}],{duration:550});say(["SPARKLY!!!","HEART ATTACK!!!","WOW WOW WOW!!!"][i%3]);beep(650+i*100)})});
$(".baby-name-tag").addEventListener("click",()=>{say("BUBBLES BUBBLES BUBBLES!!! THAT’S ME!!!");beep(780)});

// The signature Baby World playroom: drag, boop, collect happy points, then unleash chaos.
const playStage=$("#playroomStage"),playMessage=$("#playroomMessage"),scoreLabel=$("#playScore");let happyPoints=0,dragToy=null,dragOffset={x:0,y:0},dragStart={x:0,y:0},didDrag=false;
let partyUnlocked=false;
function scorePoint(amount=1){happyPoints=Math.min(100,happyPoints+amount);scoreLabel.textContent="HAPPY POINTS: "+String(happyPoints).padStart(3,"0");const fill=$("#evolutionFill"),title=$("#evolutionTitle"),hint=$("#evolutionHint"),face=$("#evolutionFace");if(fill)fill.style.width=happyPoints+"%";if(happyPoints<20){title.textContent="TINY BABY MODE!!!";hint.textContent="Play with the toys to fill up my giggle tank!!!";face.textContent="૮ ˶ᵔ ᵕ ᵔ˶ ა"}else if(happyPoints<45){title.textContent="GIGGLE GOBLIN!!!";hint.textContent="HEHEHE!!! I AM GETTING BOUNCIER!!!";face.textContent="૮ > ﻌ < ა"}else if(happyPoints<70){title.textContent="RAINBOW ROCKET BABY!!!";hint.textContent="WOW WOW WOW!!! KEEP THE HAPPY COMING!!!";face.textContent="૮ ✧ ﻌ ✧ ა"}else if(happyPoints<100){title.textContent="PARTY BABY!!!";hint.textContent="THE PARTY IS ALMOST READY!!!";face.textContent="૮ ★ ﻌ ★ ა"}else{title.textContent="ULTIMATE GIGGLE GOD!!!";hint.textContent="YOU DID IT!!! THE WHOLE WORLD IS A PARTY!!!";face.textContent="૮ ✨ ﻌ ✨ ა";if(!partyUnlocked)unlockParty()}if(fill)fill.style.background=happyPoints>=100?"linear-gradient(90deg,#ff5b9b,#ffb15d,#b8f28b,#94e8ff,#cbb4ff)":"linear-gradient(90deg,#ff5b9b,#ffb15d,#b8f28b)";}
function unlockParty(){partyUnlocked=true;const finale=$("#partyFinale");finale.classList.add("party-unlocked");finale.scrollIntoView({behavior:"smooth",block:"center"});say("SECRET BIRTHDAY PARTY UNLOCKED!!! YOU DID IT!!! 🎂🎉");for(let i=0;i<28;i++)setTimeout(()=>{const x=Math.random()*window.innerWidth,y=Math.random()*window.innerHeight;shoutAt(x,y)},i*70);[523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,.3),i*130))}
$("#partyAgainBtn").addEventListener("click",()=>{const finale=$("#partyFinale");finale.classList.remove("party-unlocked");void finale.offsetWidth;finale.classList.add("party-unlocked");say("PARTY PARTY PARTY!!! 🎉");for(let i=0;i<14;i++)setTimeout(()=>shoutAt(Math.random()*window.innerWidth,Math.random()*window.innerHeight),i*70);[659,784,988].forEach((f,i)=>setTimeout(()=>beep(f,.25),i*120))});
function sparkAt(x,y,emoji="✨"){const s=document.createElement("span");s.className="toy-spark";s.textContent=emoji;s.style.left=x+"px";s.style.top=y+"px";playStage.appendChild(s);setTimeout(()=>s.remove(),850)}
function toyReact(toy){scorePoint();const reactions={"🌈":"RAINBOW WOWWW!!!","⭐":"U R A SUPERSTAR!!!","💖":"LOVE LOVE LOVE!!!","🐥":"QUACK QUACK BABYYYY!!!","🌼":"FLOWER POWER!!!","☁️":"CLOUD NINE!!!"};playMessage.textContent=reactions[toy.dataset.toy]||"YAAAAAY!!!";toy.animate([{transform:"scale(1) rotate(0)"},{transform:"scale(1.35) rotate(14deg)"},{transform:"scale(.95) rotate(-8deg)"},{transform:"scale(1) rotate(0)"}],{duration:520});beep(560+Math.random()*420);const r=toy.getBoundingClientRect(),sr=playStage.getBoundingClientRect();sparkAt(r.left-sr.left+r.width/2,r.top-sr.top+r.height/2,toy.dataset.toy)}
$$(".draggable-toy").forEach(toy=>{toy.addEventListener("pointerdown",e=>{dragToy=toy;didDrag=false;const r=toy.getBoundingClientRect(),sr=playStage.getBoundingClientRect();dragOffset={x:e.clientX-r.left,y:e.clientY-r.top};dragStart={x:e.clientX,y:e.clientY};toy.setPointerCapture(e.pointerId);toy.style.zIndex="6";});toy.addEventListener("pointermove",e=>{if(dragToy!==toy)return;if(Math.hypot(e.clientX-dragStart.x,e.clientY-dragStart.y)>7)didDrag=true;if(!didDrag)return;const sr=playStage.getBoundingClientRect();const x=Math.max(0,Math.min(sr.width-toy.offsetWidth,e.clientX-sr.left-dragOffset.x)),y=Math.max(0,Math.min(sr.height-toy.offsetHeight,e.clientY-sr.top-dragOffset.y));toy.style.left=x+"px";toy.style.top=y+"px";toy.style.right="auto";toy.style.bottom="auto";});toy.addEventListener("pointerup",e=>{if(dragToy!==toy)return;dragToy=null;toy.style.zIndex="3";if(didDrag){toyReact(toy);playMessage.textContent="YOU MOVED IT!!! GENIUS BABY!!!"}else toyReact(toy)});toy.addEventListener("pointercancel",()=>{dragToy=null})});
function stopDancingBabies(){const layer=$("#dancingBabiesLayer");if(layer)layer.remove()}function startDancingBabies(){stopDancingBabies();const layer=document.createElement("div");layer.id="dancingBabiesLayer";layer.setAttribute("aria-label","Dancing baby party");const close=document.createElement("button");close.type="button";close.className="stop-baby-party";close.textContent="🛑 STOP THE BABY CHAOS";close.addEventListener("click",stopDancingBabies);layer.appendChild(close);const babies=["👶","👶🏻","👶🏽","👶🏿","🍼","👼","👶🏼","👶🏾","👶🏻","👼🏻","👶🏽","🍼"];babies.forEach((baby,i)=>{const el=document.createElement("div");el.className="dancing-baby full-baby";el.setAttribute("role","img");el.setAttribute("aria-label","Dancing cartoon baby");el.style.left=(2+Math.random()*91)+"vw";el.style.top=(7+Math.random()*78)+"vh";el.style.animationDelay=(-Math.random()*1.8)+"s";el.style.setProperty("--baby-turn",(Math.random()*40-20)+"deg");el.style.setProperty("--skin",["#ffd1b5","#f2b78f","#d99468","#b96f4e","#ffe0c7"][i%5]);el.style.setProperty("--onesie",["#ff5b9b","#94e8ff","#b8f28b","#cbb4ff","#ffcf5c","#ffffff"][i%6]);el.innerHTML="<span class=\"baby-head\"><i class=\"baby-eye left-eye\"></i><i class=\"baby-eye right-eye\"></i><i class=\"baby-cheek left-cheek\"></i><i class=\"baby-cheek right-cheek\"></i><i class=\"baby-smile\"></i><i class=\"baby-tuft\"></i></span><span class=\"baby-arm left-arm\"></span><span class=\"baby-arm right-arm\"></span><span class=\"baby-torso\"></span><span class=\"baby-leg left-leg\"></span><span class=\"baby-leg right-leg\"></span>";layer.appendChild(el)});document.body.appendChild(layer)}$("#chaosBtn").addEventListener("click",()=>{playStage.classList.remove("playroom-shake","playroom-party");void playStage.offsetWidth;playStage.classList.add("playroom-shake","playroom-party");document.body.classList.remove("mega-chaos");void document.body.offsetWidth;document.body.classList.add("mega-chaos");setTimeout(()=>document.body.classList.remove("mega-chaos"),2800);startDancingBabies();babyGiggle();$$(".draggable-toy").forEach(toy=>{toy.style.left=(4+Math.random()*82)+"%";toy.style.top=(12+Math.random()*62)+"%";toy.style.right="auto";toy.style.bottom="auto";toy.animate([{transform:"scale(.5) rotate(0)"},{transform:"scale(1.4) rotate(35deg)"},{transform:"scale(1) rotate(-15deg)"}],{duration:650,easing:"cubic-bezier(.2,1.8,.4,1)"})});for(let i=0;i<28;i++)setTimeout(()=>sparkAt(Math.random()*(playStage.clientWidth-30),Math.random()*(playStage.clientHeight-30),popEmojis[Math.floor(Math.random()*popEmojis.length)]),i*35);for(let i=0;i<22;i++)setTimeout(()=>shoutAt(Math.random()*window.innerWidth,Math.random()*window.innerHeight),i*55);scorePoint(5);playMessage.textContent="AAAAAA CHAOSSSSS!!! BABY GIGGLES!!! +5 HAPPY POINTS!!!";});

// Extra personality: oversized shout bubbles, scroll-in entrances, and a super-bouncy playroom.
const shoutWords=["WHEEEEE!!!","BOOP!!!","YAY BABY!!!","GIGGLE TIME!!!","WOWIE!!!","PLOOOOP!!!","SO MUCH FUN!!!","HEHEHE!!!","TA-DAAAAA!!!","BIG HAPPY!!!"];
function shoutAt(x,y){if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const w=document.createElement("span");w.className="word-burst";w.textContent=shoutWords[Math.floor(Math.random()*shoutWords.length)];w.style.left=x+"px";w.style.top=y+"px";document.body.appendChild(w);setTimeout(()=>w.remove(),950)}
document.addEventListener("click",e=>{if(e.target.closest("button,a,.draggable-toy")){const r=e.target.getBoundingClientRect();shoutAt(r.left+r.width/2,r.top+Math.min(r.height/2,45));}});
const revealTargets=$$(".about-board,.toy-card,.story-box,.guestbook-inner,.playroom-board,.bye-section");
if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&"IntersectionObserver" in window){revealTargets.forEach(el=>el.classList.add("scroll-pop"));const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");revealObserver.unobserve(entry.target)}}),{threshold:.12});revealTargets.forEach(el=>revealObserver.observe(el));}else revealTargets.forEach(el=>el.classList.add("is-visible"));
$("#chaosBtn").addEventListener("pointerenter",()=>{if(window.matchMedia("(hover:hover)").matches)$("#chaosBtn").animate([{transform:"translateX(-50%) rotate(-2deg) scale(1)"},{transform:"translateX(-50%) rotate(3deg) scale(1.12)"},{transform:"translateX(-50%) rotate(-4deg) scale(1.04)"}],{duration:450})});
$("#playroomStage").addEventListener("dblclick",e=>{if(e.target.closest("button"))return;for(let i=0;i<8;i++)setTimeout(()=>sparkAt(Math.random()*(playStage.clientWidth-30),Math.random()*(playStage.clientHeight-30),["💖","⭐","🌈","🫧","🌼"][i%5]),i*45);playMessage.textContent="THE FLOOR IS LAVA!!! JUST KIDDING!!!";scorePoint(2);beep(880)});
/* Tier polish: night mode, cursor-following eyes, sparkle trail, visit odometer, and scroll story meter. */
const themeButton=$("#dayNightToggle");
themeButton.addEventListener("click",()=>{
  const isNight=document.body.classList.toggle("night-mode");
  themeButton.textContent=isNight?"☀️ DAY MODE!":"🌙 NIGHT MODE?";
  themeButton.setAttribute("aria-pressed",String(isNight));
  document.querySelector('meta[name="theme-color"]').content=isNight?"#24213b":"#ffed7a";
  say(isNight?"NIGHT-NIGHT, BABY!!! 🌙":"GOOD MORNING, EVERYBABYYYY!!! ☀️");
  beep(isNight?440:740);
});
let lastSpark=0;
document.addEventListener("pointermove",e=>{
  if(e.pointerType!=="mouse"||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const now=performance.now();if(now-lastSpark<65)return;lastSpark=now;
  const sparkle=document.createElement("span");sparkle.className="cursor-sparkle";
  sparkle.textContent=["✦","♡","✧","⋆","✿"][Math.floor(Math.random()*5)];
  sparkle.style.left=e.clientX+"px";sparkle.style.top=e.clientY+"px";
  document.body.appendChild(sparkle);setTimeout(()=>sparkle.remove(),700);
});
document.addEventListener("pointermove",e=>{
  if(!window.matchMedia("(hover:hover)").matches)return;
  const stage=$("#characterStage")||$(".character-stage"),face=$(".baby-face");
  if(!stage||!face)return;
  const r=face.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  const dx=Math.max(-5,Math.min(5,(e.clientX-cx)/24)),dy=Math.max(-4,Math.min(4,(e.clientY-cy)/28));
  $$(".eye").forEach(eye=>{eye.style.translate=dx+"px "+dy+"px"});
});
try{
  const visits=Number(localStorage.getItem("bubblesBabyVisits")||0)+1;
  localStorage.setItem("bubblesBabyVisits",String(visits));
  $("#visitCounter").textContent="BABIES VISITED: "+String(visits).padStart(4,"0");
}catch(e){$("#visitCounter").textContent="BABIES VISITED: 0001";}
function updateStoryScroll(){
  const story=$("#story"),fill=$("#storyScrollFill");if(!story||!fill)return;
  const r=story.getBoundingClientRect(),span=r.height-window.innerHeight;
  const progress=span<=0?(r.top<window.innerHeight?1:0):Math.max(0,Math.min(1,(window.innerHeight-r.top)/(r.height+window.innerHeight)));
  fill.style.width=(progress*100)+"%";
}
window.addEventListener("scroll",updateStoryScroll,{passive:true});window.addEventListener("resize",updateStoryScroll);updateStoryScroll();

/* Responsive Chaos Mode: optional extra-silly play that stays touch-friendly. */
const chaosModeButton=$("#responsiveChaosToggle");
chaosModeButton.addEventListener("click",()=>{
  const enabled=playStage.classList.toggle("responsive-chaos");
  chaosModeButton.setAttribute("aria-pressed",String(enabled));
  chaosModeButton.textContent=enabled?"🌪️ CHAOS MODE: ON!!!":"🌪️ CHAOS MODE: OFF";
  playMessage.textContent=enabled?"UH OH!!! THE TOYS ARE EXTRA WIGGLY!!!":"CALM TOYS!!! FOR NOW!!!";
  say(enabled?"CHAOS MODE ACTIVATED!!! HOLD ON TO YOUR SOCKS!!!":"CHAOS MODE OFF!!! EVERYBODY BREATHE!!!");
  beep(enabled?820:520);
  if(enabled){scorePoint(2);for(let i=0;i<8;i++)setTimeout(()=>sparkAt(Math.random()*(playStage.clientWidth-30),Math.random()*(playStage.clientHeight-30),popEmojis[i%popEmojis.length]),i*45);document.body.classList.add("mega-chaos");playStage.classList.add("mega-shake");setTimeout(()=>{document.body.classList.remove("mega-chaos");playStage.classList.remove("mega-shake")},2200);for(let i=0;i<18;i++)setTimeout(()=>shoutAt(Math.random()*window.innerWidth,Math.random()*window.innerHeight),i*65);[260,740,420,980,330,880,520].forEach((f,i)=>setTimeout(()=>beep(f,.13),i*105));say("MEGA CHAOS!!! BUBBLES HAS THE GIGGLES!!!")}else{document.body.classList.remove("mega-chaos");playStage.classList.remove("mega-shake")}
});

// Dreamy full-screen sleep mode: keep the website visible behind a soft night veil.
function openSleepMode(){const el=$("#sleepMode");if(!el)return;el.classList.add("is-open");el.setAttribute("aria-hidden","false");document.body.classList.add("sleep-mode-open");$("#sleepToggleMusic").textContent=lullabyPlaying?"Ⅱ PAUSE LULLABY":"▶ PLAY LULLABY";$("#sleepRoomStatus").textContent=lullabyMuted||!soundEnabled?"The room is quiet and cozy. Sound is muted.":"A tiny lullaby for a tiny cloud baby. Let the stars keep watch. ♡";$("#sleepClose").focus({preventScroll:true})}
function closeSleepMode(){const el=$("#sleepMode");if(!el)return;el.classList.remove("is-open");el.setAttribute("aria-hidden","true");document.body.classList.remove("sleep-mode-open")}
$("#sleepClose").addEventListener("click",closeSleepMode);
$("#sleepToggleMusic").addEventListener("click",()=>{if(lullabyPlaying){stopLullaby();$("#sleepToggleMusic").textContent="▶ PLAY LULLABY";$("#sleepRoomStatus").textContent="The music box is resting. Sweet dreams, Bubbles."}else{$("#lullabyPlay").click();$("#sleepToggleMusic").textContent="Ⅱ PAUSE LULLABY"}});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&$("#sleepMode").classList.contains("is-open"))closeSleepMode()});
// Lullaby Lab: play the three original, unmodified audio files.
const lullabyTunes={
  moon:{title:"SLEEPY FOREST HUSH",src:"/audio/twilight-forest-lullaby.mp3"},
  cloud:{title:"BUBBLES’ OCEAN CUDDLES",src:"/audio/gentle-ocean-drift.mp3"},
  star:{title:"TWINKLE-TINY LOVE SONG",src:"/audio/sweet-lullaby-with-vocals.mp3"}
};
let selectedLullaby="moon",lullabyMuted=false,lullabyPlaying=false;
const lullabyAudio=new Audio();
lullabyAudio.preload="auto";
lullabyAudio.loop=true;
lullabyAudio.src=lullabyTunes[selectedLullaby].src;
function syncLullabyButtons(){
 const b=$("#lullabyPlay");if(b){b.textContent=lullabyPlaying?"Ⅱ PAUSE LULLABY":"▶ PLAY LULLABY";b.setAttribute("aria-pressed",String(lullabyPlaying))}
 const sb=$("#sleepToggleMusic");if(sb)sb.textContent=lullabyPlaying?"Ⅱ PAUSE LULLABY":"▶ PLAY LULLABY";
}
function stopLullaby(showMessage=true){
 lullabyAudio.pause();lullabyPlaying=false;syncLullabyButtons();
 if(showMessage)$("#lullabyStatus").textContent=lullabyMuted?"Muted for quiet dreams.":"The lullaby is resting. Pick a track for another little dream.";
}
async function startLullaby(){
 try{
  lullabyAudio.src=lullabyTunes[selectedLullaby].src;
  lullabyAudio.loop=true;lullabyAudio.muted=lullabyMuted;
  await lullabyAudio.play();lullabyPlaying=true;syncLullabyButtons();
  $("#lullabyStatus").textContent="Playing your original recording. Sweet dreams. ♡";
  $("#sleepRoomStatus").textContent="Your lullaby is playing. Let the stars keep watch. ♡";
 }catch(e){
  lullabyPlaying=false;syncLullabyButtons();
  $("#lullabyStatus").textContent="The audio couldn't start. Press play again, or check that sound is enabled.";
  $("#sleepRoomStatus").textContent="Tap play once more to start the lullaby.";
 }
}
$("#lullabyPlay").addEventListener("click",async()=>{
 if(lullabyPlaying){stopLullaby();closeSleepMode();return}
 openSleepMode();await startLullaby();
});
$("#lullabyMute").addEventListener("click",()=>{
 lullabyMuted=!lullabyMuted;lullabyAudio.muted=lullabyMuted;
 const b=$("#lullabyMute");b.textContent=lullabyMuted?"🔇 MUTED":"🔊 SOUND ON";b.setAttribute("aria-pressed",String(lullabyMuted));
 $("#lullabyStatus").textContent=lullabyMuted?"Shhh... the lullaby is muted.":"Sound is back. Sweet dreams, tiny friend.";
});
$$(".lullaby-pick").forEach(btn=>btn.addEventListener("click",async()=>{
 selectedLullaby=btn.dataset.tune;
 $$(".lullaby-pick").forEach(b=>{const active=b===btn;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active))});
 $("#lullabyTitle").textContent=lullabyTunes[selectedLullaby].title;
 lullabyAudio.pause();lullabyAudio.src=lullabyTunes[selectedLullaby].src;lullabyAudio.currentTime=0;
 if(lullabyPlaying)await startLullaby();else $("#lullabyStatus").textContent="Track selected. Press play when you're cozy.";
}));
$("#sleepToggleMusic").addEventListener("click",async()=>{
 if(lullabyPlaying){stopLullaby();$("#sleepRoomStatus").textContent="The lullaby is resting. Sweet dreams, Bubbles."}
 else await startLullaby();
});
lullabyAudio.addEventListener("ended",()=>{lullabyPlaying=false;syncLullabyButtons()});
lullabyAudio.addEventListener("error",()=>{lullabyPlaying=false;syncLullabyButtons();$("#lullabyStatus").textContent="Sorry, this audio file couldn't be loaded. Please try again."});