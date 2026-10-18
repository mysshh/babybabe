import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const mount=document.querySelector('#bubbles-3d-canvas');
const status=document.querySelector('#bubbles-3d-status');
if(!mount){}else try{
 const scene=new THREE.Scene();scene.background=new THREE.Color('#fff4fb');
 const camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(0,.1,7.4);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;mount.appendChild(renderer.domElement);
 scene.add(new THREE.HemisphereLight(0xffffff,0xe4b6d7,2.2));const light=new THREE.DirectionalLight(0xffffff,2);light.position.set(-3,5,6);scene.add(light);
 const baby=new THREE.Group();scene.add(baby);
 const mat=(color,roughness=.65)=>new THREE.MeshStandardMaterial({color,roughness});
 const cloud=mat('#fffdfd',.5),body=mat('#ffc6e0'),pink=mat('#ff8ebd'),dark=mat('#48304d'),white=mat('#ffffff'),gold=mat('#ffd34f');
 function sphere(parent,m,x,y,z,sx,sy,sz){const o=new THREE.Mesh(new THREE.SphereGeometry(1,32,24),m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);parent.add(o);return o;}
 // Rebuilt from scratch: one clean cloud head and three small top puffs.
 sphere(baby,cloud,0,.28,0,1.18,.88,.55);
 sphere(baby,cloud,-.48,.82,0,.43,.43,.48);
 sphere(baby,cloud,0,.94,0,.45,.46,.48);
 sphere(baby,cloud,.48,.82,0,.43,.43,.48);
 sphere(baby,body,0,-.62,-.02,.68,.57,.48);
 // Face sits on a single forward-facing plane, well in front of the head.
 const face=new THREE.Group();face.position.set(0,.08,.565);baby.add(face);
 function flatCircle(m,x,y,z,sx,sy){return sphere(face,m,x,y,z,sx,sy,.025);}
 const eyeL=flatCircle(dark,-.34,.18,.03,.075,.105),eyeR=flatCircle(dark,.34,.18,.03,.075,.105);
 flatCircle(white,-.36,.22,.06,.022,.026);flatCircle(white,.32,.22,.06,.022,.026);
 const cheekL=flatCircle(pink,-.57,-.08,.025,.13,.065),cheekR=flatCircle(pink,.57,-.08,.025,.13,.065);
 const smilePts=[];for(let i=0;i<=24;i++){const x=-.18+i*.015;const y=-.12+.085*(x/.18)**2;smilePts.push(new THREE.Vector3(x,y,.07));}
 const smile=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(smilePts),24,.018,8,false),dark);face.add(smile);
 function heartShape(){const s=new THREE.Shape();s.moveTo(0,-.08);s.bezierCurveTo(-.04,-.02,-.13,.04,-.11,.1);s.bezierCurveTo(-.09,.16,-.02,.14,0,.09);s.bezierCurveTo(.03,.15,.1,.15,.12,.09);s.bezierCurveTo(.14,.04,.04,-.02,0,-.08);const o=new THREE.Mesh(new THREE.ShapeGeometry(s),new THREE.MeshBasicMaterial({color:0xff4b9b,side:THREE.DoubleSide,depthTest:false}));o.position.z=.09;o.visible=false;face.add(o);return o;}
 const heartL=heartShape(),heartR=heartShape();heartL.position.x=-.34;heartR.position.x=.34;heartL.position.y=.18;heartR.position.y=.18;
 let faceMode='happy';function setFace(mode){faceMode=mode;const love=mode==='love',sleep=mode==='sleepy',surprise=mode==='surprised',shy=mode==='shy';heartL.visible=heartR.visible=love;eyeL.visible=eyeR.visible=!love;face.children[2].visible=face.children[3].visible=!love;eyeL.scale.y=eyeR.scale.y=sleep?.025:surprise?.14:.105;cheekL.scale.set(shy?.17:.13,shy?.09:.065,.025);cheekR.scale.copy(cheekL.scale);smile.scale.y=surprise?1.8:mode==='silly'?1.5:1;if(status)status.textContent=({happy:'HAPPY CLOUD BABY!!! 🥰',sleepy:'MMM... JUST A TINY NAP... 😴',surprised:'WOAHHH!!! 😮',love:'I LOVE YOU THIS MUCH!!! 💗',shy:'EEK... YOU’RE MAKING ME BLUSH!! 💗',silly:'BLEHHHHH!!! 😜'})[mode]||'HAPPY CLOUD BABY!!! 🥰';}
 const outfit=new THREE.Group();baby.add(outfit);
 function dress(kind){outfit.clear();if(kind==='bow'){sphere(outfit,mat('#ff6fae'),-.22,1.12,.5,.2,.13,.08);sphere(outfit,mat('#ff6fae'),.22,1.12,.5,.2,.13,.08);sphere(outfit,gold,0,1.12,.57,.08,.08,.06);}if(kind==='crown'){for(let i=0;i<5;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(.09,.22,5),gold);c.position.set(-.32+i*.16,1.3,.2);outfit.add(c);}}if(kind==='glasses'){const frame=mat('#59425e');for(const x of [-.34,.34]){const r=new THREE.Mesh(new THREE.TorusGeometry(.14,.025,8,24),frame);r.position.set(x,.18,.66);outfit.add(r);}const b=new THREE.Mesh(new THREE.BoxGeometry(.18,.025,.025),frame);b.position.set(0,.18,.66);outfit.add(b);}if(kind==='flower'){for(let i=0;i<5;i++){const a=i*Math.PI*2/5;sphere(outfit,mat('#ff6fae'),-.72+Math.cos(a)*.1,1.02+Math.sin(a)*.1,.3,.08,.08,.05);}sphere(outfit,gold,-.72,1.02,.36,.06,.06,.04);}}
 let currentOutfit='none';document.querySelectorAll('[data-bubbles-outfit]').forEach(b=>b.addEventListener('click',()=>{currentOutfit=b.dataset.bubblesOutfit;dress(currentOutfit);try{localStorage.setItem('bwBubblesOutfit',currentOutfit)}catch(_){};if(status)status.textContent='EEEE!!! I LOOK SO CUTE!!! ♡';}));try{currentOutfit=localStorage.getItem('bwBubblesOutfit')||'none';dress(currentOutfit)}catch(_){}
 const stars=[];const starMat=mat('#ffc64a');for(let i=0;i<7;i++){const s=new THREE.Mesh(new THREE.OctahedronGeometry(.11+(i%3)*.025),starMat);const a=i/7*Math.PI*2;s.position.set(Math.cos(a)*1.55,Math.sin(a)*1.12+.15,-.15);scene.add(s);stars.push(s);}
 const starHint=document.createElement('span');starHint.className='bubbles-star-count';let starsFound=0;try{starsFound=Number(localStorage.getItem('bwBubblesStars')||0)}catch(_){}starHint.textContent='✨ DREAM STARS: '+starsFound;mount.parentElement.appendChild(starHint);
 let dragging=false,lastX=0,lastY=0,targetX=0,targetY=0,giggle=0,petting=0,tapCount=0,tapTimer=null,holdTimer=null,longHeld=false,lastInteraction=performance.now(),sleeping=false;
 renderer.domElement.style.touchAction='pan-y';renderer.domElement.setAttribute('aria-label','Interactive 3D cloud baby. Drag to rotate, tap to make Bubbles giggle.');renderer.domElement.setAttribute('role','img');
 renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;petting=1;longHeld=false;clearTimeout(holdTimer);holdTimer=setTimeout(()=>{longHeld=true;setFace('sleepy')},650);renderer.domElement.setPointerCapture(e.pointerId);});
 renderer.domElement.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;targetY=Math.max(-.35,Math.min(.35,targetY+dx*.004));targetX=Math.max(-.25,Math.min(.25,targetX+dy*.003));lastX=e.clientX;lastY=e.clientY;});
 renderer.domElement.addEventListener('pointerup',()=>{clearTimeout(holdTimer);if(dragging&&!longHeld){giggle=1;tapCount++;clearTimeout(tapTimer);setFace(tapCount===1?'love':tapCount===2?'surprised':'silly');tapTimer=setTimeout(()=>tapCount=0,550);const h=new THREE.Mesh(new THREE.SphereGeometry(.09,12,10),mat('#ff75b7'));h.position.set((Math.random()-.5)*1.1,-.1,.95);scene.add(h);let life=0;const float=()=>{if(life++>36){scene.remove(h);h.geometry.dispose();h.material.dispose();return;}h.position.y+=.018;requestAnimationFrame(float)};float();}dragging=false;targetX=0;targetY=0;});
 renderer.domElement.addEventListener('pointercancel',()=>{clearTimeout(holdTimer);dragging=false;});
 renderer.domElement.addEventListener('click',e=>{const r=renderer.domElement.getBoundingClientRect(),p=new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);const ray=new THREE.Raycaster();ray.setFromCamera(p,camera);const hit=ray.intersectObjects(stars,false)[0];if(hit){starsFound++;try{localStorage.setItem('bwBubblesStars',String(starsFound))}catch(_){}starHint.textContent='✨ DREAM STARS: '+starsFound;setFace('surprised');giggle=1.5;}});
 let w=0,h=0;function resize(){const nw=Math.max(1,mount.clientWidth),nh=Math.max(1,mount.clientHeight);if(nw===w&&nh===h)return;w=nw;h=nh;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)}const observer=new ResizeObserver(resize);observer.observe(mount);
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function animate(t){requestAnimationFrame(animate);resize();const time=t*.001;if(!dragging){targetY=reduce?0:Math.sin(time*.35)*.07;}baby.rotation.y+=(targetY-baby.rotation.y)*.06;baby.rotation.x+=(targetX-baby.rotation.x)*.06+baby.rotation.x*-.0;baby.position.y=(reduce?0:Math.sin(time*1.3)*.06)+(petting>0?.025:0);baby.scale.setScalar(1+(giggle>0?Math.sin(time*32)*.035:0));giggle=Math.max(0,giggle-.025);petting=Math.max(0,petting-.012);stars.forEach((s,i)=>{if(!reduce){s.rotation.x+=.008;s.rotation.y+=.012;s.position.y+=Math.sin(time*1.4+i)*.0009}});if(performance.now()-lastInteraction>18000&&!sleeping){sleeping=true;setFace('sleepy')}renderer.render(scene,camera)}requestAnimationFrame(animate);if(status)status.textContent='DRAG ME TO SPIN!!! TAP ME FOR A GIGGLE!!! ☁️';
}catch(error){if(status)status.textContent='OH NOOO, 3D IS TAKING A NAP. Try a browser with WebGL enabled. ♡';console.error('Bubbles 3D could not start',error);}