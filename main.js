document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro');
  const scene1 = document.getElementById('scene-1');
  const scene2 = document.getElementById('scene-2');
  const scene3 = document.getElementById('scene-3');
  const scene4 = document.getElementById('scene-4');
  const scene5 = document.getElementById('scene-5');
  const scene6 = document.getElementById('scene-6');
  const scene7 = document.getElementById('scene-7');
  const scene8 = document.getElementById('scene-8');
  const scene9 = document.getElementById('scene-9');

  const screens = [scene1, scene2, scene3, scene4, scene5, scene6, scene7, scene8, scene9];

  // Mencegah tap berkali-kali (spam)
  let isStoryStarted = false;
  let isSkipped = false;

  const skipBtn = document.getElementById('skip-btn');

  intro.addEventListener('click', startStory);
  intro.addEventListener('touchstart', startStory, { passive: false }); // Trigger extra untuk respon sentuhan HP

  function startStory(e) {
    if (e) e.preventDefault(); // Mencegah double trigger dari touch dan click
    if (isStoryStarted) return;
    isStoryStarted = true;

    // CROSS-BROWSER FULLSCREEN API
    const elem = document.documentElement;
    const requestMethod = elem.requestFullscreen || elem.webkitRequestFullscreen || elem.webkitRequestFullScreen || elem.mozRequestFullScreen || elem.msRequestFullscreen;

    if (requestMethod) {
      try {
        let req = requestMethod.call(elem);
        // Tangkap error misal iOS ngeblokir karena strict mode
        if (req && req.catch) {
          req.catch(err => console.log("Layar penuh ditolak browser: ", err));
        }
      } catch (err) {
        console.log("Ups, Fullscreen gagal: ", err);
      }
    }

    // Putar musik latar saat layar pertama kali di-tap! (Dengan Transisi Halus)
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic) {
      bgMusic.volume = 0; // Mulai dari pelan
      bgMusic.play().then(() => {
        // Fade In volume ke 100% (1.0) selama 4 detik
        gsap.to(bgMusic, { volume: 1, duration: 4, ease: "power2.inOut" });
      }).catch(e => console.log("Gagal memutar musik: ", e));
    }

    gsap.to(intro, {
      opacity: 0, duration: 2.5, ease: "power2.inOut", onComplete: () => {
        intro.classList.remove('active');
        // Jeda gelap total agar rileks sebelum masuk gambar 1
        setTimeout(() => {
          if (!isSkipped) {
            skipBtn.classList.remove('hidden');
            playScene1();
          }
        }, 1500);
      }
    });
  }

  // --- LOGIKA SKIP CERITA ---
  skipBtn.addEventListener('click', () => {
    isSkipped = true;
    skipBtn.classList.add('hidden'); // Hilangkan tombol lewati

    // Bunuh semua animasi GSAP yang lagi jalan biar nggak bocor
    gsap.killTweensOf('*');

    // Sembunyikan paksa seluruh scene yang lagi aktif
    screens.forEach(s => {
      s.classList.remove('active');
      s.classList.add('hidden');
      gsap.set(s, { opacity: 0 }); // reset ke 0
    });

    // Jalankan masuk ke Layar 7
    scene7.classList.remove('hidden');
    scene7.classList.add('active');
    gsap.to(scene7, { opacity: 1, duration: 2.5 });

    // Panggil logika di ujung function playScene7 secara manual (Surat + Matiin lagu)
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic && !bgMusic.paused) {
      gsap.to(bgMusic, {
        volume: 0, duration: 3, ease: "power2.inOut", onComplete: () => {
          bgMusic.pause();
        }
      });
    }

    gsap.fromTo('.royal-parchment',
      { y: 50, scale: 0.8, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 2.5, ease: "back.out(1.4)", delay: 1 }
    );

    setTimeout(() => {
      const btn = document.getElementById('open-letter-btn');
      btn.classList.remove('hidden');
      gsap.fromTo(btn, { opacity: 0 }, { opacity: 1, duration: 1.5 });

      btn.addEventListener('click', () => {
        gsap.to(btn, { opacity: 0, duration: 0.5, onComplete: () => btn.classList.add('hidden') });

        // Animasi Flap Ngebuka Ke Atas (3D Flip)
        gsap.to('.parchment-flap', {
          rotationX: 190,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            document.querySelector('.parchment-flap').style.opacity = 0;
            setTimeout(() => { playScene8(); }, 2500);
          }
        });
      });
    }, 4500);
  });

  function transitionScene(oldS, newS, callback) {
    if (oldS) {
      gsap.to(oldS, {
        opacity: 0, duration: 2.5, ease: "power2.inOut", onComplete: () => {
          oldS.classList.remove('active');
          oldS.classList.add('hidden');

          // Jeda / Fade-to-Black membiarkan layar gelap total sebelum scene baru masuk
          if (newS) {
            setTimeout(() => {
              fadeInNew(newS, callback);
            }, 1000);
          }
        }
      });
    } else {
      if (newS) fadeInNew(newS, callback);
    }
  }

  function fadeInNew(s, callback) {
    s.classList.remove('hidden');
    s.classList.add('active');
    // Gunakan fromTo agar opacity direset ke 0 sebelum fade-in, mencegah gambar langsung muncul
    gsap.fromTo(s, { opacity: 0 }, { opacity: 1, duration: 2.5, ease: "power2.inOut", onComplete: callback });
  }

  // Helper to crossfade layers smoothly
  function fadeLayer(idSelector, delay, duration = 2) {
    gsap.to(idSelector, { opacity: 1, duration: duration, delay: delay, ease: "power2.inOut" });
  }

  // Scene 1: Night Forest & Rider (img-1 to 4)
  function playScene1() {
    if (isSkipped) return;
    transitionScene(null, scene1, () => {

      const tw = new Typewriter('#sub-1', { delay: 40 });
      tw.pauseFor(1000)
        .typeString('Di sebuah malam yang tenang, ')
        .pauseFor(1000)
        .callFunction(() => {
          // TEPAT SAAT penjelasan kedua mau mulai, Gambar 2 muncul & Gambar 1 pudar (fade out to black/crossfade)
          gsap.to('#img-2', { opacity: 1, duration: 2.5, ease: "power2.inOut" });
          gsap.to('#img-1', { opacity: 0, duration: 2.5, ease: "power2.inOut" });
        })
        .typeString('seorang pria berjubah hitam menembus pekatnya malam...')
        .pauseFor(4000)
        .callFunction(() => {
          // EFEK JEDA PANJANG - TEPAT SAAT menunggu tulisan diam, Gambar 3 mulai nengok kanan
          gsap.to('#img-3', { opacity: 1, duration: 3, ease: "power2.inOut" });
          gsap.to('#img-2', { opacity: 0, duration: 3, ease: "power2.inOut" });
        })
        .pauseFor(5000) // nunggu santai sambil liatin gambar 3
        .callFunction(() => {
          // Gambar 3 mundur pelan (Ancang-ancang sebelum kudanya lari)
          gsap.to('#img-3', { scale: 1.05, duration: 1.5, ease: "power2.in" });
        })
        .pauseFor(1500)
        .deleteAll(20)
        .callFunction(() => {
          // CUT KERAS ke img-4 (Sedang lari kencang)
          gsap.to('#img-4', { opacity: 1, duration: 0.1, ease: "power2.out" });

          // Efek guncangan kamera (Camera shake) & Super Zoom mendadak ke kuda
          gsap.to('#img-4', { scale: 1.25, duration: 5, ease: "linear" });
          gsap.to('#img-4', {
            x: () => Math.random() * 8 - 4,
            y: () => Math.random() * 8 - 4,
            duration: 0.1,
            repeat: 30, // Getar selama 3 detik
            yoyo: true
          });
        })
        .typeString('Firasatnya memburu waktu, ')
        .pauseFor(500)
        .typeString('memaksanya memacu langkah lebih kencang tanpa ragu...')
        .callFunction(() => {
          setTimeout(() => { playScene2(); }, 3500);
        })
        .start();
    });
  }

  // Scene 2: The Castle (img-5 to 6)
  function playScene2() {
    if (isSkipped) return;
    transitionScene(scene1, scene2, () => {
      fadeLayer('#img-6', 5, 4); // Sangat perlahan zoom castle
      gsap.to('#img-6', { scale: 1.05, duration: 6, delay: 5, ease: "power1.out" });

      document.getElementById('sub-2').innerHTML = '';
      const tw = new Typewriter('#sub-2', { delay: 45 });
      tw.pauseFor(1000)
        .typeString('Tujuannya jelas. ')
        .pauseFor(1200)
        .typeString('Dari kejauhan, ')
        .pauseFor(800)
        .typeString('kemegahan kerajaan memecah malam, ')
        .pauseFor(1000)
        .typeString('bersinar bagaikan permata di jantung kegelapan. ')
        .pauseFor(1000)
        .typeString('Ia berhenti sejenak, memandangi tujuan akhirnya.')
        .callFunction(() => {
          setTimeout(() => { playScene3(); }, 3000);
        })
        .start();
    });
  }

  // Scene 3: Secret Path (img-7 to 8)
  function playScene3() {
    if (isSkipped) return;
    transitionScene(scene2, scene3, () => {
      fadeLayer('#img-8', 4, 3);

      document.getElementById('sub-3').innerHTML = '';
      const tw = new Typewriter('#sub-3', { delay: 45 });
      tw.pauseFor(1000)
        .typeString('Bukannya masuk lewat gerbang utama, ')
        .pauseFor(1000)
        .typeString('ia mengambil jalur rahasia. ')
        .pauseFor(1000)
        .typeString('Lorong sempit yang hanya diketahui olehnya, ')
        .pauseFor(800)
        .typeString('dipenuhi tanaman merambat bercahaya...')
        .callFunction(() => {
          setTimeout(() => { playScene4(); }, 3000);
        })
        .start();
    });
  }

  // Scene 4: Balcony Knock / Letter (img-9 to 11)
  function playScene4() {
    if (isSkipped) return;
    transitionScene(scene3, scene4, () => {
      fadeLayer('#img-10', 4.5, 3); // seeing queen
      fadeLayer('#img-11', 11, 3);   // placing letter

      document.getElementById('sub-4').innerHTML = '';
      const tw = new Typewriter('#sub-4', { delay: 45 });
      tw.pauseFor(1000)
        .typeString('Tiba di bawah sang Ratu, ')
        .pauseFor(800)
        .typeString('ia berdiri mematung. ')
        .pauseFor(1500)
        .typeString('Hatinya berkata untuk mengetuk, ')
        .pauseFor(800)
        .typeString('tapi malam terlalu larut. ')
        .pauseFor(1500)
        .typeString('Sebagai gantinya, ')
        .pauseFor(500)
        .typeString('ia menitipkan sepucuk surat dengan mawar menyala di celah jendela.')
        .callFunction(() => {
          setTimeout(() => { playScene5(); }, 3500);
        })
        .start();
    });
  }

  // Scene 5: Letter Drops Inside (img-12)
  function playScene5() {
    if (isSkipped) return;
    transitionScene(scene4, scene5, () => {
      gsap.fromTo('#img-12', { scale: 1 }, { scale: 1.05, duration: 8, ease: "power1.inOut" });

      document.getElementById('sub-5').innerHTML = '';
      const tw = new Typewriter('#sub-5', { delay: 45 });
      tw.pauseFor(1000)
        .typeString('Laksana pesan dari takdir, ')
        .pauseFor(1000)
        .typeString('surat dan mawar itu terjatuh dengan gemulai menembus celah tua, ')
        .pauseFor(1200)
        .typeString('hingga beristirahat anggun di atas meja rias sang Ratu yang temaram...')
        .callFunction(() => {
          setTimeout(() => { playScene6(); }, 3500);
        })
        .start();
    });
  }

  // Scene 6: Queen Notices & Picks Up (img-13 to 14)
  function playScene6() {
    if (isSkipped) return;
    transitionScene(scene5, scene6, () => {
      fadeLayer('#img-14', 6, 3);

      document.getElementById('sub-6').innerHTML = '';
      const tw = new Typewriter('#sub-6', { delay: 45 });
      tw.pauseFor(1200)
        .typeString('Sang Ratu, ')
        .pauseFor(800)
        .typeString('yang baru saja membalikkan tubuhnya... ')
        .pauseFor(1500)
        .typeString('mendapati mawar ber-segel merah tersebut. ')
        .pauseFor(1000)
        .typeString('Dengan rasa penasaran, ')
        .pauseFor(500)
        .typeString('jemarinya meraih surat itu perlahan, ')
        .pauseFor(800)
        .typeString('bersiap merengkuh rahasia di baliknya...')
        .callFunction(() => {
          setTimeout(() => { playScene7(); }, 4000);
        })
        .start();
    });
  }

  // Scene 7: Letter Pop-up (Interactive envelope)
  function playScene7() {
    if (isSkipped) return;

    // Hilangkan tombol lewati karena udah sampai di scene surat
    document.getElementById('skip-btn').classList.add('hidden');

    transitionScene(scene6, scene7, () => {
      // Fade Out music perlahan dan matikan ketika surat siap dibuka
      const bgMusic = document.getElementById('bg-music');
      if (bgMusic && !bgMusic.paused) {
        gsap.to(bgMusic, {
          volume: 0, duration: 3, ease: "power2.inOut", onComplete: () => {
            bgMusic.pause();
          }
        });
      }

      gsap.fromTo('.royal-parchment',
        { y: 50, scale: 0.8, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 2.5, ease: "back.out(1.4)" }
      );

      setTimeout(() => {
        const btn = document.getElementById('open-letter-btn');
        btn.classList.remove('hidden');
        gsap.fromTo(btn, { opacity: 0 }, { opacity: 1, duration: 1.5 });

        btn.addEventListener('click', () => {
          gsap.to(btn, { opacity: 0, duration: 0.5, onComplete: () => btn.classList.add('hidden') });

          // Animasi Flap Ngebuka Ke Atas (3D Flip)
          gsap.to('.parchment-flap', {
            rotationX: 190,
            duration: 1.5,
            ease: "power2.inOut",
            onComplete: () => {
              // Sembunyikan segel bunga matahari/flap saat sudah kebuka habis
              document.querySelector('.parchment-flap').style.opacity = 0;
              // Setelah surat kebuka, tunggu 2.5 detik buat dibaca, lalu pindah ke lilin
              setTimeout(() => { playScene8(); }, 2500);
            }
          });
        });
      }, 3500);
    });
  }

  // Scene 8: Candle Interaction
  let isBlownOut = false;
  let isMicListening = false;
  let audioContext, analyser, microphone;

  function playScene8() {
    transitionScene(scene7, scene8, () => {
      initAudio();
      document.getElementById('blow-btn').addEventListener('click', extinguishCandle);
    });
  }

  async function initAudio() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      microphone = audioContext.createMediaStreamSource(stream);

      microphone.connect(analyser);
      analyser.fftSize = 256;
      isMicListening = true;
      listenToMic();
    } catch (e) {
      console.log("Mic access denied");
    }
  }

  function listenToMic() {
    if (!isMicListening || isBlownOut) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function checkAudio() {
      if (isBlownOut) return;
      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) { sum += dataArray[i]; }
      let average = sum / bufferLength;

      if (average > 45) { extinguishCandle(); return; }
      requestAnimationFrame(checkAudio);
    }
    checkAudio();
  }

  function extinguishCandle() {
    if (isBlownOut) return;
    isBlownOut = true;

    // Hilangkan tombol karena sudah ditiup
    gsap.to('#blow-btn', { opacity: 0, duration: 0.5 });

    // Animasi api padam mengecil (transisi css 0.5 detik)
    document.getElementById('flame').classList.add('out');

    // Asap baru muncul setelah apinya beneran mati (delay 0.5 detik)
    setTimeout(() => {
      const container = document.querySelector('.candle-container');
      const smoke = document.createElement('div');
      smoke.className = 'smoke active';
      container.appendChild(smoke);
    }, 500);

    // Tunggu api mengecil & biarkan asap terbang tinggi agar bisa dinikmati (4.5 detik)
    setTimeout(() => {
      // Fade-out manual isi layar menuju gelap secara amat perlahan
      gsap.to('.candle-container', { opacity: 0, duration: 2.5 });
      gsap.to('#scene-8 h2', { opacity: 0, duration: 2.5 });
      gsap.to('#scene-8 p', { opacity: 0, duration: 2.5 });

      // Setelah layar gelap sempurna, baru panggil transisi Scene 9
      setTimeout(() => {
        playScene9();
      }, 3000);

    }, 4500);
  }

  // Scene 9: Final Message
  function playScene9() {
    // Scene 8 secara visual sudah memudar perlahan saat lilin mati, jadi langsung kita sembunyikan kelas aktifnya
    scene8.classList.remove('active');
    scene8.classList.add('hidden');
    gsap.set(scene8, { opacity: 0 }); // Memastikan layer sebelumnya tidak nembus/tumpang tindih

    // Langsung munculkan wadah Scene 9 dari kegelapan
    scene9.classList.remove('hidden');
    scene9.classList.add('active');

    // BARENGAN: Fade-In latar belakang hitam Scene 9 DENGAN animasi naiknya Kartu Ulang Tahun
    gsap.fromTo(scene9, { opacity: 0 }, { opacity: 1, duration: 2.5, ease: "power2.out" });

    gsap.fromTo('.scroll-wrapper',
      { y: 50, scale: 0.95, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 2.5, ease: "power2.out" }
    );
  }

  // --- Scroll Dragging Logic ---
  let isDraggingScroll = false;
  let scrollStartY = 0;
  let initialScrollHeight = 180;
  let maxScrollHeight = 0;

  const scrollDragger = document.getElementById('scroll-dragger');
  const scrollBody = document.getElementById('scroll-body');
  const scrollContent = document.querySelector('.royal-scroll');

  if (scrollDragger && scrollBody && scrollContent) {
    scrollDragger.addEventListener('mousedown', startScrollDrag);
    scrollDragger.addEventListener('touchstart', startScrollDrag, { passive: false });

    window.addEventListener('mousemove', onScrollDrag);
    window.addEventListener('touchmove', onScrollDrag, { passive: false });

    window.addEventListener('mouseup', stopScrollDrag);
    window.addEventListener('touchend', stopScrollDrag);
  }

  function startScrollDrag(e) {
    if (!scene9.classList.contains('active')) return;
    isDraggingScroll = true;
    scrollStartY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    initialScrollHeight = scrollBody.clientHeight;

    // Dynamic calculation berdasarkan tinggi asli kontent teks
    maxScrollHeight = scrollContent.scrollHeight;

    // Matikan hint tulisan
    const hint = document.querySelector('.drag-hint');
    if (hint) hint.style.opacity = '0';
  }

  function onScrollDrag(e) {
    if (!isDraggingScroll) return;

    // Mencegah bounce bawaan HP pas lagi narik gulungan
    if (e.cancelable) e.preventDefault();

    let currentY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    let dy = currentY - scrollStartY;

    let newHeight = initialScrollHeight + dy;

    // Batasan seberapa jauh bisa digulung / ditarik
    if (newHeight < 180) newHeight = 180;
    if (newHeight > maxScrollHeight) newHeight = maxScrollHeight;

    const oldHeight = scrollBody.clientHeight;
    scrollBody.style.height = newHeight + "px";

    // AUTO-SCROLL LAYER SCENE 9
    // Kalau tingginya bertambah (kertas makin buka), kita paksa layarnya ikut turun 
    // biar posisi drag-nya gak keputus dari jari pengguna
    let diff = newHeight - oldHeight;
    if (diff !== 0) {
      scene9.scrollTop += diff;
    }
  }

  function stopScrollDrag(e) {
    if (!isDraggingScroll) return;
    isDraggingScroll = false;
  }
});
