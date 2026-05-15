/* ============================================================
   MOODVERSE — Core App Module
   Handles: Auth, Sessions, History, Streaks, Reminders,
            Language, Doodles, Charts, AI Insights
   ============================================================ */

// ── TRANSLATIONS ──────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    home: "Home", moods: "Moods", about: "About", history: "History",
    signIn: "Sign In", signOut: "Sign Out", signUp: "Sign Up",
    profile: "Profile", language: "Language",
    exploreMoods: "Explore Moods →",
    howAreYou: "How are you feeling today?",
    trackMood: "Track Today's Mood",
    yourStreak: "Day Streak",
    noStreak: "Start your streak today!",
    moodLogged: "Mood logged!",
    addNote: "Add a note (optional)...",
    saveEntry: "Save Entry",
    viewHistory: "View History",
    dailyReminder: "Daily Reminder",
    setReminder: "Set Reminder Time",
    reminderSet: "Reminder set for",
    enableNotifications: "Enable Notifications",
    doodleYourMood: "Doodle Your Mood",
    clearCanvas: "Clear",
    saveDoodle: "Save Doodle",
    weeklyInsights: "Weekly Insights",
    moodTrends: "Mood Trends",
    aiSuggestion: "AI Insight",
    name: "Name", email: "Email", password: "Password",
    loginTitle: "Welcome back", signupTitle: "Join Moodverse",
    loginSub: "Sign in to track your mood journey",
    signupSub: "Create your free account today",
    alreadyHaveAccount: "Already have an account?", 
    noAccount: "Don't have an account?",
    requiredField: "This field is required",
    invalidEmail: "Invalid email address",
    shortPassword: "Password must be at least 6 characters",
    loggedOut: "See you next time!",
    aboutTitle: "About Moodverse",
    happy: "Happy", sad: "Sad", angry: "Angry", calm: "Calm",
    anxious: "Anxious", excited: "Excited", tired: "Tired", neutral: "Neutral",
    moodHistory: "Mood History", noHistory: "No entries yet. Start tracking!",
    notes: "Notes", doodle: "Doodle"
  },
  hi: {
    home: "होम", moods: "मूड", about: "हमारे बारे में", history: "इतिहास",
    signIn: "साइन इन", signOut: "साइन आउट", signUp: "साइन अप",
    profile: "प्रोफाइल", language: "भाषा",
    exploreMoods: "मूड खोजें →",
    howAreYou: "आज आप कैसा महसूस कर रहे हैं?",
    trackMood: "आज का मूड ट्रैक करें",
    yourStreak: "दिन की स्ट्रीक",
    noStreak: "आज अपनी स्ट्रीक शुरू करें!",
    moodLogged: "मूड सेव हो गया!",
    addNote: "एक नोट जोड़ें (वैकल्पिक)...",
    saveEntry: "एंट्री सेव करें",
    viewHistory: "इतिहास देखें",
    dailyReminder: "दैनिक रिमाइंडर",
    setReminder: "रिमाइंडर समय सेट करें",
    reminderSet: "रिमाइंडर सेट किया गया",
    enableNotifications: "नोटिफिकेशन सक्षम करें",
    doodleYourMood: "अपना मूड बनाएं",
    clearCanvas: "साफ करें",
    saveDoodle: "सेव करें",
    weeklyInsights: "साप्ताहिक जानकारी",
    moodTrends: "मूड ट्रेंड्स",
    aiSuggestion: "AI सुझाव",
    name: "नाम", email: "ईमेल", password: "पासवर्ड",
    loginTitle: "वापस स्वागत है", signupTitle: "Moodverse से जुड़ें",
    loginSub: "अपना मूड सफर ट्रैक करने के लिए साइन इन करें",
    signupSub: "आज ही अपना मुफ्त खाता बनाएं",
    alreadyHaveAccount: "पहले से खाता है?",
    noAccount: "खाता नहीं है?",
    requiredField: "यह फ़ील्ड आवश्यक है",
    invalidEmail: "अमान्य ईमेल पता",
    shortPassword: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए",
    loggedOut: "अगली बार मिलेंगे!",
    aboutTitle: "Moodverse के बारे में",
    happy: "खुश", sad: "उदास", angry: "गुस्सा", calm: "शांत",
    anxious: "चिंतित", excited: "उत्साहित", tired: "थका हुआ", neutral: "तटस्थ",
    moodHistory: "मूड इतिहास", noHistory: "अभी तक कोई एंट्री नहीं। ट्रैक करना शुरू करें!",
    notes: "नोट्स", doodle: "डूडल"
  }
};

