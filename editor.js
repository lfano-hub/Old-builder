const canvas            = document.getElementById('canvas');
const canvasEmpty       = document.getElementById('canvasEmpty');
const propertiesPanel   = document.getElementById('propertiesPanel');
const propertiesContent = document.getElementById('propertiesContent');
const saveStatus        = document.getElementById('saveStatus');
const projectNameInput  = document.getElementById('projectName');

let selectedBlock = null;
let blockCount    = 0;
let saveTimer     = null;
const STORAGE_KEY = 'trellis_project';

// ── BLOCK TEMPLATES ───────────────────────
const blockTemplates = {
  navbar: () => `
    <div class="block-navbar">
      <div class="nb-logo" contenteditable="true" spellcheck="false">Trellis</div>
      <div class="nb-links">
        <span class="nb-link" contenteditable="true" spellcheck="false">Features</span>
        <span class="nb-link" contenteditable="true" spellcheck="false">Pricing</span>
        <span class="nb-link" contenteditable="true" spellcheck="false">About</span>
      </div>
      <button class="nb-btn" contenteditable="true" spellcheck="false">Get Started</button>
    </div>`,

  hero: () => `
    <div class="block-hero">
      <h1 contenteditable="true" spellcheck="false">Welcome to your site</h1>
      <p contenteditable="true" spellcheck="false">A simple, beautiful starting point. Click to edit.</p>
      <button class="hero-cta-mock">Get Started</button>
    </div>`,

  text: () => `
    <div class="block-text">
      <h2 contenteditable="true" spellcheck="false">Section Title</h2>
      <p contenteditable="true" spellcheck="false">Add your content here. Click to start editing and make it your own.</p>
    </div>`,

  image: () => `
    <div class="block-image" data-uploaded="false">
      <input type="file" class="image-file-input" accept="image/*" style="display:none">
      <div class="image-placeholder">
        <div class="image-upload-icon">🖼</div>
        <div class="image-upload-label">Click to upload image</div>
        <div class="image-upload-sub">PNG, JPG, GIF, WebP</div>
      </div>
    </div>`,

  gallery: () => `
    <div class="block-gallery">
      <div class="gallery-label">Gallery</div>
      <h2 contenteditable="true" spellcheck="false">Our Work</h2>
      <div class="gallery-grid">
        ${[1,2,3,4,5,6].map(i => `
        <div class="gallery-item">
          <span class="gallery-item-icon">🖼</span>
          <span>Image ${i}</span>
        </div>`).join('')}
      </div>
    </div>`,

  columns: () => `
    <div class="block-columns">
      <div class="col-item">
        <h3 contenteditable="true" spellcheck="false">Feature One</h3>
        <p contenteditable="true" spellcheck="false">Describe this feature clearly and concisely.</p>
      </div>
      <div class="col-item">
        <h3 contenteditable="true" spellcheck="false">Feature Two</h3>
        <p contenteditable="true" spellcheck="false">Describe this feature clearly and concisely.</p>
      </div>
    </div>`,

  testimonials: () => `
    <div class="block-testimonials">
      <div class="testimonials-label">What people say</div>
      <h2 contenteditable="true" spellcheck="false">Loved by our users</h2>
      <div class="testimonials-grid">
        ${[
          { q: 'This is the easiest way to build a website I have ever used. Absolutely love it.', name: 'Sarah K.', role: 'Designer', init: 'S' },
          { q: 'We launched our product page in under an hour. The export feature is a game changer.', name: 'Mark T.', role: 'Founder', init: 'M' },
          { q: 'Clean, fast, and intuitive. Exactly what I was looking for to get online quickly.', name: 'Priya M.', role: 'Developer', init: 'P' }
        ].map(t => `
        <div class="testimonial-card">
          <div class="testimonial-quote" contenteditable="true" spellcheck="false">${t.q}</div>
          <div class="testimonial-author">
            <div class="testimonial-avatar">${t.init}</div>
            <div>
              <div class="testimonial-name" contenteditable="true" spellcheck="false">${t.name}</div>
              <div class="testimonial-role" contenteditable="true" spellcheck="false">${t.role}</div>
            </div>
          </div>
        </div>`).join('')}
      </div>
    </div>`,

  cta: () => `
    <div class="block-cta">
      <h2 contenteditable="true" spellcheck="false">Ready to get started?</h2>
      <p contenteditable="true" spellcheck="false">Join thousands of people already using Trellis.</p>
      <button class="cta-btn" contenteditable="true" spellcheck="false">Get Started Free</button>
    </div>`,

  footer: () => `
    <div class="block-footer">
      <div class="footer-logo" contenteditable="true" spellcheck="false">Your<span>Brand</span></div>
      <div class="footer-links">
        <span class="footer-link" contenteditable="true" spellcheck="false">Privacy</span>
        <span class="footer-link" contenteditable="true" spellcheck="false">Terms</span>
        <span class="footer-link" contenteditable="true" spellcheck="false">Contact</span>
      </div>
      <div class="footer-copy" contenteditable="true" spellcheck="false">© 2026 Your Brand</div>
    </div>`,

  divider: () => `<div class="block-divider"><hr></div>`,

  'product-grid': () => `
    <div class="block-product-grid">
      <div class="pg-label">Shop</div>
      <h2 contenteditable="true" spellcheck="false">Featured Products</h2>
      <div class="product-grid">
        ${[
          { emoji: '👟', name: 'Product Name', desc: 'Short product description goes here.', price: '$29.00' },
          { emoji: '👜', name: 'Product Name', desc: 'Short product description goes here.', price: '$49.00' },
          { emoji: '🎧', name: 'Product Name', desc: 'Short product description goes here.', price: '$99.00' }
        ].map(p => `
        <div class="product-card">
          <div class="product-img">${p.emoji}</div>
          <div class="product-info">
            <div class="product-name" contenteditable="true" spellcheck="false">${p.name}</div>
            <div class="product-desc" contenteditable="true" spellcheck="false">${p.desc}</div>
            <div class="product-footer">
              <div class="product-price" contenteditable="true" spellcheck="false">${p.price}</div>
              <button class="product-buy-btn" contenteditable="true" spellcheck="false">Add to Cart</button>
            </div>
          </div>
        </div>`).join('')}
      </div>
    </div>`,

  pricing: () => `
    <div class="block-pricing">
      <div class="pricing-label">Pricing</div>
      <h2 contenteditable="true" spellcheck="false">Simple, honest pricing</h2>
      <div class="pricing-sub" contenteditable="true" spellcheck="false">No hidden fees. Cancel anytime.</div>
      <div class="pricing-grid">
        <div class="pricing-tier">
          <div class="pricing-tier-name" contenteditable="true" spellcheck="false">Free</div>
          <div class="pricing-amount" contenteditable="true" spellcheck="false">$0</div>
          <div class="pricing-period" contenteditable="true" spellcheck="false">forever</div>
          <ul class="pricing-features">
            <li class="pricing-feature" contenteditable="true" spellcheck="false">1 project</li>
            <li class="pricing-feature" contenteditable="true" spellcheck="false">Basic blocks</li>
            <li class="pricing-feature" contenteditable="true" spellcheck="false">Export HTML</li>
          </ul>
          <button class="pricing-cta-btn outline" contenteditable="true" spellcheck="false">Get Started</button>
        </div>
        <div class="pricing-tier featured">
          <div class="pricing-featured-badge">Most Popular</div>
          <div class="pricing-tier-name" contenteditable="true" spellcheck="false">Pro</div>
          <div class="pricing-amount" contenteditable="true" spellcheck="false">$19</div>
          <div class="pricing-period" contenteditable="true" spellcheck="false">per month</div>
          <ul class="pricing-features">
            <li class="pricing-feature" contenteditable="true" spellcheck="false">Unlimited projects</li>
            <li class="pricing-feature" contenteditable="true" spellcheck="false">All block types</li>
            <li class="pricing-feature" contenteditable="true" spellcheck="false">Custom domain</li>
            <li class="pricing-feature" contenteditable="true" spellcheck="false">Priority support</li>
          </ul>
          <button class="pricing-cta-btn filled" contenteditable="true" spellcheck="false">Start Free Trial</button>
        </div>
        <div class="pricing-tier">
          <div class="pricing-tier-name" contenteditable="true" spellcheck="false">Team</div>
          <div class="pricing-amount" contenteditable="true" spellcheck="false">$49</div>
          <div class="pricing-period" contenteditable="true" spellcheck="false">per month</div>
          <ul class="pricing-features">
            <li class="pricing-feature" contenteditable="true" spellcheck="false">Everything in Pro</li>
            <li class="pricing-feature" contenteditable="true" spellcheck="false">5 team members</li>
            <li class="pricing-feature" contenteditable="true" spellcheck="false">Analytics</li>
            <li class="pricing-feature" contenteditable="true" spellcheck="false">White label</li>
          </ul>
          <button class="pricing-cta-btn outline" contenteditable="true" spellcheck="false">Contact Sales</button>
        </div>
      </div>
    </div>`,

  'buy-button': () => `
    <div class="block-buy-button">
      <div class="buy-button-left">
        <div class="buy-button-title" contenteditable="true" spellcheck="false">Product Name</div>
        <div class="buy-button-desc"  contenteditable="true" spellcheck="false">One-line description of what they're getting.</div>
      </div>
      <div class="buy-button-right">
        <div class="buy-button-price"  contenteditable="true" spellcheck="false">$29.00</div>
        <button class="buy-button-action" contenteditable="true" spellcheck="false">Buy Now</button>
      </div>
    </div>`,

  spacer: () => `<div class="block-spacer">· · ·</div>`,

  faq: () => `
    <div class="block-faq">
      <h2 contenteditable="true" spellcheck="false">Frequently Asked Questions</h2>
      ${[
        { q: 'How do I get started?', a: 'Just pick a template and start editing. No account needed — everything saves right in your browser.' },
        { q: 'Is it really free?', a: 'Yes, free to start. No credit card required. Upgrade when you need more.' },
        { q: 'Can I use my own domain?', a: 'Yes! Once you export or publish, you can point any custom domain to your site.' }
      ].map(({q,a}) => `
      <div class="faq-item">
        <div class="faq-q" contenteditable="true" spellcheck="false">${q}</div>
        <div class="faq-a" contenteditable="true" spellcheck="false">${a}</div>
      </div>`).join('')}
    </div>`,

  features: () => `
    <div class="block-features">
      <div class="feat-label">Why Trellis</div>
      <h2 contenteditable="true" spellcheck="false">Everything you need, nothing you don't</h2>
      <div class="feat-sub" contenteditable="true" spellcheck="false">Built for speed and simplicity. No bloat.</div>
      <div class="features-grid">
        ${[
          { icon: '⚡', title: 'Fast', desc: 'Loads instantly on any device or connection.' },
          { icon: '🎨', title: 'Beautiful', desc: 'Professional templates designed to impress.' },
          { icon: '🔒', title: 'Secure', desc: 'Your data stays safe. Always.' },
          { icon: '📱', title: 'Mobile Ready', desc: 'Looks perfect on phones, tablets, and desktops.' },
          { icon: '🛠', title: 'Customizable', desc: 'Every block, color, and font is editable.' },
          { icon: '🚀', title: 'Export Anywhere', desc: 'One-click download to HTML. Host it anywhere.' }
        ].map(f => `
        <div class="feature-card">
          <div class="feature-icon">${f.icon}</div>
          <div class="feature-title" contenteditable="true" spellcheck="false">${f.title}</div>
          <div class="feature-desc" contenteditable="true" spellcheck="false">${f.desc}</div>
        </div>`).join('')}
      </div>
    </div>`,

  stats: () => `
    <div class="block-stats">
      <h2 contenteditable="true" spellcheck="false">The numbers speak for themselves</h2>
      <div class="stats-grid">
        ${[
          { num: '10K+', label: 'Happy Users' },
          { num: '98%', label: 'Satisfaction Rate' },
          { num: '2 min', label: 'Avg Build Time' },
          { num: '$0', label: 'To Get Started' }
        ].map(s => `
        <div class="stat-item">
          <div class="stat-number" contenteditable="true" spellcheck="false">${s.num}</div>
          <div class="stat-label" contenteditable="true" spellcheck="false">${s.label}</div>
        </div>`).join('')}
      </div>
    </div>`,

  team: () => `
    <div class="block-team">
      <div class="team-label">Our Team</div>
      <h2 contenteditable="true" spellcheck="false">Meet the people behind the work</h2>
      <div class="team-grid">
        ${[
          { emoji: '👩', name: 'Alex Johnson', role: 'Founder & CEO', bio: 'Building products people love since 2015.' },
          { emoji: '👨', name: 'Sam Rivera', role: 'Head of Design', bio: 'Obsessed with clean, functional interfaces.' },
          { emoji: '🧑', name: 'Jordan Lee', role: 'Lead Engineer', bio: 'Turns coffee into fast, reliable code.' }
        ].map(m => `
        <div class="team-card">
          <div class="team-avatar">${m.emoji}</div>
          <div class="team-name" contenteditable="true" spellcheck="false">${m.name}</div>
          <div class="team-role" contenteditable="true" spellcheck="false">${m.role}</div>
          <div class="team-bio"  contenteditable="true" spellcheck="false">${m.bio}</div>
        </div>`).join('')}
      </div>
    </div>`,

  video: () => `
    <div class="block-video">
      <h2 contenteditable="true" spellcheck="false">See it in action</h2>
      <div class="video-placeholder">
        <div class="video-play-icon">▶</div>
        <div>Paste a YouTube or Vimeo URL below</div>
        <input class="video-url-input" placeholder="https://youtube.com/watch?v=..." value="">
      </div>
    </div>`,

  'logo-bar': () => `
    <div class="block-logo-bar">
      <div class="logobar-label">Trusted by teams at</div>
      <div class="logo-bar-grid">
        ${['Acme Co', 'Globex', 'Initech', 'Umbrella', 'Soylent'].map(n =>
          `<div class="logo-bar-item" contenteditable="true" spellcheck="false">${n}</div>`
        ).join('')}
      </div>
    </div>`,

  'cart-summary': () => `
    <div class="block-cart-summary">
      <h2 contenteditable="true" spellcheck="false">Your Cart</h2>
      <div class="cart-items">
        ${[
          { emoji: '👟', name: 'Classic Sneakers — White / Size 10', price: '$79.00' },
          { emoji: '🧢', name: 'Logo Cap — Black', price: '$29.00' }
        ].map(i => `
        <div class="cart-item">
          <div class="cart-item-img">${i.emoji}</div>
          <div>
            <div class="cart-item-name" contenteditable="true" spellcheck="false">${i.name}</div>
            <div class="cart-item-price" contenteditable="true" spellcheck="false">${i.price}</div>
          </div>
          <div class="cart-item-qty">×1</div>
        </div>`).join('')}
      </div>
      <div class="cart-total">
        <div class="cart-total-label">Total</div>
        <div class="cart-total-price" contenteditable="true" spellcheck="false">$108.00</div>
      </div>
      <button class="cart-checkout-btn" contenteditable="true" spellcheck="false">Proceed to Checkout →</button>
    </div>`,

  'contact-form': () => `
    <div class="block-contact-form">
      <h2 contenteditable="true" spellcheck="false">Get in touch</h2>
      <div class="form-sub" contenteditable="true" spellcheck="false">We'd love to hear from you. Fill out the form and we'll get back to you soon.</div>
      <div class="form-grid">
        <div class="form-field">
          <label>Name</label>
          <div class="form-input-mock">Your name</div>
        </div>
        <div class="form-field">
          <label>Email</label>
          <div class="form-input-mock">you@email.com</div>
        </div>
      </div>
      <div class="form-field" style="margin-bottom:14px;">
        <label>Message</label>
        <div class="form-textarea-mock">Your message here…</div>
      </div>
      <button class="form-submit-btn" contenteditable="true" spellcheck="false">Send Message →</button>
    </div>`,

  'email-signup': () => `
    <div class="block-email-signup">
      <h2 contenteditable="true" spellcheck="false">Stay in the loop.</h2>
      <p contenteditable="true" spellcheck="false">Join our newsletter. No spam, just updates you'll actually want.</p>
      <div class="email-signup-row">
        <div class="email-input-mock">Enter your email</div>
        <button class="email-submit-btn" contenteditable="true" spellcheck="false">Subscribe</button>
      </div>
      <div class="email-privacy">We respect your privacy. Unsubscribe at any time.</div>
    </div>`
};

