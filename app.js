// ═══════════════════════════════════════════════════════
//  DAILY QUOTE — frase motivacional diária (multi-language)
// ═══════════════════════════════════════════════════════
function initDailyQuote() {
  const quotes = (typeof QUOTES_BY_LANG !== 'undefined' && QUOTES_BY_LANG[getLang()]) || QUOTES_BY_LANG['pt'];
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const q = quotes[dayOfYear % quotes.length];

  const el = document.getElementById('daily-quote');
  if (el) el.innerHTML = `
    <div style="font-size:0.78rem;font-style:italic;color:rgba(255,255,255,0.38);line-height:1.55;letter-spacing:0.01em;">
      "${q.text}"${q.author ? `<span style="display:block;margin-top:5px;font-style:normal;font-size:0.68rem;color:rgba(255,255,255,0.22);letter-spacing:0.05em;">— ${q.author}</span>` : ''}
    </div>`;

  const elDash = document.getElementById('daily-quote-dash');
  if (elDash) elDash.innerHTML = `
    <div style="font-size:0.75rem;font-style:italic;color:rgba(255,255,255,0.3);line-height:1.5;letter-spacing:0.01em;border-left:2px solid rgba(255,107,53,0.3);padding-left:8px;margin-top:4px;">
      "${q.text}"${q.author ? ` <span style="font-style:normal;font-size:0.65rem;opacity:0.7;">— ${q.author}</span>` : ''}
    </div>`;
}
initDailyQuote();

// ═══════════════════════════════════════════════════════
//  MOTIVATION WORDS — background da página inicial
// ═══════════════════════════════════════════════════════
function initMotivationWords(names) {
  const canvas = document.getElementById('motivation-canvas');
  if (!canvas) return;
  canvas.innerHTML = ''; // clear on re-render

  const lang = typeof getLang === 'function' ? getLang() : 'pt';
  const WORDS = (typeof WORDS_BY_LANG !== 'undefined' && WORDS_BY_LANG[lang]) || WORDS_BY_LANG['pt'];
  const PHRASE_TEMPLATES = (typeof PHRASES_BY_LANG !== 'undefined' && PHRASES_BY_LANG[lang]) || PHRASES_BY_LANG['pt'];

  const personalPhrases = [];
  if (names && names.length) {
    names.forEach(name => {
      const firstName = name.split(' ')[0];
      // pick 2 random phrase templates per name
      const shuffled = [...PHRASE_TEMPLATES].sort(() => Math.random() - 0.5);
      shuffled.slice(0, 2).forEach(fn => personalPhrases.push(fn(firstName)));
    });
  }

  const FONTS = [
    'serif',
    'Georgia, serif',
    'system-ui, sans-serif',
    "'Courier New', monospace",
    'Arial Narrow, Arial, sans-serif',
    'Impact, sans-serif',
  ];
  const WEIGHTS = [100, 200, 300, 700, 900];

  // Mix: 12 generic words + up to 4 personal phrases
  const genericPicked = [...WORDS].sort(() => Math.random() - 0.5).slice(0, 12);
  const personalPicked = personalPhrases.sort(() => Math.random() - 0.5).slice(0, 4);
  const allItems = [...genericPicked, ...personalPicked].sort(() => Math.random() - 0.5);

  // Grid to loosely spread items
  const cols = 3, rows = 6;
  const cells = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      cells.push({ r, c });
  cells.sort(() => Math.random() - 0.5);

  allItems.forEach((word, i) => {
    const cell  = cells[i % cells.length];
    const xPct  = (cell.c / cols) * 100 + (Math.random() * 24);
    const yPct  = (cell.r / rows) * 100 + (Math.random() * 12);

    // Three size tiers: small (40%), medium (40%), large (20%)
    const isPhrase = word.includes(' ');
    const tier = Math.random();
    let size, op;
    if (isPhrase) {
      size = tier < 0.5 ? 0.55 + Math.random() * 0.35  // small  0.55–0.9
           : tier < 0.85? 0.9  + Math.random() * 0.5   // medium 0.9–1.4
           :               1.4 + Math.random() * 0.8;  // large  1.4–2.2
      op   = tier < 0.85 ? 0.55 + Math.random() * 0.25 // small/med  55–80%
           :                0.4  + Math.random() * 0.2; // large      40–60%
    } else {
      size = tier < 0.4 ? 0.6  + Math.random() * 0.6   // small  0.6–1.2
           : tier < 0.8 ? 1.3  + Math.random() * 1.2   // medium 1.3–2.5
           :               3.0 + Math.random() * 3.0;  // large  3.0–6.0
      op   = tier < 0.4 ? 0.6  + Math.random() * 0.2   // small  60–80%
           : tier < 0.8 ? 0.45 + Math.random() * 0.2   // medium 45–65%
           :               0.3  + Math.random() * 0.15; // large  30–45%
    }

    const rot     = (Math.random() - 0.5) * 30;
    const dur     = 12 + Math.random() * 12;
    const delay   = Math.random() * 16;
    const font    = FONTS[Math.floor(Math.random() * FONTS.length)];
    const weight  = WEIGHTS[Math.floor(Math.random() * WEIGHTS.length)];

    // stroke opacity: thinner for large words, slightly more visible for small
    const strokeOp = size > 2.5 ? 0.07 : size > 1.2 ? 0.1 : 0.14;

    const el = document.createElement('span');
    el.className = 'mot-word';
    el.textContent = word;
    el.style.cssText = `
      left:${Math.min(xPct, 80)}%;
      top:${Math.min(yPct, 88)}%;
      font-size:${size.toFixed(2)}rem;
      font-family:${font};
      font-weight:${weight};
      --rot:${rot.toFixed(1)}deg;
      --dur:${dur.toFixed(1)}s;
      --delay:${delay.toFixed(1)}s;
      --op:${op.toFixed(3)};
      --stroke-op:${strokeOp.toFixed(2)};
      cursor:pointer;
    `;
    el.addEventListener('click', () => {
      el.classList.add('evaporating');
      setTimeout(() => el.remove(), 750);
    });
    canvas.appendChild(el);
  });
}

// ═══════════════════════════════════════════════════════
//  INTERACTIVE BACKGROUND — blobs seguem o rato
// ═══════════════════════════════════════════════════════
(function initInteractiveBG() {
  const bgAnim = document.querySelector('.bg-anim');
  if (!bgAnim) return;

  const mBlob1 = document.createElement('div');
  const mBlob2 = document.createElement('div');
  mBlob1.style.cssText = 'position:absolute;border-radius:50%;pointer-events:none;width:340px;height:340px;filter:blur(120px);opacity:0.055;background:radial-gradient(circle,#ff6b35 0%,transparent 68%);will-change:left,top;';
  mBlob2.style.cssText = 'position:absolute;border-radius:50%;pointer-events:none;width:260px;height:260px;filter:blur(100px);opacity:0.06;background:radial-gradient(circle,#7b2fbe 0%,transparent 68%);will-change:left,top;';
  bgAnim.appendChild(mBlob1);
  bgAnim.appendChild(mBlob2);

  let bx1 = window.innerWidth/2,  by1 = window.innerHeight/2;
  let bx2 = window.innerWidth/2,  by2 = window.innerHeight/2;
  let mx  = window.innerWidth/2,  my  = window.innerHeight/2;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function anim() {
    bx1 += (mx - bx1) * 0.05;  by1 += (my - by1) * 0.05;
    bx2 += (mx - bx2) * 0.025; by2 += (my - by2) * 0.025;
    mBlob1.style.left = (bx1 - 170) + 'px'; mBlob1.style.top = (by1 - 170) + 'px';
    mBlob2.style.left = (bx2 - 130) + 'px'; mBlob2.style.top = (by2 - 130) + 'px';
    requestAnimationFrame(anim);
  })();
})();

// ═══════════════════════════════════════════════════════
//  DATA LAYER
// ═══════════════════════════════════════════════════════

const MUSCLES = ['Peito','Costas','Pernas','Ombros','Bíceps','Tríceps','Abdômen','Glúteos'];
const _SPLIT_LABEL_KEYS = {
  'Superior':'split_superior','Inferior':'split_inferior',
  'Superior A':'split_superior_a','Inferior A':'split_inferior_a',
  'Superior B':'split_superior_b','Inferior B':'split_inferior_b',
  'Peito & Costas':'split_peito_costas','Ombros & Braços':'split_ombros_bracos',
  'Peito & Tríceps':'split_peito_triceps','Costas & Bíceps':'split_costas_biceps',
  'Ombros & Core':'split_ombros_core','Braços & Core':'split_bracos_core',
  'Descanso':'split_descanso',
  'Peito':'muscle_Peito','Costas':'muscle_Costas','Pernas':'muscle_Pernas',
  'Ombros':'muscle_Ombros',
};
function tSplitLabel(label) { return t(_SPLIT_LABEL_KEYS[label] || '') || label; }

const _MUSCLE_KEYS = {
  'Peito':'muscle_Peito','Costas':'muscle_Costas','Pernas':'muscle_Pernas',
  'Ombros':'muscle_Ombros','Bíceps':'muscle_Biceps','Tríceps':'muscle_Triceps',
  'Abdômen':'muscle_Abdomen','Glúteos':'muscle_Gluteos','Alongamentos':'muscle_Alongamentos'
};
function tMuscle(m) { return t(_MUSCLE_KEYS[m] || 'muscle_'+m) || m; }
const _LOCALE_MAP = { pt:'pt-PT', en:'en-US', es:'es-ES', fr:'fr-FR', ru:'ru-RU' };
function _dayFull(idx)  { return new Date(2024,0,7+idx).toLocaleDateString(_LOCALE_MAP[getLang()]||'pt-PT',{weekday:'long'}); }
function _dayShort(idx) { return new Date(2024,0,7+idx).toLocaleDateString(_LOCALE_MAP[getLang()]||'pt-PT',{weekday:'short'}); }
// Keep static arrays for data lookups; use _dayFull/_dayShort for display
const DAYS      = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const DAYS_FULL = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];

const EXERCISE_LIBRARY = {
  'Peito': [
    'Supino Reto c/ Barra','Supino Reto c/ Halteres','Supino Inclinado c/ Barra','Supino Inclinado c/ Halteres',
    'Supino Declinado c/ Barra','Supino Declinado c/ Halteres','Crucifixo c/ Halteres','Crucifixo na Polia',
    'Peck Deck','Crossover','Flexão de Braço','Flexão Inclinada','Flexão Declinada','Flexão com Palmas Juntas',
    'Pull Over c/ Halteres','Pull Over na Polia','Supino Neutro c/ Halteres','Chest Press na Máquina',
    'Fly na Máquina','Dips (Mergulho no Banco)',
    'Press de Peito c/ Elástico','Fly c/ Elástico','Flexão c/ Elástico',
    'Supino Reto na Smith Machine','Crossover na Polia Baixa','Crossover na Polia Alta','Supino Máquina Convergente',
    'Flexão Diamante','Flexão Archer','Flexão Explosiva (Pliométrica)','Flexão com Elevação de Perna',
  ],
  'Costas': [
    'Puxada Frente c/ Barra','Puxada Frente c/ Triângulo','Puxada Aberta','Puxada com Pegada Neutra',
    'Remada Curvada c/ Barra','Remada Curvada c/ Halteres','Remada Unilateral c/ Halter','Remada Máquina',
    'Remada Sentado na Polia','Levantamento Terra','Levantamento Terra Romeno','Serrote c/ Halter',
    'Pull-down com Corda','Barra Fixa','Barra Fixa Supinada','Straight-arm Pulldown',
    'Hiperextensão Lombar','Face Pull','Remada Alta','Good Morning',
    'Remada c/ Elástico','Puxada c/ Elástico','Face Pull c/ Elástico','Remada Baixa c/ Elástico',
    'Remada Cavalinho c/ Barra (T-Bar)','Puxada Neutra na Máquina','Remada Baixa na Polia','Levantamento Terra Sumô c/ Barra',
    'Superman','Remada Invertida (Australian Pull-up)','Remada TRX','Remada com Toalha na Porta',
  ],
  'Pernas': [
    'Agachamento Livre','Agachamento Goblet','Agachamento Frontal','Agachamento Búlgaro',
    'Leg Press 45°','Leg Press Horizontal','Hack Squat','Extensão de Pernas',
    'Flexão de Pernas Deitado','Flexão de Pernas em Pé','Stiff c/ Barra','Stiff c/ Halteres',
    'Avanço c/ Halteres','Avanço c/ Barra','Avanço Reverso','Afundo Lateral',
    'Panturrilha em Pé','Panturrilha Sentado','Panturrilha no Leg Press','Cadeira Adutora',
    'Cadeira Abdutora','Step-up','Sissy Squat','Wall Sit',
    'Agachamento c/ Elástico','Leg Curl c/ Elástico','Passada c/ Elástico','Monster Walk c/ Elástico',
    'Agachamento na Smith Machine','Multi Hip na Máquina','Leg Press Unilateral','Extensão de Quadril no Cabo',
    'Pistol Squat','Agachamento Salto (Jump Squat)','Afundo Caminhando (Walking Lunge)','Agachamento Sumô Peso Corporal',
  ],
  'Ombros': [
    'Desenvolvimento c/ Barra (à frente)','Desenvolvimento c/ Barra (atrás)','Desenvolvimento c/ Halteres',
    'Arnold Press','Press na Máquina','Elevação Lateral c/ Halteres','Elevação Lateral na Polia',
    'Elevação Frontal c/ Halteres','Elevação Frontal c/ Barra','Elevação Frontal com Disco',
    'Encolhimento de Ombros c/ Barra','Encolhimento de Ombros c/ Halteres','Encolhimento na Máquina',
    'Face Pull na Polia','Crucifixo Invertido c/ Halteres','Crucifixo Invertido na Máquina',
    'Rotação Interna na Polia','Rotação Externa na Polia','Upright Row c/ Barra','Upright Row c/ Halteres',
    'Elevação Lateral c/ Elástico','Desenvolvimento c/ Elástico','Elevação Frontal c/ Elástico','Rotação Externa c/ Elástico',
    'Desenvolvimento na Smith Machine','Elevação Lateral na Máquina','Remada Alta na Polia',
    'Pike Push-up','Flexão Pike na Parede (Handstand Assistido)','Elevação Lateral com Garrafas de Água',
  ],
  'Bíceps': [
    'Rosca Direta c/ Barra','Rosca Direta c/ Barra EZ','Rosca Alternada c/ Halteres',
    'Rosca Concentrada','Rosca Martelo','Rosca Martelo com Corda','Rosca Scott c/ Barra EZ',
    'Rosca Scott c/ Halteres','Rosca na Polia Baixa','Rosca Inversa c/ Barra',
    'Rosca Inclinada c/ Halteres','Rosca 21','Rosca Cabo c/ Corda','Curl Isométrico',
    'Chin-up (Barra Supinada)','Rosca Spider','Rosca com Elástico',
    'Rosca Martelo c/ Elástico','Rosca Bíceps c/ Elástico (Pé no Elástico)',
    'Rosca na Máquina','Rosca Scott na Polia','Rosca Drag c/ Barra',
    'Rosca com Mochila com Peso','Rosca Isométrica na Parede',
  ],
  'Tríceps': [
    'Tríceps Corda na Polia','Tríceps Polia Alta c/ Barra','Tríceps Francês c/ Barra EZ',
    'Tríceps Francês c/ Halteres','Extensão Testa c/ Barra','Extensão Testa c/ Halteres',
    'Tríceps Mergulho (Dips)','Tríceps Mergulho no Banco','Kickback c/ Halter',
    'Kickback na Polia','Close Grip Bench Press','Tríceps Coice','Tríceps Polia Inversa',
    'Skullcrusher','Extensão Unilateral na Polia','Press de Tríceps na Máquina',
    'Tríceps com Elástico','Kickback c/ Elástico','Extensão de Tríceps c/ Elástico',
    'Tríceps na Máquina Convergente','Supino Fechado na Smith Machine',
    'Dips entre Duas Cadeiras','Extensão de Tríceps na Parede',
  ],
  'Abdômen': [
    'Abdominal Crunch','Crunch Invertido','Crunch na Máquina','Prancha Frontal',
    'Prancha Lateral Direita','Prancha Lateral Esquerda','Prancha com Toque no Ombro',
    'Elevação de Pernas Deitado','Elevação de Pernas Suspenso','Knee Raise','Leg Raise na Barra',
    'Abdominal Bicicleta','Hollow Body','Abdominal Roda','Toque no Calcanhar',
    'Russian Twist','Russian Twist c/ Peso','Oblíquo c/ Halter','Oblíquo na Polia',
    'Mountain Climber','Dead Bug','Sit-up','V-up','Dragon Flag',
    'Pallof Press c/ Elástico','Crunch c/ Elástico',
    'Abdominal na Polia Alta','Crunch na Máquina de Rotação',
    'Prancha com Elevação de Perna','Flutter Kicks','Bicicleta Lenta (Slow Bicycle)',
  ],
  'Glúteos': [
    'Hip Thrust c/ Barra','Hip Thrust c/ Halteres','Hip Thrust na Máquina',
    'Agachamento Sumô c/ Barra','Agachamento Sumô c/ Halter','Elevação de Quadril no Chão',
    'Abdução de Quadril na Máquina','Abdução com Elástico','Donkey Kicks','Fire Hydrant',
    'Passada c/ Halteres','Passada Reversa','Step-up c/ Halteres','Avanço Lateral',
    'Stiff c/ Foco Glúteo','Leg Press c/ Foco Glúteo','Glute Kickback na Polia',
    'Elevação Pélvica c/ Elástico','Agachamento com Elástico','Ponte de Glúteos',
    'Hip Thrust c/ Elástico','Passada Lateral c/ Elástico','Donkey Kick c/ Elástico','Clamshell c/ Elástico',
    'Coice de Glúteo no Cabo Baixo','Abdução de Quadril na Polia',
    'Ponte Unilateral de Glúteos','Frog Pump (Elevação de Quadril Borboleta)',
  ],
  'Alongamentos': [
    // Pescoço
    'Alongamento Lateral do Pescoço','Rotação do Pescoço','Alongamento Anterior do Pescoço',
    // Ombros & Peito
    'Alongamento Cross-Body (Ombro)','Alongamento de Tríceps sobre a Cabeça',
    'Alongamento do Peito na Porta','Alongamento de Ombros Atrás das Costas',
    'Rotação Interna de Ombro','Rotação Externa de Ombro',
    // Costas & Coluna
    'Gato-Vaca (Cat-Cow)','Postura da Criança (Child\'s Pose)','Cobra (Extensão Lombar)',
    'Joelhos ao Peito Deitado','Torção Espinhal Deitado','Alongamento Lateral do Tronco',
    'Hiperextensão Suave','Seated Forward Fold',
    // Isquiotibiais
    'Alongamento de Isquiotibiais Deitado','Alongamento de Isquiotibiais em Pé',
    'Downward Dog','Toque nos Dedos dos Pés em Pé',
    // Quadricípite & Flexores
    'Alongamento de Quadricípite em Pé','Alongamento de Quadricípite Deitado',
    'Fenda Baixa (Flexor da Anca)','Postura do Pombo','Alongamento do Iliopsoas',
    // Glúteos & Piriformis
    'Figura 4 Deitado (Piriforme)','Figura 4 em Pé','Alongamento de Glúteo Sentado',
    // Pernas & Tornozelo
    'Alongamento de Panturrilha em Pé','Alongamento do Tendão de Aquiles',
    'Rotação de Tornozelo','Dorsiflexão de Tornozelo',
    // Adutores
    'Borboleta (Adutores Sentado)','Alongamento Lateral de Perna','Fenda Lateral',
    // Mobilidade Geral
    'World\'s Greatest Stretch','Hip 90/90','Abertura de Anca em Círculo',
    'Rotação Torácica','Thread the Needle',
    // Extra
    'Alongamento de Trapézio','Alongamento de Punho e Antebraço','Postura da Esfinge (Sphinx Pose)',
    'Círculos de Braço (Arm Circles)','Postura do Gato Esticado (Extended Puppy Pose)',
    'Alongamento de Adutores em Pé','Torção de Tronco em Pé',
  ],
};

const AVATAR_COLORS = ['#ff6b35','#00d4aa','#7b2fbe','#e91e8c','#ffd700','#00aaff','#ff4757','#2ed573'];

function getData() {
  const key = 'fitpro_data' + (window.currentUid ? '_' + window.currentUid : '');
  return JSON.parse(localStorage.getItem(key) || '{"profiles":[],"activeProfile":null}');
}
function saveData(d) {
  const key = 'fitpro_data' + (window.currentUid ? '_' + window.currentUid : '');
  localStorage.setItem(key, JSON.stringify(d));
  if (typeof window.fbSyncToCloud === 'function') window.fbSyncToCloud(d);
}

function getProfile() {
  const d = getData();
  return d.profiles.find(p => p.id === d.activeProfile) || null;
}
function saveProfile(profile) {
  const d = getData();
  const idx = d.profiles.findIndex(p => p.id === profile.id);
  if (idx >= 0) d.profiles[idx] = profile;
  else d.profiles.push(profile);
  saveData(d);
}

// ═══════════════════════════════════════════════════════
//  PROFILE MANAGEMENT
// ═══════════════════════════════════════════════════════

function renderProfileScreen() {
  const d = getData();
  const names = d.profiles.map(p => p.name);
  initMotivationWords(names);
  const list = document.getElementById('profile-list');
  if (!d.profiles.length) {
    list.innerHTML = `<div class="empty"><div class="icon">👤</div><p>${t('profile_no_profiles')}</p></div>`;
    return;
  }
  list.innerHTML = d.profiles.map((p, idx) => {
    const goalIcon = p.goal === 'cut' ? '🔥' : p.goal === 'bulk' ? '💪' : '⚖️';
    const avatarInner = p.photo
      ? `<img src="${p.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;">`
      : `<span style="font-size:1.45rem;font-weight:900;color:#fff;line-height:1;">${p.name[0].toUpperCase()}</span>`;
    return `
    <div class="profile-card" onclick="selectProfile('${p.id}', this)" style="animation-delay:${idx*0.08}s;">
      <div style="width:62px;height:62px;border-radius:50%;background:${p.color};
                  display:flex;align-items:center;justify-content:center;flex-shrink:0;
                  overflow:hidden;
                  box-shadow:0 0 0 3px ${p.color}55, 0 0 28px ${p.color}35;">
        ${avatarInner}
      </div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:1.05rem;font-weight:800;color:var(--text);margin-bottom:3px;">${p.name}</div>
        <div style="font-size:0.75rem;color:var(--muted);">${goalIcon} ${goalLabel(p.goal)}${p.age ? ' · '+p.age+' '+t('years_old') : ''}</div>
      </div>
      <div style="font-size:0.65rem;font-weight:800;letter-spacing:0.1em;color:${p.color};opacity:0.85;white-space:nowrap;">${t('profile_enter')}</div>
    </div>`;
  }).join('');
  if (typeof applyI18n === 'function') applyI18n();
  if (typeof renderHomeLangPicker === 'function') renderHomeLangPicker();
}

function goalLabel(g) {
  return g === 'cut' ? t('goal_cut') : g === 'bulk' ? t('goal_bulk') : t('goal_maintain');
}

function createProfile() {
  const name = document.getElementById('np-name').value.trim();
  if (!name) { showToast(t('t_name_required')); return; }
  const d = getData();
  const profile = {
    id: Date.now().toString(),
    name,
    weight: parseFloat(document.getElementById('np-weight').value) || null,
    height: parseFloat(document.getElementById('np-height').value) || null,
    age: parseInt(document.getElementById('np-age').value) || null,
    gender: document.getElementById('np-gender').value,
    goal: document.getElementById('np-goal').value,
    color: AVATAR_COLORS[d.profiles.length % AVATAR_COLORS.length],
    weeklyPlan: { 0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[] },
    workoutHistory: [],
    customExercises: {}
  };
  d.profiles.push(profile);
  d.activeProfile = profile.id;
  saveData(d);
  closeModal('modal-new-profile');
  // reset form
  ['np-name','np-weight','np-height','np-age'].forEach(id => document.getElementById(id).value = '');
  selectProfile(profile.id);
}

function selectProfile(id, cardEl) {
  // 1. Visual feedback on the card
  if (cardEl) cardEl.classList.add('selecting');

  // 2. Fade out the profile screen
  const profileScreen = document.getElementById('profile-screen');
  profileScreen.classList.add('fade-out');

  // 3. After animation, switch screens
  if (typeof hideHomeLangPicker === 'function') hideHomeLangPicker();
  setTimeout(() => {
    const d = getData();
    d.activeProfile = id;
    saveData(d);
    launchApp();
  }, 280);
}

function showProfileScreen() {
  document.getElementById('app').style.display = 'none';
  const ps = document.getElementById('profile-screen');
  ps.style.display = '';
  ps.className = 'active';
  ps.style.opacity = '';
  ps.style.transform = '';
  renderProfileScreen();
}

// ═══════════════════════════════════════════════════════
//  APP LAUNCH
// ═══════════════════════════════════════════════════════

let _welcomeTimer = null;

function launchApp() {
  const profile = getProfile();
  if (!profile) { showProfileScreen(); return; }

  const profileScreen = document.getElementById('profile-screen');
  const appEl = document.getElementById('app');

  profileScreen.className = '';
  profileScreen.style.display = 'none';
  appEl.style.display = 'block';

  updateTopbarAvatar(profile);
  updateNavAvatar();
  renderDashboard();
  renderPlanner();
  renderWorkout();
  populateNutritionForm();
  initNotifications();
  setTimeout(() => moveNavIndicator(document.querySelector('.nav-item.active')), 50);

  // Floating motivation words in app background — only active profile name
  initMotivationWords([profile.name]);

  // Onboarding — show once on first launch
  if (!profile.onboardingDone) {
    setTimeout(showOnboarding, 600);
    return;
  }

  // Show welcome splash — only if ≥4h since last shown for this profile
  const SPLASH_COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours
  const splashKey = 'fitpro_splash_' + profile.id;
  const lastShown = parseInt(localStorage.getItem(splashKey) || '0', 10);
  if (Date.now() - lastShown >= SPLASH_COOLDOWN_MS) {
    showWelcomeSplash(profile);
  }
}

function showWelcomeSplash(profile) {
  const splash = document.getElementById('welcome-splash');
  const now = new Date();
  const dayOfWeek = now.getDay();
  const todayMuscles = profile.weeklyPlan ? (profile.weeklyPlan[dayOfWeek] || []) : [];

  // Avatar
  const av = document.getElementById('ws-avatar');
  av.style.background = profile.color || '#ff6b35';
  if (profile.photo) {
    av.textContent = '';
    av.style.padding = '0';
    av.style.overflow = 'hidden';
    av.innerHTML = `<img src="${profile.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;">`;
  } else {
    av.innerHTML = '';
    av.textContent = profile.name[0].toUpperCase();
  }

  // Greeting
  const firstName = profile.name.split(' ')[0];
  document.getElementById('ws-greeting').textContent = `${t('dash_hello')}, ${firstName}! 👋`;

  // Date
  document.getElementById('ws-date').textContent =
    now.toLocaleDateString(getDateLocale(), { weekday:'long', day:'numeric', month:'long' });

  // Today box
  const todayBox = document.getElementById('ws-today-content');
  if (todayMuscles.length) {
    const chips = todayMuscles.map(m => `<span class="ws-today-chip">${m}</span>`).join('');
    todayBox.innerHTML = `<div style="margin-bottom:6px;">${chips}</div>
      <div style="font-size:0.75rem;color:var(--muted);margin-top:6px;">${t('plan_splash_planned')}</div>`;
  } else {
    todayBox.innerHTML = `<div style="font-size:1.3rem;margin-bottom:4px;">🛌</div>
      <div style="font-size:0.88rem;color:var(--muted);">${t('plan_rest_day_msg')}</div>`;
  }

  // Show splash
  splash.classList.remove('fade-out');
  splash.classList.add('visible');

  // Auto-dismiss after 2.5s
  if (_welcomeTimer) clearTimeout(_welcomeTimer);
  _welcomeTimer = setTimeout(() => dismissWelcome(), 2500);
}

function dismissWelcome() {
  if (_welcomeTimer) { clearTimeout(_welcomeTimer); _welcomeTimer = null; }
  // Save timestamp so splash is skipped for the next 4h
  const profile = getProfile();
  if (profile) localStorage.setItem('fitpro_splash_' + profile.id, Date.now().toString());
  const splash = document.getElementById('welcome-splash');
  splash.classList.add('fade-out');
  setTimeout(() => {
    splash.classList.remove('visible', 'fade-out');
    // Scroll to today card
    window.scrollTo({ top: 0, behavior: 'instant' });
    const todayCard = document.querySelector('#screen-dashboard .card');
    if (todayCard) {
      setTimeout(() => todayCard.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    }
  }, 400);
}

function updateTopbarAvatar(profile) {
  const el = document.getElementById('topbar-avatar');
  document.getElementById('topbar-name').textContent = profile.name.split(' ')[0];
  if (profile.photo) {
    el.style.background = 'transparent';
    el.innerHTML = `<img src="${profile.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
  } else {
    el.innerHTML = '';
    el.textContent = profile.name[0].toUpperCase();
    el.style.background = profile.color;
  }
}

// ═══════════════════════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════════════════════

function navigate(screen, el) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('screen-' + screen).classList.add('active');
  if (el) el.classList.add('active');
  moveNavIndicator(el);
  if (screen === 'workout') renderWorkout();
  if (screen === 'history') renderHistory();
  if (screen === 'dashboard') renderDashboard();
  if (screen === 'profile') renderProfileTab();
  if (typeof applyI18n === 'function') applyI18n();
}

function moveNavIndicator(activeEl) {
  const indicator = document.getElementById('nav-indicator');
  const nav = document.querySelector('.bottom-nav');
  const target = activeEl || document.querySelector('.nav-item.active');
  if (!indicator || !nav || !target) return;
  const wrap = target.querySelector('.nav-icon-wrap');
  if (!wrap) return;
  // Use layout (pre-scale) offsets so the indicator positions correctly
  // even when the nav has a CSS transform applied
  let left = 0, top = 0, cur = wrap;
  while (cur && cur !== nav) { left += cur.offsetLeft; top += cur.offsetTop; cur = cur.offsetParent; }
  indicator.style.left   = left + 'px';
  indicator.style.top    = top  + 'px';
  indicator.style.width  = wrap.offsetWidth  + 'px';
  indicator.style.height = wrap.offsetHeight + 'px';
}

function updateNavAvatar() {
  const el = document.getElementById('nav-avatar');
  if (!el) return;
  const profile = getProfile();
  if (!profile) { el.textContent = '?'; el.style.background = '#555'; return; }
  if (profile.photo) {
    el.innerHTML = `<img src="${profile.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;">`;
    el.style.background = 'transparent';
  } else {
    const colors = ['#ff6b35','#00d4aa','#7b2fbe','#e91e8c','#ffd700','#00aaff','#ff4757','#2ed573'];
    el.style.background = colors[(profile.id || '').charCodeAt(0) % colors.length] || '#ff6b35';
    el.style.backgroundImage = '';
    el.innerHTML = (profile.name || '?')[0].toUpperCase();
  }
}

function goToProfile() {
  navigate('profile', document.querySelector('[data-screen="profile"]'));
}

function goToWorkout() {
  // Navigate to workout screen
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector('[data-screen="workout"]').classList.add('active');
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-workout').classList.add('active');
  renderWorkout();

  // Skip if user already has exercises loaded
  if (workoutExercises.length > 0) return;

  const profile = getProfile();
  if (!profile) return;
  const today = new Date().getDay();

  // 0. Prefer per-day custom exercise plan (sugestão editada no planeamento)
  const dayPlan = profile.weeklyWorkoutPlan && profile.weeklyWorkoutPlan[today];
  if (dayPlan && dayPlan.length) {
    loadPlannedWorkout(dayPlan);
    return;
  }

  // 1. Prefer explicitly planned template for today
  const plannedTemplateId = profile.weeklyTemplatePlan && profile.weeklyTemplatePlan[today];
  if (plannedTemplateId) {
    const tpl = WORKOUT_TEMPLATES.find(t => t.id === plannedTemplateId);
    if (tpl) {
      workoutMode = tpl.stretch ? 'stretch' : tpl.home ? 'home' : 'gym';
      loadWorkoutTemplate(tpl.id);
      return;
    }
  }

  // 2. Fallback: find best template by muscle overlap
  const todayMuscles = profile.weeklyPlan[today] || [];
  if (!todayMuscles.length) return;

  const candidates = WORKOUT_TEMPLATES.filter(t => !t.stretch);
  let best = null, bestScore = 0;
  for (const tpl of candidates) {
    const overlap = tpl.muscles.filter(m => todayMuscles.includes(m)).length;
    const score = overlap / Math.max(tpl.muscles.length, todayMuscles.length);
    if (score > bestScore) { bestScore = score; best = tpl; }
  }

  if (best && bestScore >= 0.5) {
    workoutMode = best.home ? 'home' : 'gym';
    loadWorkoutTemplate(best.id);
  }
}

// ═══════════════════════════════════════════════════════
//  PROFILE TAB
// ═══════════════════════════════════════════════════════

// ── Composition notes (module-level so liveComp can use them) ─
const _WEIGHT_NOTES = {
  'st_underweight':   'note_weight_underweight',
  'st_normal_weight': 'note_weight_normal',
  'st_overweight':    'note_weight_overweight',
  'st_obese1':        'note_weight_obese1',
  'st_obese2':        'note_weight_obese2',
};
const _FAT_NOTES = {
  'st_very_low':   'note_fat_very_low',
  'st_athletic_m': 'note_fat_athletic',
  'st_athletic_f': 'note_fat_athletic',
  'st_optimal':    'note_fat_optimal',
  'st_acceptable': 'note_fat_acceptable',
  'st_excess':     'note_fat_excess',
  'st_obesity':    'note_fat_obesity',
};
const _MUSCLE_NOTES = {
  'st_low':      'note_muscle_low',
  'st_normal':   'note_muscle_normal',
  'st_good':     'note_muscle_good',
  'st_excellent':'note_muscle_excellent',
};
const _BONE_NOTES = {
  'st_low':    'note_bone_low',
  'st_normal': 'note_bone_normal',
  'st_high':   'note_bone_high',
};
const _WATER_NOTES = {
  'st_very_low': 'note_water_very_low',
  'st_low':      'note_water_low',
  'st_optimal':  'note_water_optimal',
  'st_elevated': 'note_water_elevated',
  'st_very_high':'note_water_very_high',
};
const _VISCERAL_NOTES = {
  'st_healthy':   'note_visceral_healthy',
  'st_excess':    'note_visceral_excess',
  'st_high':      'note_visceral_high',
  'st_very_high': 'note_visceral_very_high',
};
const _METAGE_NOTES = {
  'st_excellent':  'note_metage_excellent',
  'st_good':       'note_metage_good',
  'st_reasonable': 'note_metage_reasonable',
  'st_above_age':  'note_metage_above_age',
};

// ── Live composition updates ──────────────────────────────
function liveComp(key) {
  const profile = getProfile();
  if (!profile) return;
  const g = profile.gender || 'm', w = profile.weight, h = profile.height, age = profile.age;
  const val = parseFloat(document.getElementById('comp-' + key)?.value);
  let statusFn, statusArg, idealMin, idealMax, scaleMax, notes, unit, extraFn;
  switch (key) {
    case 'weight':
      statusFn=_weightStatus; statusArg=h; unit='kg';
      idealMin = h ? +(18.5*(h/100)**2).toFixed(1) : 0;
      idealMax = h ? +(24.9*(h/100)**2).toFixed(1) : 100;
      scaleMax = h ? Math.round(35*(h/100)**2) : 150;
      notes=_WEIGHT_NOTES; extraFn = v => h ? `IMC ${(v/(h/100)**2).toFixed(1)}` : ''; break;
    case 'fat':
      statusFn=_bodyFatStatus; statusArg=g; unit='%';
      [idealMin,idealMax] = g==='f' ? [20,30] : [10,20];
      scaleMax = g==='f' ? 55 : 45;
      notes=_FAT_NOTES; extraFn = v => w ? `= ${(w*v/100).toFixed(1)} kg` : ''; break;
    case 'muscle':
      statusFn=_muscleMassStatus; statusArg=g; unit='%';
      [idealMin,idealMax] = g==='f' ? [24,35] : [33,44];
      scaleMax = g==='f' ? 50 : 60;
      notes=_MUSCLE_NOTES; extraFn = v => w ? `= ${(w*v/100).toFixed(1)} kg` : ''; break;
    case 'bone':
      statusFn=_boneMassStatus; statusArg=g; unit='kg';
      [idealMin,idealMax] = g==='f' ? [2.0,3.2] : [2.7,4.5];
      scaleMax = g==='f' ? 5 : 6; notes=_BONE_NOTES; extraFn=null; break;
    case 'water':
      statusFn=_waterStatus; statusArg=g; unit='%';
      [idealMin,idealMax] = g==='f' ? [50,60] : [55,65];
      scaleMax=80; notes=_WATER_NOTES; extraFn=null; break;
    case 'visceral':
      statusFn=_visceralStatus; statusArg=null; unit='idx';
      idealMin=1; idealMax=9; scaleMax=30; notes=_VISCERAL_NOTES; extraFn=null; break;
    case 'metage':
      statusFn=_metAgeStatus; statusArg=age; unit='anos';
      idealMin=Math.max(10,(age||30)-10); idealMax=age||30; scaleMax=(age||30)+20;
      notes=_METAGE_NOTES; extraFn=null; break;
    default: return;
  }
  const stEl=document.getElementById('cst-'+key), barEl=document.getElementById('cbar-'+key),
        noteEl=document.getElementById('cnote-'+key), extraEl=document.getElementById('cextra-'+key);
  if (isNaN(val)) {
    if (stEl) stEl.textContent=''; if (barEl) barEl.innerHTML='';
    if (noteEl) noteEl.innerHTML=''; if (extraEl) extraEl.textContent=''; return;
  }
  const st = statusFn(val, statusArg);
  if (stEl)  { stEl.textContent='● '+st.label; stEl.style.color=st.color; }
  if (barEl) { barEl.innerHTML=_compBar(val,scaleMax,idealMin,idealMax,st.color)+`<div style="font-size:0.62rem;color:var(--muted);margin-top:1px;">${t('comp_ideal_label')} ${idealMin}–${idealMax} ${unit}</div>`; }
  if (noteEl){ const noteKey=notes[st.key]||''; const noteTxt=noteKey?t(noteKey):''; noteEl.innerHTML=noteTxt?`<div style="font-size:0.68rem;color:var(--muted);margin-top:4px;line-height:1.45;padding:4px 8px;background:rgba(255,255,255,0.03);border-left:2px solid ${st.color};border-radius:0 4px 4px 0;">${noteTxt}</div>`:''; }
  if (extraEl && extraFn) extraEl.textContent = extraFn(val);
  if (key==='muscle') syncMuscleFromPct();
  liveAutoSaveComp();
}

function liveAutoSaveComp() {
  const profile = getProfile();
  if (!profile) return;
  if (!profile.bodyComposition) profile.bodyComposition = {};
  const c = profile.bodyComposition;
  const nw = _parseField('comp-weight'); if (nw) profile.weight = nw;
  const map = {fat:'bodyFat',muscle:'muscleMass',bone:'boneMass',water:'water',visceral:'visceralFat',metage:'metabolicAge'};
  Object.entries(map).forEach(([k,prop]) => { const v=_parseField('comp-'+k); if (v!=null) c[prop]=v; });
  saveProfile(profile);
}

// ── History chart ────────────────────────────────────────
let _profileChartMetric = 'bodyFat';

const _CHART_METRICS = [
  { key: 'weight',       get label() { return t('chart_weight_lbl'); },  unit: 'kg',   color: '#e91e8c' },
  { key: 'bodyFat',      get label() { return t('chart_fat_lbl'); },     unit: '%',    color: '#ff6b35' },
  { key: 'muscleMass',   get label() { return t('chart_muscle_lbl'); },  unit: '%',    color: '#00d4aa' },
  { key: 'water',        get label() { return t('chart_water_lbl'); },   unit: '%',    color: '#00aaff' },
  { key: 'visceralFat',  get label() { return t('chart_visceral_lbl'); },unit: 'idx',  color: '#ff4757' },
  { key: 'metabolicAge', get label() { return t('chart_metage_lbl'); },  unit: 'anos', color: '#b07dff' },
];

function switchChartMetric(key) {
  _profileChartMetric = key;
  document.querySelectorAll('.chart-chip').forEach(c => {
    const on = c.dataset.metric === key;
    c.style.background    = on ? 'rgba(255,107,53,0.18)' : 'rgba(255,255,255,0.05)';
    c.style.borderColor   = on ? 'var(--orange)' : 'var(--border)';
    c.style.color         = on ? 'var(--orange)' : 'var(--muted)';
    c.style.fontWeight    = on ? '700' : '500';
  });
  _renderProfileChart();
}

function _renderProfileChart() {
  const el = document.getElementById('profile-chart-container');
  if (!el) return;
  const profile = getProfile();
  if (!profile) return;
  const history = profile.bodyCompHistory || [];
  const cfg = _CHART_METRICS.find(m => m.key === _profileChartMetric);
  if (!cfg) return;
  const data = history.filter(e => e[cfg.key] != null).slice(-14);
  if (data.length < 2) {
    el.innerHTML = `<div style="text-align:center;padding:18px 0;font-size:0.75rem;color:var(--muted);">${t('comp_chart_hint')}</div>`;
    return;
  }
  el.innerHTML = _buildChartSVG(data, cfg);
}

function _buildChartSVG(data, cfg) {
  const W = 320, H = 130;
  const pad = { top: 18, right: 14, bottom: 26, left: 34 };
  const pW = W - pad.left - pad.right;
  const pH = H - pad.top - pad.bottom;

  const values = data.map(e => e[cfg.key]);
  let minV = Math.min(...values), maxV = Math.max(...values);
  if (minV === maxV) { minV -= 1; maxV += 1; }
  const range = maxV - minV;

  const xS = i => pad.left + (i / (data.length - 1)) * pW;
  const yS = v => pad.top + pH - ((v - minV) / range) * pH;
  const pts = data.map((e, i) => ({ x: xS(i), y: yS(e[cfg.key]), v: e[cfg.key], date: e.date }));

  // Smooth bezier line
  const line = pts.map((p, i) => {
    if (i === 0) return `M${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    const prev = pts[i - 1];
    const cx = ((prev.x + p.x) / 2).toFixed(1);
    return `C${cx},${prev.y.toFixed(1)} ${cx},${p.y.toFixed(1)} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(' ');

  const last = pts[pts.length - 1], first = pts[0];
  const area = `${line} L${last.x.toFixed(1)},${(pad.top + pH)} L${first.x.toFixed(1)},${(pad.top + pH)} Z`;

  // Grid + Y labels (3 levels)
  const gridVals = [minV, minV + range / 2, maxV];
  const grid = gridVals.map(v => {
    const y = yS(v).toFixed(1);
    const lbl = Number.isInteger(v) ? v : v.toFixed(1);
    return `<line x1="${pad.left}" y1="${y}" x2="${W - pad.right}" y2="${y}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <text x="${pad.left - 4}" y="${y}" text-anchor="end" dominant-baseline="middle" fill="rgba(255,255,255,0.38)" font-size="9">${lbl}</text>`;
  }).join('');

  // X date labels (max 5, always include last)
  const step = Math.max(1, Math.ceil(pts.length / 5));
  const xLabels = pts.map((p, i) => {
    if (i % step !== 0 && i !== pts.length - 1) return '';
    const d = new Date(p.date);
    return `<text x="${p.x.toFixed(1)}" y="${H - 2}" text-anchor="middle" fill="rgba(255,255,255,0.38)" font-size="9">${d.getDate()}/${d.getMonth() + 1}</text>`;
  }).join('');

  // Dots
  const dots = pts.map((p, i) => {
    const isLast = i === pts.length - 1;
    return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${isLast ? 4.5 : 3}" fill="${cfg.color}" stroke="rgba(6,6,18,0.85)" stroke-width="1.5"/>`;
  }).join('');

  // Last value label
  const lastLabel = `<text x="${last.x.toFixed(1)}" y="${Math.max(pad.top - 2, last.y - 7).toFixed(1)}" text-anchor="middle" fill="${cfg.color}" font-size="10" font-weight="700">${last.v % 1 === 0 ? last.v : last.v.toFixed(1)} ${cfg.unit}</text>`;

  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block;" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cg_${cfg.key}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${cfg.color}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="${cfg.color}" stop-opacity="0.02"/>
      </linearGradient>
    </defs>
    ${grid}
    <path d="${area}" fill="url(#cg_${cfg.key})"/>
    <path d="${line}" fill="none" stroke="${cfg.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}
    ${lastLabel}
    ${xLabels}
  </svg>`;
}
// ── Body composition helpers ─────────────────────────────
function _compBar(value, scaleMax, idealMin, idealMax, color) {
  if (value == null || isNaN(value)) return '';
  const fill = Math.min(100, Math.max(0, (value / scaleMax) * 100));
  const iL   = Math.min(100, (idealMin / scaleMax) * 100);
  const iW   = Math.min(100 - iL, ((idealMax - idealMin) / scaleMax) * 100);
  return `<div style="position:relative;height:7px;background:rgba(255,255,255,0.08);border-radius:4px;margin:5px 0 3px;overflow:hidden;">
    <div style="position:absolute;left:${iL.toFixed(1)}%;width:${iW.toFixed(1)}%;height:100%;background:rgba(0,212,170,0.2);border-left:2px solid rgba(0,212,170,0.55);border-right:2px solid rgba(0,212,170,0.55);"></div>
    <div style="position:absolute;left:0;width:${fill.toFixed(1)}%;height:100%;background:${color};border-radius:4px;"></div>
    <div style="position:absolute;top:-3px;left:calc(${fill.toFixed(1)}% - 1px);width:3px;height:13px;background:#fff;border-radius:2px;"></div>
  </div>`;
}

function _bodyFatStatus(pct, g) {
  if (g === 'f') {
    if (pct < 14)  return { key:'st_very_low',   label:t('st_very_low'),   color:'#ff4757' };
    if (pct <= 20) return { key:'st_athletic_f', label:t('st_athletic_f'), color:'#00d4aa' };
    if (pct <= 30) return { key:'st_optimal',    label:t('st_optimal'),    color:'#00d4aa' };
    if (pct <= 35) return { key:'st_acceptable', label:t('st_acceptable'), color:'#ffd700' };
    if (pct <= 40) return { key:'st_excess',     label:t('st_excess'),     color:'#ff6b35' };
    return                 { key:'st_obesity',   label:t('st_obesity'),    color:'#ff4757' };
  }
  if (pct < 6)   return { key:'st_very_low',   label:t('st_very_low'),   color:'#ff4757' };
  if (pct <= 13) return { key:'st_athletic_m', label:t('st_athletic_m'), color:'#00d4aa' };
  if (pct <= 20) return { key:'st_optimal',    label:t('st_optimal'),    color:'#00d4aa' };
  if (pct <= 25) return { key:'st_acceptable', label:t('st_acceptable'), color:'#ffd700' };
  if (pct <= 30) return { key:'st_excess',     label:t('st_excess'),     color:'#ff6b35' };
  return                 { key:'st_obesity',   label:t('st_obesity'),    color:'#ff4757' };
}
function _muscleMassStatus(pct, g) {
  if (g === 'f') {
    if (pct < 24)  return { key:'st_low',      label:t('st_low'),       color:'#ff6b35' };
    if (pct <= 30) return { key:'st_normal',   label:t('st_normal'),    color:'#ffd700' };
    if (pct <= 35) return { key:'st_good',     label:t('st_good'),      color:'#00d4aa' };
    return                 { key:'st_excellent',label:t('st_excellent'), color:'#00d4aa' };
  }
  if (pct < 33)  return { key:'st_low',        label:t('st_low'),       color:'#ff6b35' };
  if (pct <= 39) return { key:'st_normal',     label:t('st_normal'),    color:'#ffd700' };
  if (pct <= 44) return { key:'st_good',       label:t('st_good'),      color:'#00d4aa' };
  return                 { key:'st_excellent', label:t('st_excellent'),  color:'#00d4aa' };
}
function _boneMassStatus(kg, g) {
  if (g === 'f') {
    if (kg < 1.8)  return { key:'st_low',    label:t('st_low'),    color:'#ff6b35' };
    if (kg <= 3.2) return { key:'st_normal', label:t('st_normal'), color:'#00d4aa' };
    return                 { key:'st_high',  label:t('st_high'),   color:'#ffd700' };
  }
  if (kg < 2.5)  return { key:'st_low',    label:t('st_low'),    color:'#ff6b35' };
  if (kg <= 4.5) return { key:'st_normal', label:t('st_normal'), color:'#00d4aa' };
  return                 { key:'st_high',  label:t('st_high'),   color:'#ffd700' };
}
function _waterStatus(pct, g) {
  const [lo, hi] = g === 'f' ? [50, 60] : [55, 65];
  if (pct < lo - 5) return { key:'st_very_low', label:t('st_very_low'), color:'#ff4757' };
  if (pct < lo)     return { key:'st_low',      label:t('st_low'),      color:'#ff6b35' };
  if (pct <= hi)    return { key:'st_optimal',  label:t('st_optimal'),  color:'#00d4aa' };
  if (pct <= hi+5)  return { key:'st_elevated', label:t('st_elevated'), color:'#ffd700' };
  return                    { key:'st_very_high',label:t('st_very_high'),color:'#ff4757' };
}
function _visceralStatus(idx) {
  if (idx <= 9)  return { key:'st_healthy',   label:t('st_healthy'),   color:'#00d4aa' };
  if (idx <= 14) return { key:'st_excess',    label:t('st_excess'),    color:'#ffd700' };
  if (idx <= 19) return { key:'st_high',      label:t('st_high'),      color:'#ff6b35' };
  return                 { key:'st_very_high',label:t('st_very_high'), color:'#ff4757' };
}
function _weightStatus(kg, heightCm) {
  if (!heightCm) return { key:'', label:'', color:'#00d4aa' };
  const bmi = kg / ((heightCm / 100) ** 2);
  if (bmi < 18.5) return { key:'st_underweight',   label:t('st_underweight'),   color:'#00aaff' };
  if (bmi < 25)   return { key:'st_normal_weight', label:t('st_normal_weight'), color:'#00d4aa' };
  if (bmi < 30)   return { key:'st_overweight',    label:t('st_overweight'),    color:'#ffd700' };
  if (bmi < 35)   return { key:'st_obese1',        label:t('st_obese1'),        color:'#ff6b35' };
  return           { key:'st_obese2', label:t('st_obese2'), color:'#ff4757' };
}
function _metAgeStatus(metAge, realAge) {
  if (realAge == null) return { key:'', label:'', color:'#00d4aa' };
  const d = metAge - realAge;
  if (d <= -5) return { key:'st_excellent',  label:t('st_excellent'),  color:'#00d4aa' };
  if (d <= 0)  return { key:'st_good',       label:t('st_good'),       color:'#00d4aa' };
  if (d <= 5)  return { key:'st_reasonable', label:t('st_reasonable'), color:'#ffd700' };
  return               { key:'st_above_age', label:t('st_above_age'),  color:'#ff4757' };
}

function _compRow(label, value, unit, extra, idealMin, idealMax, scaleMax, statusFn, statusArg, notes) {
  const st   = value != null ? statusFn(value, statusArg) : null;
  const bar  = value != null ? _compBar(value, scaleMax, idealMin, idealMax, st.color) : '';
  const note = (st && st.key && notes && notes[st.key])
    ? `<div style="font-size:0.68rem;color:var(--muted);margin-top:5px;line-height:1.45;padding:5px 8px;background:rgba(255,255,255,0.03);border-left:2px solid ${st.color};border-radius:0 4px 4px 0;">${t(notes[st.key])}</div>`
    : '';
  const val = value != null
    ? `<span style="font-size:1.05rem;font-weight:800;color:var(--text);">${value}</span><span style="font-size:0.78rem;color:var(--muted);margin-left:3px;">${unit}</span>${extra ? `<span style="font-size:0.75rem;color:var(--muted);margin-left:6px;">${extra}</span>` : ''}`
    : `<span style="font-size:0.85rem;color:var(--muted);">${t('comp_not_registered')}</span>`;
  return `<div style="margin-bottom:14px;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
      <span style="font-size:0.75rem;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.04em;">${label}</span>
      ${st ? `<span style="font-size:0.7rem;font-weight:700;color:${st.color};">● ${st.label}</span>` : ''}
    </div>
    <div style="margin-bottom:1px;">${val}</div>
    ${bar}
    ${value != null ? `<div style="font-size:0.65rem;color:var(--muted);">${t('comp_ideal_label')} ${idealMin}–${idealMax} ${unit}</div>` : ''}
    ${note}
  </div>`;
}
// ─────────────────────────────────────────────────────────

function renderProfileTab() {
  const profile = getProfile();
  if (!profile) return;
  const hp = getHealthProfile();
  const comp = profile.bodyComposition || {};
  const history = profile.bodyCompHistory || [];
  const g = profile.gender || 'm';
  const w = profile.weight;

  const photoHtml = profile.photo
    ? `<img src="${profile.photo}" style="width:84px;height:84px;border-radius:50%;object-fit:cover;display:block;">`
    : `<div style="width:84px;height:84px;border-radius:50%;background:${profile.color};display:flex;align-items:center;justify-content:center;font-size:2.2rem;font-weight:800;color:#fff;">${profile.name[0].toUpperCase()}</div>`;

  const healthSummary = (() => {
    const parts = [];
    if (hp.conditions.length) parts.push(`${hp.conditions.length} ${hp.conditions.length > 1 ? t('cond_conditions') : t('cond_condition')}`);
    if (hp.allergies.length)  parts.push(`${hp.allergies.length} ${hp.allergies.length > 1 ? t('cond_allergies') : t('cond_allergy')}`);
    if (hp.injuries.length)   parts.push(`${hp.injuries.length} ${hp.injuries.length > 1 ? t('cond_injuries') : t('cond_injury')}`);
    return parts.length ? parts.join(' · ') : t('cond_none');
  })();

  // Pre-calculate kg values from % + weight
  const fatKg     = (comp.bodyFat != null && w)     ? `= ${(w * comp.bodyFat / 100).toFixed(1)} kg`     : '';
  const muscleKg  = (comp.muscleMass != null && w)  ? `= ${(w * comp.muscleMass / 100).toFixed(1)} kg`  : '';

  // Weight ideal range from BMI (18.5–24.9)
  const h = profile.height;
  const weightIdealMin = h ? Math.round(18.5 * (h / 100) ** 2 * 10) / 10 : null;
  const weightIdealMax = h ? Math.round(24.9 * (h / 100) ** 2 * 10) / 10 : null;
  const weightScaleMax = h ? Math.round(35   * (h / 100) ** 2)           : 150;
  const weightExtra    = h && w ? `IMC ${(w / (h / 100) ** 2).toFixed(1)}` : '';
  // Gender-specific ideal ranges
  const fatIdeal    = g === 'f' ? [20, 30] : [10, 20];
  const muscleIdeal = g === 'f' ? [24, 35] : [33, 44];
  const boneIdeal   = g === 'f' ? [2.0, 3.2] : [2.7, 4.5];
  const waterIdeal  = g === 'f' ? [50, 60]   : [55, 65];
  const fatScale    = g === 'f' ? 55 : 45;
  const muscleScale = g === 'f' ? 50 : 60;
  const boneScale   = g === 'f' ? 5  : 6;

  // Compact metric row helper
  const cm = (key, label, val, unit, idealMin, idealMax, scaleMax, statusFn, statusArg, notes) => {
    const st = val != null ? statusFn(val, statusArg) : null;
    const bar = val != null ? _compBar(val, scaleMax, idealMin, idealMax, st.color) : '';
    const idealLbl = val != null ? `<div style="font-size:0.62rem;color:var(--muted);margin-top:1px;">ideal ${idealMin}–${idealMax} ${unit}</div>` : '';
    const noteText = st ? (_WEIGHT_NOTES === notes ? notes : notes)[st.label] || '' : '';
    const noteHtml = noteText ? `<div style="font-size:0.67rem;color:var(--muted);margin-top:4px;line-height:1.4;padding:4px 8px;background:rgba(255,255,255,0.03);border-left:2px solid ${st.color};border-radius:0 4px 4px 0;">${noteText}</div>` : '';
    return `<div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
        <span style="font-size:0.7rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;">${label}</span>
        <span id="cst-${key}" style="font-size:0.68rem;font-weight:700;${st?'color:'+st.color:'color:transparent'};">${st?'● '+st.label:'●'}</span>
      </div>
      <div id="cbar-${key}">${bar}${idealLbl}</div>
      <div id="cnote-${key}">${noteHtml}</div>
    </div>`;
  };

  const cinp = (id, val, ph, step='0.1', min='0') =>
    `<input type="number" id="${id}" value="${val!=null?val:''}" placeholder="${ph}" step="${step}" min="${min}"
      oninput="liveComp('${id.replace('comp-','')}')"
      style="width:72px;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:6px 8px;font-size:0.9rem;font-weight:700;outline:none;text-align:center;">`;

  // Which chart metrics have data in history
  const availableMetrics = _CHART_METRICS.filter(m =>
    m.key === 'weight' ? history.some(e => e.weight != null) : history.some(e => e[m.key] != null)
  );

  const historyHtml = history.length ? `
    <div style="margin-top:18px;">
      <div style="font-size:0.7rem;font-weight:700;color:var(--muted);margin-bottom:10px;text-transform:uppercase;letter-spacing:.05em;">${t('comp_history_label')}</div>

      ${availableMetrics.length >= 2 ? `
        <!-- Chart metric selector -->
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
          ${availableMetrics.map(m => {
            const active = m.key === _profileChartMetric;
            return `<button class="chart-chip" data-metric="${m.key}" onclick="switchChartMetric('${m.key}')"
              style="padding:4px 10px;border-radius:20px;font-size:0.7rem;cursor:pointer;border:1px solid ${active ? 'var(--orange)' : 'var(--border)'};
              background:${active ? 'rgba(255,107,53,0.18)' : 'rgba(255,255,255,0.05)'};
              color:${active ? 'var(--orange)' : 'var(--muted)'};font-weight:${active ? '700' : '500'};">${m.label}</button>`;
          }).join('')}
        </div>
        <!-- Chart -->
        <div id="profile-chart-container" style="margin-bottom:14px;background:rgba(255,255,255,0.02);border-radius:10px;padding:8px 4px 2px;"></div>
      ` : ''}

      <!-- Data rows -->
      ${(() => {
        const sorted = [...history].reverse();
        const renderRow = e => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);font-size:0.74rem;">
            <span style="color:var(--muted);flex-shrink:0;">${new Date(e.date).toLocaleDateString('pt-PT',{day:'numeric',month:'short',year:'2-digit'})}</span>
            <span style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;">
              ${e.weight       != null ? `<span>${e.weight} kg</span>` : ''}
              ${e.bodyFat      != null ? `<span style="color:#ff6b35;">${e.bodyFat}% GC</span>` : ''}
              ${e.muscleMass   != null ? `<span style="color:#00d4aa;">${e.muscleMass}% MM</span>` : ''}
              ${e.water        != null ? `<span style="color:#00aaff;">${e.water}% H₂O</span>` : ''}
              ${e.visceralFat  != null ? `<span style="color:#ff6b35;">V:${e.visceralFat}</span>` : ''}
              ${e.metabolicAge != null ? `<span style="color:#00aaff;">${e.metabolicAge}a.m.</span>` : ''}
            </span>
          </div>`;
        const visible = sorted.slice(0, 6).map(renderRow).join('');
        const hidden  = sorted.slice(6);
        const extra = hidden.length ? `
          <div id="history-extra" style="display:none;">${hidden.map(renderRow).join('')}</div>
          <button onclick="toggleHistoryAll()" id="btn-history-more"
            style="width:100%;background:none;border:none;color:var(--muted);font-size:0.74rem;cursor:pointer;padding:8px 0;text-align:center;">
            ${t('comp_see_all')} ${history.length} ${t('comp_records_label')}
          </button>` : '';
        return visible + extra;
      })()}
    </div>` : '';

  const inp = (id, val, ph, step='0.1', min='0') =>
    `<input type="number" id="${id}" value="${val != null ? val : ''}" placeholder="${ph}" step="${step}" min="${min}"
      style="width:80px;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:7px 8px;font-size:0.95rem;font-weight:700;outline:none;text-align:center;">`;

  document.getElementById('profile-tab-body').innerHTML = `
    <div class="section">

      <!-- Avatar + nome -->
      <div style="display:flex;flex-direction:column;align-items:center;padding-top:12px;margin-bottom:24px;">
        <div style="position:relative;cursor:pointer;" onclick="document.getElementById('profile-photo-input').click()">
          ${photoHtml}
          <div style="position:absolute;bottom:0;right:0;width:26px;height:26px;background:var(--orange);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.8rem;border:2px solid var(--bg);">📷</div>
        </div>
        <input type="file" id="profile-photo-input" accept="image/*" style="display:none;" onchange="handleAvatarUpload(this)">
        <div style="margin-top:12px;font-size:1.3rem;font-weight:800;">${profile.name}</div>
        <div style="font-size:0.78rem;color:var(--muted);margin-top:3px;">${goalLabel(profile.goal)} · ${g === 'f' ? t('female') : t('male')}</div>
        <button onclick="showProfileScreen()" style="margin-top:8px;background:none;border:1px solid var(--border);border-radius:20px;padding:4px 14px;font-size:0.72rem;color:var(--muted);cursor:pointer;">${t('profile_change')}</button>
      </div>

      <!-- Dados pessoais -->
      <div class="card" style="margin-bottom:14px;">
        <div class="section-title" style="margin-bottom:10px;">${t('profile_personal')}</div>
        <div style="margin-bottom:10px;">
          <div class="form-group" style="margin-bottom:10px;"><label>${t('profile_name')}</label><input type="text" id="prof-name" value="${profile.name}"></div>
          <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end;">
            <div>
              <div style="font-size:0.68rem;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;">${t('profile_age')}</div>
              <input type="number" id="prof-age" value="${profile.age || ''}" placeholder="25" min="14" max="100"
                style="width:68px;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:8px;font-size:0.9rem;outline:none;text-align:center;">
            </div>
            <div>
              <div style="font-size:0.68rem;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;">${t('profile_height')}</div>
              <input type="number" id="prof-height" value="${profile.height || ''}" placeholder="175"
                style="width:80px;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:8px;font-size:0.9rem;outline:none;text-align:center;">
            </div>
            <div>
              <div style="font-size:0.68rem;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;">${t('profile_gender')}</div>
              <select id="prof-gender" style="background:#12121f;border:1px solid var(--border);border-radius:8px;color:#fff;padding:8px 10px;font-size:0.88rem;outline:none;cursor:pointer;">
                <option value="m" style="background:#12121f;color:#fff;" ${g === 'm' ? 'selected' : ''}>${t('male')}</option>
                <option value="f" style="background:#12121f;color:#fff;" ${g === 'f' ? 'selected' : ''}>${t('female')}</option>
              </select>
            </div>
            <div>
              <div style="font-size:0.68rem;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;">${t('profile_objective')}</div>
              <select id="prof-goal" style="background:#12121f;border:1px solid var(--border);border-radius:8px;color:#fff;padding:8px 10px;font-size:0.88rem;outline:none;cursor:pointer;">
                <option value="cut"      style="background:#12121f;color:#fff;" ${profile.goal === 'cut'      ? 'selected' : ''}>${t('goal_cut')}</option>
                <option value="maintain" style="background:#12121f;color:#fff;" ${profile.goal === 'maintain' ? 'selected' : ''}>${t('goal_maintain')}</option>
                <option value="bulk"     style="background:#12121f;color:#fff;" ${profile.goal === 'bulk'     ? 'selected' : ''}>${t('goal_bulk')}</option>
              </select>
            </div>
          </div>
        </div>
        <button class="btn btn-primary btn-full" onclick="saveProfileInfo()">✔ ${t('btn_save')}</button>
      </div>

      <!-- Composição Corporal -->
      <div class="card" style="margin-bottom:14px;">
        <div class="section-title" style="margin-bottom:2px;">📊 ${t('profile_body_comp')}</div>
        <div style="font-size:0.72rem;color:var(--muted);margin-bottom:14px;">${t('comp_bar_hint')}</div>

        <!-- Peso -->
        ${cm('weight',t('comp_weight_label'),w,'kg',weightIdealMin,weightIdealMax,weightScaleMax,_weightStatus,h,_WEIGHT_NOTES)}
        <div style="display:flex;align-items:center;gap:6px;margin:5px 0 10px;">
          ${cinp('comp-weight',w,'70','0.1','1')}
          <span style="font-size:0.78rem;color:var(--muted);">kg</span>
          <span id="cextra-weight" style="font-size:0.72rem;color:var(--muted);">${weightExtra}</span>
        </div>
        <div style="height:1px;background:var(--border);margin:0 0 10px;"></div>

        <!-- Massa Gorda -->
        ${cm('fat',t('comp_fat_label'),comp.bodyFat,'%',fatIdeal[0],fatIdeal[1],fatScale,_bodyFatStatus,g,_FAT_NOTES)}
        <div style="display:flex;align-items:center;gap:6px;margin:5px 0 10px;">
          ${cinp('comp-fat',comp.bodyFat,'15','0.1','0')}
          <span style="font-size:0.78rem;color:var(--muted);">%</span>
          <span id="cextra-fat" style="font-size:0.72rem;color:var(--muted);">${fatKg}</span>
        </div>
        <div style="height:1px;background:var(--border);margin:0 0 10px;"></div>

        <!-- Massa Muscular -->
        ${cm('muscle',t('comp_muscle_label'),comp.muscleMass,'%',muscleIdeal[0],muscleIdeal[1],muscleScale,_muscleMassStatus,g,_MUSCLE_NOTES)}
        <div style="display:flex;align-items:center;gap:6px;margin:5px 0 10px;flex-wrap:wrap;">
          <input type="number" id="comp-muscle" value="${comp.muscleMass!=null?comp.muscleMass:''}" placeholder="40" step="0.1" min="0"
            oninput="liveComp('muscle')"
            style="width:72px;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:6px 8px;font-size:0.9rem;font-weight:700;outline:none;text-align:center;">
          <span style="font-size:0.78rem;color:var(--muted);">%</span>
          <span style="font-size:0.72rem;color:var(--border);">|</span>
          <input type="number" id="comp-muscle-kg" value="${comp.muscleMass!=null&&w?(w*comp.muscleMass/100).toFixed(1):''}" placeholder="${w?(w*0.38).toFixed(0):'—'}" step="0.1" min="0"
            oninput="syncMuscleFromKg()"
            style="width:72px;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:6px 8px;font-size:0.9rem;font-weight:700;outline:none;text-align:center;">
          <span style="font-size:0.78rem;color:var(--muted);">kg</span>
        </div>
        <!-- Métricas Avançadas (balança inteligente) -->
        <details style="margin-top:4px;">
          <summary style="cursor:pointer;font-size:0.72rem;color:var(--muted);font-weight:700;
                          padding:8px 0;border-top:1px solid var(--border);list-style:none;
                          display:flex;align-items:center;justify-content:space-between;user-select:none;">
            <span>${t('comp_advanced_label')}</span>
            <span style="font-size:0.7rem;opacity:0.6;">▾</span>
          </summary>
          <div style="margin-top:8px;">
            <div style="font-size:0.68rem;color:var(--muted);margin-bottom:10px;line-height:1.4;">
              ${t('comp_advanced_desc')}
            </div>

            <!-- Massa Óssea -->
            ${cm('bone',t('comp_bone_label'),comp.boneMass,'kg',boneIdeal[0],boneIdeal[1],boneScale,_boneMassStatus,g,_BONE_NOTES)}
            <div style="display:flex;align-items:center;gap:6px;margin:5px 0 10px;">
              ${cinp('comp-bone',comp.boneMass,'3.2','0.1','0')}
              <span style="font-size:0.78rem;color:var(--muted);">kg</span>
            </div>
            <div style="height:1px;background:var(--border);margin:0 0 10px;"></div>

            <!-- Água -->
            ${cm('water',t('comp_body_water'),comp.water,'%',waterIdeal[0],waterIdeal[1],80,_waterStatus,g,_WATER_NOTES)}
            <div style="display:flex;align-items:center;gap:6px;margin:5px 0 10px;">
              ${cinp('comp-water',comp.water,'60','0.1','30')}
              <span style="font-size:0.78rem;color:var(--muted);">%</span>
            </div>
            <div style="height:1px;background:var(--border);margin:0 0 10px;"></div>

            <!-- Gordura Visceral -->
            ${cm('visceral',t('comp_visceral_label'),comp.visceralFat,'índice',1,9,30,_visceralStatus,null,_VISCERAL_NOTES)}
            <div style="display:flex;align-items:center;gap:6px;margin:5px 0 10px;">
              ${cinp('comp-visceral',comp.visceralFat,'7','1','1')}
              <span style="font-size:0.78rem;color:var(--muted);">índice</span>
            </div>
            <div style="height:1px;background:var(--border);margin:0 0 10px;"></div>

            <!-- Idade Metabólica -->
            ${cm('metage',t('comp_metage_label'),comp.metabolicAge,'anos',Math.max(10,(profile.age||30)-10),profile.age||30,(profile.age||30)+20,_metAgeStatus,profile.age,_METAGE_NOTES)}
            <div style="display:flex;align-items:center;gap:6px;margin:5px 0 10px;">
              ${cinp('comp-metage',comp.metabolicAge,'30','1','10')}
              <span style="font-size:0.78rem;color:var(--muted);">anos${profile.age?` (real: ${profile.age}a)`:''}</span>
            </div>
          </div>
        </details>

        <button class="btn btn-secondary btn-sm btn-full" onclick="saveBodyComposition()" style="margin-top:8px;">${t('comp_add_history')}</button>
        ${historyHtml}
      </div>

      <!-- Medidas Corporais -->
      <details class="card" style="margin-bottom:14px;">
        <summary style="cursor:pointer;list-style:none;display:flex;align-items:center;
                        justify-content:space-between;user-select:none;">
          <span class="section-title" style="margin-bottom:0;">${t('comp_measurements')}</span>
          <span style="font-size:0.7rem;color:var(--muted);opacity:0.7;">▾</span>
        </summary>
        <div style="margin-top:10px;">
          <div style="font-size:0.75rem;color:var(--muted);margin-bottom:14px;">${t('comp_measurements_desc')}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
            <div class="form-group"><label>${t('comp_waist')}</label>
              <div style="display:flex;align-items:center;gap:6px;">${inp('comp-waist', comp.waist, '80','0.5')}<span style="font-size:0.75rem;color:var(--muted);">cm</span></div>
            </div>
            <div class="form-group"><label>${t('comp_hip')}</label>
              <div style="display:flex;align-items:center;gap:6px;">${inp('comp-hip', comp.hip, '95','0.5')}<span style="font-size:0.75rem;color:var(--muted);">cm</span></div>
            </div>
            <div class="form-group"><label>${t('comp_chest_m')}</label>
              <div style="display:flex;align-items:center;gap:6px;">${inp('comp-chest', comp.chest, '95','0.5')}<span style="font-size:0.75rem;color:var(--muted);">cm</span></div>
            </div>
            <div class="form-group"><label>${t('comp_arm')}</label>
              <div style="display:flex;align-items:center;gap:6px;">${inp('comp-arm', comp.arm, '35','0.5')}<span style="font-size:0.75rem;color:var(--muted);">cm</span></div>
            </div>
            <div class="form-group"><label>${t('comp_thigh')}</label>
              <div style="display:flex;align-items:center;gap:6px;">${inp('comp-thigh', comp.thigh, '55','0.5')}<span style="font-size:0.75rem;color:var(--muted);">cm</span></div>
            </div>
            <div class="form-group"><label>${t('comp_calf')}</label>
              <div style="display:flex;align-items:center;gap:6px;">${inp('comp-calf', comp.calf, '36','0.5')}<span style="font-size:0.75rem;color:var(--muted);">cm</span></div>
            </div>
          </div>
          <button class="btn btn-secondary btn-full" onclick="saveMeasurements()">${t('comp_save_measurements')}</button>
        </div>
      </details>

      <!-- Perfil de saúde -->
      <div class="card" style="margin-bottom:14px;">
        <div class="section-title" style="margin-bottom:6px;">${t('profile_health_section')}</div>
        <div style="font-size:0.8rem;color:var(--muted);margin-bottom:12px;">${healthSummary}</div>
        <button class="btn btn-secondary btn-full" onclick="openHealthModal()">${t('profile_health_edit')}</button>
      </div>

      <!-- Lembretes -->
      <div class="card" style="margin-bottom:14px;">
        <div class="section-title" style="margin-bottom:8px;">${t('profile_reminder_section')}</div>
        <p style="font-size:0.78rem;color:var(--muted);margin-bottom:12px;line-height:1.5;">
          ${t('profile_reminder_desc')}
        </p>
        ${profile.reminderTime ? `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding:8px 12px;
                      background:rgba(255,107,53,0.08);border:1px solid rgba(255,107,53,0.25);border-radius:8px;">
            <span style="font-size:0.85rem;">🔔</span>
            <span style="font-size:0.82rem;color:var(--orange);font-weight:700;">${t('profile_reminder_at')} ${profile.reminderTime}</span>
            <button onclick="scheduleWorkoutReminder('')" style="margin-left:auto;background:none;border:none;color:var(--muted);cursor:pointer;font-size:0.75rem;">${t('profile_reminder_remove')}</button>
          </div>` : ''}
        <div style="display:flex;gap:8px;align-items:center;">
          <input type="time" id="reminder-time" value="${profile.reminderTime || '07:30'}"
            style="flex:1;background:var(--card);border:1px solid var(--border);border-radius:8px;
                   color:var(--text);padding:9px 12px;font-size:0.9rem;outline:none;">
          <button onclick="setReminder()" class="btn btn-primary" style="white-space:nowrap;padding:9px 16px;">
            ${t('profile_reminder_enable')}
          </button>
        </div>
      </div>

      <!-- Terminar sessão -->
      <div style="text-align:center;margin-top:6px;">
        <button onclick="fbLogout()" style="background:none;border:1px solid rgba(255,71,87,0.3);border-radius:20px;padding:8px 20px;color:rgba(255,71,87,0.7);font-size:0.8rem;cursor:pointer;">Terminar sessão</button>
      </div>

      <!-- Zona de perigo -->
      <div style="text-align:center;padding-bottom:40px;margin-top:10px;">
        <button onclick="confirmDeleteProfile()" style="background:none;border:none;color:var(--muted);font-size:0.75rem;cursor:pointer;text-decoration:underline;opacity:0.6;">${t('profile_delete')}</button>
      </div>

    </div>
  `;
  _renderProfileChart();
}

function renderEquipmentSection(profile) {
  // kept for potential future use — equipment is now in workout tab
  return '';
}

function toggleEqPicker() {
  _eqPickerOpen = !_eqPickerOpen;
  const body  = document.getElementById('eq-picker-body');
  const arrow = document.getElementById('eq-arrow');
  if (body)  body.style.display    = _eqPickerOpen ? 'block' : 'none';
  if (arrow) arrow.style.transform  = `rotate(${_eqPickerOpen ? 180 : 0}deg)`;
}

function toggleHomeEquipment(eqId) {
  const profile = getProfile();
  if (!profile) return;
  const list = profile.homeEquipment || [];
  const idx = list.indexOf(eqId);
  if (idx === -1) list.push(eqId);
  else list.splice(idx, 1);
  profile.homeEquipment = list;
  saveProfile(profile);
  // Re-render chips + template cards (equipment cards appear/disappear instantly)
  renderWorkoutTemplatePills();
  // Re-render exercise browser regardless — update locked/unlocked state
  if (workoutSelectedMuscles.length > 0) {
    renderExerciseBrowser(profile);
  }
}

function saveProfileInfo() {
  const profile = getProfile();
  if (!profile) return;
  const name = document.getElementById('prof-name').value.trim();
  if (!name) { showToast(t('t_name_required')); return; }
  profile.name   = name;
  profile.age    = parseInt(document.getElementById('prof-age').value) || null;
  profile.height = parseFloat(document.getElementById('prof-height').value) || null;
  profile.gender = document.getElementById('prof-gender').value;
  profile.goal   = document.getElementById('prof-goal').value;
  saveProfile(profile);
  updateTopbarAvatar(profile);
  updateNavAvatar();
  renderProfileTab();
  showToast(t('t_profile_saved'));
}

function _parseField(id) {
  const v = parseFloat(document.getElementById(id)?.value);
  return isNaN(v) ? null : v;
}

function saveBodyComposition() {
  const profile = getProfile();
  if (!profile) return;
  if (!profile.bodyComposition) profile.bodyComposition = {};
  const c = profile.bodyComposition;
  const newWeight = _parseField('comp-weight');
  if (newWeight) profile.weight = newWeight;
  c.bodyFat      = _parseField('comp-fat')      ?? c.bodyFat;
  c.muscleMass   = _parseField('comp-muscle')   ?? c.muscleMass;
  c.boneMass     = _parseField('comp-bone')     ?? c.boneMass;
  c.water        = _parseField('comp-water')    ?? c.water;
  c.visceralFat  = _parseField('comp-visceral') ?? c.visceralFat;
  c.metabolicAge = _parseField('comp-metage')   ?? c.metabolicAge;

  if (!profile.bodyCompHistory) profile.bodyCompHistory = [];
  profile.bodyCompHistory.push({
    date:         new Date().toISOString(),
    weight:       profile.weight,
    bodyFat:      c.bodyFat,
    muscleMass:   c.muscleMass,
    boneMass:     c.boneMass,
    water:        c.water,
    visceralFat:  c.visceralFat,
    metabolicAge: c.metabolicAge,
  });

  saveProfile(profile);
  renderProfileTab();
  showToast(t('t_composition_saved'));
}

function saveMeasurements() {
  const profile = getProfile();
  if (!profile) return;
  if (!profile.bodyComposition) profile.bodyComposition = {};
  const c = profile.bodyComposition;
  c.waist  = _parseField('comp-waist')  ?? c.waist;
  c.hip    = _parseField('comp-hip')    ?? c.hip;
  c.chest  = _parseField('comp-chest')  ?? c.chest;
  c.arm    = _parseField('comp-arm')    ?? c.arm;
  c.thigh  = _parseField('comp-thigh')  ?? c.thigh;
  c.calf   = _parseField('comp-calf')   ?? c.calf;
  saveProfile(profile);
  renderProfileTab();
  showToast(t('t_measurements_saved'));
}

function handleAvatarUpload(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast(t('t_img_too_large')); return; }
  const reader = new FileReader();
  reader.onload = function(e) {
    const profile = getProfile();
    if (!profile) return;
    // Resize to max 300px using canvas to save space in localStorage
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const max = 300;
      const ratio = Math.min(max / img.width, max / img.height, 1);
      canvas.width  = Math.round(img.width  * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      profile.photo = canvas.toDataURL('image/jpeg', 0.82);
      saveProfile(profile);
      updateTopbarAvatar(profile);
      renderProfileTab();
      showToast(t('t_photo_updated'));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function syncMuscleFromPct() {
  const profile = getProfile();
  const pct = parseFloat(document.getElementById('comp-muscle')?.value);
  const kgEl = document.getElementById('comp-muscle-kg');
  if (!kgEl) return;
  if (!isNaN(pct) && profile?.weight) {
    kgEl.value = (profile.weight * pct / 100).toFixed(1);
  } else {
    kgEl.value = '';
  }
}

function syncMuscleFromKg() {
  const profile = getProfile();
  const kg = parseFloat(document.getElementById('comp-muscle-kg')?.value);
  const pctEl = document.getElementById('comp-muscle');
  if (!pctEl) return;
  if (!isNaN(kg) && profile?.weight) {
    pctEl.value = (kg / profile.weight * 100).toFixed(1);
  } else {
    pctEl.value = '';
  }
}

function toggleHistoryAll() {
  const extra = document.getElementById('history-extra');
  const btn   = document.getElementById('btn-history-more');
  if (!extra || !btn) return;
  const open = extra.style.display !== 'none';
  extra.style.display = open ? 'none' : 'block';
  const total = (getProfile()?.bodyCompHistory || []).length;
  btn.textContent = open ? `${t('comp_see_all')} ${total} ${t('comp_records_label')}` : t('comp_show_less');
}

function confirmDeleteProfile() {
  if (!confirm(t('confirm_delete_profile'))) return;
  const d = getData();
  d.profiles = d.profiles.filter(p => p.id !== d.activeProfile);
  d.activeProfile = d.profiles.length ? d.profiles[0].id : null;
  saveData(d);
  showProfileScreen();
}

// ═══════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════

function renderDashboard() {
  const profile = getProfile();
  if (!profile) return;

  const now = new Date();
  const dayOfWeek = now.getDay();
  document.getElementById('dash-greeting').textContent = `${t('dash_hello')}, ${profile.name.split(' ')[0]}! 👋`;
  document.getElementById('dash-date').textContent = now.toLocaleDateString(getDateLocale(), { weekday:'long', day:'numeric', month:'long' });
  // Week count
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - dayOfWeek); weekStart.setHours(0,0,0,0);
  const thisWeekWorkouts = (profile.workoutHistory || []).filter(w => new Date(w.date) >= weekStart);
  document.getElementById('dash-week-count').textContent = thisWeekWorkouts.length;

  // Planned days this week
  const plannedDays = Object.values(profile.weeklyPlan || {}).filter(muscles => muscles && muscles.length > 0).length;
  document.getElementById('dash-planned-count').textContent = plannedDays;

  // Today muscles
  const todayMuscles = profile.weeklyPlan[dayOfWeek] || [];
  const muscleEl = document.getElementById('dash-today-muscles');
  const btn = document.getElementById('btn-start-workout');
  if (todayMuscles.length) {
    muscleEl.innerHTML = '<div class="chip-row">' + todayMuscles.map(m => `<span class="badge badge-orange">${tMuscle(m)}</span>`).join('') + '</div>';
    btn.innerHTML = `⚡ ${t('nav_workout')}`;
    btn.style.display = '';
  } else {
    muscleEl.innerHTML = `<span style="color:var(--muted); font-size:0.85rem;">${t('dash_rest_day_plan')}</span>`;
    btn.innerHTML = t('dash_free_workout');
    btn.style.display = '';
  }

  // Amanhã (atalho para planear)
  const tmrCard = document.getElementById('dash-tomorrow-card');
  if (tmrCard) {
    const tomorrow = (dayOfWeek + 1) % 7;
    const tomorrowMuscles = profile.weeklyPlan[tomorrow] || [];
    const tomorrowPlan = (profile.weeklyWorkoutPlan && profile.weeklyWorkoutPlan[tomorrow]) || null;
    const planBadge = (tomorrowPlan && tomorrowPlan.length)
      ? `<span style="color:var(--orange);font-weight:700;"> · ${tomorrowPlan.length} ${t('exercises_label')}</span>` : '';
    tmrCard.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <div style="min-width:0;">
          <div class="section-title" style="margin-bottom:4px;">${t('dash_tomorrow_title')} · ${_dayFull(tomorrow)}</div>
          <div style="font-size:0.82rem;color:${tomorrowMuscles.length ? 'var(--text)' : 'var(--muted)'};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            ${tomorrowMuscles.length ? tomorrowMuscles.map(m => tMuscle(m)).join(', ') + planBadge : t('plan_rest_day_msg')}
          </div>
        </div>
        <button onclick="openDayModal(${tomorrow})"
          style="background:rgba(255,107,53,0.1);border:1px solid rgba(255,107,53,0.3);color:var(--orange);
                 border-radius:8px;padding:7px 13px;font-size:0.78rem;font-weight:700;cursor:pointer;white-space:nowrap;flex-shrink:0;">
          ✏️ ${t('plan_edit_btn')}
        </button>
      </div>`;
  }

  // Streak + água
  _updateStreakDashboard(profile);
  _updateWaterDashboard(profile);

  // Week progress
  const wp = document.getElementById('dash-week-progress');
  wp.innerHTML = DAYS.map((d, i) => {
    const muscles = profile.weeklyPlan[i] || [];
    const done = thisWeekWorkouts.find(w => new Date(w.date).getDay() === i);
    const isToday = i === dayOfWeek;
    const dayColor = isToday ? 'var(--orange)' : done ? 'rgba(255,255,255,0.75)' : 'var(--muted)';

    let badge;
    if (done) {
      badge = `<span style="background:rgba(0,212,170,0.15);color:var(--green);border:1px solid rgba(0,212,170,0.3);border-radius:20px;padding:2px 9px;font-size:0.6rem;font-weight:700;white-space:nowrap;flex-shrink:0;">✓ Feito</span>`;
    } else if (muscles.length) {
      badge = `<span style="background:rgba(255,107,53,0.12);color:var(--orange);border:1px solid rgba(255,107,53,0.28);border-radius:20px;padding:2px 9px;font-size:0.6rem;font-weight:700;white-space:nowrap;flex-shrink:0;">▸ Planeado</span>`;
    } else {
      badge = `<span style="background:rgba(255,255,255,0.04);color:var(--muted);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:2px 9px;font-size:0.6rem;font-weight:600;white-space:nowrap;flex-shrink:0;">· Descanso</span>`;
    }

    return `<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
      <div style="width:30px;font-size:0.68rem;font-weight:700;color:${dayColor};flex-shrink:0;">${DAYS[i]}</div>
      ${badge}
      <div style="flex:1;font-size:0.65rem;color:var(--muted);overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">${muscles.length ? muscles.map(tMuscle).join(' · ') : ''}</div>
      ${isToday ? `<span style="font-size:0.55rem;background:rgba(255,107,53,0.15);color:var(--orange);border-radius:10px;padding:1px 6px;font-weight:700;flex-shrink:0;">HOJE</span>` : ''}
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════
//  PLANNER
// ═══════════════════════════════════════════════════════

let plannerSelectedDay = null;
let plannerSelectedMuscles = [];
let _plannerSelectedTemplate = null;
let plannerExercises = []; // sugestão editável de exercícios para o dia a planear

// ─── Split i18n lookup maps ────────────────────────────────────────
const _SPLIT_DESCS_GYM = {
  'Full Body':'split_d_fb','Superior / Inferior':'split_d_ui','Full Body A / B':'split_d_fb_ab',
  'Empurrar / Puxar':'split_d_pp','Push / Pull / Legs':'split_d_ppl','Full Body x3':'split_d_fb3',
  'Peito+Costas / Pernas / Ombros+Braços':'split_d_cla','Upper / Lower x2':'split_d_ul2',
  'Antagonistas ABCD':'split_d_ant','PPL + Full Body':'split_d_pplfb','Bro Split':'split_d_bro',
  'PPL + Upper / Lower':'split_d_pplu','Upper / Lower x2 + Full Body':'split_d_ul2fb',
  'PPL x2':'split_d_ppl2','Arnold Split':'split_d_ar','Upper / Lower x3':'split_d_ul3',
  'Arnold Split + Descanso':'split_d_ard','PPL x2 + Descanso':'split_d_ppl2r'
};
const _SPLIT_NAMES_GYM = {
  'Empurrar / Puxar':'split_n_pp',
  'Peito+Costas / Pernas / Ombros+Braços':'split_n_cla',
  'Antagonistas ABCD':'split_n_ant',
  'Arnold Split + Descanso':'split_n_ard',
  'PPL x2 + Descanso':'split_n_ppl2r'
};
const _SPLIT_DESCS_HOME = {
  'Full Body Casa':'split_hd_fb','Superior / Inferior':'split_hd_ui','Full Body A / B':'split_hd_fb_ab',
  'Full Body x3':'split_hd_fb3','Push / Pull / Legs':'split_hd_ppl','Superior / Core / Inferior':'split_hd_uci',
  'Superior / Inferior x2':'split_hd_ui2','Full Body / Core / Full Body / Cardio':'split_hd_fcc',
  'Push / Pull / Legs / Core':'split_hd_pplc','Full Body x5':'split_hd_fb5',
  'Superior / Inferior / Core / Push / Pull':'split_hd_5','PPL x2 Casa':'split_hd_ppl2',
  'Superior / Inferior x3':'split_hd_ui3','PPL x2 + Descanso':'split_hd_ppl2r',
  'Full Body Diário':'split_hd_day'
};
const _SPLIT_NAMES_HOME = {
  'Full Body Casa':'split_hn_fb',
  'PPL x2 Casa':'split_hn_ppl2',
  'Full Body Diário':'split_hn_day',
  'PPL x2 + Descanso':'split_n_ppl2r'
};

// ─── Configurador de dias de treino ───────────────────────────────
const SPLIT_OPTIONS = {
  1: [
    { name:'Full Body', icon:'💥', desc:'Treinas o corpo todo numa única sessão — ideal para quem tem 1 dia livre.',
      muscles:[['Peito','Costas','Pernas','Glúteos','Ombros','Abdômen']], labels:['Full Body'] }
  ],
  2: [
    { name:'Superior / Inferior', icon:'↕️', desc:'Parte superior num dia, inferior no outro. Simples e eficaz.',
      muscles:[['Peito','Costas','Ombros','Bíceps','Tríceps'],['Pernas','Glúteos','Abdômen']], labels:['Superior','Inferior'] },
    { name:'Full Body A / B', icon:'💥', desc:'Dois treinos completos diferentes para evitar repetição.',
      muscles:[['Peito','Costas','Pernas','Abdômen'],['Ombros','Bíceps','Tríceps','Glúteos','Abdômen']], labels:['Full Body A','Full Body B'] },
    { name:'Empurrar / Puxar', icon:'🔁', desc:'Empurrar (peito+ombros+tríceps) e puxar (costas+bíceps+pernas).',
      muscles:[['Peito','Ombros','Tríceps'],['Costas','Bíceps','Pernas','Glúteos']], labels:['Push','Pull'] }
  ],
  3: [
    { name:'Push / Pull / Legs', icon:'🔁', desc:'O split mais popular e equilibrado para 3 dias. Todos os músculos com boa recuperação.',
      muscles:[['Peito','Ombros','Tríceps'],['Costas','Bíceps'],['Pernas','Glúteos','Abdômen']], labels:['Push','Pull','Legs'] },
    { name:'Full Body x3', icon:'💥', desc:'Treino completo em cada sessão — máxima frequência por músculo.',
      muscles:[['Peito','Costas','Pernas','Abdômen'],['Ombros','Bíceps','Tríceps','Glúteos'],['Peito','Costas','Pernas','Abdômen']], labels:['Full Body A','Full Body B','Full Body A'] },
    { name:'Peito+Costas / Pernas / Ombros+Braços', icon:'💪', desc:'Agrupa músculos complementares para sessões equilibradas.',
      muscles:[['Peito','Costas'],['Pernas','Glúteos','Abdômen'],['Ombros','Bíceps','Tríceps']], labels:['Peito & Costas','Pernas','Ombros & Braços'] }
  ],
  4: [
    { name:'Upper / Lower x2', icon:'↕️', desc:'Cada grupo muscular trabalhado 2x por semana — ótimo para força e massa.',
      muscles:[['Peito','Costas','Ombros','Bíceps','Tríceps'],['Pernas','Glúteos','Abdômen'],['Peito','Costas','Ombros','Bíceps','Tríceps'],['Pernas','Glúteos','Abdômen']], labels:['Superior A','Inferior A','Superior B','Inferior B'] },
    { name:'Antagonistas ABCD', icon:'⚡', desc:'Músculos opostos no mesmo dia — permite boa recuperação entre séries.',
      muscles:[['Peito','Tríceps'],['Costas','Bíceps'],['Pernas','Glúteos'],['Ombros','Abdômen']], labels:['Peito & Tríceps','Costas & Bíceps','Pernas','Ombros & Core'] },
    { name:'PPL + Full Body', icon:'🔁', desc:'Push/Pull/Legs mais um dia full body de reforço.',
      muscles:[['Peito','Ombros','Tríceps'],['Costas','Bíceps'],['Pernas','Glúteos','Abdômen'],['Peito','Costas','Pernas','Abdômen']], labels:['Push','Pull','Legs','Full Body'] }
  ],
  5: [
    { name:'Bro Split', icon:'💪', desc:'Um grupo muscular por dia — volume máximo e foco total por sessão.',
      muscles:[['Peito'],['Costas'],['Pernas','Glúteos'],['Ombros'],['Bíceps','Tríceps','Abdômen']], labels:['Peito','Costas','Pernas','Ombros','Braços & Core'] },
    { name:'PPL + Upper / Lower', icon:'🔁', desc:'Push/Pull/Legs e depois um ciclo Upper/Lower para maior frequência.',
      muscles:[['Peito','Ombros','Tríceps'],['Costas','Bíceps'],['Pernas','Glúteos','Abdômen'],['Peito','Costas','Ombros','Bíceps','Tríceps'],['Pernas','Glúteos','Abdômen']], labels:['Push','Pull','Legs','Superior','Inferior'] },
    { name:'Upper / Lower x2 + Full Body', icon:'↕️', desc:'4 dias upper/lower mais um dia de treino completo de reforço.',
      muscles:[['Peito','Costas','Ombros','Bíceps','Tríceps'],['Pernas','Glúteos','Abdômen'],['Peito','Costas','Ombros','Bíceps','Tríceps'],['Pernas','Glúteos','Abdômen'],['Peito','Costas','Pernas','Abdômen']], labels:['Superior A','Inferior A','Superior B','Inferior B','Full Body'] }
  ],
  6: [
    { name:'PPL x2', icon:'🔁', desc:'Push/Pull/Legs duas vezes por semana — alta frequência e volume por músculo.',
      muscles:[['Peito','Ombros','Tríceps'],['Costas','Bíceps'],['Pernas','Glúteos','Abdômen'],['Peito','Ombros','Tríceps'],['Costas','Bíceps'],['Pernas','Glúteos','Abdômen']], labels:['Push','Pull','Legs','Push','Pull','Legs'] },
    { name:'Arnold Split', icon:'🏆', desc:'O treino de Arnold. Peito+Costas / Ombros+Braços / Pernas — 2x por semana.',
      muscles:[['Peito','Costas'],['Ombros','Bíceps','Tríceps'],['Pernas','Glúteos','Abdômen'],['Peito','Costas'],['Ombros','Bíceps','Tríceps'],['Pernas','Glúteos','Abdômen']], labels:['Peito & Costas','Ombros & Braços','Pernas','Peito & Costas','Ombros & Braços','Pernas'] },
    { name:'Upper / Lower x3', icon:'↕️', desc:'Superior e inferior alternados todos os dias — frequência muito alta.',
      muscles:[['Peito','Costas','Ombros','Bíceps','Tríceps'],['Pernas','Glúteos','Abdômen'],['Peito','Costas','Ombros','Bíceps','Tríceps'],['Pernas','Glúteos','Abdômen'],['Peito','Costas','Ombros','Bíceps','Tríceps'],['Pernas','Glúteos','Abdômen']], labels:['Superior','Inferior','Superior','Inferior','Superior','Inferior'] }
  ],
  7: [
    { name:'Arnold Split + Descanso', icon:'🏆', desc:'Arnold Split 6 dias com 1 dia de descanso ativo.',
      muscles:[['Peito','Costas'],['Ombros','Bíceps','Tríceps'],['Pernas','Glúteos','Abdômen'],['Peito','Costas'],['Ombros','Bíceps','Tríceps'],['Pernas','Glúteos','Abdômen'],[]], labels:['Peito & Costas','Ombros & Braços','Pernas','Peito & Costas','Ombros & Braços','Pernas','Descanso'] },
    { name:'PPL x2 + Descanso', icon:'🔁', desc:'PPL duas vezes mais um dia de recuperação.',
      muscles:[['Peito','Ombros','Tríceps'],['Costas','Bíceps'],['Pernas','Glúteos','Abdômen'],['Peito','Ombros','Tríceps'],['Costas','Bíceps'],['Pernas','Glúteos','Abdômen'],[]], labels:['Push','Pull','Legs','Push','Pull','Legs','Descanso'] }
  ]
};

const SPLIT_OPTIONS_HOME = {
  1: [
    { name:'Full Body Casa', icon:'🏠', desc:'Um treino completo de peso corporal que trabalha o corpo todo.',
      muscles:[['Peito','Costas','Pernas','Glúteos','Abdômen']], labels:['Full Body'] }
  ],
  2: [
    { name:'Superior / Inferior', icon:'🏠', desc:'Superior (flexões, dips, pike push-up) e inferior (agachamentos, afundos, glúteos).',
      muscles:[['Peito','Costas','Ombros','Tríceps'],['Pernas','Glúteos','Abdômen']], labels:['Superior','Inferior'] },
    { name:'Full Body A / B', icon:'🏠', desc:'Dois treinos completos de peso corporal com exercícios diferentes.',
      muscles:[['Peito','Pernas','Abdômen'],['Costas','Glúteos','Ombros','Abdômen']], labels:['Full Body A','Full Body B'] }
  ],
  3: [
    { name:'Full Body x3', icon:'🏠', desc:'Treino completo em cada sessão — alta frequência muscular com peso corporal.',
      muscles:[['Peito','Costas','Pernas','Abdômen'],['Glúteos','Pernas','Ombros','Abdômen'],['Peito','Costas','Pernas','Abdômen']], labels:['Full Body A','Full Body B','Full Body A'] },
    { name:'Push / Pull / Legs', icon:'🏠', desc:'Flexões e dips / Superman e dominadas / Agachamentos e glúteos.',
      muscles:[['Peito','Ombros','Tríceps'],['Costas','Bíceps'],['Pernas','Glúteos','Abdômen']], labels:['Push','Pull','Legs'] },
    { name:'Superior / Core / Inferior', icon:'🏠', desc:'Um dia dedicado ao core entre os treinos de superior e inferior.',
      muscles:[['Peito','Costas','Ombros'],['Abdômen','Costas'],['Pernas','Glúteos']], labels:['Superior','Core','Inferior'] }
  ],
  4: [
    { name:'Superior / Inferior x2', icon:'🏠', desc:'Cada grupo trabalhado 2x por semana — ótimo para progressão sem pesos.',
      muscles:[['Peito','Costas','Ombros','Tríceps'],['Pernas','Glúteos','Abdômen'],['Peito','Costas','Ombros','Tríceps'],['Pernas','Glúteos','Abdômen']], labels:['Superior A','Inferior A','Superior B','Inferior B'] },
    { name:'Full Body / Core / Full Body / Cardio', icon:'🏠', desc:'Varia entre força, core e cardio com peso corporal.',
      muscles:[['Peito','Costas','Pernas','Glúteos'],['Abdômen','Costas'],['Peito','Costas','Pernas','Glúteos'],['Pernas','Abdômen']], labels:['Full Body A','Core','Full Body B','HIIT'] },
    { name:'Push / Pull / Legs / Core', icon:'🏠', desc:'PPL clássico mais um dia dedicado ao core e estabilidade.',
      muscles:[['Peito','Ombros','Tríceps'],['Costas','Bíceps'],['Pernas','Glúteos'],['Abdômen','Costas']], labels:['Push','Pull','Legs','Core'] }
  ],
  5: [
    { name:'Full Body x5', icon:'🏠', desc:'Treino diário com peso corporal — alta frequência e progressão rápida.',
      muscles:[['Peito','Costas','Pernas','Abdômen'],['Glúteos','Pernas','Ombros'],['Peito','Costas','Abdômen'],['Pernas','Glúteos','Ombros'],['Peito','Costas','Pernas','Abdômen']], labels:['Full Body A','Full Body B','Full Body C','Full Body D','Full Body E'] },
    { name:'Superior / Inferior / Core / Push / Pull', icon:'🏠', desc:'Cinco sessões variadas para cobrir todos os músculos.',
      muscles:[['Peito','Costas','Ombros'],['Pernas','Glúteos'],['Abdômen','Costas'],['Peito','Ombros','Tríceps'],['Costas','Bíceps']], labels:['Superior','Inferior','Core','Push','Pull'] }
  ],
  6: [
    { name:'PPL x2 Casa', icon:'🏠', desc:'Push/Pull/Legs com peso corporal duas vezes por semana.',
      muscles:[['Peito','Ombros','Tríceps'],['Costas','Bíceps'],['Pernas','Glúteos','Abdômen'],['Peito','Ombros','Tríceps'],['Costas','Bíceps'],['Pernas','Glúteos','Abdômen']], labels:['Push','Pull','Legs','Push','Pull','Legs'] },
    { name:'Superior / Inferior x3', icon:'🏠', desc:'Alternância diária superior/inferior — máxima frequência muscular.',
      muscles:[['Peito','Costas','Ombros','Tríceps'],['Pernas','Glúteos','Abdômen'],['Peito','Costas','Ombros','Tríceps'],['Pernas','Glúteos','Abdômen'],['Peito','Costas','Ombros','Tríceps'],['Pernas','Glúteos','Abdômen']], labels:['Superior','Inferior','Superior','Inferior','Superior','Inferior'] }
  ],
  7: [
    { name:'PPL x2 + Descanso', icon:'🏠', desc:'PPL bodyweight duas vezes com um dia de descanso ativo.',
      muscles:[['Peito','Ombros','Tríceps'],['Costas','Bíceps'],['Pernas','Glúteos','Abdômen'],['Peito','Ombros','Tríceps'],['Costas','Bíceps'],['Pernas','Glúteos','Abdômen'],[]], labels:['Push','Pull','Legs','Push','Pull','Legs','Descanso'] },
    { name:'Full Body Diário', icon:'🏠', desc:'Treino de peso corporal todos os dias — para quem quer máximo volume.',
      muscles:[['Peito','Costas','Pernas'],['Glúteos','Ombros','Abdômen'],['Peito','Costas','Pernas'],['Glúteos','Ombros','Abdômen'],['Peito','Costas','Pernas'],['Glúteos','Ombros','Abdômen'],[]], labels:['Full Body A','Full Body B','Full Body A','Full Body B','Full Body A','Full Body B','Descanso'] }
  ]
};

let scheduleDays = [];
let selectedSplitIdx = 0;
let scheduleMode = 'gym'; // 'gym' | 'home'

function setScheduleMode(mode) {
  scheduleMode = mode;
  selectedSplitIdx = 0;
  const gymBtn  = document.getElementById('sched-btn-gym');
  const homeBtn = document.getElementById('sched-btn-home');
  if (gymBtn) {
    gymBtn.style.borderColor  = mode === 'gym'  ? 'var(--orange)' : 'var(--border)';
    gymBtn.style.background   = mode === 'gym'  ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.04)';
    gymBtn.style.color        = mode === 'gym'  ? 'var(--orange)' : 'var(--muted)';
  }
  if (homeBtn) {
    homeBtn.style.borderColor = mode === 'home' ? 'var(--orange)' : 'var(--border)';
    homeBtn.style.background  = mode === 'home' ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.04)';
    homeBtn.style.color       = mode === 'home' ? 'var(--orange)' : 'var(--muted)';
  }
}

function openScheduleDays() {
  scheduleDays = [];
  selectedSplitIdx = 0;
  scheduleMode = 'gym';
  document.getElementById('schedule-step-1').style.display = 'block';
  document.getElementById('schedule-step-2').style.display = 'none';
  openModal('modal-schedule-days');
  setScheduleMode('gym');
  renderScheduleDayChips();
}

function renderScheduleDayChips() {
  const el = document.getElementById('schedule-day-chips');
  el.innerHTML = DAYS.map((d, i) => {
    const sel = scheduleDays.includes(i);
    return `<div onclick="toggleScheduleDay(${i})"
      style="padding:10px 18px;border-radius:20px;cursor:pointer;font-size:0.9rem;font-weight:700;
             border:1px solid ${sel ? 'var(--orange)' : 'var(--border)'};
             background:${sel ? 'rgba(255,107,53,0.18)' : 'rgba(255,255,255,0.04)'};
             color:${sel ? 'var(--orange)' : 'var(--muted)'};">
      ${_dayShort(i)}
    </div>`;
  }).join('');
  const btn = document.getElementById('btn-see-suggestions');
  if (btn) btn.disabled = scheduleDays.length === 0;
}

function toggleScheduleDay(i) {
  const idx = scheduleDays.indexOf(i);
  if (idx >= 0) scheduleDays.splice(idx, 1);
  else scheduleDays.push(i);
  scheduleDays.sort((a, b) => a - b);
  renderScheduleDayChips();
}

function showScheduleSuggestions() {
  if (!scheduleDays.length) return;
  selectedSplitIdx = 0;
  document.getElementById('schedule-step-1').style.display = 'none';
  document.getElementById('schedule-step-2').style.display = 'block';
  renderScheduleSuggestion();
}

function selectSplit(idx) {
  selectedSplitIdx = idx;
  renderScheduleSuggestion();
}

function renderScheduleSuggestion() {
  const n = scheduleDays.length;
  const pool = scheduleMode === 'home' ? SPLIT_OPTIONS_HOME : SPLIT_OPTIONS;
  const options = pool[Math.min(n, 7)] || pool[1];
  const split = options[selectedSplitIdx] || options[0];

  // Option cards
  const _dkMap = scheduleMode === 'home' ? _SPLIT_DESCS_HOME : _SPLIT_DESCS_GYM;
  const _nkMap = scheduleMode === 'home' ? _SPLIT_NAMES_HOME : _SPLIT_NAMES_GYM;
  const optionCards = options.map((opt, i) => {
    const active = i === selectedSplitIdx;
    const optName = t(_nkMap[opt.name]) || opt.name;
    const optDesc = t(_dkMap[opt.name]) || opt.desc;
    return `<div onclick="selectSplit(${i})"
      style="padding:10px 14px;border-radius:10px;cursor:pointer;margin-bottom:6px;
             border:1px solid ${active ? 'var(--orange)' : 'var(--border)'};
             background:${active ? 'rgba(255,107,53,0.12)' : 'rgba(255,255,255,0.03)'};">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:1rem;">${opt.icon}</span>
        <div>
          <div style="font-size:0.85rem;font-weight:800;color:${active ? 'var(--orange)' : 'var(--text)'};">${optName}</div>
          <div style="font-size:0.7rem;color:var(--muted);margin-top:1px;">${optDesc}</div>
        </div>
        ${active ? '<span style="margin-left:auto;color:var(--orange);font-size:1rem;">✔</span>' : ''}
      </div>
    </div>`;
  }).join('');

  // Day breakdown for selected split
  const rows = scheduleDays.map((dayIdx, pos) => {
    const muscles = split.muscles[pos] || [];
    const label = split.labels[pos] || '';
    const muscleStr = muscles.length ? muscles.map(tMuscle).join(' · ') : t('plan_rest_option');
    return `<div style="display:flex;align-items:flex-start;gap:12px;padding:9px 12px;border-radius:8px;background:rgba(255,255,255,0.03);margin-bottom:5px;">
      <div style="min-width:36px;font-size:0.78rem;font-weight:800;color:var(--orange);">${_dayShort(dayIdx)}</div>
      <div>
        <div style="font-size:0.78rem;font-weight:700;color:var(--text);">${tSplitLabel(label)}</div>
        <div style="font-size:0.7rem;color:var(--muted);margin-top:1px;">${muscleStr}</div>
      </div>
    </div>`;
  }).join('');

  document.getElementById('schedule-suggestion').innerHTML = `
    <div style="margin-bottom:14px;">${optionCards}</div>
    <div style="font-size:0.68rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;">${t('plan_distribution')}</div>
    ${rows}`;
}

function backToScheduleStep1() {
  document.getElementById('schedule-step-1').style.display = 'block';
  document.getElementById('schedule-step-2').style.display = 'none';
}

function applyScheduleSuggestion() {
  const profile = getProfile();
  if (!profile || !scheduleDays.length) return;
  const n = scheduleDays.length;
  const pool = scheduleMode === 'home' ? SPLIT_OPTIONS_HOME : SPLIT_OPTIONS;
  const options = pool[Math.min(n, 7)] || pool[1];
  const split = options[selectedSplitIdx] || options[0];

  for (let i = 0; i < 7; i++) profile.weeklyPlan[i] = [];
  scheduleDays.forEach((dayIdx, pos) => {
    profile.weeklyPlan[dayIdx] = [...(split.muscles[pos] || [])];
  });

  saveProfile(profile);
  closeModal('modal-schedule-days');
  renderPlanner();
  showToast(`"${split.name}" ${t('link_created')} 💪`);
}

function renderPlanner() {
  const profile = getProfile();
  if (!profile) return;
  const now = new Date();
  const today = now.getDay();

  const grid = document.getElementById('planner-week-grid');
  grid.innerHTML = DAYS.map((d, i) => {
    const muscles = profile.weeklyPlan[i] || [];
    const isToday = i === today;
    return `<div class="day-cell ${isToday ? 'today' : ''} ${muscles.length ? 'has-workout' : ''}" onclick="renderPlannerDetail(${i})">
      <div class="day-name">${_dayShort(i)}</div>
      <div class="day-num" style="color:${isToday ? 'var(--orange)' : ''}">${i+1}</div>
      <div class="day-dot ${muscles.length ? 'has' : ''}"></div>
    </div>`;
  }).join('');

  // Detail for today
  renderPlannerDetail(today);
}

// Returns the WORKOUT_TEMPLATE that best matches the given muscle list (gender-aware)
function matchTemplateToMuscles(muscles) {
  if (!muscles || !muscles.length) return null;
  const muscleSet = new Set(muscles);
  const profile = getProfile();
  const userGender = profile ? profile.gender : null;
  let best = null, bestScore = -1;
  for (const t of WORKOUT_TEMPLATES) {
    const overlap = t.muscles.filter(m => muscleSet.has(m)).length;
    let score = overlap / Math.max(t.muscles.length, muscles.length);
    // Slight boost for gender-matched templates to break ties
    if (userGender && (t.gender === userGender || t.gender === 'all')) score += 0.01;
    if (score > bestScore) { bestScore = score; best = t; }
  }
  return bestScore > 0 ? best : null;
}

function renderPlannerDetail(day) {
  const profile = getProfile();
  const muscles = profile.weeklyPlan[day] || [];
  const detail = document.getElementById('planner-day-detail');
  const isToday = day === new Date().getDay();

  if (!muscles.length) {
    detail.innerHTML = `
      <div class="card" style="text-align:center; padding:24px 16px;">
        <div style="font-size:2rem; margin-bottom:8px;">🛌</div>
        <div style="font-weight:700; margin-bottom:4px;">${_dayFull(day)}</div>
        <div style="color:var(--muted); font-size:0.85rem;">${t('plan_rest_day_msg')}</div>
        <button onclick="openDayModal(${day})" class="btn btn-secondary btn-sm" style="margin-top:14px;">${t('plan_edit_day')}</button>
      </div>`;
    return;
  }

  const tpl = matchTemplateToMuscles(muscles);

  // Injury-aware: get exercises to avoid
  const hp = getHealthProfile();
  const activeInjuries = HEALTH_INJURIES.filter(i => hp.injuries.includes(i.id));
  const avoidSet = new Set(activeInjuries.flatMap(i => i.avoid));

  const muscleChips = muscles.map(m => `<span class="muscle-chip selected" style="font-size:0.78rem;">${tMuscle(m)}</span>`).join('');

  const savedPlan = (profile.weeklyWorkoutPlan && profile.weeklyWorkoutPlan[day]) || null;

  let suggestionHTML = '';
  if (savedPlan && savedPlan.length) {
    // Plano editado pelo utilizador para este dia
    const exRows = savedPlan.map(ex => {
      const isRisky = avoidSet.has(ex.name);
      return `<div style="display:flex; align-items:center; justify-content:space-between; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
        <div>
          <span style="font-size:0.82rem; font-weight:600; color:${isRisky ? '#ff4757' : 'var(--text)'};">${ex.name}</span>
          ${isRisky ? `<span style="font-size:0.65rem; color:#ff4757; background:rgba(255,71,87,.12); border:1px solid rgba(255,71,87,.3); border-radius:20px; padding:1px 6px; margin-left:5px;">${t('plan_injury_badge')}</span>` : ''}
        </div>
        <span style="font-size:0.72rem; color:var(--muted);">${ex.sets.length} ${t('sets_label')} · ${ex.sets[0].reps} ${t('workout_reps')}</span>
      </div>`;
    }).join('');
    suggestionHTML = `
      <div style="background:rgba(255,107,53,.06); border:1.5px solid rgba(255,107,53,.25); border-radius:var(--radius-sm); padding:14px; margin-top:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <div style="font-size:0.72rem; color:var(--orange); font-weight:800; text-transform:uppercase; letter-spacing:.6px;">${t('plan_suggested_workout')}</div>
          <span style="font-size:0.72rem; color:var(--muted);">${savedPlan.length} ${t('exercises_label')}</span>
        </div>
        <div style="max-height:220px; overflow-y:auto; margin-bottom:12px;">${exRows}</div>
        <div style="display:flex; gap:8px;">
          <button onclick="startPlannedWorkout(${day})"
            style="flex:1; background:var(--orange); color:#fff; border:none; border-radius:var(--radius-sm); padding:10px; font-size:0.85rem; font-weight:700; cursor:pointer;">
            ${t('plan_start_workout')}
          </button>
          <button onclick="openDayModal(${day})"
            style="flex:1; background:rgba(255,255,255,0.06); color:var(--text); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px; font-size:0.85rem; font-weight:600; cursor:pointer;">
            ${t('plan_customize')}
          </button>
        </div>
      </div>`;
  } else if (tpl) {
    const exRows = tpl.exercises.map(ex => {
      const isRisky = avoidSet.has(ex.name);
      return `<div style="display:flex; align-items:center; justify-content:space-between; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
        <div>
          <span style="font-size:0.82rem; font-weight:600; color:${isRisky ? '#ff4757' : 'var(--text)'};">${ex.name}</span>
          ${isRisky ? `<span style="font-size:0.65rem; color:#ff4757; background:rgba(255,71,87,.12); border:1px solid rgba(255,71,87,.3); border-radius:20px; padding:1px 6px; margin-left:5px;">${t('plan_injury_badge')}</span>` : ''}
        </div>
        <span style="font-size:0.72rem; color:var(--muted);">${ex.sets.length} ${t('sets_label')} · ${ex.sets[0].reps} ${t('workout_reps')}</span>
      </div>`;
    }).join('');

    const riskyCount = tpl.exercises.filter(e => avoidSet.has(e.name)).length;
    const riskyBanner = riskyCount ? `
      <div style="background:rgba(255,107,53,.08); border:1px solid rgba(255,107,53,.3); border-radius:var(--radius-sm); padding:8px 10px; margin-bottom:10px; font-size:0.75rem; color:var(--orange);">
        ⚠️ ${riskyCount} ${t('plan_risky_n')}
      </div>` : '';

    suggestionHTML = `
      <div style="background:rgba(255,107,53,.06); border:1.5px solid rgba(255,107,53,.25); border-radius:var(--radius-sm); padding:14px; margin-top:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <div style="font-size:0.72rem; color:var(--orange); font-weight:800; text-transform:uppercase; letter-spacing:.6px;">${t('plan_suggestion')}</div>
          <span style="font-size:0.72rem; color:var(--muted);">${tpl.exercises.length} ${t('exercises_label')}</span>
        </div>
        <div style="font-size:1rem; font-weight:700; margin-bottom:10px;">${tpl.label}</div>
        ${riskyBanner}
        <div style="max-height:220px; overflow-y:auto; margin-bottom:12px;">${exRows}</div>
        <div style="display:flex; gap:8px;">
          <button onclick="startPlannerWorkout('${tpl.id}')"
            style="flex:1; background:var(--orange); color:#fff; border:none; border-radius:var(--radius-sm); padding:10px; font-size:0.85rem; font-weight:700; cursor:pointer;">
            ${t('plan_start_workout')}
          </button>
          <button onclick="customisePlannerDay(${day})"
            style="flex:1; background:rgba(255,255,255,0.06); color:var(--text); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px; font-size:0.85rem; font-weight:600; cursor:pointer;">
            ${t('plan_customize')}
          </button>
        </div>
      </div>`;
  } else {
    suggestionHTML = `
      <div style="background:rgba(255,255,255,0.03); border:1px dashed var(--border); border-radius:var(--radius-sm); padding:14px; margin-top:12px; text-align:center;">
        <div style="color:var(--muted); font-size:0.82rem; margin-bottom:10px;">${t('plan_no_template')}</div>
        <button onclick="customisePlannerDay(${day})"
          style="background:var(--orange); color:#fff; border:none; border-radius:var(--radius-sm); padding:10px 20px; font-size:0.85rem; font-weight:700; cursor:pointer;">
          ${t('plan_build_workout')}
        </button>
      </div>`;
  }

  const tomorrow = (day + 1) % 7;
  const tomorrowMuscles = profile.weeklyPlan[tomorrow] || [];
  const tomorrowBtnHtml = isToday ? `
    <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
      <div>
        <div style="font-size:0.68rem;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.05em;">${t('dash_tomorrow_title')} · ${_dayFull(tomorrow)}</div>
        <div style="font-size:0.78rem;margin-top:2px;">${tomorrowMuscles.length ? tomorrowMuscles.map(m => tMuscle(m)).join(', ') : t('plan_rest_day_msg')}</div>
      </div>
      <button onclick="openDayModal(${tomorrow})"
        style="background:rgba(255,107,53,0.1);border:1px solid rgba(255,107,53,0.3);color:var(--orange);
               border-radius:8px;padding:6px 12px;font-size:0.75rem;font-weight:700;cursor:pointer;white-space:nowrap;">
        ✏️ ${t('plan_edit_btn')}
      </button>
    </div>` : '';

  detail.innerHTML = `
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
        <div>
          <div style="font-weight:700; margin-bottom:6px;">${_dayFull(day)}${isToday ? ` <span style="font-size:0.7rem; background:var(--orange); color:#fff; border-radius:20px; padding:2px 8px; vertical-align:middle; margin-left:4px;">${t('plan_today_badge')}</span>` : ''}</div>
          <div class="chip-row">${muscleChips}</div>
        </div>
        <button onclick="openDayModal(${day})" style="background:none; border:none; color:var(--muted); cursor:pointer; font-size:1rem; padding:4px;" title="${t('btn_edit')}">✏️</button>
      </div>
      ${suggestionHTML}
      ${tomorrowBtnHtml}
    </div>`;
}

function startPlannerWorkout(templateId) {
  const tpl = WORKOUT_TEMPLATES.find(t => t.id === templateId);
  if (!tpl) return;
  const profile = getProfile();
  activeTemplateId = tpl.id;
  const base = tpl.exercises.map(e => ({ name: e.name, muscle: e.muscle, sets: e.sets.map(s => ({...s})) }));
  workoutExercises = profile && profile.goal ? adaptExercisesToGoal(base, profile.goal) : base;
  workoutSelectedMuscles = [...tpl.muscles];
  goToWorkout();
  showToast(`"${tpl.label}" ${t('link_created')} 💪`);
}

function customisePlannerDay(day) {
  const profile = getProfile();
  const muscles = profile.weeklyPlan[day] || [];
  workoutSelectedMuscles = muscles.length ? [...muscles] : [];
  workoutExercises = [];
  activeTemplateId = null;
  goToWorkout();
}

// Carrega uma lista de exercícios planeados para a sessão de treino ativa
function loadPlannedWorkout(list) {
  const profile = getProfile();
  workoutExercises = list.map(e => ({ name: e.name, muscle: e.muscle, sets: e.sets.map(s => ({ ...s })) }));
  workoutSelectedMuscles = [...new Set(list.map(e => e.muscle))];
  activeTemplateId = null;
  _browserVisible = false;
  renderWorkoutTemplatePills();
  renderWorkoutMuscleChips(profile);
  renderExerciseBrowser(profile);
  renderWorkoutList();
  updateWorkoutSummary();
}

// Inicia o treino planeado para um dia específico (a partir do planeador)
function startPlannedWorkout(day) {
  const profile = getProfile();
  const list = profile.weeklyWorkoutPlan && profile.weeklyWorkoutPlan[day];
  if (!list || !list.length) { customisePlannerDay(day); return; }
  goToWorkout();               // navega para o ecrã de treino
  loadPlannedWorkout(list);    // e carrega os exercícios planeados
  setTimeout(() => { const el = document.getElementById('workout-session'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
}

function openDayModal(day) {
  plannerSelectedDay = day;
  const profile = getProfile();
  plannerSelectedMuscles = [...(profile.weeklyPlan[day] || [])];
  _plannerSelectedTemplate = null;

  // Carrega exercícios já planeados para o dia; se não houver mas há
  // músculos, gera uma sugestão inicial automaticamente.
  const saved = (profile.weeklyWorkoutPlan && profile.weeklyWorkoutPlan[day]) || null;
  if (saved && saved.length) {
    plannerExercises = saved.map(e => ({ name: e.name, muscle: e.muscle, sets: e.sets.map(s => ({ ...s })) }));
  } else {
    plannerExercises = [];
    if (plannerSelectedMuscles.length) generatePlannerSuggestion();
  }

  document.getElementById('modal-day-title').textContent = _dayFull(day);
  const chips = document.getElementById('modal-muscle-chips');
  chips.innerHTML = MUSCLES.map(m => `
    <div class="muscle-chip ${plannerSelectedMuscles.includes(m) ? 'selected' : ''}" onclick="togglePlannerMuscle(this, '${m}')">${tMuscle(m)}</div>
  `).join('');

  renderPlannerExercises();
  openModal('modal-day-muscles');
}

// Pool de exercícios disponíveis para um músculo (sem os que a lesão manda evitar)
function _plannerPool(muscle, avoidSet, profile) {
  const custom = (profile.customExercises || {})[muscle] || [];
  return [...(EXERCISE_LIBRARY[muscle] || []), ...custom].filter(n => !avoidSet.has(n));
}

function _plannerAvoidSet() {
  const hp = getHealthProfile();
  return new Set(HEALTH_INJURIES.filter(i => hp.injuries.includes(i.id)).flatMap(i => i.avoid));
}

// (Re)gera a sugestão completa a partir dos músculos selecionados
function generatePlannerSuggestion() {
  const profile = getProfile();
  if (!profile) { plannerExercises = []; return; }
  const avoidSet = _plannerAvoidSet();
  const perMuscle = plannerSelectedMuscles.length <= 2 ? 3 : 2;
  const picked = [];
  const used = new Set();
  plannerSelectedMuscles.forEach(muscle => {
    const pool = _plannerPool(muscle, avoidSet, profile);
    let added = 0;
    for (const name of pool) {
      if (added >= perMuscle) break;
      if (used.has(name)) continue;
      used.add(name);
      picked.push({ name, muscle, sets: [{ reps: 12, weight: 0 }] });
      added++;
    }
  });
  plannerExercises = profile.goal ? adaptExercisesToGoal(picked, profile.goal) : picked;
}

function regeneratePlannerSuggestion() {
  if (!plannerSelectedMuscles.length) { showToast(t('plan_pick_muscles_first')); return; }
  generatePlannerSuggestion();
  renderPlannerExercises();
}

function swapPlannerExercise(i) {
  const profile = getProfile();
  const ex = plannerExercises[i];
  if (!ex) return;
  const avoidSet = _plannerAvoidSet();
  const pool = _plannerPool(ex.muscle, avoidSet, profile);
  const used = new Set(plannerExercises.map(e => e.name));
  const alt = pool.find(n => !used.has(n));
  if (!alt) { showToast(t('plan_no_more_alts')); return; }
  plannerExercises[i] = { name: alt, muscle: ex.muscle, sets: ex.sets.map(s => ({ ...s })) };
  renderPlannerExercises();
}

function removePlannerExercise(i) {
  plannerExercises.splice(i, 1);
  renderPlannerExercises();
}

// Adiciona mais um exercício para o músculo com menos exercícios na lista
function addPlannerExercise() {
  const profile = getProfile();
  if (!plannerSelectedMuscles.length) { showToast(t('plan_pick_muscles_first')); return; }
  const avoidSet = _plannerAvoidSet();
  const used = new Set(plannerExercises.map(e => e.name));
  // Ordena músculos pelo nº de exercícios já escolhidos (menos primeiro)
  const counts = {};
  plannerSelectedMuscles.forEach(m => counts[m] = 0);
  plannerExercises.forEach(e => { if (counts[e.muscle] != null) counts[e.muscle]++; });
  const ordered = [...plannerSelectedMuscles].sort((a, b) => counts[a] - counts[b]);
  for (const muscle of ordered) {
    const pool = _plannerPool(muscle, avoidSet, profile);
    const next = pool.find(n => !used.has(n));
    if (next) {
      const base = { name: next, muscle, sets: [{ reps: 12, weight: 0 }] };
      const adapted = profile.goal ? adaptExercisesToGoal([base], profile.goal)[0] : base;
      plannerExercises.push(adapted);
      renderPlannerExercises();
      return;
    }
  }
  showToast(t('plan_no_more_alts'));
}

function renderPlannerExercises() {
  const el = document.getElementById('modal-day-exercises');
  if (!el) return;

  if (!plannerSelectedMuscles.length) {
    el.innerHTML = `<div style="font-size:0.8rem;color:var(--muted);text-align:center;padding:8px 0;">${t('plan_pick_muscles_hint')}</div>`;
    return;
  }
  if (!plannerExercises.length) {
    el.innerHTML = `
      <div style="text-align:center;padding:10px 0;">
        <button onclick="regeneratePlannerSuggestion()" class="btn btn-secondary btn-sm">✨ ${t('plan_generate')}</button>
      </div>`;
    return;
  }

  const rows = plannerExercises.map((ex, i) => `
    <div style="display:flex;align-items:center;gap:8px;padding:9px 11px;background:var(--card);border:1px solid var(--border);border-radius:10px;margin-bottom:7px;">
      <div style="flex:1;min-width:0;">
        <div style="font-size:0.85rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${ex.name}</div>
        <div style="font-size:0.68rem;color:var(--muted);margin-top:1px;">${tMuscle(ex.muscle)} · ${ex.sets.length}×${ex.sets[0].reps}</div>
      </div>
      <button onclick="swapPlannerExercise(${i})" title="${t('plan_swap')}"
        style="background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-size:0.9rem;padding:5px 9px;">↻</button>
      <button onclick="removePlannerExercise(${i})" title="${t('plan_remove')}"
        style="background:rgba(255,71,87,.1);border:1px solid rgba(255,71,87,.2);border-radius:8px;color:#ff4757;cursor:pointer;font-size:0.85rem;padding:5px 9px;">✕</button>
    </div>`).join('');

  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
      <div style="font-size:0.75rem;color:var(--muted);font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">${t('plan_suggested_workout')} (${plannerExercises.length})</div>
      <button onclick="regeneratePlannerSuggestion()" style="background:none;border:none;color:var(--orange);font-size:0.72rem;font-weight:700;cursor:pointer;padding:0;">🔄 ${t('plan_new_suggestion')}</button>
    </div>
    ${rows}
    <button onclick="addPlannerExercise()" class="btn btn-secondary btn-sm btn-full" style="margin-top:4px;">+ ${t('plan_add_exercise')}</button>`;
}

function renderPlannerTemplatePicker() {
  const container = document.getElementById('modal-template-picker');
  if (!container) return;

  if (!plannerSelectedMuscles.length) {
    container.innerHTML = '';
    return;
  }

  // Find templates with muscle overlap, sort by score desc
  const profile = getProfile();
  const gender = profile.gender || 'm';
  const matches = WORKOUT_TEMPLATES
    .filter(t => !t.stretch && (!t.gender || t.gender === gender))
    .map(t => {
      const overlap = t.muscles.filter(m => plannerSelectedMuscles.includes(m)).length;
      const score = overlap / Math.max(t.muscles.length, plannerSelectedMuscles.length);
      return { t, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (!matches.length) {
    container.innerHTML = '';
    return;
  }

  const modeIcon = t => t.home ? '🏠' : '🏋️';
  const cards = matches.map(({ t: tpl }) => {
    const selected = _plannerSelectedTemplate === tpl.id;
    return `<div onclick="selectPlannerTemplate('${tpl.id}')" style="
      display:flex; align-items:center; gap:10px; padding:10px 12px;
      border-radius:10px; margin-bottom:7px; cursor:pointer; transition:all 0.2s;
      border:1.5px solid ${selected ? 'var(--accent)' : 'var(--border)'};
      background:${selected ? 'rgba(0,212,170,0.12)' : 'var(--card)'};
    ">
      <span style="font-size:1.3rem">${modeIcon(tpl)}</span>
      <div style="flex:1;min-width:0;">
        <div style="font-size:0.82rem;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${tpl.label}</div>
        <div style="font-size:0.7rem;color:var(--muted);margin-top:1px;">${tpl.muscles.map(m => tMuscle(m)).join(' · ')}</div>
      </div>
      ${selected ? '<span style="color:var(--accent);font-size:1.1rem;font-weight:800;">✓</span>' : ''}
    </div>`;
  }).join('');

  container.innerHTML = `
    <div style="font-size:0.75rem;color:var(--muted);font-weight:600;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:8px;">Treino sugerido</div>
    ${cards}
    ${_plannerSelectedTemplate ? `<div onclick="selectPlannerTemplate(null)" style="text-align:center;font-size:0.75rem;color:var(--muted);cursor:pointer;padding:4px;">✕ Sem treino específico</div>` : ''}
  `;
}

function selectPlannerTemplate(id) {
  _plannerSelectedTemplate = id;
  renderPlannerTemplatePicker();
}

function togglePlannerMuscle(el, muscle) {
  const profile = getProfile();
  const idx = plannerSelectedMuscles.indexOf(muscle);
  if (idx >= 0) {
    // Remove o músculo e os exercícios que lhe pertencem (preserva os restantes edits)
    plannerSelectedMuscles.splice(idx, 1);
    el.classList.remove('selected');
    plannerExercises = plannerExercises.filter(e => e.muscle !== muscle);
  } else {
    // Adiciona o músculo e sugere alguns exercícios para ele
    plannerSelectedMuscles.push(muscle);
    el.classList.add('selected');
    const avoidSet = _plannerAvoidSet();
    const used = new Set(plannerExercises.map(e => e.name));
    const pool = _plannerPool(muscle, avoidSet, profile);
    let added = 0;
    for (const name of pool) {
      if (added >= 3) break;
      if (used.has(name)) continue;
      const base = { name, muscle, sets: [{ reps: 12, weight: 0 }] };
      plannerExercises.push(profile.goal ? adaptExercisesToGoal([base], profile.goal)[0] : base);
      added++;
    }
  }
  renderPlannerExercises();
}

function saveDayMuscles() {
  const profile = getProfile();
  profile.weeklyPlan[plannerSelectedDay] = [...plannerSelectedMuscles];
  // Guarda a lista de exercícios editada para o dia
  profile.weeklyWorkoutPlan = profile.weeklyWorkoutPlan || {};
  if (plannerSelectedMuscles.length && plannerExercises.length) {
    profile.weeklyWorkoutPlan[plannerSelectedDay] =
      plannerExercises.map(e => ({ name: e.name, muscle: e.muscle, sets: e.sets.map(s => ({ ...s })) }));
  } else {
    delete profile.weeklyWorkoutPlan[plannerSelectedDay];
  }
  // Já não usamos template fixo por dia — limpa qualquer referência antiga
  if (profile.weeklyTemplatePlan) profile.weeklyTemplatePlan[plannerSelectedDay] = null;
  saveProfile(profile);
  closeModal('modal-day-muscles');
  renderPlanner();
  renderDashboard();
  showToast(t('t_plan_saved'));
}

// ═══════════════════════════════════════════════════════
//  WORKOUT
// ═══════════════════════════════════════════════════════

let workoutExercises = []; // { name, muscle, sets: [{reps, weight}] }
let currentDay = null;
let setsEditingIdx = null;
let tempSets = [];
let workoutMode = 'gym'; // 'gym' | 'home' | 'stretch'
const exSectionVisible = {}; // { [muscle]: number of cards shown }
let _browserVisible = true;  // false = browser colapsado (quando há exercícios activos)
let _eqPickerOpen   = false; // equipment picker collapsed by default

function setWorkoutMode(mode) {
  workoutMode = mode;
  activeTemplateId = null;
  workoutExercises = [];
  workoutSelectedMuscles = [];
  _browserVisible = true;
  Object.keys(exSectionVisible).forEach(k => delete exSectionVisible[k]);
  renderWorkoutTemplatePills();
  renderWorkoutMuscleChips(getProfile());
  renderExerciseBrowser(getProfile());
  renderWorkoutList();
  updateWorkoutSummary();
}

// ─── Equipment definitions ────────────────────────────
const EQUIPMENT_GROUPS = [
  { id: 'weights',  label: 'Pesos Livres' },
  { id: 'access',   label: 'Acessórios' },
  { id: 'cardio',   label: 'Cardio' },
  { id: 'machine',  label: 'Máquinas de Força' },
];

const EQUIPMENT_LIST = [
  // ── Pesos Livres ─────────────────────────────────────
  { id: 'dumbbells',    label: 'Halteres',           group: 'weights', note: 'par de halteres ajustáveis ou fixos' },
  { id: 'barbell',      label: 'Barra + Rack',        group: 'weights', note: 'barra olímpica com suporte/rack' },
  { id: 'kettlebell',   label: 'Kettlebell',          group: 'weights', note: 'uma ou mais kettlebells' },
  { id: 'medicine_ball',label: 'Bola Medicinal',      group: 'weights', note: 'medicine ball / slam ball' },
  { id: 'weight_plates',label: 'Discos de Peso',      group: 'weights', note: 'anilhas soltas para adicionar carga' },
  { id: 'sandbag',      label: 'Saco de Areia',       group: 'weights', note: 'sandbag para treino funcional' },
  // ── Acessórios ───────────────────────────────────────
  { id: 'bench',        label: 'Banco',               group: 'access',  note: 'banco plano ou inclinável' },
  { id: 'pullup_bar',   label: 'Barra Fixa',          group: 'access',  note: 'barra para dominadas / barra de porta' },
  { id: 'bands',        label: 'Elásticos',           group: 'access',  note: 'bandas de resistência leve/média/forte' },
  { id: 'trx',          label: 'TRX / Suspensão',     group: 'access',  note: 'fitas de suspensão TRX ou similar' },
  { id: 'dip_bars',     label: 'Paralelas / Dips',    group: 'access',  note: 'barras paralelas para dips' },
  { id: 'ab_wheel',     label: 'Roda Abdominal',      group: 'access',  note: 'ab wheel / roda de rollout' },
  { id: 'step',         label: 'Step / Degrau',       group: 'access',  note: 'step aeróbico ou banco baixo' },
  { id: 'push_handles', label: 'Handles Push-up',     group: 'access',  note: 'apoios para flexões' },
  { id: 'jump_rope',    label: 'Corda de Saltar',     group: 'access',  note: 'corda de saltar simples ou com rolamentos' },
  { id: 'ankle_weight', label: 'Pesos de Tornozelo',  group: 'access',  note: 'caneleiras com peso' },
  { id: 'weight_vest',  label: 'Colete de Peso',      group: 'access',  note: 'colete lastrado' },
  { id: 'foam_roller',  label: 'Rolo de Espuma',      group: 'access',  note: 'foam roller para recuperação' },
  { id: 'bosu',         label: 'Bosu Ball',           group: 'access',  note: 'meia bola de equilíbrio' },
  { id: 'yoga_mat',     label: 'Tapete',              group: 'access',  note: 'tapete de yoga / exercício' },
  // ── Cardio ───────────────────────────────────────────
  { id: 'bike',         label: 'Bicicleta Estática',  group: 'cardio',  note: 'bicicleta estática ou spinning' },
  { id: 'treadmill',    label: 'Passadeira',          group: 'cardio',  note: 'passadeira / treadmill' },
  { id: 'elliptical',   label: 'Elíptica',            group: 'cardio',  note: 'máquina elíptica' },
  { id: 'rowing_machine',label: 'Remo Ergómetro',     group: 'cardio',  note: 'máquina de remo (Concept2 ou similar)' },
  { id: 'ski_erg',      label: 'SkiErg',              group: 'cardio',  note: 'máquina SkiErg (Concept2)' },
  { id: 'assault_bike', label: 'Assault Bike',        group: 'cardio',  note: 'bicicleta de ar / assault bike' },
  // ── Máquinas de Força ────────────────────────────────
  { id: 'cables',         label: 'Cabo / Polias',       group: 'machine', note: 'máquina de cabos e polias' },
  { id: 'smith_machine',  label: 'Smith Machine',        group: 'machine', note: 'barra guiada / multipower' },
  { id: 'leg_press',      label: 'Leg Press',            group: 'machine', note: 'máquina de leg press inclinado ou horizontal' },
  { id: 'leg_extension',  label: 'Extensão de Pernas',   group: 'machine', note: 'máquina de extensão / leg extension' },
  { id: 'leg_curl',       label: 'Flexão de Pernas',     group: 'machine', note: 'máquina de leg curl deitado ou sentado' },
  { id: 'hack_squat',     label: 'Hack Squat',           group: 'machine', note: 'máquina de hack squat' },
  { id: 'pec_deck',       label: 'Peck Deck',            group: 'machine', note: 'máquina de fly / voador / peck deck' },
  { id: 'calf_machine',   label: 'Panturrilha Máq.',     group: 'machine', note: 'máquina de panturrilha em pé ou sentado' },
  { id: 'seated_row',     label: 'Remada Sentada',       group: 'machine', note: 'máquina de remada sentada / low row' },
  { id: 'lat_pulldown',   label: 'Puxada (Máq.)',        group: 'machine', note: 'máquina de puxada frontal / lat pulldown' },
  { id: 'abduction_machine', label: 'Abdução Máq.',      group: 'machine', note: 'máquina de abdução de quadril' },
  { id: 'adduction_machine', label: 'Adução Máq.',       group: 'machine', note: 'máquina de adução de quadril' },
  { id: 'glute_machine',  label: 'Glúteos Máq.',         group: 'machine', note: 'máquina de extensão de glúteos / donkey kick' },
  { id: 'hyperextension', label: 'Hiperextensão',        group: 'machine', note: 'banco romano / máquina de hiperextensão' },
  { id: 'chest_press_mach',label: 'Chest Press Máq.',    group: 'machine', note: 'máquina de supino / chest press' },
  { id: 'shoulder_press_mach',label: 'Ombros Máq.',      group: 'machine', note: 'máquina de desenvolvimento de ombros' },
  { id: 'assisted_pullup', label: 'Graviton / Assistida',group: 'machine', note: 'máquina de dominadas/dips assistidas' },
];

// Maps exercise name → required equipment IDs ([] = peso corporal, sem equipamento)
const EXERCISE_EQ = {
  // ── Peito ────────────────────────────────────────────
  'Supino Reto':                   ['barbell', 'bench'],
  'Supino Inclinado':              ['barbell', 'bench'],
  'Supino Declinado':              ['barbell', 'bench'],
  'Supino c/ Halteres':            ['dumbbells', 'bench'],
  'Crucifixo':                     ['dumbbells'],
  'Crucifixo Inclinado':           ['dumbbells', 'bench'],
  'Peck Deck':                     ['pec_deck'],
  'Chest Press Máquina':           ['chest_press_mach'],
  'Crossover':                     ['cables'],
  'Flexão de Braço':               [],
  'Flexão Inclinada':              [],
  'Flexão Declinada':              [],
  'Flexão Diamante':               [],
  'Flexão com Apoios':             ['push_handles'],
  // ── Costas ───────────────────────────────────────────
  'Puxada Frente':                 ['cables'],
  'Puxada Aberta':                 ['cables'],
  'Puxada Frente Máq.':            ['lat_pulldown'],
  'Remada Curvada':                ['barbell'],
  'Remada Unilateral':             ['dumbbells'],
  'Remada Sentada':                ['seated_row'],
  'Remada no Cabo':                ['cables'],
  'Serrote':                       ['dumbbells'],
  'Levantamento Terra':            ['barbell'],
  'Levantamento Terra Romeno':     ['barbell'],
  'Dominadas':                     ['pullup_bar'],
  'Dominadas Assistidas':          ['assisted_pullup'],
  'Hiperextensão':                 ['hyperextension'],
  'Superman':                      [],
  'TRX Remada':                    ['trx'],
  // ── Ombros ───────────────────────────────────────────
  'Desenvolvimento c/ Halteres':   ['dumbbells'],
  'Desenvolvimento c/ Barra':      ['barbell'],
  'Desenvolvimento Máquina':       ['shoulder_press_mach'],
  'Arnold Press':                  ['dumbbells'],
  'Elevação Lateral':              ['dumbbells'],
  'Elevação Lateral no Cabo':      ['cables'],
  'Elevação Frontal':              ['dumbbells'],
  'Elevação Frontal no Cabo':      ['cables'],
  'Encolhimento de Ombros':        ['dumbbells'],
  'Encolhimento c/ Barra':         ['barbell'],
  'Face Pull':                     ['cables'],
  'Pike Push-up':                  [],
  // ── Bíceps ───────────────────────────────────────────
  'Rosca Direta':                  ['dumbbells'],
  'Rosca Direta c/ Barra':         ['barbell'],
  'Rosca Alternada':               ['dumbbells'],
  'Rosca Martelo':                 ['dumbbells'],
  'Rosca Concentrada':             ['dumbbells'],
  'Rosca no Cabo':                 ['cables'],
  'Rosca Scott':                   ['barbell'],
  'Rosca com Elástico':            ['bands'],
  // ── Tríceps ──────────────────────────────────────────
  'Tríceps Corda':                 ['cables'],
  'Tríceps Barra':                 ['cables'],
  'Tríceps Francês':               ['dumbbells'],
  'Tríceps Francês c/ Barra':      ['barbell'],
  'Extensão Testa':                ['dumbbells'],
  'Tríceps Mergulho':              [],
  'Dips em Cadeira':               [],
  'Dips nas Paralelas':            ['dip_bars'],
  'Dips Assistidos':               ['assisted_pullup'],
  'Tríceps com Elástico':          ['bands'],
  // ── Pernas ───────────────────────────────────────────
  'Agachamento':                   [],
  'Agachamento c/ Barra':          ['barbell'],
  'Agachamento Smith':             ['smith_machine'],
  'Agachamento c/ Halteres':       ['dumbbells'],
  'Agachamento Goblet':            ['kettlebell'],
  'Leg Press':                     ['leg_press'],
  'Extensão de Pernas':            ['leg_extension'],
  'Flexão de Pernas':              ['leg_curl'],
  'Hack Squat':                    ['hack_squat'],
  'Stiff':                         ['dumbbells'],
  'Stiff c/ Barra':                ['barbell'],
  'Afundo':                        [],
  'Afundo c/ Halteres':            ['dumbbells'],
  'Afundo Reverso':                [],
  'Afundo Búlgaro':                ['dumbbells'],
  'Agachamento Búlgaro':           [],
  'Agachamento Sumô':              [],
  'Agachamento Sumô c/ Halter':    ['dumbbells'],
  'Panturrilha em Pé':             [],
  'Panturrilha em Pé Máq.':        ['calf_machine'],
  'Panturrilha Sentado':           ['calf_machine'],
  'Wall Sit':                      [],
  'Jump Squat':                    [],
  'Kettlebell Swing':              ['kettlebell'],
  'Kettlebell Goblet Squat':       ['kettlebell'],
  // ── Glúteos ──────────────────────────────────────────
  'Hip Thrust':                    [],
  'Hip Thrust c/ Barra':           ['barbell', 'bench'],
  'Elevação de Quadril':           [],
  'Elevação de Quadril c/ Peso':   ['dumbbells'],
  'Abdução de Quadril':            ['bands'],
  'Abdução Máquina':               ['abduction_machine'],
  'Adução Máquina':                ['adduction_machine'],
  'Glúteos Máquina':               ['glute_machine'],
  'Fire Hydrant':                  [],
  'Fire Hydrant c/ Elástico':      ['bands'],
  'Clamshell':                     [],
  'Clamshell c/ Elástico':         ['bands'],
  'Elevação de Perna':             [],
  'Donkey Kick':                   [],
  'Donkey Kick c/ Elástico':       ['bands'],
  'Passada Lateral c/ Elástico':   ['bands'],
  // ── Abdômen ──────────────────────────────────────────
  'Prancha':                       [],
  'Prancha Lateral':               [],
  'Abdominal Crunch':              [],
  'Abdominal Bicicleta':           [],
  'Elevação de Pernas':            [],
  'Oblíquo':                       [],
  'Mountain Climber':              [],
  'Ab Wheel Rollout':              ['ab_wheel'],
  'Dragon Flag':                   [],
  'L-Sit':                         ['dip_bars'],
  'Abdominal em Cabo':             ['cables'],
  // ── TRX ──────────────────────────────────────────────
  'TRX Flexões':                   ['trx'],
  'TRX Agachamento':               ['trx'],
  'TRX Remada':                    ['trx'],
  'TRX Curl':                      ['trx'],
  'TRX Prancha':                   ['trx'],
  'TRX Afundo':                    ['trx'],
  // ── Cardio / HIIT ────────────────────────────────────
  'Burpee':                        [],
  'Burpees':                       [],
  'Jumping Jack':                  [],
  'Corda de Saltar':               ['jump_rope'],
  'Corrida na Passadeira':         ['treadmill'],
  'Bicicleta Estática':            ['bike'],
  'Elíptica':                      ['elliptical'],
  'Remo Ergómetro':                ['rowing_machine'],
  'SkiErg':                        ['ski_erg'],
  'Assault Bike':                  ['assault_bike'],
  // ── Funcionais / Força ───────────────────────────────
  'Slam Ball':                     ['medicine_ball'],
  'Wall Ball':                     ['medicine_ball'],
  'Russian Twist c/ Bola':         ['medicine_ball'],
  'Farmer Walk':                   ['dumbbells'],
  'Farmer Walk c/ Kettlebell':     ['kettlebell'],
  'Turkish Get-Up':                ['kettlebell'],
  'Kettlebell Press':              ['kettlebell'],
  'Kettlebell Snatch':             ['kettlebell'],
};

/** Returns true if the user can do this exercise with their home equipment */
function canDoExercise(exName, homeEquipment) {
  let needed = EXERCISE_EQ[exName];

  if (needed === undefined) {
    // Infer equipment from exercise name (covers library names not explicitly in EXERCISE_EQ)
    const lc = exName.toLowerCase();
    if (lc.includes('puxada') || lc.includes('pulldown') || lc.includes('pull-down') ||
        lc.includes('na polia') || lc.includes('no cabo') || lc.includes('na polia') ||
        lc.includes('remada no cabo') || lc.includes('crossover') ||
        lc.includes('face pull na') || lc.includes('straight-arm')) {
      needed = ['cables'];
    } else if (lc.includes('leg press')) {
      needed = ['leg_press'];
    } else if (lc.includes('extensão de pernas') && lc.includes('máq')) {
      needed = ['leg_extension'];
    } else if (lc.includes('flexão de pernas') && lc.includes('máq')) {
      needed = ['leg_curl'];
    } else if (lc.includes('cadeira adutora') || lc.includes('adução máquina')) {
      needed = ['adduction_machine'];
    } else if (lc.includes('cadeira abdutora') || lc.includes('abdução') && lc.includes('máquina')) {
      needed = ['abduction_machine'];
    } else if (lc.includes('hack squat')) {
      needed = ['hack_squat'];
    } else if (lc.includes('hiperextensão')) {
      needed = ['hyperextension'];
    } else if (lc.includes('peck deck') || lc.includes('fly na máquina') || lc.includes('voador')) {
      needed = ['pec_deck'];
    } else if (lc.includes('barra fixa') || lc.includes('barra supinada') ||
               lc.includes('chin-up') || lc.includes('dominada') ||
               lc.includes('knee raise') || lc.includes('leg raise na barra')) {
      needed = ['pullup_bar'];
    } else if (lc.includes('smith machine') || lc.includes('agachamento smith')) {
      needed = ['smith_machine'];
    } else if (lc.includes('máquina') || lc.includes('máq.') || lc.includes('na máq')) {
      // Generic machine — use a placeholder that won't match home equipment
      needed = ['cables']; // conservative: treat unknown machines as needing cables
    } else if (lc.includes('c/ halteres') || lc.includes('c/ halter') ||
               lc.includes('c/ dumbell') || lc.includes('c/ haltere')) {
      needed = ['dumbbells'];
    } else if (lc.includes('c/ kettlebell') || lc.includes('kettlebell')) {
      needed = ['kettlebell'];
    } else if (lc.includes('c/ barra') || lc.includes('c/ barbell') ||
               lc.includes('remada alta') || lc.includes('good morning') ||
               lc.includes('agachamento frontal') || lc.includes('agachamento búlgaro c/')) {
      needed = ['barbell'];
    } else if (lc.includes('c/ elástico') || lc.includes('com elástico') ||
               lc.includes('abdução com elástico') || lc.includes('elevação pélvica c/')) {
      needed = ['bands'];
    } else if (lc.includes('trx')) {
      needed = ['trx'];
    } else {
      needed = []; // bodyweight — assume always available
    }
  }

  if (!needed.length) return true;
  return needed.every(eq => (homeEquipment || []).includes(eq));
}

// ─── Pre-made workout templates ───────────────────────
// Each exercise: { name, muscle, sets: [{reps, weight}] }
const WORKOUT_TEMPLATES = [
  // ── MASCULINOS ───────────────────────────────────────────────────
  {
    id: 'peito_triceps', gender: 'm',
    label: '💪 Peito & Tríceps',
    muscles: ['Peito','Tríceps'],
    exercises: [
      { name:'Supino Reto',           muscle:'Peito',   sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:8,weight:0},{reps:8,weight:0}] },
      { name:'Supino Inclinado',      muscle:'Peito',   sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Crucifixo',             muscle:'Peito',   sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Peck Deck',             muscle:'Peito',   sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Tríceps Corda',         muscle:'Tríceps', sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Tríceps Francês',       muscle:'Tríceps', sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Extensão Testa',        muscle:'Tríceps', sets:[{reps:12,weight:0},{reps:12,weight:0},{reps:10,weight:0}] },
    ]
  },
  {
    id: 'costas_biceps', gender: 'm',
    label: '🏋️ Costas & Bíceps',
    muscles: ['Costas','Bíceps'],
    exercises: [
      { name:'Puxada Frente',         muscle:'Costas',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0},{reps:8,weight:0}] },
      { name:'Remada Curvada',        muscle:'Costas',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Remada Unilateral',     muscle:'Costas',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Puxada Aberta',         muscle:'Costas',  sets:[{reps:12,weight:0},{reps:12,weight:0},{reps:10,weight:0}] },
      { name:'Rosca Direta',          muscle:'Bíceps',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Rosca Alternada',       muscle:'Bíceps',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Rosca Martelo',         muscle:'Bíceps',  sets:[{reps:12,weight:0},{reps:12,weight:0},{reps:10,weight:0}] },
    ]
  },
  {
    id: 'ppl_push', gender: 'm',
    label: '🔴 PPL Push',
    muscles: ['Peito','Ombros','Tríceps'],
    exercises: [
      { name:'Supino Reto',                 muscle:'Peito',   sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:8,weight:0},{reps:8,weight:0}] },
      { name:'Supino Inclinado',            muscle:'Peito',   sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Crucifixo',                   muscle:'Peito',   sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Desenvolvimento c/ Halteres', muscle:'Ombros',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Elevação Lateral',            muscle:'Ombros',  sets:[{reps:15,weight:0},{reps:15,weight:0},{reps:12,weight:0}] },
      { name:'Tríceps Corda',               muscle:'Tríceps', sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Extensão Testa',              muscle:'Tríceps', sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
    ]
  },
  {
    id: 'ppl_pull', gender: 'm',
    label: '🔵 PPL Pull',
    muscles: ['Costas','Bíceps'],
    exercises: [
      { name:'Levantamento Terra',    muscle:'Costas',  sets:[{reps:8,weight:0},{reps:6,weight:0},{reps:6,weight:0}] },
      { name:'Puxada Frente',         muscle:'Costas',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Remada Curvada',        muscle:'Costas',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Remada Unilateral',     muscle:'Costas',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Serrote',               muscle:'Costas',  sets:[{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Rosca Direta',          muscle:'Bíceps',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Rosca Concentrada',     muscle:'Bíceps',  sets:[{reps:12,weight:0},{reps:12,weight:0},{reps:10,weight:0}] },
      { name:'Rosca Martelo',         muscle:'Bíceps',  sets:[{reps:12,weight:0},{reps:12,weight:0}] },
    ]
  },
  // ── FEMININOS ────────────────────────────────────────────────────
  {
    id: 'gluteos_f', gender: 'f',
    label: '🍑 Glúteos & Coxa',
    muscles: ['Glúteos','Pernas'],
    exercises: [
      { name:'Hip Thrust',            muscle:'Glúteos', sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0},{reps:10,weight:0}] },
      { name:'Agachamento Sumô',      muscle:'Glúteos', sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Abdução de Quadril',    muscle:'Glúteos', sets:[{reps:20,weight:0},{reps:20,weight:0},{reps:15,weight:0}] },
      { name:'Elevação de Quadril',   muscle:'Glúteos', sets:[{reps:15,weight:0},{reps:15,weight:0},{reps:12,weight:0}] },
      { name:'Stiff',                 muscle:'Pernas',  sets:[{reps:12,weight:0},{reps:12,weight:0},{reps:10,weight:0}] },
      { name:'Leg Press',             muscle:'Pernas',  sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Flexão de Pernas',      muscle:'Pernas',  sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
    ]
  },
  {
    id: 'upper_toning_f', gender: 'f',
    label: '💪 Tonificação Superior',
    muscles: ['Ombros','Costas','Bíceps','Tríceps'],
    exercises: [
      { name:'Elevação Lateral',      muscle:'Ombros',  sets:[{reps:15,weight:0},{reps:15,weight:0},{reps:12,weight:0}] },
      { name:'Elevação Frontal',      muscle:'Ombros',  sets:[{reps:12,weight:0},{reps:12,weight:0},{reps:10,weight:0}] },
      { name:'Remada Unilateral',     muscle:'Costas',  sets:[{reps:12,weight:0},{reps:12,weight:0},{reps:10,weight:0}] },
      { name:'Puxada Frente',         muscle:'Costas',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Crucifixo',             muscle:'Peito',   sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Rosca Alternada',       muscle:'Bíceps',  sets:[{reps:12,weight:0},{reps:12,weight:0},{reps:10,weight:0}] },
      { name:'Tríceps Corda',         muscle:'Tríceps', sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
    ]
  },
  {
    id: 'full_body_f', gender: 'f',
    label: '🔥 Full Body Feminino',
    muscles: ['Glúteos','Pernas','Costas','Ombros','Abdômen'],
    exercises: [
      { name:'Hip Thrust',            muscle:'Glúteos', sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Agachamento',           muscle:'Pernas',  sets:[{reps:12,weight:0},{reps:12,weight:0},{reps:10,weight:0}] },
      { name:'Abdução de Quadril',    muscle:'Glúteos', sets:[{reps:20,weight:0},{reps:20,weight:0}] },
      { name:'Remada Unilateral',     muscle:'Costas',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Elevação Lateral',      muscle:'Ombros',  sets:[{reps:15,weight:0},{reps:12,weight:0}] },
      { name:'Prancha',               muscle:'Abdômen', sets:[{reps:45,weight:0},{reps:45,weight:0}] },
      { name:'Abdominal Bicicleta',   muscle:'Abdômen', sets:[{reps:20,weight:0},{reps:20,weight:0}] },
    ]
  },
  {
    id: 'core_f', gender: 'f',
    label: '🧘 Core & Definição',
    muscles: ['Abdômen','Glúteos'],
    exercises: [
      { name:'Prancha',               muscle:'Abdômen', sets:[{reps:45,weight:0},{reps:45,weight:0},{reps:45,weight:0}] },
      { name:'Prancha Lateral',       muscle:'Abdômen', sets:[{reps:30,weight:0},{reps:30,weight:0}] },
      { name:'Abdominal Crunch',      muscle:'Abdômen', sets:[{reps:20,weight:0},{reps:20,weight:0},{reps:15,weight:0}] },
      { name:'Elevação de Pernas',    muscle:'Abdômen', sets:[{reps:15,weight:0},{reps:15,weight:0},{reps:12,weight:0}] },
      { name:'Abdominal Bicicleta',   muscle:'Abdômen', sets:[{reps:20,weight:0},{reps:20,weight:0}] },
      { name:'Oblíquo',               muscle:'Abdômen', sets:[{reps:20,weight:0},{reps:20,weight:0}] },
      { name:'Elevação de Quadril',   muscle:'Glúteos', sets:[{reps:15,weight:0},{reps:15,weight:0},{reps:12,weight:0}] },
    ]
  },
  // ── MISTOS (todos os géneros) ─────────────────────────────────────
  {
    id: 'pernas_gluteos', gender: 'all',
    label: '🦵 Pernas & Glúteos',
    muscles: ['Pernas','Glúteos'],
    exercises: [
      { name:'Agachamento',           muscle:'Pernas',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:8,weight:0},{reps:8,weight:0}] },
      { name:'Leg Press',             muscle:'Pernas',  sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Extensão de Pernas',    muscle:'Pernas',  sets:[{reps:15,weight:0},{reps:15,weight:0},{reps:12,weight:0}] },
      { name:'Flexão de Pernas',      muscle:'Pernas',  sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Stiff',                 muscle:'Pernas',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Hip Thrust',            muscle:'Glúteos', sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Agachamento Sumô',      muscle:'Glúteos', sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Abdução de Quadril',    muscle:'Glúteos', sets:[{reps:20,weight:0},{reps:15,weight:0},{reps:15,weight:0}] },
    ]
  },
  {
    id: 'ombros_abdomen', gender: 'all',
    label: '🔝 Ombros & Abdômen',
    muscles: ['Ombros','Abdômen'],
    exercises: [
      { name:'Desenvolvimento c/ Halteres', muscle:'Ombros',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0},{reps:8,weight:0}] },
      { name:'Elevação Lateral',            muscle:'Ombros',  sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Elevação Frontal',            muscle:'Ombros',  sets:[{reps:12,weight:0},{reps:12,weight:0},{reps:10,weight:0}] },
      { name:'Arnold Press',                muscle:'Ombros',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Encolhimento de Ombros',      muscle:'Ombros',  sets:[{reps:15,weight:0},{reps:15,weight:0},{reps:12,weight:0}] },
      { name:'Abdominal Crunch',            muscle:'Abdômen', sets:[{reps:20,weight:0},{reps:20,weight:0},{reps:15,weight:0}] },
      { name:'Prancha',                     muscle:'Abdômen', sets:[{reps:45,weight:0},{reps:45,weight:0},{reps:45,weight:0}] },
      { name:'Elevação de Pernas',          muscle:'Abdômen', sets:[{reps:15,weight:0},{reps:15,weight:0},{reps:12,weight:0}] },
    ]
  },
  {
    id: 'ppl_legs', gender: 'all',
    label: '🟢 PPL Pernas',
    muscles: ['Pernas','Glúteos'],
    exercises: [
      { name:'Agachamento',           muscle:'Pernas',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:8,weight:0},{reps:8,weight:0}] },
      { name:'Leg Press',             muscle:'Pernas',  sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Hack Squat',            muscle:'Pernas',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Extensão de Pernas',    muscle:'Pernas',  sets:[{reps:15,weight:0},{reps:15,weight:0}] },
      { name:'Flexão de Pernas',      muscle:'Pernas',  sets:[{reps:15,weight:0},{reps:12,weight:0}] },
      { name:'Panturrilha em Pé',     muscle:'Pernas',  sets:[{reps:20,weight:0},{reps:20,weight:0},{reps:15,weight:0}] },
      { name:'Hip Thrust',            muscle:'Glúteos', sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Stiff',                 muscle:'Pernas',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
    ]
  },
  {
    id: 'full_body_a', gender: 'all',
    label: '🔥 Full Body A',
    muscles: ['Peito','Costas','Pernas','Abdômen'],
    exercises: [
      { name:'Supino Reto',           muscle:'Peito',   sets:[{reps:10,weight:0},{reps:10,weight:0},{reps:8,weight:0}] },
      { name:'Puxada Frente',         muscle:'Costas',  sets:[{reps:10,weight:0},{reps:10,weight:0},{reps:8,weight:0}] },
      { name:'Agachamento',           muscle:'Pernas',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Leg Press',             muscle:'Pernas',  sets:[{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Flexão de Pernas',      muscle:'Pernas',  sets:[{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Abdominal Crunch',      muscle:'Abdômen', sets:[{reps:20,weight:0},{reps:20,weight:0}] },
      { name:'Prancha',               muscle:'Abdômen', sets:[{reps:45,weight:0},{reps:45,weight:0}] },
    ]
  },
  {
    id: 'full_body_b', gender: 'all',
    label: '⚡ Full Body B',
    muscles: ['Ombros','Bíceps','Tríceps','Glúteos','Abdômen'],
    exercises: [
      { name:'Desenvolvimento c/ Halteres', muscle:'Ombros',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Elevação Lateral',            muscle:'Ombros',  sets:[{reps:15,weight:0},{reps:12,weight:0}] },
      { name:'Rosca Direta',                muscle:'Bíceps',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Tríceps Corda',               muscle:'Tríceps', sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Hip Thrust',                  muscle:'Glúteos', sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Agachamento Sumô',            muscle:'Glúteos', sets:[{reps:15,weight:0},{reps:12,weight:0}] },
      { name:'Oblíquo',                     muscle:'Abdômen', sets:[{reps:20,weight:0},{reps:20,weight:0}] },
      { name:'Elevação de Pernas',          muscle:'Abdômen', sets:[{reps:15,weight:0},{reps:15,weight:0}] },
    ]
  },

  // ── ALONGAMENTOS ─────────────────────────────────────────────────
  // Protocolo: 2 séries × 30s estáticos | 2 séries × 30s dinâmicos
  // Pausa recomendada entre séries: 15-20s para reposicionar
  {
    id: 'stretch_full', gender: 'all', stretch: true,
    label: '🤸 Alongamento Completo',
    muscles: ['Alongamentos'],
    exercises: [
      { name:'Gato-Vaca (Cat-Cow)',                muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // dinâmico 30s
      { name:'Postura da Criança (Child\'s Pose)',  muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // estático
      { name:'Cobra (Extensão Lombar)',             muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] },
      { name:'Torção Espinhal Deitado',             muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // cada lado
      { name:'Figura 4 Deitado (Piriforme)',        muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // cada lado
      { name:'Fenda Baixa (Flexor da Anca)',        muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // cada lado
      { name:'Borboleta (Adutores Sentado)',         muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] },
      { name:'Downward Dog',                        muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] },
      { name:'Alongamento Cross-Body (Ombro)',      muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // cada lado
      { name:'Alongamento do Peito na Porta',       muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] },
    ]
  },
  {
    id: 'stretch_upper', gender: 'all', stretch: true,
    label: '🤸 Alongamento Superior',
    muscles: ['Alongamentos'],
    exercises: [
      { name:'Rotação do Pescoço',                 muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // dinâmico 30s
      { name:'Alongamento Lateral do Pescoço',     muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // cada lado
      { name:'Alongamento do Peito na Porta',      muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] },
      { name:'Alongamento Cross-Body (Ombro)',     muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // cada lado
      { name:'Alongamento de Tríceps sobre a Cabeça', muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // cada lado
      { name:'Thread the Needle',                  muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // cada lado
      { name:'Rotação Torácica',                   muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // dinâmico
      { name:'Gato-Vaca (Cat-Cow)',                muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // dinâmico
    ]
  },
  {
    id: 'stretch_lower', gender: 'all', stretch: true,
    label: '🤸 Alongamento Inferior',
    muscles: ['Alongamentos'],
    exercises: [
      { name:'Fenda Baixa (Flexor da Anca)',        muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // cada lado
      { name:'Figura 4 Deitado (Piriforme)',        muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // cada lado
      { name:'Alongamento de Isquiotibiais Deitado',muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // cada lado
      { name:'Postura do Pombo',                    muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // cada lado
      { name:'Borboleta (Adutores Sentado)',         muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] },
      { name:'Alongamento de Quadricípite em Pé',  muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // cada lado
      { name:'Alongamento de Panturrilha em Pé',   muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // cada lado
      { name:'Downward Dog',                        muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] },
    ]
  },
  {
    id: 'stretch_mobility', gender: 'all', stretch: true,
    label: '🤸 Mobilidade Articular',
    muscles: ['Alongamentos'],
    exercises: [
      { name:'Gato-Vaca (Cat-Cow)',                muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // dinâmico
      { name:'Rotação Torácica',                   muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // dinâmico
      { name:'Abertura de Anca em Círculo',        muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // dinâmico
      { name:'World\'s Greatest Stretch',          muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // cada lado
      { name:'Hip 90/90',                          muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // cada lado
      { name:'Thread the Needle',                  muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // cada lado
      { name:'Rotação de Tornozelo',               muscle:'Alongamentos', sets:[{reps:30,weight:0},{reps:30,weight:0}] }, // cada lado
    ]
  },

  // ── CASA — Peso Corporal ──────────────────────────────────────────
  {
    id: 'home_full_body', gender: 'all', home: true,
    label: '🏠 Full Body',
    muscles: ['Peito','Pernas','Costas','Abdômen'],
    exercises: [
      { name:'Flexão de Braço',     muscle:'Peito',   sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0},{reps:10,weight:0}] },
      { name:'Agachamento',         muscle:'Pernas',  sets:[{reps:20,weight:0},{reps:20,weight:0},{reps:15,weight:0}] },
      { name:'Afundo',              muscle:'Pernas',  sets:[{reps:12,weight:0},{reps:12,weight:0},{reps:10,weight:0}] },
      { name:'Superman',            muscle:'Costas',  sets:[{reps:15,weight:0},{reps:15,weight:0},{reps:12,weight:0}] },
      { name:'Burpee',              muscle:'Pernas',  sets:[{reps:10,weight:0},{reps:8,weight:0},{reps:8,weight:0}] },
      { name:'Prancha',             muscle:'Abdômen', sets:[{reps:45,weight:0},{reps:45,weight:0},{reps:30,weight:0}] },
      { name:'Abdominal Crunch',    muscle:'Abdômen', sets:[{reps:20,weight:0},{reps:20,weight:0},{reps:15,weight:0}] },
    ]
  },
  {
    id: 'home_upper', gender: 'all', home: true,
    label: '🏠 Superior',
    muscles: ['Peito','Tríceps','Ombros','Costas'],
    exercises: [
      { name:'Flexão de Braço',     muscle:'Peito',   sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0},{reps:10,weight:0}] },
      { name:'Flexão Inclinada',    muscle:'Peito',   sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Flexão Diamante',     muscle:'Tríceps', sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Dips em Cadeira',     muscle:'Tríceps', sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Pike Push-up',        muscle:'Ombros',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Superman',            muscle:'Costas',  sets:[{reps:15,weight:0},{reps:15,weight:0},{reps:12,weight:0}] },
      { name:'Prancha',             muscle:'Abdômen', sets:[{reps:45,weight:0},{reps:45,weight:0},{reps:30,weight:0}] },
    ]
  },
  {
    id: 'home_lower', gender: 'all', home: true,
    label: '🏠 Inferior',
    muscles: ['Pernas','Glúteos'],
    exercises: [
      { name:'Agachamento',         muscle:'Pernas',  sets:[{reps:20,weight:0},{reps:20,weight:0},{reps:15,weight:0},{reps:15,weight:0}] },
      { name:'Afundo',              muscle:'Pernas',  sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Agachamento Sumô',    muscle:'Glúteos', sets:[{reps:20,weight:0},{reps:15,weight:0},{reps:15,weight:0}] },
      { name:'Elevação de Quadril', muscle:'Glúteos', sets:[{reps:20,weight:0},{reps:20,weight:0},{reps:15,weight:0}] },
      { name:'Agachamento Búlgaro', muscle:'Pernas',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Panturrilha em Pé',   muscle:'Pernas',  sets:[{reps:25,weight:0},{reps:20,weight:0},{reps:20,weight:0}] },
      { name:'Wall Sit',            muscle:'Pernas',  sets:[{reps:45,weight:0},{reps:45,weight:0},{reps:30,weight:0}] },
    ]
  },
  {
    id: 'home_core', gender: 'all', home: true,
    label: '🏠 Core',
    muscles: ['Abdômen','Costas'],
    exercises: [
      { name:'Prancha',             muscle:'Abdômen', sets:[{reps:60,weight:0},{reps:45,weight:0},{reps:45,weight:0}] },
      { name:'Prancha Lateral',     muscle:'Abdômen', sets:[{reps:30,weight:0},{reps:30,weight:0},{reps:25,weight:0}] },
      { name:'Abdominal Crunch',    muscle:'Abdômen', sets:[{reps:25,weight:0},{reps:20,weight:0},{reps:20,weight:0}] },
      { name:'Elevação de Pernas',  muscle:'Abdômen', sets:[{reps:15,weight:0},{reps:15,weight:0},{reps:12,weight:0}] },
      { name:'Mountain Climber',    muscle:'Abdômen', sets:[{reps:20,weight:0},{reps:20,weight:0},{reps:15,weight:0}] },
      { name:'Oblíquo',             muscle:'Abdômen', sets:[{reps:20,weight:0},{reps:20,weight:0},{reps:15,weight:0}] },
      { name:'Superman',            muscle:'Costas',  sets:[{reps:15,weight:0},{reps:15,weight:0},{reps:12,weight:0}] },
    ]
  },
  {
    id: 'home_hiit', gender: 'all', home: true,
    label: '⚡ HIIT Casa',
    muscles: ['Pernas','Abdômen','Peito'],
    exercises: [
      { name:'Burpee',              muscle:'Pernas',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0},{reps:8,weight:0}] },
      { name:'Jump Squat',          muscle:'Pernas',  sets:[{reps:15,weight:0},{reps:15,weight:0},{reps:12,weight:0}] },
      { name:'Mountain Climber',    muscle:'Abdômen', sets:[{reps:20,weight:0},{reps:20,weight:0},{reps:20,weight:0}] },
      { name:'Jumping Jack',        muscle:'Pernas',  sets:[{reps:30,weight:0},{reps:30,weight:0},{reps:25,weight:0}] },
      { name:'Flexão de Braço',     muscle:'Peito',   sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Agachamento',         muscle:'Pernas',  sets:[{reps:20,weight:0},{reps:15,weight:0},{reps:15,weight:0}] },
    ]
  },
  {
    id: 'home_gluteos_f', gender: 'f', home: true,
    label: '🏠 Glúteos Casa',
    muscles: ['Glúteos','Pernas'],
    exercises: [
      { name:'Agachamento Sumô',    muscle:'Glúteos', sets:[{reps:20,weight:0},{reps:20,weight:0},{reps:15,weight:0}] },
      { name:'Elevação de Quadril', muscle:'Glúteos', sets:[{reps:20,weight:0},{reps:20,weight:0},{reps:15,weight:0},{reps:15,weight:0}] },
      { name:'Fire Hydrant',        muscle:'Glúteos', sets:[{reps:20,weight:0},{reps:20,weight:0},{reps:15,weight:0}] },
      { name:'Afundo Reverso',      muscle:'Pernas',  sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Clamshell',           muscle:'Glúteos', sets:[{reps:20,weight:0},{reps:20,weight:0},{reps:15,weight:0}] },
      { name:'Elevação de Perna',   muscle:'Glúteos', sets:[{reps:20,weight:0},{reps:15,weight:0},{reps:15,weight:0}] },
      { name:'Prancha',             muscle:'Abdômen', sets:[{reps:30,weight:0},{reps:30,weight:0},{reps:30,weight:0}] },
    ]
  },
  {
    id: 'home_full_f', gender: 'f', home: true,
    label: '🏠 Full Body Fem.',
    muscles: ['Glúteos','Pernas','Peito','Abdômen'],
    exercises: [
      { name:'Agachamento',         muscle:'Pernas',  sets:[{reps:20,weight:0},{reps:20,weight:0},{reps:15,weight:0}] },
      { name:'Elevação de Quadril', muscle:'Glúteos', sets:[{reps:20,weight:0},{reps:20,weight:0},{reps:15,weight:0}] },
      { name:'Flexão de Braço',     muscle:'Peito',   sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Afundo',              muscle:'Pernas',  sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Fire Hydrant',        muscle:'Glúteos', sets:[{reps:20,weight:0},{reps:15,weight:0},{reps:15,weight:0}] },
      { name:'Abdominal Crunch',    muscle:'Abdômen', sets:[{reps:20,weight:0},{reps:20,weight:0},{reps:15,weight:0}] },
      { name:'Prancha',             muscle:'Abdômen', sets:[{reps:45,weight:0},{reps:30,weight:0},{reps:30,weight:0}] },
    ]
  },
];

let activeTemplateId = null;

// Age-adapted workout templates
const CHILD_TEMPLATES = [
  {
    id: 'child_fun',
    label: '🌟 Circuito Divertido',
    muscles: ['Pernas','Abdômen'],
    exercises: [
      { name:'Flexão de Braço',    muscle:'Peito',   sets:[{reps:8,weight:0},{reps:8,weight:0},{reps:6,weight:0}] },
      { name:'Agachamento',        muscle:'Pernas',  sets:[{reps:12,weight:0},{reps:12,weight:0},{reps:10,weight:0}] },
      { name:'Prancha',            muscle:'Abdômen', sets:[{reps:20,weight:0},{reps:20,weight:0},{reps:15,weight:0}] },
      { name:'Abdominal Crunch',   muscle:'Abdômen', sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
    ]
  },
  {
    id: 'child_flex',
    label: '🤸 Flexibilidade & Mobilidade',
    muscles: ['Abdômen','Pernas'],
    exercises: [
      { name:'Prancha',            muscle:'Abdômen', sets:[{reps:20,weight:0},{reps:20,weight:0}] },
      { name:'Prancha Lateral',    muscle:'Abdômen', sets:[{reps:15,weight:0},{reps:15,weight:0}] },
      { name:'Abdominal Bicicleta',muscle:'Abdômen', sets:[{reps:15,weight:0},{reps:15,weight:0}] },
      { name:'Avanço',             muscle:'Pernas',  sets:[{reps:10,weight:0},{reps:10,weight:0}] },
    ]
  },
  {
    id: 'child_body',
    label: '💪 Peso Corporal',
    muscles: ['Peito','Costas','Pernas'],
    exercises: [
      { name:'Flexão de Braço',    muscle:'Peito',   sets:[{reps:10,weight:0},{reps:8,weight:0},{reps:8,weight:0}] },
      { name:'Agachamento',        muscle:'Pernas',  sets:[{reps:15,weight:0},{reps:12,weight:0},{reps:12,weight:0}] },
      { name:'Avanço',             muscle:'Pernas',  sets:[{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Prancha',            muscle:'Abdômen', sets:[{reps:25,weight:0},{reps:25,weight:0}] },
      { name:'Hollow Body',        muscle:'Abdômen', sets:[{reps:20,weight:0},{reps:15,weight:0}] },
    ]
  },
];

const ELDERLY_TEMPLATES = [
  {
    id: 'elderly_gentle',
    label: '🌿 Treino Suave',
    muscles: ['Pernas','Abdômen'],
    exercises: [
      { name:'Agachamento',        muscle:'Pernas',  sets:[{reps:10,weight:0},{reps:10,weight:0},{reps:8,weight:0}] },
      { name:'Avanço',             muscle:'Pernas',  sets:[{reps:8,weight:0},{reps:8,weight:0}] },
      { name:'Prancha',            muscle:'Abdômen', sets:[{reps:20,weight:0},{reps:20,weight:0}] },
      { name:'Abdominal Crunch',   muscle:'Abdômen', sets:[{reps:12,weight:0},{reps:12,weight:0}] },
    ]
  },
  {
    id: 'elderly_mobility',
    label: '🧘 Mobilidade & Equilíbrio',
    muscles: ['Pernas','Abdômen','Costas'],
    exercises: [
      { name:'Prancha',            muscle:'Abdômen', sets:[{reps:20,weight:0},{reps:20,weight:0}] },
      { name:'Prancha Lateral',    muscle:'Abdômen', sets:[{reps:15,weight:0},{reps:15,weight:0}] },
      { name:'Agachamento',        muscle:'Pernas',  sets:[{reps:8,weight:0},{reps:8,weight:0}] },
      { name:'Elevação de Quadril',muscle:'Glúteos', sets:[{reps:12,weight:0},{reps:12,weight:0},{reps:10,weight:0}] },
    ]
  },
  {
    id: 'elderly_upper',
    label: '💆 Parte Superior Leve',
    muscles: ['Ombros','Costas','Bíceps'],
    exercises: [
      { name:'Elevação Lateral',      muscle:'Ombros',  sets:[{reps:12,weight:0},{reps:12,weight:0},{reps:10,weight:0}] },
      { name:'Elevação Frontal',      muscle:'Ombros',  sets:[{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Remada Máquina',        muscle:'Costas',  sets:[{reps:12,weight:0},{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Rosca Alternada',       muscle:'Bíceps',  sets:[{reps:10,weight:0},{reps:10,weight:0}] },
      { name:'Tríceps Corda',         muscle:'Tríceps', sets:[{reps:12,weight:0},{reps:12,weight:0}] },
    ]
  },
];

function getAgeCategory(age) {
  if (!age) return 'adult';
  if (age < 14) return 'child';
  if (age >= 70) return 'elderly';
  return 'adult';
}

function loadAgeTemplate(templateId) {
  const all = [...CHILD_TEMPLATES, ...ELDERLY_TEMPLATES];
  const tpl = all.find(t => t.id === templateId);
  if (!tpl) return;
  activeTemplateId = tpl.id;
  _browserVisible = false;
  workoutExercises = tpl.exercises.map(e => ({ name:e.name, muscle:e.muscle, sets:e.sets.map(s=>({...s})) }));
  workoutSelectedMuscles = [...tpl.muscles];
  const profile = getProfile();
  renderWorkoutNotices();
  renderWorkoutTemplatePills();
  renderWorkoutMuscleChips(profile);
  renderExerciseBrowser(profile);
  renderWorkoutList();
  updateWorkoutSummary();
  setTimeout(() => { const el = document.getElementById('workout-session'); if (el) el.scrollIntoView({behavior:'smooth',block:'start'}); }, 100);
  showToast(`✔ ${tpl.label} ${t('t_loaded')}`);
}

// Rotation: after doing X, suggest Y next
const WORKOUT_ROTATION = {
  // Masculino
  'peito_triceps':  'costas_biceps',
  'costas_biceps':  'pernas_gluteos',
  'pernas_gluteos': 'ombros_abdomen',
  'ombros_abdomen': 'peito_triceps',
  'ppl_push':       'ppl_pull',
  'ppl_pull':       'ppl_legs',
  'ppl_legs':       'ppl_push',
  // Feminino
  'gluteos_f':      'upper_toning_f',
  'upper_toning_f': 'full_body_f',
  'full_body_f':    'core_f',
  'core_f':         'gluteos_f',
  // Mistos
  'full_body_a':    'full_body_b',
  'full_body_b':    'full_body_a',
};

function getSuggestedNextTemplate() {
  const profile = getProfile();
  if (!profile) return null;
  const history = profile.workoutHistory || [];
  if (!history.length) return null;

  const last = history[0];

  // Use saved templateId if available
  if (last.templateId && WORKOUT_ROTATION[last.templateId]) {
    return WORKOUT_TEMPLATES.find(t => t.id === WORKOUT_ROTATION[last.templateId]) || null;
  }

  // Fallback: match muscles from last workout to a known template
  const lastMuscles = [...new Set((last.exercises || []).map(e => e.muscle))];
  const groups = [
    ['peito_triceps', 'costas_biceps', 'pernas_gluteos', 'ombros_abdomen'],
    ['ppl_push', 'ppl_pull', 'ppl_legs'],
    ['full_body_a', 'full_body_b'],
    ['gluteos_f', 'upper_toning_f', 'full_body_f', 'core_f'],
  ];

  for (const group of groups) {
    for (let i = 0; i < group.length; i++) {
      const tpl = WORKOUT_TEMPLATES.find(t => t.id === group[i]);
      if (!tpl) continue;
      if (tpl.muscles.length === lastMuscles.length && tpl.muscles.every(m => lastMuscles.includes(m))) {
        return WORKOUT_TEMPLATES.find(t => t.id === group[(i + 1) % group.length]) || null;
      }
    }
  }
  // Partial match
  for (const group of groups) {
    for (let i = 0; i < group.length; i++) {
      const tpl = WORKOUT_TEMPLATES.find(t => t.id === group[i]);
      if (tpl && tpl.muscles.some(m => lastMuscles.includes(m))) {
        return WORKOUT_TEMPLATES.find(t => t.id === group[(i + 1) % group.length]) || null;
      }
    }
  }
  return null;
}


function scrollTemplates(dir) {
  const el = document.getElementById('workout-template-scroll');
  if (el) el.scrollBy({ left: dir * 160, behavior: 'smooth' });
}
function updateTemplateArrows() {} // reserved for future fade logic

function renderWorkoutTemplatePills() {
  const el      = document.getElementById('workout-template-pills');
  const toggleEl = document.getElementById('workout-mode-toggle');
  const suggested = getSuggestedNextTemplate();
  const profile = getProfile();
  const userGender = profile ? profile.gender : null;

  // ── Segmented mode toggle ──────────────────────────────
  const modeBtn = (mode, emoji, label, sublabel) => {
    const active = workoutMode === mode;
    return `<button onclick="setWorkoutMode('${mode}')" style="
      flex:1; display:flex; flex-direction:column; align-items:center; gap:2px;
      padding:10px 4px; border-radius:10px; border:none; cursor:pointer;
      background:${active ? 'rgba(255,107,53,0.18)' : 'transparent'};
      color:${active ? 'var(--orange)' : 'var(--muted)'};
      transition:all .2s;
      box-shadow:${active ? 'inset 0 0 0 1px rgba(255,107,53,0.4)' : 'none'};">
        <span style="font-size:1.1rem;line-height:1;">${emoji}</span>
        <span style="font-size:0.68rem;font-weight:800;letter-spacing:0.05em;text-transform:uppercase;">${label}</span>
        ${active && sublabel ? `<span style="font-size:0.55rem;opacity:0.7;font-weight:400;text-transform:none;letter-spacing:0;">${sublabel}</span>` : ''}
    </button>`;
  };

  if (toggleEl) toggleEl.innerHTML = `
    <div style="display:flex;background:rgba(255,255,255,0.05);border-radius:13px;padding:3px;gap:2px;">
      ${modeBtn('gym',     '🏋️', t('workout_tab_gym'),     '')}
      ${modeBtn('home',    '🏠', t('workout_tab_home'),    '')}
      ${modeBtn('stretch', '🤸', t('workout_tab_stretch'), t('workout_tab_stretch_sub'))}
    </div>`;

  // ── Equipment picker (home mode only) ─────────────────
  const eqEl = document.getElementById('workout-equipment-picker');
  if (eqEl) {
    if (workoutMode === 'home') {
      const owned = (profile && profile.homeEquipment) || [];
      const count  = owned.length;
      const summary = count === 0
        ? t('workout_home_eq_config')
        : `${count} item${count > 1 ? 's' : ''} selecionado${count > 1 ? 's' : ''}`;

      const chip = (eq) => {
        const on = owned.includes(eq.id);
        return `<button onclick="toggleHomeEquipment('${eq.id}')" title="${eq.note}"
          style="padding:5px 11px;border-radius:20px;cursor:pointer;font-size:0.75rem;font-weight:600;
                 white-space:nowrap;border:1px solid ${on ? 'rgba(255,107,53,0.5)' : 'var(--border)'};
                 background:${on ? 'rgba(255,107,53,0.12)' : 'rgba(255,255,255,0.04)'};
                 color:${on ? 'var(--orange)' : 'var(--muted)'};transition:all .15s;">
          ${on ? '✓ ' : ''}${eq.label}
        </button>`;
      };

      const groupHtml = EQUIPMENT_GROUPS.map(g => {
        const items = EQUIPMENT_LIST.filter(e => e.group === g.id);
        return `
          <div style="font-size:0.6rem;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;
                      color:var(--muted);opacity:0.7;margin:10px 0 6px;">${g.label}</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">${items.map(chip).join('')}</div>`;
      }).join('');

      eqEl.innerHTML = `
        <div style="margin-bottom:12px;border:1px solid var(--border);border-radius:12px;overflow:hidden;">
          <!-- Header — sempre visível -->
          <button onclick="toggleEqPicker()"
            style="width:100%;display:flex;align-items:center;justify-content:space-between;
                   padding:10px 14px;background:rgba(255,255,255,0.03);border:none;cursor:pointer;
                   text-align:left;gap:10px;">
            <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;">
              <span style="font-size:0.65rem;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;
                           color:var(--text);white-space:nowrap;">${t('ex_equipment_label')}</span>
              <span style="font-size:0.68rem;color:${count > 0 ? 'var(--orange)' : 'var(--muted)'};">
                ${summary}
              </span>
            </div>
            <span id="eq-arrow" style="font-size:0.75rem;color:var(--muted);flex-shrink:0;transition:transform .2s;
                         transform:rotate(${_eqPickerOpen ? '180' : '0'}deg);">▾</span>
          </button>
          <!-- Corpo expansível -->
          <div id="eq-picker-body" style="display:${_eqPickerOpen ? 'block' : 'none'};
               padding:4px 14px 14px;background:rgba(255,255,255,0.02);
               border-top:1px solid var(--border);">
            ${groupHtml}
          </div>
        </div>`;
    } else {
      eqEl.innerHTML = '';
    }
  }

  // ── Template cards ─────────────────────────────────────
  const homeEquip = (profile && profile.homeEquipment) || [];

  // Builds the list of templates to show depending on mode + equipment
  let modeTemplates;
  let eqTemplates = []; // gym templates adapted for home use

  if (workoutMode === 'home') {
    modeTemplates = WORKOUT_TEMPLATES.filter(t => t.home === true);

    if (homeEquip.length > 0) {
      // Score every gym template by how many exercises the user can do
      const gymTemplates = WORKOUT_TEMPLATES.filter(t => !t.home && !t.stretch);
      eqTemplates = gymTemplates
        .map(t => {
          const available = t.exercises.filter(e => canDoExercise(e.name, homeEquip));
          const score = available.length / t.exercises.length;
          return { ...t, _available: available.length, _total: t.exercises.length, _score: score };
        })
        .filter(t => t._score >= 0.5)   // at least half the exercises doable
        .sort((a, b) => b._score - a._score);
    }
  } else if (workoutMode === 'stretch') {
    modeTemplates = WORKOUT_TEMPLATES.filter(t => t.stretch === true);
  } else {
    modeTemplates = WORKOUT_TEMPLATES.filter(t => !t.home && !t.stretch);
  }

  const sorted = [...modeTemplates].sort((a, b) => {
    const aMatch = !userGender || a.gender === userGender || a.gender === 'all';
    const bMatch = !userGender || b.gender === userGender || b.gender === 'all';
    return (aMatch === bMatch) ? 0 : aMatch ? -1 : 1;
  });

  // Render helper for a single template card
  const renderCard = (tpl, opts = {}) => {
    const { isEqCard = false } = opts;
    const isActive    = activeTemplateId === tpl.id;
    const isSuggested = suggested && suggested.id === tpl.id && !isActive;
    const isOther     = !isEqCard && userGender && tpl.gender !== userGender && tpl.gender !== 'all';

    const accent = isActive    ? 'var(--orange)'
                 : isSuggested ? 'var(--green)'
                 : isEqCard    ? 'rgba(0,170,255,0.4)'
                 : 'rgba(255,255,255,0.12)';
    const bg     = isActive    ? 'rgba(255,107,53,0.12)'
                 : isSuggested ? 'rgba(0,212,170,0.08)'
                 : isEqCard    ? 'rgba(0,170,255,0.06)'
                 : 'rgba(255,255,255,0.03)';

    const muscleChips = tpl.muscles.slice(0, 2).map(m =>
      `<span style="font-size:0.58rem;background:rgba(255,255,255,0.07);border-radius:8px;
                    padding:2px 6px;color:var(--muted);white-space:nowrap;">${m}</span>`
    ).join('');

    const availBadge = isEqCard && tpl._available != null
      ? `<div style="font-size:0.58rem;color:#00aaff;font-weight:800;letter-spacing:0.06em;margin-bottom:4px;">
           ✓ ${tpl._available}/${tpl._total} ${t('exercises_label')}
         </div>` : '';

    const statusLabel = isActive
      ? `<div style="font-size:0.58rem;color:var(--orange);font-weight:800;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:5px;">✔ ${t('status_active')}</div>`
      : isSuggested
      ? `<div style="font-size:0.58rem;color:var(--green);font-weight:800;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:5px;">↑ ${t('status_next')}</div>`
      : '';

    return `
    <div onclick="loadWorkoutTemplate('${tpl.id}')"
      style="display:flex;flex-direction:column;justify-content:space-between;gap:8px;
             padding:12px 13px;min-width:136px;max-width:136px;min-height:100px;
             background:${bg};border:1px solid ${accent};border-top:3px solid ${accent};
             border-radius:13px;cursor:pointer;opacity:${isOther ? '0.5' : '1'};
             transition:all .2s;
             box-shadow:${isActive ? '0 4px 20px rgba(255,107,53,0.2)' : isSuggested ? '0 4px 20px rgba(0,212,170,0.15)' : '0 2px 10px rgba(0,0,0,0.25)'};">
      <div>
        ${statusLabel}${availBadge}
        <div style="font-size:0.88rem;font-weight:800;line-height:1.25;
                    color:${isActive ? 'var(--orange)' : isSuggested ? 'var(--green)' : 'var(--text)'};">${tpl.label}</div>
      </div>
      <div>
        <div style="font-size:0.68rem;color:var(--muted);margin-bottom:5px;">${tpl.exercises.length} ${t('exercises_label')}</div>
        <div style="display:flex;flex-wrap:wrap;gap:3px;">${muscleChips}</div>
      </div>
    </div>`;
  };

  // Separator between sections
  const separator = eqTemplates.length > 0
    ? `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                   width:26px;flex-shrink:0;gap:3px;opacity:0.4;">
         <div style="width:1px;flex:1;background:var(--border);min-height:60px;"></div>
         <span style="font-size:0.5rem;color:var(--muted);writing-mode:vertical-rl;
                      letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap;">${t('with_equipment')}</span>
         <div style="width:1px;flex:1;background:var(--border);min-height:60px;"></div>
       </div>` : '';

  let shownDivider = false;
  const bodyweightCards = sorted.map(t => {
    const isOther = userGender && t.gender !== userGender && t.gender !== 'all';
    let divider = '';
    if (isOther && !shownDivider) {
      shownDivider = true;
      divider = `<div style="display:flex;align-items:center;justify-content:center;width:18px;flex-shrink:0;">
        <div style="width:1px;height:100%;background:var(--border);min-height:70px;"></div>
      </div>`;
    }
    return divider + renderCard(t);
  }).join('');

  const eqCards = eqTemplates.map(t => renderCard(t, { isEqCard: true })).join('');

  el.innerHTML = bodyweightCards + separator + eqCards;
}

function loadWorkoutTemplate(templateId) {
  const tpl = WORKOUT_TEMPLATES.find(t => t.id === templateId);
  if (!tpl) return;
  activeTemplateId = templateId;
  _browserVisible = false; // colapsa o browser quando template é carregado
  const profile = getProfile();
  // Deep copy exercises and adapt to goal
  let base = tpl.exercises.map(e => ({ name: e.name, muscle: e.muscle, sets: e.sets.map(s => ({ ...s })) }));
  // In home mode, filter out exercises that need unavailable equipment
  if (workoutMode === 'home' && profile) {
    const homeEq = profile.homeEquipment || [];
    const available = base.filter(e => canDoExercise(e.name, homeEq));
    if (available.length >= 3) base = available; // only filter if enough remain
  }
  workoutExercises = profile && profile.goal ? adaptExercisesToGoal(base, profile.goal) : base;
  workoutSelectedMuscles = [...tpl.muscles];
  renderWorkoutTemplatePills();
  renderWorkoutMuscleChips(profile);
  renderExerciseBrowser(profile);
  renderWorkoutList();
  updateWorkoutSummary();
  // Scroll to session
  setTimeout(() => {
    const el = document.getElementById('workout-session');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
  showToast(`✔ ${tpl.label} ${t('t_loaded')}`);
}

// ─── YouTube helper ───────────────────────────────────
// Curated video IDs for the most common exercises
const EXERCISE_VIDEO_IDS = {
  'Supino Reto c/ Barra':          'rT7DgCr-3pg',
  'Supino Reto':                   'rT7DgCr-3pg',
  'Supino Inclinado c/ Barra':     'DbFgADa2PL8',
  'Supino Inclinado':              'DbFgADa2PL8',
  'Supino Declinado c/ Barra':     'LfyQTzu6mqA',
  'Crucifixo c/ Halteres':         'eozdVDA78K0',
  'Crucifixo':                     'eozdVDA78K0',
  'Peck Deck':                     'Z57CtFmRMxA',
  'Crossover':                     'taI4XduLpTk',
  'Flexão de Braço':               'IODxDxX7oi4',
  'Agachamento Livre':             'ultWZbUMPL8',
  'Agachamento':                   'ultWZbUMPL8',
  'Leg Press 45°':                 'IZxyjW7SKSA',
  'Leg Press':                     'IZxyjW7SKSA',
  'Extensão de Pernas':            'YyvSfVjQeL0',
  'Flexão de Pernas Deitado':      'ELOCsoDSmrg',
  'Flexão de Pernas':              'ELOCsoDSmrg',
  'Stiff c/ Barra':                '1uDiW5--rAE',
  'Stiff':                         '1uDiW5--rAE',
  'Levantamento Terra':            'op9kVnSso6Q',
  'Levantamento Terra Romeno':     'JCXUYuzwNrM',
  'Panturrilha em Pé':             'gwLzBJYoWlQ',
  'Hack Squat':                    'EdtPTSMkMnc',
  'Agachamento Búlgaro':           '2C-uNgKwPLE',
  'Avanço c/ Halteres':            'D7KaRcUTQeE',
  'Hip Thrust c/ Barra':           'SEdqd1n0cvg',
  'Hip Thrust':                    'SEdqd1n0cvg',
  'Abdução de Quadril':            'G_1xzbMIJtI',
  'Puxada Frente c/ Barra':        'CAwf7n6Luuc',
  'Puxada Frente':                 'CAwf7n6Luuc',
  'Remada Curvada c/ Barra':       'FWJR5Ve8bnQ',
  'Remada Curvada':                'FWJR5Ve8bnQ',
  'Remada Unilateral c/ Halter':   'pYcpY20QaE8',
  'Remada Unilateral':             'pYcpY20QaE8',
  'Barra Fixa':                    'eGo4IYlbE5g',
  'Barra Fixa Supinada':           'eGo4IYlbE5g',
  'Desenvolvimento c/ Halteres':   'qEwKCR5JCog',
  'Arnold Press':                  'vj2w851ZHRM',
  'Elevação Lateral c/ Halteres':  'NeB1uQ-5gkk',
  'Elevação Lateral':              'NeB1uQ-5gkk',
  'Elevação Frontal c/ Halteres':  'sOoBPLJTRD0',
  'Face Pull':                     'rep-qVOkqgk',
  'Rosca Direta c/ Barra':         'ykJmrZ5v0Oo',
  'Rosca Direta':                  'ykJmrZ5v0Oo',
  'Rosca Alternada c/ Halteres':   'sAq_ocpRh_I',
  'Rosca Alternada':               'sAq_ocpRh_I',
  'Rosca Martelo':                 'TwD-YGVP4Bk',
  'Rosca Concentrada':             'Jy43H7mhyE0',
  'Rosca Scott c/ Barra EZ':       'fIbDCH6XLic',
  'Chin-up (Barra Supinada)':      'eGo4IYlbE5g',
  'Tríceps Corda na Polia':        '-arm7W4O6-I',
  'Tríceps Corda':                 '-arm7W4O6-I',
  'Tríceps Francês c/ Barra EZ':   'ir5PsbniVSc',
  'Tríceps Francês':               'ir5PsbniVSc',
  'Extensão Testa c/ Barra':       'd_KdH6T9f5I',
  'Extensão Testa':                'd_KdH6T9f5I',
  'Close Grip Bench Press':        'nEF0bv2FW54',
  'Tríceps Mergulho (Dips)':       '6kALZikXxLc',
  'Tríceps Mergulho':              '6kALZikXxLc',
  'Abdominal Crunch':              'Xyd_fa5zoEU',
  'Prancha Frontal':               'ASdvN_XEl_c',
  'Prancha':                       'ASdvN_XEl_c',
  'Elevação de Pernas Deitado':    'JB2oyawG9KI',
  'Elevação de Pernas':            'JB2oyawG9KI',
  'Abdominal Bicicleta':           '9FGilxCbdz8',
  'Russian Twist':                 '9FGilxCbdz8',
  'Mountain Climber':              'nmwgirgXLYM',
  'Abdominal Roda':                'j7TepJDpKiY',
  'Donkey Kicks':                  'SJ1Xuz9D-ZQ',
  'Elevação de Quadril':           'OUgsJ8-Vi0E',
};

function ytUrl(name) {
  return 'https://www.youtube.com/results?search_query=' + encodeURIComponent('como fazer ' + name + ' academia');
}

function closeVideoModal() {
  closeModal('modal-video');
}

// ─── Exercise tips ────────────────────────────────────
const EXERCISE_TIPS = {
  'Supino Reto':           'Costas levemente arqueadas, pés no chão. Desça a barra até ao peito de forma controlada. Cotovelos a 45–75° do tronco.',
  'Supino Inclinado':      'Banco a 30–45°. Foco na parte superior do peito. Não deixa os cotovelos ultrapassar a linha dos ombros.',
  'Supino Declinado':      'Banco a −15–30°. Trabalha a parte inferior do peito. Cuidado com a pressão no pescoço.',
  'Crucifixo':             'Ligeira flexão nos cotovelos durante todo o movimento. Desce até sentir alongamento no peito, sem forçar o ombro.',
  'Peck Deck':             'Mantém os braços paralelos ao chão. Aproxima os antebraços lentamente e faz uma pausa na contração.',
  'Flexão de Braço':       'Corpo em linha reta da cabeça aos pés. Desça até o peito quase tocar no chão. Cotovelos próximos ao tronco.',
  'Pull Over':             'Deitado no banco. Segura o haltere com as duas mãos, braços semi-estendidos. Desce atrás da cabeça e volta.',
  'Puxada Frente':         'Agarra a barra um pouco mais que a largura dos ombros. Puxa até ao queixo, contraindo as costas. Não balances o tronco.',
  'Remada Curvada':        'Joelhos ligeiramente dobrados, tronco a 45°. Puxa a barra ao abdómen. Costas retas durante todo o movimento.',
  'Remada Unilateral':     'Joelho e mão apoiados no banco. Puxa o haltere até à cintura, cotovelo paralelo ao tronco.',
  'Levantamento Terra':    'Pés à largura dos ombros, barra sobre o meio do pé. Costas neutras, empurra o chão. Não arredondas as costas.',
  'Puxada Aberta':         'Pegada mais larga. Puxa até ao queixo, cotovelos apontados para baixo. Trabalha o alargamento do dorsal.',
  'Serrote':               'Apoia um joelho e uma mão no banco. Puxa o haltere até à cintura, cotovelo para cima.',
  'Agachamento':           'Pés à largura dos ombros, dedos ligeiramente para fora. Desce até as coxas ficarem paralelas ao chão. Joelhos alinham com os pés.',
  'Leg Press':             'Pés a meio da plataforma. Desce até 90° de flexão. Não bloqueies os joelhos ao subir.',
  'Extensão de Pernas':    'Parte lombar apoiada no banco. Estende completamente e faz pausa no topo. Desce de forma controlada.',
  'Flexão de Pernas':      'Deita de bruços. Puxa os calcanhares em direção ao glúteo. Quadril apoiado na almofada durante todo o movimento.',
  'Avanço':                'Passo largo para a frente. Joelho traseiro quase toca no chão. Volta à posição inicial com o pé da frente.',
  'Stiff':                 'Pernas semi-esticadas. Inclina o tronco para a frente com costas retas. Sente o alongamento na parte posterior da coxa.',
  'Panturrilha em Pé':     'Poças na ponta dos pés. Desce o calcanhar abaixo do nível da plataforma. Faz pausa no topo da contração.',
  'Desenvolvimento c/ Halteres': 'Senta-te com costas apoiadas. Halteres ao nível das orelhas. Empurra para cima sem bloquear os cotovelos.',
  'Desenvolvimento c/ Barra':    'Barra à frente do queixo. Empurra verticalmente. Não arqueies as costas em excesso.',
  'Elevação Lateral':      'Ligeira flexão nos cotovelos. Eleva os braços até 90°, não mais. Imaginai que derramas água de um copo.',
  'Elevação Frontal':      'Alterna os braços. Levanta até à altura dos olhos. Evita usar impulso do tronco.',
  'Arnold Press':          'Começa com as palmas viradas para ti. Roda enquanto empurras. Trabalha todo o feixe do deltóide.',
  'Encolhimento de Ombros':'Mantém os braços esticados. Encolhe apenas os ombros, não dobres os cotovelos. Pausa no topo.',
  'Rosca Direta':          'Cotovelos fixos junto ao tronco. Sobe de forma controlada e desce lentamente. Não balanças o tronco.',
  'Rosca Alternada':       'Um braço de cada vez. Mantém o cotovelo fixo. Boa amplitude de movimento completa.',
  'Rosca Concentrada':     'Cotovelo apoiado na coxa interna. Máxima amplitude. Excelente para isolar o bicep.',
  'Rosca Martelo':         'Pegada neutra (polegar para cima). Trabalha o braquial e braquiorradial além do bícep.',
  'Tríceps Corda':         'Puxa a corda para baixo e abre as pontas no final. Cotovelos fixos junto ao corpo. Contração total em baixo.',
  'Tríceps Francês':       'Deitado. Desce o haltere atrás da cabeça. Cotovelos apontados para o teto durante todo o exercício.',
  'Tríceps Mergulho':      'Corpo vertical, cotovelos para trás. Desce até 90° de flexão. Não desças demasiado se tiveres ombros frágeis.',
  'Extensão Testa':        'Deitado no banco. Desce o haltere em direção à testa, cotovelos apontados para cima.',
  'Tríceps Polia Alta':    'Vira costas para a polia. Inclina ligeiramente para a frente. Estende completamente os cotovelos.',
  'Abdominal Crunch':      'Mãos atrás da cabeça mas sem puxar o pescoço. Levanta apenas os ombros. Expira na subida.',
  'Prancha':               'Corpo em linha reta da cabeça aos calcanhares. Contrai o abdómen e os glúteos. Não deixas as ancas cair ou subir.',
  'Elevação de Pernas':    'Deitado ou suspenso. Pernas em linha reta ou ligeiramente dobradas. Sobe até 90° e desce controlado.',
  'Oblíquo':               'Roda o tronco em direção ao joelho oposto. Mantém as lombar no chão. Trabalha os oblíquos laterais.',
  'Abdominal Bicicleta':   'Alterna cotovelo com joelho oposto. Movimento lento e controlado. Evita puxar o pescoço.',
  'Hip Thrust':            'Costas apoiadas no banco, barra sobre as ancas. Empurra as ancas para cima até ficares paralelo ao chão.',
  'Agachamento Sumô':      'Pés bem abertos, dedos para fora. Desce com os joelhos na direção dos dedos. Trabalha adutores e glúteos.',
  'Abdução de Quadril':    'Máquina ou elástico. Abre as pernas contra a resistência. Faz pausa na posição aberta antes de fechar.',
  'Hack Squat':                    'Costas apoiadas no aparelho. Pés mais à frente da plataforma para mais glúteo. Desce até 90°.',
  'Elevação de Quadril':           'Deitado de barriga para cima, pés no chão. Contrai o glúteo e eleva as ancas até ficares em linha reta. Pausa 1 seg no topo.',
  'Abdominal Bicicleta':           'Alterna cotovelo com joelho oposto. Movimento lento e controlado. Evita puxar o pescoço com as mãos.',
  'Prancha Lateral':               'Apoio num antebraço e pé. Corpo em linha reta da cabeça aos pés. Mantém os quadris elevados sem deixar ceder.',
  // Peito
  'Supino Reto c/ Barra':          'Agarra a barra com pega ligeiramente mais larga que os ombros. Desce controlado até ao peito, empurra explosivo. Pés fixos no chão.',
  'Supino Reto c/ Halteres':       'Halteres descem até linha do peito. Maior amplitude de movimento que a barra. Mantém os cotovelos a 45–60° do tronco.',
  'Supino Inclinado c/ Barra':     'Banco a 30–45°. Foca na parte superior do peito. Não leves os cotovelos demasiado para baixo da linha dos ombros.',
  'Supino Inclinado c/ Halteres':  'Banco a 30–45°. Maior controlo e amplitude do que com barra. Útil para correção de assimetrias.',
  'Supino Declinado c/ Barra':     'Banco a −15–30°. Recruta a parte inferior do peito. Cuidado com a pressão no pescoço.',
  'Crossover':                     'Polia alta. Puxa os cabos em arco descendente até as mãos se cruzarem ao nível do peito. Mantém ligeira flexão nos cotovelos.',
  'Dips (Mergulho no Banco)':      'Mãos no banco atrás de ti, pés à frente. Desce até 90° de flexão no cotovelo. Mantém o tronco próximo do banco.',
  'Chest Press na Máquina':        'Ajusta o assento para os pegadores ficarem ao nível do peito. Empurra de forma controlada sem trancar os cotovelos.',
  'Fly na Máquina':                'Mantém ligeira flexão nos cotovelos durante todo o movimento. Faz uma pausa na contração máxima.',
  // Costas
  'Puxada Frente c/ Barra':        'Puxa a barra até ao peito superior, cotovelos a apontar para o chão. Escápulas contraídas no final do movimento.',
  'Puxada Frente c/ Triângulo':    'Pegada neutra. Excelente para a largura da costas. Puxa o triângulo até ao peito.',
  'Puxada com Pegada Neutra':      'Mãos paralelas, ombros largura. Enfatiza o grande dorsal e o bíceps.',
  'Remada Sentado na Polia':       'Costas eretas, puxa o triângulo ao umbigo. Não arredondas as costas. Escápulas para trás no final.',
  'Levantamento Terra Romeno':     'Pernas ligeiramente dobradas, barra junto ao corpo. Dobragem de anca, não de joelhos. Sentes o isquiotibial a esticar.',
  'Barra Fixa':                    'Pegada pronada (palmas para fora), ombros largura. Puxa o peito até à barra. Desce controlado.',
  'Barra Fixa Supinada':           'Pegada supinada (palmas para dentro), mais fácil e mais recrutamento de bíceps. Aka "chin-up".',
  'Straight-arm Pulldown':         'Braços quase estendidos. Puxa de cima para baixo em arco. Excelente isolamento do grande dorsal.',
  'Hiperextensão Lombar':          'Banco de hiperextensão. Desce o tronco, sobe até linha reta. Não hiperextendas. Podes segurar um peso no peito.',
  'Face Pull':                     'Polia alta com corda. Puxa ao nível do rosto, cotovelos acima dos ombros. Trabalha deltóide posterior e manguito.',
  'Remada Alta':                   'Barra ou halteres sobem ao queixo com os cotovelos acima. Atenção ao manguito rotador.',
  // Pernas
  'Agachamento Livre':             'Pés à largura dos ombros, dedos ligeiramente para fora. Desce até as coxas ficarem paralelas. Joelhos na direção dos dedos.',
  'Agachamento Goblet':            'Halter ou kettlebell junto ao peito. Excelente para a técnica. Mantém o tronco ereto.',
  'Agachamento Frontal':           'Barra à frente nos ombros. Requer boa mobilidade no tornozelo e pulso. Enfatiza quadríceps.',
  'Agachamento Búlgaro':           'Pé traseiro elevado no banco. Excelente unilateral para pernas e glúteo. Mantém o tronco ereto.',
  'Leg Press 45°':                 'Pés à largura dos ombros a meio da plataforma. Não tranques os joelhos no topo. Desce controlado.',
  'Avanço c/ Halteres':            'Passo largo à frente, desce o joelho traseiro quase ao chão. Mantém o tronco ereto.',
  'Avanço Reverso':                'Passo para trás em vez de à frente. Menor stress no joelho anterior. Boa opção com lesão no joelho.',
  'Afundo Lateral':                'Passo lateral amplo, dobra o joelho da perna do lado, mantém a outra esticada. Trabalha adutores.',
  'Panturrilha em Pé':             'Sobe na ponta dos pés, pausa 1 seg no topo, desce controlado. Podes usar step para maior amplitude.',
  'Panturrilha Sentado':           'Na máquina ou com halter nos joelhos. Enfatiza o sóleo (músculo profundo da panturrilha).',
  'Step-up':                       'Sobe num step ou banco com um pé de cada vez. Mantém o peso no calcanhar da perna que sobe.',
  'Wall Sit':                      'Costas na parede, coxas paralelas ao chão. Isométrico. Mantém o mais tempo possível.',
  // Ombros
  'Desenvolvimento c/ Barra (à frente)': 'Pega ligeiramente mais larga que os ombros. Desce até ao queixo, empurra até quase estender. Não arques as costas.',
  'Elevação Lateral na Polia':     'Polia baixa. Movimento mais constante que com halteres. Mantém o cotovelo ligeiramente dobrado.',
  'Elevação Frontal com Disco':    'Segura o disco com ambas as mãos. Sobe até à altura dos ombros. Controla a descida.',
  'Crucifixo Invertido c/ Halteres': 'Tronco inclinado a 45°. Abre os braços lateralmente com cotovelos ligeiramente dobrados. Trabalha deltóide posterior.',
  'Crucifixo Invertido na Máquina':  'Ajusta o assento para os pegadores ficarem ao nível dos ombros. Mantém os cotovelos ligeiramente dobrados.',
  'Upright Row c/ Barra':          'Barra sobe ao queixo com cotovelos acima. Pega estreita para mais deltóide. Cuidado com o manguito.',
  // Bíceps
  'Rosca Direta c/ Barra EZ':      'A barra EZ reduz o stress nos pulsos. Mantém os cotovelos fixos junto ao corpo.',
  'Rosca Scott c/ Barra EZ':       'No banco Scott, cotovelos apoiados. Elimina o balanço do corpo. Foco total no bíceps.',
  'Rosca Inclinada c/ Halteres':   'Banco inclinado a 45–60°. Maior amplitude de movimento. Excelente para a cabeça longa do bíceps.',
  'Rosca Inversa c/ Barra':        'Pegada pronada. Trabalha o braquiorradial e o antebraço. Complementa o treino de bíceps.',
  'Rosca Cabo c/ Corda':           'Polia baixa com corda. Tensão constante ao longo de todo o movimento.',
  'Chin-up (Barra Supinada)':      'Pegada supinada, mãos à largura dos ombros. Puxa o peito até à barra. Excelente composto para bíceps.',
  // Tríceps
  'Tríceps Polia Alta c/ Barra':   'Polia alta com barra reta. Cotovelos fixos junto ao corpo. Estende completamente os braços em baixo.',
  'Extensão Testa c/ Barra':       'Deitado no banco, barra vai à testa com cotovelos apontados para cima. Cuidado com a barra ao descer.',
  'Extensão Testa c/ Halteres':    'Versão com halteres, maior amplitude. Mantém os cotovelos a apontar para o tecto.',
  'Close Grip Bench Press':        'Supino com pega estreita (ombros largura). Excelente composto para tríceps. Cotovelos próximos do corpo.',
  'Skullcrusher':                  'Deitado, barra EZ desce atrás da cabeça (não à testa). Maior amplitude e tensão no tríceps.',
  'Press de Tríceps na Máquina':   'Ajusta o assento para os cotovelos ficarem alinhados com o pivô da máquina.',
  // Abdômen
  'Crunch Invertido':              'Deitado, joelhos dobrados. Eleva a bacia do chão usando o abdómen. Evita usar impulso.',
  'Knee Raise':                    'Suspenso na barra ou nas barras paralelas. Sobe os joelhos ao peito de forma controlada.',
  'Leg Raise na Barra':            'Suspenso na barra. Pernas estendidas sobem até 90° (ou mais). Muito exigente para o core.',
  'Abdominal Roda':                'Ab wheel. Começa de joelhos. Rola à frente mantendo o core contraído. Não deixa as costas afundar.',
  'Russian Twist c/ Peso':         'Sentado, tronco a 45°. Roda o peso de lado a lado. Mantem os pés ligeiramente elevados para mais dificuldade.',
  'Mountain Climber':              'Posição de prancha. Alterna joelhos ao peito rapidamente. Mantém os quadris nivelados.',
  'Dead Bug':                      'Deitado, braços ao tecto. Baixa braço e perna opostos simultaneamente. Mantém a lombar colada ao chão.',
  'Dragon Flag':                   'Avançado. Apoiado nos ombros, mantém o corpo em linha reta e baixa controlado. Exige grande força de core.',
  // Glúteos
  'Hip Thrust c/ Barra':           'Costas no banco, barra sobre as ancas com proteção. Empurra até ficar paralelo ao chão. Pausa 1 seg no topo.',
  'Hip Thrust na Máquina':         'Versão na máquina. Permite maior carga com técnica mais segura. Ajusta a almofada à altura das ancas.',
  'Donkey Kicks':                  'A 4 apoios. Empurra o calcanhar para o tecto mantendo o joelho dobrado a 90°. Sente o glúteo a contrair.',
  'Fire Hydrant':                  'A 4 apoios. Eleva o joelho lateralmente como um cão. Mantém a bacia estável e não rodar.',
  'Glute Kickback na Polia':       'Polia baixa com tira no tornozelo. Empurra a perna para trás e para cima. Mantém o core estável.',
  'Ponte de Glúteos':              'Igual ao hip thrust mas no chão. Bom para iniciantes ou como aquecimento.',
  'Elevação Pélvica c/ Elástico':  'Elástico acima dos joelhos. Acrescenta resistência abductora ao hip thrust. Activa mais o glúteo médio.',
};

function getExTip(name) {
  return EXERCISE_TIPS[name] || null;
}

// ─── Goal-based workout config ───────────────────────
const GOAL_WORKOUT_CONFIG = {
  cut: {
    get label()     { return t('goal_cut_label2'); },
    emoji: '🔥',
    color: '#00d4aa', bg: 'rgba(0,212,170,.07)', border: 'rgba(0,212,170,.3)',
    sets: 3, repsPattern: [20, 18, 15],
    get rest()      { return t('goal_cut_rest'); },
    get technique() { return t('goal_cut_technique'); },
    get keyPoints() { return [t('goal_cut_pt1'),t('goal_cut_pt2'),t('goal_cut_pt3'),t('goal_cut_pt4')]; },
    get restNote()  { return t('goal_cut_rest_note'); },
    techniqueHint: (isLast) => isLast ? t('goal_last_set_hint') : null,
  },
  bulk: {
    get label()     { return t('goal_bulk_label2'); },
    emoji: '💪',
    color: '#ff6b35', bg: 'rgba(255,107,53,.07)', border: 'rgba(255,107,53,.3)',
    sets: 4, repsPattern: [12, 10, 8, 6],
    get rest()      { return t('goal_bulk_rest'); },
    get technique() { return t('goal_bulk_technique'); },
    get keyPoints() { return [t('goal_bulk_pt1'),t('goal_bulk_pt2'),t('goal_bulk_pt3'),t('goal_bulk_pt4')]; },
    get restNote()  { return t('goal_bulk_rest_note'); },
    techniqueHint: (isLast) => isLast ? t('goal_last_set_hint') : null,
  },
  maintain: {
    get label()     { return t('goal_maintain_label2'); },
    emoji: '⚖️',
    color: '#00aaff', bg: 'rgba(0,170,255,.07)', border: 'rgba(0,170,255,.3)',
    sets: 3, repsPattern: [15, 12, 10],
    get rest()      { return t('goal_maintain_rest'); },
    get technique() { return t('goal_maintain_technique'); },
    get keyPoints() { return [t('goal_maintain_pt1'),t('goal_maintain_pt2'),t('goal_maintain_pt3'),t('goal_maintain_pt4')]; },
    get restNote()  { return t('goal_maintain_rest_note'); },
    techniqueHint: (isLast) => isLast ? t('goal_last_set_hint') : null,
  },
};

// Superset pairings per template (used when goal = cut)
const SUPERSET_PAIRS = {
  // Masculinos
  peito_triceps:    [['Supino Reto','Tríceps Corda'],['Supino Inclinado','Tríceps Francês'],['Crucifixo','Extensão Testa'],['Peck Deck','Tríceps Mergulho']],
  costas_biceps:    [['Puxada Frente','Rosca Direta'],['Remada Curvada','Rosca Alternada'],['Remada Unilateral','Rosca Martelo'],['Puxada Aberta','Rosca Concentrada']],
  ppl_push:         [['Supino Reto','Tríceps Corda'],['Supino Inclinado','Extensão Testa'],['Crucifixo','Elevação Lateral'],['Desenvolvimento c/ Halteres','Tríceps Francês']],
  ppl_pull:         [['Puxada Frente','Rosca Direta'],['Remada Curvada','Rosca Alternada'],['Remada Unilateral','Rosca Concentrada'],['Serrote','Rosca Martelo']],
  // Femininos
  gluteos_f:        [['Hip Thrust','Abdução de Quadril'],['Stiff','Flexão de Pernas'],['Agachamento Sumô','Elevação de Quadril']],
  upper_toning_f:   [['Elevação Lateral','Rosca Alternada'],['Remada Unilateral','Tríceps Corda'],['Puxada Frente','Elevação Frontal']],
  full_body_f:      [['Hip Thrust','Abdução de Quadril'],['Agachamento','Remada Unilateral'],['Elevação Lateral','Prancha']],
  core_f:           [['Prancha','Elevação de Pernas'],['Oblíquo','Abdominal Bicicleta'],['Prancha Lateral','Elevação de Quadril']],
  // Mistos
  pernas_gluteos:   [['Leg Press','Hip Thrust'],['Extensão de Pernas','Flexão de Pernas'],['Agachamento','Agachamento Sumô'],['Stiff','Abdução de Quadril']],
  ombros_abdomen:   [['Desenvolvimento c/ Halteres','Prancha'],['Elevação Lateral','Abdominal Crunch'],['Arnold Press','Elevação de Pernas'],['Encolhimento de Ombros','Oblíquo']],
  ppl_legs:         [['Leg Press','Stiff'],['Extensão de Pernas','Flexão de Pernas'],['Agachamento','Hip Thrust'],['Hack Squat','Panturrilha em Pé']],
  full_body_a:      [['Supino Reto','Puxada Frente'],['Agachamento','Abdominal Crunch'],['Leg Press','Prancha']],
  full_body_b:      [['Rosca Direta','Tríceps Corda'],['Hip Thrust','Oblíquo'],['Desenvolvimento c/ Halteres','Elevação de Pernas']],
};

// Returns exercises with reps/sets adapted to the profile goal
function adaptExercisesToGoal(exercises, goal) {
  const config = GOAL_WORKOUT_CONFIG[goal] || GOAL_WORKOUT_CONFIG.maintain;
  return exercises.map(ex => {
    const pattern = config.repsPattern;
    const adaptedSets = Array.from({ length: config.sets }, (_, i) => ({
      reps: pattern[Math.min(i, pattern.length - 1)],
      weight: (ex.sets[i] || ex.sets[0] || {}).weight || 0,
    }));
    return { ...ex, sets: adaptedSets };
  });
}

// Builds a map of exerciseName -> supersetGroupIndex for the current template + goal
function buildSupersetMap(templateId, goal, exercises) {
  if (goal !== 'cut') return {};
  const pairs = SUPERSET_PAIRS[templateId] || [];
  const map = {}; // exName -> { group, slot: 'A'|'B' }
  const exNames = new Set(exercises.map(e => e.name));
  let groupIdx = 0;
  for (const [a, b] of pairs) {
    if (exNames.has(a) && exNames.has(b)) {
      map[a] = { group: groupIdx, slot: 'A' };
      map[b] = { group: groupIdx, slot: 'B' };
      groupIdx++;
    }
  }
  return map;
}

// Bloco único e compacto com objetivo + avisos (gravidez, lesões, idade).
// Substitui os 4 banners separados que antes se empilhavam no topo.
function renderWorkoutNotices() {
  const el = document.getElementById('workout-notices');
  if (!el) return;
  const profile = getProfile();
  if (!profile) { el.innerHTML = ''; return; }

  const rows = [];

  // ── Objetivo (contexto do treino) ──
  const gc = GOAL_WORKOUT_CONFIG[profile.goal];
  if (gc) {
    rows.push(`
      <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;font-size:0.72rem;">
        <span style="color:${gc.color};font-weight:800;">${gc.emoji} ${gc.label}</span>
        <span style="color:var(--muted);">·&nbsp;${gc.technique}</span>
        <span style="color:var(--muted);">·&nbsp;⏱ ${gc.rest}</span>
      </div>`);
  }

  // ── Gravidez ──
  if (isPregnant(profile)) {
    const tr = getPregnancyTrimester(profile);
    const trLabel = tr === 1 ? '1º' : tr === 2 ? '2º' : '3º';
    rows.push(`
      <div style="font-size:0.72rem;color:var(--muted);line-height:1.5;">
        <span style="color:#ff69b4;font-weight:800;">🤰 Gravidez · ${trLabel} trimestre</span>
        &nbsp;— evitar 🚫 · reduzir peso nos ⚠️
      </div>`);
  }

  // ── Lesões activas ──
  const hp = getHealthProfile();
  const injuries = HEALTH_INJURIES.filter(i => hp.injuries.includes(i.id));
  const customInjuries = hp.customInjuries || [];
  if (injuries.length || customInjuries.length) {
    const n = injuries.length + customInjuries.length;
    rows.push(`
      <details>
        <summary style="cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;font-size:0.72rem;color:var(--orange);font-weight:800;user-select:none;">
          <span>⚠️ Lesões activas (${n})</span>
          <span style="font-size:0.62rem;color:var(--muted);font-weight:400;">ver detalhes ▾</span>
        </summary>
        <div style="margin-top:8px;display:flex;flex-direction:column;gap:8px;">
          ${injuries.map(i => `
            <div>
              <div style="font-size:0.8rem;font-weight:700;">${i.icon} ${i.label}</div>
              <div style="font-size:0.72rem;color:var(--muted);margin-top:2px;line-height:1.4;">${i.note}</div>
              <div style="margin-top:4px;display:flex;flex-wrap:wrap;gap:4px;">
                ${i.avoid.map(e => `<span style="font-size:0.64rem;color:#ff4757;border:1px solid rgba(255,71,87,.3);border-radius:20px;padding:1px 7px;">⚠ ${e}</span>`).join('')}
              </div>
            </div>`).join('')}
          ${customInjuries.map(nm => `
            <div>
              <div style="font-size:0.8rem;font-weight:700;">🩹 ${nm}</div>
              <div style="font-size:0.72rem;color:var(--muted);margin-top:2px;">${t('workout_consult')}</div>
            </div>`).join('')}
        </div>
      </details>`);
  }

  // ── Idade (criança / idoso) — templates adaptados ──
  const ageCat = getAgeCategory(profile.age);
  if (ageCat !== 'adult') {
    const isChild   = ageCat === 'child';
    const templates = isChild ? CHILD_TEMPLATES : ELDERLY_TEMPLATES;
    const color     = isChild ? 'var(--pink)' : 'var(--cyan)';
    const title     = isChild ? t('workout_child_title') : t('workout_elderly_title');
    const subtitle  = isChild ? t('workout_child_desc') : t('workout_elderly_desc');
    rows.push(`
      <div>
        <div style="font-size:0.68rem;color:${color};font-weight:800;text-transform:uppercase;letter-spacing:.5px;">${title}</div>
        <div style="font-size:0.72rem;color:var(--muted);margin:2px 0 8px;">${subtitle}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${templates.map(tpl2 => `
            <div onclick="loadAgeTemplate('${tpl2.id}')"
              style="padding:7px 12px;background:${activeTemplateId===tpl2.id ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)'};border:1px solid ${activeTemplateId===tpl2.id ? color : 'var(--border)'};border-radius:9px;cursor:pointer;transition:all .2s;flex:1;min-width:110px;text-align:center;">
              <div style="font-size:0.78rem;font-weight:700;color:${activeTemplateId===tpl2.id ? color : 'var(--text)'};">${tpl2.label}</div>
              <div style="font-size:0.66rem;color:var(--muted);margin-top:1px;">${tpl2.exercises.length} ${t('exercises_label')}</div>
            </div>`).join('')}
        </div>
      </div>`);
  }

  if (!rows.length) { el.innerHTML = ''; return; }

  el.innerHTML = `
    <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:12px;
                padding:11px 14px;margin-bottom:14px;">
      ${rows.map((r, i) => `<div style="${i > 0 ? 'border-top:1px solid var(--border);margin-top:9px;padding-top:9px;' : ''}">${r}</div>`).join('')}
    </div>`;
}

// Muscles currently selected in the workout filter
let workoutSelectedMuscles = [];

function renderWorkout() {
  const profile = getProfile();
  if (!profile) return;

  const now = new Date();
  currentDay = now.getDay();
  const planMuscles = profile.weeklyPlan[currentDay] || [];

  document.getElementById('workout-day-label').textContent = _dayFull(currentDay);

  // Init selected muscles from plan (or keep existing selection)
  if (workoutSelectedMuscles.length === 0) {
    workoutSelectedMuscles = planMuscles.length > 0 ? [...planMuscles] : [];
  }

  renderWorkoutNotices();
  renderWorkoutTemplatePills();
  renderWorkoutMuscleChips(profile);
  renderExerciseBrowser(profile);
  renderWorkoutList();
  updateWorkoutSummary();
}

const MUSCLE_ICONS = {
  'Peito':'💪','Costas':'🔙','Pernas':'🦵','Ombros':'🏔️','Bíceps':'💪',
  'Tríceps':'🔱','Abdómen':'🎯','Glúteos':'🍑','Antebraços':'🤜',
  'Gémeos':'🦵','Trapézio':'🏋️','Adutores':'🦵','Alongamentos':'🤸',
};
function renderWorkoutMuscleChips(profile) {
  const filterEl = document.getElementById('workout-muscle-filter');
  if (workoutMode === 'stretch' || !_browserVisible) {
    filterEl.innerHTML = '';
    return;
  }
  // Section label
  const anySelected = workoutSelectedMuscles.length > 0;
  filterEl.innerHTML = `
    <div style="width:100%;font-size:0.62rem;color:var(--muted);font-weight:700;
                text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">
      ${t('muscle_groups_label')} ${anySelected ? `<span style="color:var(--orange);">(${workoutSelectedMuscles.length} selec.)</span>` : ''}
    </div>` +
  MUSCLES.map(m => {
    const sel = workoutSelectedMuscles.includes(m);
    const icon = MUSCLE_ICONS[m] || '●';
    return `<div onclick="toggleWorkoutMuscle('${m}')"
      style="display:flex;align-items:center;gap:5px;
             padding:7px 13px;border-radius:20px;font-size:0.8rem;font-weight:600;cursor:pointer;
             border:1px solid ${sel ? 'rgba(255,107,53,0.5)' : 'var(--border)'};
             background:${sel ? 'rgba(255,107,53,0.12)' : 'rgba(255,255,255,0.04)'};
             color:${sel ? 'var(--orange)' : 'var(--muted)'};
             transition:all .15s;
             box-shadow:${sel ? '0 0 12px rgba(255,107,53,0.15)' : 'none'};">
        ${tMuscle(m)}
      </div>`;
  }).join('');
}

function toggleWorkoutMuscle(muscle) {
  const idx = workoutSelectedMuscles.indexOf(muscle);
  if (idx >= 0) { workoutSelectedMuscles.splice(idx, 1); delete exSectionVisible[muscle]; }
  else workoutSelectedMuscles.push(muscle);
  const profile = getProfile();
  renderWorkoutMuscleChips(profile);
  renderExerciseBrowser(profile);
}

function toggleExBrowser() {
  _browserVisible = !_browserVisible;
  const profile = getProfile();
  renderWorkoutMuscleChips(profile);
  renderExerciseBrowser(profile);
  if (_browserVisible) {
    // Scroll para o browser ficar visível
    setTimeout(() => {
      const target = document.getElementById('workout-muscle-filter') || document.getElementById('workout-ex-browser');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }
}

function renderExerciseBrowser(profile) {
  const browser = document.getElementById('workout-ex-browser');

  // Quando browser está colapsado (há exercícios activos), mostra botão compacto
  if (!_browserVisible) {
    browser.innerHTML = '';
    return;
  }

  if (workoutSelectedMuscles.length === 0) {
    browser.innerHTML = `<div style="text-align:center; padding:20px; color:var(--muted); font-size:0.85rem;">
      ${t('workout_select_muscles')}
    </div>`;
    return;
  }

  const hp2 = getHealthProfile();
  const activeInjuries = HEALTH_INJURIES.filter(i => hp2.injuries.includes(i.id));
  const avoidSet = new Set(activeInjuries.flatMap(i => i.avoid));

  // Home mode equipment filter
  const isHomeMode = workoutMode === 'home';
  const homeEquipment = (profile && profile.homeEquipment) || [];

  const CARDS_STEP = 8; // cards shown per "Ver mais" click

  // Search filter
  const searchInputId = 'ex-browser-search';
  const _prevFocusedId = document.activeElement?.id;
  const currentSearch = ((document.getElementById(searchInputId) || {}).value || '').replace(/"/g, '&quot;');

  // Home mode: show banner if no equipment configured
  let homeBanner = '';
  if (isHomeMode) {
    const eqCount = homeEquipment.length;
    homeBanner = `<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;margin-bottom:10px;
                              border-radius:8px;background:rgba(255,107,53,0.07);border:1px solid rgba(255,107,53,0.2);">
      <span style="font-size:0.85rem;">🏠</span>
      <div style="flex:1;min-width:0;">
        <div style="font-size:0.72rem;color:var(--orange);font-weight:700;">
          ${eqCount === 0 ? t('workout_home_eq_body') : t('workout_home_eq_count').replace('{n}',eqCount).replace('{s}',eqCount>1?'s':'')}
        </div>
        <div style="font-size:0.62rem;color:var(--muted);margin-top:1px;">
          ${eqCount === 0 ? t('workout_home_eq_select') : t('workout_home_eq_showing')}
        </div>
      </div>
      <button onclick="document.getElementById('workout-equipment-picker').scrollIntoView({behavior:'smooth',block:'start'})"
        style="background:none;border:1px solid rgba(255,107,53,0.3);border-radius:6px;padding:4px 9px;
               color:var(--orange);font-size:0.68rem;font-weight:700;cursor:pointer;white-space:nowrap;">
        ${t('workout_home_eq_btn')}
      </button>
    </div>`;
  }

  const searchBar = `
    <div style="position:relative;margin-bottom:10px;">
      <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:0.85rem;pointer-events:none;">🔍</span>
      <input id="${searchInputId}" type="text" placeholder="${t('ex_search_ph')}" value="${currentSearch}"
        oninput="renderExerciseBrowser(getProfile())"
        style="width:100%;padding:8px 10px 8px 32px;background:rgba(255,255,255,0.05);border:1px solid var(--border);
               border-radius:10px;color:var(--text);font-size:0.82rem;outline:none;">
    </div>`;

  browser.innerHTML = homeBanner + searchBar + workoutSelectedMuscles.map(muscle => {
    const profile2 = getProfile();
    const custom = (profile2.customExercises || {})[muscle] || [];
    let allEx = [...(EXERCISE_LIBRARY[muscle] || []), ...custom];

    // In home mode: show ONLY exercises doable with configured equipment
    if (isHomeMode) {
      allEx = allEx.filter(name => canDoExercise(name, homeEquipment));
    }

    // Apply search filter
    const searchQ = (document.getElementById('ex-browser-search') || {}).value?.trim().toLowerCase() || '';
    const filteredEx = searchQ ? allEx.filter(n => n.toLowerCase().includes(searchQ)) : allEx;

    const visible = exSectionVisible[muscle] || CARDS_STEP;
    const shown = filteredEx.slice(0, searchQ ? filteredEx.length : visible);
    const hasMore = !searchQ && filteredEx.length > visible;

    const _pregnant = isPregnant(profile);
    const _trimester = getPregnancyTrimester(profile);

    const cards = shown.map(name => {
      const isAdded = !!workoutExercises.find(e => e.name === name);
      const isRisky = avoidSet.has(name);
      const safeName = name.replace(/'/g, "\\'");

      // Pregnancy warnings
      const pregWarn = _pregnant ? getPregnancyWarning(name, _trimester) : null;
      const pregAvoid = pregWarn && pregWarn.level === 'avoid';
      const pregCaution = pregWarn && pregWarn.level === 'caution';

      // Equipment availability (home mode only)
      const unavailable = isHomeMode && !canDoExercise(name, homeEquipment);
      const needed = unavailable ? (EXERCISE_EQ[name] || []) : [];
      const neededLabels = needed.map(id => {
        const eq = EQUIPMENT_LIST.find(e => e.id === id);
        return eq ? eq.label : id;
      }).join(', ');

      const riskyStyle = isRisky ? 'border-color:rgba(255,71,87,.5);background:rgba(255,71,87,.06);' : '';
      const pregAvoidStyle = pregAvoid ? 'border-color:rgba(255,105,180,0.5);background:rgba(255,105,180,0.06);opacity:0.7;' : '';
      const pregCautionStyle = pregCaution ? 'border-color:rgba(255,182,0,0.4);' : '';
      const unavailStyle = unavailable ? 'opacity:0.45;' : '';
      const riskyBadge = isRisky
        ? `<span style="font-size:0.62rem;color:#ff4757;background:rgba(255,71,87,.15);border:1px solid rgba(255,71,87,.3);border-radius:20px;padding:1px 7px;font-weight:700;margin-top:4px;display:inline-block;">${t('badge_injury')}</span>` : '';
      const pregBadge = pregAvoid
        ? `<span style="font-size:0.62rem;color:#ff69b4;background:rgba(255,105,180,.12);border:1px solid rgba(255,105,180,.35);border-radius:20px;padding:1px 7px;font-weight:700;margin-top:4px;display:inline-block;" title="${pregWarn.msg}">${t('badge_pregnancy')}</span>`
        : pregCaution
        ? `<span style="font-size:0.62rem;color:#f39c12;background:rgba(243,156,18,.1);border:1px solid rgba(243,156,18,.3);border-radius:20px;padding:1px 7px;font-weight:700;margin-top:4px;display:inline-block;" title="${pregWarn.msg}">${t('badge_modify')}</span>`
        : '';
      const eqBadge = unavailable
        ? `<span style="font-size:0.6rem;color:var(--muted);margin-top:3px;display:inline-block;">🔒 ${neededLabels}</span>` : '';

      return `<div class="ex-card ${isAdded ? 'added' : ''}"
        onclick="${unavailable ? '' : `toggleExerciseCard('${safeName}','${muscle}',this)`}"
        style="${riskyStyle}${pregAvoidStyle}${pregCautionStyle}${unavailStyle}${unavailable ? 'cursor:default;' : ''}">
        <div style="flex:1;min-width:0;">
          <div class="ex-card-name">${name}</div>
          <div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:2px;">${riskyBadge}${pregBadge}${eqBadge}</div>
          <a href="${ytUrl(name)}" target="_blank" rel="noopener" onclick="event.stopPropagation()"
            style="text-decoration:none;margin-top:3px;display:inline-flex;align-items:center;gap:4px;">
            <svg width="18" height="13" viewBox="0 0 18 13" xmlns="http://www.w3.org/2000/svg"><rect width="18" height="13" rx="3" fill="#FF0000"/><polygon points="7,3 7,10 13,6.5" fill="#fff"/></svg>
            <span style="font-size:0.68rem;color:var(--muted);">${t('workout_see_video')}</span>
          </a>
        </div>
        <span class="ex-card-btn ${isAdded ? '' : (unavailable ? '' : 'add')}">${isAdded ? '✔' : (unavailable ? '🔒' : '+')}</span>
      </div>`;
    }).join('');

    const addedCount = allEx.filter(name => workoutExercises.find(e => e.name === name)).length;
    const badge = addedCount > 0 ? `<span style="background:var(--orange);color:#fff;border-radius:20px;font-size:0.65rem;font-weight:800;padding:1px 7px;margin-left:6px;">${addedCount}</span>` : '';
    const remaining = filteredEx.length - visible;

    const isExpanded = visible > CARDS_STEP;
    const collapseBtn = isExpanded ? `
      <div style="text-align:center;margin-top:6px;">
        <button onclick="collapseExSection('${muscle}')"
          style="padding:5px 18px;border-radius:20px;font-size:0.75rem;font-weight:700;cursor:pointer;
                 border:1px solid var(--border);background:rgba(255,255,255,0.04);color:var(--muted);
                 transition:all .15s;" onmouseover="this.style.borderColor='var(--muted)';this.style.color='var(--text)'"
          onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--muted)'">
          ↑ Mostrar menos
        </button>
      </div>` : '';

    const verMaisHtml = hasMore ? `
      <div style="position:relative;margin-top:-48px;height:80px;background:linear-gradient(to bottom,transparent,var(--card) 70%);display:flex;align-items:flex-end;justify-content:center;padding-bottom:10px;pointer-events:none;"></div>
      <div style="text-align:center;margin-top:-10px;">
        <button onclick="expandExSection('${muscle}')"
          style="padding:6px 20px;border-radius:20px;font-size:0.78rem;font-weight:700;cursor:pointer;
                 border:1px solid var(--border);background:rgba(255,255,255,0.06);color:var(--text);
                 transition:all .15s;" onmouseover="this.style.borderColor='var(--orange)';this.style.color='var(--orange)'"
          onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text)'">
          ${t('show_more')} ${remaining > 0 ? `(+${Math.min(remaining, CARDS_STEP)})` : ''}
        </button>
      </div>${collapseBtn}` : collapseBtn;

    return `<div class="ex-browser-section">
      <div class="ex-browser-title" style="display:flex;align-items:center;justify-content:space-between;">
        <span>${muscle}${badge}</span>
        <span style="font-size:0.72rem;color:var(--muted);">${shown.length}/${filteredEx.length}${searchQ && filteredEx.length < allEx.length ? ` (de ${allEx.length})` : ''}</span>
      </div>
      <div class="ex-card-grid">${cards}</div>
      ${verMaisHtml}
    </div>`;
  }).join('');

  // Restore focus to search input after re-render (prevents losing focus on each keystroke)
  if (_prevFocusedId === searchInputId) {
    const searchEl = document.getElementById(searchInputId);
    if (searchEl) {
      searchEl.focus();
      searchEl.setSelectionRange(searchEl.value.length, searchEl.value.length);
    }
  }
}

function expandExSection(muscle) {
  const CARDS_STEP = 8;
  const profile2 = getProfile();
  const custom = (profile2.customExercises || {})[muscle] || [];
  const total = [...(EXERCISE_LIBRARY[muscle] || []), ...custom].length;
  exSectionVisible[muscle] = Math.min((exSectionVisible[muscle] || CARDS_STEP) + CARDS_STEP, total);
  renderExerciseBrowser(getProfile());
}

function collapseExSection(muscle) {
  const CARDS_STEP = 8;
  exSectionVisible[muscle] = CARDS_STEP;
  renderExerciseBrowser(getProfile());
}

// Insere o exercício logo a seguir ao último do mesmo grupo muscular
// (mantém os exercícios de tríceps juntos, peito juntos, etc.).
function insertExerciseGrouped(exObj) {
  let lastIdx = -1;
  for (let i = 0; i < workoutExercises.length; i++) {
    if (workoutExercises[i].muscle === exObj.muscle) lastIdx = i;
  }
  if (lastIdx < 0) { workoutExercises.push(exObj); return; }
  // não partir uma supersérie: avança até ao fim da cadeia ligada
  while (workoutExercises[lastIdx] && workoutExercises[lastIdx].linkNext) lastIdx++;
  workoutExercises.splice(lastIdx + 1, 0, exObj);
}

function toggleExerciseCard(name, muscle, cardEl) {
  const idx = workoutExercises.findIndex(e => e.name === name);
  if (idx >= 0) {
    workoutExercises.splice(idx, 1);
  } else {
    insertExerciseGrouped({ name, muscle, sets: [{ reps: 12, weight: 0 }] });
    if (!workoutSelectedMuscles.includes(muscle)) workoutSelectedMuscles.push(muscle);
  }
  // Re-renderiza o browser inteiro (garante que o estado ✔/+ está sempre
  // correto — evita o bug de "às vezes não consigo adicionar").
  const y = window.scrollY;
  renderExerciseBrowser(getProfile());
  renderWorkoutList();
  updateWorkoutSummary();
  window.scrollTo(0, y);
}

function updateWorkoutSummary() {
  const el = document.getElementById('workout-summary');
  const n = workoutExercises.length;
  const sets = workoutExercises.reduce((a, e) => a + e.sets.length, 0);
  el.textContent = n > 0 ? `${n} ${t('exercises_label')} · ${sets} ${t('sets_label')}` : t('workout_touch_add');
}

// ─── Exercise Picker ──────────────────────────────────
let _pickerMuscle = 'Peito';

function openExPicker() {
  _pickerMuscle = workoutSelectedMuscles[0] || Object.keys(EXERCISE_LIBRARY)[0];
  renderExPicker();
  openModal('modal-custom-ex');
}

function selectPickerMuscle(m) {
  _pickerMuscle = m;
  renderExPicker();
}

function renderExPicker() {
  const profile = getProfile();
  const custom = (profile.customExercises || {})[_pickerMuscle] || [];
  const exercises = [...(EXERCISE_LIBRARY[_pickerMuscle] || []), ...custom];
  const muscles = Object.keys(EXERCISE_LIBRARY);
  const hp = getHealthProfile();
  const activeInjuries = HEALTH_INJURIES.filter(i => hp.injuries.includes(i.id));
  const avoidSet = new Set(activeInjuries.flatMap(i => i.avoid));

  const chips = muscles.map(m => {
    const isActive = m === _pickerMuscle;
    return `<div onclick="selectPickerMuscle('${m}')"
      style="padding:6px 14px; border-radius:20px; font-size:0.8rem; font-weight:600; cursor:pointer; white-space:nowrap; border:1px solid ${isActive ? 'var(--orange)' : 'var(--border)'}; background:${isActive ? 'rgba(255,107,53,.15)' : 'rgba(255,255,255,.04)'}; color:${isActive ? 'var(--orange)' : 'var(--muted)'}; transition:all .15s;">${m}</div>`;
  }).join('');

  const exList = exercises.map(name => {
    const isAdded = !!workoutExercises.find(e => e.name === name);
    const isRisky = avoidSet.has(name);
    const safeName = name.replace(/'/g, "\\'");
    return `<div onclick="addExFromPicker('${safeName}','${_pickerMuscle}')"
      style="display:flex; justify-content:space-between; align-items:center; padding:11px 14px;
             background:${isAdded ? 'rgba(0,212,170,.07)' : 'rgba(255,255,255,.03)'};
             border:1px solid ${isAdded ? 'rgba(0,212,170,.3)' : isRisky ? 'rgba(255,71,87,.25)' : 'var(--border)'};
             border-radius:var(--radius-sm); cursor:pointer; transition:all .15s; margin-bottom:6px;">
      <div>
        <span style="font-size:0.88rem; font-weight:600; color:${isAdded ? 'var(--green)' : 'var(--text)'};">${name}</span>
        ${isRisky ? `<span style="margin-left:8px; font-size:0.65rem; color:#ff4757;">${t('workout_injury_badge')}</span>` : ''}
      </div>
      <span style="font-size:1rem; font-weight:700; color:${isAdded ? 'var(--green)' : 'var(--muted)'};">${isAdded ? '✔' : '+'}</span>
    </div>`;
  }).join('');

  document.getElementById('ex-picker-body').innerHTML = `
    <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:10px; margin-bottom:12px; scrollbar-width:none;">
      ${chips}
    </div>
    <div style="max-height:45vh; overflow-y:auto; margin-bottom:12px; padding-right:2px;">
      ${exList}
    </div>
    <div style="display:flex; gap:8px; align-items:center; border-top:1px solid var(--border); padding-top:12px;">
      <input id="custom-ex-name" type="text" placeholder="${t('workout_custom_ph')}"
        style="flex:1; background:rgba(255,255,255,.05); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text); padding:9px 12px; font-size:0.88rem; outline:none;">
      <button onclick="addCustomExFromPicker()"
        style="background:rgba(255,107,53,.15); color:var(--orange); border:1px solid rgba(255,107,53,.3); border-radius:var(--radius-sm); padding:9px 14px; cursor:pointer; font-weight:700; font-size:0.9rem; white-space:nowrap;">${t('btn_add')}</button>
    </div>`;
}

function addExFromPicker(name, muscle) {
  const idx = workoutExercises.findIndex(e => e.name === name);
  if (idx >= 0) {
    workoutExercises.splice(idx, 1);
  } else {
    const profile = getProfile();
    const goal = profile ? profile.goal : 'maintain';
    const config = GOAL_WORKOUT_CONFIG[goal] || GOAL_WORKOUT_CONFIG.maintain;
    const sets = Array.from({ length: config.sets }, (_, i) => ({
      reps: config.repsPattern[Math.min(i, config.repsPattern.length - 1)],
      weight: 0,
    }));
    insertExerciseGrouped({ name, muscle, sets });
    if (!workoutSelectedMuscles.includes(muscle)) workoutSelectedMuscles.push(muscle);
  }
  renderExPicker();
  renderWorkoutList();
  updateWorkoutSummary();
}

function addCustomExFromPicker() {
  const name = document.getElementById('custom-ex-name').value.trim();
  if (!name) { showToast(t('workout_touch_add')); return; }
  const muscle = _pickerMuscle;
  const profile = getProfile();
  if (!profile.customExercises) profile.customExercises = {};
  if (!profile.customExercises[muscle]) profile.customExercises[muscle] = [];
  if (!profile.customExercises[muscle].includes(name)) {
    profile.customExercises[muscle].push(name);
    saveProfile(profile);
  }
  document.getElementById('custom-ex-name').value = '';
  addExFromPicker(name, muscle);
  showToast('✔ ' + name + ' ' + t('link_created'));
}


// ─── Link types config ────────────────────────────────
const LINK_TYPES = {
  superset: { icon: '⚡', get label() { return t('link_superset'); }, color: '#00d4aa', get note() { return t('link_superset_note'); } },
  biset:    { icon: '🔁', get label() { return t('link_biset'); },    color: '#00aaff', get note() { return t('link_biset_note'); } },
  giant:    { icon: '💥', get label() { return t('link_giant'); },    color: '#b07dff', get note() { return t('link_giant_note'); } },
};
// Drop-set é técnica de exercício individual (ver toggleDropset)

let _linkSourceIdx = null;
let _linkSelectedType = 'superset';
let _linkTargetIdx = null;

function openLinkPicker(exIdx) {
  _linkSourceIdx = exIdx;
  _linkSelectedType = 'superset';
  _linkTargetIdx = null;
  renderLinkPicker();
  openModal('modal-link-picker');
}

function renderLinkPicker() {
  const src = workoutExercises[_linkSourceIdx];
  if (!src) return;

  document.getElementById('link-picker-title').textContent = 'Ligar: ' + src.name;

  // Type selector
  const typeChips = Object.entries(LINK_TYPES).map(([type, cfg]) => {
    const active = type === _linkSelectedType;
    return `<div onclick="selectLinkType('${type}')"
      style="padding:7px 14px; border-radius:20px; font-size:0.8rem; font-weight:700; cursor:pointer; white-space:nowrap;
             border:1px solid ${active ? cfg.color : 'var(--border)'};
             background:${active ? cfg.color + '22' : 'rgba(255,255,255,.04)'};
             color:${active ? cfg.color : 'var(--muted)'}; transition:all .15s;">
      ${cfg.icon} ${cfg.label}
    </div>`;
  }).join('');

  // Exercise list (all exercises except the source)
  const exList = workoutExercises.map((ex, i) => {
    if (i === _linkSourceIdx) return '';
    const isSelected = i === _linkTargetIdx;
    const cfg = LINK_TYPES[_linkSelectedType];
    return `<div onclick="selectLinkTarget(${i})"
      style="display:flex; justify-content:space-between; align-items:center; padding:11px 14px;
             background:${isSelected ? cfg.color + '15' : 'rgba(255,255,255,.03)'};
             border:1px solid ${isSelected ? cfg.color + '60' : 'var(--border)'};
             border-radius:var(--radius-sm); cursor:pointer; transition:all .15s; margin-bottom:6px;">
      <div>
        <span style="font-size:0.88rem; font-weight:600; color:${isSelected ? cfg.color : 'var(--text)'};">${ex.name}</span>
        <span style="font-size:0.72rem; color:var(--muted); margin-left:8px;">${tMuscle(ex.muscle)}</span>
      </div>
      <span style="font-size:1rem; color:${isSelected ? cfg.color : 'rgba(255,255,255,.15)'};">${isSelected ? '✔' : '○'}</span>
    </div>`;
  }).join('');

  const canConfirm = _linkTargetIdx !== null;
  const cfg = LINK_TYPES[_linkSelectedType];

  document.getElementById('link-picker-body').innerHTML = `
    <p style="font-size:0.78rem; color:var(--muted); margin-bottom:12px; line-height:1.5;">
      <strong style="color:var(--text);">${t('link_superset')}</strong> — ${t('link_superset_note')}<br>
      <strong style="color:var(--text);">${t('link_biset')}</strong> — ${t('link_biset_note')}<br>
      <strong style="color:var(--text);">${t('link_giant')}</strong> — ${t('link_giant_note')}
    </p>
    <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px;">${typeChips}</div>
    <div style="font-size:0.72rem; color:var(--muted); text-transform:uppercase; letter-spacing:.5px; font-weight:700; margin-bottom:8px;">${t('workout_pair_with')}</div>
    <div style="max-height:40vh; overflow-y:auto; margin-bottom:14px;">${exList || `<p style="color:var(--muted);font-size:0.85rem;">${t('workout_add_first')}</p>`}</div>
    <button onclick="confirmExerciseLink()" ${canConfirm ? '' : 'disabled'}
      style="width:100%; padding:12px; border-radius:var(--radius-sm); font-weight:700; font-size:0.9rem; cursor:${canConfirm ? 'pointer' : 'not-allowed'};
             border:none; background:${canConfirm ? 'linear-gradient(135deg,' + cfg.color + ',#0088aa)' : 'rgba(255,255,255,.08)'};
             color:${canConfirm ? '#fff' : 'var(--muted)'}; transition:all .2s;">
      ${cfg.icon} Criar ${cfg.label}
    </button>`;
}

function selectLinkType(type) {
  _linkSelectedType = type;
  renderLinkPicker();
}

function selectLinkTarget(idx) {
  _linkTargetIdx = _linkTargetIdx === idx ? null : idx;
  renderLinkPicker();
}

function confirmExerciseLink() {
  if (_linkTargetIdx === null || _linkSourceIdx === null) return;

  // Move target exercise to be right after source
  const src = _linkSourceIdx;
  let tgt = _linkTargetIdx;

  // Extract target exercise
  const [targetEx] = workoutExercises.splice(tgt, 1);

  // Recalculate source index after splice
  const newSrc = tgt < src ? src - 1 : src;

  // Insert target right after source
  workoutExercises.splice(newSrc + 1, 0, targetEx);

  // Set the link
  workoutExercises[newSrc].linkNext = _linkSelectedType;

  closeModal('modal-link-picker');
  renderWorkoutList();
  const cfg = LINK_TYPES[_linkSelectedType];
  showToast(cfg.icon + ' ' + cfg.label + ' ' + t('link_created'));
}

function removeExerciseLink(exIdx) {
  workoutExercises[exIdx].linkNext = null;
  renderWorkoutList();
}

function toggleDropset(exIdx) {
  workoutExercises[exIdx].dropset = !workoutExercises[exIdx].dropset;
  renderWorkoutList();
}

function renderWorkoutList() {
  const sessionEl = document.getElementById('workout-session');
  const el = document.getElementById('workout-ex-list');

  if (!workoutExercises.length) {
    sessionEl.style.display = 'none';
    return;
  }
  sessionEl.style.display = 'block';

  // Atualiza texto do botão de adicionar consoante estado do browser
  const addBtn = sessionEl.querySelector('button[onclick="toggleExBrowser()"]');
  if (addBtn) addBtn.textContent = _browserVisible ? t('ex_close_browser') : t('ex_open_browser');

  const profile = getProfile();
  const goal = profile ? profile.goal : 'maintain';
  const goalConfig = GOAL_WORKOUT_CONFIG[goal] || GOAL_WORKOUT_CONFIG.maintain;

  const cards = [];

  workoutExercises.forEach((ex, i) => {
    const link   = ex.linkNext;
    const lt     = link ? (LINK_TYPES[link] || LINK_TYPES.superset) : null;
    const prevLink = i > 0 ? workoutExercises[i - 1].linkNext : null;
    const prevLt   = prevLink ? (LINK_TYPES[prevLink] || LINK_TYPES.superset) : null;

    // ── Group wrapper: open when this is the first card in a chain ──
    const isGroupFirst = lt && !prevLt;
    const isGroupLast  = !lt && prevLt;
    const isGroupMid   = lt && prevLt;
    const inGroup      = prevLt || lt;   // inside a linked group
    const groupColor   = (lt || prevLt) ? (lt || prevLt).color : null;

    if (isGroupFirst) {
      cards.push(`
        <div style="border-radius:12px; border:1px solid ${groupColor}30;
                    border-left:3px solid ${groupColor};
                    overflow:hidden; margin-bottom:10px;
                    background:${groupColor}06;">`);
    }

    // ── Per-card computed values ─────────────────────────────────
    const vol = ex.sets.reduce((a, s) => a + (s.reps * s.weight), 0);
    const volBadge = vol > 0
      ? `<span style="font-size:0.75rem;color:var(--green);font-weight:700;">${vol}kg</span>` : '';
    const tip = getExTip(ex.name);
    const tipHtml = tip
      ? `<div style="border-left:2px solid rgba(255,215,0,.4);padding:6px 10px;margin-bottom:8px;font-size:0.78rem;color:var(--muted);line-height:1.5;">💡 ${tip}</div>` : '';

    const lastSetHint = workoutMode !== 'stretch' && goalConfig.techniqueHint ? goalConfig.techniqueHint(true) : null;
    const hintHtml = lastSetHint
      ? `<div style="border-left:2px solid ${goalConfig.border};padding:5px 10px;margin-bottom:8px;font-size:0.73rem;color:${goalConfig.color};line-height:1.4;">${lastSetHint}</div>` : '';

    // Pregnancy warning for this exercise
    const _pregWarnEx = isPregnant(profile) ? getPregnancyWarning(ex.name, getPregnancyTrimester(profile)) : null;
    const pregExHtml = _pregWarnEx ? `
      <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:10px;padding:8px 12px;
                  background:${_pregWarnEx.level==='avoid' ? 'rgba(255,105,180,0.08)' : 'rgba(243,156,18,0.08)'};
                  border:1px solid ${_pregWarnEx.level==='avoid' ? 'rgba(255,105,180,0.3)' : 'rgba(243,156,18,0.3)'};
                  border-radius:8px;border-left:3px solid ${_pregWarnEx.level==='avoid' ? '#ff69b4' : '#f39c12'};">
        <span style="font-size:0.9rem;flex-shrink:0;">${_pregWarnEx.level==='avoid' ? '🚫' : '⚠️'}</span>
        <div style="font-size:0.7rem;color:var(--muted);line-height:1.4;">${_pregWarnEx.msg}</div>
      </div>` : '';

    const dropsetHtml = ex.dropset ? `
      <div style="display:flex;align-items:center;gap:9px;margin-bottom:10px;padding:8px 12px;
                  background:rgba(255,107,53,0.08);border:1px solid rgba(255,107,53,0.28);
                  border-radius:8px;border-left:3px solid #ff6b35;">
        <span style="font-size:0.95rem;line-height:1;flex-shrink:0;">🔻</span>
        <div style="flex:1;min-width:0;">
          <div style="font-size:0.68rem;color:#ff6b35;font-weight:800;letter-spacing:0.07em;text-transform:uppercase;">${t('workout_dropset_active')}</div>
          <div style="font-size:0.61rem;color:var(--muted);margin-top:2px;line-height:1.4;">${t('workout_dropset_desc')}</div>
        </div>
      </div>` : '';

    // Rest note
    const restNote = workoutMode === 'stretch' ? t('workout_stretch_rest')
      : inGroup ? t('workout_no_pause')
      : goalConfig.restNote;
    const restColor = workoutMode === 'stretch' ? '#00d4aa'
      : inGroup ? groupColor
      : goalConfig.color;
    const restBadge = `<span style="font-size:0.66rem;color:${restColor};border:1px solid ${restColor}40;border-radius:20px;padding:1px 7px;font-weight:700;">⏱ ${restNote}</span>`;

    const isHome = workoutMode === 'home' || workoutMode === 'stretch';
    const rows = ex.sets.map((s, si) => {
      const isLast = si === ex.sets.length - 1;
      const techHint = workoutMode !== 'stretch' && goalConfig.techniqueHint ? goalConfig.techniqueHint(isLast) : null;
      const hintIcon = techHint && isLast
        ? `<span title="${techHint}" style="cursor:help;font-size:0.75rem;">💡</span>` : '';
      const prBadge = getPRBadge(profile, ex.name, s.weight, s.reps);
      return `<tr>
        <td style="color:var(--muted);font-size:0.8rem;">${si + 1}</td>
        <td><input type="number" value="${s.reps}" min="1" max="100" oninput="updateSet(${i},${si},'reps',+this.value)" placeholder="12"></td>
        ${isHome ? '' : `<td><input type="number" value="${s.weight}" min="0" step="0.5" oninput="updateSet(${i},${si},'weight',+this.value)" placeholder="0"></td>`}
        <td style="font-size:0.65rem;">${prBadge || hintIcon}</td>
        <td><button onclick="removeSet(${i},${si})" style="background:none;border:none;color:#ff4757;cursor:pointer;font-size:1rem;padding:2px 6px;">×</button></td>
      </tr>`;
    }).join('');

    // ── Card styling: transparent inside group, normal outside ───
    const cardStyle = inGroup
      ? `background:transparent;border:none;border-radius:0;margin-bottom:0;border-left:none;`
      : `border-left:2px solid rgba(255,107,53,.4);`;

    // Label shown at top of each card inside a group (except the first)
    const groupLabel = prevLt ? `
      <div style="display:inline-flex;align-items:center;gap:5px;margin-bottom:10px;
                  background:${prevLt.color}18;border:1px solid ${prevLt.color}40;
                  border-radius:6px;padding:4px 10px;">
        <span style="font-size:0.65rem;color:${prevLt.color};font-weight:800;letter-spacing:0.08em;text-transform:uppercase;">${prevLt.icon} ${prevLt.label}</span>
      </div>` : '';

    cards.push(`
      <div class="session-ex" style="${cardStyle}">
        ${groupLabel}
        <div class="session-ex-header">
          <div>
            <div class="session-ex-name">${ex.name}</div>
            <div style="display:flex;gap:6px;align-items:center;margin-top:3px;flex-wrap:wrap;">
              <span class="session-ex-muscle">${tMuscle(ex.muscle)}</span>
              ${restBadge}
              <a href="${ytUrl(ex.name)}" target="_blank" rel="noopener"
                style="text-decoration:none;display:inline-flex;align-items:center;gap:4px;">
                <svg width="18" height="13" viewBox="0 0 18 13" xmlns="http://www.w3.org/2000/svg"><rect width="18" height="13" rx="3" fill="#FF0000"/><polygon points="7,3 7,10 13,6.5" fill="#fff"/></svg>
                <span style="font-size:0.7rem;color:var(--muted);">${t('workout_see_video')}</span>
              </a>
            </div>
          </div>
          <div style="display:flex;gap:6px;align-items:center;">
            <button onclick="removeExercise(${i})"
              style="background:rgba(255,71,87,.1);color:#ff4757;border:1px solid rgba(255,71,87,.2);border-radius:6px;padding:5px 9px;cursor:pointer;font-size:0.8rem;">✕</button>
          </div>
        </div>
        ${pregExHtml}${dropsetHtml}${tipHtml}${hintHtml}
        ${workoutMode === 'home' ? `
        <div style="display:flex;align-items:center;gap:8px;margin:6px 0 8px;padding:7px 10px;background:rgba(255,255,255,0.04);border-radius:8px;">
          <span style="font-size:0.72rem;color:var(--muted);">${t('workout_weight_used')}</span>
          <input type="number" value="${ex.sets[0].weight || ''}" min="0" step="0.5" placeholder="0"
            oninput="setExerciseWeight(${i},+this.value)"
            style="width:62px;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:6px;color:var(--text);padding:5px 6px;font-size:0.88rem;font-weight:700;outline:none;text-align:center;">
          <span style="font-size:0.72rem;color:var(--muted);">kg</span>
          <span style="font-size:0.68rem;color:var(--muted);margin-left:2px;">${t('workout_all_series')}</span>
        </div>` : ''}
        <table class="sets-table">
          <thead><tr><th>${t('workout_series_col')}</th><th>${workoutMode==='stretch'?'Seg':'Reps'}</th>${isHome ? '' : '<th>Kg</th>'}<th></th><th></th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <textarea placeholder="📝 Notas (peso usado, sensações, ajustes...)"
          oninput="updateExNote(${i},this.value)"
          style="width:100%;margin-top:8px;margin-bottom:4px;background:rgba(255,255,255,0.03);border:1px solid var(--border);
                 border-radius:8px;color:var(--text);padding:8px 10px;font-size:0.78rem;outline:none;resize:none;
                 line-height:1.4;min-height:36px;"
          rows="1">${ex.note || ''}</textarea>
        <div style="display:flex;gap:6px;margin-top:4px;">
          <button onclick="addSetInline(${i})"
            style="flex:1;background:rgba(255,107,53,.08);color:var(--orange);border:1px dashed rgba(255,107,53,.3);border-radius:6px;padding:6px;cursor:pointer;font-size:0.8rem;font-weight:600;">
            ${t('workout_add_series')}
          </button>
          <button onclick="startRestTimer()"
            style="background:rgba(0,212,170,0.08);color:var(--green);border:1px solid rgba(0,212,170,0.25);
                   border-radius:6px;padding:6px 10px;cursor:pointer;font-size:0.78rem;font-weight:700;white-space:nowrap;">
            ⏱ ${t('dash_rest_label')}
          </button>
          <button onclick="toggleDropset(${i})"
            title="${ex.dropset ? 'Desativar drop-set' : 'Ativar drop-set'}"
            style="background:${ex.dropset ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.04)'};
                   color:${ex.dropset ? '#ff6b35' : 'var(--muted)'};
                   border:1px solid ${ex.dropset ? 'rgba(255,107,53,0.4)' : 'var(--border)'};
                   border-radius:6px;padding:6px 11px;cursor:pointer;font-size:0.78rem;font-weight:700;
                   white-space:nowrap;transition:all .15s;">
            🔻
          </button>
        </div>
      </div>`);

    // ── Connector strip (inside group) or "link" button (standalone) ──
    if (i < workoutExercises.length - 1) {
      if (lt) {
        // Separator strip between two linked cards — stays inside the group wrapper
        cards.push(`
          <div style="display:flex;align-items:center;gap:10px;
                      padding:9px 14px;
                      background:${lt.color}10;
                      border-top:1px solid ${lt.color}20;
                      border-bottom:1px solid ${lt.color}20;">
            <span style="font-size:1rem;line-height:1;flex-shrink:0;">${lt.icon}</span>
            <div style="flex:1;min-width:0;">
              <div style="font-size:0.68rem;color:${lt.color};font-weight:800;letter-spacing:0.08em;text-transform:uppercase;">${lt.label}</div>
              <div style="font-size:0.6rem;color:var(--muted);margin-top:1px;">${lt.note}</div>
            </div>
            <button onclick="removeExerciseLink(${i})" title="${t('remove_link')}"
              style="background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:6px;
                     color:var(--muted);cursor:pointer;font-size:0.68rem;padding:3px 8px;
                     line-height:1.4;opacity:.6;flex-shrink:0;transition:opacity .15s;"
              onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='.6'">✕</button>
          </div>`);
      } else {
        // No link — subtle "ligar" button between standalone cards
        cards.push(`
          <div style="display:flex;justify-content:center;margin:2px 0;">
            <button onclick="openLinkPicker(${i})"
              style="background:rgba(255,255,255,0.03);border:1px dashed rgba(255,255,255,0.12);
                     color:var(--muted);cursor:pointer;font-size:0.68rem;
                     padding:4px 16px;opacity:.65;transition:opacity .2s;letter-spacing:.3px;border-radius:20px;"
              onmouseover="this.style.opacity='1';this.style.borderColor='rgba(0,212,170,0.4)';this.style.color='var(--green)'"
              onmouseout="this.style.opacity='.65';this.style.borderColor='rgba(255,255,255,0.12)';this.style.color='var(--muted)'">
              ${t('workout_connect_btn')}
            </button>
          </div>`);
      }
    }

    // ── Group wrapper: close after the last card in a chain ─────
    if (isGroupLast) {
      cards.push(`</div>`);
    }
  });

  el.innerHTML = cards.join('') + `
    <button onclick="finishWorkout()"
      style="width:100%;margin-top:16px;padding:14px;background:linear-gradient(135deg,#00d4aa,#00b894);
             color:#fff;border:none;border-radius:12px;font-size:1rem;font-weight:800;cursor:pointer;
             letter-spacing:0.03em;box-shadow:0 4px 16px rgba(0,212,170,0.3);">
      ${t('workout_finish_btn')}
    </button>`;
  updateWorkoutSummary();
}


function updateExNote(exIdx, val) {
  workoutExercises[exIdx].note = val;
}

function updateSet(exIdx, setIdx, field, val) {
  workoutExercises[exIdx].sets[setIdx][field] = val;
  updateWorkoutSummary();
  const vol = workoutExercises[exIdx].sets.reduce((a, s) => a + (s.reps * s.weight), 0);
}

function setExerciseWeight(exIdx, weight) {
  workoutExercises[exIdx].sets.forEach(s => s.weight = weight);
}

function addSetInline(exIdx) {
  const last = workoutExercises[exIdx].sets.slice(-1)[0] || { reps: 12, weight: 0 };
  workoutExercises[exIdx].sets.push({ reps: last.reps, weight: last.weight });
  renderWorkoutList();
}

function removeSet(exIdx, setIdx) {
  workoutExercises[exIdx].sets.splice(setIdx, 1);
  renderWorkoutList();
}

function removeExercise(i) {
  const name = workoutExercises[i].name;
  workoutExercises.splice(i, 1);
  // Unmark card in browser if visible
  const profile = getProfile();
  renderExerciseBrowser(profile);
  renderWorkoutList();
  updateWorkoutSummary();
}

function openSetsModal(idx) {
  setsEditingIdx = idx;
  const ex = workoutExercises[idx];
  document.getElementById('sets-modal-title').textContent = ex.name;
  tempSets = ex.sets.length ? [...ex.sets.map(s => ({...s}))] : [{ reps: 12, weight: 0 }];
  renderSets();
  openModal('modal-sets');
}

function renderSets() {
  document.getElementById('sets-list').innerHTML = tempSets.map((s, i) => `
    <div class="sets-row">
      <span style="color:var(--muted); width:24px; font-size:0.8rem;">${i+1}.</span>
      <input type="number" value="${s.reps}" placeholder="Reps" oninput="tempSets[${i}].reps=+this.value" style="background:var(--card2);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text);padding:8px;font-size:0.9rem;width:70px;text-align:center;">
      <span class="sep">reps ×</span>
      <input type="number" value="${s.weight}" placeholder="kg" oninput="tempSets[${i}].weight=+this.value" style="background:var(--card2);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text);padding:8px;font-size:0.9rem;width:70px;text-align:center;">
      <span class="sep">kg</span>
      <button onclick="tempSets.splice(${i},1);renderSets();" style="background:rgba(255,71,87,.2);color:#ff4757;border:none;border-radius:var(--radius-sm);padding:6px 10px;cursor:pointer;">✕</button>
    </div>
  `).join('');
}

function addSet() {
  const last = tempSets[tempSets.length - 1] || { reps: 12, weight: 0 };
  tempSets.push({ reps: last.reps, weight: last.weight });
  renderSets();
}

function saveSets() {
  workoutExercises[setsEditingIdx].sets = [...tempSets];
  closeModal('modal-sets');
  renderWorkoutList();
  showToast(t('t_sets_saved'));
}

function finishWorkout() {
  if (!workoutExercises.length) { showToast(t('t_add_ex_first')); return; }
  const profile = getProfile();
  const entry = {
    date: new Date().toISOString(),
    day: currentDay,
    mode: workoutMode,
    templateId: activeTemplateId,
    muscles: [...workoutSelectedMuscles],
    exercises: workoutExercises.map(e => ({ name: e.name, muscle: e.muscle, sets: e.sets, note: e.note || '' }))
  };
  if (!profile.workoutHistory) profile.workoutHistory = [];
  profile.workoutHistory.unshift(entry);
  // keep last 100
  profile.workoutHistory = profile.workoutHistory.slice(0, 100);
  // Detect PRs
  const newPRs = updatePRs(profile, workoutExercises);
  saveProfile(profile);
  stopRestTimer();
  workoutExercises = [];
  workoutSelectedMuscles = [];
  activeTemplateId = null;
  _browserVisible = true;
  renderWorkoutList();
  renderDashboard();
  if (newPRs.length) {
    setTimeout(() => showToast(`${t('t_new_pr')} ${newPRs.slice(0,2).join(', ')}${newPRs.length>2?' ...':''}`), 800);
  }
  showToast(t('t_workout_done'));
  navigate('dashboard', document.querySelector('[data-screen="dashboard"]'));
}

// ═══════════════════════════════════════════════════════
//  HISTORY
// ═══════════════════════════════════════════════════════

function renderHistory() {
  const profile = getProfile();
  const history = profile.workoutHistory || [];
  const el = document.getElementById('history-list');
  renderHistoryCharts(profile);

  if (!history.length) {
    el.innerHTML = `<div class="empty"><div class="icon">📊</div><p>${t('hist_empty')}</p></div>`;
    return;
  }
  el.innerHTML = history.map((w, idx) => {
    const d = new Date(w.date);
    const muscles = [...new Set(w.exercises.map(e => e.muscle))];
    const totalSets = w.exercises.reduce((a, e) => a + e.sets.length, 0);
    const vol = w.exercises.reduce((a, e) => a + e.sets.reduce((b, s) => b + (s.reps * (s.weight || 0)), 0), 0);
    const volStr = vol > 0 ? ` · ${vol >= 1000 ? (vol/1000).toFixed(1)+'t' : vol+'kg'} vol.` : '';
    return `<div class="history-item" style="cursor:pointer;" onclick="openHistoryDetail(${idx})">
      <div style="flex:1;min-width:0;">
        <div style="font-weight:700;">${d.toLocaleDateString(_LOCALE_MAP[getLang()]||'pt-PT', {weekday:'long', day:'numeric', month:'short'})}</div>
        <div style="font-size:0.78rem; color:var(--muted); margin:4px 0;">${w.exercises.length} ${t('hist_exercises_unit')} · ${totalSets} ${t('hist_sets_unit')}${volStr}</div>
        <div class="chip-row" style="margin-top:6px;">${muscles.map(m => `<span class="badge badge-orange">${tMuscle(m)}</span>`).join('')}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0;">
        <div style="font-size:0.75rem;color:var(--muted);">${d.toLocaleTimeString('pt-PT', {hour:'2-digit', minute:'2-digit'})}</div>
        <button onclick="event.stopPropagation();openHistoryDetail(${idx})"
          style="padding:4px 12px;border-radius:16px;font-size:0.72rem;font-weight:700;cursor:pointer;
                 border:1px solid var(--border);background:rgba(255,255,255,0.05);color:var(--muted);white-space:nowrap;">
          Ver / Repetir
        </button>
      </div>
    </div>`;
  }).join('');
}

let _historyDetailIdx = 0;

function openHistoryDetail(idx) {
  _historyDetailIdx = idx;
  const profile = getProfile();
  const w = (profile.workoutHistory || [])[idx];
  if (!w) return;

  const d = new Date(w.date);
  document.getElementById('hd-title').textContent =
    d.toLocaleDateString(undefined, {weekday:'long', day:'numeric', month:'long', year:'numeric'});
  document.getElementById('hd-subtitle').textContent =
    `${d.toLocaleTimeString(undefined, {hour:'2-digit', minute:'2-digit'})} · ${t('hist_date_exercises').replace('{n}', w.exercises.length)}`;

  document.getElementById('hd-exercises').innerHTML = w.exercises.map(ex => {
    const setsHtml = ex.sets.map((s, si) => {
      const weightStr = s.weight > 0 ? ` @ ${s.weight}kg` : '';
      return `<span style="font-size:0.72rem;background:rgba(255,255,255,0.06);border-radius:6px;padding:2px 8px;white-space:nowrap;">
        S${si+1}: ${s.reps}rep${weightStr}
      </span>`;
    }).join('');
    return `<div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:11px 13px;border:1px solid var(--border);">
      <div style="font-weight:700;font-size:0.88rem;margin-bottom:7px;">${ex.name}</div>
      <div style="display:flex;flex-wrap:wrap;gap:5px;">${setsHtml}</div>
    </div>`;
  }).join('');

  openModal('modal-history-detail');
}

function repeatWorkout() {
  const profile = getProfile();
  const w = (profile.workoutHistory || [])[_historyDetailIdx];
  if (!w) return;

  workoutExercises = w.exercises.map(e => ({
    name: e.name,
    muscle: e.muscle,
    sets: e.sets.map(s => ({ ...s }))
  }));
  workoutSelectedMuscles = [...new Set(w.exercises.map(e => e.muscle))];

  // Infer mode: saved field → template flag → muscle group → default gym
  let inferredMode = w.mode;
  if (!inferredMode && w.templateId) {
    const tpl = WORKOUT_TEMPLATES.find(t => t.id === w.templateId);
    if (tpl && tpl.stretch) inferredMode = 'stretch';
    else if (tpl && tpl.home) inferredMode = 'home';
  }
  if (!inferredMode && w.exercises.every(e => e.muscle === 'Alongamentos')) inferredMode = 'stretch';
  workoutMode = inferredMode || 'gym';
  activeTemplateId = w.templateId || null;

  closeModal('modal-history-detail');
  renderWorkoutTemplatePills();
  renderWorkoutMuscleChips(profile);
  renderExerciseBrowser(profile);
  renderWorkoutList();
  updateWorkoutSummary();
  navigate('workout', document.querySelector('[data-screen="workout"]'));
  showToast(t('t_workout_loaded'));
}

// ═══════════════════════════════════════════════════════
//  HEALTH PROFILE
// ═══════════════════════════════════════════════════════

const HEALTH_ALLERGIES = [
  { id: 'lactose',   label: 'Lactose',        icon: '🥛', keywords: ['leite', 'iogurte', 'queijo', 'whey', 'requeijão', 'manteiga', 'natas'] },
  { id: 'gluten',    label: 'Glúten',          icon: '🌾', keywords: ['pão', 'torrada', 'massa', 'aveia', 'granola', 'wrap', 'crepioca', 'farinha', 'tosta'] },
  { id: 'egg',       label: 'Ovo',             icon: '🥚', keywords: ['ovo', 'ovos', 'clara', 'omelete', 'panqueca'] },
  { id: 'fish',      label: 'Peixe',           icon: '🐟', keywords: ['peixe', 'atum', 'bacalhau', 'salmão', 'pescada', 'sardinha', 'dourada', 'robalo'] },
  { id: 'shellfish', label: 'Marisco',         icon: '🦐', keywords: ['marisco', 'camarão', 'amêijoa'] },
  { id: 'nuts',      label: 'Frutos secos',    icon: '🌰', keywords: ['noz', 'nozes', 'amêndoa', 'amêndoas', 'oleaginosa', 'oleaginosas', 'frutos secos', 'pistácio', 'caju', 'avelã'] },
  { id: 'peanut',    label: 'Amendoim',        icon: '🥜', keywords: ['amendoim', 'pasta de amendoim', 'manteiga de amendoim'] },
  { id: 'soy',       label: 'Soja',            icon: '🫘', keywords: ['soja', 'tofu', 'edamame'] },
];

const HEALTH_CONDITIONS = [
  // Metabólicas / Endócrinas
  { id: 'diabetes',      label: 'Diabetes tipo 2',              icon: '🩸' },
  { id: 'diabetes1',     label: 'Diabetes tipo 1',              icon: '🩸' },
  { id: 'prediabetes',   label: 'Pré-diabetes / Resistência à insulina', icon: '🩸' },
  { id: 'hypothyroid',   label: 'Hipotiroidismo',               icon: '🦋' },
  { id: 'hyperthyroid',  label: 'Hipertiroidismo',              icon: '🦋' },
  { id: 'metabolic',     label: 'Síndrome metabólica',          icon: '⚖️' },
  { id: 'pcos',          label: 'Síndrome ovários poliquísticos', icon: '🌸' },
  { id: 'menopause',     label: 'Menopausa',                    icon: '🌸' },
  // Cardiovasculares
  { id: 'hypertension',  label: 'Hipertensão',                  icon: '💓' },
  { id: 'heart',         label: 'Doença cardíaca / Coronária',  icon: '🫀' },
  { id: 'arrhythmia',    label: 'Arritmia cardíaca',            icon: '🫀' },
  { id: 'cholesterol',   label: 'Colesterol / Dislipidemia',    icon: '⚠️' },
  { id: 'thrombosis',    label: 'Trombose / Coagulação',        icon: '🩹' },
  { id: 'varicose',      label: 'Varizes / Insuficiência venosa', icon: '🦵' },
  { id: 'stroke',        label: 'AVC (histórico)',              icon: '🧠' },
  // Respiratórias
  { id: 'copd',          label: 'DPOC / Bronquite crónica',     icon: '🫁' },
  { id: 'asthma',        label: 'Asma',                         icon: '🫁' },
  // Músculo-esqueléticas
  { id: 'osteoporosis',  label: 'Osteoporose',                  icon: '🦴' },
  { id: 'osteopenia',    label: 'Osteopenia',                   icon: '🦴' },
  { id: 'arthritis',     label: 'Artrite / Artrose',            icon: '🦴' },
  { id: 'fibromyalgia',  label: 'Fibromialgia',                 icon: '🤕' },
  { id: 'spondylitis',   label: 'Espondilite anquilosante',     icon: '🔙' },
  { id: 'tendinitis',    label: 'Tendinite crónica',            icon: '🩹' },
  { id: 'carpal',        label: 'Síndrome túnel cárpico',       icon: '🖐️' },
  // Digestivas
  { id: 'reflux',        label: 'Refluxo / Gastrite',           icon: '🔥' },
  { id: 'ibs',           label: 'Síndrome intestino irritável', icon: '🫃' },
  { id: 'crohn',         label: 'Doença de Crohn / Colite',     icon: '🫃' },
  { id: 'celiac',        label: 'Doença celíaca',               icon: '🌾' },
  // Renais
  { id: 'renal',         label: 'Doença renal crónica',         icon: '🫘' },
  { id: 'gout',          label: 'Gota',                         icon: '🦶' },
  // Neurológicas / Psicológicas
  { id: 'depression',    label: 'Depressão / Ansiedade',        icon: '🧠' },
  { id: 'epilepsy',      label: 'Epilepsia',                    icon: '⚡' },
  { id: 'parkinson',     label: 'Parkinson',                    icon: '🤲' },
  { id: 'ms',            label: 'Esclerose múltipla',           icon: '🧠' },
  { id: 'neuropathy',    label: 'Neuropatia periférica',        icon: '⚡' },
  // Imunológicas / Oncológicas
  { id: 'autoimmune',    label: 'Lúpus / Doenças autoimunes',   icon: '🛡️' },
  { id: 'cancer',        label: 'Cancro (em tratamento)',       icon: '🎗️' },
  { id: 'anemia',        label: 'Anemia',                       icon: '🩸' },
];

// Extended autocomplete list for the custom condition input
const CONDITION_SUGGESTIONS = [
  'Acne', 'Alcoolismo', 'Alergia alimentar', 'Alzheimer', 'Amiloidose',
  'Angina', 'Artrite psoriásica', 'Artrite reumatoide', 'Artrose da anca',
  'Artrose do joelho', 'Aterosclerose', 'Baixa densidade óssea',
  'Bursite', 'Cardiopatia congénita', 'Cifose', 'Cirrose hepática',
  'Colecistite', 'Colelitíase (pedras na vesícula)', 'Condromalácia patelar',
  'Contractura muscular crónica', 'Deficiência vitamina D', 'Disfunção eréctil',
  'Dismenorreia', 'Dislexia', 'Distúrbio bipolar', 'Doença de Graves',
  'Doença de Huntington', 'Doença de Paget', 'Doença inflamatória pélvica',
  'Doença pulmonar', 'Doença venosa crónica', 'Eczema / Dermatite atópica',
  'Endometriose', 'Enxaqueca crónica', 'Escoliose', 'Estenose espinhal',
  'Fadiga crónica', 'Fasciite plantar', 'Febre reumática',
  'Fibrilação auricular', 'Fissura / Hérnia discal', 'Flatpés',
  'Glaucoma', 'Hemocromatose', 'Hemofilia', 'Hérnia abdominal',
  'Hérnia de hiato', 'Hipercolesterolemia familiar', 'Hipoglicemia',
  'Hipotiroidismo subclínico', 'HIV / Imunossupressão', 'Hipermobilidade articular',
  'Incontinência urinária', 'Insónia crónica', 'Insuficiência cardíaca',
  'Insuficiência renal', 'Insuficiência venosa', 'Labirintite',
  'Lesão cerebral adquirida', 'Leucemia', 'Linfoma', 'Lordose excessiva',
  'Miastenia gravis', 'Migrânea', 'Miopatia', 'Nefrite', 'Obesidade mórbida',
  'Osteoartrite', 'Pancreatite', 'Paralisia cerebral', 'Pé diabético',
  'Pericardite', 'Periartrite', 'Pielonefrite', 'Pleurisia', 'Pneumonia crónica',
  'Policitemia', 'Poliomielite (sequelas)', 'Prolapso de válvula mitral',
  'Prostatite', 'Psoríase', 'PTSD', 'Rosácea', 'Ruptura do manguito rotador',
  'Sarcopenia', 'Síndrome de Cushing', 'Síndrome de fadiga crónica',
  'Síndrome de Marfan', 'Síndrome de Raynaud', 'Síndrome pós-COVID',
  'Sinovite', 'Talassemia', 'Tendinose', 'Tiroidite de Hashimoto',
  'Transtorno alimentar', 'Tremor essencial', 'Trombocitopenia',
  'Úlcera péptica', 'Vasculite', 'Vitiligo',
];

const HEALTH_INJURIES = [
  // Membros inferiores
  { id: 'knee',          label: 'Joelho',                   icon: '🦵',
    avoid: ['Agachamento','Leg Press','Avanço','Hack Squat','Extensão de Pernas','Agachamento Sumô'],
    note: 'Evita flexão profunda do joelho. Prefere leg press com amplitude reduzida e exercícios em cadeia aberta.' },
  { id: 'meniscus',      label: 'Menisco',                  icon: '🦵',
    avoid: ['Agachamento','Leg Press','Avanço','Hack Squat','Extensão de Pernas','Flexão de Pernas','Agachamento Sumô'],
    note: 'Evita rotação do joelho sob carga e impacto. Prefere exercícios de baixo impacto e fortalecimento do quadríceps em cadeia fechada.' },
  { id: 'ligament_knee', label: 'Ligamento do Joelho (LCA/LCP)', icon: '🩹',
    avoid: ['Agachamento','Leg Press','Avanço','Hack Squat','Extensão de Pernas','Flexão de Pernas'],
    note: 'Evita instabilidade e rotação do joelho. O retorno ao treino deve ser supervisionado por fisioterapeuta após reabilitação completa.' },
  { id: 'ankle',         label: 'Tornozelo',                icon: '🦶',
    avoid: ['Panturrilha em Pé','Agachamento','Avanço','Stiff'],
    note: 'Evita impacto e instabilidade. Prefere exercícios sentado ou com apoio.' },
  { id: 'achilles',      label: 'Tendão de Aquiles',        icon: '🦶',
    avoid: ['Panturrilha em Pé','Agachamento','Avanço','Stiff','Leg Press','Passada','Agachamento Sumô'],
    note: 'Evita carga excêntrica intensa no gémeo e solear. Sem saltos, sprint ou subidas. Recomendado reforço isométrico supervisionado por fisioterapeuta.' },
  { id: 'plantar',       label: 'Fasceíte Plantar',         icon: '🦶',
    avoid: ['Panturrilha em Pé','Agachamento','Avanço','Passada','Stiff'],
    note: 'Evita estar em pé prolongado e impacto no pé. Usa calçado com suporte e faz alongamentos da fáscia plantar.' },
  { id: 'shin_splints',  label: 'Canelite (Periostite)',    icon: '🦴',
    avoid: ['Avanço','Passada','Agachamento','Panturrilha em Pé'],
    note: 'Evita impacto e treino de alta intensidade nas pernas. Repouso e progressão gradual são essenciais.' },
  { id: 'hip',           label: 'Anca / Quadril',           icon: '🩻',
    avoid: ['Hip Thrust','Agachamento Sumô','Agachamento','Avanço','Leg Press','Abdução de Quadril'],
    note: 'Evita flexão profunda da anca. Consulta um fisioterapeuta antes de retomar estes movimentos.' },
  { id: 'groin',         label: 'Virilha / Adutor',         icon: '🩻',
    avoid: ['Agachamento Sumô','Abdução de Quadril','Cadeira Adutora','Leg Press','Avanço'],
    note: 'Evita abdução e adução forçada da perna. Fortalece a musculatura adutora de forma progressiva.' },
  { id: 'hamstring',     label: 'Isquiotibiais',            icon: '🦵',
    avoid: ['Stiff','Flexão de Pernas','Levantamento Terra','Avanço','Passada'],
    note: 'Evita alongamento brusco ou carga excessiva nos isquiotibiais. Progressão lenta e aquecimento adequado.' },
  // Coluna
  { id: 'back',          label: 'Coluna Lombar',            icon: '🔙',
    avoid: ['Levantamento Terra','Remada Curvada','Agachamento','Stiff','Hack Squat','Remada Unilateral'],
    note: 'Evita cargas axiais na coluna. Prioriza exercícios deitado ou com apoio lombar. Reforça o core.' },
  { id: 'disc',          label: 'Hérnia Discal',            icon: '🔙',
    avoid: ['Levantamento Terra','Remada Curvada','Agachamento','Stiff','Hack Squat','Desenvolvimento c/ Barra','Remada Unilateral'],
    note: 'Evita flexão e rotação da coluna sob carga. Prioriza exercícios em decúbito com coluna neutra. Supervisão médica obrigatória.' },
  { id: 'neck',          label: 'Cervical / Pescoço',       icon: '🫀',
    avoid: ['Puxada Frente','Desenvolvimento c/ Barra','Encolhimento de Ombros'],
    note: 'Evita tensão no pescoço. Mantém a cabeça neutra em todos os exercícios.' },
  { id: 'scoliosis',     label: 'Escoliose',                icon: '🔙',
    avoid: ['Levantamento Terra','Agachamento','Hack Squat','Desenvolvimento c/ Barra'],
    note: 'Evita cargas axiais assimétricas. Reforça musculatura paravertebral de forma bilateral e equilibrada.' },
  // Membros superiores
  { id: 'shoulder',      label: 'Ombro',                    icon: '🦾',
    avoid: ['Desenvolvimento c/ Barra','Desenvolvimento c/ Halteres','Arnold Press','Elevação Lateral','Elevação Frontal','Supino Inclinado'],
    note: 'Evita movimentos overhead com carga. Consulta um fisioterapeuta antes de progredir.' },
  { id: 'rotator_cuff',  label: 'Coifa dos Rotadores',      icon: '🦾',
    avoid: ['Desenvolvimento c/ Barra','Desenvolvimento c/ Halteres','Arnold Press','Elevação Lateral','Elevação Frontal','Supino Inclinado','Puxada Frente','Pull Over'],
    note: 'Evita rotação interna forçada e movimentos overhead. Reabilitação com exercícios de rotação externa a baixa carga é fundamental.' },
  { id: 'elbow',         label: 'Cotovelo',                 icon: '💪',
    avoid: ['Rosca Direta','Rosca Alternada','Extensão Testa','Tríceps Francês','Rosca 21','Tríceps Polia Alta'],
    note: 'Reduz carga e amplitude nos exercícios de flexão/extensão do cotovelo.' },
  { id: 'epicondylitis', label: 'Epicondilite (Cotovelo de Tenista)', icon: '🎾',
    avoid: ['Rosca Direta','Rosca Alternada','Rosca Martelo','Remada Curvada','Remada Unilateral','Extensão Testa'],
    note: 'Evita movimentos de supinação/pronação do antebraço com carga. Gelo após treino e exercícios excêntricos supervisionados.' },
  { id: 'wrist',         label: 'Pulso / Mão',              icon: '🖐️',
    avoid: ['Rosca Direta','Supino Reto','Remada Curvada','Extensão Testa','Tríceps Francês'],
    note: 'Usa suporte de pulso quando necessário. Evita extensão forçada do pulso.' },
  { id: 'carpal',        label: 'Síndrome do Túnel Cárpico', icon: '🖐️',
    avoid: ['Rosca Direta','Supino Reto','Remada Curvada','Pull-down com Corda','Tríceps Corda'],
    note: 'Evita flexão prolongada do pulso e pressão no canal cárpico. Usa acessórios ergonómicos e faz pausas frequentes.' },
  // Outros
  { id: 'osteoporosis',  label: 'Osteoporose',              icon: '🦴',
    avoid: ['Levantamento Terra','Agachamento','Hack Squat','Stiff'],
    note: 'Evita impacto excessivo e risco de queda. Prefere exercícios de carga moderada e resistência para estimular a densidade óssea.' },
  { id: 'fibromyalgia',  label: 'Fibromialgia',             icon: '🩺',
    avoid: ['Levantamento Terra','Hack Squat','Agachamento','Desenvolvimento c/ Barra'],
    note: 'Treina com baixa intensidade e volume reduzido. Prioriza mobilidade, alongamento e recuperação. Evita sobrecarregar nos dias de maior dor.' },
  { id: 'bursitis',      label: 'Bursite',                  icon: '🩺',
    avoid: ['Desenvolvimento c/ Halteres','Elevação Lateral','Arnold Press','Hip Thrust','Agachamento'],
    note: 'Evita compressão e atrito na articulação afetada. Repouso relativo e gelo na fase aguda.' },
  { id: 'tendinitis',    label: 'Tendinite (geral)',        icon: '🩹',
    avoid: ['Levantamento Terra','Remada Curvada','Rosca Direta','Desenvolvimento c/ Barra'],
    note: 'Evita movimentos repetitivos com carga na área afetada. Reduz o volume de treino e aplica protocolo excêntrico após fase aguda.' },
];

// Supplement translations lookup (keyed by PT name)
const SUPP_T = {
  'Whey Protein':{
    en_name:'Whey Protein',en_desc:'Fast-absorbing whey protein. Ideal post-workout.',en_dose:'25–30g after workout',
    es_name:'Proteína Whey',es_desc:'Proteína de suero de rápida absorción. Ideal post-entreno.',es_dose:'25–30g después del entreno',
    fr_name:'Whey Protéine',fr_desc:"Protéine de lactosérum à absorption rapide. Idéal après l'entraînement.",fr_dose:"25–30g après l'entraînement",
    ru_name:'Протеин Whey',ru_desc:'Быстроусвояемый сывороточный протеин. Идеален после тренировки.',ru_dose:'25–30г после тренировки'},
  'Creatina Monohidratada':{
    en_name:'Creatine Monohydrate',en_desc:'Increases strength and performance in high-intensity exercises.',en_dose:'3–5g/day with water',
    es_name:'Creatina Monohidrato',es_desc:'Aumenta la fuerza y el rendimiento en ejercicios de alta intensidad.',es_dose:'3–5g/día con agua',
    fr_name:'Créatine Monohydrate',fr_desc:"Augmente la force et les performances lors d'exercices intenses.",fr_dose:"3–5g/jour avec de l'eau",
    ru_name:'Моногидрат Креатина',ru_desc:'Повышает силу и производительность при высокоинтенсивных упражнениях.',ru_dose:'3–5г/день с водой'},
  'Ómega-3':{
    en_name:'Omega-3',en_desc:'Anti-inflammatory, improves recovery and cardiovascular health.',en_dose:'2–3g/day with meals',
    es_name:'Omega-3',es_desc:'Antiinflamatorio, mejora la recuperación y la salud cardiovascular.',es_dose:'2–3g/día con comidas',
    fr_name:'Oméga-3',fr_desc:'Anti-inflammatoire, améliore la récupération et la santé cardiovasculaire.',fr_dose:'2–3g/jour avec les repas',
    ru_name:'Омега-3',ru_desc:'Противовоспалительное, улучшает восстановление и здоровье сердечно-сосудистой системы.',ru_dose:'2–3г/день с едой'},
  'Cafeína / Pré-treino':{
    en_name:'Caffeine / Pre-workout',en_desc:'Increases energy and fat oxidation.',en_dose:'200mg before workout (max. 400mg/day)',
    es_name:'Cafeína / Pre-entreno',es_desc:'Aumenta la energía y la oxidación de grasa.',es_dose:'200mg antes del entreno (máx. 400mg/día)',
    fr_name:"Caféine / Pré-entraînement",fr_desc:"Augmente l'énergie et l'oxydation des graisses.",fr_dose:"200mg avant l'entraînement (max. 400mg/jour)",
    ru_name:'Кофеин / Предтрен',ru_desc:'Повышает энергию и окисление жиров.',ru_dose:'200мг до тренировки (макс. 400мг/день)'},
  'L-Carnitina':{
    en_name:'L-Carnitine',en_desc:'Helps transport fat as energy.',en_dose:'1–2g before workout',
    es_name:'L-Carnitina',es_desc:'Ayuda en el transporte de grasa como energía.',es_dose:'1–2g antes del entreno',
    fr_name:'L-Carnitine',fr_desc:"Aide à transporter les graisses comme source d'énergie.",fr_dose:"1–2g avant l'entraînement",
    ru_name:'Л-Карнитин',ru_desc:'Помогает транспортировать жир как источник энергии.',ru_dose:'1–2г до тренировки'},
  'Hipercalórico (Mass Gainer)':{
    en_name:'Mass Gainer',en_desc:'Rich in carbohydrates and proteins.',en_dose:'1–2 servings/day',
    es_name:'Mass Gainer',es_desc:'Rico en carbohidratos y proteínas.',es_dose:'1–2 dosis/día',
    fr_name:'Mass Gainer',fr_desc:'Riche en glucides et en protéines.',fr_dose:'1–2 doses/jour',
    ru_name:'Гейнер',ru_desc:'Богат углеводами и белками.',ru_dose:'1–2 порции/день'},
  'Beta-Alanina':{
    en_name:'Beta-Alanine',en_desc:'Reduces muscle fatigue in intense workouts.',en_dose:'3–5g before workout',
    es_name:'Beta-Alanina',es_desc:'Reduce la fatiga muscular en entrenamientos intensos.',es_dose:'3–5g antes del entreno',
    fr_name:'Bêta-Alanine',fr_desc:"Réduit la fatigue musculaire lors des entraînements intenses.",fr_dose:"3–5g avant l'entraînement",
    ru_name:'Бета-Аланин',ru_desc:'Снижает мышечную усталость при интенсивных тренировках.',ru_dose:'3–5г до тренировки'},
  'BCAA':{
    en_name:'BCAA',en_desc:'Reduces catabolism and aids recovery.',en_dose:'5–10g pre or post-workout',
    es_name:'BCAA',es_desc:'Reduce el catabolismo y ayuda en la recuperación.',es_dose:'5–10g pre o post-entreno',
    fr_name:'BCAA',fr_desc:"Réduit le catabolisme et favorise la récupération.",fr_dose:"5–10g avant ou après l'entraînement",
    ru_name:'BCAA',ru_desc:'Снижает катаболизм и помогает восстановлению.',ru_dose:'5–10г до или после тренировки'},
  'Vitamina D3':{
    en_name:'Vitamin D3',en_desc:'Essential for calcium absorption and immune function.',en_dose:'1000–2000 IU/day with meal',
    es_name:'Vitamina D3',es_desc:'Esencial para la absorción de calcio e inmunidad.',es_dose:'1000–2000 UI/día con comida',
    fr_name:'Vitamine D3',fr_desc:"Essentielle pour l'absorption du calcium et l'immunité.",fr_dose:'1000–2000 UI/jour avec un repas',
    ru_name:'Витамин D3',ru_desc:'Необходим для усвоения кальция и иммунитета.',ru_dose:'1000–2000 МЕ/день с едой'},
  'Cálcio':{
    en_name:'Calcium',en_desc:'Prevents bone mass loss and fractures.',en_dose:'500–1000mg/day with meal',
    es_name:'Calcio',es_desc:'Previene la pérdida de masa ósea y fracturas.',es_dose:'500–1000mg/día con comida',
    fr_name:'Calcium',fr_desc:'Prévient la perte de masse osseuse et les fractures.',fr_dose:'500–1000mg/jour avec un repas',
    ru_name:'Кальций',ru_desc:'Предотвращает потерю костной массы и переломы.',ru_dose:'500–1000мг/день с едой'},
  'Ómega-3 (extra)':{
    en_name:'Omega-3 (extra)',en_desc:'Relevant anti-inflammatory effect for joints.',en_dose:'2–4g/day with meals',
    es_name:'Omega-3 (extra)',es_desc:'Efecto antiinflamatorio relevante para las articulaciones.',es_dose:'2–4g/día con comidas',
    fr_name:'Oméga-3 (extra)',fr_desc:'Effet anti-inflammatoire pertinent pour les articulations.',fr_dose:'2–4g/jour avec les repas',
    ru_name:'Омега-3 (доп.)',ru_desc:'Выраженный противовоспалительный эффект для суставов.',ru_dose:'2–4г/день с едой'},
  'Glucosamina + Condroitina':{
    en_name:'Glucosamine + Chondroitin',en_desc:'Supports joint cartilage and reduces pain.',en_dose:'1500mg glucosamine + 1200mg chondroitin/day',
    es_name:'Glucosamina + Condroitina',es_desc:'Apoya el cartílago articular y reduce el dolor.',es_dose:'1500mg glucosamina + 1200mg condroitina/día',
    fr_name:'Glucosamine + Chondroïtine',fr_desc:'Soutient le cartilage articulaire et réduit la douleur.',fr_dose:'1500mg glucosamine + 1200mg chondroïtine/jour',
    ru_name:'Глюкозамин + Хондроитин',ru_desc:'Поддерживает суставной хрящ и уменьшает боль.',ru_dose:'1500мг глюкозамина + 1200мг хондроитина/день'},
  'Fitoesteróis':{
    en_name:'Phytosterols',en_desc:'Reduce LDL cholesterol absorption in the intestine.',en_dose:'1.5–3g/day with main meals',
    es_name:'Fitoesteroles',es_desc:'Reducen la absorción de colesterol LDL en el intestino.',es_dose:'1.5–3g/día con comidas principales',
    fr_name:'Phytostérols',fr_desc:"Réduisent l'absorption du cholestérol LDL dans l'intestin.",fr_dose:'1.5–3g/jour avec les repas principaux',
    ru_name:'Фитостерины',ru_desc:'Снижают всасывание LDL-холестерина в кишечнике.',ru_dose:'1,5–3г/день с основными приёмами пищи'},
  'Colagénio Hidrolisado':{
    en_name:'Hydrolyzed Collagen',en_desc:'Supports joints, cartilage, and mobility.',en_dose:'10g/day as powder (with water or juice)',
    es_name:'Colágeno Hidrolizado',es_desc:'Apoya las articulaciones, el cartílago y la movilidad.',es_dose:'10g/día en polvo (con agua o zumo)',
    fr_name:'Collagène Hydrolysé',fr_desc:'Soutient les articulations, le cartilage et la mobilité.',fr_dose:'10g/jour en poudre (avec eau ou jus)',
    ru_name:'Гидролизованный Коллаген',ru_desc:'Поддерживает суставы, хрящи и подвижность.',ru_dose:'10г/день в порошке (с водой или соком)'},
  'Vitamina B12':{
    en_name:'Vitamin B12',en_desc:'Deficiency common in elderly; supports energy and neurology.',en_dose:'500–1000mcg/day',
    es_name:'Vitamina B12',es_desc:'Deficiencia común en personas mayores; apoya la energía y la neurología.',es_dose:'500–1000mcg/día',
    fr_name:'Vitamine B12',fr_desc:"Carence fréquente chez les personnes âgées ; soutient l'énergie et la neurologie.",fr_dose:'500–1000mcg/jour',
    ru_name:'Витамин B12',ru_desc:'Дефицит часто встречается у пожилых людей; поддерживает энергию и нервную систему.',ru_dose:'500–1000мкг/день'},
};
function _suppName(s){ const _l=getLang(); const _st=SUPP_T[s.name]; return (_l!=='pt'&&_st&&_st[_l+'_name'])?_st[_l+'_name']:s.name; }
function _suppDesc(s){ const _l=getLang(); const _st=SUPP_T[s.name]; return (_l!=='pt'&&_st&&_st[_l+'_desc'])?_st[_l+'_desc']:s.desc; }
function _suppDose(s){ const _l=getLang(); const _st=SUPP_T[s.name]; return (_l!=='pt'&&_st&&_st[_l+'_dose'])?_st[_l+'_dose']:s.dose; }

// Supplements blocked per condition
const CONDITION_SUPP_BLOCK = {
  hypertension: ['Cafeína / Pré-treino'],
  heart:        ['Cafeína / Pré-treino', 'Creatina Monohidratada', 'Beta-Alanina'],
  renal:        ['Creatina Monohidratada', 'Whey Protein', 'BCAA', 'Hipercalórico (Mass Gainer)'],
  diabetes:     ['Hipercalórico (Mass Gainer)'],
  reflux:       ['Cafeína / Pré-treino'],
  copd:         ['Cafeína / Pré-treino'],
};

// Supplements added per condition
const CONDITION_SUPP_ADD = {
  osteoporosis: [
    { icon:'☀️', name:'Vitamina D3',       desc:'Fundamental para absorção de cálcio e saúde óssea.',          dose:'800–2000 UI/dia com refeição' },
    { icon:'🦴', name:'Cálcio',             desc:'Essencial para manutenção da densidade óssea.',               dose:'500–1000mg/dia com refeição' },
  ],
  arthritis: [
    { icon:'🐟', name:'Ómega-3 (extra)',    desc:'Efeito anti-inflamatório relevante para articulações.',        dose:'2–4g/dia com refeições' },
    { icon:'🧪', name:'Glucosamina + Condroitina', desc:'Suporta a cartilagem articular e reduz dor.',          dose:'1500mg glucosamina + 1200mg condroitina/dia' },
  ],
  cholesterol: [
    { icon:'🌱', name:'Fitoesteróis',       desc:'Reduzem a absorção de colesterol LDL no intestino.',          dose:'1.5–3g/dia com refeições principais' },
  ],
};

// Elderly-specific supplements (70+)
const ELDERLY_SUPPS = [
  { icon:'☀️', name:'Vitamina D3',          desc:'Essencial na 3.ª idade para absorção de cálcio e imunidade.', dose:'1000–2000 UI/dia com refeição' },
  { icon:'🦴', name:'Cálcio',               desc:'Previne perda de massa óssea e fraturas.',                    dose:'500–1000mg/dia com refeição' },
  { icon:'🧬', name:'Colagénio Hidrolisado', desc:'Suporta articulações, cartilagens e mobilidade.',            dose:'10g/dia em pó (com água ou sumo)' },
  { icon:'🌊', name:'Ómega-3',              desc:'Anti-inflamatório, suporte cardiovascular e cognitivo.',      dose:'2–3g/dia com refeições' },
  { icon:'💊', name:'Vitamina B12',         desc:'Deficiência comum em idosos; suporta energia e neurologia.',  dose:'500–1000mcg/dia' },
];

// Supplements not appropriate for elderly (70+)
const ELDERLY_SUPP_BLOCK = new Set(['Cafeína / Pré-treino', 'Beta-Alanina', 'Hipercalórico (Mass Gainer)', 'L-Carnitina']);

function getHealthProfile() {
  const profile = getProfile();
  const def = { allergies: [], conditions: [], injuries: [], customConditions: [], customAllergies: [], customInjuries: [], notes: '' };
  if (!profile) return def;
  const hp = profile.healthProfile || {};
  return {
    allergies:       hp.allergies       || [],
    conditions:      hp.conditions      || [],
    injuries:        hp.injuries        || [],
    customConditions:hp.customConditions|| [],
    customAllergies: hp.customAllergies || [],
    customInjuries:  hp.customInjuries  || [],
    notes:           hp.notes           || '',
  };
}

function openHealthModal() {
  renderHealthModal();
  openModal('modal-health');
}

function renderHealthModal() {
  const hp = getHealthProfile();

  function simpleSection(title, items, category, customKey) {
    const customItems = customKey ? (hp[customKey] || []) : [];
    const customChips = customItems.map((c, i) => `
      <span style="display:inline-flex; align-items:center; gap:5px; padding:6px 12px; border-radius:20px; background:rgba(0,170,255,.15); border:1px solid rgba(0,170,255,.35); color:var(--cyan); font-size:0.82rem; font-weight:600; margin:0 4px 4px 0;">
        ${c}
        <button onclick="removeCustomHealthItem('${customKey}',${i})" style="background:none;border:none;color:var(--cyan);cursor:pointer;font-size:0.9rem;padding:0;line-height:1;">✕</button>
      </span>`).join('');
    const dotsChip = customKey ? `
      <div class="muscle-chip" onclick="toggleCustomHealthInput('${customKey}')"
           style="display:flex; align-items:center; gap:4px; letter-spacing:2px; opacity:0.7; font-size:1rem; padding:6px 14px;">···</div>` : '';
    const inlineInput = customKey ? `
      <div id="custom-input-row-${customKey}" style="display:none; margin-top:8px;">
        <div style="display:flex; gap:8px; align-items:center;">
          <input id="custom-input-${customKey}" type="text" placeholder="${t('health_item_ph')}"
            onkeydown="if(event.key==='Enter'){addCustomHealthItem('${customKey}');event.preventDefault();}"
            style="flex:1; background:rgba(255,255,255,0.06); border:1px solid var(--orange); border-radius:var(--radius-sm); color:var(--text); padding:8px 12px; font-size:0.88rem; outline:none;">
          <button onclick="addCustomHealthItem('${customKey}')" class="btn btn-secondary btn-sm" style="white-space:nowrap; flex-shrink:0;">+</button>
          <button onclick="toggleCustomHealthInput('${customKey}')" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:1rem;padding:4px;">✕</button>
        </div>
      </div>` : '';
    return `<div style="margin-bottom:20px;">
      <div style="font-size:0.72rem; color:var(--muted); text-transform:uppercase; letter-spacing:.6px; font-weight:700; margin-bottom:10px;">${title}</div>
      <div class="chip-row">${items.map(item => `
        <div class="muscle-chip ${hp[category].includes(item.id) ? 'selected' : ''}"
             onclick="toggleHealthItem('${category}','${item.id}',this)"
             style="display:flex; align-items:center; gap:6px;">
          <span>${item.icon}</span> ${item.label}
        </div>`).join('')}${dotsChip}
      </div>
      ${customKey ? `<div id="custom-chips-${customKey}" style="margin-top:4px;">${customChips}</div>` : ''}
      ${inlineInput}
    </div>`;
  }

  const custom = hp.customConditions || [];

  const conditionsSection = `<div style="margin-bottom:20px;">
    <div style="font-size:0.72rem; color:var(--muted); text-transform:uppercase; letter-spacing:.6px; font-weight:700; margin-bottom:10px;">${t('cond_section_title')}</div>

    <!-- Search filter -->
    <div style="position:relative; margin-bottom:10px;">
      <input id="cond-search" type="text" placeholder="${t('cond_search_ph')}"
        oninput="filterConditions(this.value)"
        style="width:100%; background:rgba(255,255,255,0.06); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text); padding:9px 12px; font-size:0.88rem; outline:none; transition:border-color .2s;"
        onfocus="this.style.borderColor='var(--orange)'" onblur="this.style.borderColor='var(--border)'">
    </div>

    <!-- Preset conditions chips (filterable) -->
    <div class="chip-row" id="cond-chips-list" style="margin-bottom:12px;">
      ${HEALTH_CONDITIONS.map(item => `
        <div class="muscle-chip ${hp.conditions.includes(item.id) ? 'selected' : ''}"
             data-label="${item.label.toLowerCase()}"
             onclick="toggleHealthItem('conditions','${item.id}',this)"
             style="display:flex; align-items:center; gap:6px;">
          <span>${item.icon}</span> ${item.label}
        </div>`).join('')}
      <div class="muscle-chip" onclick="document.getElementById('custom-cond-input').focus(); document.getElementById('custom-cond-input').scrollIntoView({behavior:'smooth',block:'center'});"
           style="display:flex; align-items:center; gap:4px; letter-spacing:2px; opacity:0.65; font-size:1rem; padding:6px 14px;" title="${t('cond_add_another')}">···</div>
    </div>

    <!-- Custom conditions added by user -->
    <div id="custom-cond-chips" style="margin-bottom:10px;">
      ${custom.map((c, i) => `
        <span style="display:inline-flex; align-items:center; gap:5px; padding:6px 12px; border-radius:20px; background:rgba(0,170,255,.15); border:1px solid rgba(0,170,255,.35); color:var(--cyan); font-size:0.82rem; font-weight:600; margin:0 4px 4px 0;">
          ${c}
          <button onclick="removeCustomCondition(${i})" style="background:none;border:none;color:var(--cyan);cursor:pointer;font-size:0.9rem;padding:0;line-height:1;">✕</button>
        </span>`).join('')}
    </div>

    <!-- Add custom condition -->
    <div style="position:relative;">
      <div style="font-size:0.72rem; color:var(--muted); font-weight:600; margin-bottom:6px;">${t('cond_add_custom')}</div>
      <div style="display:flex; gap:8px; align-items:flex-start;">
        <div style="flex:1; position:relative;">
          <input id="custom-cond-input" type="text" placeholder="${t('cond_custom_ph')}"
            oninput="showCondSuggestions(this.value)"
            onkeydown="if(event.key==='Enter'){addCustomCondition();event.preventDefault();}"
            style="width:100%; background:rgba(255,255,255,0.06); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text); padding:9px 12px; font-size:0.88rem; outline:none; transition:border-color .2s;"
            onfocus="this.style.borderColor='var(--orange)'; showCondSuggestions(this.value)"
            onblur="setTimeout(hideCondSuggestions,200)">
          <div id="cond-suggestions" style="display:none; position:absolute; top:100%; left:0; right:0; z-index:99; background:rgba(15,15,35,0.97); border:1px solid var(--border); border-radius:var(--radius-sm); margin-top:4px; max-height:180px; overflow-y:auto; box-shadow:0 8px 24px rgba(0,0,0,0.5);"></div>
        </div>
        <button onclick="addCustomCondition()" class="btn btn-secondary btn-sm" style="white-space:nowrap; flex-shrink:0;">${t('btn_add')}</button>
      </div>
    </div>
  </div>`;

  const profile = getProfile();
  const pregnantChecked = isPregnant(profile);
  const trimester = getPregnancyTrimester(profile);

  const pregnancySection = `
    <div style="background:rgba(255,182,193,0.06);border:1px solid rgba(255,182,193,0.25);
                border-radius:12px;padding:14px 16px;margin-bottom:20px;">
      <div style="font-size:0.72rem;font-weight:800;color:#ff69b4;letter-spacing:0.08em;
                  text-transform:uppercase;margin-bottom:10px;">🤰 Gravidez</div>
      <label style="display:flex;align-items:center;gap:10px;cursor:pointer;margin-bottom:${pregnantChecked ? '12px' : '0'};">
        <input type="checkbox" id="pregnancy-toggle" ${pregnantChecked ? 'checked' : ''}
          onchange="togglePregnancy(this.checked)"
          style="width:18px;height:18px;accent-color:#ff69b4;cursor:pointer;">
        <span style="font-size:0.88rem;font-weight:600;">${t('pg_pregnant_label')}</span>
      </label>
      <div id="pregnancy-trimester-row" style="display:${pregnantChecked ? 'block' : 'none'};">
        <div style="font-size:0.72rem;color:var(--muted);margin-bottom:8px;">${t('pg_trimester_current')}</div>
        <div style="display:flex;gap:8px;">
          ${[1,2,3].map(tr => `
            <button onclick="setTrimester(${tr})"
              style="flex:1;padding:8px;border-radius:10px;font-size:0.82rem;font-weight:700;cursor:pointer;
                     border:1px solid ${trimester===tr ? '#ff69b4' : 'var(--border)'};
                     background:${trimester===tr ? 'rgba(255,105,180,0.15)' : 'rgba(255,255,255,0.04)'};
                     color:${trimester===tr ? '#ff69b4' : 'var(--muted)'};transition:all .2s;">
              ${tr}º Trim.
            </button>`).join('')}
        </div>
        <div style="font-size:0.7rem;color:var(--muted);margin-top:10px;line-height:1.5;">
          ${t('pg_consult_doctor')}
        </div>
      </div>
    </div>`;

  document.getElementById('health-modal-body').innerHTML =
    (profile.gender !== 'm' ? pregnancySection : '') +
    simpleSection(t('health_allergies_section'), HEALTH_ALLERGIES, 'allergies', 'customAllergies') +
    conditionsSection +
    simpleSection(t('health_injuries_section'), HEALTH_INJURIES, 'injuries', 'customInjuries') +
    `<div style="margin-bottom:20px;">
      <div style="font-size:0.72rem; color:var(--muted); text-transform:uppercase; letter-spacing:.6px; font-weight:700; margin-bottom:8px;">${t('health_notes_section')}</div>
      <textarea id="health-notes" rows="3" placeholder="${t('health_notes_ph')}"
        oninput="saveHealthNotes()"
        style="width:100%; background:rgba(255,255,255,0.05); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text); padding:10px 12px; font-size:0.88rem; outline:none; resize:vertical;">${hp.notes || ''}</textarea>
    </div>`;
}

function filterConditions(query) {
  const q = query.toLowerCase().trim();
  document.querySelectorAll('#cond-chips-list .muscle-chip').forEach(chip => {
    chip.style.display = (!q || chip.dataset.label.includes(q)) ? '' : 'none';
  });
}

function showCondSuggestions(value) {
  const el = document.getElementById('cond-suggestions');
  const hp = getHealthProfile();
  const custom = hp.customConditions || [];
  const existing = [...HEALTH_CONDITIONS.map(c => c.label), ...custom].map(s => s.toLowerCase());
  const q = value.trim().toLowerCase();
  if (!q) { el.style.display = 'none'; return; }

  const matches = CONDITION_SUGGESTIONS.filter(s =>
    s.toLowerCase().includes(q) && !existing.includes(s.toLowerCase())
  ).slice(0, 8);

  if (!matches.length) { el.style.display = 'none'; return; }

  el.style.display = 'block';
  el.innerHTML = matches.map(s => `
    <div onclick="selectCondSuggestion('${s.replace(/'/g,"\\'")}')"
      style="padding:9px 14px; font-size:0.85rem; cursor:pointer; border-bottom:1px solid var(--border); color:var(--text); transition:background .15s;"
      onmouseover="this.style.background='rgba(255,107,53,0.12)'"
      onmouseout="this.style.background=''">${s}</div>
  `).join('');
}

function hideCondSuggestions() {
  const el = document.getElementById('cond-suggestions');
  if (el) el.style.display = 'none';
}

function selectCondSuggestion(value) {
  const input = document.getElementById('custom-cond-input');
  if (input) { input.value = value; }
  hideCondSuggestions();
  addCustomCondition();
}

function addCustomCondition() {
  const input = document.getElementById('custom-cond-input');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;
  const profile = getProfile();
  if (!profile.healthProfile) profile.healthProfile = { allergies: [], conditions: [], injuries: [], customConditions: [], notes: '' };
  if (!profile.healthProfile.customConditions) profile.healthProfile.customConditions = [];
  // Prevent duplicates (case-insensitive)
  const lower = val.toLowerCase();
  const alreadyPreset = HEALTH_CONDITIONS.some(c => c.label.toLowerCase() === lower);
  const alreadyCustom = profile.healthProfile.customConditions.some(c => c.toLowerCase() === lower);
  if (alreadyPreset || alreadyCustom) { showToast(t('t_cond_already')); input.value = ''; return; }
  profile.healthProfile.customConditions.push(val);
  saveProfile(profile);
  input.value = '';
  hideCondSuggestions();
  // Re-render just the custom chips
  const chipsEl = document.getElementById('custom-cond-chips');
  if (chipsEl) {
    const custom = profile.healthProfile.customConditions;
    chipsEl.innerHTML = custom.map((c, i) => `
      <span style="display:inline-flex; align-items:center; gap:5px; padding:6px 12px; border-radius:20px; background:rgba(0,170,255,.15); border:1px solid rgba(0,170,255,.35); color:var(--cyan); font-size:0.82rem; font-weight:600; margin:0 4px 4px 0;">
        ${c}
        <button onclick="removeCustomCondition(${i})" style="background:none;border:none;color:var(--cyan);cursor:pointer;font-size:0.9rem;padding:0;line-height:1;">✕</button>
      </span>`).join('');
  }
  showToast(`"${val}" ${t('t_added')}`);
}

function removeCustomCondition(idx) {
  const profile = getProfile();
  if (!profile.healthProfile || !profile.healthProfile.customConditions) return;
  profile.healthProfile.customConditions.splice(idx, 1);
  saveProfile(profile);
  const chipsEl = document.getElementById('custom-cond-chips');
  if (chipsEl) {
    const custom = profile.healthProfile.customConditions;
    chipsEl.innerHTML = custom.map((c, i) => `
      <span style="display:inline-flex; align-items:center; gap:5px; padding:6px 12px; border-radius:20px; background:rgba(0,170,255,.15); border:1px solid rgba(0,170,255,.35); color:var(--cyan); font-size:0.82rem; font-weight:600; margin:0 4px 4px 0;">
        ${c}
        <button onclick="removeCustomCondition(${i})" style="background:none;border:none;color:var(--cyan);cursor:pointer;font-size:0.9rem;padding:0;line-height:1;">✕</button>
      </span>`).join('');
  }
}

function toggleCustomHealthInput(key) {
  const row = document.getElementById('custom-input-row-' + key);
  if (!row) return;
  const visible = row.style.display !== 'none';
  row.style.display = visible ? 'none' : 'block';
  if (!visible) {
    const inp = document.getElementById('custom-input-' + key);
    if (inp) inp.focus();
  }
}

function addCustomHealthItem(key) {
  const inp = document.getElementById('custom-input-' + key);
  if (!inp) return;
  const val = inp.value.trim();
  if (!val) return;
  const profile = getProfile();
  if (!profile.healthProfile) profile.healthProfile = {};
  if (!profile.healthProfile[key]) profile.healthProfile[key] = [];
  const lower = val.toLowerCase();
  if (profile.healthProfile[key].some(c => c.toLowerCase() === lower)) {
    showToast(t('t_already_added'));
    inp.value = '';
    return;
  }
  profile.healthProfile[key].push(val);
  saveProfile(profile);
  inp.value = '';
  const chipsEl = document.getElementById('custom-chips-' + key);
  if (chipsEl) {
    const items = profile.healthProfile[key];
    chipsEl.innerHTML = items.map((c, i) => `
      <span style="display:inline-flex; align-items:center; gap:5px; padding:6px 12px; border-radius:20px; background:rgba(0,170,255,.15); border:1px solid rgba(0,170,255,.35); color:var(--cyan); font-size:0.82rem; font-weight:600; margin:0 4px 4px 0;">
        ${c}
        <button onclick="removeCustomHealthItem('${key}',${i})" style="background:none;border:none;color:var(--cyan);cursor:pointer;font-size:0.9rem;padding:0;line-height:1;">✕</button>
      </span>`).join('');
  }
  showToast(t('t_added'));
}

function removeCustomHealthItem(key, idx) {
  const profile = getProfile();
  if (!profile.healthProfile || !profile.healthProfile[key]) return;
  profile.healthProfile[key].splice(idx, 1);
  saveProfile(profile);
  const chipsEl = document.getElementById('custom-chips-' + key);
  if (chipsEl) {
    const items = profile.healthProfile[key];
    chipsEl.innerHTML = items.map((c, i) => `
      <span style="display:inline-flex; align-items:center; gap:5px; padding:6px 12px; border-radius:20px; background:rgba(0,170,255,.15); border:1px solid rgba(0,170,255,.35); color:var(--cyan); font-size:0.82rem; font-weight:600; margin:0 4px 4px 0;">
        ${c}
        <button onclick="removeCustomHealthItem('${key}',${i})" style="background:none;border:none;color:var(--cyan);cursor:pointer;font-size:0.9rem;padding:0;line-height:1;">✕</button>
      </span>`).join('');
  }
}

// Temp state during modal editing
const _hpTemp = {};

function toggleHealthItem(category, id, el) {
  const hp = getHealthProfile();
  if (!hp[category]) hp[category] = [];
  const idx = hp[category].indexOf(id);
  if (idx >= 0) { hp[category].splice(idx, 1); el.classList.remove('selected'); }
  else           { hp[category].push(id);       el.classList.add('selected'); }
  // Save immediately so state is live
  const profile = getProfile();
  profile.healthProfile = hp;
  saveProfile(profile);
}

function saveHealthNotes() {
  const profile = getProfile();
  if (!profile) return;
  if (!profile.healthProfile) profile.healthProfile = {};
  profile.healthProfile.notes = (document.getElementById('health-notes') || {}).value || '';
  saveProfile(profile);
}

function saveHealthProfile() {
  saveHealthNotes();
  closeModal('modal-health');
  renderProfileTab();
}

function detectAllergens(text, userAllergies) {
  const found = [];
  const lower = text.toLowerCase();
  HEALTH_ALLERGIES.forEach(a => {
    if (userAllergies.includes(a.id) && a.keywords.some(k => lower.includes(k))) {
      found.push(a);
    }
  });
  return found;
}


// ═══════════════════════════════════════════════════════
//  NUTRITION
// ═══════════════════════════════════════════════════════

function populateNutritionForm() {
  const profile = getProfile();
  if (!profile) return;

  const hasAll = profile.weight && profile.height && profile.age;
  const summaryEl = document.getElementById('nut-profile-summary');
  const fieldsEl  = document.getElementById('nut-profile-fields');

  if (hasAll && summaryEl && fieldsEl) {
    // Mostra resumo compacto, esconde campos
    const gLabel = (profile.gender === 'f') ? t('female') : t('male');
    summaryEl.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;
                  background:rgba(255,255,255,0.04);border-radius:10px;border:1px solid var(--border);">
        <div style="font-size:0.82rem;color:var(--text);line-height:1.6;">
          <span style="font-weight:700;">${profile.name.split(' ')[0]}</span>
          <span style="color:var(--muted);"> · ${profile.age} ${t('years_old')} · ${profile.weight} kg · ${profile.height} cm · ${gLabel}</span>
        </div>
        <button onclick="toggleNutFields()" style="background:none;border:none;color:var(--muted);
                font-size:0.72rem;cursor:pointer;padding:0;white-space:nowrap;margin-left:8px;">${t('nut_alter')}</button>
      </div>`;
    summaryEl.style.display = 'block';
    fieldsEl.style.display  = 'none';
  } else {
    // Perfil incompleto — mostra os campos em falta
    if (summaryEl) summaryEl.style.display = 'none';
    if (fieldsEl)  fieldsEl.style.display  = 'block';
    if (profile.weight) document.getElementById('nut-weight').value = profile.weight;
    if (profile.height) document.getElementById('nut-height').value = profile.height;
    if (profile.age)    document.getElementById('nut-age').value    = profile.age;
    if (profile.gender) document.getElementById('nut-gender').value = profile.gender;
  }

  // Objetivo e atividade preenchem sempre
  if (profile.goal)   document.getElementById('nut-goal').value = profile.goal;
}

function toggleNutFields() {
  const fieldsEl  = document.getElementById('nut-profile-fields');
  const summaryEl = document.getElementById('nut-profile-summary');
  const open = fieldsEl.style.display !== 'none';
  fieldsEl.style.display  = open ? 'none' : 'block';
  if (summaryEl) {
    summaryEl.querySelector('button').textContent = open ? t('nut_alter') : t('nut_close_fields');
  }
  if (!open) {
    // Preenche os campos ao abrir
    const profile = getProfile();
    if (!profile) return;
    if (profile.weight) document.getElementById('nut-weight').value = profile.weight;
    if (profile.height) document.getElementById('nut-height').value = profile.height;
    if (profile.age)    document.getElementById('nut-age').value    = profile.age;
    if (profile.gender) document.getElementById('nut-gender').value = profile.gender;
  }
}

function calcNutrition() {
  const profile = getProfile();
  // Use input fields if visible, otherwise fall back to profile data
  const fieldsEl = document.getElementById('nut-profile-fields');
  const fieldsVisible = fieldsEl && fieldsEl.style.display !== 'none';
  const weight   = fieldsVisible ? parseFloat(document.getElementById('nut-weight').value)  : parseFloat(profile && profile.weight);
  const height   = fieldsVisible ? parseFloat(document.getElementById('nut-height').value)  : parseFloat(profile && profile.height);
  const age      = fieldsVisible ? parseInt(document.getElementById('nut-age').value)        : parseInt(profile && profile.age);
  const gender   = fieldsVisible ? document.getElementById('nut-gender').value               : (profile && profile.gender) || 'm';
  const activity = parseFloat(document.getElementById('nut-activity').value);
  const goal     = document.getElementById('nut-goal').value;

  if (!weight || !height || !age) { showToast(t('nut_fill_fields')); return; }

  // Mifflin-St Jeor BMR
  let bmr;
  if (gender === 'm') bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  else bmr = 10 * weight + 6.25 * height - 5 * age - 161;

  let tdee = bmr * activity;
  let targetCal = tdee;
  if (goal === 'cut') targetCal = tdee - 500;
  if (goal === 'bulk') targetCal = tdee + 300;

  // Macros
  let protein, fat, carbs;
  if (goal === 'cut') {
    protein = weight * 2.2; fat = (targetCal * 0.25) / 9; carbs = (targetCal - protein * 4 - fat * 9) / 4;
  } else if (goal === 'bulk') {
    protein = weight * 2.0; fat = (targetCal * 0.25) / 9; carbs = (targetCal - protein * 4 - fat * 9) / 4;
  } else {
    protein = weight * 1.8; fat = (targetCal * 0.30) / 9; carbs = (targetCal - protein * 4 - fat * 9) / 4;
  }

  // Save to profile
  profile.weight = weight; profile.height = height; profile.age = age;
  profile.gender = gender; profile.goal = goal;
  saveProfile(profile);

  // Display
  document.getElementById('nut-cal').textContent = Math.round(targetCal) + ' kcal';
  document.getElementById('nut-bmr-info').textContent = `TMB: ${Math.round(bmr)} kcal · TDEE: ${Math.round(tdee)} kcal`;

  document.getElementById('nut-macros').innerHTML = `
    <div class="macro-card">
      <div class="macro-val" style="color:#ff6b35">${Math.round(protein)}g</div>
      <div class="macro-label">${t('nut_protein')}</div>
    </div>
    <div class="macro-card">
      <div class="macro-val" style="color:#00d4aa">${Math.round(carbs)}g</div>
      <div class="macro-label">${t('nut_carbs')}</div>
    </div>
    <div class="macro-card">
      <div class="macro-val" style="color:#ffd700">${Math.round(fat)}g</div>
      <div class="macro-label">${t('nut_fats')}</div>
    </div>`;

  // Health profile (needed before building meals)
  const hp = getHealthProfile();

  // Reset meal selections on new calculation so day-seed is applied fresh
  Object.keys(mealSelections).forEach(k => delete mealSelections[k]);

  // Store state for cycleMeal
  _nutState = { goal, cal: Math.round(targetCal), hp };

  // Meals
  document.getElementById('nut-meals').innerHTML = getMealPlan(goal, Math.round(targetCal), Math.round(protein), hp);
  attachMealSwipes();

  // Supplements
  document.getElementById('nut-supps').innerHTML = getSupplements(goal, age, hp);

  // Age & health warning banner
  const ageWarningEl = document.getElementById('nut-age-warning');
  const warnings = [];

  if (age < 14) {
    warnings.push({ color:'var(--pink)', bg:'rgba(255,107,53,.1)',
      msg: t('nut_warn_child').replace('{age}', age) });
  } else if (age < 18) {
    warnings.push({ color:'var(--yellow)', bg:'rgba(255,215,0,.08)',
      msg: t('nut_warn_teen').replace('{age}', age) });
  } else if (age >= 70) {
    warnings.push({ color:'var(--cyan)', bg:'rgba(0,170,255,.08)',
      msg: t('nut_warn_senior').replace('{age}', age) });
  }

  if (hp.conditions && hp.conditions.length) {
    const condLabels = hp.conditions.map(c => HEALTH_CONDITIONS.find(x=>x.id===c)?.label||c).join(', ');
    warnings.push({ color:'var(--green)', bg:'rgba(0,212,170,.08)',
      msg: t('nut_warn_conditions').replace('{conds}', condLabels) });
  }

  const allAllergyLabels = [
    ...(hp.allergies || []).map(a => HEALTH_ALLERGIES.find(x=>x.id===a)?.label||a),
    ...(hp.customAllergies || [])
  ];
  if (allAllergyLabels.length) {
    warnings.push({ color:'var(--orange)', bg:'rgba(255,107,53,.08)',
      msg: t('nut_warn_allergies').replace('{items}', allAllergyLabels.join(', ')) });
  }

  ageWarningEl.innerHTML = warnings.map(w =>
    `<div style="background:${w.bg}; border:1.5px solid ${w.color}; border-radius:var(--radius-sm); padding:12px 14px; margin-bottom:10px; font-size:0.82rem; line-height:1.6; color:var(--text);">${w.msg}</div>`
  ).join('');

  document.getElementById('nutrition-results').style.display = 'block';
  document.getElementById('nutrition-results').scrollIntoView({ behavior: 'smooth' });
  showToast(t('nut_calculated'));
}

// Tracks which option is selected for each meal slot (raw counter, mod applied on read)
const mealSelections = {};

// Persists goal/cal/hp between calcNutrition and cycleMeal
let _nutState = { goal: 'maintain', cal: 2000, hp: {} };

// Returns true if a meal option is safe for the given health profile
function isMealSafe(opt, hp) {
  const text = (opt.name + ' ' + opt.desc).toLowerCase();
  const presetUnsafe = (hp.allergies || []).some(aId => {
    const a = HEALTH_ALLERGIES.find(x => x.id === aId);
    return a && a.keywords.some(kw => text.includes(kw.toLowerCase()));
  });
  const customUnsafe = (hp.customAllergies || []).some(name => {
    const kw = name.toLowerCase().trim();
    return kw.length > 2 && text.includes(kw);
  });
  return !presetUnsafe && !customUnsafe;
}

// Meal name/desc translations keyed by PT name. Access: MEAL_T[ptName]?.['en_name'] etc.
const MEAL_T = {
  // ── CUT BREAKFAST ──
  'Ovos mexidos + Aveia + Banana':              { en_name:'Scrambled Eggs + Oats + Banana', en_desc:'3 scrambled eggs · 50g oats with milk · 1 banana', es_name:'Huevos revueltos + Avena + Plátano', es_desc:'3 huevos revueltos · 50g avena con leche · 1 plátano', fr_name:'Œufs brouillés + Avoine + Banane', fr_desc:'3 œufs brouillés · 50g flocons d\'avoine avec lait · 1 banane', ru_name:'Яичница-болтунья + Овсянка + Банан', ru_desc:'3 яйца · 50г овсянки с молоком · 1 банан' },
  'Panquecas de aveia proteicas':               { en_name:'Protein Oat Pancakes', en_desc:'80g oats · 2 eggs · 1 egg white · cinnamon · honey to taste', es_name:'Tortitas proteicas de avena', es_desc:'80g avena · 2 huevos · 1 clara · canela · miel al gusto', fr_name:'Pancakes protéinés à l\'avoine', fr_desc:'80g flocons d\'avoine · 2 œufs · 1 blanc d\'œuf · cannelle · miel', ru_name:'Протеиновые блины из овсянки', ru_desc:'80г овсянки · 2 яйца · 1 белок · корица · мёд по вкусу' },
  'Iogurte grego + Granola + Frutos vermelhos': { en_name:'Greek Yogurt + Granola + Berries', en_desc:'200g 0% Greek yogurt · 30g granola · handful of strawberries', es_name:'Yogur griego + Granola + Frutos rojos', es_desc:'200g yogur griego 0% · 30g granola · puñado de fresas', fr_name:'Yaourt grec + Granola + Fruits rouges', fr_desc:'200g yaourt grec 0% · 30g granola · poignée de fraises', ru_name:'Греческий йогурт + Гранола + Ягоды', ru_desc:'200г греческого йогурта 0% · 30г граноли · горсть клубники' },
  'Tofu mexido + Pão integral + Tomate':        { en_name:'Scrambled Tofu + Wholegrain Toast + Tomato', en_desc:'150g seasoned firm tofu · 2 slices wholegrain bread · tomato + spinach', es_name:'Tofu revuelto + Pan integral + Tomate', es_desc:'150g tofu firme condimentado · 2 rebanadas pan integral · tomate + espinacas', fr_name:'Tofu brouillé + Pain complet + Tomate', fr_desc:'150g tofu ferme assaisonné · 2 tranches pain complet · tomate + épinards', ru_name:'Тофу-болтунья + Цельнозерновой хлеб + Томат', ru_desc:'150г тофу · 2 ломтика цельнозернового хлеба · помидор + шпинат' },
  'Papas de aveia + Sementes de chia + Fruta':  { en_name:'Oatmeal + Chia Seeds + Fruit', en_desc:'60g oats cooked in water · 1 tbsp chia seeds · 1 sliced apple', es_name:'Gachas de avena + Semillas de chía + Fruta', es_desc:'60g avena cocida en agua · 1 c.s. semillas de chía · 1 manzana', fr_name:'Porridge + Graines de chia + Fruit', fr_desc:'60g flocons d\'avoine cuits dans l\'eau · 1 c.s. graines de chia · 1 pomme', ru_name:'Овсяная каша + Семена чиа + Фрукт', ru_desc:'60г овсянки на воде · 1 ст.л. семян чиа · 1 яблоко' },
  'Ovo escalfado + Espinafres + Pão de centeio':{ en_name:'Poached Eggs + Spinach + Rye Bread', en_desc:'2 poached eggs · sautéed spinach with garlic · 1 slice rye bread', es_name:'Huevo pochado + Espinacas + Pan de centeno', es_desc:'2 huevos pochados · espinacas con ajo · 1 rebanada pan de centeno', fr_name:'Œufs pochés + Épinards + Pain de seigle', fr_desc:'2 œufs pochés · épinards sautés à l\'ail · 1 tranche pain de seigle', ru_name:'Яйца-пашот + Шпинат + Ржаной хлеб', ru_desc:'2 яйца-пашот · шпинат с чесноком · 1 ломтик ржаного хлеба' },
  'Overnight oats + Kiwi + Proteína':           { en_name:'Overnight Oats + Kiwi + Protein', en_desc:'50g oats in water · 1 scoop whey · 2 sliced kiwis · cinnamon', es_name:'Overnight oats + Kiwi + Proteína', es_desc:'50g avena en agua · 1 scoop whey · 2 kiwis en láminas · canela', fr_name:'Overnight oats + Kiwi + Protéines', fr_desc:'50g flocons d\'avoine · 1 dose whey · 2 kiwis tranchés · cannelle', ru_name:'Ночная овсянка + Киви + Протеин', ru_desc:'50г овсянки · 1 скуп протеина · 2 нарезанных киви · корица' },
  // ── CUT SNACK AM ──
  'Iogurte grego + Amêndoas':             { en_name:'Greek Yogurt + Almonds', en_desc:'200g 0% Greek yogurt · 15g toasted almonds', es_name:'Yogur griego + Almendras', es_desc:'200g yogur griego 0% · 15g almendras tostadas', fr_name:'Yaourt grec + Amandes', fr_desc:'200g yaourt grec 0% · 15g amandes grillées', ru_name:'Греческий йогурт + Миндаль', ru_desc:'200г греческого йогурта 0% · 15г миндаля' },
  'Maçã + Queijo cottage':                { en_name:'Apple + Cottage Cheese', en_desc:'1 medium apple · 100g low-fat cottage cheese', es_name:'Manzana + Queso cottage', es_desc:'1 manzana mediana · 100g queso cottage magro', fr_name:'Pomme + Fromage blanc', fr_desc:'1 pomme moyenne · 100g fromage blanc allégé', ru_name:'Яблоко + Творог', ru_desc:'1 среднее яблоко · 100г нежирного творога' },
  'Batido de proteína c/ fruta':          { en_name:'Protein Shake with Fruit', en_desc:'1 serving whey · 150ml water · 1 kiwi or half banana', es_name:'Batido de proteína con fruta', es_desc:'1 dosis de whey · 150ml agua · 1 kiwi o media banana', fr_name:'Shake protéiné aux fruits', fr_desc:'1 dose whey · 150ml eau · 1 kiwi ou demi-banane', ru_name:'Протеиновый коктейль с фруктом', ru_desc:'1 порция протеина · 150мл воды · 1 киви или пол-банана' },
  'Cenoura + Hummus + Pepino':            { en_name:'Carrots + Hummus + Cucumber', en_desc:'1 large carrot in sticks · 60g hummus · ½ sliced cucumber', es_name:'Zanahoria + Hummus + Pepino', es_desc:'1 zanahoria en palitos · 60g hummus · ½ pepino', fr_name:'Carottes + Houmous + Concombre', fr_desc:'1 grande carotte en bâtonnets · 60g houmous · ½ concombre', ru_name:'Морковь + Хумус + Огурец', ru_desc:'1 морковь, нарезанная палочками · 60г хумуса · ½ огурца' },
  'Fruta + Sementes de abóbora':          { en_name:'Fruit + Pumpkin Seeds', en_desc:'1 orange or pear · 15g unsalted toasted pumpkin seeds', es_name:'Fruta + Semillas de calabaza', es_desc:'1 naranja o pera · 15g semillas de calabaza tostadas', fr_name:'Fruit + Graines de courge', fr_desc:'1 orange ou poire · 15g graines de courge grillées', ru_name:'Фрукт + Тыквенные семечки', ru_desc:'1 апельсин или груша · 15г тыквенных семечек' },
  'Ovo cozido + Tomate cherry + Oregãos': { en_name:'Boiled Eggs + Cherry Tomatoes + Oregano', en_desc:'2 boiled eggs · 8 cherry tomatoes · oregano + drizzle of olive oil', es_name:'Huevo cocido + Tomates cherry + Orégano', es_desc:'2 huevos cocidos · 8 tomates cherry · orégano + aceite', fr_name:'Œuf dur + Tomates cerises + Origan', fr_desc:'2 œufs durs · 8 tomates cerises · origan + huile d\'olive', ru_name:'Варёные яйца + Черри + Орегано', ru_desc:'2 варёных яйца · 8 помидоров черри · орегано + оливковое масло' },
  'Requeijão + Mirtilos + Canela':        { en_name:'Ricotta + Blueberries + Cinnamon', en_desc:'100g low-fat ricotta · 80g fresh blueberries · cinnamon to taste', es_name:'Requesón + Arándanos + Canela', es_desc:'100g requesón magro · 80g arándanos frescos · canela', fr_name:'Fromage frais + Myrtilles + Cannelle', fr_desc:'100g fromage frais maigre · 80g myrtilles fraîches · cannelle', ru_name:'Творог + Черника + Корица', ru_desc:'100г нежирного творога · 80г черники · корица по вкусу' },
  // ── CUT LUNCH ──
  'Frango grelhado + Arroz integral + Salada': { en_name:'Grilled Chicken + Brown Rice + Salad', en_desc:'180g chicken breast · 80g brown rice · green salad at will', es_name:'Pollo a la plancha + Arroz integral + Ensalada', es_desc:'180g pechuga de pollo · 80g arroz integral · ensalada verde', fr_name:'Poulet grillé + Riz complet + Salade', fr_desc:'180g blanc de poulet · 80g riz complet · salade verte', ru_name:'Куриное филе гриль + Бурый рис + Салат', ru_desc:'180г куриной грудки · 80г бурого риса · зелёный салат' },
  'Atum + Batata-doce + Brócolos':             { en_name:'Tuna + Sweet Potato + Broccoli', en_desc:'2 cans natural tuna · 150g boiled sweet potato · 100g broccoli', es_name:'Atún + Boniato + Brócoli', es_desc:'2 latas de atún · 150g boniato cocido · 100g brócoli', fr_name:'Thon + Patate douce + Brocoli', fr_desc:'2 boîtes thon naturel · 150g patate douce cuite · 100g brocoli', ru_name:'Тунец + Батат + Брокколи', ru_desc:'2 банки тунца · 150г варёного батата · 100г брокколи' },
  'Bacalhau assado + Legumes + Grão':          { en_name:'Baked Cod + Vegetables + Chickpeas', en_desc:'200g cod · creamed spinach · 60g cooked chickpeas', es_name:'Bacalao al horno + Verduras + Garbanzos', es_desc:'200g bacalao · espinacas · 60g garbanzos cocidos', fr_name:'Cabillaud rôti + Légumes + Pois chiches', fr_desc:'200g cabillaud · épinards · 60g pois chiches cuits', ru_name:'Запечённая треска + Овощи + Нут', ru_desc:'200г трески · шпинат · 60г варёного нута' },
  'Peru + Quinoa + Espinafres salteados':      { en_name:'Turkey + Quinoa + Sautéed Spinach', en_desc:'180g grilled turkey breast · 80g cooked quinoa · spinach with garlic', es_name:'Pavo + Quinoa + Espinacas salteadas', es_desc:'180g pechuga de pavo · 80g quinoa cocida · espinacas con ajo', fr_name:'Dinde + Quinoa + Épinards sautés', fr_desc:'180g blanc de dinde · 80g quinoa cuit · épinards à l\'ail', ru_name:'Индейка + Киноа + Шпинат', ru_desc:'180г грудки индейки · 80г варёной киноа · шпинат с чесноком' },
  'Lentilhas + Arroz + Legumes salteados':     { en_name:'Lentils + Rice + Sautéed Vegetables', en_desc:'120g cooked lentils · 70g rice · zucchini + pepper + tomato', es_name:'Lentejas + Arroz + Verduras salteadas', es_desc:'120g lentejas cocidas · 70g arroz · calabacín + pimiento + tomate', fr_name:'Lentilles + Riz + Légumes sautés', fr_desc:'120g lentilles cuites · 70g riz · courgette + poivron + tomate', ru_name:'Чечевица + Рис + Тушёные овощи', ru_desc:'120г чечевицы · 70г риса · кабачки + перец + помидоры' },
  'Salmão + Bulgur + Salada de pepino':        { en_name:'Salmon + Bulgur + Cucumber Salad', en_desc:'180g grilled salmon · 70g cooked bulgur · cucumber + tomato + lemon', es_name:'Salmón + Bulgur + Ensalada de pepino', es_desc:'180g salmón a la plancha · 70g bulgur cocido · pepino + tomate + limón', fr_name:'Saumon + Boulgour + Salade de concombre', fr_desc:'180g saumon grillé · 70g boulgour cuit · concombre + tomate + citron', ru_name:'Лосось + Булгур + Салат из огурца', ru_desc:'180г лосося · 70г булгура · огурец + помидор + лимон' },
  'Sardinhas grelhadas + Batata-doce + Salada':{ en_name:'Grilled Sardines + Sweet Potato + Salad', en_desc:'3 fresh sardines · 130g sweet potato · lettuce + carrot salad', es_name:'Sardinas a la plancha + Boniato + Ensalada', es_desc:'3 sardinas frescas · 130g boniato · ensalada de lechuga + zanahoria', fr_name:'Sardines grillées + Patate douce + Salade', fr_desc:'3 sardines fraîches · 130g patate douce · salade laitue + carotte', ru_name:'Жареные сардины + Батат + Салат', ru_desc:'3 сардины · 130г батата · салат из латука и моркови' },
  // ── CUT SNACK PM ──
  'Batido de proteína':                    { en_name:'Protein Shake', en_desc:'1 serving whey protein · 200ml unsweetened oat milk', es_name:'Batido de proteína', es_desc:'1 dosis de whey protein · 200ml leche de avena sin azúcar', fr_name:'Shake protéiné', fr_desc:'1 dose whey protein · 200ml lait d\'avoine sans sucre', ru_name:'Протеиновый коктейль', ru_desc:'1 порция протеина · 200мл несладкого овсяного молока' },
  'Ovo cozido + Palitos de cenoura':       { en_name:'Boiled Eggs + Carrot Sticks', en_desc:'2 boiled eggs · 1 medium carrot in sticks', es_name:'Huevo cocido + Palitos de zanahoria', es_desc:'2 huevos cocidos · 1 zanahoria mediana en palitos', fr_name:'Œufs durs + Bâtonnets de carottes', fr_desc:'2 œufs durs · 1 carotte moyenne en bâtonnets', ru_name:'Варёные яйца + Морковные палочки', ru_desc:'2 варёных яйца · 1 морковь, нарезанная палочками' },
  'Torrada integral + Manteiga de amendoim':{ en_name:'Wholegrain Toast + Peanut Butter', en_desc:'1 slice wholegrain bread · 15g natural peanut butter', es_name:'Tostada integral + Mantequilla de cacahuete', es_desc:'1 rebanada pan integral · 15g mantequilla de cacahuete', fr_name:'Toast complet + Beurre de cacahuète', fr_desc:'1 tranche pain complet · 15g beurre de cacahuète naturel', ru_name:'Цельнозерновой тост + Арахисовая паста', ru_desc:'1 ломтик хлеба · 15г арахисовой пасты' },
  'Edamame + Laranja':                     { en_name:'Edamame + Orange', en_desc:'80g edamame boiled with sea salt · 1 orange', es_name:'Edamame + Naranja', es_desc:'80g edamame cocido con sal marina · 1 naranja', fr_name:'Edamame + Orange', fr_desc:'80g edamame cuit avec fleur de sel · 1 orange', ru_name:'Эдамаме + Апельсин', ru_desc:'80г варёного эдамаме с морской солью · 1 апельсин' },
  'Queijo fresco + Tomate + Oregãos':      { en_name:'Fresh Cheese + Tomato + Oregano', en_desc:'100g low-fat fresh cheese · 1 sliced tomato · oregano + olive oil', es_name:'Queso fresco + Tomate + Orégano', es_desc:'100g queso fresco magro · 1 tomate · orégano + aceite', fr_name:'Fromage frais + Tomate + Origan', fr_desc:'100g fromage frais allégé · 1 tomate tranché · origan + huile d\'olive', ru_name:'Свежий сыр + Помидор + Орегано', ru_desc:'100г свежего сыра · 1 помидор · орегано + оливковое масло' },
  'Requeijão + Framboesas + Canela':       { en_name:'Ricotta + Raspberries + Cinnamon', en_desc:'120g low-fat ricotta · 80g fresh raspberries · cinnamon to taste', es_name:'Requesón + Frambuesas + Canela', es_desc:'120g requesón magro · 80g frambuesas frescas · canela', fr_name:'Fromage frais + Framboises + Cannelle', fr_desc:'120g fromage frais maigre · 80g framboises fraîches · cannelle', ru_name:'Творог + Малина + Корица', ru_desc:'120г творога · 80г малины · корица по вкусу' },
  'Sopa de legumes light':                 { en_name:'Light Vegetable Soup', en_desc:'Zucchini, carrot and spinach soup without potato · 300ml', es_name:'Sopa de verduras ligera', es_desc:'Sopa de calabacín, zanahoria y espinacas sin patata · 300ml', fr_name:'Soupe de légumes légère', fr_desc:'Soupe courgette, carotte et épinards sans pomme de terre · 300ml', ru_name:'Лёгкий овощной суп', ru_desc:'Суп из кабачков, моркови и шпината без картофеля · 300мл' },
  // ── CUT DINNER ──
  'Salmão + Batata-doce + Brócolos':    { en_name:'Salmon + Sweet Potato + Broccoli', en_desc:'200g grilled salmon · 120g sweet potato · 100g steamed broccoli', es_name:'Salmón + Boniato + Brócoli', es_desc:'200g salmón a la plancha · 120g boniato · 100g brócoli al vapor', fr_name:'Saumon + Patate douce + Brocoli', fr_desc:'200g saumon grillé · 120g patate douce · 100g brocoli vapeur', ru_name:'Лосось + Батат + Брокколи', ru_desc:'200г лосося · 120г батата · 100г брокколи на пару' },
  'Frango no forno + Legumes assados':   { en_name:'Oven Chicken + Roasted Vegetables', en_desc:'200g chicken · roasted zucchini, pepper, eggplant · olive oil', es_name:'Pollo al horno + Verduras asadas', es_desc:'200g pollo · calabacín, pimiento, berenjena asados · aceite', fr_name:'Poulet au four + Légumes rôtis', fr_desc:'200g poulet · courgette, poivron, aubergine rôtis · huile d\'olive', ru_name:'Запечённая курица + Овощи', ru_desc:'200г курицы · запечённые кабачки, перец, баклажан' },
  'Omelete de claras + Salada completa': { en_name:'Egg White Omelette + Full Salad', en_desc:'5 egg whites + 1 whole egg · lettuce, tomato, cucumber, olives', es_name:'Tortilla de claras + Ensalada completa', es_desc:'5 claras + 1 huevo entero · lechuga, tomate, pepino, aceitunas', fr_name:'Omelette de blancs d\'œufs + Salade complète', fr_desc:'5 blancs d\'œufs + 1 œuf entier · laitue, tomate, concombre, olives', ru_name:'Омлет из белков + Полный салат', ru_desc:'5 белков + 1 целое яйцо · латук, помидор, огурец, оливки' },
  'Tofu + Legumes salteados + Arroz':    { en_name:'Tofu + Sautéed Vegetables + Rice', en_desc:'180g firm tofu · broccoli + mushrooms + pepper · 70g basmati rice', es_name:'Tofu + Verduras salteadas + Arroz', es_desc:'180g tofu firme · brócoli + champiñones + pimiento · 70g arroz basmati', fr_name:'Tofu + Légumes sautés + Riz', fr_desc:'180g tofu ferme · brocoli + champignons + poivron · 70g riz basmati', ru_name:'Тофу + Тушёные овощи + Рис', ru_desc:'180г тофу · брокколи + грибы + перец · 70г риса басмати' },
  'Pescada grelhada + Legumes a vapor':  { en_name:'Grilled Hake + Steamed Vegetables', en_desc:'220g hake · carrot + green beans + cauliflower steamed', es_name:'Merluza a la plancha + Verduras al vapor', es_desc:'220g merluza · zanahoria + judías verdes + coliflor al vapor', fr_name:'Merlu grillé + Légumes vapeur', fr_desc:'220g merlu · carotte + haricots verts + chou-fleur vapeur', ru_name:'Жареный хек + Овощи на пару', ru_desc:'220г хека · морковь + стручковая фасоль + цветная капуста' },
  'Bacalhau + Grão + Couve-galega':      { en_name:'Cod + Chickpeas + Kale', en_desc:'200g boiled cod · 80g chickpeas · kale sautéed with olive oil', es_name:'Bacalao + Garbanzos + Col rizada', es_desc:'200g bacalao cocido · 80g garbanzos · col rizada salteada con aceite', fr_name:'Cabillaud + Pois chiches + Chou kale', fr_desc:'200g cabillaud cuit · 80g pois chiches · chou kale sauté', ru_name:'Треска + Нут + Листовая капуста', ru_desc:'200г трески · 80г нута · листовая капуста с оливковым маслом' },
  'Camarão grelhado + Courgette + Quinoa':{ en_name:'Grilled Shrimp + Zucchini + Quinoa', en_desc:'200g seasoned shrimp · 1 grilled zucchini · 60g cooked quinoa', es_name:'Gambas a la plancha + Calabacín + Quinoa', es_desc:'200g gambas condimentadas · 1 calabacín a la plancha · 60g quinoa', fr_name:'Crevettes grillées + Courgette + Quinoa', fr_desc:'200g crevettes assaisonnées · 1 courgette grillée · 60g quinoa cuit', ru_name:'Жареные креветки + Кабачки + Киноа', ru_desc:'200г креветок · 1 кабачок · 60г варёной киноа' },
  // ── BULK BREAKFAST ──
  'Aveia + Ovos + Manteiga de amendoim + Banana':  { en_name:'Oats + Eggs + Peanut Butter + Banana', en_desc:'100g oats · 4 scrambled eggs · 30g peanut butter · 1 banana', es_name:'Avena + Huevos + Mantequilla de cacahuete + Plátano', es_desc:'100g avena · 4 huevos revueltos · 30g mantequilla de cacahuete · 1 plátano', fr_name:'Avoine + Œufs + Beurre de cacahuète + Banane', fr_desc:'100g flocons d\'avoine · 4 œufs brouillés · 30g beurre de cacahuète · 1 banane', ru_name:'Овсянка + Яйца + Арахисовая паста + Банан', ru_desc:'100г овсянки · 4 яйца · 30г арахисовой пасты · 1 банан' },
  'Tosta integral + Ovos + Abacate':               { en_name:'Wholegrain Toast + Eggs + Avocado', en_desc:'3 slices wholegrain bread · 3 fried eggs · half avocado · tomato', es_name:'Tostada integral + Huevos + Aguacate', es_desc:'3 rebanadas pan integral · 3 huevos fritos · medio aguacate · tomate', fr_name:'Toast complet + Œufs + Avocat', fr_desc:'3 tranches pain complet · 3 œufs au plat · demi-avocat · tomate', ru_name:'Цельнозерновой тост + Яйца + Авокадо', ru_desc:'3 ломтика хлеба · 3 яйца-глазуньи · пол-авокадо · помидор' },
  'Granola + Iogurte grego gordo + Frutos secos':  { en_name:'Granola + Full-Fat Greek Yogurt + Nuts', en_desc:'80g granola · 200g full-fat Greek yogurt · 20g walnuts · 1 banana', es_name:'Granola + Yogur griego entero + Frutos secos', es_desc:'80g granola · 200g yogur griego entero · 20g nueces · 1 plátano', fr_name:'Granola + Yaourt grec entier + Fruits secs', fr_desc:'80g granola · 200g yaourt grec entier · 20g noix · 1 banane', ru_name:'Гранола + Жирный греческий йогурт + Орехи', ru_desc:'80г граноли · 200г йогурта · 20г грецких орехов · 1 банан' },
  'Arroz de leite proteico + Fruta':               { en_name:'Protein Rice Pudding + Fruit', en_desc:'100g rice cooked in 300ml whole milk · 1 serving whey · 1 mango', es_name:'Arroz con leche proteico + Fruta', es_desc:'100g arroz cocido en 300ml leche entera · 1 dosis whey · 1 mango', fr_name:'Riz au lait protéiné + Fruit', fr_desc:'100g riz cuit dans 300ml lait entier · 1 dose whey · 1 mangue', ru_name:'Протеиновый рисовый пудинг + Фрукт', ru_desc:'100г риса в 300мл цельного молока · 1 порция протеина · 1 манго' },
  'Wrap integral + Ovos + Queijo + Peru':          { en_name:'Wholegrain Wrap + Eggs + Cheese + Turkey', en_desc:'2 wholegrain wraps · 3 scrambled eggs · 30g aged cheese · 60g turkey', es_name:'Wrap integral + Huevos + Queso + Pavo', es_desc:'2 wraps integrales · 3 huevos revueltos · 30g queso · 60g pavo', fr_name:'Wrap complet + Œufs + Fromage + Dinde', fr_desc:'2 wraps complets · 3 œufs brouillés · 30g fromage · 60g dinde', ru_name:'Цельнозерновой ролл + Яйца + Сыр + Индейка', ru_desc:'2 ролла · 3 яйца · 30г сыра · 60г индейки' },
  'Batido matinal hipercalórico':                  { en_name:'High-Calorie Morning Shake', en_desc:'100g oats · 1 banana · 30g peanuts · 300ml whole milk · 1 serving whey', es_name:'Batido matutino hipercalórico', es_desc:'100g avena · 1 plátano · 30g cacahuetes · 300ml leche entera · 1 dosis whey', fr_name:'Shake matinal hypercalorique', fr_desc:'100g flocons d\'avoine · 1 banane · 30g cacahuètes · 300ml lait entier · 1 dose whey', ru_name:'Высококалорийный утренний коктейль', ru_desc:'100г овсянки · 1 банан · 30г арахиса · 300мл молока · 1 порция протеина' },
  'Panquecas proteicas + Mirtilos + Requeijão':    { en_name:'Protein Pancakes + Blueberries + Ricotta', en_desc:'100g oats · 3 eggs · 1 serving whey · 100g blueberries · 80g ricotta', es_name:'Tortitas proteicas + Arándanos + Requesón', es_desc:'100g avena · 3 huevos · 1 dosis whey · 100g arándanos · 80g requesón', fr_name:'Pancakes protéinés + Myrtilles + Fromage blanc', fr_desc:'100g flocons d\'avoine · 3 œufs · 1 dose whey · 100g myrtilles · 80g fromage blanc', ru_name:'Протеиновые блины + Черника + Творог', ru_desc:'100г овсянки · 3 яйца · 1 порция протеина · 100г черники · 80г творога' },
  // ── BULK SNACK AM ──
  'Batido hipercalórico':                            { en_name:'High-Calorie Shake', en_desc:'1 serving whey · 1 banana · 30g oats · 200ml whole milk · 15g peanuts', es_name:'Batido hipercalórico', es_desc:'1 dosis whey · 1 plátano · 30g avena · 200ml leche entera · 15g cacahuetes', fr_name:'Shake hypercalorique', fr_desc:'1 dose whey · 1 banane · 30g flocons d\'avoine · 200ml lait entier · 15g cacahuètes', ru_name:'Высококалорийный коктейль', ru_desc:'1 порция протеина · 1 банан · 30г овсянки · 200мл молока · 15г арахиса' },
  'Pão integral + Queijo + Ovo cozido':              { en_name:'Wholegrain Bread + Cheese + Boiled Egg', en_desc:'2 slices bread · 2 slices cheese · 2 boiled eggs', es_name:'Pan integral + Queso + Huevo cocido', es_desc:'2 rebanadas pan · 2 lonchas de queso · 2 huevos cocidos', fr_name:'Pain complet + Fromage + Œuf dur', fr_desc:'2 tranches pain · 2 tranches fromage · 2 œufs durs', ru_name:'Цельнозерновой хлеб + Сыр + Варёное яйцо', ru_desc:'2 ломтика хлеба · 2 ломтика сыра · 2 варёных яйца' },
  'Iogurte grego gordo + Fruta + Mel + Oleaginosas':{ en_name:'Full-Fat Greek Yogurt + Fruit + Honey + Nuts', en_desc:'200g full-fat yogurt · 1 apple · 1 tbsp honey · 20g nut mix', es_name:'Yogur griego entero + Fruta + Miel + Oleaginosas', es_desc:'200g yogur griego entero · 1 manzana · 1 c.s. miel · 20g mix de frutos secos', fr_name:'Yaourt grec entier + Fruit + Miel + Oléagineux', fr_desc:'200g yaourt grec entier · 1 pomme · 1 c.s. miel · 20g mix d\'oléagineux', ru_name:'Жирный греческий йогурт + Фрукт + Мёд + Орехи', ru_desc:'200г йогурта · 1 яблоко · 1 ст.л. мёда · 20г смеси орехов' },
  'Batata-doce + Frango desfiado + Azeite':          { en_name:'Sweet Potato + Pulled Chicken + Olive Oil', en_desc:'150g boiled sweet potato · 120g pulled chicken · olive oil + salt', es_name:'Boniato + Pollo deshilachado + Aceite de oliva', es_desc:'150g boniato cocido · 120g pollo deshilachado · aceite de oliva + sal', fr_name:'Patate douce + Poulet effiloché + Huile d\'olive', fr_desc:'150g patate douce cuite · 120g poulet effiloché · huile d\'olive + sel', ru_name:'Батат + Тушёная курица + Оливковое масло', ru_desc:'150г варёного батата · 120г тушёной курицы · оливковое масло' },
  'Fruta + Pasta de amendoim + Biscoitos aveia':     { en_name:'Fruit + Peanut Butter + Oat Biscuits', en_desc:'1 banana · 25g peanut butter · 3 wholegrain oat biscuits', es_name:'Fruta + Crema de cacahuete + Galletas de avena', es_desc:'1 plátano · 25g crema de cacahuete · 3 galletas de avena integral', fr_name:'Fruit + Beurre de cacahuète + Biscuits avoine', fr_desc:'1 banane · 25g beurre de cacahuète · 3 biscuits avoine intégraux', ru_name:'Фрукт + Арахисовая паста + Овсяное печенье', ru_desc:'1 банан · 25г арахисовой пасты · 3 цельнозерновых печенья' },
  'Tosta de ricotta + Mel + Nozes':                  { en_name:'Ricotta Toast + Honey + Walnuts', en_desc:'2 wholegrain toasts · 80g ricotta · 1 tbsp honey · 15g chopped walnuts', es_name:'Tostada de ricotta + Miel + Nueces', es_desc:'2 tostadas integrales · 80g ricotta · 1 c.s. miel · 15g nueces', fr_name:'Toast ricotta + Miel + Noix', fr_desc:'2 toasts intégraux · 80g ricotta · 1 c.s. miel · 15g noix', ru_name:'Тост с рикоттой + Мёд + Грецкие орехи', ru_desc:'2 тоста · 80г рикотты · 1 ст.л. мёда · 15г грецких орехов' },
  'Queijo cottage + Banana + Granola':               { en_name:'Cottage Cheese + Banana + Granola', en_desc:'180g cottage cheese · 1 sliced banana · 40g crunchy granola', es_name:'Queso cottage + Plátano + Granola', es_desc:'180g queso cottage · 1 plátano en rodajas · 40g granola crujiente', fr_name:'Fromage blanc + Banane + Granola', fr_desc:'180g fromage blanc · 1 banane tranchée · 40g granola croustillant', ru_name:'Творог + Банан + Гранола', ru_desc:'180г творога · 1 нарезанный банан · 40г гранолы' },
  // ── BULK LUNCH ──
  'Arroz + Frango + Feijão + Legumes':           { en_name:'Rice + Chicken + Beans + Vegetables', en_desc:'200g chicken · 150g white rice · 60g beans · sautéed vegetables', es_name:'Arroz + Pollo + Frijoles + Verduras', es_desc:'200g pollo · 150g arroz blanco · 60g frijoles · verduras salteadas', fr_name:'Riz + Poulet + Haricots + Légumes', fr_desc:'200g poulet · 150g riz blanc · 60g haricots · légumes sautés', ru_name:'Рис + Курица + Фасоль + Овощи', ru_desc:'200г курицы · 150г белого риса · 60г фасоли · тушёные овощи' },
  'Massa integral + Carne picada + Molho tomate':{ en_name:'Wholegrain Pasta + Minced Meat + Tomato Sauce', en_desc:'150g wholegrain pasta · 200g lean minced meat · homemade sauce', es_name:'Pasta integral + Carne picada + Salsa de tomate', es_desc:'150g pasta integral · 200g carne picada magra · salsa casera', fr_name:'Pâtes complètes + Viande hachée + Sauce tomate', fr_desc:'150g pâtes complètes · 200g viande hachée maigre · sauce maison', ru_name:'Цельнозерновая паста + Фарш + Томатный соус', ru_desc:'150г пасты · 200г нежирного фарша · домашний соус' },
  'Bife de vaca + Batata cozida + Salada':        { en_name:'Beef Steak + Boiled Potato + Salad', en_desc:'200g beef steak · 200g boiled potato · colourful salad with olive oil', es_name:'Filete de ternera + Patata cocida + Ensalada', es_desc:'200g filete de ternera · 200g patata cocida · ensalada colorida con aceite', fr_name:'Bifteck + Pomme de terre cuite + Salade', fr_desc:'200g bifteck · 200g pomme de terre cuite · salade colorée à l\'huile', ru_name:'Говяжий стейк + Варёный картофель + Салат', ru_desc:'200г говядины · 200г варёного картофеля · цветной салат с маслом' },
  'Salmão + Arroz basmati + Legumes':             { en_name:'Salmon + Basmati Rice + Vegetables', en_desc:'220g oven salmon · 150g basmati rice · broccoli + carrot', es_name:'Salmón + Arroz basmati + Verduras', es_desc:'220g salmón al horno · 150g arroz basmati · brócoli + zanahoria', fr_name:'Saumon + Riz basmati + Légumes', fr_desc:'220g saumon au four · 150g riz basmati · brocoli + carotte', ru_name:'Лосось + Рис басмати + Овощи', ru_desc:'220г запечённого лосося · 150г риса басмати · брокколи + морковь' },
  'Frango + Massa + Pesto + Espinafres':          { en_name:'Chicken + Pasta + Pesto + Spinach', en_desc:'200g grilled chicken · 150g wholegrain pasta · 2 tbsp pesto · spinach', es_name:'Pollo + Pasta + Pesto + Espinacas', es_desc:'200g pollo a la plancha · 150g pasta integral · 2 c.s. pesto · espinacas', fr_name:'Poulet + Pâtes + Pesto + Épinards', fr_desc:'200g poulet grillé · 150g pâtes complètes · 2 c.s. pesto · épinards', ru_name:'Курица + Паста + Песто + Шпинат', ru_desc:'200г куриного филе · 150г пасты · 2 ст.л. песто · шпинат' },
  'Bife de atum + Arroz + Feijão verde':          { en_name:'Tuna Steak + Rice + Green Beans', en_desc:'220g grilled tuna steak · 130g white rice · sautéed green beans', es_name:'Filete de atún + Arroz + Judías verdes', es_desc:'220g filete de atún a la plancha · 130g arroz blanco · judías verdes', fr_name:'Steak de thon + Riz + Haricots verts', fr_desc:'220g steak de thon grillé · 130g riz blanc · haricots verts sautés', ru_name:'Стейк из тунца + Рис + Стручковая фасоль', ru_desc:'220г стейка из тунца · 130г белого риса · стручковая фасоль' },
  'Lasanha de carne + Salada verde':              { en_name:'Meat Lasagna + Green Salad', en_desc:'300g homemade lean meat lasagna · lettuce + tomato salad', es_name:'Lasaña de carne + Ensalada verde', es_desc:'300g lasaña de carne magra casera · ensalada de lechuga + tomate', fr_name:'Lasagne à la viande + Salade verte', fr_desc:'300g lasagne maison viande maigre · salade laitue + tomate', ru_name:'Мясная лазанья + Зелёный салат', ru_desc:'300г домашней лазаньи из нежирного мяса · салат из латука + помидора' },
  // ── BULK SNACK PM ──
  'Pão integral + Atum + Fruta':             { en_name:'Wholegrain Bread + Tuna + Fruit', en_desc:'2 slices wholegrain bread · 1 can natural tuna · 1 large apple', es_name:'Pan integral + Atún + Fruta', es_desc:'2 rebanadas pan integral · 1 lata atún al natural · 1 manzana grande', fr_name:'Pain complet + Thon + Fruit', fr_desc:'2 tranches pain complet · 1 boîte thon naturel · 1 grande pomme', ru_name:'Цельнозерновой хлеб + Тунец + Фрукт', ru_desc:'2 ломтика хлеба · 1 банка тунца · 1 большое яблоко' },
  'Batido de massa muscular':                { en_name:'Mass Gainer Shake', en_desc:'1 serving mass gainer · 300ml whole milk · 1 banana', es_name:'Batido de ganancia muscular', es_desc:'1 dosis mass gainer · 300ml leche entera · 1 plátano', fr_name:'Shake de prise de masse', fr_desc:'1 dose mass gainer · 300ml lait entier · 1 banane', ru_name:'Гейнер-коктейль', ru_desc:'1 порция гейнера · 300мл цельного молока · 1 банан' },
  'Crepioca + Queijo + Peru':                { en_name:'Tapioca Crêpe + Cheese + Turkey', en_desc:'2 tapioca crêpes (egg + tapioca) · cheese · turkey ham', es_name:'Crepioca + Queso + Pavo', es_desc:'2 crepiocas (huevo + tapioca) · queso flamenco · jamón de pavo', fr_name:'Crêpe tapioca + Fromage + Dinde', fr_desc:'2 crêpes tapioca (œuf + tapioca) · fromage · jambon de dinde', ru_name:'Тапиока + Сыр + Индейка', ru_desc:'2 блинчика (яйцо + тапиока) · сыр · ветчина из индейки' },
  'Arroz + Ovo estrelado + Legumes':         { en_name:'Rice + Fried Egg + Vegetables', en_desc:'120g white rice · 2 eggs fried in olive oil · green beans', es_name:'Arroz + Huevo frito + Verduras', es_desc:'120g arroz blanco · 2 huevos fritos en aceite · judías verdes', fr_name:'Riz + Œuf au plat + Légumes', fr_desc:'120g riz blanc · 2 œufs au plat à l\'huile d\'olive · haricots verts', ru_name:'Рис + Яичница + Овощи', ru_desc:'120г белого риса · 2 яйца-глазуньи на оливковом масле · фасоль' },
  'Queijo cottage + Frutos vermelhos + Mel': { en_name:'Cottage Cheese + Berries + Honey', en_desc:'200g cottage cheese · 100g blueberries or strawberries · 1 tbsp honey', es_name:'Queso cottage + Frutos rojos + Miel', es_desc:'200g queso cottage · 100g arándanos o fresas · 1 c.s. miel', fr_name:'Fromage blanc + Fruits rouges + Miel', fr_desc:'200g fromage blanc · 100g myrtilles ou fraises · 1 c.s. miel', ru_name:'Творог + Ягоды + Мёд', ru_desc:'200г творога · 100г черники или клубники · 1 ст.л. мёда' },
  'Batido banana + Amendoim + Aveia + Leite':{ en_name:'Banana + Peanut + Oat + Milk Shake', en_desc:'1 banana · 25g peanut butter · 40g oats · 250ml whole milk', es_name:'Batido plátano + Cacahuete + Avena + Leche', es_desc:'1 plátano · 25g pasta de cacahuete · 40g avena · 250ml leche entera', fr_name:'Shake banane + Cacahuète + Avoine + Lait', fr_desc:'1 banane · 25g beurre de cacahuète · 40g flocons d\'avoine · 250ml lait entier', ru_name:'Коктейль банан + Арахис + Овсянка + Молоко', ru_desc:'1 банан · 25г арахисовой пасты · 40г овсянки · 250мл молока' },
  'Sanduíche de peru + Abacate + Tomate':    { en_name:'Turkey Sandwich + Avocado + Tomato', en_desc:'2 slices wholegrain bread · 80g sliced turkey · ¼ avocado · tomato', es_name:'Sándwich de pavo + Aguacate + Tomate', es_desc:'2 rebanadas pan integral · 80g pavo en lonchas · ¼ aguacate · tomate', fr_name:'Sandwich dinde + Avocat + Tomate', fr_desc:'2 tranches pain complet · 80g dinde en tranches · ¼ avocat · tomate', ru_name:'Сэндвич с индейкой + Авокадо + Помидор', ru_desc:'2 ломтика хлеба · 80г нарезанной индейки · ¼ авокадо · помидор' },
  // ── BULK DINNER ──
  'Massa + Carne moída + Salada':    { en_name:'Pasta + Minced Meat + Salad', en_desc:'150g pasta · 200g lean minced meat · tomato sauce · salad', es_name:'Pasta + Carne molida + Ensalada', es_desc:'150g pasta · 200g carne molida magra · salsa de tomate · ensalada', fr_name:'Pâtes + Viande hachée + Salade', fr_desc:'150g pâtes · 200g viande hachée maigre · sauce tomate · salade', ru_name:'Паста + Мясной фарш + Салат', ru_desc:'150г пасты · 200г нежирного фарша · томатный соус · салат' },
  'Arroz + Salmão + Batata-doce':    { en_name:'Rice + Salmon + Sweet Potato', en_desc:'120g rice · 200g salmon · 150g sweet potato · broccoli', es_name:'Arroz + Salmón + Boniato', es_desc:'120g arroz · 200g salmón · 150g boniato · brócoli', fr_name:'Riz + Saumon + Patate douce', fr_desc:'120g riz · 200g saumon · 150g patate douce · brocoli', ru_name:'Рис + Лосось + Батат', ru_desc:'120г риса · 200г лосося · 150г батата · брокколи' },
  'Wrap integral + Frango + Legumes':{ en_name:'Wholegrain Wrap + Chicken + Vegetables', en_desc:'2 wholegrain wraps · 180g pulled chicken · grilled vegetables · hummus', es_name:'Wrap integral + Pollo + Verduras', es_desc:'2 wraps integrales · 180g pollo deshilachado · verduras a la plancha · hummus', fr_name:'Wrap complet + Poulet + Légumes', fr_desc:'2 wraps complets · 180g poulet effiloché · légumes grillés · houmous', ru_name:'Цельнозерновой ролл + Курица + Овощи', ru_desc:'2 ролла · 180г тушёной курицы · жареные овощи · хумус' },
  'Bife de peru + Batata-doce + Grão':{ en_name:'Turkey Steak + Sweet Potato + Chickpeas', en_desc:'200g turkey steak · 150g roasted sweet potato · 60g seasoned chickpeas', es_name:'Filete de pavo + Boniato + Garbanzos', es_desc:'200g filete de pavo · 150g boniato asado · 60g garbanzos condimentados', fr_name:'Steak de dinde + Patate douce + Pois chiches', fr_desc:'200g steak de dinde · 150g patate douce rôtie · 60g pois chiches assaisonnés', ru_name:'Стейк из индейки + Батат + Нут', ru_desc:'200г стейка индейки · 150г запечённого батата · 60г нута' },
  'Ovos + Arroz integral + Legumes':  { en_name:'Eggs + Brown Rice + Vegetables', en_desc:'3 scrambled eggs · 100g brown rice · spinach + sautéed mushrooms', es_name:'Huevos + Arroz integral + Verduras', es_desc:'3 huevos revueltos · 100g arroz integral · espinacas + champiñones', fr_name:'Œufs + Riz complet + Légumes', fr_desc:'3 œufs brouillés · 100g riz complet · épinards + champignons sautés', ru_name:'Яйца + Бурый рис + Овощи', ru_desc:'3 яйца · 100г бурого риса · шпинат + грибы' },
  'Frango assado + Batatas + Salada': { en_name:'Roast Chicken + Potatoes + Salad', en_desc:'220g oven-roasted chicken · 180g roasted potatoes with olive oil · salad', es_name:'Pollo asado + Patatas + Ensalada', es_desc:'220g pollo asado al horno · 180g patatas asadas con aceite · ensalada', fr_name:'Poulet rôti + Pommes de terre + Salade', fr_desc:'220g poulet rôti au four · 180g pommes de terre rôties à l\'huile · salade', ru_name:'Запечённая курица + Картофель + Салат', ru_desc:'220г запечённой курицы · 180г картофеля с маслом · салат' },
  'Salmão + Quinoa + Brócolos':       { en_name:'Salmon + Quinoa + Broccoli', en_desc:'220g oven salmon · 100g cooked quinoa · 120g broccoli + lemon', es_name:'Salmón + Quinoa + Brócoli', es_desc:'220g salmón al horno · 100g quinoa cocida · 120g brócoli + limón', fr_name:'Saumon + Quinoa + Brocoli', fr_desc:'220g saumon au four · 100g quinoa cuit · 120g brocoli + citron', ru_name:'Лосось + Киноа + Брокколи', ru_desc:'220г лосося · 100г варёной киноа · 120г брокколи + лимон' },
  // ── MAINTAIN BREAKFAST ──
  'Ovos mexidos + Torradas integrais + Fruta':{ en_name:'Scrambled Eggs + Wholegrain Toast + Fruit', en_desc:'3 eggs · 2 wholegrain toasts · 1 piece of fruit of choice', es_name:'Huevos revueltos + Tostadas integrales + Fruta', es_desc:'3 huevos · 2 tostadas integrales · 1 pieza de fruta a elegir', fr_name:'Œufs brouillés + Toasts complets + Fruit', fr_desc:'3 œufs · 2 toasts complets · 1 fruit au choix', ru_name:'Яичница-болтунья + Цельнозерновой тост + Фрукт', ru_desc:'3 яйца · 2 тоста · 1 фрукт на выбор' },
  'Smoothie bowl proteico':                    { en_name:'Protein Smoothie Bowl', en_desc:'1 serving whey · 150ml milk · 1 frozen banana · 30g granola · berries', es_name:'Smoothie bowl proteico', es_desc:'1 dosis whey · 150ml leche · 1 banana congelada · 30g granola · frutos rojos', fr_name:'Smoothie bowl protéiné', fr_desc:'1 dose whey · 150ml lait · 1 banane congelée · 30g granola · fruits rouges', ru_name:'Протеиновый смузи-боул', ru_desc:'1 порция протеина · 150мл молока · 1 замороженный банан · 30г граноли · ягоды' },
  'Iogurte natural + Aveia + Banana + Canela': { en_name:'Natural Yogurt + Oats + Banana + Cinnamon', en_desc:'180g natural yogurt · 50g oats · 1 sliced banana · cinnamon to taste', es_name:'Yogur natural + Avena + Plátano + Canela', es_desc:'180g yogur natural · 50g avena · 1 plátano en rodajas · canela al gusto', fr_name:'Yaourt nature + Avoine + Banane + Cannelle', fr_desc:'180g yaourt nature · 50g flocons d\'avoine · 1 banane tranchée · cannelle', ru_name:'Натуральный йогурт + Овсянка + Банан + Корица', ru_desc:'180г йогурта · 50г овсянки · 1 нарезанный банан · корица' },
  'Tosta de abacate + Ovo escalfado':          { en_name:'Avocado Toast + Poached Egg', en_desc:'2 slices wholegrain bread · ½ mashed avocado · 2 poached eggs · lemon', es_name:'Tostada de aguacate + Huevo pochado', es_desc:'2 rebanadas pan integral · ½ aguacate machacado · 2 huevos pochados · limón', fr_name:'Toast avocat + Œuf poché', fr_desc:'2 tranches pain complet · ½ avocat écrasé · 2 œufs pochés · citron', ru_name:'Тост с авокадо + Яйцо-пашот', ru_desc:'2 ломтика хлеба · ½ авокадо · 2 яйца-пашот · лимон' },
  'Fruta fresca + Sementes + Chá verde':       { en_name:'Fresh Fruit + Seeds + Green Tea', en_desc:'1 bowl of melon, kiwi and strawberries · 10g mixed seeds · 1 green tea', es_name:'Fruta fresca + Semillas + Té verde', es_desc:'1 bol de melón, kiwi y fresas · 10g semillas mixtas · 1 té verde', fr_name:'Fruits frais + Graines + Thé vert', fr_desc:'1 bol de melon, kiwi et fraises · 10g graines mélangées · 1 thé vert', ru_name:'Свежие фрукты + Семена + Зелёный чай', ru_desc:'1 миска дыни, киви и клубники · 10г смеси семян · 1 зелёный чай' },
  'Chia pudding + Manga + Coco':               { en_name:'Chia Pudding + Mango + Coconut', en_desc:'40g chia seeds + 200ml coconut milk · ½ mango · shredded coconut to taste', es_name:'Pudding de chía + Mango + Coco', es_desc:'40g semillas chía + 200ml leche de coco · ½ mango · coco rallado al gusto', fr_name:'Pudding chia + Mangue + Noix de coco', fr_desc:'40g graines chia + 200ml lait de coco · ½ mangue · noix de coco râpée', ru_name:'Чиа-пудинг + Манго + Кокос', ru_desc:'40г семян чиа + 200мл кокосового молока · ½ манго · кокосовая стружка' },
  'Pão de centeio + Salmão fumado + Queijo':   { en_name:'Rye Bread + Smoked Salmon + Cheese', en_desc:'2 slices rye bread · 80g smoked salmon · 50g light cream cheese', es_name:'Pan de centeno + Salmón ahumado + Queso', es_desc:'2 rebanadas pan de centeno · 80g salmón ahumado · 50g queso crema light', fr_name:'Pain de seigle + Saumon fumé + Fromage', fr_desc:'2 tranches pain de seigle · 80g saumon fumé · 50g fromage frais léger', ru_name:'Ржаной хлеб + Копчёный лосось + Сыр', ru_desc:'2 ломтика ржаного хлеба · 80г копчёного лосося · 50г лёгкого сливочного сыра' },
  // ── MAINTAIN SNACK AM ──
  'Iogurte + Frutos secos':         { en_name:'Yogurt + Nuts', en_desc:'150g natural yogurt · 20g nut mix (walnuts, almonds)', es_name:'Yogur + Frutos secos', es_desc:'150g yogur natural · 20g mix de frutos secos (nueces, almendras)', fr_name:'Yaourt + Fruits secs', fr_desc:'150g yaourt nature · 20g mix d\'oléagineux (noix, amandes)', ru_name:'Йогурт + Орехи', ru_desc:'150г натурального йогурта · 20г смеси орехов' },
  'Fruta + Queijo fresco':          { en_name:'Fruit + Fresh Cheese', en_desc:'1 pear or apple · 100g low-fat fresh cheese', es_name:'Fruta + Queso fresco', es_desc:'1 pera o manzana · 100g queso fresco magro', fr_name:'Fruit + Fromage frais', fr_desc:'1 poire ou pomme · 100g fromage frais allégé', ru_name:'Фрукт + Свежий сыр', ru_desc:'1 груша или яблоко · 100г нежирного свежего сыра' },
  'Barrinha proteica':              { en_name:'Protein Bar', en_desc:'1 protein bar (min. 15g protein, max. 200 kcal)', es_name:'Barrita proteica', es_desc:'1 barrita proteica (mín. 15g proteína, máx. 200 kcal)', fr_name:'Barre protéinée', fr_desc:'1 barre protéinée (min. 15g protéines, max. 200 kcal)', ru_name:'Протеиновый батончик', ru_desc:'1 протеиновый батончик (мин. 15г белка, макс. 200 ккал)' },
  'Cenoura + Pepino + Hummus':      { en_name:'Carrot + Cucumber + Hummus', en_desc:'1 carrot + ½ cucumber in sticks · 50g homemade hummus', es_name:'Zanahoria + Pepino + Hummus', es_desc:'1 zanahoria + ½ pepino en palitos · 50g hummus casero', fr_name:'Carotte + Concombre + Houmous', fr_desc:'1 carotte + ½ concombre en bâtonnets · 50g houmous maison', ru_name:'Морковь + Огурец + Хумус', ru_desc:'1 морковь + ½ огурца, нарезанных · 50г хумуса' },
  'Peça de fruta + Proteína em pó': { en_name:'Piece of Fruit + Protein Powder', en_desc:'1 banana or apple · 1 scoop protein dissolved in 150ml water', es_name:'Pieza de fruta + Proteína en polvo', es_desc:'1 banana o manzana · 1 scoop proteína en 150ml agua', fr_name:'Fruit + Protéine en poudre', fr_desc:'1 banane ou pomme · 1 dose protéine dans 150ml eau', ru_name:'Фрукт + Протеин в порошке', ru_desc:'1 банан или яблоко · 1 скуп протеина в 150мл воды' },
  'Requeijão + Mirtilos + Mel':     { en_name:'Ricotta + Blueberries + Honey', en_desc:'100g ricotta · 60g fresh blueberries · 1 tsp honey', es_name:'Requesón + Arándanos + Miel', es_desc:'100g requesón · 60g arándanos frescos · 1 c.c. miel', fr_name:'Fromage blanc + Myrtilles + Miel', fr_desc:'100g fromage blanc · 60g myrtilles fraîches · 1 c.c. miel', ru_name:'Творог + Черника + Мёд', ru_desc:'100г творога · 60г свежей черники · 1 ч.л. мёда' },
  'Mix de oleaginosas + 1 tâmara':  { en_name:'Nut Mix + 1 Date', en_desc:'20g mix of walnuts, almonds and cashews · 1 medjool date', es_name:'Mix de oleaginosas + 1 dátil', es_desc:'20g mix de nueces, almendras y anacardos · 1 dátil medjool', fr_name:'Mélange d\'oléagineux + 1 datte', fr_desc:'20g mix noix, amandes et noix de cajou · 1 datte medjool', ru_name:'Смесь орехов + 1 финик', ru_desc:'20г смеси грецких орехов, миндаля и кешью · 1 финик медджул' },
  // ── MAINTAIN LUNCH ──
  'Frango + Arroz integral + Vegetais':       { en_name:'Chicken + Brown Rice + Vegetables', en_desc:'180g grilled chicken · 100g brown rice · mixed vegetables + salad', es_name:'Pollo + Arroz integral + Vegetales', es_desc:'180g pollo a la plancha · 100g arroz integral · verduras variadas + ensalada', fr_name:'Poulet + Riz complet + Légumes', fr_desc:'180g poulet grillé · 100g riz complet · légumes variés + salade', ru_name:'Курица + Бурый рис + Овощи', ru_desc:'180г куриного филе · 100г бурого риса · разнообразные овощи + салат' },
  'Sopa de legumes + Omelete + Salada':       { en_name:'Vegetable Soup + Omelette + Salad', en_desc:'Homemade soup · 3-egg omelette with vegetables · green salad', es_name:'Sopa de verduras + Tortilla + Ensalada', es_desc:'Sopa casera · tortilla 3 huevos con verduras · ensalada verde', fr_name:'Soupe de légumes + Omelette + Salade', fr_desc:'Soupe maison · omelette 3 œufs avec légumes · salade verte', ru_name:'Овощной суп + Омлет + Салат', ru_desc:'Домашний суп · омлет из 3 яиц с овощами · зелёный салат' },
  'Quinoa + Atum + Legumes salteados':        { en_name:'Quinoa + Tuna + Sautéed Vegetables', en_desc:'80g quinoa · 1 can natural tuna · spinach, cherry tomatoes, cucumber', es_name:'Quinoa + Atún + Verduras salteadas', es_desc:'80g quinoa · 1 lata atún al natural · espinacas, tomates cherry, pepino', fr_name:'Quinoa + Thon + Légumes sautés', fr_desc:'80g quinoa · 1 boîte thon naturel · épinards, tomates cerises, concombre', ru_name:'Киноа + Тунец + Тушёные овощи', ru_desc:'80г киноа · 1 банка тунца · шпинат, помидоры черри, огурец' },
  'Bife de peru + Batata-doce + Salada':      { en_name:'Turkey Steak + Sweet Potato + Salad', en_desc:'180g turkey steak · 120g roasted sweet potato · green leaf salad', es_name:'Filete de pavo + Boniato + Ensalada', es_desc:'180g filete de pavo · 120g boniato asado · ensalada de hojas verdes', fr_name:'Steak de dinde + Patate douce + Salade', fr_desc:'180g steak de dinde · 120g patate douce rôtie · salade de feuilles vertes', ru_name:'Стейк из индейки + Батат + Салат', ru_desc:'180г стейка индейки · 120г запечённого батата · салат из зелени' },
  'Lentilhas + Legumes + Arroz':              { en_name:'Lentils + Vegetables + Rice', en_desc:'120g lentils · sautéed carrot + zucchini · 70g basmati rice', es_name:'Lentejas + Verduras + Arroz', es_desc:'120g lentejas · zanahoria + calabacín salteados · 70g arroz basmati', fr_name:'Lentilles + Légumes + Riz', fr_desc:'120g lentilles · carotte + courgette sautés · 70g riz basmati', ru_name:'Чечевица + Овощи + Рис', ru_desc:'120г чечевицы · морковь + кабачки · 70г риса басмати' },
  'Camarão + Arroz de coentros + Brócolos':   { en_name:'Shrimp + Coriander Rice + Broccoli', en_desc:'180g grilled shrimp · 100g coriander rice · 100g broccoli', es_name:'Gambas + Arroz de cilantro + Brócoli', es_desc:'180g gambas a la plancha · 100g arroz de cilantro · 100g brócoli', fr_name:'Crevettes + Riz à la coriandre + Brocoli', fr_desc:'180g crevettes grillées · 100g riz à la coriandre · 100g brocoli', ru_name:'Креветки + Рис с кориандром + Брокколи', ru_desc:'180г жареных креветок · 100г риса с кориандром · 100г брокколи' },
  'Prego magro + Salada + Pão integral':      { en_name:'Lean Beef Sandwich + Salad + Wholegrain Bread', en_desc:'180g lean beef steak · wholegrain bread · lettuce + tomato + mustard', es_name:'Bistec magro + Ensalada + Pan integral', es_desc:'180g filete de ternera magro · pan integral · lechuga + tomate + mostaza', fr_name:'Bifteck maigre + Salade + Pain complet', fr_desc:'180g bifteck maigre · pain complet · laitue + tomate + moutarde', ru_name:'Постный стейк + Салат + Цельнозерновой хлеб', ru_desc:'180г постной говядины · цельнозерновой хлеб · латук + помидор + горчица' },
  // ── MAINTAIN SNACK PM ──
  'Batido proteico + Fruta':        { en_name:'Protein Shake + Fruit', en_desc:'1 serving protein · 200ml water or plant milk · 1 piece of fruit', es_name:'Batido proteico + Fruta', es_desc:'1 dosis proteína · 200ml agua o leche vegetal · 1 pieza de fruta', fr_name:'Shake protéiné + Fruit', fr_desc:'1 dose protéine · 200ml eau ou lait végétal · 1 fruit', ru_name:'Протеиновый коктейль + Фрукт', ru_desc:'1 порция протеина · 200мл воды или растительного молока · 1 фрукт' },
  'Torrada integral + Abacate':     { en_name:'Wholegrain Toast + Avocado', en_desc:'1 slice wholegrain bread · ¼ mashed avocado · salt · lemon', es_name:'Tostada integral + Aguacate', es_desc:'1 rebanada pan integral · ¼ aguacate machacado · sal · limón', fr_name:'Toast complet + Avocat', fr_desc:'1 tranche pain complet · ¼ avocat écrasé · sel · citron', ru_name:'Цельнозерновой тост + Авокадо', ru_desc:'1 ломтик хлеба · ¼ авокадо · соль · лимон' },
  'Requeijão + Mel + Nozes':        { en_name:'Ricotta + Honey + Walnuts', en_desc:'150g ricotta · 1 tsp honey · 10g chopped walnuts', es_name:'Requesón + Miel + Nueces', es_desc:'150g requesón · 1 c.c. miel · 10g nueces picadas', fr_name:'Fromage blanc + Miel + Noix', fr_desc:'150g fromage blanc · 1 c.c. miel · 10g noix hachées', ru_name:'Творог + Мёд + Грецкие орехи', ru_desc:'150г творога · 1 ч.л. мёда · 10г грецких орехов' },
  'Frutos vermelhos + Iogurte grego':{ en_name:'Berries + Greek Yogurt', en_desc:'100g blueberries or strawberries · 150g natural Greek yogurt', es_name:'Frutos rojos + Yogur griego', es_desc:'100g arándanos o fresas · 150g yogur griego natural', fr_name:'Fruits rouges + Yaourt grec', fr_desc:'100g myrtilles ou fraises · 150g yaourt grec nature', ru_name:'Ягоды + Греческий йогурт', ru_desc:'100г черники или клубники · 150г натурального греческого йогурта' },
  'Banana + Pasta de amendoim':     { en_name:'Banana + Peanut Butter', en_desc:'1 medium banana · 15g natural peanut butter', es_name:'Plátano + Crema de cacahuete', es_desc:'1 plátano mediano · 15g crema de cacahuete natural', fr_name:'Banane + Beurre de cacahuète', fr_desc:'1 banane moyenne · 15g beurre de cacahuète naturel', ru_name:'Банан + Арахисовая паста', ru_desc:'1 средний банан · 15г натуральной арахисовой пасты' },
  'Kiwi + Amêndoas + Queijo fresco':{ en_name:'Kiwi + Almonds + Fresh Cheese', en_desc:'2 kiwis · 15g almonds · 80g low-fat fresh cheese', es_name:'Kiwi + Almendras + Queso fresco', es_desc:'2 kiwis · 15g almendras · 80g queso fresco magro', fr_name:'Kiwi + Amandes + Fromage frais', fr_desc:'2 kiwis · 15g amandes · 80g fromage frais allégé', ru_name:'Киви + Миндаль + Свежий сыр', ru_desc:'2 киви · 15г миндаля · 80г нежирного свежего сыра' },
  // ── MAINTAIN DINNER ──
  'Peixe grelhado + Legumes + Salada':       { en_name:'Grilled Fish + Vegetables + Salad', en_desc:'200g white or fatty fish · steamed vegetables · green salad with olive oil', es_name:'Pescado a la plancha + Verduras + Ensalada', es_desc:'200g pescado blanco o graso · verduras al vapor · ensalada verde con aceite', fr_name:'Poisson grillé + Légumes + Salade', fr_desc:'200g poisson blanc ou gras · légumes vapeur · salade verte à l\'huile d\'olive', ru_name:'Жареная рыба + Овощи + Салат', ru_desc:'200г белой или жирной рыбы · овощи на пару · зелёный салат с маслом' },
  'Frango no forno + Arroz + Cenoura':       { en_name:'Oven Chicken + Rice + Carrot', en_desc:'180g chicken · 80g rice · 100g roasted carrot · olive oil', es_name:'Pollo al horno + Arroz + Zanahoria', es_desc:'180g pollo · 80g arroz · 100g zanahoria asada · aceite de oliva', fr_name:'Poulet au four + Riz + Carotte', fr_desc:'180g poulet · 80g riz · 100g carotte rôtie · huile d\'olive', ru_name:'Курица в духовке + Рис + Морковь', ru_desc:'180г курицы · 80г риса · 100г запечённой моркови · оливковое масло' },
  'Sopa creme + Ovo cozido + Pão integral':  { en_name:'Cream Soup + Boiled Egg + Wholegrain Bread', en_desc:'Vegetable cream soup · 2 boiled eggs · 1 slice wholegrain bread', es_name:'Crema de verduras + Huevo cocido + Pan integral', es_desc:'Sopa crema de verduras · 2 huevos cocidos · 1 rebanada pan integral', fr_name:'Velouté + Œuf dur + Pain complet', fr_desc:'Velouté de légumes · 2 œufs durs · 1 tranche pain complet', ru_name:'Крем-суп + Варёное яйцо + Цельнозерновой хлеб', ru_desc:'Крем-суп из овощей · 2 варёных яйца · 1 ломтик хлеба' },
  'Tofu + Legumes no wok + Arroz integral':  { en_name:'Tofu + Wok Vegetables + Brown Rice', en_desc:'180g sautéed firm tofu · broccoli + pepper + mushrooms · 80g rice', es_name:'Tofu + Verduras al wok + Arroz integral', es_desc:'180g tofu firme salteado · brócoli + pimiento + champiñones · 80g arroz', fr_name:'Tofu + Légumes au wok + Riz complet', fr_desc:'180g tofu ferme sauté · brocoli + poivron + champignons · 80g riz', ru_name:'Тофу + Овощи в воке + Бурый рис', ru_desc:'180г тофу · брокколи + перец + грибы · 80г риса' },
  'Salmão + Esparguete integral + Brócolos': { en_name:'Salmon + Wholegrain Spaghetti + Broccoli', en_desc:'180g salmon · 100g wholegrain spaghetti · boiled broccoli · lemon', es_name:'Salmón + Espagueti integral + Brócoli', es_desc:'180g salmón · 100g espagueti integral · brócoli cocido · limón', fr_name:'Saumon + Spaghetti complet + Brocoli', fr_desc:'180g saumon · 100g spaghetti complet · brocoli cuit · citron', ru_name:'Лосось + Цельнозерновые спагетти + Брокколи', ru_desc:'180г лосося · 100г спагетти · варёное брокколи · лимон' },
  'Bacalhau cozido + Batata + Ovo + Couve':  { en_name:'Boiled Cod + Potato + Egg + Kale', en_desc:'200g boiled cod · 130g potato · 1 egg · kale + olive oil', es_name:'Bacalao cocido + Patata + Huevo + Col', es_desc:'200g bacalao cocido · 130g patata · 1 huevo · col rizada + aceite', fr_name:'Cabillaud cuit + Pomme de terre + Œuf + Chou', fr_desc:'200g cabillaud cuit · 130g pomme de terre · 1 œuf · chou + huile d\'olive', ru_name:'Варёная треска + Картофель + Яйцо + Капуста', ru_desc:'200г трески · 130г картофеля · 1 яйцо · листовая капуста + масло' },
  'Robalo no forno + Legumes mediterrâneos': { en_name:'Oven Sea Bass + Mediterranean Vegetables', en_desc:'200g sea bass · zucchini, tomato, olives, capers · 80g rice', es_name:'Lubina al horno + Verduras mediterráneas', es_desc:'200g lubina · calabacín, tomate, aceitunas, alcaparras · 80g arroz', fr_name:'Bar au four + Légumes méditerranéens', fr_desc:'200g bar · courgette, tomate, olives, câpres · 80g riz', ru_name:'Запечённый сибас + Средиземноморские овощи', ru_desc:'200г сибаса · кабачки, томаты, оливки, каперсы · 80г риса' },
};

function getMealPlan(goal, cal, protein, hp) {
  hp = hp || {};
  // Seed muda a cada cálculo para garantir variedade
  const planSeed = Date.now();

  // calFactor: multiplier applied to slot's % of daily total for each specific option.
  const slots = {
    cut: [
      {
        time: 'meal_breakfast', hour: '7h', pct: 0.22,
        opts: [
          { name: 'Ovos mexidos + Aveia + Banana',              desc: '3 ovos mexidos · 50g aveia c/ leite · 1 banana',                             calFactor: 1.03 },
          { name: 'Panquecas de aveia proteicas',               desc: '80g aveia · 2 ovos · 1 clara · canela · mel q.b.',                           calFactor: 1.07 },
          { name: 'Iogurte grego + Granola + Frutos vermelhos', desc: '200g iogurte grego 0% · 30g granola · punhado de morangos',                  calFactor: 0.90 },
          { name: 'Tofu mexido + Pão integral + Tomate',        desc: '150g tofu firme temperado · 2 fatias pão integral · tomate + espinafres',    calFactor: 0.95 },
          { name: 'Papas de aveia + Sementes de chia + Fruta',  desc: '60g aveia cozida em água · 1 c.s. sementes de chia · 1 maçã fatiada',       calFactor: 0.86 },
          { name: 'Ovo escalfado + Espinafres + Pão de centeio',desc: '2 ovos escalfados · espinafres salteados c/ alho · 1 fatia pão de centeio', calFactor: 0.88 },
          { name: 'Overnight oats + Kiwi + Proteína',           desc: '50g aveia em água · 1 scoop whey misturado · 2 kiwis fatiados · canela',    calFactor: 0.93 }
        ]
      },
      {
        time: 'meal_snack_am', hour: '10h', pct: 0.10,
        opts: [
          { name: 'Iogurte grego + Amêndoas',             desc: '200g iogurte grego 0% · 15g amêndoas torradas',                   calFactor: 1.08 },
          { name: 'Maçã + Queijo cottage',                 desc: '1 maçã média · 100g queijo cottage magro',                        calFactor: 0.87 },
          { name: 'Batido de proteína c/ fruta',           desc: '1 dose whey · 150ml água · 1 kiwi ou meia banana',                calFactor: 1.05 },
          { name: 'Cenoura + Hummus + Pepino',             desc: '1 cenoura grande em palitos · 60g hummus · 1/2 pepino fatiado',   calFactor: 0.82 },
          { name: 'Fruta + Sementes de abóbora',           desc: '1 laranja ou pera · 15g sementes de abóbora tostadas sem sal',    calFactor: 0.78 },
          { name: 'Ovo cozido + Tomate cherry + Oregãos',  desc: '2 ovos cozidos · 8 tomates cherry · oregãos + fio de azeite',    calFactor: 0.75 },
          { name: 'Requeijão + Mirtilos + Canela',         desc: '100g requeijão magro · 80g mirtilos frescos · canela q.b.',       calFactor: 0.77 }
        ]
      },
      {
        time: 'meal_lunch', hour: '13h', pct: 0.30,
        opts: [
          { name: 'Frango grelhado + Arroz integral + Salada',  desc: '180g peito de frango · 80g arroz integral · salada verde à vontade',   calFactor: 0.97 },
          { name: 'Atum + Batata-doce + Brócolos',              desc: '2 latas atum ao natural · 150g batata-doce cozida · 100g brócolos',    calFactor: 0.89 },
          { name: 'Bacalhau assado + Legumes + Grão',           desc: '200g bacalhau · esparregado de espinafres · 60g grão cozido',          calFactor: 1.00 },
          { name: 'Peru + Quinoa + Espinafres salteados',       desc: '180g peito de peru grelhado · 80g quinoa cozida · espinafres c/ alho', calFactor: 0.94 },
          { name: 'Lentilhas + Arroz + Legumes salteados',      desc: '120g lentilhas cozidas · 70g arroz · courgette + pimento + tomate',    calFactor: 0.91 },
          { name: 'Salmão + Bulgur + Salada de pepino',         desc: '180g salmão grelhado · 70g bulgur cozido · pepino + tomate + limão',   calFactor: 0.96 },
          { name: 'Sardinhas grelhadas + Batata-doce + Salada', desc: '3 sardinhas frescas · 130g batata-doce · salada de alface + cenoura',  calFactor: 0.92 }
        ]
      },
      {
        time: 'meal_snack_pm', hour: '16h', pct: 0.12,
        opts: [
          { name: 'Batido de proteína',                      desc: '1 dose whey protein · 200ml leite de aveia sem açúcar',          calFactor: 0.93 },
          { name: 'Ovo cozido + Palitos de cenoura',         desc: '2 ovos cozidos · 1 cenoura média em palitos',                    calFactor: 0.81 },
          { name: 'Torrada integral + Manteiga de amendoim', desc: '1 fatia pão integral · 15g manteiga de amendoim natural',        calFactor: 1.02 },
          { name: 'Edamame + Laranja',                       desc: '80g edamame cozido com flor de sal · 1 laranja',                 calFactor: 0.79 },
          { name: 'Queijo fresco + Tomate + Oregãos',        desc: '100g queijo fresco magro · 1 tomate fatiado · oregãos + azeite', calFactor: 0.84 },
          { name: 'Requeijão + Framboesas + Canela',         desc: '120g requeijão magro · 80g framboesas frescas · canela q.b.',    calFactor: 0.76 },
          { name: 'Sopa de legumes light',                   desc: 'Sopa de courgette, cenoura e espinafres s/ batata · 300ml',      calFactor: 0.62 }
        ]
      },
      {
        time: 'meal_dinner', hour: '19h30', pct: 0.26,
        opts: [
          { name: 'Salmão + Batata-doce + Brócolos',         desc: '200g salmão grelhado · 120g batata-doce · 100g brócolos a vapor',         calFactor: 1.03 },
          { name: 'Frango no forno + Legumes assados',        desc: '200g frango · courgette, pimento, beringela assados · azeite q.b.',       calFactor: 0.94 },
          { name: 'Omelete de claras + Salada completa',      desc: '5 claras + 1 ovo inteiro · alface, tomate, pepino, azeitonas',            calFactor: 0.81 },
          { name: 'Tofu + Legumes salteados + Arroz',         desc: '180g tofu firme · brócolos + cogumelos + pimento · 70g arroz basmati',    calFactor: 0.89 },
          { name: 'Pescada grelhada + Legumes a vapor',       desc: '220g pescada · cenoura + feijão verde + couve-flor a vapor',              calFactor: 0.87 },
          { name: 'Bacalhau + Grão + Couve-galega',           desc: '200g bacalhau cozido · 80g grão · couve-galega salteada c/ azeite',      calFactor: 0.98 },
          { name: 'Camarão grelhado + Courgette + Quinoa',    desc: '200g camarão temperado · 1 courgette grelhada · 60g quinoa cozida',       calFactor: 0.92 }
        ]
      }
    ],
    bulk: [
      {
        time: 'meal_breakfast', hour: '7h', pct: 0.22,
        opts: [
          { name: 'Aveia + Ovos + Manteiga de amendoim + Banana', desc: '100g aveia · 4 ovos mexidos · 30g manteiga de amendoim · 1 banana',       calFactor: 1.10 },
          { name: 'Tosta integral + Ovos + Abacate',              desc: '3 fatias pão integral · 3 ovos estrelados · meio abacate · tomate',        calFactor: 1.00 },
          { name: 'Granola + Iogurte grego gordo + Frutos secos', desc: '80g granola · 200g iogurte grego gordo · 20g nozes · 1 banana',            calFactor: 0.96 },
          { name: 'Arroz de leite proteico + Fruta',              desc: '100g arroz cozido em 300ml leite gordo · 1 dose whey misturada · 1 manga', calFactor: 1.05 },
          { name: 'Wrap integral + Ovos + Queijo + Peru',         desc: '2 wraps integrais · 3 ovos mexidos · 30g queijo curado · 60g peru',        calFactor: 1.02 },
          { name: 'Batido matinal hipercalórico',                 desc: '100g aveia · 1 banana · 30g amendoim · 300ml leite gordo · 1 dose whey',   calFactor: 1.15 },
          { name: 'Panquecas proteicas + Mirtilos + Requeijão',   desc: '100g aveia · 3 ovos · 1 dose whey · 100g mirtilos · 80g requeijão',        calFactor: 1.07 }
        ]
      },
      {
        time: 'meal_snack_am', hour: '10h', pct: 0.15,
        opts: [
          { name: 'Batido hipercalórico',                            desc: '1 dose whey · 1 banana · 30g aveia · 200ml leite gordo · 15g amendoim', calFactor: 1.14 },
          { name: 'Pão integral + Queijo + Ovo cozido',              desc: '2 fatias pão · 2 fatias queijo flamengo · 2 ovos cozidos',              calFactor: 0.93 },
          { name: 'Iogurte grego gordo + Fruta + Mel + Oleaginosas', desc: '200g iogurte gordo · 1 maçã · 1 c.s. mel · 20g mix de oleaginosas',    calFactor: 0.98 },
          { name: 'Batata-doce + Frango desfiado + Azeite',          desc: '150g batata-doce cozida · 120g frango desfiado · fio de azeite + sal',  calFactor: 1.00 },
          { name: 'Fruta + Pasta de amendoim + Biscoitos aveia',     desc: '1 banana · 25g pasta de amendoim · 3 biscoitos de aveia integrais',     calFactor: 1.08 },
          { name: 'Tosta de ricotta + Mel + Nozes',                  desc: '2 torradas integrais · 80g ricotta · 1 c.s. mel · 15g nozes picadas',  calFactor: 1.02 },
          { name: 'Queijo cottage + Banana + Granola',               desc: '180g queijo cottage · 1 banana fatiada · 40g granola crocante',         calFactor: 1.05 }
        ]
      },
      {
        time: 'meal_lunch', hour: '13h', pct: 0.28,
        opts: [
          { name: 'Arroz + Frango + Feijão + Legumes',           desc: '200g frango · 150g arroz branco · 60g feijão · legumes salteados',      calFactor: 1.02 },
          { name: 'Massa integral + Carne picada + Molho tomate', desc: '150g massa integral · 200g carne picada magra · molho caseiro',        calFactor: 0.97 },
          { name: 'Bife de vaca + Batata cozida + Salada',        desc: '200g bife de vaca · 200g batata cozida · salada colorida com azeite',  calFactor: 1.01 },
          { name: 'Salmão + Arroz basmati + Legumes',             desc: '220g salmão no forno · 150g arroz basmati · brócolos + cenoura',       calFactor: 1.04 },
          { name: 'Frango + Massa + Pesto + Espinafres',          desc: '200g frango grelhado · 150g massa integral · 2 c.s. pesto · espinafres', calFactor: 1.03 },
          { name: 'Bife de atum + Arroz + Feijão verde',          desc: '220g bife de atum grelhado · 130g arroz branco · feijão verde salteado', calFactor: 1.00 },
          { name: 'Lasanha de carne + Salada verde',              desc: '300g lasanha de carne magra caseira · salada alface + tomate',          calFactor: 1.08 }
        ]
      },
      {
        time: 'meal_snack_pm', hour: '16h', pct: 0.12,
        opts: [
          { name: 'Pão integral + Atum + Fruta',              desc: '2 fatias pão integral · 1 lata atum ao natural · 1 maçã grande',        calFactor: 1.04 },
          { name: 'Batido de massa muscular',                  desc: '1 dose mass gainer · 300ml leite gordo · 1 banana',                    calFactor: 1.19 },
          { name: 'Crepioca + Queijo + Peru',                  desc: '2 crepiocas (ovo + tapioca) · queijo flamengo · fiambre de peru',       calFactor: 0.92 },
          { name: 'Arroz + Ovo estrelado + Legumes',           desc: '120g arroz branco · 2 ovos estrelados em azeite · feijão verde',       calFactor: 1.00 },
          { name: 'Queijo cottage + Frutos vermelhos + Mel',   desc: '200g queijo cottage · 100g mirtilos ou morangos · 1 c.s. mel',         calFactor: 0.90 },
          { name: 'Batido banana + Amendoim + Aveia + Leite',  desc: '1 banana · 25g pasta amendoim · 40g aveia · 250ml leite gordo',        calFactor: 1.12 },
          { name: 'Sanduíche de peru + Abacate + Tomate',      desc: '2 fatias pão integral · 80g peru fatiado · 1/4 abacate · tomate',      calFactor: 1.00 }
        ]
      },
      {
        time: 'meal_dinner', hour: '19h30', pct: 0.23,
        opts: [
          { name: 'Massa + Carne moída + Salada',             desc: '150g massa · 200g carne moída magra · molho tomate · salada',              calFactor: 1.03 },
          { name: 'Arroz + Salmão + Batata-doce',             desc: '120g arroz · 200g salmão · 150g batata-doce · brócolos',                   calFactor: 1.00 },
          { name: 'Wrap integral + Frango + Legumes',         desc: '2 wraps integrais · 180g frango desfiado · legumes grelhados · hummus',     calFactor: 0.97 },
          { name: 'Bife de peru + Batata-doce + Grão',        desc: '200g bife de peru · 150g batata-doce assada · 60g grão temperado',         calFactor: 1.02 },
          { name: 'Ovos + Arroz integral + Legumes',          desc: '3 ovos mexidos · 100g arroz integral · espinafres + cogumelos salteados',   calFactor: 0.94 },
          { name: 'Frango assado + Batatas + Salada',         desc: '220g frango assado no forno · 180g batatas assadas c/ azeite · salada',     calFactor: 1.05 },
          { name: 'Salmão + Quinoa + Brócolos',               desc: '220g salmão no forno · 100g quinoa cozida · 120g brócolos + limão',         calFactor: 1.03 }
        ]
      }
    ],
    maintain: [
      {
        time: 'meal_breakfast', hour: '7h', pct: 0.22,
        opts: [
          { name: 'Ovos mexidos + Torradas integrais + Fruta',  desc: '3 ovos · 2 torradas integrais · 1 peça de fruta à escolha',                       calFactor: 0.95 },
          { name: 'Smoothie bowl proteico',                      desc: '1 dose whey · 150ml leite · 1 banana congelada · 30g granola · frutos vermelhos',  calFactor: 1.04 },
          { name: 'Iogurte natural + Aveia + Banana + Canela',  desc: '180g iogurte natural · 50g aveia · 1 banana fatiada · canela a gosto',             calFactor: 0.98 },
          { name: 'Tosta de abacate + Ovo escalfado',           desc: '2 fatias pão integral · 1/2 abacate amassado · 2 ovos escalfados · limão',         calFactor: 1.03 },
          { name: 'Fruta fresca + Sementes + Chá verde',        desc: '1 tigela de melão, kiwi e morangos · 10g sementes mistas · 1 chá verde',           calFactor: 0.80 },
          { name: 'Chia pudding + Manga + Coco',                desc: '40g sementes chia + 200ml leite de coco · 1/2 manga · coco ralado q.b.',           calFactor: 1.01 },
          { name: 'Pão de centeio + Salmão fumado + Queijo',    desc: '2 fatias pão de centeio · 80g salmão fumado · 50g cream cheese light',             calFactor: 1.02 }
        ]
      },
      {
        time: 'meal_snack_am', hour: '10h', pct: 0.10,
        opts: [
          { name: 'Iogurte + Frutos secos',             desc: '150g iogurte natural · 20g mix de frutos secos (nozes, amêndoas)',  calFactor: 0.96 },
          { name: 'Fruta + Queijo fresco',              desc: '1 pêra ou maçã · 100g queijo fresco magro',                         calFactor: 0.87 },
          { name: 'Barrinha proteica',                  desc: '1 barrinha proteica (min. 15g proteína, max. 200 kcal)',             calFactor: 1.04 },
          { name: 'Cenoura + Pepino + Hummus',          desc: '1 cenoura + 1/2 pepino em palitos · 50g hummus caseiro',            calFactor: 0.82 },
          { name: 'Peça de fruta + Proteína em pó',     desc: '1 banana ou maçã · 1 scoop proteína diluído em 150ml água',         calFactor: 0.90 },
          { name: 'Requeijão + Mirtilos + Mel',         desc: '100g requeijão · 60g mirtilos frescos · 1 c.c. mel',                calFactor: 0.88 },
          { name: 'Mix de oleaginosas + 1 tâmara',      desc: '20g mix de nozes, amêndoas e cajus · 1 tâmara medjool',             calFactor: 0.91 }
        ]
      },
      {
        time: 'meal_lunch', hour: '13h', pct: 0.30,
        opts: [
          { name: 'Frango + Arroz integral + Vegetais',  desc: '180g frango grelhado · 100g arroz integral · legumes variados + salada', calFactor: 0.99 },
          { name: 'Sopa de legumes + Omelete + Salada',  desc: 'Sopa caseira · omelete 3 ovos com legumes · salada verde',               calFactor: 0.93 },
          { name: 'Quinoa + Atum + Legumes salteados',   desc: '80g quinoa · 1 lata atum ao natural · espinafres, tomate cherry, pepino', calFactor: 1.02 },
          { name: 'Bife de peru + Batata-doce + Salada', desc: '180g bife de peru · 120g batata-doce assada · salada de folhas verdes',   calFactor: 0.98 },
          { name: 'Lentilhas + Legumes + Arroz',         desc: '120g lentilhas · cenoura + courgette salteados · 70g arroz basmati',      calFactor: 0.95 },
          { name: 'Camarão + Arroz de coentros + Brócolos', desc: '180g camarão grelhado · 100g arroz de coentros · 100g brócolos',       calFactor: 1.00 },
          { name: 'Prego magro + Salada + Pão integral', desc: '180g bife de vaca magro · pão integral · alface + tomate + mostarda',     calFactor: 1.01 }
        ]
      },
      {
        time: 'meal_snack_pm', hour: '16h', pct: 0.10,
        opts: [
          { name: 'Batido proteico + Fruta',              desc: '1 dose proteína · 200ml água ou leite vegetal · 1 peça de fruta',  calFactor: 0.96 },
          { name: 'Torrada integral + Abacate',           desc: '1 fatia pão integral · 1/4 abacate amassado · sal · limão',         calFactor: 1.09 },
          { name: 'Requeijão + Mel + Nozes',              desc: '150g requeijão · 1 c.c. mel · 10g nozes picadas',                   calFactor: 1.00 },
          { name: 'Ovo cozido + Palitos de cenoura',      desc: '2 ovos cozidos · 1 cenoura em palitos · sal e pimenta q.b.',        calFactor: 0.82 },
          { name: 'Frutos vermelhos + Iogurte grego',     desc: '100g mirtilos ou morangos · 150g iogurte grego natural',            calFactor: 0.88 },
          { name: 'Banana + Pasta de amendoim',           desc: '1 banana média · 15g pasta de amendoim natural',                   calFactor: 0.95 },
          { name: 'Kiwi + Amêndoas + Queijo fresco',      desc: '2 kiwis · 15g amêndoas · 80g queijo fresco magro',                 calFactor: 0.87 }
        ]
      },
      {
        time: 'meal_dinner', hour: '20h', pct: 0.28,
        opts: [
          { name: 'Peixe grelhado + Legumes + Salada',        desc: '200g peixe branco ou gordo · legumes a vapor · salada verde c/ azeite', calFactor: 0.96 },
          { name: 'Frango no forno + Arroz + Cenoura',        desc: '180g frango · 80g arroz · 100g cenoura assada · azeite',               calFactor: 1.01 },
          { name: 'Sopa creme + Ovo cozido + Pão integral',   desc: 'Sopa creme de legumes · 2 ovos cozidos · 1 fatia pão integral',         calFactor: 0.90 },
          { name: 'Tofu + Legumes no wok + Arroz integral',   desc: '180g tofu firme salteado · brócolos + pimento + cogumelos · 80g arroz', calFactor: 0.93 },
          { name: 'Salmão + Esparguete integral + Brócolos',  desc: '180g salmão · 100g esparguete integral · brócolos cozidos · limão',    calFactor: 1.02 },
          { name: 'Bacalhau cozido + Batata + Ovo + Couve',   desc: '200g bacalhau cozido · 130g batata · 1 ovo · couve-galega + azeite',   calFactor: 1.00 },
          { name: 'Robalo no forno + Legumes mediterrâneos',  desc: '200g robalo · courgette, tomate, azeitonas, alcaparras · 80g arroz',   calFactor: 0.99 }
        ]
      }
    ]
  };

  const mealSlots = slots[goal] || slots.maintain;

  return mealSlots.map((slot, si) => {
    const key = `meal_${si}`;
    const safeOpts = slot.opts.filter(o => isMealSafe(o, hp));

    // No safe option for this slot
    if (!safeOpts.length) {
      return `
      <div class="meal-card" id="mealcard_${si}">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <div class="meal-time">${t(slot.time)} · ${slot.hour}</div>
        </div>
        <div style="background:rgba(255,107,53,.1); border:1px solid rgba(255,107,53,.35); border-radius:var(--radius-sm); padding:10px 12px; font-size:0.82rem; line-height:1.5; color:var(--text);">
          ${t('nut_all_allergy')}<br>
          <span style="color:var(--muted);">${t('nut_consult_dietitian')}</span>
        </div>
      </div>`;
    }

    // Initialise with random seed per calculation (cycleMeal just increments/decrements from here)
    if (mealSelections[key] === undefined) {
      mealSelections[key] = planSeed + si * 7;
    }
    const idx = ((mealSelections[key] % safeOpts.length) + safeOpts.length) % safeOpts.length;
    const opt = safeOpts[idx];
    const optCal = Math.round(cal * slot.pct * opt.calFactor);
    const _ml = getLang();
    const _mt = MEAL_T[opt.name];
    const mealName = (_ml !== 'pt' && _mt && _mt[_ml+'_name']) ? _mt[_ml+'_name'] : opt.name;
    const mealDesc = (_ml !== 'pt' && _mt && _mt[_ml+'_desc']) ? _mt[_ml+'_desc'] : opt.desc;

    return `
    <div class="meal-card" id="mealcard_${si}">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <div class="meal-time">${t(slot.time)} · ${slot.hour}</div>
        <div style="font-size:0.75rem; color:var(--orange); font-weight:700;">${optCal} kcal</div>
      </div>
      <div class="meal-name" style="margin-bottom:4px;">${mealName}</div>
      <div class="meal-cal" style="margin-bottom:10px;">${mealDesc}</div>
      <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid var(--border); padding-top:8px;">
        <button onclick="cycleMeal(${si},-1)" style="background:var(--card);border:1px solid var(--border);color:var(--text);padding:5px 10px;border-radius:var(--radius-sm);cursor:pointer;font-size:0.8rem;">◀</button>
        <div style="font-size:0.75rem; color:var(--muted);">
          ${safeOpts.map((_,i) => `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;margin:0 2px;background:${i===idx ? 'var(--orange)' : 'var(--border)'}"></span>`).join('')}
          <span style="margin-left:6px;">${t('nut_option_of').replace('{n}', idx+1).replace('{total}', safeOpts.length)}</span>
        </div>
        <button onclick="cycleMeal(${si},1)" style="background:var(--card);border:1px solid var(--border);color:var(--text);padding:5px 10px;border-radius:var(--radius-sm);cursor:pointer;font-size:0.8rem;">▶</button>
      </div>
    </div>`;
  }).join('');
}

function addSwipe(el, leftFn, rightFn) {
  let startX = 0, startY = 0;
  el.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  el.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    dx < 0 ? rightFn() : leftFn();
  }, { passive: true });
}

function attachMealSwipes() {
  document.querySelectorAll('[id^="mealcard_"]').forEach(card => {
    const si = parseInt(card.id.replace('mealcard_', ''), 10);
    addSwipe(card, () => cycleMeal(si, -1), () => cycleMeal(si, 1));
  });
}

function cycleMeal(slotIdx, dir) {
  const key = `meal_${slotIdx}`;
  mealSelections[key] = (mealSelections[key] || 0) + dir;
  const { goal, cal, hp } = _nutState;
  document.getElementById('nut-meals').innerHTML = getMealPlan(goal, cal, 0, hp);
  attachMealSwipes();
}

function getSupplements(goal, age, hp) {
  hp = hp || { allergies: [], conditions: [], injuries: [] };
  const conditions = hp.conditions || [];

  const isChild   = age && age < 14;
  const isTeen    = age && age >= 14 && age < 18;
  const isElderly = age && age >= 70;

  // Children: no supplements
  if (isChild) {
    return `<div style="background:rgba(255,107,53,.1); border:1.5px solid var(--pink); border-radius:var(--radius-sm); padding:14px 16px; font-size:0.85rem; line-height:1.6; color:var(--text);">
      ${t('supp_child_warn').replace('{age}', age)}<br>
      ${t('supp_child_info')}<br><br>
      ${t('supp_child_consult')}
    </div>`;
  }

  // Elderly: custom list
  if (isElderly) {
    const elderlyBlocked = new Set([...ELDERLY_SUPP_BLOCK]);
    // Also block per conditions
    conditions.forEach(c => (CONDITION_SUPP_BLOCK[c] || []).forEach(s => elderlyBlocked.add(s)));
    const extra = [];
    conditions.forEach(c => (CONDITION_SUPP_ADD[c] || []).forEach(s => extra.push(s)));

    const cards = [...ELDERLY_SUPPS, ...extra].map(s => `
      <div class="supp-card">
        <div class="supp-icon">${s.icon}</div>
        <div><div class="supp-name">${_suppName(s)}</div><div class="supp-desc">${_suppDesc(s)}</div><div class="supp-dose">📌 ${_suppDose(s)}</div></div>
      </div>`).join('');

    const condWarnings = conditions.length ? `<div style="font-size:0.78rem; color:var(--muted); margin-top:6px;">${t('supp_cond_warn').replace('{conds}', conditions.map(c => HEALTH_CONDITIONS.find(x=>x.id===c)?.label||c).join(', '))}</div>` : '';

    return `<div style="background:rgba(0,170,255,.08); border:1.5px solid var(--cyan); border-radius:var(--radius-sm); padding:12px 14px; margin-bottom:14px; font-size:0.82rem; line-height:1.6; color:var(--text);">
      ${t('supp_senior_warn').replace('{age}', age)}${condWarnings}
    </div>` + cards;
  }

  // Build blocked set from conditions + age
  const adultOnlyNames = new Set(['Cafeína / Pré-treino','Creatina Monohidratada','L-Carnitina','Beta-Alanina','Hipercalórico (Mass Gainer)']);
  const condBlocked = new Set(conditions.flatMap(c => CONDITION_SUPP_BLOCK[c] || []));

  const base = [
    { icon:'🥛', name:'Whey Protein',          desc:'Proteína de soro do leite de absorção rápida. Ideal pós-treino.',    dose:'25–30g após treino' },
    { icon:'💊', name:'Creatina Monohidratada', desc:'Aumenta força e desempenho em exercícios de alta intensidade.',      dose:'3–5g/dia com água' },
    { icon:'🌊', name:'Ómega-3',                desc:'Anti-inflamatório, melhora recuperação e saúde cardiovascular.',     dose:'2–3g/dia com refeições' }
  ];
  const byGoal = {
    cut:      [{ icon:'☕', name:'Cafeína / Pré-treino', desc:'Aumenta energia e oxidação de gordura.',          dose:'200mg antes do treino (máx. 400mg/dia)' },
               { icon:'🌿', name:'L-Carnitina',          desc:'Auxilia no transporte de gordura como energia.',  dose:'1–2g antes do treino' }],
    bulk:     [{ icon:'🍌', name:'Hipercalórico (Mass Gainer)', desc:'Rico em carboidratos e proteínas.',        dose:'1–2 doses/dia' },
               { icon:'💪', name:'Beta-Alanina',                desc:'Reduz fadiga muscular em treinos intensos.',dose:'3–5g antes do treino' }],
    maintain: [{ icon:'🧬', name:'BCAA', desc:'Reduz catabolismo e auxilia na recuperação.',                     dose:'5–10g pré ou pós-treino' }],
  };

  // Condition-specific additions
  const condExtra = [];
  conditions.forEach(c => (CONDITION_SUPP_ADD[c] || []).forEach(s => condExtra.push(s)));

  const all = [...base, ...(byGoal[goal] || []), ...condExtra];

  const condWarnBanner = conditions.length ? `
    <div style="background:rgba(0,212,170,.08); border:1.5px solid var(--green); border-radius:var(--radius-sm); padding:10px 13px; margin-bottom:12px; font-size:0.8rem; line-height:1.5; color:var(--text);">
      ${t('supp_cond_banner').replace('{conds}', conditions.map(c => HEALTH_CONDITIONS.find(x=>x.id===c)?.label||c).join(', '))}
    </div>` : '';

  const teenBanner = isTeen ? `
    <div style="background:rgba(255,215,0,.08); border:1.5px solid var(--yellow); border-radius:var(--radius-sm); padding:10px 13px; margin-bottom:12px; font-size:0.8rem; line-height:1.5; color:var(--text);">
      ${t('supp_teen_warn').replace('{age}', age)}
    </div>` : '';

  const cards = all.map(s => {
    const blockedTeen = isTeen && adultOnlyNames.has(s.name);
    const blockedCond = condBlocked.has(s.name);
    const blocked = blockedTeen || blockedCond;
    const reason = blockedCond
      ? t('supp_not_rec_for').replace('{conds}', conditions.filter(c => (CONDITION_SUPP_BLOCK[c]||[]).includes(s.name)).map(c => HEALTH_CONDITIONS.find(x=>x.id===c)?.label||c).join(', '))
      : t('supp_not_rec_age');
    return `
    <div class="supp-card" style="${blocked ? 'opacity:0.45;' : ''}">
      <div class="supp-icon">${s.icon}</div>
      <div style="flex:1;">
        <div class="supp-name">${_suppName(s)}${blocked ? ` <span style="font-size:0.65rem; background:rgba(255,71,87,.2); color:#ff4757; border-radius:20px; padding:1px 7px; font-weight:700; vertical-align:middle;">${t('supp_restricted')}</span>` : ''}</div>
        <div class="supp-desc">${blocked ? `⚠️ ${reason}. ${t('workout_consult')}` : _suppDesc(s)}</div>
        ${!blocked ? `<div class="supp-dose">📌 ${_suppDose(s)}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  return teenBanner + condWarnBanner + cards;
}

// ═══════════════════════════════════════════════════════
//  PRESET PLANS
// ═══════════════════════════════════════════════════════

// Preset plan name/desc translations (keyed by plan id)
const PRESET_PLANS_T = {
  ppl:{
    en_name:'PPL – Push / Pull / Legs',en_desc:'One of the most popular programs. Divides training into push (chest/shoulders/triceps), pull (back/biceps) and legs — each done twice a week.',
    es_name:'PPL – Push / Pull / Legs',es_desc:'Uno de los programas más populares. Divide el entrenamiento en empujar, jalar y piernas — cada uno dos veces por semana.',
    fr_name:'PPL – Push / Pull / Legs',fr_desc:"L'un des programmes les plus populaires. Divise l'entraînement en pousser, tirer et jambes — chacun fait deux fois par semaine.",
    ru_name:'PPL – Push / Pull / Legs',ru_desc:'Одна из самых популярных программ. Делит тренировку на толкающие, тянущие и ноги — каждое выполняется дважды в неделю.'},
  upperlower:{
    en_name:'Upper / Lower Split',en_desc:'Alternates between upper and lower body training. Great balance of frequency and recovery. Ideal for strength and mass gains.',
    es_name:'Upper / Lower Split',es_desc:'Alterna entre entrenamiento de parte superior e inferior. Equilibrio perfecto entre frecuencia y recuperación. Ideal para ganar fuerza y masa.',
    fr_name:'Upper / Lower Split',fr_desc:'Alterne entre entraînement du haut et du bas du corps. Excellent équilibre entre fréquence et récupération. Idéal pour la force et la masse.',
    ru_name:'Upper / Lower Split',ru_desc:'Чередование верхней и нижней части тела. Отличный баланс частоты и восстановления. Идеален для роста силы и массы.'},
  fullbody:{
    en_name:'Full Body – 3x per week',en_desc:'Trains the whole body each session. Ideal for beginners or those with little time. High muscle frequency ensures good progression.',
    es_name:'Full Body – 3x por semana',es_desc:'Entrena todo el cuerpo en cada sesión. Ideal para principiantes o quienes tienen poco tiempo. La alta frecuencia muscular garantiza buena progresión.',
    fr_name:'Full Body – 3x par semaine',fr_desc:'Entraîne tout le corps à chaque séance. Idéal pour les débutants ou ceux qui ont peu de temps. La haute fréquence musculaire assure une bonne progression.',
    ru_name:'Full Body – 3x в неделю',ru_desc:'Тренирует всё тело за каждую сессию. Идеально для начинающих или тех, у кого мало времени. Высокая частота на мышцу обеспечивает хороший прогресс.'},
  brosplit:{
    en_name:'Bro Split – 1 muscle per day',en_desc:'Each day is dedicated to a specific muscle group. Allows maximum volume per muscle and high intensity. A gym classic.',
    es_name:'Bro Split – 1 músculo por día',es_desc:'Cada día está dedicado a un grupo muscular específico. Permite volumen máximo por músculo y alta intensidad. Un clásico del gimnasio.',
    fr_name:'Bro Split – 1 muscle par jour',fr_desc:'Chaque jour est dédié à un groupe musculaire. Volume maximum par muscle et haute intensité. Un classique des salles de sport.',
    ru_name:'Бро Сплит – 1 мышца в день',ru_desc:'Каждый день посвящён определённой мышечной группе. Максимальный объём на мышцу и высокая интенсивность. Классика тренажёрного зала.'},
  arnold:{
    en_name:'Arnold Split',en_desc:"Arnold Schwarzenegger's program. Combines chest+back, shoulders+arms, and legs. High frequency and volume. For experienced athletes.",
    es_name:'Arnold Split',es_desc:'El programa de Arnold Schwarzenegger. Combina pecho+espalda, hombros+brazos y piernas. Alta frecuencia y volumen. Para atletas experimentados.',
    fr_name:'Arnold Split',fr_desc:"Le programme d'Arnold Schwarzenegger. Combine pectoraux+dos, épaules+bras et jambes. Haute fréquence et volume. Pour les athlètes expérimentés.",
    ru_name:'Сплит Арнольда',ru_desc:'Программа Арнольда Шварценеггера. Сочетает грудь+спина, плечи+руки и ноги. Высокая частота и объём. Для опытных атлетов.'},
  antagonist:{
    en_name:'Antagonists – ABCD',en_desc:'Trains opposing muscles on the same day (chest+triceps, back+biceps). Allows good recovery between sets and time efficiency.',
    es_name:'Antagonistas – ABCD',es_desc:'Entrena músculos opuestos el mismo día (pecho+tríceps, espalda+bíceps). Permite buena recuperación entre series y eficiencia temporal.',
    fr_name:'Antagonistes – ABCD',fr_desc:'Entraîne les muscles antagonistes le même jour (pectoraux+triceps, dos+biceps). Bonne récupération entre les séries et efficacité temporelle.',
    ru_name:'Антагонисты – ABCD',ru_desc:'Тренирует мышцы-антагонисты в один день (грудь+трицепс, спина+бицепс). Хорошее восстановление между подходами и экономия времени.'},
  hiit3:{
    en_name:'Strength + HIIT Cardio',en_desc:'Combines strength training with high-intensity cardio sessions. Great for those who want to lose fat while maintaining/gaining muscle.',
    es_name:'Fuerza + Cardio HIIT',es_desc:'Combina entrenamiento de fuerza con cardio de alta intensidad. Ideal para perder grasa y mantener/ganar músculo.',
    fr_name:'Force + Cardio HIIT',fr_desc:"Combine l'entraînement en force avec du cardio haute intensité. Idéal pour perdre de la graisse tout en maintenant/gagnant du muscle.",
    ru_name:'Силовой + Кардио HIIT',ru_desc:'Сочетает силовые тренировки с высокоинтенсивным кардио. Отлично для сжигания жира при сохранении/наборе мышц.'},
  glutes:{
    en_name:'Glutes & Legs Focus',en_desc:'Program with emphasis on glutes and legs, trained with higher frequency. Complemented by upper body training.',
    es_name:'Foco Glúteos & Piernas',es_desc:'Programa con énfasis en glúteos y piernas, entrenados con mayor frecuencia. Complementado con entrenamiento de parte superior.',
    fr_name:'Focus Fessiers & Jambes',fr_desc:"Programme mettant l'accent sur les fessiers et les jambes, entraînés plus fréquemment. Complété par un entraînement du haut du corps.",
    ru_name:'Акцент на Ягодицы и Ноги',ru_desc:'Программа с акцентом на ягодицы и ноги, тренируемые с повышенной частотой. Дополнена тренировкой верхней части тела.'},
  home_fullbody3:{
    en_name:'Full Body Home – 3x/week',en_desc:'Complete bodyweight workout 3 times a week. No equipment, can be done anywhere. Ideal for beginners.',
    es_name:'Full Body Casa – 3x/semana',es_desc:'Entrenamiento completo de peso corporal 3 veces por semana. Sin equipo, puede hacerse en cualquier lugar. Ideal para comenzar.',
    fr_name:'Full Body Maison – 3x/semaine',fr_desc:"Entraînement complet au poids du corps 3 fois par semaine. Sans équipement, peut être fait n'importe où. Idéal pour commencer.",
    ru_name:'Full Body Дома – 3x/неделю',ru_desc:'Полная тренировка с собственным весом 3 раза в неделю. Без оборудования, можно делать где угодно. Идеально для начинающих.'},
  home_ppl:{
    en_name:'Push / Pull / Legs Home',en_desc:'The classic Push/Pull/Legs adapted for bodyweight. Push-ups and dips, superman and pull-ups, squats and glutes.',
    es_name:'Push / Pull / Legs Casa',es_desc:'El clásico Push/Pull/Legs adaptado al peso corporal. Flexiones y dips, superman y dominadas, sentadillas y glúteos.',
    fr_name:'Push / Pull / Legs Maison',fr_desc:'Le classique Push/Pull/Legs adapté au poids du corps. Pompes et dips, superman et tractions, squats et fessiers.',
    ru_name:'Push / Pull / Legs Дома',ru_desc:'Классический Push/Pull/Legs адаптированный для веса тела. Отжимания и дипсы, суперман и подтягивания, приседания и ягодицы.'},
  home_upperlower:{
    en_name:'Upper / Lower Home',en_desc:'Upper and lower body alternated. No weights, uses bodyweight to tone and strengthen the whole body.',
    es_name:'Superior / Inferior Casa',es_desc:'Parte superior e inferior alternadas. Sin pesas, usa el peso corporal para tonificar y fortalecer todo el cuerpo.',
    fr_name:'Haut / Bas Maison',fr_desc:'Haut et bas du corps alternés. Sans poids, utilise le poids du corps pour tonifier et renforcer tout le corps.',
    ru_name:'Верх / Низ Дома',ru_desc:'Верхняя и нижняя части тела чередуются. Без отягощений, использует вес тела для тонуса и укрепления всего тела.'},
  home_hiit:{
    en_name:'HIIT + Strength Home',en_desc:'Combines bodyweight strength with intense HIIT cardio. Maximum fat burning without leaving home.',
    es_name:'HIIT + Fuerza Casa',es_desc:'Combina fuerza de peso corporal con cardio HIIT intenso. Quema de grasa máxima sin salir de casa.',
    fr_name:'HIIT + Force Maison',fr_desc:'Combine la force au poids du corps avec un cardio HIIT intense. Brûlage de graisse maximum sans quitter la maison.',
    ru_name:'HIIT + Силовой Дома',ru_desc:'Сочетает силовые с весом тела и интенсивное кардио HIIT. Максимальное сжигание жира не выходя из дома.'},
  home_5days:{
    en_name:'Daily Full Body Home',en_desc:'Five bodyweight sessions per week with a different focus each day. High frequency for fast progression.',
    es_name:'Full Body Diario Casa',es_desc:'Cinco sesiones de peso corporal por semana con un enfoque diferente cada día. Alta frecuencia para progresión rápida.',
    fr_name:'Full Body Quotidien Maison',fr_desc:'Cinq séances au poids du corps par semaine avec un focus différent chaque jour. Haute fréquence pour une progression rapide.',
    ru_name:'Ежедневный Full Body Дома',ru_desc:'Пять сессий с собственным весом в неделю с разным акцентом каждый день. Высокая частота для быстрого прогресса.'},
  home_glutes:{
    en_name:'Glutes & Legs Home',en_desc:'Total focus on glutes and legs with bodyweight. Squats, lunges, hip raises, fire hydrants, and much more.',
    es_name:'Glúteos & Piernas Casa',es_desc:'Enfoque total en glúteos y piernas con peso corporal. Sentadillas, estocadas, elevaciones de cadera, fire hydrant y mucho más.',
    fr_name:'Fessiers & Jambes Maison',fr_desc:'Accent total sur les fessiers et les jambes au poids du corps. Squats, fentes, élévations de bassin, fire hydrant et bien plus.',
    ru_name:'Ягодицы & Ноги Дома',ru_desc:'Полный акцент на ягодицы и ноги с собственным весом. Приседания, выпады, подъёмы таза, fire hydrant и многое другое.'},
};
function _planName(p){ const _l=getLang(); const _pt=PRESET_PLANS_T[p.id]; return (_l!=='pt'&&_pt&&_pt[_l+'_name'])?_pt[_l+'_name']:p.name; }
function _planDesc(p){ const _l=getLang(); const _pt=PRESET_PLANS_T[p.id]; return (_l!=='pt'&&_pt&&_pt[_l+'_desc'])?_pt[_l+'_desc']:p.desc; }
function _planDays(p){ const n=parseInt(p.days); return t('plan_days_week').replace('{n}',n)||p.days; }

// weeklyPlan keys: 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb
const PRESET_PLANS = [
  {
    id: 'ppl',
    name: 'PPL – Push / Pull / Legs',
    icon: '🔁',
    difficulty: 'intermediate',
    diffLabel: 'Intermédio',
    days: '6 dias / semana',
    desc: 'Um dos programas mais populares. Divide o treino em empurrar (peito/ombros/tríceps), puxar (costas/bíceps) e pernas — cada um feito duas vezes por semana.',
    weekly: {
      0: [],
      1: ['Peito','Ombros','Tríceps'],
      2: ['Costas','Bíceps'],
      3: ['Pernas','Glúteos'],
      4: ['Peito','Ombros','Tríceps'],
      5: ['Costas','Bíceps'],
      6: ['Pernas','Glúteos']
    }
  },
  {
    id: 'upperlower',
    name: 'Upper / Lower Split',
    icon: '↕️',
    difficulty: 'intermediate',
    diffLabel: 'Intermédio',
    days: '4 dias / semana',
    desc: 'Alterna entre treino de parte superior e inferior do corpo. Ótimo equilíbrio entre frequência e recuperação. Ideal para ganho de força e massa.',
    weekly: {
      0: [],
      1: ['Peito','Costas','Ombros','Bíceps','Tríceps'],
      2: ['Pernas','Glúteos','Abdômen'],
      3: [],
      4: ['Peito','Costas','Ombros','Bíceps','Tríceps'],
      5: ['Pernas','Glúteos','Abdômen'],
      6: []
    }
  },
  {
    id: 'fullbody',
    name: 'Full Body – 3x por semana',
    icon: '💥',
    difficulty: 'beginner',
    diffLabel: 'Iniciante',
    days: '3 dias / semana',
    desc: 'Treina o corpo todo em cada sessão. Ideal para iniciantes ou quem tem pouco tempo. Alta frequência por músculo garante boa progressão.',
    weekly: {
      0: [],
      1: ['Peito','Costas','Pernas','Abdômen'],
      2: [],
      3: ['Ombros','Bíceps','Tríceps','Glúteos','Abdômen'],
      4: [],
      5: ['Peito','Costas','Pernas','Abdômen'],
      6: []
    }
  },
  {
    id: 'brosplit',
    name: 'Bro Split – 1 músculo por dia',
    icon: '💪',
    difficulty: 'intermediate',
    diffLabel: 'Intermédio',
    days: '5 dias / semana',
    desc: 'Cada dia é dedicado a um grupo muscular específico. Permite volume máximo por músculo e alta intensidade. Clássico das academias.',
    weekly: {
      0: [],
      1: ['Peito'],
      2: ['Costas'],
      3: ['Pernas','Glúteos'],
      4: ['Ombros'],
      5: ['Bíceps','Tríceps','Abdômen'],
      6: []
    }
  },
  {
    id: 'arnold',
    name: 'Arnold Split',
    icon: '🏆',
    difficulty: 'advanced',
    diffLabel: 'Avançado',
    days: '6 dias / semana',
    desc: 'O programa de Arnold Schwarzenegger. Combina peito+costas, ombros+braços e pernas. Alta frequência e volume. Para atletas experientes.',
    weekly: {
      0: [],
      1: ['Peito','Costas'],
      2: ['Ombros','Bíceps','Tríceps'],
      3: ['Pernas','Glúteos','Abdômen'],
      4: ['Peito','Costas'],
      5: ['Ombros','Bíceps','Tríceps'],
      6: ['Pernas','Glúteos','Abdômen']
    }
  },
  {
    id: 'antagonist',
    name: 'Antagonistas – ABCD',
    icon: '⚡',
    difficulty: 'intermediate',
    diffLabel: 'Intermédio',
    days: '4 dias / semana',
    desc: 'Treina músculos opostos no mesmo dia (peito+tríceps, costas+bíceps). Permite boa recuperação entre séries e eficiência temporal.',
    weekly: {
      0: [],
      1: ['Peito','Tríceps'],
      2: ['Costas','Bíceps'],
      3: [],
      4: ['Pernas','Glúteos'],
      5: ['Ombros','Abdômen'],
      6: []
    }
  },
  {
    id: 'hiit3',
    name: 'Força + Cardio HIIT',
    icon: '🔥',
    difficulty: 'intermediate',
    diffLabel: 'Intermédio',
    days: '5 dias / semana',
    desc: 'Combina treino de força com sessões de cardio de alta intensidade. Ótimo para quem quer perder gordura e manter/ganhar músculo.',
    weekly: {
      0: [],
      1: ['Peito','Tríceps','Abdômen'],
      2: ['Pernas','Glúteos'],
      3: ['Costas','Bíceps','Abdômen'],
      4: ['Ombros','Pernas','Glúteos'],
      5: ['Peito','Costas','Abdômen'],
      6: []
    }
  },
  {
    id: 'glutes',
    name: 'Foco Glúteos & Pernas',
    icon: '🍑',
    difficulty: 'beginner',
    diffLabel: 'Iniciante',
    days: '4 dias / semana',
    desc: 'Programa com ênfase em glúteos e pernas, treinados com maior frequência. Complementado com treino de parte superior.',
    weekly: {
      0: [],
      1: ['Glúteos','Pernas'],
      2: ['Peito','Costas','Ombros'],
      3: [],
      4: ['Glúteos','Pernas','Abdômen'],
      5: ['Bíceps','Tríceps','Ombros'],
      6: []
    }
  },

  // ── CASA — Peso Corporal ──────────────────────────────────────────
  {
    id: 'home_fullbody3',
    name: 'Full Body Casa – 3x/semana',
    icon: '🏠',
    difficulty: 'beginner',
    diffLabel: 'Iniciante',
    days: '3 dias / semana',
    home: true,
    desc: 'Treino completo de peso corporal 3 vezes por semana. Sem equipamento, pode ser feito em qualquer sítio. Ideal para começar.',
    weekly: {
      0: [],
      1: ['Peito','Costas','Pernas','Abdômen'],
      2: [],
      3: ['Ombros','Glúteos','Pernas','Abdômen'],
      4: [],
      5: ['Peito','Costas','Pernas','Abdômen'],
      6: []
    }
  },
  {
    id: 'home_ppl',
    name: 'Push / Pull / Legs Casa',
    icon: '🏠',
    difficulty: 'intermediate',
    diffLabel: 'Intermédio',
    days: '3 dias / semana',
    home: true,
    desc: 'O clássico Push/Pull/Legs adaptado para peso corporal. Flexões e dips, superman e dominadas, agachamentos e glúteos.',
    weekly: {
      0: [],
      1: ['Peito','Ombros','Tríceps'],
      2: [],
      3: ['Costas','Bíceps'],
      4: [],
      5: ['Pernas','Glúteos','Abdômen'],
      6: []
    }
  },
  {
    id: 'home_upperlower',
    name: 'Superior / Inferior Casa',
    icon: '🏠',
    difficulty: 'beginner',
    diffLabel: 'Iniciante',
    days: '4 dias / semana',
    home: true,
    desc: 'Parte superior e inferior alternadas. Sem pesos, usa o peso do corpo para tonificar e fortalecer todo o corpo.',
    weekly: {
      0: [],
      1: ['Peito','Costas','Ombros','Tríceps'],
      2: ['Pernas','Glúteos','Abdômen'],
      3: [],
      4: ['Peito','Costas','Ombros','Bíceps'],
      5: ['Pernas','Glúteos','Abdômen'],
      6: []
    }
  },
  {
    id: 'home_hiit',
    name: 'HIIT + Força Casa',
    icon: '🏠',
    difficulty: 'intermediate',
    diffLabel: 'Intermédio',
    days: '4 dias / semana',
    home: true,
    desc: 'Combina força de peso corporal com cardio HIIT intenso. Queima de gordura máxima sem sair de casa.',
    weekly: {
      0: [],
      1: ['Peito','Costas','Abdômen'],
      2: ['Pernas','Glúteos'],
      3: [],
      4: ['Pernas','Abdômen'],
      5: ['Peito','Ombros','Costas'],
      6: []
    }
  },
  {
    id: 'home_5days',
    name: 'Full Body Diário Casa',
    icon: '🏠',
    difficulty: 'intermediate',
    diffLabel: 'Intermédio',
    days: '5 dias / semana',
    home: true,
    desc: 'Cinco sessões de peso corporal por semana com foco diferente em cada dia. Alta frequência para progressão rápida.',
    weekly: {
      0: [],
      1: ['Peito','Costas','Abdômen'],
      2: ['Pernas','Glúteos'],
      3: ['Ombros','Bíceps','Tríceps'],
      4: ['Pernas','Glúteos','Abdômen'],
      5: ['Peito','Costas','Ombros'],
      6: []
    }
  },
  {
    id: 'home_glutes',
    name: 'Glúteos & Pernas Casa',
    icon: '🏠',
    difficulty: 'beginner',
    diffLabel: 'Iniciante',
    days: '4 dias / semana',
    home: true,
    desc: 'Foco total em glúteos e pernas com peso corporal. Agachamentos, afundos, elevações de quadril, fire hydrant e muito mais.',
    weekly: {
      0: [],
      1: ['Glúteos','Pernas'],
      2: ['Peito','Costas','Abdômen'],
      3: [],
      4: ['Glúteos','Pernas','Abdômen'],
      5: ['Ombros','Costas','Abdômen'],
      6: []
    }
  }
];

const DAY_SHORT = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
let presetMode = 'gym';

function setPresetMode(mode) {
  presetMode = mode;
  renderPresetPlans();
}

function _diffLabel(d) {
  const map = { beginner: 'diff_beginner', intermediate: 'diff_intermediate', advanced: 'diff_advanced' };
  return map[d] ? t(map[d]) : d;
}

function renderPresetPlans() {
  const el = document.getElementById('preset-plans-list');
  const filtered = PRESET_PLANS.filter(p => presetMode === 'home' ? p.home === true : !p.home);

  const toggle = `
    <div style="display:flex;gap:6px;margin-bottom:16px;">
      <button onclick="setPresetMode('gym')"
        style="flex:1;padding:7px;border-radius:20px;font-size:0.8rem;font-weight:700;cursor:pointer;
               border:1px solid ${presetMode==='gym'?'var(--orange)':'var(--border)'};
               background:${presetMode==='gym'?'rgba(255,107,53,0.15)':'rgba(255,255,255,0.04)'};
               color:${presetMode==='gym'?'var(--orange)':'var(--muted)'};">${t('preset_gym_btn')}</button>
      <button onclick="setPresetMode('home')"
        style="flex:1;padding:7px;border-radius:20px;font-size:0.8rem;font-weight:700;cursor:pointer;
               border:1px solid ${presetMode==='home'?'var(--orange)':'var(--border)'};
               background:${presetMode==='home'?'rgba(255,107,53,0.15)':'rgba(255,255,255,0.04)'};
               color:${presetMode==='home'?'var(--orange)':'var(--muted)'};">${t('preset_home_btn')}</button>
    </div>`;

  const cards = filtered.map(plan => {
    const diffClass = `diff-${plan.difficulty}`;
    const rows = DAY_SHORT.map((d, i) => {
      const muscles = plan.weekly[i] || [];
      return `<div class="preset-day-row">
        <span class="preset-day-name">${d}</span>
        <span class="${muscles.length ? 'preset-day-muscles' : 'preset-day-rest'}">${muscles.length ? muscles.map(tMuscle).join(', ') : t('dash_rest_label')}</span>
      </div>`;
    }).join('');
    return `
      <div class="preset-card" onclick="showPresetDetail('${plan.id}')">
        <div class="preset-name">${plan.icon} ${_planName(plan)}</div>
        <div class="preset-meta">
          <span class="difficulty-badge ${diffClass}">${_diffLabel(plan.difficulty)}</span>
          <span>${_planDays(plan)}</span>
        </div>
        <div class="preset-days">${rows}</div>
      </div>`;
  }).join('');

  el.innerHTML = toggle + cards;
}

function showPresetDetail(planId) {
  const plan = PRESET_PLANS.find(p => p.id === planId);
  if (!plan) return;
  const diffClass = `diff-${plan.difficulty}`;
  const rows = DAY_SHORT.map((d, i) => {
    const muscles = plan.weekly[i] || [];
    return `<div class="preset-day-row" style="padding:10px 0; border-bottom:1px solid var(--border);">
      <span class="preset-day-name" style="width:36px; font-size:0.82rem;">${d}</span>
      <span class="${muscles.length ? 'preset-day-muscles' : 'preset-day-rest'}" style="font-size:0.85rem; flex:1;">${muscles.length ? muscles.map(tMuscle).join(' · ') : `🛌 ${t('dash_rest_label')}`}</span>
    </div>`;
  }).join('');

  document.getElementById('preset-detail-content').innerHTML = `
    <div style="font-size:1.2rem; font-weight:800; margin-bottom:6px;">${plan.icon} ${_planName(plan)}</div>
    <div style="margin-bottom:10px;">
      <span class="difficulty-badge ${diffClass}">${_diffLabel(plan.difficulty)}</span>
      <span style="font-size:0.8rem; color:var(--muted);">${_planDays(plan)}</span>
    </div>
    <p style="font-size:0.85rem; color:var(--muted); margin-bottom:16px; line-height:1.5;">${_planDesc(plan)}</p>
    <div style="font-size:0.72rem; color:var(--muted); text-transform:uppercase; letter-spacing:.5px; margin-bottom:8px; font-weight:700;">${t('preset_weekly_split')}</div>
    <div style="margin-bottom:20px;">${rows}</div>
    <div style="display:flex; gap:10px;">
      <button class="btn btn-secondary btn-full" onclick="closeModal('modal-preset-detail')">${t('preset_back_btn')}</button>
      <button class="btn btn-primary btn-full" onclick="applyPresetPlan('${plan.id}')">${t('preset_apply_btn')}</button>
    </div>`;
  closeModal('modal-preset-plans');
  openModal('modal-preset-detail');
}

function applyPresetPlan(planId) {
  const plan = PRESET_PLANS.find(p => p.id === planId);
  if (!plan) return;
  const profile = getProfile();
  profile.weeklyPlan = JSON.parse(JSON.stringify(plan.weekly));
  saveProfile(profile);
  closeModal('modal-preset-detail');
  renderPlanner();
  renderDashboard();
  showToast(`✔ "${plan.name}" ${t('link_created')}`);
  navigate('planner', document.querySelector('[data-screen="planner"]'));
}

// ═══════════════════════════════════════════════════════
//  MODAL HELPERS
// ═══════════════════════════════════════════════════════

function openModal(id) {
  document.getElementById(id).classList.add('open');
  if (id === 'modal-preset-plans') renderPresetPlans();
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
});

// ═══════════════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════════════

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

// ─── Notifications ────────────────────────────────────
async function requestNotificationPermission() {
  if (!('Notification' in window)) { showToast(t('t_notif_unsupported')); return false; }
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

function scheduleWorkoutReminder(timeStr) {
  // timeStr = "HH:MM"
  if (!timeStr) return;
  const profile = getProfile();
  if (!profile) return;
  profile.reminderTime = timeStr;
  saveProfile(profile);
  showToast(t('t_reminder_saved').replace('{time}', timeStr));
  _scheduleNextReminder(timeStr);
}

function _scheduleNextReminder(timeStr) {
  if (Notification.permission !== 'granted') return;
  const [h, m] = timeStr.split(':').map(Number);
  const now = new Date();
  const next = new Date();
  next.setHours(h, m, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  const msUntil = next - now;
  // Store timeout id so we can clear it
  if (window._reminderTimeout) clearTimeout(window._reminderTimeout);
  window._reminderTimeout = setTimeout(() => {
    const p = getProfile();
    const day = new Date().getDay();
    const muscles = (p && p.weeklyPlan && p.weeklyPlan[day]) || [];
    const body = muscles.length
      ? t('notif_workout_today') + muscles.map(tMuscle).join(', ') + '. 💪'
      : t('notif_workout_generic');
    new Notification('PRKH – Personal Trainer', { body, icon: './icon-192.png', badge: './icon-192.png', tag: 'workout-reminder' });
    // Schedule next day
    _scheduleNextReminder(timeStr);
  }, msUntil);
}

function initNotifications() {
  const profile = getProfile();
  if (!profile || !profile.reminderTime) return;
  if (Notification.permission !== 'granted') return;
  _scheduleNextReminder(profile.reminderTime);
}

async function setReminder() {
  const input = document.getElementById('reminder-time');
  if (!input) return;
  const granted = await requestNotificationPermission();
  if (!granted) { showToast(t('t_notif_denied')); return; }
  scheduleWorkoutReminder(input.value);
  renderProfileTab();
}

// ═══════════════════════════════════════════════════════
//  GRAVIDEZ — dados e lógica
// ═══════════════════════════════════════════════════════

// Exercícios a EVITAR durante a gravidez (risco real)
const PREGNANCY_AVOID = new Set([
  // Supino deitado (após 1º trimestre, compressão da veia cava)
  'Supino Reto c/ Barra','Supino Reto c/ Halteres','Supino Reto','Supino Neutro c/ Halteres',
  'Supino Declinado c/ Barra','Supino Declinado c/ Halteres',
  'Crucifixo c/ Halteres','Crucifixo na Polia','Crucifixo',
  'Pull Over c/ Halteres','Pull Over na Polia','Chest Press na Máquina',
  // Abdominais que aumentam pressão intra-abdominal
  'Abdominal Crunch','Crunch Invertido','Crunch na Máquina',
  'Abdominal Bicicleta','Hollow Body','Abdominal Roda','Toque no Calcanhar',
  'Elevação de Pernas','Russian Twist','Abdominal em Cabo',
  // Alto impacto / risco de queda
  'Box Jump','Agachamento com Salto','Burpee',
]);

// Exercícios a MODIFICAR (fazer com peso reduzido e monitorização)
const PREGNANCY_CAUTION = new Set([
  'Agachamento Livre','Agachamento Sumô','Agachamento Hack','Agachamento Smith','Agachamento Frontal',
  'Agachamento Goblet',
  'Peso Morto','Peso Morto Romeno','Peso Morto Sumo','Peso Morto c/ Halteres',
  'Prancha Frontal','Prancha Lateral Direita','Prancha Lateral Esquerda','Prancha com Toque no Ombro',
  'Prancha','Prancha Lateral','TRX Prancha',
  'Supino Inclinado c/ Barra','Supino Inclinado c/ Halteres','Supino Inclinado',
  'Agachamento Búlgaro','Fenda','Fenda Caminhada','Fenda c/ Halteres',
  'Hip Thrust','Hip Thrust c/ Barra','Extensão de Quadril',
  'Leg Press 45°','Leg Press Horizontal','Hack Squat',
]);

// Exercícios RECOMENDADOS durante a gravidez
const PREGNANCY_SAFE_TIPS = [
  'Caminhada','Natação','Yoga Pré-natal','Pilates (modificado)',
  'Remada na Polia','Puxada na Polia','Rosca Direta','Rosca Alternada',
  'Desenvolvimento com Halteres','Elevação Lateral','Agachamento Sumô',
  'Prancha Modificada (joelhos no chão)','Exercícios Kegel',
];

function isPregnant(profile) {
  return !!(profile && profile.healthProfile && profile.healthProfile.pregnant);
}

function getPregnancyTrimester(profile) {
  return (profile && profile.healthProfile && profile.healthProfile.trimester) || 1;
}

function getPregnancyWarning(exName, trimester) {
  if (PREGNANCY_AVOID.has(exName)) {
    return {
      level: 'avoid',
      msg: trimester >= 2
        ? '🚫 Evitar na gravidez — risco de pressão abdominal ou posição supina'
        : '⚠️ Cuidado no 1º trimestre — evitar a partir do 2º trimestre',
    };
  }
  if (PREGNANCY_CAUTION.has(exName)) {
    return {
      level: 'caution',
      msg: '⚠️ Modificar na gravidez — reduzir peso, amplitude e intensidade',
    };
  }
  return null;
}

function togglePregnancy(checked) {
  const profile = getProfile();
  if (!profile) return;
  if (!profile.healthProfile) profile.healthProfile = {};
  profile.healthProfile.pregnant = checked;
  if (!checked) delete profile.healthProfile.trimester;
  else if (!profile.healthProfile.trimester) profile.healthProfile.trimester = 1;
  saveProfile(profile);
  renderHealthModal();
  renderWorkout();
}

function setTrimester(val) {
  const profile = getProfile();
  if (!profile) return;
  if (!profile.healthProfile) profile.healthProfile = {};
  profile.healthProfile.trimester = parseInt(val);
  saveProfile(profile);
  // Atualizar apenas os botões de trimestre sem re-renderizar o modal todo
  [1, 2, 3].forEach(t => {
    const btn = document.querySelector(`#pregnancy-trimester-row button:nth-child(${t})`);
    if (!btn) return;
    const active = t === parseInt(val);
    btn.style.borderColor = active ? '#ff69b4' : 'var(--border)';
    btn.style.background = active ? 'rgba(255,105,180,0.15)' : 'rgba(255,255,255,0.04)';
    btn.style.color = active ? '#ff69b4' : 'var(--muted)';
  });
  renderWorkout();
}

// ═══════════════════════════════════════════════════════
//  REST TIMER
// ═══════════════════════════════════════════════════════

let _restTimerInterval = null;
let _restTimerTotal = 60;
let _restTimerRemaining = 60;
let _lastRestSeconds = parseInt(localStorage.getItem('prkh_last_rest') || '', 10) || 90;

function startRestTimer(seconds) {
  // Sem argumento → usa o último tempo escolhido (relembrado).
  if (!seconds) seconds = _lastRestSeconds;
  _lastRestSeconds = seconds;
  try { localStorage.setItem('prkh_last_rest', String(seconds)); } catch (e) {}
  if (_restTimerInterval) clearInterval(_restTimerInterval);
  _restTimerTotal = seconds;
  _restTimerRemaining = seconds;
  const el = document.getElementById('rest-timer-float');
  if (el) el.style.display = 'block';
  _highlightRestPreset(seconds);
  _updateRestTimerUI();
  _restTimerInterval = setInterval(() => {
    _restTimerRemaining--;
    _updateRestTimerUI();
    if (_restTimerRemaining <= 0) {
      clearInterval(_restTimerInterval);
      _restTimerInterval = null;
      if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
      showToast(t('t_rest_done'));
      setTimeout(stopRestTimer, 3000);
    }
  }, 1000);
}

function _updateRestTimerUI() {
  const m = Math.floor(_restTimerRemaining / 60);
  const s = _restTimerRemaining % 60;
  const display = document.getElementById('rest-timer-display');
  const bar = document.getElementById('rest-timer-bar');
  if (!display) return;
  display.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  const pct = _restTimerTotal > 0 ? (_restTimerRemaining / _restTimerTotal) * 100 : 0;
  if (bar) bar.style.width = pct + '%';
  const color = pct > 50 ? 'var(--green)' : pct > 25 ? '#f39c12' : '#e74c3c';
  display.style.color = color;
  if (bar) bar.style.background = color;
}

function stopRestTimer() {
  if (_restTimerInterval) clearInterval(_restTimerInterval);
  _restTimerInterval = null;
  const el = document.getElementById('rest-timer-float');
  if (el) el.style.display = 'none';
}

// Realça o botão de preset correspondente ao tempo relembrado
function _highlightRestPreset(sec) {
  document.querySelectorAll('#rest-timer-float button[data-rest]').forEach(b => {
    const on = parseInt(b.getAttribute('data-rest'), 10) === sec;
    b.style.background = on ? 'rgba(0,212,170,0.22)' : 'rgba(255,255,255,0.06)';
    b.style.borderColor = on ? 'var(--green)' : 'var(--border)';
    b.style.color = on ? 'var(--green)' : 'var(--muted)';
  });
}

// ═══════════════════════════════════════════════════════
//  PERSONAL RECORDS (PRs)
// ═══════════════════════════════════════════════════════

function getPRs(profile) {
  return profile.prs || {};
}

function updatePRs(profile, exercises) {
  if (!profile.prs) profile.prs = {};
  const newPRs = [];
  exercises.forEach(ex => {
    const name = ex.name;
    const current = profile.prs[name] || { maxWeight: 0, max1RM: 0 };
    ex.sets.forEach(s => {
      if (!s.weight || !s.reps) return;
      // Epley 1RM estimate
      const oneRM = s.reps === 1 ? s.weight : Math.round(s.weight * (1 + s.reps / 30));
      if (oneRM > (current.max1RM || 0)) {
        const isNew = (current.max1RM || 0) > 0;
        current.max1RM = oneRM;
        current.maxWeight = s.weight;
        current.maxReps = s.reps;
        current.date = new Date().toISOString();
        if (isNew) newPRs.push(name);
      }
    });
    profile.prs[name] = current;
  });
  return newPRs;
}

function getPRBadge(profile, exName, weight, reps) {
  if (!weight || !reps) return '';
  const pr = (profile.prs || {})[exName];
  if (!pr || !pr.max1RM) return '';
  const oneRM = reps === 1 ? weight : Math.round(weight * (1 + reps / 30));
  if (oneRM >= pr.max1RM) {
    return `<span style="font-size:0.6rem;background:rgba(255,215,0,0.15);border:1px solid rgba(255,215,0,0.4);
                          color:#ffd700;border-radius:10px;padding:1px 5px;font-weight:800;letter-spacing:0.04em;">🏆 PR</span>`;
  }
  return '';
}

// ═══════════════════════════════════════════════════════
//  WATER TRACKER
// ═══════════════════════════════════════════════════════

function _waterKey() {
  return new Date().toISOString().slice(0, 10);
}

function getWaterToday(profile) {
  return ((profile.waterLog || {})[_waterKey()] || 0);
}

function openWaterModal() {
  const profile = getProfile();
  if (!profile) return;
  _renderWaterModal(profile);
  openModal('modal-water');
}

function _renderWaterModal(profile) {
  const amount = getWaterToday(profile);
  const goal = profile.waterGoal || 2000;
  const pct = Math.min(100, Math.round((amount / goal) * 100));
  const amountEl = document.getElementById('water-modal-amount');
  const goalEl = document.getElementById('water-modal-goal');
  const barEl = document.getElementById('water-modal-bar');
  if (amountEl) amountEl.textContent = amount;
  if (goalEl) goalEl.textContent = goal;
  if (barEl) barEl.style.width = pct + '%';
}

function addWater(ml) {
  const profile = getProfile();
  if (!profile) return;
  if (!profile.waterLog) profile.waterLog = {};
  const key = _waterKey();
  profile.waterLog[key] = (profile.waterLog[key] || 0) + ml;
  saveProfile(profile);
  _renderWaterModal(profile);
  _updateWaterDashboard(profile);
  showToast(`💧 ${t('t_water_added').replace('{ml}', ml)}`);
}

function resetWater() {
  const profile = getProfile();
  if (!profile) return;
  if (!profile.waterLog) profile.waterLog = {};
  profile.waterLog[_waterKey()] = 0;
  saveProfile(profile);
  _renderWaterModal(profile);
  _updateWaterDashboard(profile);
}

function _updateWaterDashboard(profile) {
  const amount = getWaterToday(profile);
  const goal = profile.waterGoal || 2000;
  const valEl = document.getElementById('dash-water-value');
  const goalEl = document.getElementById('dash-water-goal');
  if (valEl) valEl.textContent = amount;
  if (goalEl) goalEl.textContent = goal;
}

// ═══════════════════════════════════════════════════════
//  STREAK
// ═══════════════════════════════════════════════════════

function calcStreak(profile) {
  const history = profile.workoutHistory || [];
  if (!history.length) return 0;
  const today = new Date(); today.setHours(0,0,0,0);
  const days = new Set(history.map(w => new Date(w.date).toISOString().slice(0,10)));
  let streak = 0;
  const check = new Date(today);
  // If trained today, start from today; else start from yesterday
  const todayStr = today.toISOString().slice(0,10);
  if (!days.has(todayStr)) check.setDate(check.getDate() - 1);
  while (true) {
    const str = check.toISOString().slice(0,10);
    if (!days.has(str)) break;
    streak++;
    check.setDate(check.getDate() - 1);
    if (streak > 3650) break;
  }
  return streak;
}

function _updateStreakDashboard(profile) {
  const streak = calcStreak(profile);
  const el = document.getElementById('dash-streak-value');
  if (el) {
    el.textContent = streak;
    el.style.color = streak >= 7 ? '#ffd700' : streak >= 3 ? '#ff6b35' : 'var(--muted)';
  }
}

// ═══════════════════════════════════════════════════════
//  HISTORY CHARTS (SVG inline)
// ═══════════════════════════════════════════════════════

function renderHistoryCharts(profile) {
  const el = document.getElementById('history-charts');
  if (!el) return;
  const history = (profile.workoutHistory || []).slice().reverse(); // oldest first
  if (!history.length) { el.innerHTML = ''; return; }

  // ── Stats ──────────────────────────────────────────────────────────
  const now = new Date();
  const dow = now.getDay() === 0 ? 6 : now.getDay() - 1; // Mon=0
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dow);
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisWeek  = history.filter(w => new Date(w.date) >= startOfWeek).length;
  const thisMonth = history.filter(w => new Date(w.date) >= startOfMonth).length;
  const total     = history.length;

  // Streak: dias consecutivos com pelo menos 1 treino
  const trainedDays = new Set(history.map(w => new Date(w.date).toDateString()));
  let streak = 0;
  const sd = new Date(now); sd.setHours(0, 0, 0, 0);
  if (!trainedDays.has(sd.toDateString())) sd.setDate(sd.getDate() - 1);
  while (trainedDays.has(sd.toDateString())) { streak++; sd.setDate(sd.getDate() - 1); }

  // ── Volume chart (últimos 8 treinos) ──────────────────────────────
  const recent = history.slice(-8);
  const vols = recent.map(w => w.exercises.reduce((a, e) =>
    a + e.sets.reduce((b, s) => b + s.reps * (s.weight || 0), 0), 0));
  const maxVol = Math.max(...vols, 1);

  const chartHtml = recent.length >= 2 ? `
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:14px;margin-top:12px;">
      <div style="font-size:0.65rem;font-weight:700;color:var(--muted);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.08em;">
        📊 Volume por treino &nbsp;<span style="font-weight:400;text-transform:none;opacity:.55;">kg total levantados</span>
      </div>
      <div style="display:flex;align-items:flex-end;gap:4px;height:80px;padding-bottom:22px;position:relative;">
        ${vols.map((v, i) => {
          const barH = Math.max(4, Math.round((v / maxVol) * 56));
          const date  = new Date(recent[i].date).toLocaleDateString('pt-PT', {day:'2-digit', month:'2-digit'});
          const isLast = i === vols.length - 1;
          const label = v >= 1000 ? (v/1000).toFixed(1)+'t' : (v > 0 ? v+'kg' : '');
          return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;position:relative;">
            <div style="font-size:0.46rem;color:${isLast ? 'var(--orange)' : 'rgba(255,255,255,0.38)'};margin-bottom:3px;text-align:center;font-weight:700;">${label}</div>
            <div style="width:100%;height:${barH}px;background:${isLast ? 'var(--orange)' : 'rgba(255,107,53,0.38)'};border-radius:4px 4px 0 0;"></div>
            <div style="position:absolute;bottom:-18px;font-size:0.46rem;color:rgba(255,255,255,0.32);white-space:nowrap;">${date}</div>
          </div>`;
        }).join('')}
      </div>
    </div>` : '';

  el.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
      <div style="background:rgba(255,107,53,0.1);border:1px solid rgba(255,107,53,0.22);border-radius:12px;padding:10px 6px;text-align:center;">
        <div style="font-size:1.6rem;font-weight:800;color:var(--orange);line-height:1;">${total}</div>
        <div style="font-size:0.55rem;color:var(--muted);margin-top:4px;line-height:1.3;">TOTAL<br>TREINOS</div>
      </div>
      <div style="background:rgba(0,212,170,0.08);border:1px solid rgba(0,212,170,0.22);border-radius:12px;padding:10px 6px;text-align:center;">
        <div style="font-size:1.6rem;font-weight:800;color:var(--green);line-height:1;">${thisWeek}</div>
        <div style="font-size:0.55rem;color:var(--muted);margin-top:4px;line-height:1.3;">ESTA<br>SEMANA</div>
      </div>
      <div style="background:rgba(176,125,255,0.08);border:1px solid rgba(176,125,255,0.22);border-radius:12px;padding:10px 6px;text-align:center;">
        <div style="font-size:1.6rem;font-weight:800;color:#b07dff;line-height:1;">${streak > 0 ? streak + '🔥' : '0'}</div>
        <div style="font-size:0.55rem;color:var(--muted);margin-top:4px;line-height:1.3;">DIAS<br>SEGUIDOS</div>
      </div>
      <div style="background:rgba(0,170,255,0.08);border:1px solid rgba(0,170,255,0.22);border-radius:12px;padding:10px 6px;text-align:center;">
        <div style="font-size:1.6rem;font-weight:800;color:#00aaff;line-height:1;">${thisMonth}</div>
        <div style="font-size:0.55rem;color:var(--muted);margin-top:4px;line-height:1.3;">ESTE<br>MÊS</div>
      </div>
    </div>
    ${chartHtml}
  `;
}

// ═══════════════════════════════════════════════════════
//  EXPORT CSV
// ═══════════════════════════════════════════════════════

function exportWorkoutCSV() {
  const profile = getProfile();
  if (!profile) return;
  const history = profile.workoutHistory || [];
  if (!history.length) { showToast(t('t_no_history')); return; }
  const rows = [[t('csv_date'),t('csv_day'),t('csv_exercise'),t('csv_muscle'),t('csv_set'),t('csv_reps'),t('csv_weight'),t('csv_volume')]];
  history.forEach(w => {
    const dateStr = new Date(w.date).toLocaleDateString();
    w.exercises.forEach(ex => {
      ex.sets.forEach((s,si) => {
        rows.push([dateStr, w.day||'', ex.name, ex.muscle, si+1, s.reps, s.weight||0, s.reps*(s.weight||0)]);
      });
    });
  });
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(['﻿'+csv], {type:'text/csv;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `prkh_treinos_${profile.name.replace(/\s+/g,'_')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(t('t_csv_exported'));
}

// ═══════════════════════════════════════════════════════
//  ONBOARDING
// ═══════════════════════════════════════════════════════

// OB_SLIDES are now language-aware — resolved at render time via OB_SLIDES_BY_LANG[getLang()]
function getObSlides() {
  const lang = typeof getLang === 'function' ? getLang() : 'pt';
  return (typeof OB_SLIDES_BY_LANG !== 'undefined' && OB_SLIDES_BY_LANG[lang]) || OB_SLIDES_BY_LANG['pt'];
}

let _obSlide = 0;

function showOnboarding() {
  _obSlide = 0;
  _renderObSlide();
  const el = document.getElementById('onboarding-overlay');
  if (el) { el.style.display = 'flex'; }
}

function _renderObSlide() {
  const slides = getObSlides();
  const slide = slides[_obSlide];
  const content = document.getElementById('ob-slide-content');
  if (!content) return;
  content.innerHTML = `
    <div style="font-size:4rem;margin-bottom:20px;line-height:1;">${slide.icon}</div>
    <div style="font-size:1.6rem;font-weight:900;margin-bottom:12px;line-height:1.2;">${slide.title}</div>
    <div style="font-size:0.9rem;color:var(--muted);line-height:1.6;">${slide.text}</div>
  `;
  slides.forEach((_,i) => {
    const dot = document.getElementById(`ob-dot-${i}`);
    if (dot) dot.style.background = i === _obSlide ? 'var(--orange)' : 'rgba(255,255,255,0.2)';
  });
  const btn = document.getElementById('ob-next-btn');
  if (btn) btn.textContent = _obSlide === slides.length - 1 ? t('ob_finish') : t('ob_next');
}

function onboardingNext() {
  _obSlide++;
  if (_obSlide >= getObSlides().length) { onboardingSkip(); return; }
  _renderObSlide();
}

function onboardingSkip() {
  const el = document.getElementById('onboarding-overlay');
  if (el) el.style.display = 'none';
  const profile = getProfile();
  if (profile) { profile.onboardingDone = true; saveProfile(profile); }
}

// ═══════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════

window.initAppAfterAuth = function() {
  const d = getData();
  if (d.activeProfile && d.profiles.find(p => p.id === d.activeProfile)) {
    document.getElementById('profile-screen').style.display = 'none';
    if (typeof hideHomeLangPicker === 'function') hideHomeLangPicker();
    launchApp();
  } else {
    renderProfileScreen();
  }
};

