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
    ball(baby,darkMat,[-.36,.22,.625],[.075,.115,.045],24);
    ball(baby,darkMat,[.36,.22,.625],[.075,.115,.045],24);
    ball(baby,whiteMat,[-.38,.26,.662],[.022,.028,.012],16);
    ball(baby,whiteMat,[.34,.26,.662],[.022,.028,.012],16);
    ball(baby,pinkMat,[-.58,-.03,.61],[.16,.09,.035],24);
    ball(baby,pinkMat,[.58,-.03,.61],[.16,.09,.035],24);
    // Curved smile as a TubeGeometry.
    const smilePts = [];
    for(let i=0;i<=20;i++){const x=-.19+i*.019; const y=-.02-.12*(1-Math.pow(x/.19,2)); smilePts.push(new THREE.Vector3(x,.02+y,.67));}
    const smile = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(smilePts),24,.025,8,false),darkMat); baby.add(smile);
    const outfit = new THREE.Group(); baby.add(outfit);
    function dress(kind){outfit.clear();const pink=new THREE.MeshStandardMaterial({color:0xff6fae,roughness:.5});const gold=new THREE.MeshStandardMaterial({color:0xffd34f,roughness:.4});const dark=new THREE.MeshStandardMaterial({color:0x59425e,roughness:.4});const b=(mat,pos,scale)=>ball(outfit,mat,pos,scale,20);if(kind==='bow'){b(pink,[-.22,1.12,.12],[.2,.13,.08]);b(pink,[.22,1.12,.12],[.2,.13,.08]);b(gold,[0,1.12,.2],[.09,.09,.07]);}if(kind==='crown'){for(let i=0;i<5;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(.09,.24,5),gold);c.position.set(-.34+i*.17,1.32,.04);outfit.add(c);}b(gold,[0,1.17,.02],[.45,.07,.25]);}if(kind==='glasses'){for(const x of [-.36,.36]){const r=new THREE.Mesh(new THREE.TorusGeometry(.15,.035,8,24),dark);r.position.set(x,.22,.7);outfit.add(r);}const bridge=new THREE.Mesh(new THREE.BoxGeometry(.18,.035,.04),dark);bridge.position.set(0,.22,.7);outfit.add(bridge);}if(kind==='flower'){for(let i=0;i<5;i++){const a=i*Math.PI*2/5;b(pink,[-.72+Math.cos(a)*.13,1.02+Math.sin(a)*.13,.24],[.11,.11,.06]);}b(gold,[-.72,1.02,.3],[.09,.09,.06]);}}
    document.querySelectorAll('[data-bubbles-outfit]').forEach(button=>button.addEventListener('click',()=>{dress(button.dataset.bubblesOutfit);if(status)status.textContent=button.dataset.bubblesOutfit==='none'?'ALL NATURAL CLOUD BABY!!! ☁️':'EEEE!!! I LOOK SO CUTE!!! ♡';}));
    // Small floating stars around Bubbles.
    const stars = [];
    const starMat = new THREE.MeshStandardMaterial({color:0xffc64a,emissive:0x553000,roughness:.45});
    for(let i=0;i<7;i++){
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(.11+(i%3)*.025),starMat);
      const a=i/7*Math.PI*2; star.position.set(Math.cos(a)*1.65,Math.sin(a)*1.15+.15,-.15);
      scene.add(star); stars.push(star);
    }
    let dragging=false, lastX=0, lastY=0, pointerMoved=false, targetX=0, targetY=0, giggle=0, cursorX=0, cursorY=0, petting=0;
    window.addEventListener('pointermove',e=>{cursorX=(e.clientX/window.innerWidth-.5)*2;cursorY=(e.clientY/window.innerHeight-.5)*2;});
    renderer.domElement.style.touchAction='pan-y';
    renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;pointerMoved=false;petting=1;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId);if(status)status.textContent='OOOH, GENTLE PETS!!! MY CLOUD BRAIN IS PURRING!!! ♡';});
    renderer.domElement.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;if(Math.abs(dx)+Math.abs(dy)>2)pointerMoved=true;targetY+=dx*.008;targetX=Math.max(-.45,Math.min(.45,targetX+dy*.006));lastX=e.clientX;lastY=e.clientY;});
    renderer.domElement.addEventListener('pointerup',()=>{if(dragging&&!pointerMoved){giggle=1;if(status)status.textContent='TEEHEE!!! YOU TICKLED MY TINY CLOUD TUMMY!!! ♡';}dragging=false;});
    renderer.domElement.addEventListener('pointercancel',()=>dragging=false);
    let width=0,height=0;
    function resize(){const w=Math.max(1,mount.clientWidth),h=Math.max(1,mount.clientHeight);if(w===width&&h===height)return;width=w;height=h;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);}
    const observer = new ResizeObserver(resize); observer.observe(mount);
    const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function animate(t){
      requestAnimationFrame(animate); resize();
      if(!dragging){targetY += reduceMotion?0:.0018;}
      baby.rotation.y += (targetY+cursorX*.22-baby.rotation.y)*.08;
      baby.rotation.x += (targetX-cursorY*.08+(petting>0?.08:0)-baby.rotation.x)*.08;
      const time=t*.001;
      baby.position.y=(reduceMotion?0:Math.sin(time*1.3)*.09)+(petting>0?.035:0);
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