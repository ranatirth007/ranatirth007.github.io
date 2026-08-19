/* ═══════════════════════════════════════
   TIRTH RANA — PORTFOLIO  |  script.js
═══════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. MATRIX RAIN ── */
  (function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>{}[]//\\|?';

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 13;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array.from({ length: columns }, () => Math.random() * -50);

    function draw() {
      columns = Math.floor(canvas.width / fontSize);
      if (drops.length < columns) drops.push(...Array.from({ length: columns - drops.length }, () => 0));

      ctx.fillStyle = 'rgba(5, 8, 12, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff88';
      ctx.font = `${fontSize}px Share Tech Mono, monospace`;

      for (let i = 0; i < columns; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.globalAlpha = Math.random() * 0.6 + 0.3;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        ctx.globalAlpha = 1;
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }

    setInterval(draw, 55);
  })();

  /* ── 2. CUSTOM CURSOR ── */
  (function initCursor() {
    const cursor = document.getElementById('cursor');
    const trail  = document.getElementById('cursor-trail');
    if (!cursor || !trail) return;

    let mx = -100, my = -100;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    // Lag trail
    let tx = mx, ty = my;
    function animTrail() {
      tx += (mx - tx) * 0.18;
      ty += (my - ty) * 0.18;
      trail.style.left = tx + 'px';
      trail.style.top  = ty + 'px';
      requestAnimationFrame(animTrail);
    }
    animTrail();

    // Hover enlargement on interactive elements
    const hoverables = 'a, button, .glass-card, .tag, .hex, .proj-link, .contact-item:not(.no-link), .social-link, input, textarea';
    document.querySelectorAll(hoverables).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  })();

  /* ── 3. NAVBAR SCROLL & ACTIVE SECTION ── */
  (function initNavbar() {
    const navbar  = document.getElementById('navbar');
    const links   = document.querySelectorAll('.nav-link');
    const toggle  = document.getElementById('nav-toggle');
    const navList = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // Smooth scroll
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        navList.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Mobile toggle
    toggle.addEventListener('click', () => {
      const open = navList.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    // IntersectionObserver for active link
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.toggle('active', l.dataset.section === entry.target.id));
        }
      });
    }, { rootMargin: '-40% 0px -40% 0px' });
    sections.forEach(s => observer.observe(s));
  })();

  /* ── 4. HERO TYPEWRITER ── */
  (function initTypewriter() {
    const nameEl = document.getElementById('typed-name');
    const roleEl = document.getElementById('typed-role');
    if (!nameEl || !roleEl) return;

    function typeText(el, text, speed, cb) {
      let i = 0;
      el.textContent = '';
      function tick() {
        if (i < text.length) {
          el.textContent += text[i++];
          setTimeout(tick, speed);
        } else if (cb) cb();
      }
      tick();
    }

    const roles = [
      'Cybersecurity Analyst_',
      'Penetration Tester_',
      'Certified Ethical Hacker_',
      'Founder @ Blumonk_',
    ];
    let roleIdx = 0;

    function cycleRole() {
      typeText(roleEl, roles[roleIdx], 60, () => {
        setTimeout(() => {
          // erase
          let text = roleEl.textContent;
          const erase = setInterval(() => {
            text = text.slice(0, -1);
            roleEl.textContent = text;
            if (!text) { clearInterval(erase); roleIdx = (roleIdx + 1) % roles.length; setTimeout(cycleRole, 400); }
          }, 35);
        }, 1800);
      });
    }

    setTimeout(() => {
      typeText(nameEl, 'TIRTH RANA', 90, () => {
        setTimeout(cycleRole, 300);
      });
    }, 400);
  })();

  /* ── 5. TERMINAL ANIMATION ── */
  (function initTerminal() {
    const body = document.getElementById('terminal-body');
    if (!body) return;

    const lines = [
      { text: '$ whoami', color: '#00ff88' },
      { text: 'tirth_rana -- CEH | Pentester', color: '#7fffd4' },
      { text: '$ nmap -sV target.local', color: '#00ff88' },
      { text: 'Scanning... [22/tcp ssh] [80/tcp http]', color: '#7fffd4' },
      { text: '$ python3 exploit.py --target 192.168.1.1', color: '#00ff88' },
      { text: '[+] Shell obtained! root@target:~#', color: '#00ffaa' },
      { text: '$ cat /etc/shadow | hashcat ...', color: '#00ff88' },
      { text: '[✓] Credentials secured. Report generated.', color: '#7fffd4' },
    ];

    let li = 0;
    function printLine() {
      if (li >= lines.length) return;
      const { text, color } = lines[li++];
      const span = document.createElement('div');
      span.style.color = color;
      let ci = 0;
      const iv = setInterval(() => {
        span.textContent += text[ci++];
        if (ci >= text.length) { clearInterval(iv); setTimeout(printLine, 500); }
      }, 35);
      body.appendChild(span);
    }
    setTimeout(printLine, 1200);
  })();

  /* ── 6. REVEAL ON SCROLL ── */
  (function initReveal() {
    const items = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(el => io.observe(el));
  })();

  /* ── 7. SKILL BAR ANIMATION ── */
  (function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animated'); io.unobserve(e.target); } });
    }, { threshold: 0.5 });
    bars.forEach(b => io.observe(b));
  })();

  /* ── 8. CONTACT FORM (Dual: Formspree + mailto fallback) ── */
  (function initForm() {
    const form   = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const btn    = document.getElementById('send-message-btn');
    if (!form) return;

    const FORMSPREE_ID  = 'mkjwzwga';
    const YOUR_EMAIL    = 'tirthrana1240@gmail.com';

    function openMailto(name, email, message) {
      const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
      const body    = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      );
      window.location.href = `mailto:${YOUR_EMAIL}?subject=${subject}&body=${body}`;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name    = document.getElementById('form-name').value.trim();
      const email   = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();

      // ── Validation ──
      if (!name || !email || !message) {
        status.textContent = '[ERROR] All fields are required.';
        status.className = 'form-status error';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.textContent = '[ERROR] Invalid email address.';
        status.className = 'form-status error';
        return;
      }

      btn.disabled = true;
      btn.querySelector('span').textContent = 'Sending...';
      status.textContent = '';
      status.className = 'form-status';

      // ── Try Formspree first ──
      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ name, email, message })
        });

        if (res.ok) {
          status.textContent = '[SUCCESS] Message transmitted. I\'ll get back to you soon!';
          status.className = 'form-status success';
          form.reset();
        } else {
          // Formspree failed — fall back to mailto
          throw new Error('formspree_failed');
        }
      } catch {
        // ── Fallback: open mailto in email client ──
        status.textContent = '[INFO] Opening your email app to send the message...';
        status.className = 'form-status success';
        setTimeout(() => openMailto(name, email, message), 600);
      } finally {
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Send Message';
      }
    });
  })();

  /* ── 9. GLITCH EFFECT ON HERO NAME ── */
  (function initGlitch() {
    const nameEl = document.getElementById('typed-name');
    if (!nameEl) return;
    setInterval(() => {
      if (!nameEl.textContent) return;
      const orig = nameEl.textContent;
      const glitchChars = '!@#$%^&*<>{}[]';
      let glitched = orig.split('').map(c =>
        c !== ' ' && Math.random() < 0.08
          ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
          : c
      ).join('');
      nameEl.textContent = glitched;
      setTimeout(() => { nameEl.textContent = orig; }, 80);
    }, 3500);
  })();

  /* ── 10. CARD TILT EFFECT ── */
  (function initTilt() {
    document.querySelectorAll('.glass-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `translateY(-4px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  })();

  /* ── 11. DYNAMIC PARTICLE BURST on click ── */
  (function initParticles() {
    document.addEventListener('click', (e) => {
      for (let i = 0; i < 8; i++) {
        const p = document.createElement('span');
        p.style.cssText = `
          position:fixed;left:${e.clientX}px;top:${e.clientY}px;
          width:5px;height:5px;border-radius:50%;
          background:hsl(${130 + Math.random()*50},100%,55%);
          pointer-events:none;z-index:9999;
          transform:translate(-50%,-50%);
          animation:particle-burst .8s ease-out forwards;
          --dx:${(Math.random()-0.5)*80}px;--dy:${(Math.random()-0.5)*80}px;
        `;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 800);
      }
    });

    if (!document.getElementById('particle-style')) {
      const style = document.createElement('style');
      style.id = 'particle-style';
      style.textContent = `
        @keyframes particle-burst {
          0%   { transform:translate(-50%,-50%) scale(1); opacity:1; }
          100% { transform:translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0); opacity:0; }
        }
      `;
      document.head.appendChild(style);
     }
  })();

  /* ── 12. HEX TILE MODALS ── */
  (function initHexModals() {
    const modal    = document.getElementById('hex-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const closeBtn = document.getElementById('modal-close');
    const iconEl   = document.getElementById('modal-icon');
    const tagEl    = document.getElementById('modal-tag');
    const titleEl  = document.getElementById('modal-title');
    const descEl   = document.getElementById('modal-desc');
    const factsEl  = document.getElementById('modal-facts');
    const tagsEl   = document.getElementById('modal-tags');
    if (!modal) return;

    const hexData = {
      CEH: {
        icon: 'CEH', tag: 'Certification',
        title: 'Certified Ethical Hacker',
        desc: 'The Certified Ethical Hacker (CEH) is a globally recognized cybersecurity certification by EC-Council. It validates expertise in identifying vulnerabilities and weaknesses in target systems using the same knowledge, tools, and techniques as malicious hackers — but in a lawful and legitimate manner.',
        facts: [
          'Covers 20 security domains including network security, cryptography, and social engineering',
          'Demonstrates ability to think and act like a hacker to better defend systems',
          'Recognised by top companies like Amazon, Microsoft, IBM, and government agencies',
          'Involves hands-on labs simulating real-world attack and defense scenarios',
          'Tirth earned this credential after completing his Cyber Security internship in Noida',
        ],
        tags: ['EC-Council', 'Ethical Hacking', 'InfoSec', 'Globally Recognised', 'Hands-on Labs'],
      },
      PEN: {
        icon: 'PEN', tag: 'Skill',
        title: 'Penetration Testing',
        desc: 'Penetration Testing (Pentesting) is the practice of simulating cyberattacks against a system, network, or web application to identify exploitable vulnerabilities before malicious actors can. It is a critical component of any robust cybersecurity program.',
        facts: [
          'Performed VAPT (Vulnerability Assessment & Penetration Testing) at Jemistry Info Solutions LLP for 6 months',
          'Conducted network pentests using tools like Nmap, Metasploit, and Burp Suite',
          'Web application testing: SQL Injection, XSS, CSRF, broken authentication and more',
          'Delivered professional security assessment reports with CVSS-scored findings',
          'Follows methodologies like OWASP Top 10, PTES, and NIST cybersecurity frameworks',
        ],
        tags: ['VAPT', 'OWASP', 'Burp Suite', 'Metasploit', 'Nmap', 'Kali Linux'],
      },
      ETH: {
        icon: 'ETH', tag: 'Practice',
        title: 'Ethical Hacking',
        desc: 'Ethical Hacking involves legally breaking into computers and devices to test an organisation\'s defenses. Unlike malicious hackers, ethical hackers have explicit permission from the owner and operate within strict legal and moral boundaries to expose security gaps before criminals do.',
        facts: [
          'Follows full methodology: Reconnaissance → Scanning → Exploitation → Post-Exploitation → Reporting',
          'Expertise in social engineering, phishing simulations, and password cracking techniques',
          'Experience with network sniffing, man-in-the-middle attacks, and privilege escalation',
          'Developed educational tools including a Ransomware Simulator and Keylogger in Python',
          'Adheres strictly to responsible disclosure — always operates with explicit written permission',
        ],
        tags: ['Recon', 'Exploitation', 'Post-Exploitation', 'Responsible Disclosure', 'Python'],
      },
      PY: {
        icon: 'PY', tag: 'Language',
        title: 'Python for Cybersecurity',
        desc: 'Python is the most widely used programming language in cybersecurity due to its simplicity, powerful libraries, and automation capabilities. Tirth uses Python extensively to build security tools, automate repetitive tasks, and develop full-stack web applications with Django.',
        facts: [
          'Built a Password Complexity Checker using Regex pattern matching for strength analysis',
          'Developed a Keylogger Detection Script using Pynput to capture keystrokes and mouse events',
          'Created a Ransomware Simulator using Tkinter UI and Fernet symmetric encryption',
          'Uses Django framework for building robust, scalable web applications',
          'Automates security tasks: port scanning, log parsing, payload generation, and report creation',
        ],
        tags: ['Python 3', 'Django', 'Pynput', 'Cryptography', 'Tkinter', 'Regex', 'Automation'],
      },
      CTF: {
        icon: 'CTF', tag: 'Competition',
        title: 'Capture The Flag',
        desc: 'Capture The Flag (CTF) competitions are cybersecurity challenges where participants solve security puzzles to find hidden "flags". They sharpen real-world hacking skills across web exploitation, cryptography, reverse engineering, binary exploitation, and digital forensics.',
        facts: [
          'CTFs build practical skills that translate directly into professional penetration testing',
          'Categories include: Web Exploitation, Forensics, Cryptography, Pwn (Binary), OSINT, Steganography',
          'Top platforms: HackTheBox, TryHackMe, PicoCTF, CTFtime, and PortSwigger Web Academy',
          'Reinforces tool usage: Wireshark, GDB, John the Ripper, CyberChef, Ghidra, Radare2',
          'Excellent for building a real portfolio and demonstrating problem-solving under pressure',
        ],
        tags: ['HackTheBox', 'TryHackMe', 'Web Exploitation', 'Forensics', 'Cryptography', 'OSINT'],
      },
      SEC: {
        icon: 'SEC', tag: 'Domain',
        title: 'Cybersecurity',
        desc: 'Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks and unauthorised access. As a Cybersecurity Analyst, Tirth focuses on proactively identifying threats and building robust defenses across multiple security domains.',
        facts: [
          'Network Security: Firewalls, IDS/IPS, VPNs, and network traffic analysis with Wireshark',
          'Application Security: Secure coding practices, OWASP guidelines, and code review techniques',
          'Incident Response: Threat detection, log analysis, and digital forensics evidence handling',
          'Cryptography: Symmetric/asymmetric encryption, hashing algorithms, and PKI infrastructure',
          'Compliance: Awareness of ISO 27001, GDPR, and major cybersecurity governance frameworks',
        ],
        tags: ['Network Security', 'AppSec', 'Incident Response', 'Cryptography', 'SIEM', 'Threat Intel'],
      },
    };

    function openModal(key) {
      const data = hexData[key];
      if (!data) return;
      iconEl.textContent  = data.icon;
      tagEl.textContent   = data.tag;
      titleEl.textContent = data.title;
      descEl.textContent  = data.desc;
      factsEl.innerHTML   = data.facts.map(f =>
        `<div class="modal-fact"><span class="modal-fact-dot"></span><span>${f}</span></div>`
      ).join('');
      tagsEl.innerHTML = data.tags.map(t =>
        `<span class="modal-tag-pill">${t}</span>`
      ).join('');
      modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeModal() {
      modal.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-hex]').forEach(hex => {
      hex.addEventListener('click', () => openModal(hex.dataset.hex));
      hex.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(hex.dataset.hex); });
      hex.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      hex.addEventListener('mouseleave',  () => document.body.classList.remove('cursor-hover'));
    });

    closeBtn.addEventListener('click',  closeModal);
    backdrop.addEventListener('click',  closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  })();

})();
