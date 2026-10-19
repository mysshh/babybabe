(()=> {
  const $=s=>document.querySelector(s);
  const snap=$("#babyCameraSnap"),canvas=$("#babyCameraCanvas"),photo=$("#babyCameraPhoto"),download=$("#babyCameraDownload"),gallery=$("#babyCameraGallery"),captionText=$("#babyCaptionText"),captionBtn=$("#babyCaptionBtn"),idBtn=$("#babyIdBtn"),stripBtn=$("#babyStripBtn"),clearBtn=$("#babyGalleryClear"),propsClear=$("#babyPropsClear"),status=$("#babyCameraStatus"),result=$("#babyCameraResult");
  if(!snap||!canvas||!gallery)return;
  const captions=["NO THOUGHTS. ONLY SNACKS. 🍪","MOTHER SAID ACT NORMAL. I CHOSE VIOLENCE. 😈","I PAY ZERO BILLS AND STILL FEEL TIRED.","CERTIFIED LITTLE MENACE. 🍼","ONE BRAIN CELL. SHARED WITH A POTATO. 🥔","I CAME. I SAW. I CRIED. 😭","CURRENTLY ACCEPTING BRIBES IN FRIES. 🍟","THE DRAMA IS FREE. THE TEARS ARE PREMIUM.","SUSPICIOUSLY CUTE. PROBABLY GUILTY.","MY BEDTIME IS A SUGGESTION. 🌙","PLEASE DO NOT FEED AFTER MIDNIGHT.","I HAVE NO IDEA WHAT IS GOING ON. ✨"];
  let caption="",makeId=false,props=[];
  const key="babyWorldCameraHallOfFameV2";
  const names=["MISS CHAOS","LIL POTATO","SIR CRUMBLES","BABY MENACE","DRAMA BEAN","LORD OF NAPS"];
  const skills=["SKILL: NAPS","SKILL: SNACK THEFT","SKILL: DRAMA","SKILL: NO THOUGHTS","SKILL: LOUD SIGHING"];
  function say(t){if(captionText)captionText.textContent=t;if(status)status.textContent=t}
  function getGallery(){try{return JSON.parse(localStorage.getItem(key)||"[]")}catch(e){return []}}
  function renderGallery(){
    const items=getGallery();gallery.replaceChildren();
    if(!items.length){const empty=document.createElement("span");empty.className="baby-camera-gallery-empty";empty.textContent="No legendary baby pics yet. Snap a pic and it will appear here! ✨";gallery.append(empty);return}
    items.forEach((it,i)=>{const card=document.createElement("div");card.className="baby-camera-gallery-item";const img=document.createElement("img");img.src=it.src;img.alt="Baby Hall of Fame photo "+(i+1);const a=document.createElement("a");a.href=it.src;a.download=it.name||"baby-world-photo.png";a.textContent="⬇ SAVE PIC";card.append(img,a);gallery.append(card)});
  }
  function storePhoto(src,name){
    return new Promise(resolve=>{
      const im=new Image();
      im.onload=()=>{
        try{
          const mini=document.createElement("canvas"),ratio=Math.min(1,260/im.width);
          mini.width=Math.max(1,Math.round(im.width*ratio));mini.height=Math.max(1,Math.round(im.height*ratio));
          mini.getContext("2d").drawImage(im,0,0,mini.width,mini.height);
          const item={src:mini.toDataURL("image/jpeg",.55),name};
          let arr=getGallery();arr.unshift(item);arr=arr.slice(0,8);
          try{localStorage.setItem(key,JSON.stringify(arr))}
          catch(err){arr=arr.slice(0,5);try{localStorage.setItem(key,JSON.stringify(arr))}catch(err2){say("Your photo is ready to download, but this browser's storage is full. 💗");resolve(false);return}}
          renderGallery();resolve(true);
        }catch(e){resolve(false)}
      };
      im.onerror=()=>resolve(false);im.src=src;
    });
  }
  function drawText(ctx,text,x,y,max,font){ctx.font=font;ctx.textAlign="center";ctx.textBaseline="middle";ctx.lineWidth=Math.max(3,canvas.width*.003);ctx.strokeStyle="#704b75";ctx.strokeText(text,x,y,max);ctx.fillStyle="#fff";ctx.fillText(text,x,y,max)}
  captionBtn?.addEventListener("click",()=>{caption=captions[Math.floor(Math.random()*captions.length)];say("📣 CAPTION READY! “"+caption+"” It will be printed on your next photo. Snap when ready!");captionBtn.textContent="😂 NEW CAPTION"});
  idBtn?.addEventListener("click",()=>{makeId=!makeId;idBtn.setAttribute("aria-pressed",String(makeId));idBtn.textContent=makeId?"🪪 BABY ID: ON ✓":"🪪 MAKE BABY ID";say(makeId?"🪪 BABY ID MODE ON! Your next snapped photo will get a random name, biscuit age and ridiculous skill.":"Baby ID mode off. Make another ID any time!")});
  document.querySelectorAll("[data-prop]").forEach(b=>b.addEventListener("click",()=>{
    const p=b.dataset.prop;
    if(props.includes(p)){props=props.filter(x=>x!==p);b.setAttribute("aria-pressed","false")}else{props.push(p);b.setAttribute("aria-pressed","true")}
    say(props.length?"✨ ACCESSORIES READY: "+props.join(" ")+" — snap a pic and they'll be stamped onto it!":"Accessory drawer cleared. Fresh little face!");
  }));
  propsClear?.addEventListener("click",()=>{props=[];document.querySelectorAll("[data-prop]").forEach(b=>b.setAttribute("aria-pressed","false"));say("🧹 All accessories cleared!")});
  snap.addEventListener("click",()=>{
    window.setTimeout(async()=>{
      try{
        const ctx=canvas.getContext("2d"),w=canvas.width,h=canvas.height,scale=Math.min(w,h);
        if(!w||!h)return;
        const selected=props.slice();
        if(selected.length){
          ctx.save();ctx.textAlign="center";ctx.textBaseline="middle";
          const spots={"😈":[.5,.09],"🤓":[.5,.29],"🥸":[.5,.52],"👑":[.5,.10],"😭":[.22,.47],"🐰":[.5,.08],"💋":[.78,.55]};
          selected.forEach(p=>{const q=spots[p]||[.5,.5];ctx.font=Math.round(scale*(p==="🤓"?.18:.14))+"px sans-serif";ctx.shadowColor="#fff";ctx.shadowBlur=10;ctx.fillText(p,w*q[0],h*q[1])});
          ctx.restore();
        }
        if(caption){ctx.save();ctx.fillStyle="rgba(65,35,78,.9)";ctx.fillRect(w*.035,h*.72,w*.93,h*.18);drawText(ctx,caption,w/2,h*.81,w*.88,"800 "+Math.max(15,Math.round(scale*.036))+"px sans-serif");ctx.restore()}
        if(makeId){
          ctx.save();ctx.fillStyle="rgba(255,245,252,.97)";ctx.fillRect(w*.045,h*.045,w*.91,h*.22);ctx.strokeStyle="#ed9bc9";ctx.lineWidth=Math.max(3,scale*.008);ctx.strokeRect(w*.045,h*.045,w*.91,h*.22);
          ctx.fillStyle="#8b477d";ctx.textAlign="center";ctx.textBaseline="middle";ctx.font="900 "+Math.max(17,Math.round(scale*.05))+"px sans-serif";ctx.fillText("BABY WORLD ID",w/2,h*.095);
          ctx.font="800 "+Math.max(14,Math.round(scale*.035))+"px sans-serif";ctx.fillText(names[Math.floor(Math.random()*names.length)],w/2,h*.155);
          ctx.font="700 "+Math.max(11,Math.round(scale*.026))+"px sans-serif";ctx.fillText("AGE: 3 BISCUITS • "+skills[Math.floor(Math.random()*skills.length)],w/2,h*.215);ctx.restore();
        }
        const url=canvas.toDataURL("image/png"),name="baby-world-chaos-"+new Date().toISOString().slice(0,10)+".png";
        if(photo)photo.src=url;if(download){download.href=url;download.download=name}if(result)result.hidden=false;
        const saved=await storePhoto(url,name);
        caption="";makeId=false;if(idBtn){idBtn.setAttribute("aria-pressed","false");idBtn.textContent="🪪 MAKE BABY ID"}
        say(saved?"📸 PHOTO READY + ADDED TO THE HALL OF FAME! Tap SAVE MY PIC for the full-size original. 💗":"Photo ready! Tap SAVE MY PIC to download the full-size original.");
      }catch(e){say("Your photo is ready! Tap SAVE MY PIC to download it. If the extras are missing, take one more snap and try again.")}
    },350);
  });
  stripBtn?.addEventListener("click",()=>{
    const items=getGallery().slice(0,4);
    if(items.length<2){say("🎞️ TAKE TWO OR MORE PICS FIRST! Every successful snap is added to the Hall of Fame. Then tap PHOTO STRIP again.");gallery.scrollIntoView({behavior:"smooth",block:"center"});return}
    const out=document.createElement("canvas"),W=720,H=items.length*440+110;out.width=W;out.height=H;const c=out.getContext("2d");
    c.fillStyle="#fff0f8";c.fillRect(0,0,W,H);c.fillStyle="#815278";c.textAlign="center";c.font="900 32px sans-serif";c.fillText("BABY WORLD • CHAOS STRIP",W/2,46);c.font="700 17px sans-serif";c.fillText("certified silly • extremely important",W/2,76);
    let loaded=0,failed=false;
    items.forEach((it,i)=>{const im=new Image();im.onload=()=>{const y=95+i*440;c.fillStyle="#fff";c.fillRect(20,y-5,680,420);c.drawImage(im,30,y,660,410);loaded++;if(loaded===items.length&&!failed){const a=document.createElement("a");a.href=out.toDataURL("image/png");a.download="baby-world-photo-strip.png";document.body.append(a);a.click();a.remove();say("🎞️ PHOTO STRIP DOWNLOADED! "+items.length+" legendary moments in one file. 💗")}};im.onerror=()=>{failed=true;say("One saved photo couldn't load. Take two fresh pics and try again.")};im.src=it.src});
  });
  clearBtn?.addEventListener("click",()=>{if(confirm("Clear the Baby Hall of Fame from this browser? Downloaded photos will not be deleted.")){localStorage.removeItem(key);renderGallery();say("Hall of Fame cleared. Downloaded photos are still safe.")}});
  renderGallery();
})();