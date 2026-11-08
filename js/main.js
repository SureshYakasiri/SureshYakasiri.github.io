/**
 * YAKASIRI SURESH // GAME DESIGNER PORTFOLIO
 * Hardware & System Interactive Core Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCircuitCanvas();
  initProjectFilters();
  initCardScreenshotSwitchers();
  initProjectModals();
  initContactUtils();
  initRGBMode();
});

/* ==========================================================================
   1. NAVIGATION & SCROLL HIGHLIGHTING
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link');

  // Sticky Navbar blur enhancement on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('mobile-open');
    });

    // Close mobile nav on link click
    navItems.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // Active section observer
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   2. LIGHTWEIGHT CIRCUIT BOARD CANVAS ANIMATION
   ========================================================================== */
function initCircuitCanvas() {
  const canvas = document.getElementById('circuit-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const particleCount = 28;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particle Class for subtle electrical packet flows
  class ElectricalPulse {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.floor(Math.random() * (width / 50)) * 50;
      this.y = Math.floor(Math.random() * (height / 50)) * 50;
      this.axis = Math.random() > 0.5 ? 'x' : 'y';
      this.dir = Math.random() > 0.5 ? 1 : -1;
      this.speed = (Math.random() * 1.5 + 1);
      this.length = Math.random() * 25 + 15;
      this.life = 0;
      this.maxLife = Math.random() * 120 + 80;
    }

    update() {
      if (this.axis === 'x') {
        this.x += this.speed * this.dir;
      } else {
        this.y += this.speed * this.dir;
      }

      this.life++;

      // Change axis at grid intersections occasionally
      if (this.life % 40 === 0 && Math.random() > 0.5) {
        this.axis = this.axis === 'x' ? 'y' : 'x';
        this.dir = Math.random() > 0.5 ? 1 : -1;
      }

      if (this.life >= this.maxLife || this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      if (this.axis === 'x') {
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - (this.length * this.dir), this.y);
      } else {
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y - (this.length * this.dir));
      }
      ctx.strokeStyle = '#00ff66';
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.4;
      ctx.stroke();

      // Glowing head
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#00ff66';
      ctx.globalAlpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.7;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    const p = new ElectricalPulse();
    p.life = Math.random() * p.maxLife; // Stagger
    particles.push(p);
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Subtle Grid Points
    ctx.fillStyle = '#172230';
    ctx.globalAlpha = 0.25;
    for (let x = 0; x < width; x += 100) {
      for (let y = 0; y < height; y += 100) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   3. PROJECT FILTERING SYSTEM
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || card.getAttribute('data-platforms')?.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   3.5 CARD SCREENSHOT SWITCHERS
   ========================================================================== */
function initCardScreenshotSwitchers() {
  const pills = document.querySelectorAll('.scr-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = pill.getAttribute('data-target');
      const targetImg = document.getElementById(targetId);
      const newSrc = pill.getAttribute('data-src');
      const newAlt = pill.getAttribute('data-alt');

      if (targetImg && newSrc) {
        targetImg.style.opacity = '0.4';
        setTimeout(() => {
          targetImg.src = newSrc;
          targetImg.onerror = function() {
            this.onerror = null;
            if (this.src.includes('assets/')) {
              this.src = this.src.replace('assets/', 'Assets/');
            }
          };
          if (newAlt) targetImg.alt = newAlt;
          targetImg.style.opacity = '1';
        }, 120);

        // Update active class on siblings
        const parent = pill.parentElement;
        if (parent) {
          parent.querySelectorAll('.scr-pill').forEach(p => p.classList.remove('active'));
        }
        pill.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE PROJECT DETAIL MODALS
   ========================================================================== */
const projectData = {
  'recooked': {
    title: 'RE-COOKED',
    event: 'BYOG 2025 // THEME: RETHINK, REMIX, REMAKE',
    role: 'Concept & 3D Artist',
    platform: 'Web (Playable in Browser)',
    playUrl: 'https://jsrreddy.itch.io/recooked',
    actionText: 'Play on Itch.io',
    image: 'assets/images/recooked-combo.png',
    screenshots: [
      {
        src: 'assets/images/recooked-combo.png',
        label: 'Assembled Combo Order',
        caption: 'Gameplay in Action: Player completes a full burger, fries, and beverage combo tray correctly before delivery hatch.'
      },
      {
        src: 'assets/images/recooked-workstation.png',
        label: 'Kitchen Assembly Line & 3D Art',
        caption: '3D Kitchen Environment & Concept Art: First-person view of the conveyor belt, ingredient dispensers (Sauce, Patty, Veggie, Top-Bun), and order recipe HUD.'
      },
      {
        src: 'assets/images/recooked-menu.png',
        label: 'Main Title Screen',
        caption: 'Title & UX Flow: Stylized "RE:COOKED" title screen with Play, Options, Credits, and Quit options.'
      },
      {
        src: 'assets/images/project-recooked.svg',
        label: 'GDD Blueprint Schematic',
        caption: 'GDD Pipeline Diagram: Order queue stream, sequential ingredient logic, and verification quality check system.'
      }
    ],
    summary: 'A fast-paced cooking game where players prepare burgers according to customer orders. Players must follow recipe cards and select ingredients in the correct sequence. Incorrect orders are sent to the trash.',
    pillars: [
      {
        title: 'Core Design Loop',
        desc: 'Recipe Order Queue → Sequence Memorization & Ingredient Pick → Dynamic Quality Check → Rapid Serve / Trash Decision.'
      },
      {
        title: 'Jam Constraint Integration',
        desc: 'Developed under the BYOG 2025 theme "Rethink, Remix, Remake" by taking classic culinary time-management mechanics and remixing the order flow with high-stress sequential penalty dynamics.'
      },
      {
        title: 'Role Breakdown (Concept & 3D Art)',
        desc: 'Conceptualized the kitchen layout, created 3D workstation assets, greyboxed the assembly flow, and designed the visual feedback indicators for successful burger orders vs trash rejections.'
      }
    ]
  },
  'shifting-realms': {
    title: 'SHIFTING REALMS',
    event: 'Brackeys Game Jam 2026.1 // THEME: STRANGE PLACES',
    role: 'Level Designer',
    engine: 'Unity',
    platform: 'Web / PC (Playable)',
    playUrl: 'https://shaik-imamsaheb.itch.io/shifting-realms',
    actionText: 'Play on Itch.io',
    image: 'assets/images/shifting-library.png',
    screenshots: [
      {
        src: 'assets/images/shifting-library.png',
        label: 'Size-Based Library Puzzle',
        caption: 'Chamber 01 - Scale-Bending Library: Massive bookshelf room where the player manipulates red and blue scale apples to traverse vertical bookshelves.'
      },
      {
        src: 'assets/images/shifting-darkness.png',
        label: 'The Dark Void Navigation',
        caption: 'Chamber 02 - Occlusion & Lighting: Pitch-black navigation challenge requiring players to use matchsticks and isolated spotlights to reveal path obstacles.'
      },
      {
        src: 'assets/images/shifting-island.png',
        label: 'Crab Island Egress',
        caption: 'Chamber 04 - Island Hazard Egress: Outdoor landscape terrain objective requiring players to scavenge sticks (0/10) while dodging hostile giant crab AI.'
      },
      {
        src: 'assets/images/project-shifting-realms.svg',
        label: 'LDD 4-Chamber Architecture',
        caption: 'Level Design Documentation: Topology schematic detailing gravity inversion, field-of-view occlusion, angular room rotation, and extraction vectors.'
      }
    ],
    summary: 'Explore four strange worlds where gravity, light and perspective bend reality. Each world introduces a different gameplay challenge, including size-based puzzles, navigating through darkness, rotating rooms and escaping a crab-infested island.',
    pillars: [
      {
        title: 'Spatial & Perspective Puzzles',
        desc: 'Designed levels with gravity inversion matrices and forced-perspective optical scale puzzles, pushing the player to rethink 3D spatial orientation.'
      },
      {
        title: 'Four Anomaly Chambers',
        desc: 'Crafted distinct atmospheric and mechanical pacing across 4 chambers: 1) Gravity & Scale scaling, 2) The Dark Void (field-of-view occlusion), 3) 90° Rotational Rooms, and 4) Crab Atoll Hazard Egress.'
      },
      {
        title: 'Level Designer Implementation',
        desc: 'Greyboxed all four levels in Unity, tuned player movement sightlines, calibrated puzzle difficulty curves, and synchronized spatial shifting mechanics with visual and audio cues.'
      }
    ]
  },
  'bts': {
    title: 'BTS: BENGALURU TRAFFIC SIMULATOR',
    event: 'ICAT College Game Jam 2024 // THEME: REVERSE',
    role: 'Game Designer',
    platform: 'Android (APK Alpha Release)',
    playUrl: 'https://github.com/fein999x/BTS-Bengaluru-Traffic-Simulator/releases/download/v0.1.0-alpha/BTS.apk',
    actionText: 'Download Android APK',
    image: 'assets/images/bts-menu.png',
    screenshots: [
      {
        src: 'assets/images/bts-menu.png',
        label: 'Title UI & Branding',
        caption: 'Title Screen & Visual Direction: Custom "BTS Bengaluru Traffic Simulator" logo, playful character models, and main navigation.'
      },
      {
        src: 'assets/images/bts-gameplay.png',
        label: 'In-Game Highway Gameplay',
        caption: 'Highway Traffic In Action: Down-the-road arcade perspective under sunset lighting with high-density vehicular flow.'
      },
      {
        src: 'assets/images/bts-greybox.png',
        label: 'Unity 3D Level Greybox',
        caption: 'Level Implementation & Greyboxing: Unity Editor viewport showing 3D city building blockouts, intersection layout, and player launch pad.'
      },
      {
        src: 'assets/images/project-bts.svg',
        label: 'System Design Blueprint',
        caption: 'Systems Design Schematic: Risk/reward two-lane mechanics, control inversion triggers for the "Reverse" theme, and difficulty progression curves.'
      }
    ],
    summary: 'A mind-bending arcade driving game where players navigate a chaotic two-lane highway. Players can drive safely on the left lane or risk the oncoming traffic lane for shortcuts. The game features dynamic control inversions, traffic signals and three escalating levels of difficulty.',
    pillars: [
      {
        title: 'Risk vs. Reward Architecture',
        desc: 'Designed a high-stakes two-lane economy: the safe left lane is slow and predictable, while the oncoming traffic lane offers speed shortcuts at extreme collision risk.'
      },
      {
        title: 'Theme "Reverse" Mechanic',
        desc: 'Implemented dynamic control inversions triggered at chaotic highway junctions, requiring players to instantly adapt their steering reflexes under escalating speed pressure.'
      },
      {
        title: 'Escalating 3-Tier Difficulty Progression',
        desc: 'Modeled mathematical traffic density curves across 3 distinct tiers, calibrating signal timing state machines and NPC vehicle speed algorithms to create a satisfying flow state.'
      }
    ]
  }
};

function initProjectModals() {
  const modalBackdrop = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalDetailsBtn = document.querySelectorAll('.view-details-btn');

  if (!modalBackdrop) return;

  modalDetailsBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prjKey = btn.getAttribute('data-project');
      const data = projectData[prjKey];
      if (!data) return;

      document.getElementById('modalTitle').textContent = data.title;
      document.getElementById('modalEvent').textContent = data.event;
      document.getElementById('modalRole').textContent = `ROLE: ${data.role}`;
      document.getElementById('modalSummary').textContent = data.summary;
      
      const modalMedia = document.getElementById('modalMedia');
      
      if (data.screenshots && data.screenshots.length > 0) {
        // Multi-screenshot gallery
        modalMedia.innerHTML = `
          <div style="position: relative;">
            <img id="modalMainImg" src="${data.screenshots[0].src}" onerror="this.onerror=null; this.src=this.src.replace('assets/','Assets/');" alt="${data.screenshots[0].label}" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 6px;">
            <div id="modalImgCaption" style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: #94a3b8; padding: 0.5rem 0.8rem; background: #0c1118; border-top: 1px solid #1f2c3d; border-radius: 0 0 6px 6px;">
              ${data.screenshots[0].caption}
            </div>
          </div>
          <div class="modal-gallery-grid">
            ${data.screenshots.map((s, idx) => `
              <div class="gallery-thumb-item ${idx === 0 ? 'active' : ''}" data-full="${s.src}" data-caption="${s.caption}">
                <img src="${s.src}" onerror="this.onerror=null; this.src=this.src.replace('assets/','Assets/');" alt="${s.label}">
                <div class="gallery-thumb-label">${s.label}</div>
              </div>
            `).join('')}
          </div>
        `;

        // Add gallery click handler
        const thumbs = modalMedia.querySelectorAll('.gallery-thumb-item');
        const mainImg = modalMedia.querySelector('#modalMainImg');
        const caption = modalMedia.querySelector('#modalImgCaption');

        thumbs.forEach(thumb => {
          thumb.addEventListener('click', () => {
            thumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            const fullSrc = thumb.getAttribute('data-full');
            const capText = thumb.getAttribute('data-caption');
            if (mainImg && fullSrc) {
              mainImg.style.opacity = '0.5';
              setTimeout(() => {
                mainImg.src = fullSrc;
                mainImg.onerror = function() {
                  this.onerror = null;
                  if (this.src.includes('assets/')) {
                    this.src = this.src.replace('assets/', 'Assets/');
                  }
                };
                if (caption && capText) caption.textContent = capText;
                mainImg.style.opacity = '1';
              }, 120);
            }
          });
        });
      } else {
        modalMedia.innerHTML = `<img src="${data.image}" onerror="this.onerror=null; this.src=this.src.replace('assets/','Assets/');" alt="${data.title} Blueprint">`;
      }

      const playLink = document.getElementById('modalPlayBtn');
      playLink.href = data.playUrl;
      playLink.innerHTML = `<span>${data.actionText}</span> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;

      // Render Pillars
      const pillarsWrap = document.getElementById('modalPillars');
      pillarsWrap.innerHTML = data.pillars.map(pillar => `
        <div style="background: #121924; border: 1px solid #1f2c3d; border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 0.85rem;">
          <h4 style="color: #00ff66; font-family: 'Rajdhani', sans-serif; font-size: 1.1rem; margin-bottom: 0.35rem; font-weight: 700;">${pillar.title}</h4>
          <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.5; margin-bottom: 0;">${pillar.desc}</p>
        </div>
      `).join('');

      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. CONTACT UTILITIES: EMAIL COPY & MESSAGE COMPOSER
   ========================================================================== */
function initContactUtils() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailVal = 'sureshyakasiri2004@gmail.com';
  const toastNotice = document.getElementById('toastNotice');

  if (copyBtn) {
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(emailVal).then(() => {
        showToast('Email copied to clipboard: ' + emailVal);
      }).catch(() => {
        showToast('Contact: ' + emailVal);
      });
    });
  }

  // Interactive Message Composer (Triggers mailto client with custom subject & body)
  const contactForm = document.getElementById('contactComposerForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName')?.value || 'Recruiter / Collaborator';
      const type = document.getElementById('inquiryType')?.value || 'Game Design Inquiry';
      const msg = document.getElementById('senderMessage')?.value || 'Hello Suresh, I saw your game design portfolio...';

      const subject = encodeURIComponent(`[${type}] From ${name}`);
      const body = encodeURIComponent(`Hi Yakasiri,\n\n${msg}\n\nBest regards,\n${name}`);

      window.location.href = `mailto:sureshyakasiri2004@gmail.com?subject=${subject}&body=${body}`;
      showToast('Opening your default email application...');
    });
  }
}

function showToast(message) {
  const toast = document.getElementById('toastNotice');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ==========================================================================
   6. RGB MODE CYCLE SWITCHER
   ========================================================================== */
function initRGBMode() {
  const rgbToggle = document.getElementById('rgbToggle');
  if (!rgbToggle) return;

  const modes = ['neon', 'cyan', 'stealth'];
  let currentModeIdx = 0;

  rgbToggle.addEventListener('click', () => {
    currentModeIdx = (currentModeIdx + 1) % modes.length;
    const mode = modes[currentModeIdx];

    document.body.classList.remove('rgb-cyan', 'rgb-stealth');

    if (mode === 'cyan') {
      document.body.classList.add('rgb-cyan');
      showToast('RGB Accent: Cyber Cyan Mode');
    } else if (mode === 'stealth') {
      document.body.classList.add('rgb-stealth');
      showToast('RGB Accent: Stealth White Mode');
    } else {
      showToast('RGB Accent: Neon Green Mode (Default)');
    }
  });
}
