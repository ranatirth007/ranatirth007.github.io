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

  /* ── 12.3 INTERACTIVE SKILLS ── */
  (function initSkills() {
    var skillData = {
      'Ethical Hacking': {
        emoji: '🛡️', pct: 90, color: '#00ff88',
        desc: 'Deep expertise in ethical hacking methodologies — from reconnaissance and enumeration to exploitation and post-exploitation. Trained in real-world attack simulation and red-team operations.',
        tools: ['Kali Linux', 'Metasploit', 'Burp Suite', 'Wireshark', 'Social Engineering Toolkit', 'Aircrack-ng'],
        highlights: ['OWASP Top 10 mastery', 'CTF competitions', 'Bug bounty hunting', 'Red team operations']
      },
      'Penetration Testing': {
        emoji: '🔍', pct: 85, color: '#00ff88',
        desc: 'Hands-on experience in web app, network, API, and mobile penetration testing. Conducted full-scope pentests during VAPT internship at Jemistry Info Solutions.',
        tools: ['Burp Suite Pro', 'Nmap', 'SQLmap', 'Nikto', 'Dirb', 'Hydra'],
        highlights: ['Web App PenTesting', 'Network PenTesting', 'API Security Testing', 'Report Writing']
      },
      'Vulnerability Assessment': {
        emoji: '📋', pct: 80, color: '#00ff88',
        desc: 'Proficient in identifying, classifying, and prioritizing vulnerabilities using industry-standard scanners and manual testing techniques.',
        tools: ['Nessus', 'OpenVAS', 'Qualys', 'OWASP ZAP', 'Acunetix'],
        highlights: ['CVSS scoring', 'Risk assessment reports', 'Compliance checks', 'Remediation planning']
      },
      'Network Security': {
        emoji: '🌐', pct: 75, color: '#00ff88',
        desc: 'Strong foundation in securing network infrastructure — firewalls, IDS/IPS, VPNs, and real-time packet analysis for threat detection.',
        tools: ['Wireshark', 'pfSense', 'Snort', 'tcpdump', 'Nmap', 'Netcat'],
        highlights: ['Firewall configuration', 'Traffic analysis', 'Intrusion detection', 'VPN setup']
      },
      'Python': {
        emoji: '🐍', pct: 85, color: '#00d4ff',
        desc: 'Primary programming language for automation, security tool development, web backends, and scripting. Built multiple security tools and web applications.',
        tools: ['Django', 'Flask', 'Scapy', 'Requests', 'BeautifulSoup', 'Cryptography'],
        highlights: ['Security tool development', 'Web scraping', 'Automation scripts', 'API development']
      },
      'Django': {
        emoji: '🌎', pct: 70, color: '#00d4ff',
        desc: 'Full-stack web development using Django MVT architecture. Built REST APIs, authentication systems, and admin dashboards.',
        tools: ['Django REST Framework', 'Celery', 'PostgreSQL', 'Redis', 'Docker'],
        highlights: ['REST API design', 'User authentication', 'Admin dashboards', 'Template rendering']
      },
      'JavaScript': {
        emoji: '⚡', pct: 65, color: '#00d4ff',
        desc: 'Frontend development with vanilla JS and modern ES6+. Built interactive web interfaces, Chrome extensions, and dynamic portfolio features.',
        tools: ['ES6+', 'DOM APIs', 'Fetch API', 'Chrome Extension APIs', 'Canvas'],
        highlights: ['Interactive UIs', 'Chrome extensions', 'Animation effects', 'Event handling']
      },
      'HTML / CSS': {
        emoji: '🎨', pct: 75, color: '#00d4ff',
        desc: 'Responsive and accessible web design with modern CSS — Flexbox, Grid, animations, glassmorphism effects, and mobile-first layouts.',
        tools: ['Flexbox', 'CSS Grid', 'CSS Animations', 'Media Queries', 'SVG'],
        highlights: ['Responsive design', 'Glassmorphism', 'CSS animations', 'Accessibility']
      },
      'Leadership': {
        emoji: '👑', pct: 90, color: '#ffaa00',
        desc: 'Proven leader — founded Blumonk Digital Services, led campus chapters at Viral Fission, and managed teams during internships.',
        tools: ['Team building', 'Mentoring', 'Conflict resolution', 'Strategic planning'],
        highlights: ['Founded Blumonk', 'Viral Fission Team Leader', 'Managed 10+ teams', 'Public speaking']
      },
      'Communication': {
        emoji: '🗣️', pct: 88, color: '#ffaa00',
        desc: 'Excellent verbal and written communication — client presentations, technical writing, and public speaking.',
        tools: ['Presentations', 'Technical writing', 'Client relations', 'Report writing'],
        highlights: ['Client pitches', 'Security reports', 'Team coordination', 'Workshop delivery']
      },
      'Team Management': {
        emoji: '🤝', pct: 85, color: '#ffaa00',
        desc: 'Experienced in managing cross-functional teams, coordinating events, and driving project delivery through agile methodologies.',
        tools: ['Agile', 'Trello', 'Slack', 'Google Workspace', 'Notion'],
        highlights: ['Event coordination', 'Campaign management', 'Agile sprints', 'Resource allocation']
      },
      'Digital Marketing': {
        emoji: '📈', pct: 80, color: '#ffaa00',
        desc: 'Comprehensive digital marketing expertise gained through running Blumonk Digital Services — SEO, social media, content strategy.',
        tools: ['Google Analytics', 'SEMrush', 'Canva', 'Meta Ads', 'Mailchimp'],
        highlights: ['SEO optimization', 'Social media growth', 'Content strategy', 'Ad campaigns']
      },
      'English': {
        emoji: '🇬🇧', pct: 95, color: '#a78bfa',
        desc: 'Professional and academic fluency in English. Primary language for all professional communication and documentation.',
        tools: [], highlights: ['Professional fluency', 'Technical writing', 'Academic papers', 'Client communication']
      },
      'Gujarati': {
        emoji: '🇮🇳', pct: 98, color: '#a78bfa',
        desc: 'Native Gujarati speaker. Mother tongue used in everyday communication and cultural interactions.',
        tools: [], highlights: ['Native speaker', 'Mother tongue', 'Cultural fluency', 'Regional networking']
      },
      'Hindi': {
        emoji: '🇮🇳', pct: 90, color: '#a78bfa',
        desc: 'Fluent Hindi speaker — used for conversational and professional communication across India.',
        tools: [], highlights: ['Conversational fluency', 'Professional use', 'Pan-India communication']
      },
      'Spanish / German': {
        emoji: '🌍', pct: 35, color: '#a78bfa',
        desc: 'Basic conversational level in Spanish and German. Currently learning through online courses.',
        tools: [], highlights: ['Basic conversation', 'Currently learning', 'Cultural interest']
      }
    };

    // Build and inject skill modal HTML directly
    var modalHTML = '<div id="skill-modal" class="skill-modal" hidden>'
      + '<div class="skill-modal-backdrop" id="skill-m-backdrop"></div>'
      + '<div class="skill-modal-box glass-card">'
      + '<button class="skill-modal-close" id="skill-m-close" aria-label="Close"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg></button>'
      + '<div class="skill-modal-top">'
      + '<div class="skill-ring-wrap"><svg class="skill-ring" viewBox="0 0 120 120"><circle class="skill-ring-bg" cx="60" cy="60" r="52"/><circle class="skill-ring-fill" id="skill-ring-fill" cx="60" cy="60" r="52"/></svg><span class="skill-ring-pct" id="skill-ring-pct">0%</span></div>'
      + '<div class="skill-modal-info"><span class="skill-modal-emoji" id="skill-m-emoji"></span><h3 class="skill-modal-name" id="skill-m-name"></h3></div>'
      + '</div>'
      + '<p class="skill-modal-desc" id="skill-m-desc"></p>'
      + '<div class="skill-modal-tools-wrap" id="skill-m-tools-wrap"><h4 class="skill-modal-label">Tools &amp; Technologies</h4><div class="skill-modal-tools" id="skill-m-tools"></div></div>'
      + '<div><h4 class="skill-modal-label">Key Highlights</h4><div class="skill-modal-highlights" id="skill-m-highlights"></div></div>'
      + '</div></div>';

    var wrapper = document.createElement('div');
    wrapper.innerHTML = modalHTML;
    var modal = wrapper.firstElementChild;
    document.body.appendChild(modal);

    var ringFill = document.getElementById('skill-ring-fill');
    var ringPct  = document.getElementById('skill-ring-pct');
    var circumference = 2 * Math.PI * 52;
    if (ringFill) {
      ringFill.style.strokeDasharray = circumference;
      ringFill.style.strokeDashoffset = circumference;
    }

    function openSkillModal(key) {
      var d = skillData[key];
      if (!d) return;
      document.getElementById('skill-m-emoji').textContent = d.emoji;
      document.getElementById('skill-m-name').textContent = key;
      document.getElementById('skill-m-desc').textContent = d.desc;

      // Ring
      if (ringFill) {
        ringFill.style.transition = 'none';
        ringFill.style.stroke = d.color;
        ringFill.style.strokeDashoffset = circumference;
      }
      ringPct.textContent = '0%';
      modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';

      // Animate ring
      setTimeout(function() {
        if (ringFill) {
          var offset = circumference - (d.pct / 100) * circumference;
          ringFill.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)';
          ringFill.style.strokeDashoffset = offset;
        }
        var cur = 0, target = d.pct, step = Math.ceil(target / 30);
        var iv = setInterval(function() {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(iv); }
          ringPct.textContent = cur + '%';
        }, 35);
      }, 120);

      // Tools
      var toolsW = document.getElementById('skill-m-tools-wrap');
      var toolsEl = document.getElementById('skill-m-tools');
      if (d.tools && d.tools.length) {
        toolsW.style.display = '';
        toolsEl.innerHTML = d.tools.map(function(t) { return '<span class="skill-m-tag">' + t + '</span>'; }).join('');
      } else {
        toolsW.style.display = 'none';
      }

      // Highlights
      document.getElementById('skill-m-highlights').innerHTML = d.highlights.map(function(h) { return '<span class="skill-m-highlight">\u25B9 ' + h + '</span>'; }).join('');
    }

    function closeSkillModal() {
      modal.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }

    // Mark all skill items as clickable with data attribute
    document.querySelectorAll('.skill-item').forEach(function(item) {
      var nameEl = item.querySelector('.skill-name');
      if (!nameEl) return;
      var key = nameEl.textContent.trim();
      if (skillData[key]) {
        item.setAttribute('data-skill', key);
        item.style.cursor = 'pointer';
      }
    });

    // Use document-level event delegation for maximum reliability
    document.addEventListener('click', function(e) {
      // Check if click was on a skill item or inside one
      var skillItem = e.target.closest('[data-skill]');
      if (skillItem) {
        var key = skillItem.getAttribute('data-skill');
        if (key && skillData[key]) {
          openSkillModal(key);
          return;
        }
      }

      // Close button
      if (e.target.closest('#skill-m-close')) {
        closeSkillModal();
        return;
      }

      // Backdrop click
      if (e.target.id === 'skill-m-backdrop') {
        closeSkillModal();
        return;
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeSkillModal();
    });

    // 3D tilt on cards
    document.querySelectorAll('.skill-category').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var rotY = ((x - rect.width/2) / (rect.width/2)) * 8;
        var rotX = ((rect.height/2 - y) / (rect.height/2)) * 8;
        card.style.transform = 'translateY(-6px) scale(1.02) perspective(500px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
      });
    });
  })();

  /* ── 12.5 EXPERIENCE MODAL ── */
  (function initExpModal() {
    const expData = {
      vapt: {
        emoji: '🔍',
        title: 'Cyber Security Intern — VAPT',
        company: 'Jemistry Info Solutions LLP',
        duration: 'Jan 2025 – Jul 2025 · 6 months',
        desc: 'Completed an intensive 6-month internship focused on Vulnerability Assessment & Penetration Testing (VAPT). Worked directly with clients to identify and remediate security flaws across web applications, mobile apps, and network infrastructure.',
        points: [
          'Performed comprehensive web application penetration testing using OWASP Top 10 methodology',
          'Conducted network vulnerability assessments using Nmap, Nessus, and Wireshark',
          'Utilized Burp Suite for intercepting, analyzing, and manipulating HTTP/HTTPS traffic',
          'Identified critical SQL injection, XSS, and CSRF vulnerabilities in client applications',
          'Prepared detailed security assessment reports with risk ratings and remediation recommendations',
          'Collaborated with development teams to implement security patches and validate fixes'
        ],
        tags: ['VAPT', 'Burp Suite', 'Nmap', 'OWASP', 'Network Security', 'Web App PenTest', 'Wireshark', 'Report Writing'],
        link: 'https://www.google.com/search?q=Jemistry+Info+Solutions+LLP',
        linkText: 'Search Jemistry Info Solutions'
      },
      dcsc: {
        emoji: '🔐',
        title: 'DCSC — Drop Certified Security Course',
        company: 'The Drop Organisation',
        duration: 'Certification Program',
        desc: 'Successfully completed the Drop Certified Security Course (DCSC), a rigorous cybersecurity certification from The Drop Organisation covering real-world attack vectors, defense strategies, and incident response.',
        points: [
          'Mastered cybersecurity fundamentals including CIA triad, risk management, and security frameworks',
          'Studied advanced threat intelligence gathering and analysis techniques',
          'Practiced ethical hacking methodologies including reconnaissance, enumeration, and exploitation',
          'Learned industry-standard defensive practices and incident response procedures',
          'Gained hands-on experience with security tools and techniques in lab environments',
          'Earned the official DCSC certification credential'
        ],
        tags: ['DCSC', 'Cybersecurity', 'Threat Intelligence', 'Ethical Hacking', 'Incident Response', 'Security Frameworks'],
        link: 'https://www.google.com/search?q=The+Drop+Organisation+DCSC',
        linkText: 'Search The Drop Organisation'
      },
      internship: {
        emoji: '💻',
        title: 'Cyber Security Intern',
        company: 'Prodigy InfoTech — Noida, India',
        duration: 'Internship Program',
        desc: 'Completed a comprehensive Cyber Security internship at Prodigy InfoTech, gaining hands-on experience with real-world security tools and techniques. Built practical projects including encryption tools, network sniffers, and keylogger detection scripts.',
        points: [
          'Developed a Caesar Cipher encryption/decryption tool for secure message encoding',
          'Built pixel manipulation scripts for image-based steganography techniques',
          'Created a network packet sniffer to capture and analyze network traffic in real-time',
          'Implemented a keylogger detection and monitoring tool using Python and Pynput',
          'Performed vulnerability scanning and threat analysis on test environments',
          'Earned the certified internship completion credential'
        ],
        tags: ['Threat Analysis', 'Vulnerability Scanning', 'Python', 'Network Sniffing', 'Cryptography', 'CEH'],
        link: 'https://github.com/ranatirth007/Cyber-Secutity-internship',
        linkText: 'View Internship Projects on GitHub'
      },
      blumonk: {
        emoji: '🚀',
        title: 'Founder & CEO',
        company: 'Blumonk Digital Services',
        duration: 'Entrepreneurship',
        desc: 'Founded and led Blumonk Digital Services, a full-service digital agency providing web development, digital marketing, and creative solutions to businesses. Managed all aspects of the company from client acquisition to project delivery.',
        points: [
          'Founded the company from scratch, building brand identity and market positioning',
          'Managed end-to-end client relationships and project lifecycle',
          'Led a team of designers, developers, and marketers to deliver client projects',
          'Developed digital marketing strategies including SEO, social media, and content marketing',
          'Handled business development, proposals, pricing, and contract negotiations',
          'Grew the client base through networking, referrals, and online presence'
        ],
        tags: ['Leadership', 'Digital Marketing', 'Business Development', 'Web Development', 'SEO', 'Team Management'],
        link: 'https://www.google.com/search?q=Blumonk+Digital+Services',
        linkText: 'Search Blumonk Digital'
      },
      viral: {
        emoji: '🏆',
        title: 'Team Leader',
        company: 'Viral Fission',
        duration: 'Leadership Role',
        desc: 'Led the campus chapter of Viral Fission, India\'s largest student marketing network. Organized events, coordinated campaigns, managed a team of ambassadors, and drove community engagement across the campus.',
        points: [
          'Led and mentored a team of campus ambassadors for marketing campaigns',
          'Organized and executed campus events, workshops, and brand activations',
          'Coordinated with brand partners to execute promotional strategies',
          'Drove community engagement through social media and grassroots outreach',
          'Developed strong decision-making, public speaking, and communication skills',
          'Recognized as a top-performing campus leader in the region'
        ],
        tags: ['Team Management', 'Event Coordination', 'Community Building', 'Marketing', 'Public Speaking', 'Campus Leadership'],
        link: 'https://www.viralfission.com/',
        linkText: 'Visit Viral Fission Website'
      }
    };

    const modal     = document.getElementById('exp-modal');
    const backdrop  = document.getElementById('exp-modal-backdrop');
    const closeBtn  = document.getElementById('exp-modal-close');
    const mEmoji    = document.getElementById('exp-m-emoji');
    const mTitle    = document.getElementById('exp-m-title');
    const mCompany  = document.getElementById('exp-m-company');
    const mDuration = document.getElementById('exp-m-duration');
    const mDesc     = document.getElementById('exp-m-desc');
    const mPoints   = document.getElementById('exp-m-points');
    const mTags     = document.getElementById('exp-m-tags');
    const mLink     = document.getElementById('exp-m-link');
    const mLinkText = document.getElementById('exp-m-link-text');
    if (!modal) return;

    function openExpModal(key) {
      const d = expData[key];
      if (!d) return;
      mEmoji.textContent = d.emoji;
      mTitle.textContent = d.title;
      mCompany.textContent = d.company;
      mDuration.textContent = d.duration;
      mDesc.textContent = d.desc;
      mPoints.innerHTML = d.points.map(p => `<p class="exp-modal-point">${p}</p>`).join('');
      mTags.innerHTML = d.tags.map(t => `<span>${t}</span>`).join('');
      mLink.href = d.link;
      mLinkText.textContent = d.linkText;
      modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
    }
    function closeExpModal() {
      modal.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.tl-clickable').forEach(card => {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = card.closest('[data-exp]');
        if (item) openExpModal(item.dataset.exp);
      });
    });
    closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeExpModal(); });
    backdrop.addEventListener('click', closeExpModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeExpModal(); });

    // Prevent clicks on the link inside modal from closing
    mLink.addEventListener('click', e => e.stopPropagation());
  })();

  /* ── 13. CERT LIGHTBOX + COUNTER ── */
  (function initCerts() {
    const lb       = document.getElementById('cert-lightbox');
    const lbImg    = document.getElementById('cert-lb-img');
    const lbClose  = document.getElementById('cert-lb-close');
    const lbBg     = document.getElementById('cert-lb-backdrop');
    const lbPrev   = document.getElementById('cert-lb-prev');
    const lbNext   = document.getElementById('cert-lb-next');
    const lbCount  = document.getElementById('cert-lb-counter');
    if (!lb) return;

    // Collect all unique cert image sources
    const allImgs = [];
    document.querySelectorAll('.cert-img:not([aria-hidden])').forEach(img => {
      allImgs.push(img.src);
    });
    let currentIdx = 0;

    function openLb(idx) {
      currentIdx = idx;
      lbImg.src = allImgs[currentIdx];
      lbCount.textContent = `${currentIdx + 1} / ${allImgs.length}`;
      lb.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
    }
    function closeLb() {
      lb.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }
    function showPrev() {
      currentIdx = (currentIdx - 1 + allImgs.length) % allImgs.length;
      lbImg.src = allImgs[currentIdx];
      lbCount.textContent = `${currentIdx + 1} / ${allImgs.length}`;
    }
    function showNext() {
      currentIdx = (currentIdx + 1) % allImgs.length;
      lbImg.src = allImgs[currentIdx];
      lbCount.textContent = `${currentIdx + 1} / ${allImgs.length}`;
    }

    // Attach click to each cert image
    document.querySelectorAll('.cert-img').forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        const src = img.src;
        const idx = allImgs.findIndex(s => s === src);
        openLb(idx >= 0 ? idx : 0);
      });
    });

    lbClose.addEventListener('click', closeLb);
    lbBg.addEventListener('click', closeLb);
    lbPrev.addEventListener('click', showPrev);
    lbNext.addEventListener('click', showNext);
    document.addEventListener('keydown', e => {
      if (!lb.hasAttribute('hidden')) {
        if (e.key === 'Escape') closeLb();
        if (e.key === 'ArrowLeft')  showPrev();
        if (e.key === 'ArrowRight') showNext();
      }
    });

    // Animated counter (count up on scroll)
    const counter = document.querySelector('.cert-count-num');
    if (counter) {
      let counted = false;
      const target = parseInt(counter.textContent, 10);
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !counted) {
            counted = true;
            let current = 0;
            const step = Math.ceil(target / 40);
            const interval = setInterval(() => {
              current += step;
              if (current >= target) {
                current = target;
                clearInterval(interval);
              }
              counter.textContent = current;
            }, 30);
          }
        });
      }, { threshold: 0.5 });
      io.observe(counter);
    }
  })();

})();
