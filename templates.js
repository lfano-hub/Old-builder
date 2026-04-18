// ── TEMPLATE DEFINITIONS ──────────────────
const TEMPLATES = {
  'blank': [],

  'personal-brand': [
    { type: 'navbar',   content: { logo: 'Your Name', links: ['Work', 'About', 'Contact'], btn: 'Hire Me' } },
    { type: 'hero',     content: { h1: 'Hi, I\'m [Your Name]', p: 'Designer · Developer · Creator. I build things people love to use.', btn: 'See My Work' } },
    { type: 'text',     content: { h2: 'About Me', p: 'Tell your story here. Where you\'re from, what you do, what you care about. Keep it real and keep it you.' } },
    { type: 'columns',  content: { col1h: 'Design', col1p: 'Clean, thoughtful, and made to last.', col2h: 'Development', col2p: 'Fast, accessible, and built right.' } },
    { type: 'testimonials', content: {} },
    { type: 'footer',   content: { logo: 'Your Name', copy: '© 2026 Your Name' } }
  ],

  'local-business': [
    { type: 'navbar',   content: { logo: 'My Business', links: ['Services', 'About', 'Contact'], btn: 'Book Now' } },
    { type: 'hero',     content: { h1: 'Welcome to My Business', p: 'We\'re here to help. Quality service, friendly team, and results you can count on.', btn: 'Get In Touch' } },
    { type: 'columns',  content: { col1h: 'Our Service', col1p: 'We take pride in what we do and bring care to every job.', col2h: 'Why Us', col2p: 'Local, trusted, and focused on your satisfaction.' } },
    { type: 'text',     content: { h2: 'About Us', p: 'We\'re a local business that cares about our community. Add your story here — who you are, what you do, and why it matters.' } },
    { type: 'cta',      content: { h2: 'Ready to work together?', p: 'Reach out today and let\'s get started.', btn: 'Contact Us' } },
    { type: 'footer',   content: { logo: 'My Business', copy: '© 2026 My Business' } }
  ],

  'online-store': [
    { type: 'navbar',   content: { logo: 'My Store', links: ['Shop', 'About', 'Contact'], btn: 'Cart (0)' } },
    { type: 'hero',     content: { h1: 'Shop Our Collection', p: 'Handpicked products made with care. Free shipping on orders over $50.', btn: 'Shop Now' } },
    { type: 'columns',  content: { col1h: 'New Arrivals', col1p: 'Fresh styles added every week. Be the first to shop.', col2h: 'Best Sellers', col2p: 'The products our customers love most.' } },
    { type: 'gallery',  content: { title: 'Featured Products' } },
    { type: 'cta',      content: { h2: 'Join our community', p: 'Sign up for early access, exclusive deals, and new arrivals.', btn: 'Subscribe Free' } },
    { type: 'footer',   content: { logo: 'My Store', copy: '© 2026 My Store. All rights reserved.' } }
  ],

  'portfolio': [
    { type: 'navbar',   content: { logo: 'Portfolio', links: ['Work', 'About', 'Contact'], btn: 'Hire Me' } },
    { type: 'hero',     content: { h1: 'Creative work that speaks for itself', p: 'I design and build digital experiences. Scroll down to see what I\'ve made.', btn: 'View Work' } },
    { type: 'gallery',  content: { title: 'Selected Work' } },
    { type: 'testimonials', content: {} },
    { type: 'cta',      content: { h2: 'Let\'s work together', p: 'I\'m available for freelance and full-time roles.', btn: 'Get In Touch' } },
    { type: 'footer',   content: { logo: 'Portfolio', copy: '© 2026. All rights reserved.' } }
  ],

  'event': [
    { type: 'hero',     content: { h1: 'You\'re Invited', p: 'Join us for an unforgettable evening. Date · Location · 7:00 PM', btn: 'RSVP Now' } },
    { type: 'text',     content: { h2: 'About the Event', p: 'Tell people what this event is about, why they should come, and what to expect. Keep it exciting and clear.' } },
    { type: 'columns',  content: { col1h: '📍 Location', col1p: '123 Main Street, Your City. Doors open at 6:30 PM.', col2h: '🎟 Tickets', col2p: 'Free entry with RSVP. Limited spots available.' } },
    { type: 'cta',      content: { h2: 'Don\'t miss out', p: 'Spots are limited. Reserve yours today.', btn: 'RSVP Free' } }
  ],

  'restaurant': [
    { type: 'navbar',   content: { logo: 'The Table', links: ['Menu', 'About', 'Reserve'], btn: 'Book a Table' } },
    { type: 'hero',     content: { h1: 'Food made with love, served with heart.', p: 'Fresh ingredients. Real flavors. A dining experience worth coming back for.', btn: 'See Our Menu' } },
    { type: 'columns',  content: { col1h: '🍳 Made Fresh Daily', col1p: 'Every dish is prepared from scratch with locally sourced ingredients.', col2h: '📍 Find Us', col2p: '123 Main Street — Open Mon–Sun, 11am to 10pm.' } },
    { type: 'gallery',  content: { title: 'From Our Kitchen' } },
    { type: 'text',     content: { h2: 'Our Story', p: 'We started with one kitchen, one menu, and one simple belief: great food brings people together. Add your story here.' } },
    { type: 'cta',      content: { h2: 'Ready for a table?', p: 'Reservations open 7 days a week. Walk-ins always welcome.', btn: 'Reserve Now' } },
    { type: 'footer',   content: { logo: 'The Table', copy: '© 2026 The Table. Good food, always.' } }
  ],

  'saas': [
    { type: 'navbar',   content: { logo: 'AppName', links: ['Features', 'Pricing', 'Docs'], btn: 'Get Started Free' } },
    { type: 'hero',     content: { h1: 'The tool that actually gets out of your way.', p: 'Built for speed. Loved by teams. AppName helps you ship faster and stress less.', btn: 'Try It Free' } },
    { type: 'columns',  content: { col1h: '⚡ Blazing Fast', col1p: 'Built for performance — loads instantly and stays out of your way.', col2h: '🔒 Secure by Default', col2p: 'Enterprise-grade security baked in from day one.' } },
    { type: 'testimonials', content: {} },
    { type: 'pricing',  content: {} },
    { type: 'cta',      content: { h2: 'Start free, scale when ready.', p: 'No credit card. No commitment. Just results.', btn: 'Get Started Free' } },
    { type: 'footer',   content: { logo: 'AppName', copy: '© 2026 AppName, Inc.' } }
  ],

  'link-in-bio': [
    { type: 'hero',     content: { h1: '@YourUsername', p: 'Creator · Writer · Maker. Here\'s everything I\'m working on.', btn: 'Follow Me' } },
    { type: 'columns',  content: { col1h: '🔗 My Latest', col1p: 'New video just dropped — watch here.', col2h: '📬 Newsletter', col2p: 'Join 1,200+ readers every Sunday morning.' } },
    { type: 'cta',      content: { h2: 'Let\'s connect', p: 'DMs open. Collabs welcome. Always down to chat.', btn: 'Send a Message' } }
  ],

  'coaching': [
    { type: 'navbar',   content: { logo: 'Coach Name', links: ['About', 'Services', 'Contact'], btn: 'Book a Call' } },
    { type: 'hero',     content: { h1: 'You already have what it takes. Let\'s unlock it.', p: '1-on-1 coaching for people ready to stop overthinking and start building.', btn: 'Book a Free Call' } },
    { type: 'text',     content: { h2: 'My Approach', p: 'I\'ve worked with 200+ clients to help them get unstuck, gain clarity, and take action. No fluff — just a plan that works for you.' } },
    { type: 'columns',  content: { col1h: '🎯 Clarity Sessions', col1p: 'Cut through the noise and define exactly what you\'re building toward.', col2h: '📈 Accountability', col2p: 'Weekly check-ins to keep momentum going.' } },
    { type: 'testimonials', content: {} },
    { type: 'cta',      content: { h2: 'Ready to make moves?', p: 'Your first call is free. Let\'s see if we\'re a good fit.', btn: 'Book a Free Call' } },
    { type: 'footer',   content: { logo: 'Coach Name', copy: '© 2026 Coach Name' } }
  ],

  'coming-soon': [
    { type: 'hero',     content: { h1: 'Something big is coming.', p: 'We\'re putting the finishing touches on something you\'re going to love. Drop your email and be first to know.', btn: 'Notify Me' } },
    { type: 'cta',      content: { h2: 'Stay in the loop.', p: 'No spam. Just one email when we launch.', btn: 'Get Early Access' } }
  ],

  'wedding': [
    { type: 'hero',     content: { h1: 'Jamie & Alex', p: 'Saturday, September 20th, 2026 · The Garden Estate · 4:00 PM', btn: 'RSVP Now' } },
    { type: 'columns',  content: { col1h: '💍 The Ceremony', col1p: 'The Garden Estate, 45 Rosewood Lane. Ceremony begins at 4:00 PM sharp.', col2h: '🥂 The Reception', col2p: 'Cocktail hour at 5:30 PM. Dinner and dancing to follow until midnight.' } },
    { type: 'text',     content: { h2: 'Our Story', p: 'We met on a Tuesday. Four years, two dogs, and one apartment later — here we are. We can\'t wait to celebrate with you.' } },
    { type: 'gallery',  content: { title: 'Moments Together' } },
    { type: 'cta',      content: { h2: 'Will you be there?', p: 'Kindly respond by August 1st, 2026.', btn: 'RSVP Here' } },
    { type: 'footer',   content: { logo: 'Jamie & Alex', copy: '09.20.2026 — forever starts here.' } }
  ],

  'podcast': [
    { type: 'navbar',   content: { logo: 'The Podcast', links: ['Episodes', 'About', 'Subscribe'], btn: 'Listen Now' } },
    { type: 'hero',     content: { h1: 'Real conversations. No filter.', p: 'Weekly episodes with founders, creators, and thinkers you should know about.', btn: 'Listen to Latest Episode' } },
    { type: 'columns',  content: { col1h: '🎙 New Every Week', col1p: 'Fresh episodes every Monday morning — subscribe and never miss one.', col2h: '📲 Everywhere You Listen', col2p: 'Apple Podcasts, Spotify, YouTube, and anywhere else you get your shows.' } },
    { type: 'testimonials', content: {} },
    { type: 'cta',      content: { h2: 'Never miss an episode.', p: 'Subscribe on your favorite platform and join 10,000+ listeners.', btn: 'Subscribe Free' } },
    { type: 'footer',   content: { logo: 'The Podcast', copy: '© 2026 The Podcast. New episodes weekly.' } }
  ],

  'photography': [
    { type: 'navbar',   content: { logo: 'Jane Doe Photo', links: ['Portfolio', 'About', 'Book'], btn: 'Book a Session' } },
    { type: 'hero',     content: { h1: 'Moments worth keeping forever.', p: 'Portrait, wedding, and lifestyle photography based in [Your City].', btn: 'View Portfolio' } },
    { type: 'gallery',  content: { title: 'Recent Work' } },
    { type: 'text',     content: { h2: 'About Me', p: 'I\'ve been photographing real moments for over 8 years. I believe the best photos happen when people forget the camera is there.' } },
    { type: 'columns',  content: { col1h: '📸 Portraits', col1p: 'Personal branding, headshots, and lifestyle sessions.', col2h: '💍 Weddings', col2p: 'Full-day wedding coverage with natural, editorial style.' } },
    { type: 'cta',      content: { h2: 'Let\'s make something beautiful.', p: 'Limited availability — book your session early.', btn: 'Book a Session' } },
    { type: 'footer',   content: { logo: 'Jane Doe Photo', copy: '© 2026 Jane Doe Photography' } }
  ]
};

