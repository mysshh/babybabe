import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const mount = document.querySelector('#bubbles-3d-canvas');
const status = document.querySelector('#bubbles-3d-status');
if (mount) {
  try {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#fff4fb');
    scene.fog = new THREE.Fog('#fff4fb', 8, 18);
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.15, 7.4);
    const renderer = new THREE.WebGLRenderer({antialias:true, alpha:false, powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-label','Interactive 3D cloud baby. Drag to rotate, tap to make Bubbles giggle.');
    renderer.domElement.setAttribute('role','img');
    scene.add(new THREE.HemisphereLight(0xffffff, 0xe4b6d7, 2.2));
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-3,5,6); scene.add(key);
    const baby = new THREE.Group(); scene.add(baby);
    const cloudMat = new THREE.MeshStandardMaterial({color:0xffffff, roughness:.52, metalness:0});
    const bodyMat = new THREE.MeshStandardMaterial({color:0xffc6e0, roughness:.65});
    const pinkMat = new THREE.MeshStandardMaterial({color:0xff8ebd, roughness:.8});
    const darkMat = new THREE.MeshStandardMaterial({color:0x48304d, roughness:.5});
    const whiteMat = new THREE.MeshStandardMaterial({color:0xffffff, roughness:.4});
    function ball(parent, material, pos, scale, segments=32) {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(1,segments,Math.max(16,segments/2)), material);
      mesh.position.set(...pos); mesh.scale.set(...scale); parent.add(mesh); return mesh;
    }
    // Soft cloud silhouette built from low-poly-friendly spheres; no large model download.
    ball(baby,cloudMat,[0,0.35,0],[1.28,.9,.68]);
    ball(baby,cloudMat,[-.72,.25,0],[.62,.63,.58]);
    ball(baby,cloudMat,[.72,.25,0],[.62,.63,.58]);
    ball(baby,cloudMat,[-.42,.78,0],[.65,.58,.58]);
    ball(baby,cloudMat,[.38,.78,0],[.65,.58,.58]);
    ball(baby,bodyMat,[0,-.58,0],[.72,.6,.55]);
    // Tiny ears
    ball(baby,pinkMat,[-1.02,-.12,.04],[.18,.25,.15]);
    ball(baby,pinkMat,[1.02,-.12,.04],[.18,.25,.15]);
    // Face is slightly forward so it reads clearly while rotating.
    const eyeLeft=ball(baby,darkMat,[-.36,.22,.79],[.075,.115,.045],24);
    const eyeRight=ball(baby,darkMat,[.36,.22,.79],[.075,.115,.045],24);
    eyeLeft.material=darkMat.clone();eyeRight.material=darkMat.clone();
    const eyeOpenScale={left:eyeLeft.scale.y,right:eyeRight.scale.y};
    const eyeLeftBase=eyeLeft.position.x,eyeRightBase=eyeRight.position.x;
    const eyeShineLeft=ball(baby,whiteMat,[-.38,.26,.83],[.022,.028,.012],16);
    const eyeShineRight=ball(baby,whiteMat,[.34,.26,.83],[.022,.028,.012],16);
    const cheekLeft=ball(baby,pinkMat,[-.58,-.03,.77],[.16,.09,.035],24);
    const cheekRight=ball(baby,pinkMat,[.58,-.03,.77],[.16,.09,.035],24);
    // Curved smile as a TubeGeometry, placed clearly in front of the cloud surface.
    const smilePts = [];
    for(let i=0;i<=20;i++){const x=-.19+i*.019; const y=-.02-.12*(1-Math.pow(x/.19,2)); smilePts.push(new THREE.Vector3(x,.02+y,.82));}
    const smile = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(smilePts),24,.025,8,false),darkMat); baby.add(smile);
    const faceModes={happy:{eye:.115,mouth:1,tilt:0},sleepy:{eye:.035,mouth:.65,tilt:.08},surprised:{eye:.15,mouth:1.8,tilt:-.04},love:{eye:.07,mouth:1.25,tilt:0},shy:{eye:.09,mouth:.8,tilt:.06},silly:{eye:.09,mouth:1.45,tilt:-.1}};
    // Real heart-shaped eye overlays; normal eyes remain underneath for other expressions.
    function makeHeart(){const s=new THREE.Shape();s.moveTo(0,-.07);s.bezierCurveTo(-.02,-.02,-.12,.035,-.105,.09);s.bezierCurveTo(-.09,.15,-.015,.14,0,.09);s.bezierCurveTo(.025,.145,.095,.15,.11,.09);s.bezierCurveTo(.125,.035,.03,-.025,0,-.07);const g=new THREE.ShapeGeometry(s);const m=new THREE.MeshBasicMaterial({color:0xff4b9b,side:THREE.DoubleSide,depthTest:false});const mesh=new THREE.Mesh(g,m);mesh.position.z=.85;mesh.visible=false;baby.add(mesh);return mesh;}
    const heartEyeLeft=makeHeart(),heartEyeRight=makeHeart();heartEyeLeft.position.x=-.36;heartEyeRight.position.x=.36;heartEyeLeft.position.y=.22;heartEyeRight.position.y=.22;
    let faceMode='happy';
    function setFace(mode){faceMode=faceModes[mode]?mode:'happy';const f=faceModes[faceMode];eyeLeft.scale.y=f.eye;eyeRight.scale.y=f.eye;smile.scale.set(1,f.mouth,1);const love=faceMode==='love',shy=faceMode==='shy',surprised=faceMode==='surprised';heartEyeLeft.visible=love;heartEyeRight.visible=love;eyeLeft.visible=!love;eyeRight.visible=!love;eyeShineLeft.visible=!love;eyeShineRight.visible=!love;eyeLeft.material.color.set(0x59425e);eyeRight.material.color.set(0x59425e);cheekLeft.scale.set(shy?2.15:1,shy?2.0:1,1);cheekRight.scale.set(shy?2.15:1,shy?2.0:1,1);cheekLeft.material.color.set(shy?0xff5b9f:0xff8ebd);cheekRight.material.color.set(shy?0xff5b9f:0xff8ebd);if(surprised){smile.scale.set(1,1.8,1);}if(status)status.textContent=({happy:'HAPPY CLOUD BABY!!! 🥰',sleepy:'MMM... JUST A TINY NAP... 😴',surprised:'WOAHHH!!! 😮',love:'I LOVE YOU THIS MUCH!!! 💗',shy:'EEK... YOU’RE MAKING ME BLUSH!! 💗',silly:'BLEHHHHH!!! 😜'})[faceMode];}
    let tapCount=0,tapTimer=null,holdTimer=null,longHeld=false;const faceCycle=['happy','love','surprised','silly'];let faceIndex=0;function cycleFace(){faceIndex=(faceIndex+1)%faceCycle.length;setFace(faceCycle[faceIndex]);}
    const outfit = new THREE.Group(); baby.add(outfit);
    function dress(kind){outfit.clear();const pink=new THREE.MeshStandardMaterial({color:0xff6fae,roughness:.5});const gold=new THREE.MeshStandardMaterial({color:0xffd34f,roughness:.4});const dark=new THREE.MeshStandardMaterial({color:0x59425e,roughness:.4});const b=(mat,pos,scale)=>ball(outfit,mat,pos,scale,20);if(kind==='bow'){b(pink,[-.22,1.12,.12],[.2,.13,.08]);b(pink,[.22,1.12,.12],[.2,.13,.08]);b(gold,[0,1.12,.2],[.09,.09,.07]);}if(kind==='crown'){for(let i=0;i<5;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(.09,.24,5),gold);c.position.set(-.34+i*.17,1.32,.04);outfit.add(c);}b(gold,[0,1.17,.02],[.45,.07,.25]);}if(kind==='glasses'){for(const x of [-.36,.36]){const r=new THREE.Mesh(new THREE.TorusGeometry(.15,.035,8,24),dark);r.position.set(x,.22,.82);outfit.add(r);}const bridge=new THREE.Mesh(new THREE.BoxGeometry(.18,.035,.04),dark);bridge.position.set(0,.22,.82);outfit.add(bridge);}if(kind==='flower'){for(let i=0;i<5;i++){const a=i*Math.PI*2/5;b(pink,[-.72+Math.cos(a)*.13,1.02+Math.sin(a)*.13,.24],[.11,.11,.06]);}b(gold,[-.72,1.02,.3],[.09,.09,.06]);}}
    let currentOutfit='none';
    document.querySelectorAll('[data-bubbles-outfit]').forEach(button=>button.addEventListener('click',()=>{currentOutfit=button.dataset.bubblesOutfit;dress(currentOutfit);try{localStorage.setItem('bwBubblesOutfit',currentOutfit);}catch(_){};if(status)status.textContent=currentOutfit==='none'?'ALL NATURAL CLOUD BABY!!! ☁️':'EEEE!!! I LOOK SO CUTE!!! ♡';}));
    try{currentOutfit=localStorage.getItem('bwBubblesOutfit')||'none';dress(currentOutfit);}catch(_){}
    // Small floating stars around Bubbles.
    const stars = [];
    const starMat = new THREE.MeshStandardMaterial({color:0xffc64a,emissive:0x553000,roughness:.45});
    for(let i=0;i<7;i++){
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(.11+(i%3)*.025),starMat);
      const a=i/7*Math.PI*2; star.position.set(Math.cos(a)*1.65,Math.sin(a)*1.15+.15,-.15);
      scene.add(star); stars.push(star);
    }
    let dragging=false, lastX=0, lastY=0, pointerMoved=false, targetX=0, targetY=0, giggle=0, cursorX=0, cursorY=0, petting=0;let lastInteraction=performance.now(),idleMood='awake',blinkAt=performance.now()+2400,blinkAmount=0;const keepsakeKey='bwBubblesStars';let starsFound=0;try{starsFound=Number(localStorage.getItem(keepsakeKey)||0);}catch(_){};const starHint=document.createElement('span');starHint.className='bubbles-star-count';starHint.textContent='✨ DREAM STARS: '+starsFound;mount.parentElement.appendChild(starHint);window.addEventListener('pointermove',()=>{lastInteraction=performance.now();if(idleMood==='sleeping'){idleMood='awake';setFace('surprised');if(status)status.textContent='YOU’RE BACK!!! I WAS DREAMING OF YOU!! 💗';}});
    window.addEventListener('pointermove',e=>{cursorX=(e.clientX/window.innerWidth-.5)*2;cursorY=(e.clientY/window.innerHeight-.5)*2;});window.addEventListener('pointerleave',()=>{cursorX=0;cursorY=0;});
    renderer.domElement.style.touchAction='pan-y';
    renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;pointerMoved=false;petting=1;lastX=e.clientX;lastY=e.clientY;longHeld=false;clearTimeout(holdTimer);holdTimer=setTimeout(()=>{longHeld=true;setFace('sleepy');if(status)status.textContent='SHHH... TINY NAP TIME... 😴';},650);renderer.domElement.setPointerCapture(e.pointerId);if(status)status.textContent='OOOH, GENTLE PETS!!! MY CLOUD BRAIN IS PURRING!!! ♡';});
    renderer.domElement.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;if(Math.abs(dx)+Math.abs(dy)>2)pointerMoved=true;targetY+=dx*.008;targetX=Math.max(-.45,Math.min(.45,targetX+dy*.006));lastX=e.clientX;lastY=e.clientY;});
    renderer.domElement.addEventListener('pointerup',()=>{clearTimeout(holdTimer);if(dragging&&!pointerMoved&&!longHeld){giggle=1;petting=1;tapCount++;clearTimeout(tapTimer);if(tapCount===1){setFace('love');if(status)status.textContent='TEEHEE!!! YOU TICKLED MY TINY CLOUD TUMMY!!! 💗';}else if(tapCount===2){setFace('surprised');giggle=1.5;if(status)status.textContent='WHEEEE!! PLAYTIME WITH MY BESTIE!!! ✨';}else{setFace('silly');if(status)status.textContent='BLEHHHH!! YOU FOUND MY SILLY FACE!! 😜';}tapTimer=setTimeout(()=>{tapCount=0;},550);const heartMat=new THREE.MeshStandardMaterial({color:0xff75b7,emissive:0x55152f});const heart=new THREE.Mesh(new THREE.SphereGeometry(.09,12,10),heartMat);heart.position.set((Math.random()-.5)*1.1,-.1,.95);scene.add(heart);let life=0;const floatHeart=()=>{if(life++>36){scene.remove(heart);heart.geometry.dispose();heartMat.dispose();return;}heart.position.y+=.018;heart.scale.multiplyScalar(.985);requestAnimationFrame(floatHeart);};floatHeart();}dragging=false;});
    renderer.domElement.addEventListener('pointercancel',()=>{clearTimeout(holdTimer);dragging=false;});
    const starRaycaster=new THREE.Raycaster(),starPointer=new THREE.Vector2();renderer.domElement.addEventListener('click',e=>{const rect=renderer.domElement.getBoundingClientRect();starPointer.x=((e.clientX-rect.left)/rect.width)*2-1;starPointer.y=-((e.clientY-rect.top)/rect.height)*2+1;starRaycaster.setFromCamera(starPointer,camera);const hit=starRaycaster.intersectObjects(stars,false)[0];if(hit){starsFound++;try{localStorage.setItem(keepsakeKey,String(starsFound));}catch(_){}starHint.textContent='✨ DREAM STARS: '+starsFound;giggle=1.5;petting=1;setFace('surprised');if(status)status.textContent='YOU FOUND A DREAM STAR!!! MAKE A WISH, BESTIE!! 🌟';hit.object.material.color.set(0xff75b7);hit.object.material.emissive.set(0x662244);}});
    let width=0,height=0;
    function resize(){const w=Math.max(1,mount.clientWidth),h=Math.max(1,mount.clientHeight);if(w===width&&h===height)return;width=w;height=h;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);}
    const observer = new ResizeObserver(resize); observer.observe(mount);
    const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function animate(t){
      requestAnimationFrame(animate); resize();const time=t*.001;
      if(!dragging){targetY=reduceMotion?0:Math.sin(time*.35)*.12;if(idleMood==='awake'&&Math.sin(time*.43)>.995){targetX=Math.sin(time*1.7)*.07;}}
      baby.rotation.y += (targetY+cursorX*.22-baby.rotation.y)*.08;
      eyeLeft.position.x=eyeLeftBase+Math.max(-.055,Math.min(.055,cursorX*.055));eyeRight.position.x=eyeRightBase+Math.max(-.055,Math.min(.055,cursorX*.055));eyeLeft.position.y=.22+Math.max(-.035,Math.min(.035,-cursorY*.035));eyeRight.position.y=eyeLeft.position.y;
      baby.rotation.x += (targetX-cursorY*.08+(petting>0?.08:0)-baby.rotation.x)*.08;
      baby.position.y=(reduceMotion?0:Math.sin(time*(idleMood==='sleeping'?.45:1.3))*(idleMood==='sleeping'?.025:.09))+(petting>0?.035:0);if(performance.now()>blinkAt){blinkAmount=Math.min(1,blinkAmount+.22);if(blinkAmount>=1){blinkAt=performance.now()+180;}}if(blinkAmount>0){const blinkScale=Math.max(.012,eyeOpenScale.left*(1-blinkAmount));eyeLeft.scale.y=faceMode==='sleepy'?.035:blinkScale;eyeRight.scale.y=eyeLeft.scale.y;blinkAmount=Math.max(0,blinkAmount-.24);if(blinkAmount===0)blinkAt=performance.now()+2200+Math.random()*2600;}if(!dragging&&performance.now()-lastInteraction>18000&&idleMood==='awake'){idleMood='sleeping';setFace('sleepy');if(status)status.textContent='*tiny yawn* zzz... cloud dreams... ☁️💤';}if(idleMood==='sleeping'&&Math.sin(time*1.1)>.94){baby.rotation.z=Math.sin(time*.7)*.025;}else{baby.rotation.z+=(0-baby.rotation.z)*.04;}
      petting=Math.max(0,petting-.012);
      baby.scale.setScalar(1+(giggle>0?Math.sin(time*32)*.035:0));
      giggle=Math.max(0,giggle-.025);
      stars.forEach((s,i)=>{if(!reduceMotion){s.rotation.x+=.008;s.rotation.y+=.012;s.position.y+=Math.sin(time*1.4+i)*.0009;}});
      renderer.render(scene,camera);
    }
    requestAnimationFrame(animate);
    if(status) status.textContent='DRAG ME TO SPIN!!! TAP ME FOR A GIGGLE!!! ☁️';
  } catch(error) {
    if(status) status.textContent='OH NOOO, 3D IS TAKING A NAP. Try a browser with WebGL enabled. ♡';
    console.error('Bubbles 3D could not start',error);
  }
}