// ── LANGUAGE MANAGER ──────────────────────────────────────────
const LangManager = {
  get current() { return localStorage.getItem('mv_lang') || 'en'; },
  set(lang) {
    localStorage.setItem('mv_lang', lang);
    this.apply();
    document.dispatchEvent(new CustomEvent('langChange', { detail: lang }));
  },
  t(key) { return TRANSLATIONS[this.current]?.[key] || TRANSLATIONS.en[key] || key; },
  apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (el.placeholder !== undefined && el.tagName !== 'SELECT') el.placeholder = this.t(key);
      else el.textContent = this.t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.getAttribute('data-i18n-placeholder'));
    });
  }
};

// ── AUTH MANAGER ──────────────────────────────────────────────
const Auth = {
  get user() {
    const u = localStorage.getItem('mv_user');
    return u ? JSON.parse(u) : null;
  },
  getUsers() {
    const u = localStorage.getItem('mv_users');
    return u ? JSON.parse(u) : {};
  },
  saveUsers(users) { localStorage.setItem('mv_users', JSON.stringify(users)); },
  signup(name, email, password) {
    const users = this.getUsers();
    if (users[email]) return { ok: false, err: 'Email already registered' };
    users[email] = { name, email, password, createdAt: Date.now() };
    this.saveUsers(users);
    this.setSession({ name, email });
    return { ok: true };
  },
  login(email, password) {
    const users = this.getUsers();
    if (!users[email]) return { ok: false, err: 'Email not found' };
    if (users[email].password !== password) return { ok: false, err: 'Incorrect password' };
    this.setSession({ name: users[email].name, email });
    return { ok: true };
  },
  setSession(user) { localStorage.setItem('mv_user', JSON.stringify(user)); },
  logout() {
    localStorage.removeItem('mv_user');
    window.location.href = 'login.html';
  },
  require() {
    if (!this.user) { window.location.href = 'login.html'; return false; }
    return true;
  }
};

// ── MOOD HISTORY MANAGER ──────────────────────────────────────
const MoodHistory = {
  MOODS: [
    { id: 'happy',   emoji: '😊', color: '#ffe259', label: 'Happy' },
    { id: 'calm',    emoji: '😌', color: '#a1c4fd', label: 'Calm' },
    { id: 'sad',     emoji: '😢', color: '#91bfed', label: 'Sad' },
    { id: 'angry',   emoji: '😡', color: '#ff6b6b', label: 'Angry' },
    { id: 'anxious', emoji: '😰', color: '#ffd93d', label: 'Anxious' },
    { id: 'excited', emoji: '🤩', color: '#ff9a56', label: 'Excited' },
    { id: 'tired',   emoji: '😴', color: '#c9d6df', label: 'Tired' },
    { id: 'neutral', emoji: '😐', color: '#b8b8b8', label: 'Neutral' }
  ],
  getKey() { return `mv_history_${Auth.user?.email || 'guest'}`; },
  getAll() {
    const d = localStorage.getItem(this.getKey());
    return d ? JSON.parse(d) : [];
  },
  save(entries) { localStorage.setItem(this.getKey(), JSON.stringify(entries)); },
  add(mood, note, doodle) {
    const entries = this.getAll();
    const today = this._today();
    // Update today's entry if exists, else add new
    const idx = entries.findIndex(e => e.date === today);
    const entry = { date: today, mood, note: note || '', doodle: doodle || null, ts: Date.now() };
    if (idx >= 0) entries[idx] = entry; else entries.unshift(entry);
    this.save(entries);
    StreakManager.update();
    return entry;
  },
  todayEntry() {
    return this.getAll().find(e => e.date === this._today()) || null;
  },
  _today() { return new Date().toISOString().slice(0, 10); },
  getWeekData() {
    const entries = this.getAll();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const entry = entries.find(e => e.date === key);
      days.push({ date: key, label: d.toLocaleDateString('en', { weekday: 'short' }), entry });
    }
    return days;
  }
};