// ── APPLY TEMPLATE CONTENT ────────────────
function applyContent(blockEl, type, content) {
  if (!content || Object.keys(content).length === 0) return;

  if (type === 'navbar') {
    const logo  = blockEl.querySelector('.nb-logo');
    const links = blockEl.querySelectorAll('.nb-link');
    const btn   = blockEl.querySelector('.nb-btn');
    if (logo && content.logo)  logo.textContent = content.logo;
    if (btn  && content.btn)   btn.textContent  = content.btn;
    if (links && content.links) {
      links.forEach((el, i) => { if (content.links[i]) el.textContent = content.links[i]; });
    }
  }
  if (type === 'hero') {
    const h1  = blockEl.querySelector('h1');
    const p   = blockEl.querySelector('p');
    const btn = blockEl.querySelector('button');
    if (h1  && content.h1)  h1.textContent  = content.h1;
    if (p   && content.p)   p.textContent   = content.p;
    if (btn && content.btn) btn.textContent = content.btn;
  }
  if (type === 'text') {
    const h2 = blockEl.querySelector('h2');
    const p  = blockEl.querySelector('p');
    if (h2 && content.h2) h2.textContent = content.h2;
    if (p  && content.p)  p.textContent  = content.p;
  }
  if (type === 'columns') {
    const headings = blockEl.querySelectorAll('h3');
    const paras    = blockEl.querySelectorAll('p');
    if (headings[0] && content.col1h) headings[0].textContent = content.col1h;
    if (paras[0]    && content.col1p) paras[0].textContent    = content.col1p;
    if (headings[1] && content.col2h) headings[1].textContent = content.col2h;
    if (paras[1]    && content.col2p) paras[1].textContent    = content.col2p;
  }
  if (type === 'cta') {
    const h2  = blockEl.querySelector('h2');
    const p   = blockEl.querySelector('p');
    const btn = blockEl.querySelector('.cta-btn');
    if (h2  && content.h2)  h2.textContent  = content.h2;
    if (p   && content.p)   p.textContent   = content.p;
    if (btn && content.btn) btn.textContent = content.btn;
  }
  if (type === 'gallery') {
    const h2 = blockEl.querySelector('h2');
    if (h2 && content.title) h2.textContent = content.title;
  }
  if (type === 'footer') {
    const logo = blockEl.querySelector('.footer-logo');
    const copy = blockEl.querySelector('.footer-copy');
    if (logo && content.logo) logo.textContent = content.logo;
    if (copy && content.copy) copy.textContent = content.copy;
  }
}

// ── SAVE TEMPLATE CHOICE & GO TO EDITOR ──
function useTemplate(templateKey) {
  localStorage.setItem('trellis_template', templateKey);
  // Clear any existing project so editor loads the template fresh
  localStorage.removeItem('trellis_project');
  window.location.href = 'editor.html?template=' + templateKey;
}

// ── FILTER ────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.template-card').forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

// ── CARD & BUTTON CLICKS ──────────────────
document.querySelectorAll('.template-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    useTemplate(btn.dataset.template);
  });
});

document.querySelectorAll('.template-card').forEach(card => {
  card.addEventListener('click', () => useTemplate(card.dataset.template));
});

// ── SKIP TO BLANK CANVAS ──────────────────
document.getElementById('skipTemplateBtn').addEventListener('click', () => {
  localStorage.removeItem('trellis_project');
  window.location.href = 'editor.html?template=blank';
});