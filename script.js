/* ---------------- Background carousel ----------------
   - Each page has <div class="bg-carousel"><div class="bg-slide"></div><div class="bg-slide"></div></div>
   - This script fills slides with images and crossfades them every 6s.
*/
(function backgroundCarousel(){
  const carousels = document.querySelectorAll('.bg-carousel');
  if(!carousels) return;

  // images to cycle (romantic / cartoon / soft)
  const imgs = [
    "images/pic1.jpeg",
   "images/pic2.jpeg",
   "images/pic3.jpeg",
   "images/pic4.jpeg",

];

  carousels.forEach((carousel) => {
    const slides = carousel.querySelectorAll('.bg-slide');
    // If slide elements missing, create two
    if(slides.length < 2){
      carousel.innerHTML = '<div class="bg-slide"></div><div class="bg-slide"></div>';
    }
    const s = carousel.querySelectorAll('.bg-slide');
    let idx = 0, cur = 0;
    // init
    s[0].style.backgroundImage = `url("${imgs[0]}")`;
    s[0].classList.add('active');
    s[1].style.backgroundImage = `url("${imgs[1]}")`;
    s[1].classList.remove('active');
    idx = 2;
    // rotate
    setInterval(()=>{
      const nextSlide = s[1 - cur]; // toggle between 0 and 1
      nextSlide.style.backgroundImage = `url("${imgs[idx % imgs.length]}")`;
      // show next
      s[cur].classList.remove('active');
      nextSlide.classList.add('active');
      cur = 1 - cur;
      idx++;
    }, 3000);
  });
})();

/* ---------- Floating hearts (login + subtle pages) ---------- */
(function makeHearts(){
  const root=document.querySelector('.hearts');
  if(!root) return;
  for(let i=0;i<24;i++){
    const el=document.createElement('span');
    el.style.left = Math.random()*100 + '%';
    el.style.top = Math.random()*100 + '%';
    el.style.animationDelay = (Math.random()*12) + 's';
    el.style.animationDuration = (9 + Math.random()*12) + 's';
    root.appendChild(el);
  }
})();

/* ---------- Generic DOM ready ---------- */
document.addEventListener('DOMContentLoaded', () => {
  /* Login validation */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = (document.getElementById("username").value || "").trim().toLowerCase();
      const password = (document.getElementById("password").value || "");
      // correct credential as requested
      if (username === "bhagyam" && password === "2000-11-28") {
        window.location.href = "index.html";
      } else {
alert("Tujhe mera birthday yaad ni h! Bevkoof");      }
    });
  }

  /* Setup reveal on scroll */
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); }
    });
  },{threshold:0.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  /* Gallery lightbox setup */
  const grid = document.getElementById('galleryGrid');
  const lb = document.getElementById('lightbox');
  if(grid && lb){
    const img = lb.querySelector('img');
    grid.addEventListener('click', e=>{
      if(e.target.tagName === 'IMG'){ img.src = e.target.src; lb.classList.add('show'); document.body.style.overflow='hidden'; }
    });
    lb.addEventListener('click', ()=>{ lb.classList.remove('show'); document.body.style.overflow=''; });
  }

  /* Days counter */
  const startEl=document.getElementById('startDate');
  const daysEl=document.getElementById('daysTogether');
  if(startEl && daysEl){
    startEl.addEventListener('change', ()=>{
      const v = startEl.value;
      if(!v){ daysEl.textContent = '—'; return; }
      const diff = Math.floor((new Date() - new Date(v)) / (1000*60*60*24));
      daysEl.textContent = diff >= 0 ? diff : '—';
    });
  }

  /* Play / volume controls for playlist */
  const audio = document.getElementById('bgMusic');
  const playBtn = document.getElementById('playNow');
  const vol = document.getElementById('volume');
  if(audio){
    // try autoplay quietly
    audio.volume = vol ? parseFloat(vol.value) : 0.8;
    audio.play().catch(()=>{/* blocked - user must click */});
    if(playBtn){
      playBtn.addEventListener('click', ()=>{
        if(audio.paused) { audio.play(); playBtn.textContent='⏸ Pause'; }
        else { audio.pause(); playBtn.textContent='▶ Play'; }
      });
    }
    if(vol){
      vol.addEventListener('input', ()=> audio.volume = vol.value);
    }
  }

  /* Add song in playlist */
  const addSongBtn = document.getElementById('addSong');
  if(addSongBtn){
    addSongBtn.addEventListener('click', ()=>{
      const url = document.getElementById('songInput').value.trim();
      if(!url) return;
      const li = document.createElement('li');
      li.innerHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
      document.getElementById('songList').appendChild(li);
      document.getElementById('songInput').value='';
    });
  }

  /* Set year in footer */
  const yrs = document.querySelectorAll('#year');
  yrs.forEach(el=> el.textContent = new Date().getFullYear());
});

/* ---------- Confetti hearts (Finale) ---------- */
function confetti(){
  const n = 36;
  for(let i=0;i<n;i++){
    const d = document.createElement('div');
    d.textContent = '❤';
    d.style.position = 'fixed';
    d.style.left = (Math.random()*100) + '%';
    d.style.top = '-10px';
    d.style.fontSize = (16 + Math.random()*26) + 'px';
    d.style.transition = 'transform 1.8s ease, opacity 2s ease';
    d.style.zIndex = 9999;
    document.body.appendChild(d);
    const x = (Math.random()*2-1) * 260;
    const y = 120 + Math.random()*140;
    requestAnimationFrame(()=>{ d.style.transform = `translate(${x}px, ${y}vh)`; d.style.opacity = 0; });
    setTimeout(()=> d.remove(), 2200);
  }
}
window.confetti = confetti;

// Playlist switching
const audioPlayer = document.getElementById("bgMusic");
const playlistItems = document.querySelectorAll("#playlist li");

playlistItems.forEach(item => {
  item.addEventListener("click", () => {
    const songSrc = item.getAttribute("data-src");
    audioPlayer.src = songSrc;  // change song
    audioPlayer.play();         // auto play new song
  });
});

// ----- Playlist: Next & Previous functionality -----
let currentIndex = 0;  // track current playing song
const playlistArray = Array.from(playlistItems);

// Function to play a song by index
function playSong(index){
  if(index < 0) index = playlistArray.length - 1;  // loop to last
  if(index >= playlistArray.length) index = 0;     // loop to first
  currentIndex = index;

  const songSrc = playlistArray[currentIndex].getAttribute("data-src");
  audioPlayer.src = songSrc;
  audioPlayer.play();

  // highlight active song
  playlistArray.forEach(el => el.classList.remove("active-song"));
  playlistArray[currentIndex].classList.add("active-song");
}

// Hook playlist clicks to update currentIndex
playlistArray.forEach((item, i) => {
  item.addEventListener("click", () => playSong(i));
});

// Hook Next / Previous buttons
const nextBtn = document.getElementById("nextSong");
const prevBtn = document.getElementById("prevSong");

if(nextBtn) nextBtn.addEventListener("click", () => playSong(currentIndex + 1));
if(prevBtn) prevBtn.addEventListener("click", () => playSong(currentIndex - 1));

// Optional: auto-advance to next song when current ends
audioPlayer.addEventListener("ended", () => playSong(currentIndex + 1));