// ── STREAK MANAGER ────────────────────────────────────────────
const StreakManager = {
  getKey() { return `mv_streak_${Auth.user?.email || 'guest'}`; },
  get() {
    const d = localStorage.getItem(this.getKey());
    return d ? JSON.parse(d) : { count: 0, lastDate: null };
  },
  update() {
    const streak = this.get();
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    if (streak.lastDate === today) return streak; // already counted
    if (streak.lastDate === yesterday) {
      streak.count++;
    } else if (streak.lastDate !== today) {
      streak.count = 1; // reset
    }
    streak.lastDate = today;
    localStorage.setItem(this.getKey(), JSON.stringify(streak));
    return streak;
  },
  check() {
    // Check if streak should be reset (missed a day)
    const streak = this.get();
    if (!streak.lastDate) return streak;
    const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    const today = new Date().toISOString().slice(0, 10);
    if (streak.lastDate !== today && streak.lastDate !== yesterday) {
      streak.count = 0;
      localStorage.setItem(this.getKey(), JSON.stringify(streak));
    }
    return streak;
  }
};

// ── REMINDER MANAGER ──────────────────────────────────────────
const ReminderManager = {
  getKey() { return `mv_reminder_${Auth.user?.email || 'guest'}`; },
  get() { return localStorage.getItem(this.getKey()) || null; },
  set(time) {
    localStorage.setItem(this.getKey(), time);
    this.schedule(time);
  },
  schedule(time) {
    if (!('Notification' in window)) return;
    // We use a repeating check via Service Worker concept (simplified with setInterval)
    Notification.requestPermission().then(perm => {
      if (perm === 'granted') {
        this._setupCheck(time);
      }
    });
  },
  _setupCheck(time) {
    // Clear old interval
    if (window._reminderInterval) clearInterval(window._reminderInterval);
    window._reminderInterval = setInterval(() => {
      const now = new Date();
      const hhmm = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
      if (hhmm === time) {
        const today = MoodHistory.todayEntry();
        if (!today) {
          new Notification('✦ Moodverse', {
            body: "Time to log your mood! How are you feeling today?",
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><text y="28" font-size="28">✦</text></svg>'
          });
        }
      }
    }, 60000); // check every minute
  },
  init() {
    const t = this.get();
    if (t) this._setupCheck(t);
  }
};

// ── AI INSIGHTS ───────────────────────────────────────────────
const AIInsights = {
  generate(entries) {
    if (!entries.length) return "Start logging your moods to get personalized insights!";
    const moodCounts = {};
    entries.forEach(e => { moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1; });
    const dominant = Object.entries(moodCounts).sort((a,b) => b[1]-a[1])[0]?.[0];
    const recent = entries.slice(0, 3).map(e => e.mood);
    const insights = {
      happy: "You're radiating positivity! Keep nurturing activities that bring you joy. 🌟",
      calm: "Your inner peace is showing. Mindfulness is working well for you. 🧘",
      sad: "It's okay to feel sad sometimes. Consider reaching out to someone you trust. 💙",
      angry: "High energy detected! Channel it into exercise or creative expression. 🔥",
      anxious: "Breathe deeply. Try the 4-7-8 breathing technique before bed. 🍃",
      excited: "Your enthusiasm is contagious! Make the most of this energy. ⚡",
      tired: "Your body needs rest. Prioritize sleep and gentle movement. 💤",
      neutral: "A stable baseline is healthy. Maybe try something new to spark joy. ✨"
    };
    // Check for mood trend
    if (recent.every(m => m === recent[0])) {
      return `Consistent ${recent[0]} mood detected. ${insights[recent[0]] || 'Keep tracking!'}`;
    }
    return insights[dominant] || "Your emotions are beautifully diverse. Keep tracking! 🌈";
  },
  getWeekScore(entries) {
    const scoreMap = { happy: 5, excited: 5, calm: 4, neutral: 3, tired: 2, anxious: 2, sad: 1, angry: 1 };
    if (!entries.length) return 0;
    const total = entries.reduce((sum, e) => sum + (scoreMap[e.mood] || 3), 0);
    return Math.round(total / entries.length * 20); // score out of 100
  }
};

