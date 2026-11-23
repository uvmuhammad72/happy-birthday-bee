document.addEventListener('DOMContentLoaded', () => {
  /* =========================================================
     1. ANIMASI MUNCUL SAAT DI-SCROLL
  ========================================================= */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  /* =========================================================
     2. EFEK KONFETI EMAS & PINK PASTEL
  ========================================================= */
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function launchConfetti(count = 90) {
    const colors = ['#EC407A', '#F8BBD0', '#D4AF37', '#F5E6B3', '#CE93D8', '#FFFFFF'];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 2 - 1,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 6 - 3
      });
    }
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, index) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();

      if (p.y > canvas.height + 20) {
        particles.splice(index, 1);
      }
    });
    requestAnimationFrame(animateConfetti);
  }
  animateConfetti();
  setTimeout(() => launchConfetti(60), 600);

  /* =========================================================
     3. PEMUTAR MUSIK DISNEY (MP3 LOKAL + WEB AUDIO MUSIC BOX)
  ========================================================= */
  const musicBtn = document.getElementById('music-toggle-btn');
  const musicLabel = document.getElementById('music-label');
  const customAudio = document.getElementById('custom-disney-audio');

  let isPlaying = false;
  let audioCtx = null;
  let melodyTimer = null;
  let noteIndex = 0;

  // Melodi kotak musik lembut bergaya Disney ("A Whole New World" & "Beauty and the Beast")
  const disneyMelody = [
    // A Whole New World motif
    { freq: 392.00, dur: 0.45 }, // G4
    { freq: 440.00, dur: 0.45 }, // A4
    { freq: 523.25, dur: 0.65 }, // C5
    { freq: 493.88, dur: 0.45 }, // B4
    { freq: 392.00, dur: 0.90 }, // G4
    { freq: 329.63, dur: 0.70 }, // E4
    { freq: 392.00, dur: 0.45 }, // G4
    { freq: 440.00, dur: 0.45 }, // A4
    { freq: 523.25, dur: 0.65 }, // C5
    { freq: 493.88, dur: 0.45 }, // B4
    { freq: 392.00, dur: 0.65 }, // G4
    { freq: 587.33, dur: 0.95 }, // D5
    { freq: 523.25, dur: 1.10 }, // C5
    // Beauty and the Beast motif
    { freq: 329.63, dur: 0.45 }, // E4
    { freq: 392.00, dur: 0.45 }, // G4
    { freq: 493.88, dur: 0.45 }, // B4
    { freq: 523.25, dur: 0.70 }, // C5
    { freq: 440.00, dur: 0.95 }, // A4
    { freq: 349.23, dur: 0.45 }, // F4
    { freq: 440.00, dur: 0.45 }, // A4
    { freq: 523.25, dur: 0.45 }, // C5
    { freq: 587.33, dur: 0.70 }, // D5
    { freq: 493.88, dur: 1.10 }  // B4
  ];

  function playMusicBoxNote() {
    if (!isPlaying) return;
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const note = disneyMelody[noteIndex];
    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note.freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + note.dur * 1.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + note.dur * 1.4);

    noteIndex = (noteIndex + 1) % disneyMelody.length;
    melodyTimer = setTimeout(playMusicBoxNote, note.dur * 1000);
  }

  function startMusic() {
    if (isPlaying) return;
    isPlaying = true;
    musicBtn.classList.add('playing');
    musicLabel.textContent = 'Musik Disney Aktif ✨';

    // Coba putar file MP3 lokal dulu jika ada; jika tidak ada, jalankan melodi kotak musik otomatis
    customAudio.play().catch(() => {
      playMusicBoxNote();
    });
  }

  function stopMusic() {
    isPlaying = false;
    musicBtn.classList.remove('playing');
    musicLabel.textContent = 'Putar Musik Disney ✨';
    customAudio.pause();
    clearTimeout(melodyTimer);
  }

  musicBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });

  /* =========================================================
     4. INTERAKSI TIUP LILIN & LEVEL UP ANGKA (23 -> 24)
  ========================================================= */
  const blowBtn = document.getElementById('blow-candle-btn');
  const relightBtn = document.getElementById('relight-candle-btn');
  const flames = [document.getElementById('flame-1'), document.getElementById('flame-2')];
  const smokes = [document.getElementById('smoke-1'), document.getElementById('smoke-2')];
  const wishInstruction = document.getElementById('wish-instruction');
  const candleDigit2 = document.getElementById('candle-digit-2');
  const cakeRibbonText = document.getElementById('cake-ribbon-text');

  blowBtn.addEventListener('click', () => {
    // 1. Padamkan api & munculkan asap
    flames.forEach(f => f.classList.add('out'));
    smokes.forEach(s => {
      s.classList.remove('puff');
      void s.offsetWidth; // reset animasi asap
      s.classList.add('puff');
    });

    // 2. Transisi simbolis angka 23 berubah menjadi 24 setelah asap tipis muncul
    setTimeout(() => {
      candleDigit2.textContent = '4';
      candleDigit2.classList.add('level-up-pop');
      cakeRibbonText.textContent = 'Happy 24th Bee ✨';

      // Kembalikan ukuran ke proporsi normal dengan warna baru yang tetap bersinar
      setTimeout(() => {
        candleDigit2.style.transform = 'scale(1)';
      }, 450);
    }, 350);

    // 3. Perbarui pesan & luncurkan konfeti perayaan
    wishInstruction.innerHTML = 'Happy Level Up! Babak ke-23 telah tuntas, selamat datang di usia <strong>24</strong>, <strong>Bee</strong>! 🤍✨';
    blowBtn.classList.add('hidden');
    relightBtn.classList.remove('hidden');

    launchConfetti(130);
    startMusic();
  });

  relightBtn.addEventListener('click', () => {
    // Kembalikan lilin menyala & angka kembali ke 23
    flames.forEach(f => f.classList.remove('out'));
    candleDigit2.textContent = '3';
    candleDigit2.classList.remove('level-up-pop');
    candleDigit2.style.transform = '';
    cakeRibbonText.textContent = 'Chapter 23 • Make a Wish';

    wishInstruction.textContent = 'Pejamkan mata sejenak, ucapkan terima kasih untuk usia 23, dan tiup lilin untuk menyambut babak baru di usia 24!';
    relightBtn.classList.add('hidden');
    blowBtn.classList.remove('hidden');
  });
  /* =========================================================
     5. INTERAKSI AMPLOP SURAT DIGITAL
  ========================================================= */
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const envelope = document.getElementById('envelope');
  const letterModal = document.getElementById('letter-modal');
  const closeLetterBtn = document.getElementById('close-letter');

  function openEnvelope() {
    envelope.classList.add('open');
    startMusic();
    setTimeout(() => {
      letterModal.classList.add('active');
      launchConfetti(85);
    }, 450);
  }

  function closeEnvelope() {
    letterModal.classList.remove('active');
    setTimeout(() => {
      envelope.classList.remove('open');
    }, 300);
  }

  envelopeWrapper.addEventListener('click', openEnvelope);
  envelopeWrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });

  closeLetterBtn.addEventListener('click', closeEnvelope);
  letterModal.addEventListener('click', (e) => {
    if (e.target === letterModal) {
      closeEnvelope();
    }
  });
});