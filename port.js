
// ── INTRO ANIMATION ──
(function(){
  const overlay   = document.getElementById('intro-overlay');
  const nameEl    = document.getElementById('intro-name-inner');
  const tagline   = document.getElementById('intro-tagline');
  const bar       = document.getElementById('intro-bar');

  // Step 1: slide name up
  requestAnimationFrame(()=>{
    setTimeout(()=>{ nameEl.classList.add('slide-up'); }, 80);
  });
  // Step 2: show tagline + grow bar
  setTimeout(()=>{
    tagline.classList.add('show');
    bar.classList.add('grow');
  }, 300);
  // Step 3: exit overlay
  setTimeout(()=>{
    overlay.classList.add('exit');
    setTimeout(()=>{ overlay.style.display='none'; }, 750);
  }, 2000);
})();

// ── PAGE TRANSITIONS ──
const transitionOverlay = document.getElementById('page-transition');
function navigateTo(href){
  transitionOverlay.classList.add('fade-out');
  setTimeout(()=>{
    if(href.startsWith('#')){
      transitionOverlay.classList.remove('fade-out');
      const target = document.querySelector(href);
      if(target) target.scrollIntoView({behavior:'smooth'});
    } else {
      window.location.href = href;
    }
  }, 420);
}
document.querySelectorAll('a[href]').forEach(a=>{
  const href = a.getAttribute('href');
  if(!href || href === '#' || a.hasAttribute('target')) return;
  a.addEventListener('click', e=>{
    e.preventDefault();
    navigateTo(href);
  });
});
// Fade in on page load (for non-hash navs)
window.addEventListener('pageshow', ()=>{
  transitionOverlay.classList.remove('fade-out');
});

// ── MARQUEE CONTENT ──
const marqueeItems = ['React','Next.js','Node.js','Firebase','TypeScript','Tailwind CSS','MongoDB','Docker','Claude API','Figma','Vercel','Python'];
const track = document.getElementById('marquee-track');
const full = [...marqueeItems,...marqueeItems].map(t=>`<div class="marquee-item"><span>✦</span>${t}</div>`).join('');
track.innerHTML = full + full;

// ── STARS PARALLAX + MOUSE PARALLAX ──
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');
let stars = [], scrollY = 0;
let mouseX = 0, mouseY = 0;
function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight}
function makeStars(){
  stars=[];
  for(let i=0;i<160;i++) stars.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height*3,
    r:Math.random()*1.6+.3,
    speed:Math.random()*.5+.1,
    mx:Math.random()*.6+.1,   // mouse parallax factor
    opacity:Math.random()*.65+.1
  });
}
function drawStars(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const cx = (mouseX/window.innerWidth - 0.5);
  const cy = (mouseY/window.innerHeight - 0.5);
  stars.forEach(s=>{
    const px = s.x + cx * 28 * s.mx;
    const py = (s.y - scrollY * s.speed + cy * 18 * s.mx) % (canvas.height * 2);
    ctx.beginPath();
    ctx.arc(px, py, s.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(200,245,96,${s.opacity})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}
document.addEventListener('mousemove',e=>{ mouseX=e.clientX; mouseY=e.clientY; });
window.addEventListener('scroll',()=>{ scrollY=window.scrollY; updateBgOnScroll(); });
window.addEventListener('resize',()=>{resize();makeStars()});
resize();makeStars();drawStars();

// ── DYNAMIC BACKGROUND COLOR ON SCROLL ──
const bgGradient = document.getElementById('bg-gradient');
const scrollColors = [
  {stop:0,    r:200, g:245, b:96,  a:.04},  // hero – lime
  {stop:.18,  r:90,  g:240, b:208, a:.05},  // skills – teal
  {stop:.38,  r:120, g:100, b:255, a:.05},  // projects – purple
  {stop:.6,   r:255, g:140, b:80,  a:.04},  // experience – amber
  {stop:.85,  r:80,  g:200, b:255, a:.05},  // contact – sky
  {stop:1,    r:200, g:245, b:96,  a:.04},  // footer – back to lime
];
function lerp(a,b,t){return a+(b-a)*t}
function updateBgOnScroll(){
  const progress = scrollY / (document.body.scrollHeight - window.innerHeight);
  let c1=scrollColors[0], c2=scrollColors[1];
  for(let i=0;i<scrollColors.length-1;i++){
    if(progress>=scrollColors[i].stop && progress<=scrollColors[i+1].stop){
      c1=scrollColors[i]; c2=scrollColors[i+1]; break;
    }
  }
  const t=(progress-c1.stop)/(c2.stop-c1.stop||.01);
  const r=Math.round(lerp(c1.r,c2.r,t));
  const g=Math.round(lerp(c1.g,c2.g,t));
  const b=Math.round(lerp(c1.b,c2.b,t));
  const a=(lerp(c1.a,c2.a,t)).toFixed(3);
  bgGradient.style.background=`radial-gradient(ellipse 120% 80% at 50% 0%, rgba(${r},${g},${b},${a}) 0%, transparent 60%)`;
}

// ── AUTO NIGHT / DAY THEME ──
function applyThemeByTime(){
  const h = new Date().getHours();
  const isDay = h>=6 && h<18;
  document.body.classList.toggle('day-mode', isDay);
}
applyThemeByTime();
setInterval(applyThemeByTime, 60000); // check every minute

// ── CURSOR ──
const cursor=document.getElementById('cursor');
const ring=document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
function animateCursor(){
  cursor.style.left=mx+'px';cursor.style.top=my+'px';
  rx+=(mx-rx)*.12;ry+=(my-ry)*.12;
  ring.style.left=rx+'px';ring.style.top=ry+'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a,button,input,textarea,select,.project-card,.skill-pill').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cursor.style.transform='translate(-50%,-50%) scale(2.5)';ring.style.opacity='.2'});
  el.addEventListener('mouseleave',()=>{cursor.style.transform='translate(-50%,-50%) scale(1)';ring.style.opacity='.5'});
});

