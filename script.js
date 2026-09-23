// ── Scroll reveal ──
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); }),
      {threshold:0.06, rootMargin:'0px 0px -24px 0px'}
    );
    document.querySelectorAll('.reveal,.project-row,.exp-card,.timeline-item').forEach(el => obs.observe(el));
    document.querySelectorAll('.project-row').forEach((r,i)  => r.style.transitionDelay = (i*0.06)+'s');
    document.querySelectorAll('.exp-card').forEach((c,i)     => c.style.transitionDelay = (i*0.08)+'s');
    document.querySelectorAll('.timeline-item').forEach((c,i) => c.style.transitionDelay = (i*0.1)+'s');

    // ── Nav shrink + active section highlight ──
    const nav     = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-links a[data-section]');
    const sections = ['about','projects','education','experience','contact'].map(id => document.getElementById(id));

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      nav.style.padding = y > 50 ? '13px 52px' : '20px 52px';

      // Back to top
      const btn = document.getElementById('back-to-top');
      if (y > 400) btn.classList.add('visible');
      else btn.classList.remove('visible');

      // Active nav
      let current = '';
      sections.forEach(sec => {
        if (sec && y >= sec.offsetTop - 160) current = sec.id;
      });
      navLinks.forEach(a => {
        a.classList.toggle('active', a.dataset.section === current);
      });
    });

    // ── Telegram visitor notification ──
    async function notifyVisitor() {
      const token  = '8701595579:AAGbzDph0qokxwsoAOCt-JcAazVEUrEqqko';
      const chatId = '5349931508';

      // Get location info
      let country = 'Unknown', city = 'Unknown';
      try {
        const geo = await fetch('https://ipapi.co/json/');
        const gd  = await geo.json();
        country = gd.country_name || 'Unknown';
        city    = gd.city         || 'Unknown';
      } catch(e) {}

      const device = /Mobi|Android/i.test(navigator.userAgent) ? '📱 Mobile' : '🖥️ Desktop';
      const now    = new Date().toLocaleString('en-GB', {timeZone:'Europe/Oslo', hour:'2-digit', minute:'2-digit', day:'2-digit', month:'short'});
      const page   = window.location.hostname || 'portfolio';
      const lang   = navigator.language || 'Unknown';

      const msg = `👤 *New visitor on your portfolio!*

🌍 Country: ${country}
🏙️ City: ${city}
${device}
🌐 Language: ${lang}
🕐 Time: ${now}
🔗 Page: ${page}`;

      try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({chat_id: chatId, text: msg, parse_mode: 'Markdown'})
        });

        // Show toast confirmation
        const toast = document.getElementById('visitor-toast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
      } catch(e) {
        console.log('Notification skipped');
      }
    }

    // Fire after 1.5s so it doesn't slow down page load
    setTimeout(notifyVisitor, 1500);