// ── NAVBAR INJECTOR ───────────────────────────────────────────
const NavBar = {
  inject(activePage = 'home') {
    const user = Auth.user;
    const streak = StreakManager.check();
    const lang = LangManager.current;
    const t = (k) => LangManager.t(k);

    const navHTML = `
    <nav id="mv-nav">
      <a href="index.html" class="nav-logo">✦ Moodverse</a>
      <ul class="nav-links" id="nav-links-list">
        <li><a href="index.html" class="${activePage==='home'?'nav-active':''}" data-i18n="home">${t('home')}</a></li>
        <li><a href="index.html#moods" data-i18n="moods">${t('moods')}</a></li>
        <li><a href="about.html" class="${activePage==='about'?'nav-active':''}" data-i18n="about">${t('about')}</a></li>
        <li><a href="history.html" class="${activePage==='history'?'nav-active':''}" data-i18n="history">${t('history')}</a></li>
      </ul>
      <div class="nav-right">
        ${streak.count > 0 ? `<div class="streak-badge" title="${streak.count} day streak">🔥 ${streak.count}</div>` : ''}
        
        <!-- Language Selector -->
        <div class="nav-dropdown" id="lang-dropdown">
          <button class="nav-dropdown-btn" onclick="NavBar.toggleDropdown('lang-dropdown')">
            <span>${lang === 'hi' ? '🇮🇳 हिंदी' : '🇬🇧 English'}</span>
            <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="nav-dropdown-menu">
            <button onclick="LangManager.set('en'); NavBar.refreshNav()">🇬🇧 English</button>
            <button onclick="LangManager.set('hi'); NavBar.refreshNav()">🇮🇳 हिंदी</button>
          </div>
        </div>

        ${user ? `
        <!-- Profile Dropdown -->
        <div class="nav-dropdown" id="profile-dropdown">
          <button class="nav-dropdown-btn profile-btn" onclick="NavBar.toggleDropdown('profile-dropdown')">
            <div class="profile-avatar">${user.name.charAt(0).toUpperCase()}</div>
            <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="nav-dropdown-menu profile-menu">
            <div class="profile-info">
              <div class="profile-name">${user.name}</div>
              <div class="profile-email">${user.email}</div>
            </div>
            <hr class="menu-divider">
            <a href="history.html" class="menu-link" data-i18n="history">${t('history')}</a>
            <button onclick="Auth.logout()" class="menu-signout" data-i18n="signOut">${t('signOut')}</button>
          </div>
        </div>
        ` : `<a href="login.html" class="nav-cta" data-i18n="signIn">${t('signIn')}</a>`}
      </div>
    </nav>`;

    // Insert or replace nav
    const existing = document.getElementById('mv-nav');
    if (existing) existing.outerHTML = navHTML;
    else document.body.insertAdjacentHTML('afterbegin', navHTML);

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown')) {
        document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
      }
    });
  },
  toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    const wasOpen = dropdown.classList.contains('open');
    document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
    if (!wasOpen) dropdown.classList.add('open');
  },
  refreshNav() {
    // Re-inject nav with updated language
    const active = document.querySelector('.nav-active')?.closest('li')?.querySelector('a')?.getAttribute('data-i18n') || 'home';
    this.inject(active === 'home' ? 'home' : active === 'history' ? 'history' : active === 'about' ? 'about' : 'home');
    LangManager.apply();
  }
};