// ── 3D TILT CARD ──
const tiltCard=document.getElementById('tilt-card');
if(tiltCard){
  tiltCard.addEventListener('mousemove',e=>{
    const r=tiltCard.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width-.5)*22;
    const y=-((e.clientY-r.top)/r.height-.5)*22;
    tiltCard.style.transform=`rotateY(${x}deg) rotateX(${y}deg) scale(1.03)`;
  });
  tiltCard.addEventListener('mouseleave',()=>{tiltCard.style.transform='rotateY(0deg) rotateX(0deg) scale(1)'});
}

// ── SCRAMBLE TEXT ──
const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
function scramble(el,original,duration=800){
  let frame=0,totalFrames=Math.ceil(duration/16);
  const interval=setInterval(()=>{
    const progress=frame/totalFrames;
    el.textContent=original.split('').map((ch,i)=>{
      if(ch===' ')return ' ';
      if(i/original.length<progress)return ch;
      return chars[Math.floor(Math.random()*chars.length)];
    }).join('');
    frame++;
    if(frame>totalFrames){el.textContent=original;clearInterval(interval)}
  },16);
}
const scrambleObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      scramble(e.target,e.target.dataset.original||e.target.textContent);
      scrambleObs.unobserve(e.target);
    }
  });
},{threshold:.5});
document.querySelectorAll('.scramble-target').forEach(el=>{
  el.dataset.original=el.textContent;
  scrambleObs.observe(el);
});

// ── SKILL PILL PROGRESS ──
const pillObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.skill-pill').forEach((pill,i)=>{
        setTimeout(()=>pill.classList.add('visible'),i*60);
      });
      pillObs.unobserve(e.target);
    }
  });
},{threshold:.2});
document.querySelectorAll('.skills-categories').forEach(el=>pillObs.observe(el));

// ── SCROLL REVEAL ──
const reveals=document.querySelectorAll('.reveal');
const revObs=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),i*60);revObs.unobserve(e.target)}
  });
},{threshold:.1});
reveals.forEach(el=>revObs.observe(el));

// ── COUNT UP ──
function countUp(el){
  const target=parseInt(el.dataset.count);
  const suffix=target===99?'':'+';
  let cur=0;const step=Math.ceil(target/40);
  const t=setInterval(()=>{cur=Math.min(cur+step,target);el.textContent=cur+suffix;if(cur>=target)clearInterval(t)},35);
}
const statsObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('.stat-num').forEach(countUp);statsObs.disconnect()}});
},{threshold:.5});
const st=document.getElementById('stats');
if(st)statsObs.observe(st);

// ── FORM VALIDATION ──
function showError(id,msg){const er=document.getElementById(id+'-err');const fi=document.getElementById(id);if(!er||!fi)return;er.textContent=msg;er.classList.add('show');fi.classList.add('invalid')}
function clearError(id){const er=document.getElementById(id+'-err');const fi=document.getElementById(id);if(!er||!fi)return;er.classList.remove('show');fi.classList.remove('invalid')}
['name','email','subject','message'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('input',()=>clearError(id))});
function validEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}
const btn=document.getElementById('submit-btn');
const btnText=document.getElementById('btn-text');
const btnIcon=document.getElementById('btn-icon');
const toast=document.getElementById('toast');
function showToast(msg){toast.textContent=msg;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3500)}
btn.addEventListener('click',()=>{
  let ok=true;
  const n=document.getElementById('name').value.trim();
  const em=document.getElementById('email').value.trim();
  const ms=document.getElementById('message').value.trim();
  if(!n){showError('name','Please enter your name.');ok=false}else clearError('name');
  if(!validEmail(em)){showError('email','Please enter a valid email.');ok=false}else clearError('email');
  if(ms.length<10){showError('message','Please write at least 10 characters.');ok=false}else clearError('message');
  if(!ok)return;
  btn.classList.add('loading');btnText.textContent='Sending…';btnIcon.textContent='⏳';
  
  fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: n, email: em, subject: 'New Message', message: ms })
  })
  .then(res => {
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  })
  .then(data => {
    btn.classList.remove('loading');btnText.textContent='Send Message';btnIcon.textContent='→';
    ['name','email','message'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=''});
    showToast("✓ Message sent! I'll get back to you soon.");
  })
  .catch(err => {
    btn.classList.remove('loading');btnText.textContent='Send Message';btnIcon.textContent='→';
    showToast("❌ Failed to send message. Please try again.");
    console.error('Contact form error:', err);
  });
});