// ── EXPORT ────────────────────────────────
function slugify(str) {
  return str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'my-site';
}

function generateHTML() {
  const projectName = projectNameInput.value || 'My Site';
  const blocks = [...canvas.querySelectorAll('.block')];

  const css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: white; color: #0D0D0D; }
    /* Navbar */
    .sf-navbar { padding: 0 40px; height: 56px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #F0F0F5; background: white; }
    .sf-navbar .nb-logo { font-size: 16px; font-weight: 700; color: #0D0D0D; }
    .sf-navbar .nb-links { display: flex; gap: 28px; }
    .sf-navbar .nb-link { font-size: 14px; color: #6E6E73; text-decoration: none; }
    .sf-navbar .nb-btn { padding: 7px 16px; background: #0A84FF; color: white; border: none; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
    /* Hero */
    .sf-hero { padding: 80px 60px; text-align: center; background: linear-gradient(160deg, #F2F6FB 0%, #EBF4FF 100%); }
    .sf-hero h1 { font-size: 42px; font-weight: 700; letter-spacing: -1px; color: #0D0D0D; margin-bottom: 14px; }
    .sf-hero p  { font-size: 17px; color: #6E6E73; margin-bottom: 24px; }
    .sf-hero .sf-btn { display: inline-block; padding: 12px 26px; background: #0A84FF; color: white; border-radius: 10px; font-size: 15px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; }
    /* Text */
    .sf-text { padding: 40px 60px; }
    .sf-text h2 { font-size: 26px; font-weight: 700; color: #0D0D0D; margin-bottom: 10px; }
    .sf-text p  { font-size: 16px; color: #6E6E73; line-height: 1.7; }
    /* Image */
    .sf-image { padding: 40px 60px; }
    .sf-image-placeholder { background: #F2F6FB; border: 1.5px dashed #C7E0FF; border-radius: 12px; height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #A8CAEC; font-size: 14px; gap: 8px; }
    /* Gallery */
    .sf-gallery { padding: 40px 60px; }
    .sf-gallery h2 { font-size: 24px; font-weight: 700; color: #0D0D0D; margin-bottom: 24px; }
    .sf-gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .sf-gallery-item { background: #F2F6FB; border: 1.5px dashed #C7E0FF; border-radius: 10px; aspect-ratio: 4/3; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #A8CAEC; font-size: 12px; gap: 6px; }
    /* Columns */
    .sf-columns { padding: 40px 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    .sf-col h3 { font-size: 18px; font-weight: 600; color: #0D0D0D; margin-bottom: 8px; }
    .sf-col p  { font-size: 15px; color: #6E6E73; line-height: 1.65; }
    /* Testimonials */
    .sf-testimonials { padding: 60px; background: #F7FAFF; }
    .sf-testimonials h2 { font-size: 26px; font-weight: 700; color: #0D0D0D; text-align: center; margin-bottom: 36px; }
    .sf-testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .sf-testimonial { background: white; border-radius: 14px; padding: 24px; border: 1px solid #EAF2FF; }
    .sf-testimonial-quote { font-size: 14px; color: #3a3a3c; line-height: 1.7; margin-bottom: 18px; }
    .sf-testimonial-author { display: flex; align-items: center; gap: 10px; }
    .sf-testimonial-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg,#C7E0FF,#0A84FF); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: white; flex-shrink: 0; }
    .sf-testimonial-name { font-size: 13px; font-weight: 600; color: #0D0D0D; }
    .sf-testimonial-role { font-size: 12px; color: #6E6E73; }
    /* CTA */
    .sf-cta { padding: 60px; text-align: center; background: linear-gradient(135deg,#0A84FF 0%,#0055CC 100%); }
    .sf-cta h2 { font-size: 30px; font-weight: 700; color: white; margin-bottom: 10px; }
    .sf-cta p  { font-size: 16px; color: rgba(255,255,255,0.75); margin-bottom: 28px; }
    .sf-cta .sf-btn { display: inline-block; padding: 12px 28px; background: white; color: #0A84FF; border-radius: 10px; font-size: 15px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; }
    /* Footer */
    .sf-footer { padding: 32px 60px; background: #0D0D0D; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
    .sf-footer .footer-logo { font-size: 15px; font-weight: 700; color: white; }
    .sf-footer .footer-links { display: flex; gap: 24px; }
    .sf-footer .footer-link  { font-size: 13px; color: #8E8E93; text-decoration: none; }
    .sf-footer .footer-copy  { font-size: 12px; color: #636366; }
    /* Divider */
    .sf-divider { padding: 20px 60px; }
    .sf-divider hr { border: none; border-top: 1px solid #E5EEF8; }
    /* Product Grid */
    .sf-product-grid { padding: 40px 60px; }
    .sf-product-grid h2 { font-size: 24px; font-weight: 700; color: #0D0D0D; margin-bottom: 28px; }
    .sf-pg-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
    .sf-product-card { background: #F7FAFF; border: 1px solid #EAF2FF; border-radius: 14px; overflow: hidden; }
    .sf-product-img { background: linear-gradient(135deg,#EBF4FF,#C7E0FF); height: 160px; display:flex; align-items:center; justify-content:center; font-size:36px; }
    .sf-product-info { padding: 16px; }
    .sf-product-name { font-size: 14px; font-weight: 600; color: #0D0D0D; margin-bottom: 4px; }
    .sf-product-desc { font-size: 12px; color: #6E6E73; margin-bottom: 12px; line-height: 1.5; }
    .sf-product-footer { display:flex; align-items:center; justify-content:space-between; }
    .sf-product-price { font-size: 16px; font-weight: 700; color: #0D0D0D; }
    .sf-product-btn { padding: 7px 14px; background: #0A84FF; color: white; border: none; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; }
    /* Pricing */
    .sf-pricing { padding: 60px; background: #F7FAFF; }
    .sf-pricing h2 { font-size: 28px; font-weight: 700; color: #0D0D0D; text-align:center; margin-bottom: 8px; }
    .sf-pricing-sub { font-size: 15px; color: #6E6E73; text-align:center; margin-bottom: 36px; }
    .sf-pricing-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
    .sf-pricing-tier { background:white; border:1.5px solid #E5EEF8; border-radius:16px; padding:28px 24px; position:relative; }
    .sf-pricing-tier.featured { border-color:#0A84FF; }
    .sf-pricing-badge { position:absolute; top:-11px; left:50%; transform:translateX(-50%); background:#0A84FF; color:white; font-size:10px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; padding:3px 12px; border-radius:99px; white-space:nowrap; }
    .sf-tier-name { font-size:12px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:#6E6E73; margin-bottom:12px; }
    .sf-tier-price { font-size:36px; font-weight:800; letter-spacing:-1px; color:#0D0D0D; line-height:1; margin-bottom:4px; }
    .sf-tier-period { font-size:12px; color:#A0A0A8; margin-bottom:20px; }
    .sf-tier-features { list-style:none; margin-bottom:24px; display:flex; flex-direction:column; gap:8px; }
    .sf-tier-feature { font-size:13px; color:#3A3A3C; display:flex; align-items:center; gap:8px; }
    .sf-tier-feature::before { content:'✓'; color:#34C759; font-weight:700; font-size:12px; }
    .sf-tier-btn { width:100%; padding:11px; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit; border:none; }
    .sf-tier-btn.outline { background:white; color:#0D0D0D; border:1.5px solid #E5E5EA; }
    .sf-tier-btn.filled  { background:#0A84FF; color:white; }
    /* Buy Button */
    .sf-buy-button { padding:48px 60px; display:flex; align-items:center; justify-content:space-between; background:white; gap:32px; flex-wrap:wrap; }
    .sf-buy-title { font-size:22px; font-weight:700; color:#0D0D0D; margin-bottom:6px; }
    .sf-buy-desc  { font-size:14px; color:#6E6E73; }
    .sf-buy-right { display:flex; align-items:center; gap:16px; flex-shrink:0; }
    .sf-buy-price { font-size:28px; font-weight:800; color:#0D0D0D; }
    .sf-buy-action { padding:14px 28px; background:#0A84FF; color:white; border:none; border-radius:12px; font-size:15px; font-weight:600; cursor:pointer; font-family:inherit; }
    /* Responsive */
    @media (max-width: 600px) {
      .sf-hero { padding: 60px 24px; }
      .sf-hero h1 { font-size: 28px; }
      .sf-text, .sf-image, .sf-gallery, .sf-cta, .sf-divider { padding-left: 24px; padding-right: 24px; }
      .sf-columns, .sf-testimonials-grid, .sf-gallery-grid { grid-template-columns: 1fr; }
      .sf-columns { padding: 40px 24px; }
      .sf-navbar .nb-links { display: none; }
      .sf-footer { flex-direction: column; align-items: flex-start; padding: 32px 24px; }
    }`;

  const blocksHTML = blocks.map(block => {
    const type  = block.dataset.type;
    const inner = block.querySelector('[class^="block-"]');
    if (!inner) return '';

    switch (type) {
      case 'navbar': {
        const logo  = inner.querySelector('.nb-logo')?.textContent || 'Brand';
        const links = [...inner.querySelectorAll('.nb-link')].map(l => `<a class="nb-link" href="#">${l.textContent}</a>`).join('');
        const btn   = inner.querySelector('.nb-btn')?.textContent || 'Get Started';
        return `  <nav class="sf-navbar">
    <div class="nb-logo">${logo}</div>
    <div class="nb-links">${links}</div>
    <button class="nb-btn">${btn}</button>
  </nav>`;
      }
      case 'hero': {
        const h1  = inner.querySelector('h1')?.textContent || '';
        const p   = inner.querySelector('p')?.textContent  || '';
        const btn = inner.querySelector('button')?.textContent || 'Get Started';
        return `  <section class="sf-hero">
    <h1>${h1}</h1>
    <p>${p}</p>
    <button class="sf-btn">${btn}</button>
  </section>`;
      }
      case 'text': {
        const h2 = inner.querySelector('h2')?.textContent || '';
        const p  = inner.querySelector('p')?.textContent  || '';
        return `  <section class="sf-text"><h2>${h2}</h2><p>${p}</p></section>`;
      }
      case 'image': {
        return `  <section class="sf-image"><div class="sf-image-placeholder"><span style="font-size:28px">🖼</span><span>Image placeholder</span></div></section>`;
      }
      case 'gallery': {
        const title = inner.querySelector('h2')?.textContent || 'Our Work';
        const items = [1,2,3,4,5,6].map(i => `<div class="sf-gallery-item"><span style="font-size:22px">🖼</span><span>Image ${i}</span></div>`).join('');
        return `  <section class="sf-gallery">
    <h2>${title}</h2>
    <div class="sf-gallery-grid">${items}</div>
  </section>`;
      }
      case 'columns': {
        const cols = [...inner.querySelectorAll('.col-item')].map(col => {
          const h3 = col.querySelector('h3')?.textContent || '';
          const p  = col.querySelector('p')?.textContent  || '';
          return `<div class="sf-col"><h3>${h3}</h3><p>${p}</p></div>`;
        }).join('');
        return `  <section class="sf-columns">${cols}</section>`;
      }
      case 'testimonials': {
        const title = inner.querySelector('h2')?.textContent || 'What people say';
        const cards = [...inner.querySelectorAll('.testimonial-card')].map(card => {
          const q    = card.querySelector('.testimonial-quote')?.textContent || '';
          const name = card.querySelector('.testimonial-name')?.textContent  || '';
          const role = card.querySelector('.testimonial-role')?.textContent  || '';
          const init = name.charAt(0).toUpperCase();
          return `<div class="sf-testimonial">
  <p class="sf-testimonial-quote">"${q}"</p>
  <div class="sf-testimonial-author">
    <div class="sf-testimonial-avatar">${init}</div>
    <div><div class="sf-testimonial-name">${name}</div><div class="sf-testimonial-role">${role}</div></div>
  </div>
</div>`;
        }).join('');
        return `  <section class="sf-testimonials">
    <h2>${title}</h2>
    <div class="sf-testimonials-grid">${cards}</div>
  </section>`;
      }
      case 'cta': {
        const h2  = inner.querySelector('h2')?.textContent  || '';
        const p   = inner.querySelector('p')?.textContent   || '';
        const btn = inner.querySelector('.cta-btn')?.textContent || 'Get Started';
        return `  <section class="sf-cta"><h2>${h2}</h2><p>${p}</p><button class="sf-btn">${btn}</button></section>`;
      }
      case 'footer': {
        const logo  = inner.querySelector('.footer-logo')?.textContent || 'Brand';
        const links = [...inner.querySelectorAll('.footer-link')].map(l => `<a class="footer-link" href="#">${l.textContent}</a>`).join('');
        const copy  = inner.querySelector('.footer-copy')?.textContent || '';
        return `  <footer class="sf-footer">
    <div class="footer-logo">${logo}</div>
    <div class="footer-links">${links}</div>
    <div class="footer-copy">${copy}</div>
  </footer>`;
      }
      case 'divider':
        return `  <div class="sf-divider"><hr></div>`;
      case 'product-grid': {
        const title = inner.querySelector('h2')?.textContent || 'Featured Products';
        const cards = [...inner.querySelectorAll('.product-card')].map(card => {
          const emoji = card.querySelector('.product-img')?.textContent.trim() || '🛍';
          const name  = card.querySelector('.product-name')?.textContent || '';
          const desc  = card.querySelector('.product-desc')?.textContent || '';
          const price = card.querySelector('.product-price')?.textContent || '';
          const btn   = card.querySelector('.product-buy-btn')?.textContent || 'Add to Cart';
          return `<div class="sf-product-card">
  <div class="sf-product-img">${emoji}</div>
  <div class="sf-product-info">
    <div class="sf-product-name">${name}</div>
    <div class="sf-product-desc">${desc}</div>
    <div class="sf-product-footer">
      <div class="sf-product-price">${price}</div>
      <button class="sf-product-btn">${btn}</button>
    </div>
  </div>
</div>`;
        }).join('');
        return `  <section class="sf-product-grid">
    <h2>${title}</h2>
    <div class="sf-pg-grid">${cards}</div>
  </section>`;
      }
      case 'pricing': {
        const h2  = inner.querySelector('h2')?.textContent || 'Simple, honest pricing';
        const sub = inner.querySelector('.pricing-sub')?.textContent || '';
        const tiers = [...inner.querySelectorAll('.pricing-tier')].map(tier => {
          const featured = tier.classList.contains('featured');
          const name   = tier.querySelector('.pricing-tier-name')?.textContent || '';
          const amount = tier.querySelector('.pricing-amount')?.textContent || '';
          const period = tier.querySelector('.pricing-period')?.textContent || '';
          const feats  = [...tier.querySelectorAll('.pricing-feature')].map(f => `<li class="sf-tier-feature">${f.textContent}</li>`).join('');
          const btnEl  = tier.querySelector('.pricing-cta-btn');
          const btnTxt = btnEl?.textContent || 'Get Started';
          const btnCls = btnEl?.classList.contains('filled') ? 'filled' : 'outline';
          return `<div class="sf-pricing-tier${featured?' featured':''}">
  ${featured ? '<div class="sf-pricing-badge">Most Popular</div>' : ''}
  <div class="sf-tier-name">${name}</div>
  <div class="sf-tier-price">${amount}</div>
  <div class="sf-tier-period">${period}</div>
  <ul class="sf-tier-features">${feats}</ul>
  <button class="sf-tier-btn ${btnCls}">${btnTxt}</button>
</div>`;
        }).join('');
        return `  <section class="sf-pricing">
    <h2>${h2}</h2>
    <p class="sf-pricing-sub">${sub}</p>
    <div class="sf-pricing-grid">${tiers}</div>
  </section>`;
      }
      case 'buy-button': {
        const title  = inner.querySelector('.buy-button-title')?.textContent  || '';
        const desc   = inner.querySelector('.buy-button-desc')?.textContent   || '';
        const price  = inner.querySelector('.buy-button-price')?.textContent  || '';
        const action = inner.querySelector('.buy-button-action')?.textContent || 'Buy Now';
        return `  <section class="sf-buy-button">
    <div><div class="sf-buy-title">${title}</div><div class="sf-buy-desc">${desc}</div></div>
    <div class="sf-buy-right">
      <div class="sf-buy-price">${price}</div>
      <button class="sf-buy-action">${action}</button>
    </div>
  </section>`;
      }
      default:
        return '';
    }
  }).join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <style>${css}</style>
</head>
<body>
${blocksHTML}
  <!-- Built with Trellis -->
</body>
</html>`;
}

function openExportModal() {
  const name  = projectNameInput.value || 'My Site';
  const count = canvas.querySelectorAll('.block').length;
  document.getElementById('exportProjectName').textContent = name;
  document.getElementById('exportBlockCount').textContent  = count + (count === 1 ? ' block' : ' blocks');
  document.getElementById('exportFileName').textContent    = slugify(name) + '.html';
  document.getElementById('exportOverlay').classList.add('active');
}

function downloadHTML() {
  const name = projectNameInput.value || 'My Site';
  const blob = new Blob([generateHTML()], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = slugify(name) + '.html'; a.click();
  URL.revokeObjectURL(url);
  document.getElementById('exportOverlay').classList.remove('active');
}

// ── UNDO / REDO HISTORY ──────────────────
const history = [];
let historyIndex = -1;
let isUndoing = false;

function captureHistory() {
  if (isUndoing) return;
  history.splice(historyIndex + 1);
  history.push(canvas.innerHTML);
  if (history.length > 50) history.shift();
  historyIndex = history.length - 1;
  updateUndoButtons();
}

function undo() {
  if (historyIndex <= 0) return;
  isUndoing = true;
  historyIndex--;
  canvas.innerHTML = history[historyIndex];
  reattachBlockListeners();
  updateUndoButtons();
  scheduleSave();
  isUndoing = false;
}

function redo() {
  if (historyIndex >= history.length - 1) return;
  isUndoing = true;
  historyIndex++;
  canvas.innerHTML = history[historyIndex];
  reattachBlockListeners();
  updateUndoButtons();
  scheduleSave();
  isUndoing = false;
}

function updateUndoButtons() {
  const undoBtn = document.getElementById('undoBtn');
  const redoBtn = document.getElementById('redoBtn');
  if (undoBtn) undoBtn.disabled = historyIndex <= 0;
  if (redoBtn) redoBtn.disabled = historyIndex >= history.length - 1;
}

function reattachBlockListeners() {
  canvas.querySelectorAll('.block').forEach(block => attachBlockBehavior(block));
  propertiesPanel.style.display = 'none';
  propertiesContent.innerHTML = '';
}

document.addEventListener('keydown', e => {
  const ctrl = e.ctrlKey || e.metaKey;
  if (ctrl && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
  if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
});

// ── SAVE / LOAD ───────────────────────────
function scheduleSave() {
  setSaveStatus('saving');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveProject, 800);
}

function setSaveStatus(state) {
  saveStatus.className = 'save-status ' + state;
  if (state === 'saving') saveStatus.textContent = 'Saving…';
  if (state === 'saved')  saveStatus.textContent = 'All saved ✓';
  if (state === '')       saveStatus.textContent = 'All saved';
}

function saveProject() {
  const blocks = [...canvas.querySelectorAll('.block')].map(b => ({
    type: b.dataset.type,
    html: b.querySelector('[class^="block-"]').innerHTML
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: projectNameInput.value, blocks, saved: Date.now() }));
  setSaveStatus('saved');
  setTimeout(() => setSaveStatus(''), 2000);
}

function loadProject() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  try {
    const p = JSON.parse(raw);
    if (p.name) projectNameInput.value = p.name;
    if (p.blocks && p.blocks.length > 0) { p.blocks.forEach(b => addBlock(b.type, b.html)); return true; }
  } catch(e) { console.warn('Load error:', e); }
  return false;
}

function clearProject() {
  localStorage.removeItem(STORAGE_KEY);
  canvas.querySelectorAll('.block').forEach(b => b.remove());
  selectedBlock = null;
  propertiesPanel.style.display = 'none';
  if (canvasEmpty) canvasEmpty.style.display = 'flex';
  projectNameInput.value = 'My Site';
  setSaveStatus('');
}

// ── ADD BLOCK ─────────────────────────────
function attachBlockBehavior(block) {
  block.querySelectorAll('.block-toolbar').forEach(t => t.remove());

  const toolbar = document.createElement('div');
  toolbar.className = 'block-toolbar';
  toolbar.innerHTML = `
    <button class="tb-btn" data-action="up"        title="Move up">↑</button>
    <button class="tb-btn" data-action="down"      title="Move down">↓</button>
    <button class="tb-btn" data-action="duplicate" title="Duplicate">⧉</button>
    <button class="tb-btn tb-delete" data-action="delete" title="Delete">✕</button>
  `;
  block.appendChild(toolbar);

  toolbar.querySelectorAll('.tb-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const action = btn.dataset.action;
      if (action === 'up')        moveBlock(block, 'up');
      if (action === 'down')      moveBlock(block, 'down');
      if (action === 'duplicate') duplicateBlock(block);
      if (action === 'delete')    deleteBlock(block);
    });
  });

  block.addEventListener('click', e => {
    e.stopPropagation();
    selectBlock(block);
  });

  block.querySelectorAll('[contenteditable]').forEach(el => {
    el.addEventListener('input', () => { scheduleSave(); captureHistory(); });
  });

  // Image upload handler
  if (block.dataset.type === 'image') {
    const imgBlock = block.querySelector('.block-image');
    const fileInput = block.querySelector('.image-file-input');
    if (imgBlock && fileInput) {
      imgBlock.addEventListener('click', e => {
        if (e.target === fileInput) return;
        fileInput.click();
      });
      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          imgBlock.dataset.uploaded = 'true';
          imgBlock.innerHTML = `
            <input type="file" class="image-file-input" accept="image/*" style="display:none">
            <img src="${ev.target.result}" alt="Uploaded image" style="width:100%;height:100%;object-fit:cover;display:block;">
            <div class="image-change-btn">Change image</div>
          `;
          // Re-attach file input listener
          const newInput = imgBlock.querySelector('.image-file-input');
          const changeBtn = imgBlock.querySelector('.image-change-btn');
          if (changeBtn) changeBtn.addEventListener('click', e => { e.stopPropagation(); newInput.click(); });
          if (newInput) newInput.addEventListener('change', () => {
            const f2 = newInput.files[0];
            if (!f2) return;
            const r2 = new FileReader();
            r2.onload = e2 => {
              imgBlock.querySelector('img').src = e2.target.result;
              scheduleSave(); captureHistory();
            };
            r2.readAsDataURL(f2);
          });
          scheduleSave(); captureHistory();
        };
        reader.readAsDataURL(file);
      });
    }
  }
}

function addBlock(type, savedHTML = null) {
  if (canvasEmpty) canvasEmpty.style.display = 'none';
  const block = document.createElement('div');
  block.classList.add('block');
  block.dataset.type = type;

  const tmpl = blockTemplates[type];
  if (!tmpl) return;
  block.innerHTML = savedHTML || tmpl();
  canvas.appendChild(block);
  attachBlockBehavior(block);
  selectBlock(block);
  scheduleSave();
  captureHistory();
}

function duplicateBlock(block) {
  const clone = document.createElement('div');
  clone.className     = 'block';
  clone.dataset.type    = block.dataset.type;
  clone.dataset.padding = block.dataset.padding || '';
  clone.dataset.align   = block.dataset.align   || '';

  const inner = block.querySelector('[class^="block-"]');
  if (inner) {
    clone.innerHTML = inner.outerHTML;
    const cloneInner = clone.querySelector('[class^="block-"]');
    if (cloneInner) cloneInner.style.cssText = inner.style.cssText;
  }

  block.after(clone);
  attachBlockBehavior(clone);
  selectBlock(clone);
  scheduleSave();
  captureHistory();
}

function moveBlock(block, dir) {
  const blocks = [...canvas.querySelectorAll('.block')];
  const idx    = blocks.indexOf(block);
  const target = dir === -1 ? blocks[idx - 1] : blocks[idx + 1];
  if (!target) return;
  if (dir === -1) canvas.insertBefore(block, target);
  else            canvas.insertBefore(target, block);
  scheduleSave();
}

// ── PROPERTIES ────────────────────────────
function showProperties(block) {
  const type  = block.dataset.type;
  const inner = block.querySelector('[class^="block-"]');
  propertiesPanel.style.display = 'block';

  const BG_SWATCHES   = ['#FFFFFF','#F2F6FB','#EBF4FF','#F7FAFF','#0D0D0D','#1C1C1E','#0A84FF','#0055CC','#34C759','#FF9500','#FF3B30','#F0F0F5'];
  const TEXT_SWATCHES = ['#0D0D0D','#1C1C1E','#3A3A3C','#6E6E73','#FFFFFF','#0A84FF','#34C759','#FF3B30'];
  const FONTS = [
    { label: 'System (default)', value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
    { label: 'Serif',            value: "Georgia, 'Times New Roman', serif" },
    { label: 'Monospace',        value: "'Courier New', Courier, monospace" },
    { label: 'Rounded',          value: "'Trebuchet MS', Helvetica, sans-serif" },
    { label: 'Elegant',          value: "'Palatino Linotype', Palatino, serif" }
  ];
  const PADDING = { small: '20px 40px', medium: '40px 60px', large: '80px 60px' };

  const curBg    = inner ? (inner.style.backgroundColor || inner.style.background || '#FFFFFF') : '#FFFFFF';
  const curColor = inner ? (inner.style.color || '#0D0D0D') : '#0D0D0D';
  const curFont  = inner ? (inner.style.fontFamily || '') : '';
  const curPad   = block.dataset.padding || 'medium';
  const curAlign = block.dataset.align   || 'center';

  function swatchHex(c) { return c.startsWith('#') ? c : '#ffffff'; }

  function makeSwatch(c, active, extraClass='') {
    return `<div class="swatch${active?' active':''}${extraClass?' '+extraClass:''}" style="background:${c}" data-color="${c}" title="${c}"></div>`;
  }

  const fields = {
    hero:         [['h1','Heading'],['p','Subtext']],
    text:         [['h2','Heading'],['p','Subtext']],
    cta:          [['h2','Title'],['p','Subtitle'],['.cta-btn','Button']],
    navbar:       [['.nb-logo','Logo'],['.nb-btn','Button text']],
    footer:       [['.footer-logo','Logo'],['.footer-copy','Copyright']],
    gallery:      [['h2','Title']],
    testimonials: [['h2','Heading']]
  };

  let contentHTML = `<div class="prop-group"><div class="prop-label">Block type</div>
    <div style="font-size:13px;font-weight:600;color:#0A84FF;text-transform:capitalize;">${type}</div></div>`;

  if (fields[type]) {
    fields[type].forEach(([sel, label]) => {
      const el = block.querySelector(sel);
      if (el) contentHTML += `<div class="prop-group"><div class="prop-label">${label}</div>
        <input class="prop-input" data-sel="${sel}" value="${el.textContent.trim()}"></div>`;
    });
  }

  const bgSwatches   = BG_SWATCHES.map(c   => makeSwatch(c, c.toLowerCase()===curBg.toLowerCase())).join('');
  const textSwatches = TEXT_SWATCHES.map(c => makeSwatch(c, c.toLowerCase()===curColor.toLowerCase(), 'text-swatch')).join('');
  const fontOpts     = FONTS.map(f => `<button class="font-opt${curFont.includes(f.value.split(',')[0].replace(/'/g,'').trim())?' active':''}" style="font-family:${f.value}" data-font="${f.value}">${f.label}</button>`).join('');

  const styleHTML = `
    <div class="props-divider"></div>
    <div class="style-section">
      <div class="style-label">Background</div>
      <div class="swatch-row">${bgSwatches}</div>
      <div class="color-input-wrap">
        <input type="color" class="color-picker" id="bgPicker" value="${swatchHex(curBg)}">
        <input type="text"  class="color-hex"    id="bgHex"    value="${curBg}" placeholder="#FFFFFF" maxlength="7">
      </div>
    </div>
    <div class="style-section">
      <div class="style-label">Text color</div>
      <div class="swatch-row">${textSwatches}</div>
      <div class="color-input-wrap">
        <input type="color" class="color-picker" id="textPicker" value="${swatchHex(curColor)}">
        <input type="text"  class="color-hex"    id="textHex"    value="${curColor}" placeholder="#0D0D0D" maxlength="7">
      </div>
    </div>
    <div class="style-section">
      <div class="style-label">Font</div>
      <div class="font-options">${fontOpts}</div>
    </div>
    <div class="style-section">
      <div class="style-label">Padding</div>
      <div class="toggle-row">
        <button class="toggle-btn${curPad==='small'?' active':''}"  data-pad="small">S</button>
        <button class="toggle-btn${curPad==='medium'?' active':''}" data-pad="medium">M</button>
        <button class="toggle-btn${curPad==='large'?' active':''}"  data-pad="large">L</button>
      </div>
    </div>
    <div class="style-section">
      <div class="style-label">Alignment</div>
      <div class="toggle-row">
        <button class="toggle-btn${curAlign==='left'?' active':''}"   data-align="left">Left</button>
        <button class="toggle-btn${curAlign==='center'?' active':''}" data-align="center">Center</button>
        <button class="toggle-btn${curAlign==='right'?' active':''}"  data-align="right">Right</button>
      </div>
    </div>
    <button class="delete-btn" id="deletePropBtn">Delete block</button>`;

  propertiesContent.innerHTML = contentHTML + styleHTML;

  // Content inputs
  propertiesContent.querySelectorAll('.prop-input').forEach(input => {
    input.addEventListener('input', () => {
      const el = block.querySelector(input.dataset.sel);
      if (el) el.textContent = input.value;
      scheduleSave();
    });
  });

  // BG swatches
  propertiesContent.querySelectorAll('.swatch:not(.text-swatch)').forEach(sw => {
    sw.addEventListener('click', () => {
      if (inner) { inner.style.background = sw.dataset.color; inner.style.backgroundColor = sw.dataset.color; }
      document.getElementById('bgPicker').value = swatchHex(sw.dataset.color);
      document.getElementById('bgHex').value    = sw.dataset.color;
      propertiesContent.querySelectorAll('.swatch:not(.text-swatch)').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      scheduleSave();
    });
  });

  // Text swatches
  propertiesContent.querySelectorAll('.text-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      if (inner) inner.style.color = sw.dataset.color;
      document.getElementById('textPicker').value = swatchHex(sw.dataset.color);
      document.getElementById('textHex').value    = sw.dataset.color;
      propertiesContent.querySelectorAll('.text-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      scheduleSave();
    });
  });

  // BG picker & hex
  const bgPicker = document.getElementById('bgPicker');
  const bgHex    = document.getElementById('bgHex');
  bgPicker.addEventListener('input', () => {
    if (inner) { inner.style.background = bgPicker.value; inner.style.backgroundColor = bgPicker.value; }
    bgHex.value = bgPicker.value;
    scheduleSave();
  });
  bgHex.addEventListener('input', () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(bgHex.value)) {
      if (inner) { inner.style.background = bgHex.value; inner.style.backgroundColor = bgHex.value; }
      bgPicker.value = bgHex.value;
      scheduleSave();
    }
  });

  // Text picker & hex
  const textPicker = document.getElementById('textPicker');
  const textHex    = document.getElementById('textHex');
  textPicker.addEventListener('input', () => {
    if (inner) inner.style.color = textPicker.value;
    textHex.value = textPicker.value;
    scheduleSave();
  });
  textHex.addEventListener('input', () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(textHex.value)) {
      if (inner) inner.style.color = textHex.value;
      textPicker.value = textHex.value;
      scheduleSave();
    }
  });

  // Font
  propertiesContent.querySelectorAll('.font-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      if (inner) inner.style.fontFamily = btn.dataset.font;
      propertiesContent.querySelectorAll('.font-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      scheduleSave();
    });
  });

  // Padding
  propertiesContent.querySelectorAll('[data-pad]').forEach(btn => {
    btn.addEventListener('click', () => {
      block.dataset.padding = btn.dataset.pad;
      if (inner) inner.style.padding = PADDING[btn.dataset.pad];
      propertiesContent.querySelectorAll('[data-pad]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      scheduleSave();
    });
  });

  // Alignment
  propertiesContent.querySelectorAll('[data-align]').forEach(btn => {
    btn.addEventListener('click', () => {
      block.dataset.align = btn.dataset.align;
      if (inner) inner.style.textAlign = btn.dataset.align;
      propertiesContent.querySelectorAll('[data-align]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      scheduleSave();
    });
  });

  document.getElementById('deletePropBtn').addEventListener('click', () => deleteBlock(block));
}

// ── EVENTS ────────────────────────────────
document.querySelectorAll('.block-btn').forEach(btn => btn.addEventListener('click', () => addBlock(btn.dataset.type)));

document.querySelectorAll('.device-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const frame = document.getElementById('canvasFrame');
    frame.className = 'canvas-frame';
    if (btn.dataset.device !== 'desktop') frame.classList.add(btn.dataset.device);
  });
});

canvas.addEventListener('click', e => {
  if (!e.target.closest('.block')) {
    document.querySelectorAll('.block').forEach(b => b.classList.remove('selected'));
    selectedBlock = null;
    propertiesPanel.style.display = 'none';
  }
});

projectNameInput.addEventListener('input', scheduleSave);

const newSiteOverlay = document.getElementById('newSiteOverlay');
document.getElementById('newSiteBtn').addEventListener('click', () => newSiteOverlay.classList.add('active'));
document.getElementById('confirmNewSite').addEventListener('click', () => { clearProject(); newSiteOverlay.classList.remove('active'); });
document.getElementById('cancelNewSite').addEventListener('click', () => newSiteOverlay.classList.remove('active'));

document.getElementById('undoBtn')?.addEventListener('click', undo);
document.getElementById('redoBtn')?.addEventListener('click', redo);
document.getElementById('exportBtn').addEventListener('click', openExportModal);
document.getElementById('confirmExport').addEventListener('click', downloadHTML);
document.getElementById('exportModalClose').addEventListener('click', () => document.getElementById('exportOverlay').classList.remove('active'));
document.getElementById('exportOverlay').addEventListener('click', e => { if (e.target === document.getElementById('exportOverlay')) document.getElementById('exportOverlay').classList.remove('active'); });

document.getElementById('previewBtn').addEventListener('click', () => {
  const blob = new Blob([generateHTML()], { type: 'text/html' });
  window.open(URL.createObjectURL(blob), '_blank');
});
document.getElementById('publishBtn').addEventListener('click', () => alert('🎉 Publishing coming soon!'));

// ── TEMPLATE DEFINITIONS ──────────────────
const TEMPLATES = {
  'blank': [],
  'personal-brand': [
    { type: 'navbar',       content: { logo: 'Your Name',    links: ['Work','About','Contact'], btn: 'Hire Me' } },
    { type: 'hero',         content: { h1: "Hi, I'm [Your Name]", p: 'Designer · Developer · Creator. I build things people love to use.', btn: 'See My Work' } },
    { type: 'text',         content: { h2: 'About Me', p: "Tell your story here. Where you're from, what you do, what you care about." } },
    { type: 'columns',      content: { col1h: 'Design', col1p: 'Clean, thoughtful, and made to last.', col2h: 'Development', col2p: 'Fast, accessible, and built right.' } },
    { type: 'testimonials', content: {} },
    { type: 'footer',       content: { logo: 'Your Name', copy: '© 2026 Your Name' } }
  ],
  'local-business': [
    { type: 'navbar',  content: { logo: 'My Business', links: ['Services','About','Contact'], btn: 'Book Now' } },
    { type: 'hero',    content: { h1: 'Welcome to My Business', p: "Quality service, friendly team, and results you can count on.", btn: 'Get In Touch' } },
    { type: 'columns', content: { col1h: 'Our Service', col1p: 'We take pride in every job.', col2h: 'Why Us', col2p: 'Local, trusted, and focused on you.' } },
    { type: 'text',    content: { h2: 'About Us', p: "We're a local business that cares about our community. Add your story here." } },
    { type: 'cta',     content: { h2: "Ready to work together?", p: "Reach out today and let's get started.", btn: 'Contact Us' } },
    { type: 'footer',  content: { logo: 'My Business', copy: '© 2026 My Business' } }
  ],
  'online-store': [
    { type: 'navbar',  content: { logo: 'My Store', links: ['Shop','About','Contact'], btn: 'Cart (0)' } },
    { type: 'hero',    content: { h1: 'Shop Our Collection', p: 'Handpicked products made with care. Free shipping on orders over $50.', btn: 'Shop Now' } },
    { type: 'columns', content: { col1h: 'New Arrivals', col1p: 'Fresh styles added every week.', col2h: 'Best Sellers', col2p: 'Products our customers love most.' } },
    { type: 'gallery', content: { title: 'Featured Products' } },
    { type: 'cta',     content: { h2: 'Join our community', p: 'Sign up for exclusive deals and new arrivals.', btn: 'Subscribe Free' } },
    { type: 'footer',  content: { logo: 'My Store', copy: '© 2026 My Store. All rights reserved.' } }
  ],
  'portfolio': [
    { type: 'navbar',       content: { logo: 'Portfolio', links: ['Work','About','Contact'], btn: 'Hire Me' } },
    { type: 'hero',         content: { h1: 'Creative work that speaks for itself', p: "I design and build digital experiences. Scroll down to see what I've made.", btn: 'View Work' } },
    { type: 'gallery',      content: { title: 'Selected Work' } },
    { type: 'testimonials', content: {} },
    { type: 'cta',          content: { h2: "Let's work together", p: "Available for freelance and full-time roles.", btn: 'Get In Touch' } },
    { type: 'footer',       content: { logo: 'Portfolio', copy: '© 2026. All rights reserved.' } }
  ],
  'event': [
    { type: 'hero',    content: { h1: "You're Invited", p: 'Join us for an unforgettable evening. Date · Location · 7:00 PM', btn: 'RSVP Now' } },
    { type: 'text',    content: { h2: 'About the Event', p: 'Tell people what this event is about, why they should come, and what to expect.' } },
    { type: 'columns', content: { col1h: '📍 Location', col1p: '123 Main Street, Your City. Doors open at 6:30 PM.', col2h: '🎟 Tickets', col2p: 'Free entry with RSVP. Limited spots available.' } },
    { type: 'cta',     content: { h2: "Don't miss out", p: 'Spots are limited. Reserve yours today.', btn: 'RSVP Free' } }
  ]
};

function applyTemplateContent(blockEl, type, content) {
  if (!content || Object.keys(content).length === 0) return;
  const get = sel => blockEl.querySelector(sel);
  if (type === 'navbar') {
    if (content.logo)  { const el = get('.nb-logo'); if (el) el.textContent = content.logo; }
    if (content.btn)   { const el = get('.nb-btn');  if (el) el.textContent = content.btn; }
    if (content.links) { const els = blockEl.querySelectorAll('.nb-link'); els.forEach((el,i) => { if (content.links[i]) el.textContent = content.links[i]; }); }
  }
  if (type === 'hero') {
    if (content.h1)  { const el = get('h1'); if (el) el.textContent = content.h1; }
    if (content.p)   { const el = get('p');  if (el) el.textContent = content.p; }
    if (content.btn) { const el = get('button'); if (el) el.textContent = content.btn; }
  }
  if (type === 'text') {
    if (content.h2) { const el = get('h2'); if (el) el.textContent = content.h2; }
    if (content.p)  { const el = get('p');  if (el) el.textContent = content.p; }
  }
  if (type === 'columns') {
    const hs = blockEl.querySelectorAll('h3');
    const ps = blockEl.querySelectorAll('p');
    if (hs[0] && content.col1h) hs[0].textContent = content.col1h;
    if (ps[0] && content.col1p) ps[0].textContent = content.col1p;
    if (hs[1] && content.col2h) hs[1].textContent = content.col2h;
    if (ps[1] && content.col2p) ps[1].textContent = content.col2p;
  }
  if (type === 'cta') {
    if (content.h2)  { const el = get('h2');       if (el) el.textContent = content.h2; }
    if (content.p)   { const el = get('p');        if (el) el.textContent = content.p; }
    if (content.btn) { const el = get('.cta-btn'); if (el) el.textContent = content.btn; }
  }
  if (type === 'gallery') {
    if (content.title) { const el = get('h2'); if (el) el.textContent = content.title; }
  }
  if (type === 'footer') {
    if (content.logo) { const el = get('.footer-logo'); if (el) el.textContent = content.logo; }
    if (content.copy) { const el = get('.footer-copy'); if (el) el.textContent = content.copy; }
  }
}

function loadTemplate(key) {
  const blocks = TEMPLATES[key];
  if (!blocks) return;
  blocks.forEach(({ type, content }) => {
    addBlock(type);
    const lastBlock = canvas.querySelector('.block:last-child');
    const inner = lastBlock?.querySelector('[class^="block-"]');
    if (inner) applyTemplateContent(inner, type, content);
  });
  if (key !== 'blank') {
    projectNameInput.value = key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    scheduleSave();
  }
}

// ── ONBOARDING STYLE APPLICATION ─────────
function applyOnboardingStyle() {
  const raw = localStorage.getItem('trellis_onboarding');
  if (!raw) return;
  try {
    const ob = JSON.parse(raw);
    if (!ob.completed) return;

    // Apply name to project (onboarding name wins over AI-generated name)
    if (ob.name) {
      projectNameInput.value = ob.name;
    }

    // Apply style to all blocks after a short delay (let blocks render first)
    setTimeout(() => {
      const styleMap = {
        clean:   { bg: '#F2F6FB', heroFg: '#EBF4FF', dark: '#0D0D0D' },
        bold:    { bg: '#0D0D0D', heroFg: '#1C1C1E', dark: '#FFFFFF'  },
        warm:    { bg: '#FFFAF5', heroFg: '#FFF0DC', dark: '#1C1C1E'  },
        minimal: { bg: '#FFFFFF', heroFg: '#FAFAFA', dark: '#1C1C1E'  }
      };
      const s = styleMap[ob.style];
      if (!s) return;

      canvas.querySelectorAll('.block').forEach(block => {
        const inner = block.querySelector('[class^="block-"]');
        if (!inner) return;
        const type = block.dataset.type;
        // Apply bg to non-CTA, non-footer blocks
        if (!['cta','footer','navbar'].includes(type)) {
          inner.style.backgroundColor = s.bg;
        }
        if (type === 'hero') {
          inner.style.backgroundColor = s.heroFg;
        }
        if (!['cta','footer'].includes(type)) {
          inner.style.color = s.dark;
        }
      });

      // Update navbar logo and footer logo with site name
      if (ob.name) {
        canvas.querySelectorAll('.nb-logo, .footer-logo').forEach(el => {
          el.textContent = ob.name;
        });
      }
      // Update hero tagline if provided
      if (ob.tagline) {
        const heroP = canvas.querySelector('.block-hero p');
        if (heroP) heroP.textContent = ob.tagline;
      }

      scheduleSave();
    }, 100);
  } catch(e) { console.warn('Onboarding apply error:', e); }
}

// ── AI BUILDER ───────────────────────────
const AI_SYSTEM_PROMPT = `You are a website block layout generator for Trellis, a website builder.
When given a description of a website, respond ONLY with a valid JSON array of block objects.
No explanation, no markdown, no code fences — just raw JSON.

Available block types: navbar, hero, text, image, gallery, columns, testimonials, cta, footer, divider, product-grid, pricing, buy-button

Each block object must have:
- "type": one of the block types above
- "content": an object with text fields appropriate for that block type

Content fields per type:
- navbar:       { logo, links: [str,str,str], btn }
- hero:         { h1, p, btn }
- text:         { h2, p }
- columns:      { col1h, col1p, col2h, col2p }
- cta:          { h2, p, btn }
- gallery:      { title }
- testimonials: {}
- image:        {}
- divider:      {}
- footer:       { logo, copy }
- product-grid: { title }
- pricing:      { h2, sub }
- buy-button:   { title, desc, price, btn }

Rules:
- Always start with a navbar and end with a footer
- Pick 4–8 blocks total depending on the site description
- Make all text content specific and relevant to the description
- Keep text concise and natural
- Return ONLY the JSON array, nothing else`;

async function buildWithAI(prompt) {
  const apiKey = localStorage.getItem('trellis_apikey');
  if (!apiKey) return null;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: AI_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const raw  = data.content?.[0]?.text || '';
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

function showAILoading(prompt) {
  canvas.innerHTML = `
    <div class="ai-loading-screen">
      <div class="ai-loading-orb"></div>
      <div class="ai-loading-label">Building your site…</div>
      <div class="ai-loading-prompt">"${prompt}"</div>
      <div class="ai-loading-blocks" id="aiLoadingBlocks"></div>
    </div>`;
}

function updateAILoadingBlock(type) {
  const el = document.getElementById('aiLoadingBlocks');
  if (!el) return;
  const pill = document.createElement('div');
  pill.className = 'ai-loading-pill';
  pill.textContent = type;
  el.appendChild(pill);
  pill.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function runAIBuilder(prompt) {
  showAILoading(prompt);
  saveStatus.textContent = 'Building…';
  saveStatus.style.color = '#0A84FF';

  try {
    const blocks = await buildWithAI(prompt);
    if (!blocks || !Array.isArray(blocks)) throw new Error('Invalid response from AI');

    canvas.innerHTML = '';

    for (const block of blocks) {
      updateAILoadingBlock(block.type);
      await new Promise(r => setTimeout(r, 120)); // small delay for effect
      addBlock(block.type);
      const lastBlock = canvas.querySelector('.block:last-child');
      const inner = lastBlock?.querySelector('[class^="block-"]');
      if (inner && block.content) applyTemplateContent(inner, block.type, block.content);
    }

    // Set project name from navbar logo if available
    const navLogo = canvas.querySelector('.nb-logo');
    if (navLogo) projectNameInput.value = navLogo.textContent.trim();

    // Apply onboarding style (colors, font, name) on top of AI structure
    applyOnboardingStyle();

    scheduleSave();
    saveStatus.textContent = 'Site built ✦';
    saveStatus.style.color = '#34C759';
    setTimeout(() => { saveStatus.textContent = 'Saved'; saveStatus.style.color = ''; }, 3000);

  } catch (err) {
    canvas.innerHTML = `
      <div class="ai-error-screen">
        <div class="ai-error-icon">⚠</div>
        <div class="ai-error-title">Something went wrong</div>
        <div class="ai-error-msg">${err.message}</div>
        <button class="ai-error-btn" onclick="location.href='index.html'">← Go back</button>
      </div>`;
    saveStatus.textContent = 'Error';
    saveStatus.style.color = '#FF3B30';
  }
}

// ── SIDEBAR TABS ──────────────────────────
document.querySelectorAll('.sidebar-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.sidebar-tab-content').forEach(c => c.classList.add('hidden'));
    document.getElementById('tab' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)).classList.remove('hidden');
  });
});

// ── MULTI-PAGE SYSTEM ─────────────────────
let pages = [{ id: 'home', name: 'Home', icon: '🏠', html: '' }];
let currentPageId = 'home';

const PAGE_TYPE_META = {
  landing:  { name: 'Landing Page', icon: '🏠', blocks: ['navbar','hero','features','testimonials','cta','footer'] },
  product:  { name: 'Product',      icon: '📦', blocks: ['navbar','hero','product-grid','buy-button','footer'] },
  cart:     { name: 'Cart',         icon: '🛒', blocks: ['navbar','cart-summary','footer'] },
  about:    { name: 'About',        icon: 'ℹ',  blocks: ['navbar','hero','text','team','footer'] },
  blog:     { name: 'Blog Post',    icon: '📝', blocks: ['navbar','hero','text','text','footer'] },
  contact:  { name: 'Contact',      icon: '✉',  blocks: ['navbar','contact-form','footer'] },
  custom:   { name: 'New Page',     icon: '✦',  blocks: [] }
};

function savePagesToStorage() {
  // Save current canvas into pages array before persisting
  const idx = pages.findIndex(p => p.id === currentPageId);
  if (idx !== -1) pages[idx].html = canvas.innerHTML;
  const proj = {
    name: projectNameInput.value,
    pages: pages,
    currentPageId: currentPageId,
    saved: new Date().toISOString()
  };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(proj)); } catch(e) {}
}

function loadPagesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const proj = JSON.parse(raw);
    if (!proj.pages || !Array.isArray(proj.pages)) return false;
    pages = proj.pages;
    currentPageId = proj.currentPageId || pages[0]?.id || 'home';
    projectNameInput.value = proj.name || 'My Site';
    renderPageTabs();
    renderPageList();
    const page = pages.find(p => p.id === currentPageId);
    if (page) {
      canvas.innerHTML = page.html || '';
      if (!canvas.innerHTML.trim()) showCanvasEmpty();
      else hideCanvasEmpty();
      canvas.querySelectorAll('.block').forEach(b => attachBlockBehavior(b));
    }
    return true;
  } catch(e) { return false; }
}

function showCanvasEmpty() {
  if (!document.getElementById('canvasEmpty')) {
    const empty = document.createElement('div');
    empty.className = 'canvas-empty';
    empty.id = 'canvasEmpty';
    empty.innerHTML = '<div class="canvas-empty-icon">＋</div><p>Add a block from the sidebar<br>to start building</p>';
    canvas.appendChild(empty);
  }
}
function hideCanvasEmpty() {
  const e = document.getElementById('canvasEmpty');
  if (e) e.remove();
}

function switchPage(id) {
  // Save current page canvas
  const prevIdx = pages.findIndex(p => p.id === currentPageId);
  if (prevIdx !== -1) pages[prevIdx].html = canvas.innerHTML;

  currentPageId = id;
  const page = pages.find(p => p.id === id);
  if (!page) return;

  canvas.innerHTML = page.html || '';
  if (!canvas.innerHTML.trim()) showCanvasEmpty();
  else hideCanvasEmpty();
  canvas.querySelectorAll('.block').forEach(b => attachBlockBehavior(b));

  renderPageTabs();
  renderPageList();
  selectedBlock = null;
  propertiesPanel.style.display = 'none';
}

function addNewPage(type, customName) {
  const meta = PAGE_TYPE_META[type] || PAGE_TYPE_META.custom;
  const name = customName || meta.name;
  const id   = 'page_' + Date.now();
  pages.push({ id, name, icon: meta.icon, html: '' });

  // Save current first
  const prevIdx = pages.findIndex(p => p.id === currentPageId);
  if (prevIdx !== -1) pages[prevIdx].html = canvas.innerHTML;

  currentPageId = id;
  canvas.innerHTML = '';
  showCanvasEmpty();

  // Add starter blocks for this page type
  if (meta.blocks.length > 0) {
    meta.blocks.forEach(t => addBlock(t));
  }

  pages[pages.length - 1].html = canvas.innerHTML;
  renderPageTabs();
  renderPageList();
  scheduleSave();
  captureHistory();
}

function deletePage(id) {
  if (pages.length <= 1) { alert("You can't delete the only page."); return; }
  pages = pages.filter(p => p.id !== id);
  if (currentPageId === id) switchPage(pages[0].id);
  else { renderPageTabs(); renderPageList(); }
  scheduleSave();
}

function renderPageTabs() {
  const bar = document.getElementById('pageTabBar');
  if (!bar) return;
  bar.innerHTML = '';
  pages.forEach(page => {
    const tab = document.createElement('button');
    tab.className = 'page-tab' + (page.id === currentPageId ? ' active' : '');
    tab.innerHTML = `<span>${page.icon}</span><span>${page.name}</span>`;
    tab.addEventListener('click', () => switchPage(page.id));
    bar.appendChild(tab);
  });
  // Add page button
  const addBtn = document.createElement('button');
  addBtn.className = 'page-tab-add';
  addBtn.textContent = '＋';
  addBtn.title = 'Add page';
  addBtn.addEventListener('click', () => openAddPageModal());
  bar.appendChild(addBtn);
}

function renderPageList() {
  const list = document.getElementById('pageList');
  if (!list) return;
  list.innerHTML = '';
  pages.forEach(page => {
    const item = document.createElement('div');
    item.className = 'page-list-item' + (page.id === currentPageId ? ' active' : '');
    item.innerHTML = `
      <span class="page-list-item-icon">${page.icon}</span>
      <span class="page-list-item-name">${page.name}</span>
      <button class="page-list-item-del" title="Delete page">✕</button>`;
    item.querySelector('.page-list-item-name').addEventListener('click', () => switchPage(page.id));
    item.querySelector('.page-list-item-icon').addEventListener('click', () => switchPage(page.id));
    item.querySelector('.page-list-item-del').addEventListener('click', e => {
      e.stopPropagation();
      if (confirm(`Delete "${page.name}"?`)) deletePage(page.id);
    });
    list.appendChild(item);
  });
}

// ── ADD PAGE MODAL ────────────────────────
let selectedPageType = 'custom';

function openAddPageModal() {
  selectedPageType = 'custom';
  document.getElementById('newPageNameInput').value = '';
  document.querySelectorAll('.page-type-card').forEach(c => c.classList.remove('selected'));
  document.querySelector('.page-type-card[data-pagetype="custom"]')?.classList.add('selected');
  document.getElementById('addPageOverlay').classList.add('active');
}

document.getElementById('addPageBtn')?.addEventListener('click', openAddPageModal);
document.getElementById('addPageModalClose')?.addEventListener('click', () => {
  document.getElementById('addPageOverlay').classList.remove('active');
});

document.querySelectorAll('.page-type-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.page-type-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedPageType = card.dataset.pagetype;
    const meta = PAGE_TYPE_META[selectedPageType];
    const input = document.getElementById('newPageNameInput');
    if (!input.value || Object.values(PAGE_TYPE_META).some(m => m.name === input.value)) {
      input.value = meta?.name || '';
    }
  });
});

document.getElementById('confirmAddPage')?.addEventListener('click', () => {
  const name = document.getElementById('newPageNameInput').value.trim() || PAGE_TYPE_META[selectedPageType]?.name || 'New Page';
  addNewPage(selectedPageType, name);
  document.getElementById('addPageOverlay').classList.remove('active');
});

// Quick-add from sidebar page type list
document.querySelectorAll('.page-type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.pagetype;
    const meta = PAGE_TYPE_META[type] || PAGE_TYPE_META.custom;
    addNewPage(type, meta.name);
    // Switch sidebar to blocks tab
    document.querySelector('.sidebar-tab[data-tab="blocks"]')?.click();
  });
});

// ── OVERRIDE SAVE/LOAD TO USE PAGES ───────
// Patch scheduleSave to use savePagesToStorage
const _origScheduleSave = scheduleSave;
function scheduleSave() {
  clearTimeout(saveTimer);
  saveStatus.textContent = 'Saving…';
  saveStatus.className = 'save-status saving';
  saveTimer = setTimeout(() => {
    savePagesToStorage();
    saveStatus.textContent = 'All saved';
    saveStatus.className = 'save-status saved';
    setTimeout(() => { saveStatus.className = 'save-status'; }, 2000);
  }, 800);
}

// ── EXPORT: include all pages ──────────────
document.getElementById('exportPageCount') && (function(){
  const orig = document.getElementById('confirmExport').onclick;
  document.getElementById('exportBtn').addEventListener('click', () => {
    // Save current page first
    const idx = pages.findIndex(p => p.id === currentPageId);
    if (idx !== -1) pages[idx].html = canvas.innerHTML;
    document.getElementById('exportProjectName').textContent = projectNameInput.value;
    document.getElementById('exportPageCount').textContent = pages.length;
    document.getElementById('exportBlockCount').textContent = canvas.querySelectorAll('.block').length;
    document.getElementById('exportOverlay').classList.add('active');
  });
})();

// ── NEW SITE resets pages ──────────────────
document.getElementById('confirmNewSite')?.addEventListener('click', () => {
  pages = [{ id: 'home', name: 'Home', icon: '🏠', html: '' }];
  currentPageId = 'home';
  canvas.innerHTML = '';
  showCanvasEmpty();
  projectNameInput.value = 'My Site';
  renderPageTabs();
  renderPageList();
  localStorage.removeItem(STORAGE_KEY);
  document.getElementById('newSiteOverlay').classList.remove('active');
});

// ── INIT ──────────────────────────────────
const params      = new URLSearchParams(window.location.search);
const template    = params.get('template');
const fromOnboard = params.get('onboarding') === '1';

renderPageTabs();
renderPageList();

const loaded = loadPagesFromStorage();

captureHistory();

if (!loaded) {
  if (template && TEMPLATES[template] !== undefined) {
    loadTemplate(template);
    if (fromOnboard) applyOnboardingStyle();
  } else {
    const mode   = params.get('mode');
    const prompt = params.get('prompt');
    if (mode === 'ai' && prompt) {
      runAIBuilder(decodeURIComponent(prompt));
    }
  }
}


// ════════════════════════════════════════════
// NEW BLOCK TEMPLATES
// ════════════════════════════════════════════

blockTemplates['social-media'] = () => `
  <div class="block-social-media">
    <h2 contenteditable="true" spellcheck="false">Follow along</h2>
    <p contenteditable="true" spellcheck="false">Stay connected — we share updates, behind-the-scenes, and more.</p>
    <div class="social-links">
      <a class="social-link social-instagram" href="#" contenteditable="true" spellcheck="false">Instagram</a>
      <a class="social-link social-facebook"  href="#" contenteditable="true" spellcheck="false">Facebook</a>
      <a class="social-link social-tiktok"    href="#" contenteditable="true" spellcheck="false">TikTok</a>
      <a class="social-link social-youtube"   href="#" contenteditable="true" spellcheck="false">YouTube</a>
      <a class="social-link social-twitter"   href="#" contenteditable="true" spellcheck="false">X / Twitter</a>
      <a class="social-link social-linkedin"  href="#" contenteditable="true" spellcheck="false">LinkedIn</a>
    </div>
  </div>`;

blockTemplates['countdown'] = () => `
  <div class="block-countdown">
    <div class="countdown-eyebrow" contenteditable="true" spellcheck="false">Launching soon</div>
    <h2 contenteditable="true" spellcheck="false">Something big is coming.</h2>
    <p contenteditable="true" spellcheck="false">We're putting the finishing touches on something you're going to love.</p>
    <div class="countdown-timer" id="countdownTimer">
      <div class="countdown-unit"><div class="countdown-num" data-unit="days">00</div><div class="countdown-label">Days</div></div>
      <div class="countdown-sep">:</div>
      <div class="countdown-unit"><div class="countdown-num" data-unit="hours">00</div><div class="countdown-label">Hours</div></div>
      <div class="countdown-sep">:</div>
      <div class="countdown-unit"><div class="countdown-num" data-unit="mins">00</div><div class="countdown-label">Mins</div></div>
      <div class="countdown-sep">:</div>
      <div class="countdown-unit"><div class="countdown-num" data-unit="secs">00</div><div class="countdown-label">Secs</div></div>
    </div>
    <div class="countdown-date-wrap">
      <label style="font-size:11px;color:#B0A090;display:block;margin-bottom:4px;">Target date:</label>
      <input type="date" class="countdown-date-input" value="">
    </div>
  </div>`;

blockTemplates['carousel'] = () => `
  <div class="block-carousel">
    <h2 contenteditable="true" spellcheck="false">Featured</h2>
    <div class="carousel-wrap">
      <button class="carousel-btn carousel-prev">‹</button>
      <div class="carousel-track">
        <div class="carousel-slide active">
          <div class="carousel-slide-img">🖼</div>
          <div class="carousel-slide-caption" contenteditable="true" spellcheck="false">Slide one — click to edit</div>
        </div>
        <div class="carousel-slide">
          <div class="carousel-slide-img">🖼</div>
          <div class="carousel-slide-caption" contenteditable="true" spellcheck="false">Slide two — click to edit</div>
        </div>
        <div class="carousel-slide">
          <div class="carousel-slide-img">🖼</div>
          <div class="carousel-slide-caption" contenteditable="true" spellcheck="false">Slide three — click to edit</div>
        </div>
      </div>
      <button class="carousel-btn carousel-next">›</button>
    </div>
    <div class="carousel-dots">
      <span class="carousel-dot active"></span>
      <span class="carousel-dot"></span>
      <span class="carousel-dot"></span>
    </div>
  </div>`;

blockTemplates['map-embed'] = () => `
  <div class="block-map-embed">
    <h2 contenteditable="true" spellcheck="false">Find Us</h2>
    <p contenteditable="true" spellcheck="false">123 Main Street, Your City, ST 00000</p>
    <div class="map-placeholder">
      <div class="map-pin">📍</div>
      <div class="map-placeholder-text">Paste a Google Maps embed URL below to show your location</div>
      <input class="map-url-input" placeholder="https://www.google.com/maps/embed?pb=..." value="">
    </div>
  </div>`;

// ════════════════════════════════════════════
// DRAG & DROP REORDERING
// ════════════════════════════════════════════

let dragSrc = null;

function enableDrag(block) {
  block.setAttribute('draggable', 'true');

  block.addEventListener('dragstart', e => {
    dragSrc = block;
    block.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  });

  block.addEventListener('dragend', () => {
    block.classList.remove('dragging');
    canvas.querySelectorAll('.block').forEach(b => b.classList.remove('drag-over'));
    dragSrc = null;
    scheduleSave();
    captureHistory();
    renderLayersPanel();
  });

  block.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragSrc && dragSrc !== block) {
      canvas.querySelectorAll('.block').forEach(b => b.classList.remove('drag-over'));
      block.classList.add('drag-over');
    }
  });

  block.addEventListener('drop', e => {
    e.preventDefault();
    if (dragSrc && dragSrc !== block) {
      const blocks = [...canvas.querySelectorAll('.block')];
      const srcIdx = blocks.indexOf(dragSrc);
      const tgtIdx = blocks.indexOf(block);
      if (srcIdx < tgtIdx) canvas.insertBefore(dragSrc, block.nextSibling);
      else canvas.insertBefore(dragSrc, block);
      block.classList.remove('drag-over');
    }
  });
}

// ════════════════════════════════════════════
// RIGHT-CLICK CONTEXT MENU
// ════════════════════════════════════════════

let contextTarget = null;
let copiedStyle = null;

const contextMenu = document.getElementById('contextMenu');

function showContextMenu(e, block) {
  e.preventDefault();
  contextTarget = block;
  contextMenu.style.left = Math.min(e.clientX, window.innerWidth - 200) + 'px';
  contextMenu.style.top  = Math.min(e.clientY, window.innerHeight - 300) + 'px';
  contextMenu.classList.add('active');
  const pasteBtn = contextMenu.querySelector('[data-ctx="paste-style"]');
  if (pasteBtn) pasteBtn.style.opacity = copiedStyle ? '1' : '0.4';
}

document.addEventListener('click', () => contextMenu.classList.remove('active'));
document.addEventListener('keydown', e => { if (e.key === 'Escape') contextMenu.classList.remove('active'); });

contextMenu.querySelectorAll('.ctx-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    contextMenu.classList.remove('active');
    if (!contextTarget) return;
    const action = btn.dataset.ctx;
    const inner = contextTarget.querySelector('[class^="block-"]');

    if (action === 'duplicate')    duplicateBlock(contextTarget);
    if (action === 'delete')       deleteBlock(contextTarget);
    if (action === 'move-up')      moveBlock(contextTarget, 'up');
    if (action === 'move-down')    moveBlock(contextTarget, 'down');
    if (action === 'copy-style') {
      if (inner) {
        copiedStyle = { bg: inner.style.backgroundColor || inner.style.background, color: inner.style.color, font: inner.style.fontFamily, padding: inner.style.padding };
        showToast('Style copied!');
      }
    }
    if (action === 'paste-style') {
      if (inner && copiedStyle) {
        if (copiedStyle.bg)      { inner.style.background = copiedStyle.bg; inner.style.backgroundColor = copiedStyle.bg; }
        if (copiedStyle.color)   inner.style.color = copiedStyle.color;
        if (copiedStyle.font)    inner.style.fontFamily = copiedStyle.font;
        if (copiedStyle.padding) inner.style.padding = copiedStyle.padding;
        scheduleSave(); captureHistory(); showToast('Style pasted!');
      }
    }
    if (action === 'save-template') saveBlockAsTemplate(contextTarget);
    if (action === 'set-anchor') {
      const current = contextTarget.dataset.anchorId || '';
      const id = prompt('Set anchor ID (used for internal links, e.g. "contact"):', current);
      if (id !== null) { contextTarget.dataset.anchorId = id.toLowerCase().replace(/\s+/g, '-'); showToast(`Anchor set: #${id}`); }
    }
    if (action === 'set-bg-image') {
      const url = prompt('Enter background image URL:', inner?.style.backgroundImage?.replace(/url\(["']?|["']?\)/g,'') || '');
      if (url !== null && inner) {
        inner.style.backgroundImage = url ? `url("${url}")` : '';
        inner.style.backgroundSize  = url ? 'cover' : '';
        inner.style.backgroundPosition = url ? 'center' : '';
        scheduleSave(); captureHistory();
      }
    }
  });
});

// ════════════════════════════════════════════
// SAVE BLOCK AS TEMPLATE
// ════════════════════════════════════════════

const CUSTOM_TEMPLATES_KEY = 'trellis_custom_templates';

function saveBlockAsTemplate(block) {
  const name = prompt('Name this template:', block.dataset.type + ' template');
  if (!name) return;
  const inner = block.querySelector('[class^="block-"]');
  if (!inner) return;
  const templates = JSON.parse(localStorage.getItem(CUSTOM_TEMPLATES_KEY) || '[]');
  templates.push({ name, type: block.dataset.type, html: inner.outerHTML, id: Date.now() });
  localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
  renderSavedTemplates();
  showToast('Template saved!');
}

function renderSavedTemplates() {
  const templates = JSON.parse(localStorage.getItem(CUSTOM_TEMPLATES_KEY) || '[]');
  const section = document.getElementById('savedTemplatesSection');
  const list = document.getElementById('savedTemplatesList');
  if (!section || !list) return;
  if (templates.length === 0) { section.style.display = 'none'; return; }
  section.style.display = 'block';
  list.innerHTML = '';
  templates.forEach(t => {
    const btn = document.createElement('div');
    btn.className = 'saved-template-item';
    btn.innerHTML = `<span class="saved-template-name">⭐ ${t.name}</span><button class="saved-template-del" data-id="${t.id}">✕</button>`;
    btn.querySelector('.saved-template-name').addEventListener('click', () => {
      addBlock(t.type, t.html);
    });
    btn.querySelector('.saved-template-del').addEventListener('click', e => {
      e.stopPropagation();
      const updated = JSON.parse(localStorage.getItem(CUSTOM_TEMPLATES_KEY) || '[]').filter(x => x.id !== t.id);
      localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(updated));
      renderSavedTemplates();
    });
    list.appendChild(btn);
  });
}

// ════════════════════════════════════════════
// VERSION HISTORY
// ════════════════════════════════════════════

const VERSION_KEY = 'trellis_versions';
const MAX_VERSIONS = 20;

function saveVersion(label) {
  const idx = pages.findIndex(p => p.id === currentPageId);
  if (idx !== -1) pages[idx].html = canvas.innerHTML;
  const versions = JSON.parse(localStorage.getItem(VERSION_KEY) || '[]');
  versions.unshift({
    id: Date.now(),
    label: label || 'Manual save',
    timestamp: Date.now(),
    pagesSnapshot: JSON.parse(JSON.stringify(pages)),
    projectName: projectNameInput.value
  });
  if (versions.length > MAX_VERSIONS) versions.splice(MAX_VERSIONS);
  localStorage.setItem(VERSION_KEY, JSON.stringify(versions));
  renderVersionList();
  showToast('Version saved!');
}

function renderVersionList() {
  const list = document.getElementById('versionList');
  if (!list) return;
  const versions = JSON.parse(localStorage.getItem(VERSION_KEY) || '[]');
  if (versions.length === 0) { list.innerHTML = '<p style="font-size:13px;color:#B0A090;text-align:center;padding:20px;">No versions saved yet.</p>'; return; }
  list.innerHTML = '';
  versions.forEach((v, i) => {
    const d = new Date(v.timestamp);
    const timeStr = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const row = document.createElement('div');
    row.className = 'version-row';
    row.innerHTML = `
      <div class="version-info">
        <div class="version-label">${v.label}${i === 0 ? ' <span class="version-badge">Latest</span>' : ''}</div>
        <div class="version-time">${timeStr} · ${v.projectName}</div>
      </div>
      <button class="version-restore-btn">Restore</button>`;
    row.querySelector('.version-restore-btn').addEventListener('click', () => {
      if (!confirm('Restore this version? Your current work will be replaced.')) return;
      pages = v.pagesSnapshot;
      currentPageId = pages[0]?.id || 'home';
      projectNameInput.value = v.projectName;
      const page = pages.find(p => p.id === currentPageId);
      if (page) {
        canvas.innerHTML = page.html || '';
        canvas.querySelectorAll('.block').forEach(b => attachBlockBehavior(b));
      }
      renderPageTabs(); renderPageList();
      document.getElementById('historyOverlay').classList.remove('active');
      scheduleSave(); captureHistory(); showToast('Version restored!');
    });
    list.appendChild(row);
  });
}

document.getElementById('historyBtn')?.addEventListener('click', () => {
  renderVersionList();
  document.getElementById('historyOverlay').classList.add('active');
});
document.getElementById('historyClose')?.addEventListener('click', () => document.getElementById('historyOverlay').classList.remove('active'));

// ════════════════════════════════════════════
// BRAND KIT
// ════════════════════════════════════════════

const BRAND_KIT_KEY = 'trellis_brandkit';
const ALL_FONTS = [
  { label: 'DM Sans (default)',    value: "'DM Sans', sans-serif" },
  { label: 'Inter',                value: "'Inter', sans-serif" },
  { label: 'Poppins',              value: "'Poppins', sans-serif" },
  { label: 'Montserrat',           value: "'Montserrat', sans-serif" },
  { label: 'Raleway',              value: "'Raleway', sans-serif" },
  { label: 'Nunito',               value: "'Nunito', sans-serif" },
  { label: 'Lato',                 value: "'Lato', sans-serif" },
  { label: 'Oswald',               value: "'Oswald', sans-serif" },
  { label: 'Space Grotesk',        value: "'Space Grotesk', sans-serif" },
  { label: 'Instrument Serif',     value: "'Instrument Serif', serif" },
  { label: 'Merriweather',         value: "'Merriweather', serif" },
  { label: 'Playfair Display',     value: "'Playfair Display', serif" },
  { label: 'Georgia',              value: "Georgia, serif" },
  { label: 'System UI',            value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  { label: 'Courier New (mono)',   value: "'Courier New', monospace" }
];

function loadBrandKit() {
  return JSON.parse(localStorage.getItem(BRAND_KIT_KEY) || '{"name":"","colors":["#2D2416","#4A7C59","#D4956A"],"font":""}');
}

function renderBrandKit() {
  const kit = loadBrandKit();
  document.getElementById('brandName').value = kit.name || '';
  document.getElementById('brandFont').value = kit.font || '';

  const select = document.getElementById('brandFont');
  select.innerHTML = '<option value="">— Choose a font —</option>';
  ALL_FONTS.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.value;
    opt.textContent = f.label;
    opt.style.fontFamily = f.value;
    if (f.value === kit.font) opt.selected = true;
    select.appendChild(opt);
  });

  const row = document.getElementById('brandColorRow');
  row.innerHTML = '';
  (kit.colors || []).forEach((c, i) => {
    const swatch = document.createElement('div');
    swatch.className = 'brand-color-swatch';
    swatch.style.background = c;
    swatch.title = c;
    const del = document.createElement('button');
    del.className = 'brand-color-del';
    del.textContent = '✕';
    del.addEventListener('click', () => {
      const k2 = loadBrandKit();
      k2.colors.splice(i, 1);
      localStorage.setItem(BRAND_KIT_KEY, JSON.stringify(k2));
      renderBrandKit();
    });
    swatch.appendChild(del);
    row.appendChild(swatch);
  });
}

document.getElementById('addBrandColor')?.addEventListener('click', () => {
  const hex = prompt('Enter a hex color (e.g. #FF5500):', '#');
  if (hex && /^#[0-9A-Fa-f]{6}$/.test(hex)) {
    const kit = loadBrandKit();
    kit.colors.push(hex);
    localStorage.setItem(BRAND_KIT_KEY, JSON.stringify(kit));
    renderBrandKit();
  }
});

document.getElementById('brandKitSave')?.addEventListener('click', () => {
  const kit = loadBrandKit();
  kit.name = document.getElementById('brandName').value;
  kit.font = document.getElementById('brandFont').value;
  localStorage.setItem(BRAND_KIT_KEY, JSON.stringify(kit));
  document.getElementById('brandKitOverlay').classList.remove('active');
  showToast('Brand kit saved!');
});

document.getElementById('brandKitApply')?.addEventListener('click', () => {
  const kit = loadBrandKit();
  canvas.querySelectorAll('.block').forEach(block => {
    const inner = block.querySelector('[class^="block-"]');
    if (!inner) return;
    if (kit.font) inner.style.fontFamily = kit.font;
  });
  if (kit.name) {
    canvas.querySelectorAll('.nb-logo, .footer-logo').forEach(el => el.textContent = kit.name);
  }
  scheduleSave(); captureHistory();
  document.getElementById('brandKitOverlay').classList.remove('active');
  showToast('Brand kit applied!');
});

document.getElementById('brandKitBtn')?.addEventListener('click', () => {
  renderBrandKit();
  document.getElementById('brandKitOverlay').classList.add('active');
});
document.getElementById('brandKitClose')?.addEventListener('click', () => document.getElementById('brandKitOverlay').classList.remove('active'));

// ════════════════════════════════════════════
// SEO SETTINGS PER PAGE
// ════════════════════════════════════════════

document.getElementById('seoBtn')?.addEventListener('click', () => {
  const page = pages.find(p => p.id === currentPageId);
  if (page?.seo) {
    document.getElementById('seoTitle').value     = page.seo.title || '';
    document.getElementById('seoDesc').value      = page.seo.desc || '';
    document.getElementById('seoOgImage').value   = page.seo.ogImage || '';
    document.getElementById('seoCanonical').value = page.seo.canonical || '';
  } else {
    ['seoTitle','seoDesc','seoOgImage','seoCanonical'].forEach(id => { document.getElementById(id).value = ''; });
  }
  document.getElementById('seoOverlay').classList.add('active');
});
document.getElementById('seoModalClose')?.addEventListener('click', () => document.getElementById('seoOverlay').classList.remove('active'));
document.getElementById('seoSave')?.addEventListener('click', () => {
  const page = pages.find(p => p.id === currentPageId);
  if (page) {
    page.seo = {
      title:     document.getElementById('seoTitle').value,
      desc:      document.getElementById('seoDesc').value,
      ogImage:   document.getElementById('seoOgImage').value,
      canonical: document.getElementById('seoCanonical').value
    };
  }
  scheduleSave();
  document.getElementById('seoOverlay').classList.remove('active');
  showToast('SEO settings saved!');
});

// ════════════════════════════════════════════
// ZOOM
// ════════════════════════════════════════════

let zoomLevel = 1.0;
const ZOOM_STEPS = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.25, 1.5];

function applyZoom() {
  const frame = document.getElementById('canvasFrame');
  if (frame) {
    frame.style.transform = `scale(${zoomLevel})`;
    frame.style.transformOrigin = 'top center';
    frame.style.marginBottom = zoomLevel < 1 ? `${(zoomLevel - 1) * frame.offsetHeight}px` : '0';
  }
  document.getElementById('zoomLabel').textContent = Math.round(zoomLevel * 100) + '%';
}

document.getElementById('zoomIn')?.addEventListener('click', () => {
  const idx = ZOOM_STEPS.indexOf(zoomLevel);
  if (idx < ZOOM_STEPS.length - 1) { zoomLevel = ZOOM_STEPS[idx + 1]; applyZoom(); }
});
document.getElementById('zoomOut')?.addEventListener('click', () => {
  const idx = ZOOM_STEPS.indexOf(zoomLevel);
  if (idx > 0) { zoomLevel = ZOOM_STEPS[idx - 1]; applyZoom(); }
});

// ════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ════════════════════════════════════════════

document.getElementById('shortcutsBtn')?.addEventListener('click', () => document.getElementById('shortcutsOverlay').classList.add('active'));
document.getElementById('shortcutsClose')?.addEventListener('click', () => document.getElementById('shortcutsOverlay').classList.remove('active'));

document.addEventListener('keydown', e => {
  const ctrl = e.ctrlKey || e.metaKey;
  if (ctrl && e.key === 's') { e.preventDefault(); saveVersion('Manual save — Ctrl S'); }
  if (ctrl && e.key === 'd' && selectedBlock) { e.preventDefault(); duplicateBlock(selectedBlock); }
  if (ctrl && e.key === 'p') { e.preventDefault(); document.getElementById('previewBtn')?.click(); }
  if (ctrl && e.key === '=' || (ctrl && e.key === '+')) { e.preventDefault(); document.getElementById('zoomIn')?.click(); }
  if (ctrl && e.key === '-') { e.preventDefault(); document.getElementById('zoomOut')?.click(); }
  if (ctrl && e.key === '0') { e.preventDefault(); zoomLevel = 1.0; applyZoom(); }
  if (ctrl && e.key === 'ArrowUp'   && selectedBlock) { e.preventDefault(); moveBlock(selectedBlock, 'up'); }
  if (ctrl && e.key === 'ArrowDown' && selectedBlock) { e.preventDefault(); moveBlock(selectedBlock, 'down'); }
  if ((e.key === 'Delete' || e.key === 'Backspace') && selectedBlock && !e.target.isContentEditable && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
    e.preventDefault(); deleteBlock(selectedBlock);
  }
  if (e.key === 'Escape') {
    selectedBlock?.classList.remove('selected');
    selectedBlock = null;
    propertiesPanel.style.display = 'none';
    contextMenu.classList.remove('active');
  }
});

// ════════════════════════════════════════════
// BLOCK SEARCH
// ════════════════════════════════════════════

document.getElementById('blockSearch')?.addEventListener('input', e => {
  const q = e.target.value.toLowerCase().trim();
  document.querySelectorAll('.block-btn').forEach(btn => {
    const match = !q || btn.textContent.toLowerCase().includes(q) || btn.dataset.type.toLowerCase().includes(q);
    btn.style.display = match ? '' : 'none';
  });
  document.querySelectorAll('#tabBlocks .sidebar-section').forEach(sec => {
    if (sec.id === 'savedTemplatesSection') return;
    const visible = [...sec.querySelectorAll('.block-btn')].some(b => b.style.display !== 'none');
    sec.style.display = (q && !visible) ? 'none' : '';
  });
});

// ════════════════════════════════════════════
// LAYERS PANEL
// ════════════════════════════════════════════

function renderLayersPanel() {
  const list = document.getElementById('layersList');
  if (!list) return;
  list.innerHTML = '';
  const blocks = [...canvas.querySelectorAll('.block')];
  if (blocks.length === 0) {
    list.innerHTML = '<div style="font-size:12px;color:#B0A090;padding:8px 4px;">No blocks yet.</div>';
    return;
  }
  [...blocks].reverse().forEach((block, ri) => {
    const i = blocks.length - 1 - ri;
    const type = block.dataset.type;
    const icon = { navbar:'☰', hero:'⬛', text:'T', image:'🖼', gallery:'⊟', columns:'⊞', testimonials:'❝', cta:'→', footer:'▬', divider:'—', spacer:'↕', 'product-grid':'🛍', pricing:'💲', 'buy-button':'⚡', faq:'?', features:'✦', stats:'#', team:'👥', video:'▶', 'logo-bar':'◈', 'cart-summary':'🛒', 'contact-form':'✉', 'email-signup':'📬', 'social-media':'📲', countdown:'⏱', carousel:'⊡', 'map-embed':'📍' }[type] || '□';
    const row = document.createElement('div');
    row.className = 'layer-row' + (block === selectedBlock ? ' active' : '');
    row.innerHTML = `<span class="layer-icon">${icon}</span><span class="layer-name">${type}</span><span class="layer-idx">${i + 1}</span>`;
    row.addEventListener('click', () => { selectBlock(block); block.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
    list.appendChild(row);
  });
}

// ════════════════════════════════════════════
// MULTI-SELECT
// ════════════════════════════════════════════

let multiSelected = [];

function selectBlock(block) {
  canvas.querySelectorAll('.block').forEach(b => b.classList.remove('selected'));
  multiSelected = [];
  selectedBlock = block;
  block.classList.add('selected');
  showProperties(block);
  renderLayersPanel();
}

canvas.addEventListener('click', e => {
  if (e.ctrlKey || e.metaKey) {
    const block = e.target.closest('.block');
    if (block) {
      block.classList.toggle('selected');
      if (block.classList.contains('selected')) multiSelected.push(block);
      else multiSelected = multiSelected.filter(b => b !== block);
      return;
    }
  }
});

// ════════════════════════════════════════════
// HOVER EFFECTS (CSS classes on blocks)
// ════════════════════════════════════════════

const HOVER_EFFECTS = [
  { label: 'None',   value: '' },
  { label: 'Lift',   value: 'hover-lift' },
  { label: 'Fade',   value: 'hover-fade' },
  { label: 'Zoom',   value: 'hover-zoom' },
  { label: 'Shadow', value: 'hover-shadow' }
];

// Injected into showProperties — see extended properties section below

// ════════════════════════════════════════════
// AUTOSAVE WITH TIMESTAMP
// ════════════════════════════════════════════

function updateSaveTimestamp() {
  const versions = JSON.parse(localStorage.getItem(VERSION_KEY) || '[]');
  if (versions.length === 0) return;
  const last = versions[0].timestamp;
  const diff = Math.round((Date.now() - last) / 60000);
  const label = diff < 1 ? 'just now' : diff === 1 ? '1 min ago' : diff + ' min ago';
  if (saveStatus.textContent === 'All saved' || saveStatus.textContent.includes('ago')) {
    saveStatus.textContent = 'Saved ' + label;
  }
}
setInterval(updateSaveTimestamp, 60000);

// ════════════════════════════════════════════
// TOAST NOTIFICATION
// ════════════════════════════════════════════

function showToast(msg) {
  let toast = document.getElementById('sf-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'sf-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ════════════════════════════════════════════
// PATCH attachBlockBehavior TO ADD NEW SYSTEMS
// ════════════════════════════════════════════

const _origAttachBlockBehavior = attachBlockBehavior;
function attachBlockBehavior(block) {
  _origAttachBlockBehavior(block);

  // Drag & drop
  enableDrag(block);

  // Right-click context menu
  block.addEventListener('contextmenu', e => {
    e.stopPropagation();
    showContextMenu(e, block);
  });

  // Carousel behavior
  if (block.dataset.type === 'carousel') {
    initCarousel(block);
  }

  // Countdown behavior
  if (block.dataset.type === 'countdown') {
    initCountdown(block);
  }
}

// ════════════════════════════════════════════
// PATCH addBlock TO RENDER LAYERS
// ════════════════════════════════════════════

const _origAddBlock = addBlock;
function addBlock(type, savedHTML = null) {
  _origAddBlock(type, savedHTML);
  renderLayersPanel();
}

// ════════════════════════════════════════════
// PATCH showProperties WITH EXTENDED OPTIONS
// ════════════════════════════════════════════

const _origShowProperties = showProperties;
function showProperties(block) {
  _origShowProperties(block);

  // Add extended font options below existing font section
  const propsContent = document.getElementById('propertiesContent');
  if (!propsContent) return;

  // Rebuild font selector with full font list
  const fontSection = propsContent.querySelector('.style-section:nth-of-type(3)');
  if (fontSection) {
    const inner = block.querySelector('[class^="block-"]');
    const curFont = inner?.style.fontFamily || '';
    fontSection.innerHTML = `<div class="style-label">Font</div>
      <select class="prop-input extended-font-select" id="extFontSelect" style="margin-top:6px;">
        ${ALL_FONTS.map(f => `<option value="${f.value}" style="font-family:${f.value}" ${curFont.includes(f.value.split(',')[0].replace(/'/g,'').trim()) ? 'selected' : ''}>${f.label}</option>`).join('')}
      </select>`;
    document.getElementById('extFontSelect')?.addEventListener('change', e => {
      if (inner) inner.style.fontFamily = e.target.value;
      scheduleSave();
    });
  }

  // Add hover effect section
  const hoverCurr = block.dataset.hoverEffect || '';
  const hoverHTML = `<div class="style-section" style="margin-top:0;">
    <div class="style-label">Hover Effect</div>
    <div class="toggle-row" style="margin-top:6px;">
      ${HOVER_EFFECTS.map(h => `<button class="toggle-btn${hoverCurr === h.value ? ' active' : ''}" data-hover="${h.value}">${h.label}</button>`).join('')}
    </div>
  </div>`;

  // Add sticky toggle for navbar
  let extraHTML = hoverHTML;
  if (block.dataset.type === 'navbar') {
    const isSticky = block.dataset.sticky === 'true';
    extraHTML += `<div class="style-section">
      <div class="style-label">Sticky Navbar</div>
      <div class="toggle-row" style="margin-top:6px;">
        <button class="toggle-btn${!isSticky ? ' active' : ''}" data-sticky="false">Off</button>
        <button class="toggle-btn${isSticky ? ' active' : ''}" data-sticky="true">On</button>
      </div>
    </div>`;
  }

  // Add anchor ID field
  extraHTML += `<div class="style-section">
    <div class="style-label">Anchor ID</div>
    <input class="prop-input" id="anchorInput" placeholder="e.g. contact" value="${block.dataset.anchorId || ''}" style="margin-top:6px;">
    <div style="font-size:11px;color:#B0A090;margin-top:4px;">Link to this block with <code>#${block.dataset.anchorId || 'id'}</code></div>
  </div>`;

  // Add background image field
  const inner2 = block.querySelector('[class^="block-"]');
  const curBgImg = inner2?.style.backgroundImage?.replace(/url\(["']?|["']?\)/g,'') || '';
  extraHTML += `<div class="style-section">
    <div class="style-label">Background Image URL</div>
    <input class="prop-input" id="bgImageInput" placeholder="https://..." value="${curBgImg}" style="margin-top:6px;">
  </div>`;

  // Add save as template + copy style buttons
  extraHTML += `<div style="display:flex;gap:8px;margin-bottom:8px;">
    <button class="delete-btn" id="copyStyleBtn" style="background:#EEF5E8;color:#4A7C59;border-color:#C4D9B0;">Copy Style</button>
    <button class="delete-btn" id="pasteStyleBtn" style="background:#F5EFE6;color:#7A6B5A;border-color:#E0D5C5;">Paste Style</button>
  </div>
  <button class="delete-btn" id="saveTemplateBtn" style="background:#FDF4EC;color:#D4956A;border-color:#F2DCC8;margin-bottom:8px;">⭐ Save as Template</button>`;

  // Inject into properties
  const deleteBtn = propsContent.querySelector('#deletePropBtn');
  if (deleteBtn) {
    deleteBtn.insertAdjacentHTML('beforebegin', extraHTML);
  } else {
    propsContent.insertAdjacentHTML('beforeend', extraHTML);
  }

  // Wire hover effects
  propsContent.querySelectorAll('[data-hover]').forEach(btn => {
    btn.addEventListener('click', () => {
      HOVER_EFFECTS.forEach(h => block.classList.remove(h.value));
      if (btn.dataset.hover) block.classList.add(btn.dataset.hover);
      block.dataset.hoverEffect = btn.dataset.hover;
      propsContent.querySelectorAll('[data-hover]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      scheduleSave();
    });
  });

  // Wire sticky
  propsContent.querySelectorAll('[data-sticky]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.sticky === 'true';
      block.dataset.sticky = val;
      const inner = block.querySelector('.block-navbar');
      if (inner) {
        inner.style.position = val ? 'sticky' : '';
        inner.style.top = val ? '0' : '';
        inner.style.zIndex = val ? '100' : '';
      }
      propsContent.querySelectorAll('[data-sticky]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      scheduleSave();
    });
  });

  // Wire anchor
  document.getElementById('anchorInput')?.addEventListener('input', e => {
    block.dataset.anchorId = e.target.value.toLowerCase().replace(/\s+/g,'-');
    block.id = block.dataset.anchorId || '';
  });

  // Wire bg image
  document.getElementById('bgImageInput')?.addEventListener('input', e => {
    const inner = block.querySelector('[class^="block-"]');
    if (!inner) return;
    const url = e.target.value.trim();
    inner.style.backgroundImage = url ? `url("${url}")` : '';
    inner.style.backgroundSize  = url ? 'cover' : '';
    inner.style.backgroundPosition = url ? 'center' : '';
    scheduleSave();
  });

  // Wire copy/paste style
  document.getElementById('copyStyleBtn')?.addEventListener('click', () => {
    const inner = block.querySelector('[class^="block-"]');
    if (inner) { copiedStyle = { bg: inner.style.backgroundColor || inner.style.background, color: inner.style.color, font: inner.style.fontFamily, padding: inner.style.padding }; showToast('Style copied!'); }
  });
  document.getElementById('pasteStyleBtn')?.addEventListener('click', () => {
    const inner = block.querySelector('[class^="block-"]');
    if (inner && copiedStyle) {
      if (copiedStyle.bg) { inner.style.background = copiedStyle.bg; inner.style.backgroundColor = copiedStyle.bg; }
      if (copiedStyle.color)   inner.style.color = copiedStyle.color;
      if (copiedStyle.font)    inner.style.fontFamily = copiedStyle.font;
      if (copiedStyle.padding) inner.style.padding = copiedStyle.padding;
      scheduleSave(); captureHistory(); showToast('Style pasted!');
    }
  });
  document.getElementById('saveTemplateBtn')?.addEventListener('click', () => saveBlockAsTemplate(block));
}

// ════════════════════════════════════════════
// CAROUSEL LOGIC
// ════════════════════════════════════════════

function initCarousel(block) {
  let current = 0;
  const slides = block.querySelectorAll('.carousel-slide');
  const dots   = block.querySelectorAll('.carousel-dot');

  function goTo(i) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  block.querySelector('.carousel-prev')?.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });
  block.querySelector('.carousel-next')?.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });
  dots.forEach((dot, i) => dot.addEventListener('click', e => { e.stopPropagation(); goTo(i); }));
}

// ════════════════════════════════════════════
// COUNTDOWN LOGIC
// ════════════════════════════════════════════

function initCountdown(block) {
  const dateInput = block.querySelector('.countdown-date-input');
  if (!dateInput) return;

  function tick() {
    const target = new Date(dateInput.value);
    if (!dateInput.value || isNaN(target)) return;
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) {
      block.querySelectorAll('.countdown-num').forEach(el => el.textContent = '00');
      return;
    }
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);
    block.querySelector('[data-unit="days"]').textContent  = String(days).padStart(2,'0');
    block.querySelector('[data-unit="hours"]').textContent = String(hours).padStart(2,'0');
    block.querySelector('[data-unit="mins"]').textContent  = String(mins).padStart(2,'0');
    block.querySelector('[data-unit="secs"]').textContent  = String(secs).padStart(2,'0');
  }

  tick();
  const interval = setInterval(tick, 1000);
  block._countdownInterval = interval;
}

// ════════════════════════════════════════════
// DELETE BLOCK PATCH (clean up intervals)
// ════════════════════════════════════════════

const _origDeleteBlock = deleteBlock;
function deleteBlock(block) {
  if (block._countdownInterval) clearInterval(block._countdownInterval);
  _origDeleteBlock(block);
  renderLayersPanel();
}

// ════════════════════════════════════════════
// MOVE BLOCK FIX (was broken with 'up'/'down')
// ════════════════════════════════════════════

function moveBlock(block, dir) {
  const blocks = [...canvas.querySelectorAll('.block')];
  const idx = blocks.indexOf(block);
  if (dir === 'up' || dir === -1) {
    if (idx <= 0) return;
    canvas.insertBefore(block, blocks[idx - 1]);
  } else {
    if (idx >= blocks.length - 1) return;
    canvas.insertBefore(blocks[idx + 1], block);
  }
  scheduleSave();
  captureHistory();
  renderLayersPanel();
}

// ════════════════════════════════════════════
// INIT NEW FEATURES
// ════════════════════════════════════════════

renderSavedTemplates();

// Add new block buttons to sidebar HTML dynamically
(function addNewBlockButtons() {
  const newBlocks = [
    { section: 'Social Proof', type: 'social-media', icon: '📲', label: 'Social Media' },
    { section: 'Content',      type: 'countdown',    icon: '⏱',  label: 'Countdown' },
    { section: 'Media',        type: 'carousel',     icon: '⊡',  label: 'Carousel' },
    { section: 'Content',      type: 'map-embed',    icon: '📍',  label: 'Map Embed' }
  ];
  newBlocks.forEach(({ type, icon, label }) => {
    if (!document.querySelector(`.block-btn[data-type="${type}"]`)) {
      const btn = document.createElement('button');
      btn.className = 'block-btn';
      btn.dataset.type = type;
      btn.innerHTML = `<span class="block-icon">${icon}</span>${label}`;
      btn.addEventListener('click', () => addBlock(type));
      // Append to last block-list in the sidebar
      const lists = document.querySelectorAll('#tabBlocks .block-list');
      if (lists.length > 0) lists[lists.length - 1].appendChild(btn);
    }
  });
})();


// ════════════════════════════════════════════
// LIGHTBOX
// ════════════════════════════════════════════

(function initLightbox() {
  const lb = document.createElement('div');
  lb.id = 'sf-lightbox';
  lb.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-content">
      <button class="lb-close">✕</button>
      <img class="lb-img" src="" alt="">
    </div>`;
  document.body.appendChild(lb);

  lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lb.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
})();

function openLightbox(src) {
  const lb = document.getElementById('sf-lightbox');
  if (!lb) return;
  lb.querySelector('.lb-img').src = src;
  lb.classList.add('active');
}

function closeLightbox() {
  document.getElementById('sf-lightbox')?.classList.remove('active');
}

// Wire lightbox to uploaded images (patch attachBlockBehavior)
const _attachForLightbox = attachBlockBehavior;
function attachBlockBehavior(block) {
  _attachForLightbox(block);
  block.querySelectorAll('img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', e => { e.stopPropagation(); openLightbox(img.src); });
  });
}

// ════════════════════════════════════════════
// NEW BLOCK: BACKGROUND VIDEO HERO
// ════════════════════════════════════════════

blockTemplates['video-hero'] = () => `
  <div class="block-video-hero">
    <div class="video-hero-overlay"></div>
    <div class="video-hero-content">
      <h1 contenteditable="true" spellcheck="false">Your story in motion.</h1>
      <p contenteditable="true" spellcheck="false">A powerful headline backed by a full-screen video background.</p>
      <button class="video-hero-btn" contenteditable="true" spellcheck="false">Get Started</button>
    </div>
    <div class="video-hero-setup">
      <div class="video-hero-label">📹 Background Video URL</div>
      <input class="video-hero-url" placeholder="Paste an MP4 video URL (e.g. from Cloudinary or your own host)" value="">
      <div class="video-hero-note">Direct .mp4 links work best. YouTube/Vimeo links won't autoplay as backgrounds.</div>
    </div>
  </div>`;

// Wire video hero URL input
const _origAttachForVideo = attachBlockBehavior;
function attachBlockBehavior(block) {
  _origAttachForVideo(block);
  if (block.dataset.type === 'video-hero') {
    const input = block.querySelector('.video-hero-url');
    if (!input) return;
    input.addEventListener('change', () => {
      const url = input.value.trim();
      let vid = block.querySelector('.video-hero-bg');
      if (url) {
        if (!vid) {
          vid = document.createElement('video');
          vid.className = 'video-hero-bg';
          vid.autoplay = true;
          vid.loop = true;
          vid.muted = true;
          vid.playsInline = true;
          block.querySelector('.block-video-hero').prepend(vid);
        }
        vid.src = url;
        vid.play().catch(() => {});
      } else if (vid) {
        vid.remove();
      }
      scheduleSave();
    });
  }
}

// ════════════════════════════════════════════
// NEW BLOCK: COOKIE CONSENT BANNER
// ════════════════════════════════════════════

blockTemplates['cookie-banner'] = () => `
  <div class="block-cookie-banner">
    <div class="cookie-banner-inner">
      <div class="cookie-banner-text">
        <div class="cookie-banner-title" contenteditable="true" spellcheck="false">🍪 We use cookies</div>
        <div class="cookie-banner-desc" contenteditable="true" spellcheck="false">We use cookies to improve your experience on our site. By continuing, you agree to our use of cookies.</div>
      </div>
      <div class="cookie-banner-actions">
        <button class="cookie-btn cookie-accept" contenteditable="true" spellcheck="false">Accept All</button>
        <button class="cookie-btn cookie-decline" contenteditable="true" spellcheck="false">Decline</button>
      </div>
    </div>
  </div>`;

// ════════════════════════════════════════════
// NEW BLOCK: POPUP / MODAL BUILDER
// ════════════════════════════════════════════

blockTemplates['popup'] = () => `
  <div class="block-popup-builder">
    <div class="popup-builder-label">Pop-up Block — appears as an overlay on your live site</div>
    <div class="popup-preview">
      <div class="popup-mock">
        <button class="popup-mock-close">✕</button>
        <h3 contenteditable="true" spellcheck="false">Don't miss out!</h3>
        <p contenteditable="true" spellcheck="false">Sign up for exclusive deals and be the first to know about new arrivals.</p>
        <div class="popup-email-row">
          <div class="popup-email-mock">Your email address</div>
          <button class="popup-submit-btn" contenteditable="true" spellcheck="false">Subscribe</button>
        </div>
        <div class="popup-skip" contenteditable="true" spellcheck="false">No thanks</div>
      </div>
    </div>
    <div class="popup-settings">
      <label style="font-size:12px;color:#7A6B5A;font-weight:600;">Show after</label>
      <select class="popup-delay-select">
        <option value="0">Immediately</option>
        <option value="3">3 seconds</option>
        <option value="5" selected>5 seconds</option>
        <option value="10">10 seconds</option>
        <option value="exit">On exit intent</option>
      </select>
    </div>
  </div>`;

// ════════════════════════════════════════════
// PARALLAX SCROLLING OPTION
// ════════════════════════════════════════════

function initParallax() {
  window.addEventListener('scroll', () => {
    canvas.querySelectorAll('.block[data-parallax="true"]').forEach(block => {
      const inner = block.querySelector('[class^="block-"]');
      if (!inner || !inner.style.backgroundImage) return;
      const rect = block.getBoundingClientRect();
      const offset = (rect.top / window.innerHeight) * 30;
      inner.style.backgroundPositionY = `calc(50% + ${offset}px)`;
    });
  });
}
initParallax();

// ════════════════════════════════════════════
// PASSWORD PROTECTION PER PAGE
// ════════════════════════════════════════════

function setPagePassword(pageId, password) {
  const page = pages.find(p => p.id === pageId);
  if (page) {
    page.password = password || null;
    scheduleSave();
    showToast(password ? 'Page protected 🔒' : 'Password removed');
  }
}

// Add password option to SEO modal
const _origSeoSave = document.getElementById('seoSave');
document.getElementById('seoOverlay')?.addEventListener('click', e => {
  // Add password field to SEO modal if not present
  const modal = document.querySelector('#seoOverlay .modal');
  if (modal && !document.getElementById('pagePassword')) {
    const div = document.createElement('div');
    div.innerHTML = `<label class="prop-label" style="margin-top:8px;display:block;">Page Password <span style="font-size:11px;color:#B0A090;">(leave blank for public)</span></label>
      <input class="prop-input" id="pagePassword" placeholder="Set a password to protect this page" type="text">`;
    const saveBtn = document.getElementById('seoSave');
    if (saveBtn) saveBtn.before(div);
    const page = pages.find(p => p.id === currentPageId);
    if (page?.password) document.getElementById('pagePassword').value = page.password;
  }
});

const _origSeoSaveClick = document.getElementById('seoSave')?.onclick;
document.getElementById('seoSave')?.addEventListener('click', () => {
  const pw = document.getElementById('pagePassword')?.value?.trim();
  setPagePassword(currentPageId, pw || null);
});

// ════════════════════════════════════════════
// PARALLAX TOGGLE IN PROPERTIES (patch)
// ════════════════════════════════════════════

const _origShowPropsForParallax = showProperties;
function showProperties(block) {
  _origShowPropsForParallax(block);
  // Add parallax toggle after background image field
  const bgInput = document.getElementById('bgImageInput');
  if (bgInput) {
    const isParallax = block.dataset.parallax === 'true';
    const para = document.createElement('div');
    para.className = 'style-section';
    para.style.marginTop = '0';
    para.innerHTML = `<div class="style-label">Parallax Scrolling</div>
      <div class="toggle-row" style="margin-top:6px;">
        <button class="toggle-btn${!isParallax ? ' active' : ''}" data-parallax="false">Off</button>
        <button class="toggle-btn${isParallax ? ' active' : ''}" data-parallax="true">On</button>
      </div>`;
    bgInput.closest('.style-section')?.after(para);
    para.querySelectorAll('[data-parallax]').forEach(btn => {
      btn.addEventListener('click', () => {
        block.dataset.parallax = btn.dataset.parallax;
        para.querySelectorAll('[data-parallax]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        scheduleSave();
      });
    });
  }
}

// ════════════════════════════════════════════
// ADD NEW BLOCK BUTTONS TO SIDEBAR
// ════════════════════════════════════════════

(function addSkippedBlockButtons() {
  const additions = [
    { type: 'video-hero',    icon: '🎬', label: 'Video Hero',     section: 'Media' },
    { type: 'cookie-banner', icon: '🍪', label: 'Cookie Banner',  section: 'Layout' },
    { type: 'popup',         icon: '💬', label: 'Pop-up',         section: 'Layout' }
  ];
  additions.forEach(({ type, icon, label }) => {
    if (!document.querySelector(`.block-btn[data-type="${type}"]`)) {
      const btn = document.createElement('button');
      btn.className = 'block-btn';
      btn.dataset.type = type;
      btn.innerHTML = `<span class="block-icon">${icon}</span>${label}`;
      btn.addEventListener('click', () => addBlock(type));
      const lists = document.querySelectorAll('#tabBlocks .block-list');
      if (lists.length > 0) lists[0].appendChild(btn);
    }
  });
})();

// ════════════════════════════════════════════
// AI GUIDED MODE (from onboarding → editor)
// ════════════════════════════════════════════

if (new URLSearchParams(window.location.search).get('mode') === 'ai-guided') {
  // Build a guided prompt from onboarding data
  const raw = localStorage.getItem('trellis_onboarding');
  if (raw) {
    try {
      const ob = JSON.parse(raw);
      const prompt = `Small business website for ${ob.name || 'a local business'}.
Business type: ${ob.bizType || 'local business'}.
Main goal: ${ob.goal || 'get customers'}.
Style: ${ob.style || 'warm'}.
Tagline: ${ob.tagline || ''}.
Build a professional, complete website with relevant sections for this type of business.`;
      setTimeout(() => runAIBuilder(prompt), 300);
    } catch(e) {}
  }
}

// ════════════════════════════════════════════
// FIX: Update AI builder to use trellis key
// ════════════════════════════════════════════

const _origBuildWithAI = buildWithAI;
async function buildWithAI(prompt) {
  const apiKey = localStorage.getItem('trellis_apikey') || localStorage.getItem('siteflow_apikey') || '';
  if (!apiKey) {
    throw new Error('No API key found. Please set your Anthropic API key in the AI builder.');
  }
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: `You are a website layout generator for Trellis, a website builder for small businesses.
When given a description of a business, respond ONLY with a valid JSON array of block objects.
No explanation, no markdown, no code fences — just raw JSON.

Available block types: navbar, hero, text, image, gallery, columns, testimonials, cta, footer, divider, product-grid, pricing, buy-button, faq, features, stats, team, contact-form, email-signup, social-media

Each block must have:
- "type": one of the block types above
- "content": an object with relevant text fields

Content fields per type:
- navbar: { logo, links: [str,str,str], btn }
- hero: { h1, p, btn }
- text: { h2, p }
- columns: { col1h, col1p, col2h, col2p }
- cta: { h2, p, btn }
- gallery: { title }
- testimonials: {}
- faq: {}
- features: {}
- stats: {}
- team: {}
- contact-form: {}
- email-signup: {}
- social-media: {}
- footer: { logo, copy }
- product-grid: { title }
- pricing: { h2, sub }
- buy-button: { title, desc, price, btn }

Rules:
- Always start with navbar, always end with footer
- Choose 5–9 blocks based on the business type
- Make ALL text specific and real-sounding for this business
- For restaurants: include gallery and contact-form
- For shops: include product-grid
- For service businesses: include testimonials and contact-form
- Return ONLY the JSON array`,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }
  const data = await response.json();
  const raw  = data.content?.[0]?.text || '';
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}