/**
 * ============================================================================
 * LUXURY WEDDING INVITATION — CHI. SUMANTH & CHI. LA. SOU. KEERTHI
 * Interactive Logic: 3D Envelope Reveal, Live Countdown, RSVP & Audio System
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Configuration & Wedding Constants
  // --------------------------------------------------------------------------
  const WEDDING_CONFIG = {
    // 29 October 2026 at 7:31 PM Indian Standard Time (+05:30)
    targetDate: new Date('2026-10-29T19:31:00+05:30').getTime(),
    coupleNames: 'Chi. Sumanth & Chi. La. Sou. Keerthi',
    venue: 'At Our Residence, Burugugudem (V), Reddygudem (M), N.T.R. District',
    venueMapsUrl: 'https://maps.app.goo.gl/rPqwCiCKpotjdGxg8?g_st=ac',
    dateFormatted: 'Thursday, 29 October 2026',
    timeFormatted: '7:31 PM IST',
    dinnerTime: '7:00 PM Onwards'
  };

  // State Management
  let isEnvelopeOpened = false;
  let isEnvelopeOpening = false;
  let hasSwansGlided = false;
  let isAudioPlaying = false;
  let webAudioSynth = null;
  let flowerDisintegrationEngine = null;

  // DOM Elements
  const envelopeStage = document.getElementById('envelope-stage');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const invitationContent = document.getElementById('invitation-content');
  const toastMsg = document.getElementById('toast-msg');

  // Countdown Elements
  const timerDays = document.getElementById('timer-days');
  const timerHours = document.getElementById('timer-hours');
  const timerMins = document.getElementById('timer-mins');
  const timerSecs = document.getElementById('timer-secs');

  // Audio Elements
  const musicController = document.getElementById('music-controller');
  const musicToggleBtn = document.getElementById('btn-music-toggle');
  const iconPause = document.getElementById('icon-pause');
  const iconPlay = document.getElementById('icon-play');
  const audioElement = document.getElementById('wedding-audio');

  // First Screen Elements
  const firstScreenHero = document.getElementById('first-screen-hero');
  const petalsCanvas = document.getElementById('petals-canvas');
  const firstScreenScroll = document.getElementById('first-screen-scroll');
  const swansStage = document.getElementById('swans-stage');
  let petalsEngine = null;

  // RSVP Elements
  const openRsvpBtn = document.getElementById('open-rsvp-modal-btn');
  const rsvpModalOverlay = document.getElementById('rsvp-modal-overlay');
  const closeRsvpBtn = document.getElementById('close-rsvp-modal-btn');
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpSuccessView = document.getElementById('rsvp-success-view');
  const btnCloseSuccess = document.getElementById('btn-close-success');
  const successSummary = document.getElementById('success-summary');
  const whatsappRsvpLink = document.getElementById('whatsapp-rsvp-link');

  // Action Elements
  const btnAddCalendar = document.getElementById('btn-add-calendar');

  // --------------------------------------------------------------------------
  // 1. Toast Notification Helper
  // --------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(message, duration = 3000) {
    if (!toastMsg) return;
    toastMsg.textContent = message;
    toastMsg.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMsg.classList.remove('show');
    }, duration);
  }

  // --------------------------------------------------------------------------
  // 2. The Signature Envelope Reveal Interaction
  // --------------------------------------------------------------------------
  function openEnvelope() {
    if (isEnvelopeOpened || isEnvelopeOpening) return;
    isEnvelopeOpening = true;

    // Realistic seal press effect before unfolding
    if (waxSealBtn) {
      waxSealBtn.classList.add('pressed');
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setTimeout(() => {
      if (waxSealBtn) waxSealBtn.classList.remove('pressed');
      
      // Trigger Flap & Seal Unfolding Animation with golden glow
      envelopeWrapper.classList.add('unfolding');

      // Attempt to start ambient audio on this authentic user gesture
      startMusic();

      if (prefersReducedMotion) {
        completeEnvelopeOpening();
      } else {
        // Step 1: Smoothly reveal first screen hero and content behind envelope
        setTimeout(() => {
          if (firstScreenHero) {
            firstScreenHero.style.display = 'flex';
            void firstScreenHero.offsetWidth;
            firstScreenHero.style.opacity = '1';
            firstScreenHero.classList.add('hero-revealed');
          }
          if (invitationContent) {
            invitationContent.style.display = 'block';
            void invitationContent.offsetWidth;
            invitationContent.style.opacity = '1';
          }
          document.body.classList.remove('locked-scroll');

          // Start the delicate falling rose petals animation
          if (!petalsEngine && petalsCanvas) {
            petalsEngine = new FallingPetalsEngine(petalsCanvas);
          }
          if (petalsEngine) {
            petalsEngine.start();
          }

          // Lake is revealed first with calm water & moving ripples
          // Swans then smoothly glide in from outside the visible lake
          setTimeout(() => {
            triggerSwansEntrance();
          }, 650);
        }, 600);

        // Step 2: Fade out envelope stage seamlessly without flash
        setTimeout(() => {
          completeEnvelopeOpening();
        }, 1150);
      }
    }, 140);
  }

  function triggerSwansEntrance() {
    if (!swansStage || hasSwansGlided) return;
    hasSwansGlided = true;
    swansStage.classList.add('swans-glide-active');
  }

  function completeEnvelopeOpening() {
    isEnvelopeOpened = true;
    isEnvelopeOpening = false;
    document.body.classList.remove('locked-scroll');
    if (firstScreenHero) {
      firstScreenHero.style.display = 'flex';
      firstScreenHero.style.opacity = '1';
      firstScreenHero.classList.add('hero-revealed');
    }
    if (invitationContent) {
      invitationContent.style.display = 'block';
      invitationContent.style.opacity = '1';
    }
    envelopeStage.classList.add('stage-hidden');

    // If swans haven't started yet (e.g. reduced motion or fast bypass), start them now
    if (!hasSwansGlided) {
      triggerSwansEntrance();
    }

    // Initialize Scroll Reveal Observers
    initScrollObservers();

    // Initialize Hero Intersect Observer to pause petals when out of view
    initHeroObserver();

    // Initialize timeline flower disintegration engine
    if (!flowerDisintegrationEngine) {
      flowerDisintegrationEngine = new ScrollFlowerDisintegrationEngine();
    }
  }

  // Bind Envelope Click & Keyboard Events
  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', openEnvelope);
    waxSealBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  // Bind Scroll Down click on First Screen with polished smooth scrolling
  if (firstScreenScroll) {
    const handleScrollDown = () => {
      const target = document.getElementById('invitation-content');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    firstScreenScroll.addEventListener('click', handleScrollDown);
    firstScreenScroll.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleScrollDown();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2B. Falling Rose Petal Physics Engine (Canvas 2D)
  // --------------------------------------------------------------------------
  class FallingPetalsEngine {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas ? canvas.getContext('2d') : null;
      this.petals = [];
      this.isRunning = false;
      this.animFrameId = null;
      this.numPetals = window.innerWidth < 480 ? 28 : 38;

      // Romantic rose petal palette in soft blush pink, ivory, and muted rose
      this.colors = [
        { r: 248, g: 206, b: 211, alpha: 0.85 }, // soft blush pink
        { r: 255, g: 240, b: 234, alpha: 0.78 }, // warm ivory peach
        { r: 236, g: 182, b: 188, alpha: 0.82 }, // dusty rose
        { r: 244, g: 198, b: 202, alpha: 0.8 },  // delicate rose
        { r: 224, g: 165, b: 172, alpha: 0.72 }  // muted antique rose
      ];

      if (this.ctx) {
        this.resize();
        window.addEventListener('resize', () => this.resize(), { passive: true });
        this.initPetals();
      }
    }

    resize() {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      this.width = rect.width || window.innerWidth;
      this.height = rect.height || window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    initPetals() {
      this.petals = [];
      for (let i = 0; i < this.numPetals; i++) {
        this.petals.push(this.createPetal(true));
      }
    }

    createPetal(randomY = false) {
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      const size = 9 + Math.random() * 14;
      return {
        x: Math.random() * (this.width || 400),
        y: randomY ? Math.random() * (this.height || 700) : -30 - Math.random() * 40,
        size: size,
        color: color,
        speedY: 1.1 + Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.7,
        swayAngle: Math.random() * Math.PI * 2,
        swaySpeed: 0.016 + Math.random() * 0.02,
        swayRadius: 0.8 + Math.random() * 1.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.028,
        flipAngle: Math.random() * Math.PI * 2,
        flipSpeed: 0.02 + Math.random() * 0.032
      };
    }

    start() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (this.isRunning || !this.ctx) return;
      this.isRunning = true;
      this.loop();
    }

    stop() {
      this.isRunning = false;
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
    }

    loop() {
      if (!this.isRunning) return;
      this.update();
      this.draw();
      this.animFrameId = requestAnimationFrame(() => this.loop());
    }

    update() {
      // Natural gentle breeze oscillation that ebbs and flows
      const breeze = Math.sin(Date.now() * 0.0007) * 0.32 + Math.cos(Date.now() * 0.0015) * 0.12;

      for (let i = 0; i < this.petals.length; i++) {
        const p = this.petals[i];
        p.y += p.speedY;
        p.swayAngle += p.swaySpeed;
        p.x += Math.sin(p.swayAngle) * p.swayRadius + p.speedX + breeze;
        p.rotation += p.rotationSpeed;
        p.flipAngle += p.flipSpeed;

        // Reset to top once off screen
        if (p.y > this.height + 30) {
          this.petals[i] = this.createPetal(false);
        }
        if (p.x < -30) p.x = this.width + 20;
        if (p.x > this.width + 30) p.x = -20;
      }
    }

    draw() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.petals.length; i++) {
        const p = this.petals[i];
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        
        // 3D tumbling perspective
        const flipScale = Math.cos(p.flipAngle);
        this.ctx.scale(1, flipScale);

        // Draw organic curved rose petal path
        const s = p.size;
        const c = p.color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -s);
        this.ctx.bezierCurveTo(s * 0.85, -s * 0.6, s * 0.9, s * 0.45, 0, s);
        this.ctx.bezierCurveTo(-s * 0.9, s * 0.45, -s * 0.85, -s * 0.6, 0, -s);
        this.ctx.closePath();

        // Soft radial watercolor petal gradient
        const grad = this.ctx.createRadialGradient(0, -s * 0.2, 0, 0, 0, s);
        grad.addColorStop(0, `rgba(${c.r + 8}, ${c.g + 14}, ${c.b + 8}, ${c.alpha})`);
        grad.addColorStop(0.7, `rgba(${c.r}, ${c.g}, ${c.b}, ${c.alpha * 0.9})`);
        grad.addColorStop(1, `rgba(${c.r - 22}, ${c.g - 22}, ${c.b - 22}, ${c.alpha * 0.75})`);
        this.ctx.fillStyle = grad;
        this.ctx.fill();

        this.ctx.restore();
      }
    }
  }

  function initHeroObserver() {
    if (!('IntersectionObserver' in window) || !firstScreenHero) return;
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!petalsEngine) return;
        if (entry.isIntersecting) {
          petalsEngine.start();
        } else {
          petalsEngine.stop();
        }
      });
    }, { threshold: 0.05 });
    heroObserver.observe(firstScreenHero);

    // Pause canvas physics loop when page or tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (!petalsEngine) return;
      if (document.hidden) {
        petalsEngine.stop();
      } else {
        const rect = firstScreenHero.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          petalsEngine.start();
        }
      }
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // 2C. Scroll-Driven Timeline Flower Disintegration & Reassembly Engine
  // --------------------------------------------------------------------------
  const FLOWER_1_PETALS = [
    // Outer layer (peels off earliest: pStart 0.03 - 0.16)
    { type: 1, w: 32, h: 28, pStart: 0.03, startAngle: -35, startR: 16, fallDist: 215, spreadX: -45, driftAmp: 16, driftFreq: 2.6, driftPhase: 0.2, spin: -180, flipFreq: 2.2, flipPhase: 0.1 },
    { type: 2, w: 30, h: 32, pStart: 0.05, startAngle: 45,  startR: 15, fallDist: 235, spreadX: 42,  driftAmp: 20, driftFreq: 2.4, driftPhase: 1.1, spin: 195,  flipFreq: 2.4, flipPhase: 0.7 },
    { type: 3, w: 33, h: 30, pStart: 0.08, startAngle: 110, startR: 17, fallDist: 250, spreadX: 36,  driftAmp: 15, driftFreq: 3.0, driftPhase: 2.1, spin: -150, flipFreq: 1.9, flipPhase: 1.3 },
    { type: 1, w: 27, h: 24, pStart: 0.10, startAngle: -125,startR: 16, fallDist: 220, spreadX: -38, driftAmp: 18, driftFreq: 2.5, driftPhase: 3.0, spin: 170,  flipFreq: 2.3, flipPhase: 1.9 },
    { type: 2, w: 31, h: 33, pStart: 0.12, startAngle: -80, startR: 18, fallDist: 240, spreadX: -50, driftAmp: 22, driftFreq: 2.2, driftPhase: 0.6, spin: -210, flipFreq: 2.0, flipPhase: 0.4 },
    { type: 4, w: 14, h: 13, pStart: 0.14, startAngle: 25,  startR: 17, fallDist: 255, spreadX: 25,  driftAmp: 14, driftFreq: 3.2, driftPhase: 1.5, spin: 240,  flipFreq: 3.1, flipPhase: 0.9 },
    { type: 3, w: 29, h: 28, pStart: 0.16, startAngle: 75,  startR: 17, fallDist: 260, spreadX: 46,  driftAmp: 17, driftFreq: 2.8, driftPhase: 1.7, spin: 185,  flipFreq: 2.4, flipPhase: 1.7 },

    // Middle layer (pStart: 0.18 - 0.42)
    { type: 4, w: 24, h: 24, pStart: 0.20, startAngle: -20, startR: 12, fallDist: 205, spreadX: -28, driftAmp: 15, driftFreq: 3.1, driftPhase: 1.4, spin: -130, flipFreq: 2.6, flipPhase: 1.1 },
    { type: 3, w: 26, h: 25, pStart: 0.23, startAngle: 65,  startR: 13, fallDist: 230, spreadX: 32,  driftAmp: 16, driftFreq: 2.7, driftPhase: 2.6, spin: 160,  flipFreq: 2.1, flipPhase: 2.0 },
    { type: 1, w: 12, h: 11, pStart: 0.26, startAngle: -60, startR: 13, fallDist: 245, spreadX: -22, driftAmp: 12, driftFreq: 3.4, driftPhase: 0.5, spin: 220,  flipFreq: 3.3, flipPhase: 1.5 },
    { type: 2, w: 25, h: 27, pStart: 0.29, startAngle: 140, startR: 11, fallDist: 245, spreadX: 22,  driftAmp: 14, driftFreq: 3.3, driftPhase: 0.3, spin: -175, flipFreq: 2.4, flipPhase: 0.5 },
    { type: 1, w: 24, h: 22, pStart: 0.32, startAngle: -105,startR: 12, fallDist: 220, spreadX: -34, driftAmp: 17, driftFreq: 2.8, driftPhase: 1.8, spin: 145,  flipFreq: 2.2, flipPhase: 1.6 },
    { type: 4, w: 23, h: 23, pStart: 0.36, startAngle: -55, startR: 10, fallDist: 235, spreadX: -20, driftAmp: 15, driftFreq: 2.9, driftPhase: 2.8, spin: -150, flipFreq: 2.7, flipPhase: 2.2 },
    { type: 3, w: 13, h: 12, pStart: 0.39, startAngle: 120, startR: 11, fallDist: 265, spreadX: 28,  driftAmp: 13, driftFreq: 3.5, driftPhase: 1.2, spin: -190, flipFreq: 3.0, flipPhase: 0.8 },
    { type: 2, w: 23, h: 25, pStart: 0.42, startAngle: 170, startR: 9,  fallDist: 260, spreadX: -15, driftAmp: 20, driftFreq: 2.4, driftPhase: 2.4, spin: -185, flipFreq: 2.3, flipPhase: 1.4 },

    // Inner core layer & delicate fragments (pStart: 0.45 - 0.70)
    { type: 4, w: 20, h: 20, pStart: 0.46, startAngle: 15,  startR: 6,  fallDist: 215, spreadX: 16,  driftAmp: 13, driftFreq: 3.5, driftPhase: 0.5, spin: 125,  flipFreq: 2.9, flipPhase: 0.3 },
    { type: 4, w: 18, h: 18, pStart: 0.50, startAngle: -75, startR: 5,  fallDist: 225, spreadX: -14, driftAmp: 14, driftFreq: 3.2, driftPhase: 1.6, spin: -135, flipFreq: 2.8, flipPhase: 1.7 },
    { type: 2, w: 11, h: 10, pStart: 0.54, startAngle: -15, startR: 5,  fallDist: 240, spreadX: -10, driftAmp: 11, driftFreq: 3.8, driftPhase: 2.2, spin: 210,  flipFreq: 3.4, flipPhase: 1.2 },
    { type: 4, w: 19, h: 19, pStart: 0.58, startAngle: 130, startR: 6,  fallDist: 240, spreadX: 18,  driftAmp: 12, driftFreq: 3.7, driftPhase: 2.7, spin: 145,  flipFreq: 3.1, flipPhase: 2.5 },
    { type: 1, w: 10, h: 10, pStart: 0.62, startAngle: 90,  startR: 4,  fallDist: 250, spreadX: 12,  driftAmp: 10, driftFreq: 4.0, driftPhase: 0.9, spin: -170, flipFreq: 3.6, flipPhase: 2.1 },
    { type: 4, w: 17, h: 17, pStart: 0.66, startAngle: -150,startR: 4,  fallDist: 250, spreadX: -10, driftAmp: 15, driftFreq: 3.0, driftPhase: 0.7, spin: -125, flipFreq: 3.0, flipPhase: 1.0 },
    { type: 4, w: 16, h: 16, pStart: 0.70, startAngle: 0,   startR: 2,  fallDist: 260, spreadX: 6,   driftAmp: 13, driftFreq: 3.4, driftPhase: 2.0, spin: 150,  flipFreq: 3.3, flipPhase: 1.9 }
  ];

  const FLOWER_2_PETALS = [
    // Outer layer (peels off earliest: pStart 0.02 - 0.17)
    { type: 2, w: 31, h: 33, pStart: 0.02, startAngle: 30,   startR: 16, fallDist: 220, spreadX: 48,  driftAmp: 21, driftFreq: 2.5, driftPhase: 0.8, spin: 205,  flipFreq: 2.4, flipPhase: 0.3 },
    { type: 1, w: 33, h: 29, pStart: 0.04, startAngle: -50,  startR: 17, fallDist: 215, spreadX: -48, driftAmp: 19, driftFreq: 2.7, driftPhase: 0.4, spin: -195, flipFreq: 2.1, flipPhase: 0.9 },
    { type: 3, w: 35, h: 32, pStart: 0.07, startAngle: 135,  startR: 18, fallDist: 255, spreadX: 44,  driftAmp: 17, driftFreq: 2.9, driftPhase: 1.9, spin: 170,  flipFreq: 2.0, flipPhase: 1.6 },
    { type: 4, w: 13, h: 12, pStart: 0.09, startAngle: -10,  startR: 16, fallDist: 235, spreadX: 20,  driftAmp: 13, driftFreq: 3.4, driftPhase: 1.3, spin: -230, flipFreq: 3.2, flipPhase: 0.6 },
    { type: 2, w: 29, h: 31, pStart: 0.11, startAngle: -115, startR: 17, fallDist: 225, spreadX: -54, driftAmp: 23, driftFreq: 2.3, driftPhase: 2.8, spin: 190,  flipFreq: 2.2, flipPhase: 1.8 },
    { type: 3, w: 32, h: 30, pStart: 0.14, startAngle: 85,   startR: 17, fallDist: 260, spreadX: 52,  driftAmp: 18, driftFreq: 3.1, driftPhase: 1.2, spin: -165, flipFreq: 2.5, flipPhase: 1.1 },
    { type: 1, w: 34, h: 30, pStart: 0.17, startAngle: 175,  startR: 16, fallDist: 270, spreadX: -32, driftAmp: 24, driftFreq: 2.2, driftPhase: 2.9, spin: -180, flipFreq: 1.9, flipPhase: 2.7 },

    // Middle layer (pStart: 0.19 - 0.44)
    { type: 4, w: 25, h: 25, pStart: 0.19, startAngle: -35,  startR: 13, fallDist: 210, spreadX: -32, driftAmp: 15, driftFreq: 3.0, driftPhase: 1.7, spin: 155,  flipFreq: 2.8, flipPhase: 1.3 },
    { type: 3, w: 27, h: 26, pStart: 0.22, startAngle: 50,   startR: 12, fallDist: 230, spreadX: 36,  driftAmp: 18, driftFreq: 2.6, driftPhase: 2.5, spin: -170, flipFreq: 2.3, flipPhase: 2.2 },
    { type: 2, w: 12, h: 11, pStart: 0.25, startAngle: 100,  startR: 12, fallDist: 245, spreadX: 24,  driftAmp: 12, driftFreq: 3.6, driftPhase: 0.7, spin: 215,  flipFreq: 3.3, flipPhase: 1.0 },
    { type: 2, w: 26, h: 28, pStart: 0.28, startAngle: 155,  startR: 11, fallDist: 250, spreadX: 28,  driftAmp: 16, driftFreq: 3.2, driftPhase: 0.6, spin: 190,  flipFreq: 2.4, flipPhase: 0.4 },
    { type: 1, w: 25, h: 23, pStart: 0.31, startAngle: -95,  startR: 12, fallDist: 220, spreadX: -42, driftAmp: 19, driftFreq: 2.7, driftPhase: 2.1, spin: -160, flipFreq: 2.1, flipPhase: 1.5 },
    { type: 4, w: 24, h: 24, pStart: 0.35, startAngle: -70,  startR: 10, fallDist: 240, spreadX: -24, driftAmp: 17, driftFreq: 3.1, driftPhase: 3.1, spin: 170,  flipFreq: 2.7, flipPhase: 2.6 },
    { type: 1, w: 11, h: 10, pStart: 0.38, startAngle: -140, startR: 10, fallDist: 245, spreadX: -26, driftAmp: 11, driftFreq: 3.7, driftPhase: 1.9, spin: -200, flipFreq: 3.5, flipPhase: 1.8 },
    { type: 3, w: 26, h: 25, pStart: 0.42, startAngle: 115,  startR: 10, fallDist: 265, spreadX: 34,  driftAmp: 20, driftFreq: 2.5, driftPhase: 1.4, spin: -180, flipFreq: 2.2, flipPhase: 0.8 },

    // Inner core layer & delicate fragments (pStart: 0.45 - 0.72)
    { type: 4, w: 21, h: 21, pStart: 0.47, startAngle: 25,   startR: 6,  fallDist: 220, spreadX: 20,  driftAmp: 15, driftFreq: 3.4, driftPhase: 0.7, spin: -140, flipFreq: 3.1, flipPhase: 0.5 },
    { type: 4, w: 19, h: 19, pStart: 0.51, startAngle: -85,  startR: 5,  fallDist: 225, spreadX: -18, driftAmp: 16, driftFreq: 3.1, driftPhase: 1.8, spin: 150,  flipFreq: 2.9, flipPhase: 1.9 },
    { type: 3, w: 10, h: 10, pStart: 0.55, startAngle: 70,   startR: 5,  fallDist: 240, spreadX: 14,  driftAmp: 10, driftFreq: 3.9, driftPhase: 2.4, spin: -185, flipFreq: 3.6, flipPhase: 1.4 },
    { type: 4, w: 20, h: 20, pStart: 0.59, startAngle: 145,  startR: 6,  fallDist: 250, spreadX: 24,  driftAmp: 14, driftFreq: 3.6, driftPhase: 3.0, spin: -160, flipFreq: 3.3, flipPhase: 2.8 },
    { type: 2, w: 10, h: 9,  pStart: 0.63, startAngle: -45,  startR: 4,  fallDist: 245, spreadX: -12, driftAmp: 11, driftFreq: 3.8, driftPhase: 0.8, spin: 175,  flipFreq: 3.5, flipPhase: 2.0 },
    { type: 4, w: 18, h: 18, pStart: 0.67, startAngle: -165, startR: 4,  fallDist: 260, spreadX: -14, driftAmp: 17, driftFreq: 2.9, driftPhase: 0.9, spin: 140,  flipFreq: 3.2, flipPhase: 1.2 },
    { type: 4, w: 17, h: 17, pStart: 0.71, startAngle: 10,   startR: 2,  fallDist: 270, spreadX: 10,  driftAmp: 15, driftFreq: 3.3, driftPhase: 2.2, spin: -165, flipFreq: 3.5, flipPhase: 2.1 }
  ];

  class FlowerMilestone {
    constructor(cfg) {
      this.milestone = document.getElementById(cfg.milestoneId);
      this.intactFlower = document.getElementById(cfg.intactId);
      this.petalsStage = document.getElementById(cfg.stageId);
      this.aura = document.getElementById(cfg.auraId);
      this.prevEvent = document.getElementById(cfg.prevEventId);
      this.nextEvent = document.getElementById(cfg.nextEventId);
      this.petalConfigs = cfg.petals || [];
      this.petals = [];
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!this.milestone || !this.intactFlower || !this.petalsStage) return;

      this.initPetals();
      this.update();
    }

    initPetals() {
      this.petalsStage.innerHTML = '';
      this.petals = [];

      for (let i = 0; i < this.petalConfigs.length; i++) {
        const c = this.petalConfigs[i];
        const el = document.createElement('div');
        el.className = 'timeline-petal-item';
        el.style.width = `${c.w}px`;
        el.style.height = `${c.h}px`;
        el.style.backgroundImage = `url('assets/images/rose_petal_${c.type}.png')`;
        const rad = (c.startAngle * Math.PI) / 180;
        const startX = Math.cos(rad) * c.startR - c.w / 2;
        const startY = Math.sin(rad) * c.startR - c.h / 2;
        el.style.transform = `translate3d(${startX}px, ${startY}px, 0) rotate(${c.startAngle}deg) scale(0.6)`;
        el.style.opacity = '0';
        this.petalsStage.appendChild(el);

        this.petals.push({
          el: el,
          startX: startX,
          startY: startY,
          ...c
        });
      }
    }

    calcProgress() {
      if (!this.milestone) return 0;
      const vh = window.innerHeight || 800;
      const rect = this.milestone.getBoundingClientRect();
      const flowerY = rect.top + rect.height * 0.5;

      // Active disintegration window:
      // Starts when flower moves past mid-screen (0.44 * vh)
      // Completes when flower reaches upper-screen (0.24 * vh)
      const startY = vh * 0.44;
      const endY = vh * 0.24;

      if (flowerY >= startY) return 0;
      if (flowerY <= endY) return 1;
      return (startY - flowerY) / (startY - endY);
    }

    update() {
      if (!this.milestone || !this.intactFlower) return;
      const p = this.calcProgress();

      // Skip DOM layout recalculations if progress has not meaningfully shifted
      if (this.lastP !== undefined && Math.abs(p - this.lastP) < 0.0001) return;
      this.lastP = p;

      if (this.isReducedMotion) {
        const opacity = (1 - p).toFixed(3);
        this.intactFlower.style.opacity = opacity;
        if (this.aura) this.aura.style.opacity = opacity;
        return;
      }

      // 1. Progressive intact flower core disintegration
      if (p <= 0) {
        this.intactFlower.style.opacity = '1';
        this.intactFlower.style.transform = 'scale(1)';
        if (this.aura) this.aura.style.opacity = '1';
      } else if (p >= 0.75) {
        this.intactFlower.style.opacity = '0';
        this.intactFlower.style.transform = 'scale(0.4)';
        if (this.aura) this.aura.style.opacity = '0';
      } else {
        const t = p / 0.75;
        const coreOpacity = Math.max(0, 1 - Math.pow(t, 1.2));
        const coreScale = 1 - t * 0.45;
        this.intactFlower.style.opacity = coreOpacity.toFixed(3);
        this.intactFlower.style.transform = `scale(${coreScale.toFixed(3)})`;
        if (this.aura) this.aura.style.opacity = coreOpacity.toFixed(3);
      }

      // 2. Individual petals motion (deterministic & fully reversible)
      for (let i = 0; i < this.petals.length; i++) {
        const petal = this.petals[i];

        if (p <= petal.pStart) {
          petal.el.style.opacity = '0';
          petal.el.style.transform = `translate3d(${petal.startX}px, ${petal.startY}px, 0) rotate(${petal.startAngle}deg) scale(0.6)`;
          continue;
        }

        const localT = Math.min(1, Math.max(0, (p - petal.pStart) / (1 - petal.pStart)));

        // Downward gravity fall with smooth acceleration curve
        const fallProgress = Math.pow(localT, 1.35);
        const curY = petal.startY + petal.fallDist * fallProgress;

        // Smooth lateral spread + sinusoidal wind drift
        const curX = petal.startX + (petal.spreadX * Math.sqrt(localT)) + (petal.driftAmp * Math.sin(localT * petal.driftFreq * Math.PI + petal.driftPhase));

        // Progressive rotation and tumbling flip
        const curRot = petal.startAngle + petal.spin * localT;
        const flipScale = Math.cos(localT * petal.flipFreq * Math.PI + petal.flipPhase);

        // Opacity: fade in upon detachment, stay visible, fade out toward the bottom
        let opacity = 1;
        if (localT < 0.12) {
          opacity = localT / 0.12;
        } else if (localT > 0.65) {
          opacity = Math.max(0, (1 - localT) / 0.35);
        }

        petal.el.style.opacity = opacity.toFixed(3);
        petal.el.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) rotate(${curRot.toFixed(1)}deg) scale(${flipScale.toFixed(2)}, 1)`;
      }
    }
  }

  class ScrollFlowerDisintegrationEngine {
    constructor() {
      this.ticking = false;
      this.flowers = [];

      // Flower 1: Haldi Ceremony (Position 1) to Thursday Date (Position 2)
      const f1 = new FlowerMilestone({
        milestoneId: 'timeline-flower-milestone-1',
        intactId: 'flower-intact-1',
        stageId: 'petals-stage-1',
        auraId: 'flower-aura-1',
        prevEventId: 'event-haldi',
        nextEventId: 'timeline-date-thursday',
        petals: FLOWER_1_PETALS
      });
      if (f1.milestone) this.flowers.push(f1);

      // Flower 2: Dinner (Position 3) to Sumuhurtham Ceremony (Position 4)
      const f2 = new FlowerMilestone({
        milestoneId: 'timeline-flower-milestone',
        intactId: 'flower-intact',
        stageId: 'petals-stage',
        auraId: 'flower-aura',
        prevEventId: 'event-dinner',
        nextEventId: 'event-sumuhurtham',
        petals: FLOWER_2_PETALS
      });
      if (f2.milestone) this.flowers.push(f2);

      if (this.flowers.length === 0) return;

      this.bindEvents();
      this.updateAll();
    }

    bindEvents() {
      const onScrollOrResize = () => {
        if (!this.ticking) {
          this.ticking = true;
          requestAnimationFrame(() => {
            this.updateAll();
            this.ticking = false;
          });
        }
      };

      window.addEventListener('scroll', onScrollOrResize, { passive: true });
      window.addEventListener('resize', onScrollOrResize, { passive: true });
    }

    update() {
      this.updateAll();
    }

    updateAll() {
      for (let i = 0; i < this.flowers.length; i++) {
        this.flowers[i].update();
      }
    }
  }

  // --------------------------------------------------------------------------
  // 3. Live Wedding Countdown to 29 October 2026, 7:31 PM IST
  // --------------------------------------------------------------------------
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = WEDDING_CONFIG.targetDate - now;

    if (distance <= 0) {
      // Post-wedding date handling
      if (timerDays) timerDays.textContent = '00';
      if (timerHours) timerHours.textContent = '00';
      if (timerMins) timerMins.textContent = '00';
      if (timerSecs) timerSecs.textContent = '00';
      
      const countdownSection = document.getElementById('countdown-section');
      if (countdownSection && !countdownSection.classList.contains('celebration-active')) {
        countdownSection.classList.add('celebration-active');
        const heading = countdownSection.querySelector('.script-heading');
        if (heading) heading.textContent = 'The Auspicious Celebration Has Begun!';
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (timerDays) timerDays.textContent = String(days).padStart(2, '0');
    if (timerHours) timerHours.textContent = String(hours).padStart(2, '0');
    if (timerMins) timerMins.textContent = String(minutes).padStart(2, '0');
    if (timerSecs) timerSecs.textContent = String(seconds).padStart(2, '0');
  }

  // Run immediately and tick every second
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // --------------------------------------------------------------------------
  // 4. Ambient Music System (Resilient Dual Engine: Audio Element + Web Audio)
  // --------------------------------------------------------------------------
  class AmbientHarpSynthesizer {
    constructor() {
      this.ctx = null;
      this.isPlaying = false;
      this.intervalId = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    play() {
      this.init();
      if (!this.ctx) return;
      this.isPlaying = true;

      // Celestial wedding arpeggios in D Major Pentatonic (D4, E4, F#4, A4, B4, D5, E5, F#5)
      const scale = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99];
      const chords = [
        [0, 2, 4, 6], // D Major 9
        [1, 3, 5, 7], // Em 9
        [4, 0, 2, 5], // Bm 7
        [3, 0, 2, 6]  // A sus
      ];

      let chordIdx = 0;
      let noteStep = 0;

      const playNote = () => {
        if (!this.isPlaying || !this.ctx) return;
        const currentChord = chords[chordIdx];
        const noteIdx = currentChord[noteStep % currentChord.length];
        const freq = scale[noteIdx];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Warm celestial acoustic timbre
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Natural exponential decay envelope
        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 3.4);

        noteStep++;
        if (noteStep % 4 === 0) {
          chordIdx = (chordIdx + 1) % chords.length;
        }
      };

      // Play note every 1.25s
      playNote();
      this.intervalId = setInterval(playNote, 1250);
    }

    stop() {
      this.isPlaying = false;
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
  }

  function startMusic() {
    if (isAudioPlaying) return;

    // First attempt to play HTML5 audio element
    if (audioElement) {
      audioElement.volume = 0.55;
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isAudioPlaying = true;
            updateAudioUI(true);
          })
          .catch(() => {
            // If audio file playback is blocked or missing, fall back to Web Audio Synthesizer!
            if (!webAudioSynth) webAudioSynth = new AmbientHarpSynthesizer();
            webAudioSynth.play();
            isAudioPlaying = true;
            updateAudioUI(true);
          });
        return;
      }
    }

    // Direct Web Audio fallback
    if (!webAudioSynth) webAudioSynth = new AmbientHarpSynthesizer();
    webAudioSynth.play();
    isAudioPlaying = true;
    updateAudioUI(true);
  }

  function pauseMusic() {
    if (!isAudioPlaying) return;
    if (audioElement) {
      audioElement.pause();
    }
    if (webAudioSynth) {
      webAudioSynth.stop();
    }
    isAudioPlaying = false;
    updateAudioUI(false);
  }

  function toggleMusic() {
    if (isAudioPlaying) {
      pauseMusic();
      showToast('Music Paused');
    } else {
      startMusic();
      showToast('Romantic Music Playing');
    }
  }

  function updateAudioUI(playing) {
    if (!musicController) return;
    if (playing) {
      musicController.classList.add('playing');
      if (iconPause) iconPause.style.display = 'block';
      if (iconPlay) iconPlay.style.display = 'none';
      if (musicToggleBtn) musicToggleBtn.setAttribute('aria-label', 'Pause wedding background music');
    } else {
      musicController.classList.remove('playing');
      if (iconPause) iconPause.style.display = 'none';
      if (iconPlay) iconPlay.style.display = 'block';
      if (musicToggleBtn) musicToggleBtn.setAttribute('aria-label', 'Play wedding background music');
    }
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', toggleMusic);
  }

  // --------------------------------------------------------------------------
  // 5. Calendar Event Generator (.ics format + Google Calendar)
  // --------------------------------------------------------------------------
  function generateCalendarEvent() {
    const title = 'Wedding Ceremony: Chi. Sumanth & Chi. La. Sou. Keerthi';
    const description = 'Wedding ceremony and dinner of Chi. Sumanth, B.Tech & Chi. La. Sou. Keerthi, B.Tech. Dinner: 7:00 PM onwards | Sumuhurtham: 7:31 PM IST. Maps Destination: https://maps.app.goo.gl/rPqwCiCKpotjdGxg8?g_st=ac';
    const location = `${WEDDING_CONFIG.venue}, Andhra Pradesh (https://maps.app.goo.gl/rPqwCiCKpotjdGxg8?g_st=ac)`;
    
    // 29 October 2026, 7:00 PM IST is 13:30 UTC
    const startTime = '20261029T133000Z';
    const endTime = '20261029T183000Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Sumanth Keerthi Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART:${startTime}`,
      `DTEND:${endTime}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sumanth_keerthi_wedding.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Wedding Event Added to Calendar');
  }

  if (btnAddCalendar) {
    btnAddCalendar.addEventListener('click', generateCalendarEvent);
  }

  // --------------------------------------------------------------------------
  // 6. Interactive RSVP Modal & Form Handling
  // --------------------------------------------------------------------------
  function openRsvpModal() {
    if (!rsvpModalOverlay) return;
    rsvpModalOverlay.classList.add('active');
    rsvpModalOverlay.setAttribute('aria-hidden', 'false');
    if (openRsvpBtn) openRsvpBtn.setAttribute('aria-expanded', 'true');
    
    // Focus first input for accessibility
    setTimeout(() => {
      const nameInput = document.getElementById('guest-name');
      if (nameInput) nameInput.focus();
    }, 200);
  }

  function closeRsvpModal() {
    if (!rsvpModalOverlay) return;
    rsvpModalOverlay.classList.remove('active');
    rsvpModalOverlay.setAttribute('aria-hidden', 'true');
    if (openRsvpBtn) openRsvpBtn.setAttribute('aria-expanded', 'false');
  }

  if (openRsvpBtn) openRsvpBtn.addEventListener('click', openRsvpModal);
  if (closeRsvpBtn) closeRsvpBtn.addEventListener('click', closeRsvpModal);
  if (btnCloseSuccess) btnCloseSuccess.addEventListener('click', closeRsvpModal);

  // Close modal when clicking on backdrop
  if (rsvpModalOverlay) {
    rsvpModalOverlay.addEventListener('click', (e) => {
      if (e.target === rsvpModalOverlay) {
        closeRsvpModal();
      }
    });
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && rsvpModalOverlay && rsvpModalOverlay.classList.contains('active')) {
      closeRsvpModal();
    }
  });

  // Toggle Guest Count visibility based on attendance radio
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
  const guestCountRow = document.getElementById('guest-count-row');

  attendanceRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (guestCountRow) {
        guestCountRow.style.display = radio.value === 'attending' ? 'flex' : 'none';
      }
    });
  });

  // Handle Form Submission
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('guest-name');
      const nameGroup = nameInput ? nameInput.closest('.form-group') : null;
      const guestName = nameInput ? nameInput.value.trim() : '';

      // Validation
      if (!guestName) {
        if (nameGroup) nameGroup.classList.add('has-error');
        if (nameInput) nameInput.focus();
        return;
      }
      if (nameGroup) nameGroup.classList.remove('has-error');

      const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'attending';
      const guestCount = document.getElementById('guest-count')?.value || '1';
      const dietPref = document.getElementById('diet-pref')?.value || 'Traditional Feast';
      const wishes = document.getElementById('guest-wishes')?.value.trim() || '';

      const rsvpData = {
        name: guestName,
        attendance: attendance,
        count: attendance === 'attending' ? guestCount : '0',
        diet: attendance === 'attending' ? dietPref : 'N/A',
        wishes: wishes,
        timestamp: new Date().toISOString()
      };

      // Safely persist to localStorage
      try {
        const storedRsvps = JSON.parse(localStorage.getItem('sumanth_keerthi_rsvps') || '[]');
        storedRsvps.push(rsvpData);
        localStorage.setItem('sumanth_keerthi_rsvps', JSON.stringify(storedRsvps));
      } catch (err) {
        console.warn('LocalStorage not available:', err);
      }

      // Populate Success Summary
      if (successSummary) {
        if (attendance === 'attending') {
          successSummary.innerHTML = `<strong>${escapeHtml(guestName)}</strong> &bull; Attending with <strong>${escapeHtml(guestCount)} ${guestCount === '1' ? 'guest' : 'guests'}</strong>.<br>Food: ${escapeHtml(dietPref)}`;
        } else {
          successSummary.innerHTML = `<strong>${escapeHtml(guestName)}</strong> &bull; Marked as unable to attend.<br>Warm wishes noted!`;
        }
      }

      // Prepare WhatsApp Direct Forward Link
      if (whatsappRsvpLink) {
        const waText = encodeURIComponent(
          `Namaste! Here is my RSVP for Sumanth & Keerthi's Wedding on 29 Oct 2026:\n\n` +
          `• Name: ${guestName}\n` +
          `• Status: ${attendance === 'attending' ? 'Joyfully Attending' : 'Regretfully Unable'}\n` +
          (attendance === 'attending' ? `• Guests: ${guestCount}\n• Meal: ${dietPref}\n` : '') +
          (wishes ? `• Message: "${wishes}"\n` : '')
        );
        whatsappRsvpLink.href = `https://api.whatsapp.com/send?text=${waText}`;
      }

      // Transition to Success View
      rsvpForm.style.display = 'none';
      if (rsvpSuccessView) rsvpSuccessView.style.display = 'block';

      showToast('RSVP Recorded Successfully!');
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // --------------------------------------------------------------------------
  // 7. Scroll-Triggered Reveal Observers
  // --------------------------------------------------------------------------
  function initScrollObservers() {
    const scrollRevealTargets = document.querySelectorAll(
      '.scroll-fade, .scroll-slide-left, .scroll-slide-right, .timeline-event-row'
    );

    if (!('IntersectionObserver' in window)) {
      scrollRevealTargets.forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.05
      }
    );

    scrollRevealTargets.forEach((el) => {
      observer.observe(el);
    });
  }

  // If envelope stage is already hidden or absent, initialize reveals immediately
  if (!envelopeStage || envelopeStage.classList.contains('stage-hidden')) {
    if (firstScreenHero) {
      firstScreenHero.classList.add('hero-revealed');
    }
    initScrollObservers();
    initHeroObserver();
  }

  // Pre-initialize flower disintegration engine if timeline is present
  if (document.getElementById('timeline-flower-milestone') || document.getElementById('timeline-flower-milestone-1')) {
    flowerDisintegrationEngine = new ScrollFlowerDisintegrationEngine();
  }

})();