// ── NAVBAR CSS ────────────────────────────────────────────────
const NAV_CSS = `
  #mv-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px; height: 68px;
    background: rgba(10,10,15,0.88);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    font-family: 'DM Sans', sans-serif;
  }
  #mv-nav .nav-logo {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem; font-weight: 700; letter-spacing: -0.02em;
    background: linear-gradient(135deg, #c4b5fd, #7c6dfa);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    text-decoration: none;
  }
  #mv-nav .nav-links {
    display: flex; gap: 28px; list-style: none; align-items: center;
  }
  #mv-nav .nav-links a {
    font-size: 0.83rem; color: #7c7c9a; text-decoration: none;
    letter-spacing: 0.04em; text-transform: uppercase; transition: color 0.2s;
  }
  #mv-nav .nav-links a:hover, #mv-nav .nav-links a.nav-active { color: #f0eff8; }
  #mv-nav .nav-right {
    display: flex; align-items: center; gap: 12px;
  }
  .streak-badge {
    padding: 5px 12px; border-radius: 100px;
    background: rgba(255,140,0,0.15); border: 1px solid rgba(255,140,0,0.3);
    font-size: 0.8rem; font-weight: 700; color: #ffad47;
    white-space: nowrap;
  }
  /* Dropdowns */
  .nav-dropdown { position: relative; }
  .nav-dropdown-btn {
    display: flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
    color: #c4b5fd; border-radius: 100px; padding: 7px 14px;
    font-size: 0.82rem; cursor: pointer; transition: background 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .nav-dropdown-btn:hover { background: rgba(255,255,255,0.1); }
  .dropdown-arrow {
    width: 14px; height: 14px; transition: transform 0.25s ease;
    stroke: currentColor;
  }
  .nav-dropdown.open .dropdown-arrow { transform: rotate(180deg); }
  .nav-dropdown-menu {
    position: absolute; top: calc(100% + 10px); right: 0;
    background: #16161f; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px; padding: 8px; min-width: 160px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    opacity: 0; pointer-events: none; transform: translateY(-8px);
    transition: opacity 0.2s, transform 0.2s; z-index: 9999;
  }
  .nav-dropdown.open .nav-dropdown-menu {
    opacity: 1; pointer-events: all; transform: translateY(0);
  }
  .nav-dropdown-menu button, .nav-dropdown-menu a.menu-link {
    display: block; width: 100%; text-align: left;
    background: none; border: none; color: #c4b5fd;
    padding: 9px 14px; border-radius: 8px; font-size: 0.85rem;
    cursor: pointer; transition: background 0.15s; font-family: 'DM Sans', sans-serif;
    text-decoration: none;
  }
  .nav-dropdown-menu button:hover, .nav-dropdown-menu a.menu-link:hover { background: rgba(255,255,255,0.07); }
  .profile-btn { padding: 4px 12px 4px 4px; }
  .profile-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg, #7c6dfa, #c4b5fd);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 0.9rem; color: white;
  }
  .profile-menu { min-width: 200px; }
  .profile-info { padding: 10px 14px 8px; }
  .profile-name { font-weight: 600; color: #f0eff8; font-size: 0.9rem; }
  .profile-email { color: #7c7c9a; font-size: 0.78rem; margin-top: 2px; }
  .menu-divider { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 6px 0; }
  .menu-signout { color: #ff6b6b !important; }
  .nav-cta {
    padding: 9px 22px; border-radius: 100px;
    background: var(--accent, #7c6dfa); color: #fff;
    font-size: 0.83rem; font-weight: 500;
    text-decoration: none; transition: opacity 0.2s;
  }
  .nav-cta:hover { opacity: 0.85; }
  @media (max-width: 900px) {
    #mv-nav { padding: 0 20px; }
    #mv-nav .nav-links { display: none; }
  }
`;

// Inject nav CSS once
function injectNavCSS() {
  if (!document.getElementById('mv-nav-css')) {
    const style = document.createElement('style');
    style.id = 'mv-nav-css';
    style.textContent = NAV_CSS;
    document.head.appendChild(style);
  }
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectNavCSS();
  ReminderManager.init();
  LangManager.apply();
});

// Expose globally
window.Auth = Auth;
window.LangManager = LangManager;
window.MoodHistory = MoodHistory;
window.StreakManager = StreakManager;
window.ReminderManager = ReminderManager;
window.AIInsights = AIInsights;
window.NavBar = NavBar;
window.TRANSLATIONS = TRANSLATIONS;
