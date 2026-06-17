// ═══════════════════════════════════════════════════════
//  GOLD PARTICLE SYSTEM — live animated background
// ═══════════════════════════════════════════════════════
(function initGoldParticles() {
  const canvas = document.getElementById('gold-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Palette: true gold tones
  const GOLD_COLORS = [
    'rgba(212,175,55,',   // classic gold
    'rgba(245,208,96,',   // bright gold
    'rgba(160,132,42,',   // dark gold
    'rgba(255,223,100,',  // pale gold
    'rgba(200,158,28,',   // rich gold
  ];

  let W, H, particles = [], dpr = window.devicePixelRatio || 1;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
  }

  function rand(min, max) { return min + Math.random() * (max - min); }

  function makeParticle() {
    const size = rand(0.4, 2.2);
    return {
      x: rand(0, W),
      y: rand(0, H),
      vx: rand(-0.12, 0.12),
      vy: rand(-0.22, -0.06),   // drift upward slowly
      size,
      alpha: rand(0.05, 0.45),
      alphaDir: Math.random() > 0.5 ? 1 : -1,
      alphaSpeed: rand(0.002, 0.008),
      color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
      // shimmer flicker
      flicker: Math.random() > 0.75,
      flickerSpeed: rand(0.04, 0.12),
      flickerPhase: rand(0, Math.PI * 2),
    };
  }

  function spawnParticles() {
    // density: ~1 particle per 3500 sq px, capped 180
    const count = Math.min(Math.floor((W * H) / 3500), 180);
    particles = Array.from({ length: count }, makeParticle);
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // move
      p.x += p.vx;
      p.y += p.vy;

      // wrap
      if (p.y < -4) { p.y = H + 4; p.x = rand(0, W); }
      if (p.x < -4) p.x = W + 4;
      if (p.x > W + 4) p.x = -4;

      // breathe alpha
      p.alpha += p.alphaDir * p.alphaSpeed;
      if (p.alpha > 0.5 || p.alpha < 0.04) p.alphaDir *= -1;

      // flicker
      let a = p.alpha;
      if (p.flicker) a *= 0.6 + 0.4 * Math.sin(frame * p.flickerSpeed + p.flickerPhase);

      // draw — star/sparkle shape for bigger particles, dot for small
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, a));
      ctx.fillStyle = p.color + a.toFixed(3) + ')';

      if (p.size > 1.4) {
        // small 4-point star
        const s = p.size;
        ctx.translate(p.x, p.y);
        ctx.beginPath();
        for (let k = 0; k < 8; k++) {
          const angle = (k * Math.PI) / 4;
          const r = k % 2 === 0 ? s * 1.5 : s * 0.5;
          k === 0 ? ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
                  : ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        // simple circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    requestAnimationFrame(draw);
  }

  resize();
  spawnParticles();
  draw();
  window.addEventListener('resize', () => { resize(); spawnParticles(); });
})();

// ═══════════════════════════════════════════════════════
//  DATA LAYER
// ═══════════════════════════════════════════════════════

const MUSCLES = ['Peito','Costas','Pernas','Ombros','Bíceps','Tríceps','Abdômen','Glúteos'];
const DAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const DAYS_FULL = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];

const EXERCISE_LIBRARY = {
  'Peito': [
    'Supino Reto c/ Barra','Supino Reto c/ Halteres','Supino Inclinado c/ Barra','Supino Inclinado c/ Halteres',
    'Supino Declinado c/ Barra','Supino Declinado c/ Halteres','Crucifixo c/ Halteres','Crucifixo na Polia',
    'Peck Deck','Crossover','Flexão de Braço','Flexão Inclinada','Flexão Declinada','Flexão com Palmas Juntas',
    'Pull Over c/ Halteres','Pull Over na Polia','Supino Neutro c/ Halteres','Chest Press na Máquina',
    'Fly na Máquina','Dips (Mergulho no Banco)',
  ],
  'Costas': [
    'Puxada Frente c/ Barra','Puxada Frente c/ Triângulo','Puxada Aberta','Puxada com Pegada Neutra',
    'Remada Curvada c/ Barra','Remada Curvada c/ Halteres','Remada Unilateral c/ Halter','Remada Máquina',
    'Remada Sentado na Polia','Levantamento Terra','Levantamento Terra Romeno','Serrote c/ Halter',
    'Pull-down com Corda','Barra Fixa','Barra Fixa Supinada','Straight-arm Pulldown',
    'Hiperextensão Lombar','Face Pull','Remada Alta','Good Morning',
  ],
  'Pernas': [
    'Agachamento Livre','Agachamento Goblet','Agachamento Frontal','Agachamento Búlgaro',
    'Leg Press 45°','Leg Press Horizontal','Hack Squat','Extensão de Pernas',
    'Flexão de Pernas Deitado','Flexão de Pernas em Pé','Stiff c/ Barra','Stiff c/ Halteres',
    'Avanço c/ Halteres','Avanço c/ Barra','Avanço Reverso','Afundo Lateral',
    'Panturrilha em Pé','Panturrilha Sentado','Panturrilha no Leg Press','Cadeira Adutora',
    'Cadeira Abdutora','Step-up','Sissy Squat','Wall Sit',
  ],
  'Ombros': [
    'Desenvolvimento c/ Barra (à frente)','Desenvolvimento c/ Barra (atrás)','Desenvolvimento c/ Halteres',
    'Arnold Press','Press na Máquina','Elevação Lateral c/ Halteres','Elevação Lateral na Polia',
    'Elevação Frontal c/ Halteres','Elevação Frontal c/ Barra','Elevação Frontal com Disco',
    'Encolhimento de Ombros c/ Barra','Encolhimento de Ombros c/ Halteres','Encolhimento na Máquina',
    'Face Pull na Polia','Crucifixo Invertido c/ Halteres','Crucifixo Invertido na Máquina',
    'Rotação Interna na Polia','Rotação Externa na Polia','Upright Row c/ Barra','Upright Row c/ Halteres',
  ],
  'Bíceps': [
    'Rosca Direta c/ Barra','Rosca Direta c/ Barra EZ','Rosca Alternada c/ Halteres',
    'Rosca Concentrada','Rosca Martelo','Rosca Martelo com Corda','Rosca Scott c/ Barra EZ',
    'Rosca Scott c/ Halteres','Rosca na Polia Baixa','Rosca Inversa c/ Barra',
    'Rosca Inclinada c/ Halteres','Rosca 21','Rosca Cabo c/ Corda','Curl Isométrico',
    'Chin-up (Barra Supinada)','Rosca Spider','Rosca com Elástico',
  ],
  'Tríceps': [
    'Tríceps Corda na Polia','Tríceps Polia Alta c/ Barra','Tríceps Francês c/ Barra EZ',
    'Tríceps Francês c/ Halteres','Extensão Testa c/ Barra','Extensão Testa c/ Halteres',
    'Tríceps Mergulho (Dips)','Tríceps Mergulho no Banco','Kickback c/ Halter',
    'Kickback na Polia','Close Grip Bench Press','Tríceps Coice','Tríceps Polia Inversa',
    'Skullcrusher','Extensão Unilateral na Polia','Press de Tríceps na Máquina',
  ],
  'Abdômen': [
    'Abdominal Crunch','Crunch Invertido','Crunch na Máquina','Prancha Frontal',
    'Prancha Lateral Direita','Prancha Lateral Esquerda','Prancha com Toque no Ombro',
    'Elevação de Pernas Deitado','Elevação de Pernas Suspenso','Knee Raise','Leg Raise na Barra',
    'Abdominal Bicicleta','Hollow Body','Abdominal Roda','Toque no Calcanhar',
    'Russian Twist','Russian Twist c/ Peso','Oblíquo c/ Halter','Oblíquo na Polia',
    'Mountain Climber','Dead Bug','Sit-up','V-up','Dragon Flag',
  ],
  'Glúteos': [
    'Hip Thrust c/ Barra','Hip Thrust c/ Halteres','Hip Thrust na Máquina',
    'Agachamento Sumô c/ Barra','Agachamento Sumô c/ Halter','Elevação de Quadril no Chão',
    'Abdução de Quadril na Máquina','Abdução com Elástico','Donkey Kicks','Fire Hydrant',
    'Passada c/ Halteres','Passada Reversa','Step-up c/ Halteres','Avanço Lateral',
    'Stiff c/ Foco Glúteo','Leg Press c/ Foco Glúteo','Glute Kickback na Polia',
    'Elevação Pélvica c/ Elástico','Agachamento com Elástico','Ponte de Glúteos',
  ],
};

const AVATAR_COLORS = ['#D4AF37','#C9A227','#A0842A','#F5D060','#8B6914','#BFA030','#D4B845','#E8CC60'];

function getData() {
  return JSON.parse(localStorage.getItem('fitpro_data') || '{"profiles":[],"activeProfile":null}');
}
function saveData(d) { localStorage.setItem('fitpro_data', JSON.stringify(d)); }

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
  const list = document.getElementById('profile-list');
  if (!d.profiles.length) {
    list.innerHTML = '<div class="empty"><div class="icon">👤</div><p>Ainda não há perfis criados.</p></div>';
    return;
  }
  list.innerHTML = d.profiles.map(p => `
    <div class="profile-card" onclick="selectProfile('${p.id}')">
      <div class="avatar-big" style="background:${p.color}">${p.name[0].toUpperCase()}</div>
      <div class="info">
        <div class="name">${p.name}</div>
        <div class="meta">${p.weight ? p.weight+'kg · ' : ''}${p.age ? p.age+' anos · ' : ''}${goalLabel(p.goal)}</div>
      </div>
      <svg style="margin-left:auto;color:var(--muted)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><polyline points="9 18 15 12 9 6"/></svg>
    </div>
  `).join('');
}

function goalLabel(g) {
  return g === 'cut' ? 'Emagrecer' : g === 'bulk' ? 'Ganhar massa' : 'Manter';
}

function createProfile() {
  const name = document.getElementById('np-name').value.trim();
  if (!name) { showToast('Insira um nome!'); return; }
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

function selectProfile(id) {
  const d = getData();
  d.activeProfile = id;
  saveData(d);
  launchApp();
}

function showProfileScreen() {
  document.getElementById('app').style.display = 'none';
  document.getElementById('profile-screen').className = 'active';
  renderProfileScreen();
}

// ═══════════════════════════════════════════════════════
//  APP LAUNCH
// ═══════════════════════════════════════════════════════

function launchApp() {
  const profile = getProfile();
  if (!profile) { showProfileScreen(); return; }
  document.getElementById('profile-screen').className = '';
  document.getElementById('app').style.display = 'block';

  updateTopbarAvatar(profile);

  renderDashboard();
  renderPlanner();
  renderWorkout();
  populateNutritionForm();
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
  if (screen === 'workout') renderWorkout();
  if (screen === 'history') renderHistory();
  if (screen === 'dashboard') renderDashboard();
  if (screen === 'profile') renderProfileTab();
}

function goToWorkout() {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector('[data-screen="workout"]').classList.add('active');
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-workout').classList.add('active');
  renderWorkout();
}

// ═══════════════════════════════════════════════════════
//  PROFILE TAB
// ═══════════════════════════════════════════════════════

// ── Composition notes (module-level so liveComp can use them) ─
const _WEIGHT_NOTES = {
  'Abaixo do peso':  'Peso insuficiente pode indicar desnutrição, reduzida densidade óssea e sistema imunitário fragilizado.',
  'Peso normal':     'Peso dentro do intervalo saudável para a tua altura — bom indicador de saúde metabólica.',
  'Excesso de peso': 'Excesso de peso aumenta o risco de hipertensão, colesterol elevado e resistência à insulina.',
  'Obesidade I':     'Risco elevado de diabetes tipo 2, problemas cardiovasculares e articulares. Consulta um médico.',
  'Obesidade II+':   'Risco muito elevado. Recomenda-se acompanhamento médico urgente e plano de perda de peso.',
};
const _FAT_NOTES = {
  'Muito Baixo': 'Gordura demasiado baixa pode comprometer funções hormonais, imunidade e absorção de vitaminas lipossolúveis.',
  'Atlético':    'Nível atlético — sustentável com treino regular e boa alimentação.',
  'Atlética':    'Nível atlético — sustentável com treino regular e boa alimentação.',
  'Óptimo':      'Composição saudável — bom equilíbrio metabólico e risco cardiovascular baixo.',
  'Aceitável':   'Ligeiramente acima do ideal. Pequenos ajustes na dieta e exercício podem ajudar.',
  'Excesso':     'Excesso de gordura aumenta o risco de hipertensão, resistência à insulina e problemas articulares.',
  'Obesidade':   'Risco elevado de diabetes tipo 2, doenças cardiovasculares e inflamação crónica. Consulta um médico.',
};
const _MUSCLE_NOTES = {
  'Baixo':     'Massa muscular reduzida diminui o metabolismo basal, aumenta o risco de lesões e reduz a capacidade funcional.',
  'Normal':    'Nível razoável — continua a treinar para preservar e aumentar a massa magra.',
  'Bom':       'Boa massa muscular — metabolismo ativo e melhor proteção articular.',
  'Excelente': 'Excelente composição muscular. Mantém com treino de força regular.',
};
const _BONE_NOTES = {
  'Baixo':  'Densidade óssea baixa aumenta o risco de osteoporose e fraturas. Garante ingestão adequada de cálcio e vitamina D.',
  'Normal': 'Densidade óssea saudável. Mantém com exercício de impacto e boa nutrição.',
  'Alto':   'Massa óssea elevada — geralmente positivo, associado a maior estatura e treino de força.',
};
const _WATER_NOTES = {
  'Muito Baixo': 'Desidratação severa: fadiga acentuada, cãibras, dificuldade de concentração e recuperação muscular comprometida.',
  'Baixo':       'Hidratação insuficiente. Pode afetar a performance, o metabolismo e a função renal. Bebe mais água ao longo do dia.',
  'Óptimo':      'Hidratação adequada — essencial para o transporte de nutrientes, recuperação e funções celulares.',
  'Elevado':     'Nível de água ligeiramente acima da média — geralmente inofensivo se a dieta for equilibrada.',
  'Muito Alto':  'Nível muito elevado — pode indicar retenção de líquidos. Consulta um médico se for persistente.',
};
const _VISCERAL_NOTES = {
  'Saudável':   'Gordura visceral dentro do normal — sem risco metabólico adicional associado.',
  'Excesso':    'Gordura visceral em excesso pode causar resistência à insulina e aumentar o risco cardiovascular.',
  'Alto':       'Nível alto associado a inflamação crónica, diabetes tipo 2 e maior risco de doenças cardíacas.',
  'Muito Alto': 'Risco muito elevado de síndrome metabólica. Consulta um médico e revê dieta e estilo de vida com urgência.',
};
const _METAGE_NOTES = {
  'Excelente':      'O teu metabolismo é mais jovem que a tua idade real — excelente condição física e hábitos de vida.',
  'Bom':            'Metabolismo em linha com a tua idade. Mantém os hábitos atuais.',
  'Razoável':       'Metabolismo ligeiramente envelhecido. Treino de força e melhor alimentação podem rejuvenescer a idade metabólica.',
  'Acima da idade': 'Metabolismo mais lento que o esperado — pode indicar perda de massa muscular, sedentarismo ou má alimentação.',
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
  if (barEl) { barEl.innerHTML=_compBar(val,scaleMax,idealMin,idealMax,st.color)+`<div style="font-size:0.62rem;color:var(--muted);margin-top:1px;">ideal ${idealMin}–${idealMax} ${unit}</div>`; }
  if (noteEl){ const t=notes[st.label]||''; noteEl.innerHTML=t?`<div style="font-size:0.68rem;color:var(--muted);margin-top:4px;line-height:1.45;padding:4px 8px;background:rgba(255,255,255,0.03);border-left:2px solid ${st.color};border-radius:0 4px 4px 0;">${t}</div>`:''; }
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
  { key: 'weight',       label: 'Peso',    unit: 'kg',   color: '#F5D060' },
  { key: 'bodyFat',      label: 'Gordura', unit: '%',    color: '#D4AF37' },
  { key: 'muscleMass',   label: 'Músculo', unit: '%',    color: '#C9A227' },
  { key: 'water',        label: 'Água',    unit: '%',    color: '#A0842A' },
  { key: 'visceralFat',  label: 'Visceral',unit: 'idx',  color: '#ff4757' },
  { key: 'metabolicAge', label: 'Id.Met.', unit: 'anos', color: '#b07dff' },
];

function switchChartMetric(key) {
  _profileChartMetric = key;
  document.querySelectorAll('.chart-chip').forEach(c => {
    const on = c.dataset.metric === key;
    c.style.background    = on ? 'rgba(212,175,55,0.16)' : 'rgba(212,175,55,0.03)';
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
    el.innerHTML = `<div style="text-align:center;padding:18px 0;font-size:0.75rem;color:var(--muted);">Regista mais medições para ver o gráfico.</div>`;
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
    <div style="position:absolute;left:${iL.toFixed(1)}%;width:${iW.toFixed(1)}%;height:100%;background:rgba(212,175,55,0.18);border-left:2px solid rgba(212,175,55,0.55);border-right:2px solid rgba(212,175,55,0.55);"></div>
    <div style="position:absolute;left:0;width:${fill.toFixed(1)}%;height:100%;background:${color};border-radius:4px;"></div>
    <div style="position:absolute;top:-3px;left:calc(${fill.toFixed(1)}% - 1px);width:3px;height:13px;background:#fff;border-radius:2px;"></div>
  </div>`;
}

function _bodyFatStatus(pct, g) {
  if (g === 'f') {
    if (pct < 14) return { label:'Muito Baixo', color:'#ff4757' };
    if (pct <= 20) return { label:'Atlética',   color:'#C9A227' };
    if (pct <= 30) return { label:'Óptimo',     color:'#C9A227' };
    if (pct <= 35) return { label:'Aceitável',  color:'#ffd700' };
    if (pct <= 40) return { label:'Excesso',    color:'#D4AF37' };
    return                 { label:'Obesidade', color:'#ff4757' };
  }
  if (pct < 6)   return { label:'Muito Baixo', color:'#ff4757' };
  if (pct <= 13) return { label:'Atlético',    color:'#C9A227' };
  if (pct <= 20) return { label:'Óptimo',      color:'#C9A227' };
  if (pct <= 25) return { label:'Aceitável',   color:'#ffd700' };
  if (pct <= 30) return { label:'Excesso',     color:'#D4AF37' };
  return                 { label:'Obesidade',  color:'#ff4757' };
}
function _muscleMassStatus(pct, g) {
  if (g === 'f') {
    if (pct < 24) return { label:'Baixo',      color:'#D4AF37' };
    if (pct <= 30) return { label:'Normal',    color:'#ffd700' };
    if (pct <= 35) return { label:'Bom',       color:'#C9A227' };
    return                 { label:'Excelente',color:'#C9A227' };
  }
  if (pct < 33) return { label:'Baixo',        color:'#D4AF37' };
  if (pct <= 39) return { label:'Normal',      color:'#ffd700' };
  if (pct <= 44) return { label:'Bom',         color:'#C9A227' };
  return                 { label:'Excelente',  color:'#C9A227' };
}
function _boneMassStatus(kg, g) {
  if (g === 'f') {
    if (kg < 1.8) return { label:'Baixo',   color:'#D4AF37' };
    if (kg <= 3.2) return { label:'Normal', color:'#C9A227' };
    return                 { label:'Alto',  color:'#ffd700' };
  }
  if (kg < 2.5) return { label:'Baixo',    color:'#D4AF37' };
  if (kg <= 4.5) return { label:'Normal',  color:'#C9A227' };
  return                 { label:'Alto',   color:'#ffd700' };
}
function _waterStatus(pct, g) {
  const [lo, hi] = g === 'f' ? [50, 60] : [55, 65];
  if (pct < lo - 5) return { label:'Muito Baixo', color:'#ff4757' };
  if (pct < lo)     return { label:'Baixo',       color:'#D4AF37' };
  if (pct <= hi)    return { label:'Óptimo',      color:'#C9A227' };
  if (pct <= hi+5)  return { label:'Elevado',     color:'#ffd700' };
  return                    { label:'Muito Alto',  color:'#ff4757' };
}
function _visceralStatus(idx) {
  if (idx <= 9)  return { label:'Saudável',   color:'#C9A227' };
  if (idx <= 14) return { label:'Excesso',    color:'#ffd700' };
  if (idx <= 19) return { label:'Alto',       color:'#D4AF37' };
  return                 { label:'Muito Alto', color:'#ff4757' };
}
function _weightStatus(kg, heightCm) {
  if (!heightCm) return { label:'', color:'#C9A227' };
  const bmi = kg / ((heightCm / 100) ** 2);
  if (bmi < 18.5) return { label:'Abaixo do peso', color:'#A0842A' };
  if (bmi < 25)   return { label:'Peso normal',    color:'#C9A227' };
  if (bmi < 30)   return { label:'Excesso de peso',color:'#ffd700' };
  if (bmi < 35)   return { label:'Obesidade I',    color:'#D4AF37' };
  return           { label:'Obesidade II+',         color:'#ff4757' };
}
function _metAgeStatus(metAge, realAge) {
  if (realAge == null) return { label:'', color:'#C9A227' };
  const d = metAge - realAge;
  if (d <= -5) return { label:'Excelente',      color:'#C9A227' };
  if (d <= 0)  return { label:'Bom',            color:'#C9A227' };
  if (d <= 5)  return { label:'Razoável',       color:'#ffd700' };
  return               { label:'Acima da idade',color:'#ff4757' };
}

function _compRow(label, value, unit, extra, idealMin, idealMax, scaleMax, statusFn, statusArg, notes) {
  const st   = value != null ? statusFn(value, statusArg) : null;
  const bar  = value != null ? _compBar(value, scaleMax, idealMin, idealMax, st.color) : '';
  const note = (st && notes && notes[st.label])
    ? `<div style="font-size:0.68rem;color:var(--muted);margin-top:5px;line-height:1.45;padding:5px 8px;background:rgba(255,255,255,0.03);border-left:2px solid ${st.color};border-radius:0 4px 4px 0;">${notes[st.label]}</div>`
    : '';
  const val = value != null
    ? `<span style="font-size:1.05rem;font-weight:800;color:var(--text);">${value}</span><span style="font-size:0.78rem;color:var(--muted);margin-left:3px;">${unit}</span>${extra ? `<span style="font-size:0.75rem;color:var(--muted);margin-left:6px;">${extra}</span>` : ''}`
    : `<span style="font-size:0.85rem;color:var(--muted);">Não registado</span>`;
  return `<div style="margin-bottom:14px;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
      <span style="font-size:0.75rem;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.04em;">${label}</span>
      ${st ? `<span style="font-size:0.7rem;font-weight:700;color:${st.color};">● ${st.label}</span>` : ''}
    </div>
    <div style="margin-bottom:1px;">${val}</div>
    ${bar}
    ${value != null ? `<div style="font-size:0.65rem;color:var(--muted);">ideal ${idealMin}–${idealMax} ${unit}</div>` : ''}
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
    if (hp.conditions.length) parts.push(`${hp.conditions.length} condição${hp.conditions.length > 1 ? 'ões' : ''}`);
    if (hp.allergies.length)  parts.push(`${hp.allergies.length} alergia${hp.allergies.length > 1 ? 's' : ''}`);
    if (hp.injuries.length)   parts.push(`${hp.injuries.length} lesão${hp.injuries.length > 1 ? 'ões' : ''}`);
    return parts.length ? parts.join(' · ') : 'Sem condições registadas';
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
      <div style="font-size:0.7rem;font-weight:700;color:var(--muted);margin-bottom:10px;text-transform:uppercase;letter-spacing:.05em;">Histórico de Medições</div>

      ${availableMetrics.length >= 2 ? `
        <!-- Chart metric selector -->
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
          ${availableMetrics.map(m => {
            const active = m.key === _profileChartMetric;
            return `<button class="chart-chip" data-metric="${m.key}" onclick="switchChartMetric('${m.key}')"
              style="padding:4px 10px;border-radius:20px;font-size:0.7rem;cursor:pointer;border:1px solid ${active ? 'var(--orange)' : 'var(--border)'};
              background:${active ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.05)'};
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
              ${e.bodyFat      != null ? `<span style="color:#D4AF37;">${e.bodyFat}% GC</span>` : ''}
              ${e.muscleMass   != null ? `<span style="color:#C9A227;">${e.muscleMass}% MM</span>` : ''}
              ${e.water        != null ? `<span style="color:#A0842A;">${e.water}% H₂O</span>` : ''}
              ${e.visceralFat  != null ? `<span style="color:#D4AF37;">V:${e.visceralFat}</span>` : ''}
              ${e.metabolicAge != null ? `<span style="color:#A0842A;">${e.metabolicAge}a.m.</span>` : ''}
            </span>
          </div>`;
        const visible = sorted.slice(0, 6).map(renderRow).join('');
        const hidden  = sorted.slice(6);
        const extra = hidden.length ? `
          <div id="history-extra" style="display:none;">${hidden.map(renderRow).join('')}</div>
          <button onclick="toggleHistoryAll()" id="btn-history-more"
            style="width:100%;background:none;border:none;color:var(--muted);font-size:0.74rem;cursor:pointer;padding:8px 0;text-align:center;">
            ▼ Ver todos os ${history.length} registos
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
        <div style="font-size:0.78rem;color:var(--muted);margin-top:3px;">${goalLabel(profile.goal)} · ${g === 'f' ? 'Feminino' : 'Masculino'}</div>
        <button onclick="showProfileScreen()" style="margin-top:8px;background:none;border:1px solid var(--border);border-radius:20px;padding:4px 14px;font-size:0.72rem;color:var(--muted);cursor:pointer;">↔ Mudar de Perfil</button>
      </div>

      <!-- Dados pessoais -->
      <div class="card" style="margin-bottom:14px;">
        <div class="section-title" style="margin-bottom:12px;">Dados Pessoais</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
          <div class="form-group" style="grid-column:span 2;"><label>Nome</label><input type="text" id="prof-name" value="${profile.name}"></div>
          <div class="form-group"><label>Idade</label><input type="number" id="prof-age" value="${profile.age || ''}" placeholder="25" min="14" max="100"></div>
          <div class="form-group"><label>Peso (kg)</label><input type="number" id="prof-weight" value="${w || ''}" placeholder="70" step="0.1"></div>
          <div class="form-group"><label>Altura (cm)</label><input type="number" id="prof-height" value="${profile.height || ''}" placeholder="175"></div>
          <div class="form-group">
            <label>Sexo</label>
            <select id="prof-gender">
              <option value="m" ${g === 'm' ? 'selected' : ''}>Masculino</option>
              <option value="f" ${g === 'f' ? 'selected' : ''}>Feminino</option>
            </select>
          </div>
          <div class="form-group" style="grid-column:span 2;">
            <label>Objetivo</label>
            <select id="prof-goal">
              <option value="cut"      ${profile.goal === 'cut'      ? 'selected' : ''}>Emagrecer</option>
              <option value="maintain" ${profile.goal === 'maintain' ? 'selected' : ''}>Manter peso</option>
              <option value="bulk"     ${profile.goal === 'bulk'     ? 'selected' : ''}>Ganhar massa muscular</option>
            </select>
          </div>
        </div>
        <button class="btn btn-primary btn-full" onclick="saveProfileInfo()">✔ Guardar Dados</button>
      </div>

      <!-- Composição Corporal -->
      <div class="card" style="margin-bottom:14px;">
        <div class="section-title" style="margin-bottom:2px;">📊 Composição Corporal</div>
        <div style="font-size:0.72rem;color:var(--muted);margin-bottom:14px;">A barra verde é a zona ideal. Valores guardam automaticamente.</div>

        <!-- Peso -->
        ${cm('weight','Peso',w,'kg',weightIdealMin,weightIdealMax,weightScaleMax,_weightStatus,h,_WEIGHT_NOTES)}
        <div style="display:flex;align-items:center;gap:6px;margin:5px 0 10px;">
          ${cinp('comp-weight',w,'70','0.1','1')}
          <span style="font-size:0.78rem;color:var(--muted);">kg</span>
          <span id="cextra-weight" style="font-size:0.72rem;color:var(--muted);">${weightExtra}</span>
        </div>
        <div style="height:1px;background:var(--border);margin:0 0 10px;"></div>

        <!-- Massa Gorda -->
        ${cm('fat','Massa Gorda',comp.bodyFat,'%',fatIdeal[0],fatIdeal[1],fatScale,_bodyFatStatus,g,_FAT_NOTES)}
        <div style="display:flex;align-items:center;gap:6px;margin:5px 0 10px;">
          ${cinp('comp-fat',comp.bodyFat,'15','0.1','0')}
          <span style="font-size:0.78rem;color:var(--muted);">%</span>
          <span id="cextra-fat" style="font-size:0.72rem;color:var(--muted);">${fatKg}</span>
        </div>
        <div style="height:1px;background:var(--border);margin:0 0 10px;"></div>

        <!-- Massa Muscular -->
        ${cm('muscle','Massa Muscular',comp.muscleMass,'%',muscleIdeal[0],muscleIdeal[1],muscleScale,_muscleMassStatus,g,_MUSCLE_NOTES)}
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
        <div style="height:1px;background:var(--border);margin:0 0 10px;"></div>

        <!-- Massa Óssea -->
        ${cm('bone','Massa Óssea',comp.boneMass,'kg',boneIdeal[0],boneIdeal[1],boneScale,_boneMassStatus,g,_BONE_NOTES)}
        <div style="display:flex;align-items:center;gap:6px;margin:5px 0 10px;">
          ${cinp('comp-bone',comp.boneMass,'3.2','0.1','0')}
          <span style="font-size:0.78rem;color:var(--muted);">kg</span>
        </div>
        <div style="height:1px;background:var(--border);margin:0 0 10px;"></div>

        <!-- Água -->
        ${cm('water','Água Corporal',comp.water,'%',waterIdeal[0],waterIdeal[1],80,_waterStatus,g,_WATER_NOTES)}
        <div style="display:flex;align-items:center;gap:6px;margin:5px 0 10px;">
          ${cinp('comp-water',comp.water,'60','0.1','30')}
          <span style="font-size:0.78rem;color:var(--muted);">%</span>
        </div>
        <div style="height:1px;background:var(--border);margin:0 0 10px;"></div>

        <!-- Gordura Visceral -->
        ${cm('visceral','Gordura Visceral',comp.visceralFat,'índice',1,9,30,_visceralStatus,null,_VISCERAL_NOTES)}
        <div style="display:flex;align-items:center;gap:6px;margin:5px 0 10px;">
          ${cinp('comp-visceral',comp.visceralFat,'7','1','1')}
          <span style="font-size:0.78rem;color:var(--muted);">índice</span>
        </div>
        <div style="height:1px;background:var(--border);margin:0 0 10px;"></div>

        <!-- Idade Metabólica -->
        ${cm('metage','Idade Metabólica',comp.metabolicAge,'anos',Math.max(10,(profile.age||30)-10),profile.age||30,(profile.age||30)+20,_metAgeStatus,profile.age,_METAGE_NOTES)}
        <div style="display:flex;align-items:center;gap:6px;margin:5px 0 10px;">
          ${cinp('comp-metage',comp.metabolicAge,'30','1','10')}
          <span style="font-size:0.78rem;color:var(--muted);">anos${profile.age?` (real: ${profile.age}a)`:''}</span>
        </div>

        <button class="btn btn-secondary btn-sm btn-full" onclick="saveBodyComposition()" style="margin-top:4px;">📊 Adicionar ao Histórico</button>
        ${historyHtml}
      </div>

      <!-- Medidas Corporais -->
      <div class="card" style="margin-bottom:14px;">
        <div class="section-title" style="margin-bottom:4px;">📏 Medidas Corporais</div>
        <div style="font-size:0.75rem;color:var(--muted);margin-bottom:14px;">Circunferências em centímetros.</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
          <div class="form-group"><label>Cintura</label>
            <div style="display:flex;align-items:center;gap:6px;">${inp('comp-waist', comp.waist, '80','0.5')}<span style="font-size:0.75rem;color:var(--muted);">cm</span></div>
          </div>
          <div class="form-group"><label>Anca</label>
            <div style="display:flex;align-items:center;gap:6px;">${inp('comp-hip', comp.hip, '95','0.5')}<span style="font-size:0.75rem;color:var(--muted);">cm</span></div>
          </div>
          <div class="form-group"><label>Peito</label>
            <div style="display:flex;align-items:center;gap:6px;">${inp('comp-chest', comp.chest, '95','0.5')}<span style="font-size:0.75rem;color:var(--muted);">cm</span></div>
          </div>
          <div class="form-group"><label>Braço</label>
            <div style="display:flex;align-items:center;gap:6px;">${inp('comp-arm', comp.arm, '35','0.5')}<span style="font-size:0.75rem;color:var(--muted);">cm</span></div>
          </div>
          <div class="form-group"><label>Coxa</label>
            <div style="display:flex;align-items:center;gap:6px;">${inp('comp-thigh', comp.thigh, '55','0.5')}<span style="font-size:0.75rem;color:var(--muted);">cm</span></div>
          </div>
          <div class="form-group"><label>Panturrilha</label>
            <div style="display:flex;align-items:center;gap:6px;">${inp('comp-calf', comp.calf, '36','0.5')}<span style="font-size:0.75rem;color:var(--muted);">cm</span></div>
          </div>
        </div>
        <button class="btn btn-secondary btn-full" onclick="saveMeasurements()">📏 Guardar Medidas</button>
      </div>

      <!-- Perfil de saúde -->
      <div class="card" style="margin-bottom:14px;">
        <div class="section-title" style="margin-bottom:6px;">🩺 Perfil de Saúde</div>
        <div style="font-size:0.8rem;color:var(--muted);margin-bottom:12px;">${healthSummary}</div>
        <button class="btn btn-secondary btn-full" onclick="openHealthModal()">Editar Alergias, Lesões e Condições</button>
      </div>

      <!-- Zona de perigo -->
      <div style="text-align:center;padding-bottom:40px;margin-top:6px;">
        <button onclick="confirmDeleteProfile()" style="background:none;border:none;color:var(--muted);font-size:0.75rem;cursor:pointer;text-decoration:underline;opacity:0.6;">Eliminar este perfil</button>
      </div>

    </div>
  `;
  _renderProfileChart();
}

function saveProfileInfo() {
  const profile = getProfile();
  if (!profile) return;
  const name = document.getElementById('prof-name').value.trim();
  if (!name) { showToast('Insere um nome!'); return; }
  profile.name   = name;
  profile.age    = parseInt(document.getElementById('prof-age').value) || null;
  profile.weight = parseFloat(document.getElementById('prof-weight').value) || null;
  profile.height = parseFloat(document.getElementById('prof-height').value) || null;
  profile.gender = document.getElementById('prof-gender').value;
  profile.goal   = document.getElementById('prof-goal').value;
  saveProfile(profile);
  updateTopbarAvatar(profile);
  renderProfileTab();
  showToast('Perfil atualizado! ✔');
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
  showToast('Composição registada! 📊');
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
  showToast('Medidas guardadas! 📏');
}

function handleAvatarUpload(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Imagem demasiado grande (máx 5 MB)'); return; }
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
      showToast('Foto atualizada! 📷');
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
  btn.textContent = open ? `▼ Ver todos os ${total} registos` : '▲ Mostrar menos';
}

function confirmDeleteProfile() {
  if (!confirm('Tens a certeza? O perfil e todos os dados serão eliminados permanentemente.')) return;
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
  document.getElementById('dash-greeting').textContent = `Olá, ${profile.name.split(' ')[0]}! 👋`;
  document.getElementById('dash-date').textContent = now.toLocaleDateString('pt-PT', { weekday:'long', day:'numeric', month:'long' });
  // Week count
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - dayOfWeek); weekStart.setHours(0,0,0,0);
  const thisWeekWorkouts = (profile.workoutHistory || []).filter(w => new Date(w.date) >= weekStart);
  document.getElementById('dash-week-count').textContent = thisWeekWorkouts.length;

  // Today muscles
  const todayMuscles = profile.weeklyPlan[dayOfWeek] || [];
  const muscleEl = document.getElementById('dash-today-muscles');
  const btn = document.getElementById('btn-start-workout');
  if (todayMuscles.length) {
    muscleEl.innerHTML = '<div class="chip-row">' + todayMuscles.map(m => `<span class="badge badge-orange">${m}</span>`).join('') + '</div>';
    btn.innerHTML = '⚡ Iniciar Treino de Hoje';
    btn.style.display = '';
  } else {
    muscleEl.innerHTML = '<span style="color:var(--muted); font-size:0.85rem;">🛌 Dia de descanso no plano — podes treinar na mesma!</span>';
    btn.innerHTML = '⚡ Treino Livre';
    btn.style.display = '';
  }

  // Week progress
  const wp = document.getElementById('dash-week-progress');
  wp.innerHTML = DAYS.map((d, i) => {
    const muscles = profile.weeklyPlan[i] || [];
    const done = thisWeekWorkouts.find(w => new Date(w.date).getDay() === i);
    const isToday = i === dayOfWeek;
    return `<div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
      <div style="width:32px; font-size:0.72rem; color:${isToday ? 'var(--orange)' : 'var(--muted)'}; font-weight:700; text-transform:uppercase;">${d}</div>
      <div style="flex:1;">
        <div class="progress-bar">
          <div class="progress-fill" style="width:${done ? 100 : (muscles.length ? 30 : 0)}%; background:${done ? 'var(--green)' : 'var(--orange)'};"></div>
        </div>
      </div>
      <div style="font-size:0.72rem; color:var(--muted); width:70px; text-align:right; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">${muscles.length ? muscles.join(', ') : 'Descanso'}</div>
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════
//  PLANNER
// ═══════════════════════════════════════════════════════

let plannerSelectedDay = null;
let plannerSelectedMuscles = [];

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
      <div class="day-name">${d}</div>
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
        <div style="font-weight:700; margin-bottom:4px;">${DAYS_FULL[day]}</div>
        <div style="color:var(--muted); font-size:0.85rem;">Dia de descanso — recupera bem!</div>
        <button onclick="openDayModal(${day})" class="btn btn-secondary btn-sm" style="margin-top:14px;">✏️ Editar dia</button>
      </div>`;
    return;
  }

  const tpl = matchTemplateToMuscles(muscles);

  // Injury-aware: get exercises to avoid
  const hp = getHealthProfile();
  const activeInjuries = HEALTH_INJURIES.filter(i => hp.injuries.includes(i.id));
  const avoidSet = new Set(activeInjuries.flatMap(i => i.avoid));

  const muscleChips = muscles.map(m => `<span class="muscle-chip selected" style="font-size:0.78rem;">${m}</span>`).join('');

  let suggestionHTML = '';
  if (tpl) {
    const exRows = tpl.exercises.map(ex => {
      const isRisky = avoidSet.has(ex.name);
      return `<div style="display:flex; align-items:center; justify-content:space-between; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
        <div>
          <span style="font-size:0.82rem; font-weight:600; color:${isRisky ? '#ff4757' : 'var(--text)'};">${ex.name}</span>
          ${isRisky ? `<span style="font-size:0.65rem; color:#ff4757; background:rgba(255,71,87,.12); border:1px solid rgba(255,71,87,.3); border-radius:20px; padding:1px 6px; margin-left:5px;">⚠ Lesão</span>` : ''}
        </div>
        <span style="font-size:0.72rem; color:var(--muted);">${ex.sets.length} séries · ${ex.sets[0].reps} reps</span>
      </div>`;
    }).join('');

    const riskyCount = tpl.exercises.filter(e => avoidSet.has(e.name)).length;
    const riskyBanner = riskyCount ? `
      <div style="background:rgba(212,175,55,.08); border:1px solid rgba(212,175,55,.3); border-radius:var(--radius-sm); padding:8px 10px; margin-bottom:10px; font-size:0.75rem; color:var(--orange);">
        ⚠️ ${riskyCount} exercício(s) marcado(s) — podem não ser adequados às tuas lesões. Considera personalizar.
      </div>` : '';

    suggestionHTML = `
      <div style="background:rgba(255,107,53,.06); border:1.5px solid rgba(212,175,55,.25); border-radius:var(--radius-sm); padding:14px; margin-top:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <div style="font-size:0.72rem; color:var(--orange); font-weight:800; text-transform:uppercase; letter-spacing:.6px;">✨ Sugestão para hoje</div>
          <span style="font-size:0.72rem; color:var(--muted);">${tpl.exercises.length} exercícios</span>
        </div>
        <div style="font-size:1rem; font-weight:700; margin-bottom:10px;">${tpl.label}</div>
        ${riskyBanner}
        <div style="max-height:220px; overflow-y:auto; margin-bottom:12px;">${exRows}</div>
        <div style="display:flex; gap:8px;">
          <button onclick="startPlannerWorkout('${tpl.id}')"
            style="flex:1; background:var(--orange); color:#fff; border:none; border-radius:var(--radius-sm); padding:10px; font-size:0.85rem; font-weight:700; cursor:pointer;">
            ▶ Começar este treino
          </button>
          <button onclick="customisePlannerDay(${day})"
            style="flex:1; background:rgba(255,255,255,0.06); color:var(--text); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px; font-size:0.85rem; font-weight:600; cursor:pointer;">
            ✏️ Personalizar
          </button>
        </div>
      </div>`;
  } else {
    suggestionHTML = `
      <div style="background:rgba(255,255,255,0.03); border:1px dashed var(--border); border-radius:var(--radius-sm); padding:14px; margin-top:12px; text-align:center;">
        <div style="color:var(--muted); font-size:0.82rem; margin-bottom:10px;">Sem template correspondente — escolhe os exercícios manualmente.</div>
        <button onclick="customisePlannerDay(${day})"
          style="background:var(--orange); color:#fff; border:none; border-radius:var(--radius-sm); padding:10px 20px; font-size:0.85rem; font-weight:700; cursor:pointer;">
          ✏️ Montar treino
        </button>
      </div>`;
  }

  detail.innerHTML = `
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
        <div>
          <div style="font-weight:700; margin-bottom:6px;">${DAYS_FULL[day]}${isToday ? ' <span style="font-size:0.7rem; background:var(--orange); color:#fff; border-radius:20px; padding:2px 8px; vertical-align:middle; margin-left:4px;">HOJE</span>' : ''}</div>
          <div class="chip-row">${muscleChips}</div>
        </div>
        <button onclick="openDayModal(${day})" style="background:none; border:none; color:var(--muted); cursor:pointer; font-size:1rem; padding:4px;" title="Editar">✏️</button>
      </div>
      ${suggestionHTML}
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
  showToast(`Treino "${tpl.label}" carregado! 💪`);
}

function customisePlannerDay(day) {
  const profile = getProfile();
  const muscles = profile.weeklyPlan[day] || [];
  workoutSelectedMuscles = muscles.length ? [...muscles] : [];
  workoutExercises = [];
  activeTemplateId = null;
  goToWorkout();
}

function openDayModal(day) {
  plannerSelectedDay = day;
  const profile = getProfile();
  plannerSelectedMuscles = [...(profile.weeklyPlan[day] || [])];

  document.getElementById('modal-day-title').textContent = DAYS_FULL[day];
  const chips = document.getElementById('modal-muscle-chips');
  chips.innerHTML = MUSCLES.map(m => `
    <div class="muscle-chip ${plannerSelectedMuscles.includes(m) ? 'selected' : ''}" onclick="togglePlannerMuscle(this, '${m}')">${m}</div>
  `).join('');

  openModal('modal-day-muscles');
}

function togglePlannerMuscle(el, muscle) {
  const idx = plannerSelectedMuscles.indexOf(muscle);
  if (idx >= 0) { plannerSelectedMuscles.splice(idx, 1); el.classList.remove('selected'); }
  else { plannerSelectedMuscles.push(muscle); el.classList.add('selected'); }
}

function saveDayMuscles() {
  const profile = getProfile();
  profile.weeklyPlan[plannerSelectedDay] = [...plannerSelectedMuscles];
  saveProfile(profile);
  closeModal('modal-day-muscles');
  renderPlanner();
  renderDashboard();
  showToast('Plano guardado! ✔');
}

// ═══════════════════════════════════════════════════════
//  WORKOUT
// ═══════════════════════════════════════════════════════

let workoutExercises = []; // { name, muscle, sets: [{reps, weight}] }
let currentDay = null;
let setsEditingIdx = null;
let tempSets = [];

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

function renderAgeAdaptedWorkout(ageCategory) {
  const el = document.getElementById('workout-age-banner');
  if (!el) return;
  if (ageCategory === 'adult') { el.innerHTML = ''; return; }

  const isChild   = ageCategory === 'child';
  const templates = isChild ? CHILD_TEMPLATES : ELDERLY_TEMPLATES;
  const color     = isChild ? 'var(--pink)'  : 'var(--cyan)';
  const bg        = isChild ? 'rgba(212,175,55,.08)' : 'rgba(160,132,42,.08)';
  const title     = isChild ? '👧 Treinos recomendados para crianças' : '🧓 Treinos recomendados para sénior';
  const subtitle  = isChild
    ? 'Exercícios de peso corporal, divertidos e seguros para a tua idade.'
    : 'Exercícios de baixo impacto, mobilidade e equilíbrio adaptados à 3.ª idade.';

  el.innerHTML = `
    <div style="background:${bg}; border:1.5px solid ${color}; border-radius:var(--radius-sm); padding:14px; margin-bottom:14px;">
      <div style="font-size:0.72rem; color:${color}; font-weight:800; text-transform:uppercase; letter-spacing:.5px; margin-bottom:4px;">${title}</div>
      <div style="font-size:0.78rem; color:var(--muted); margin-bottom:12px;">${subtitle}</div>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        ${templates.map(t => `
          <div onclick="loadAgeTemplate('${t.id}')"
            style="padding:10px 14px; background:${activeTemplateId===t.id ? bg : 'rgba(255,255,255,0.04)'}; border:1.5px solid ${activeTemplateId===t.id ? color : 'var(--border)'}; border-radius:var(--radius-sm); cursor:pointer; transition:all .2s; flex:1; min-width:120px; text-align:center;">
            <div style="font-size:0.85rem; font-weight:700; color:${activeTemplateId===t.id ? color : 'var(--text)'};">${t.label}</div>
            <div style="font-size:0.7rem; color:var(--muted); margin-top:2px;">${t.exercises.length} exercícios</div>
          </div>`).join('')}
      </div>
    </div>`;
}

function loadAgeTemplate(templateId) {
  const all = [...CHILD_TEMPLATES, ...ELDERLY_TEMPLATES];
  const tpl = all.find(t => t.id === templateId);
  if (!tpl) return;
  activeTemplateId = tpl.id;
  workoutExercises = tpl.exercises.map(e => ({ name:e.name, muscle:e.muscle, sets:e.sets.map(s=>({...s})) }));
  workoutSelectedMuscles = [...tpl.muscles];
  const profile = getProfile();
  const age = profile ? profile.age : null;
  renderAgeAdaptedWorkout(getAgeCategory(age));
  renderWorkoutTemplatePills();
  renderWorkoutMuscleChips(profile);
  renderExerciseBrowser(profile);
  renderWorkoutList();
  updateWorkoutSummary();
  setTimeout(() => { const el = document.getElementById('workout-session'); if (el) el.scrollIntoView({behavior:'smooth',block:'start'}); }, 100);
  showToast(`✔ ${tpl.label} carregado!`);
}

// ═══════════════════════════════════════════════════════
//  GROUP CLASSES
// ═══════════════════════════════════════════════════════

const GROUP_CLASSES = [
  {
    id: 'yoga',
    name: 'Yoga',
    icon: '🧘',
    duration: '60 min',
    intensity: 'Baixa',
    intensityColor: '#C9A227',
    desc: 'Melhora flexibilidade, equilíbrio e bem-estar mental. Ideal para recuperação ativa.',
    muscles: ['Costas', 'Ombros', 'Pernas', 'Abdômen'],
    tip: 'Perfeito para fazer no dia a seguir a um treino intenso de pernas ou costas.',
    risks: [
      { ids: ['knee','meniscus','ligament_knee'], note: 'Algumas posturas exigem flexão profunda do joelho (ex: posição de lótus). Avisa o instrutor e adapta as posições.' },
      { ids: ['back','disc','scoliosis'],         note: 'Certas posturas de flexão e torção da coluna podem agravar a lesão. Opta por versões modificadas e informa o instrutor.' },
      { ids: ['shoulder','rotator_cuff'],         note: 'Posições de apoio nos braços (ex: prancha, cão olhando para baixo) podem sobrecarregar o ombro. Faz versões adaptadas.' },
      { ids: ['wrist','carpal'],                  note: 'Muitas posturas de suporte de peso no pulso. Usa blocos de yoga para reduzir a extensão do pulso.' },
    ]
  },
  {
    id: 'pilates',
    name: 'Pilates',
    icon: '🤸',
    duration: '50 min',
    intensity: 'Baixa–Média',
    intensityColor: '#C9A227',
    desc: 'Fortalece o core, melhora postura e estabilidade. Excelente complemento à musculação.',
    muscles: ['Abdômen', 'Costas', 'Glúteos', 'Pernas'],
    tip: 'Complementa treinos de força com estabilidade e postura.',
    risks: [
      { ids: ['neck'],                            note: 'Exercícios de flexão cervical (crunch com cabeça elevada) podem agravar a cervical. Mantém a cabeça apoiada.' },
      { ids: ['back','disc'],                     note: 'Movimentos de flexão intensa da coluna devem ser evitados ou modificados. Informa o instrutor da tua situação.' },
      { ids: ['wrist','carpal'],                  note: 'Exercícios em apoio de mãos no chão podem pressionar o pulso. Usa punhos fechados ou antebraços como apoio.' },
      { ids: ['hip','groin'],                     note: 'Movimentos de abertura de perna e flexão da anca podem ser desconfortáveis. Reduz a amplitude de movimento.' },
    ]
  },
  {
    id: 'spinning',
    name: 'Spinning',
    icon: '🚴',
    duration: '45 min',
    intensity: 'Alta',
    intensityColor: '#D4AF37',
    desc: 'Cardio intenso em bicicleta estacionária. Queima muitas calorias e melhora a resistência.',
    muscles: ['Pernas', 'Glúteos'],
    tip: 'Complemento ideal para quem treina pernas ou quer acelerar o emagrecimento.',
    risks: [
      { ids: ['knee','meniscus','ligament_knee'], note: 'A pedalada repetitiva pode sobrecarregar o joelho. Regula bem a altura do selim e mantém cadência suave.' },
      { ids: ['achilles','ankle','plantar'],      note: 'A posição do pé no pedal pode tensionar o tendão de Aquiles e a fáscia plantar. Evita resistências elevadas no início.' },
      { ids: ['back','disc'],                     note: 'A postura inclinada pode pressionar a coluna lombar. Ajusta o guiador para uma posição mais ereta.' },
      { ids: ['hip','groin'],                     note: 'A flexão repetida da anca pode irritar a articulação. Regula a altura do selim para não ultrapassar os 90° na pedalada.' },
      { ids: ['shin_splints'],                    note: 'O impacto é baixo, mas altas cadências podem agravar a canelite. Mantém resistência moderada.' },
    ]
  },
  {
    id: 'bodypump',
    name: 'Body Pump',
    icon: '🏋️',
    duration: '55 min',
    intensity: 'Alta',
    intensityColor: '#D4AF37',
    desc: 'Treino de força com barra e halteres para todo o corpo ao ritmo da música.',
    muscles: ['Peito', 'Costas', 'Pernas', 'Ombros', 'Bíceps', 'Tríceps'],
    tip: 'Ótimo como treino alternativo ou em dias de volume total.',
    risks: [
      { ids: ['knee','meniscus','ligament_knee'], note: 'O bloco de agachamentos é muito exigente para o joelho. Reduz a amplitude ou substitui por exercícios de menor impacto.' },
      { ids: ['back','disc','scoliosis'],         note: 'Agachamentos e peso morto com barra sobrecarregam a coluna. Usa cargas muito reduzidas ou omite esses blocos.' },
      { ids: ['shoulder','rotator_cuff'],         note: 'O bloco de ombros com press overhead pode agravar a lesão. Opta por carga zero ou substitui por elevações laterais leves.' },
      { ids: ['elbow','epicondylitis'],           note: 'Movimentos de curl e tríceps repetitivos com carga podem irritar o cotovelo. Usa carga mínima e amplitude reduzida.' },
      { ids: ['wrist','carpal'],                  note: 'A pega na barra pode pressionar o pulso. Usa suportes de pulso e opta por halteres em vez de barra quando possível.' },
      { ids: ['achilles','ankle','plantar'],      note: 'Blocos de pernas incluem elevações de gémeo e lunges. Comunica ao instrutor para adaptar esses exercícios.' },
    ]
  },
  {
    id: 'zumba',
    name: 'Zumba',
    icon: '💃',
    duration: '60 min',
    intensity: 'Média',
    intensityColor: '#ffd700',
    desc: 'Dança animada que queima calorias e melhora coordenação motora. Divertido e eficaz.',
    muscles: ['Pernas', 'Glúteos', 'Abdômen'],
    tip: 'Excelente cardio complementar para quem treina parte inferior.',
    risks: [
      { ids: ['knee','meniscus','ligament_knee'], note: 'Mudanças de direção rápidas e movimentos laterais são exigentes para o joelho. Evita as rotações bruscas.' },
      { ids: ['ankle','achilles','plantar'],      note: 'Movimentos de salto e mudanças de apoio são frequentes. Usa calçado com boa amortização e evita saltar.' },
      { ids: ['hip','groin'],                     note: 'Movimentos de anca e rotação lateral podem causar desconforto. Reduz a amplitude dos movimentos de dança.' },
      { ids: ['shin_splints'],                    note: 'O impacto acumulado pode agravar a canelite. Opta por versões low-impact sem saltar.' },
    ]
  },
  {
    id: 'boxing',
    name: 'Boxe Fitness',
    icon: '🥊',
    duration: '50 min',
    intensity: 'Alta',
    intensityColor: '#D4AF37',
    desc: 'Técnica de boxe adaptada para fitness. Cardio intenso com treino de força funcional.',
    muscles: ['Peito', 'Ombros', 'Bíceps', 'Tríceps', 'Abdômen'],
    tip: 'Complementa treinos de parte superior com cardio e potência.',
    risks: [
      { ids: ['shoulder','rotator_cuff'],         note: 'Socos repetitivos com rotação do ombro são o cerne desta aula. Considera evitar até estares reabilitado.' },
      { ids: ['elbow','epicondylitis'],           note: 'A extensão rápida do cotovelo nos socos pode agravar a epicondilite. Usa luvas e reduz a força de impacto.' },
      { ids: ['wrist','carpal'],                  note: 'O impacto no saco de boxe transmite-se ao pulso. Usa ligaduras ou luvas com bom suporte de pulso.' },
      { ids: ['ankle','achilles','knee'],         note: 'O footwork exige agilidade e mudanças de direção rápidas. Mantém os movimentos de pés simples e controlados.' },
      { ids: ['neck'],                            note: 'Movimentos defensivos de esquiva podem tensionar a cervical. Faz-os de forma lenta e controlada.' },
    ]
  },
  {
    id: 'hiit',
    name: 'HIIT',
    icon: '🔥',
    duration: '30 min',
    intensity: 'Muito Alta',
    intensityColor: '#F5D060',
    desc: 'Intervalos de alta intensidade. Máxima queima de calorias em pouco tempo.',
    muscles: ['Pernas', 'Glúteos', 'Abdômen', 'Peito'],
    tip: 'Perfeito para dias em que tens pouco tempo mas queres resultados máximos.',
    risks: [
      { ids: ['knee','meniscus','ligament_knee'], note: 'Saltos e mudanças rápidas de direção são muito exigentes para o joelho. Substitui por versões low-impact.' },
      { ids: ['ankle','achilles','plantar','shin_splints'], note: 'Alto impacto no pé e tornozelo. Evita saltar e opta por exercícios sem impacto (mountain climbers, steps).' },
      { ids: ['back','disc'],                     note: 'Exercícios como burpees e mountain climbers sobrecarregam a lombar. Omite-os e substitui por exercícios de core suave.' },
      { ids: ['shoulder','rotator_cuff'],         note: 'Flexões e posições em prancha são comuns no HIIT. Usa joelhos como apoio e evita empurrar até à dor.' },
      { ids: ['hip','groin'],                     note: 'Movimentos explosivos de perna como jumping jacks podem agravar a anca. Faz versões lentas e controladas.' },
      { ids: ['osteoporosis'],                    note: 'O impacto elevado representa risco de fratura. Consulta o teu profissional de saúde ou exercício físico antes de participar.' },
      { ids: ['fibromyalgia'],                    note: 'A intensidade muito alta pode causar agudização da dor. Opta por aulas de menor intensidade.' },
    ]
  },
  {
    id: 'bodybalance',
    name: 'Body Balance',
    icon: '⚖️',
    duration: '55 min',
    intensity: 'Baixa',
    intensityColor: '#C9A227',
    desc: 'Combinação de Yoga, Tai Chi e Pilates. Relaxamento, equilíbrio e flexibilidade.',
    muscles: ['Costas', 'Ombros', 'Abdômen', 'Pernas'],
    tip: 'Ideal para dias de descanso ativo ou recuperação pós-treino intenso.',
    risks: [
      { ids: ['knee','hip'],                      note: 'Algumas posições de equilíbrio e agachamento suave podem ser desconfortáveis. Usa apoio de parede se necessário.' },
      { ids: ['back','disc'],                     note: 'Sequências de Tai Chi e alongamentos da coluna devem ser feitos com amplitude reduzida se houver dor.' },
      { ids: ['shoulder','rotator_cuff'],         note: 'Movimentos de braço amplos do Tai Chi podem sobrecarregar o ombro. Reduz a amplitude e o ritmo.' },
    ]
  },
  {
    id: 'crossfit',
    name: 'CrossFit',
    icon: '💪',
    duration: '60 min',
    intensity: 'Muito Alta',
    intensityColor: '#F5D060',
    desc: 'Treino funcional de alta intensidade combinando força, cardio e ginástica.',
    muscles: ['Peito', 'Costas', 'Pernas', 'Ombros', 'Glúteos'],
    tip: 'Complementa a musculação com funcionalidade e resistência geral.',
    risks: [
      { ids: ['back','disc','scoliosis'],         note: 'Levantamentos olímpicos e movimentos de alta carga na coluna são centrais no CrossFit. Risco elevado — consulta o teu profissional de saúde ou exercício físico antes de participar.' },
      { ids: ['knee','meniscus','ligament_knee'], note: 'Agachamentos profundos, box jumps e lunges são frequentes. Risco elevado para o joelho — informa o coach.' },
      { ids: ['shoulder','rotator_cuff'],         note: 'Movimentos overhead com carga (clean & jerk, thruster) são muito exigentes para o ombro. Considera evitar até reabilitação completa.' },
      { ids: ['wrist','carpal','elbow'],          note: 'Movimentos de suporte de peso (handstand, anéis) e puxadas sobrecarregam o pulso e cotovelo. Comunica ao coach.' },
      { ids: ['achilles','ankle','plantar'],      note: 'Saltos (box jump, double-unders) são de alto impacto para o tendão de Aquiles e pé. Substitui por alternativas de baixo impacto.' },
      { ids: ['osteoporosis','fibromyalgia'],     note: 'A intensidade e impacto do CrossFit representam risco significativo. Consulta o teu profissional de saúde ou exercício físico antes de participar.' },
    ]
  },
  {
    id: 'aquafitness',
    name: 'Aquafitness',
    icon: '🌊',
    duration: '45 min',
    intensity: 'Baixa–Média',
    intensityColor: '#A0842A',
    desc: 'Exercício na água. Baixo impacto articular, ideal para recuperação e mobilidade.',
    muscles: ['Pernas', 'Glúteos', 'Costas', 'Abdômen'],
    tip: 'Excelente para recuperação ativa sem stress nas articulações.',
    risks: [
      { ids: ['shoulder','rotator_cuff'],         note: 'Movimentos amplos de braço contra a resistência da água podem ser exigentes para o ombro. Reduz a amplitude.' },
      { ids: ['neck'],                            note: 'Mantém a cabeça fora de água e evita movimentos bruscos do pescoço durante os exercícios.' },
    ]
  },
];

let groupClassesShowAll = false;

function toggleGroupClassesFilter() {
  groupClassesShowAll = !groupClassesShowAll;
  const btn = document.getElementById('btn-group-filter');
  if (btn) btn.textContent = groupClassesShowAll ? 'Só recomendadas' : 'Ver todas';
  renderGroupClasses();
}

function toggleLikeClass(id) {
  const profile = getProfile();
  if (!profile.likedClasses) profile.likedClasses = [];
  const idx = profile.likedClasses.indexOf(id);
  if (idx >= 0) profile.likedClasses.splice(idx, 1);
  else profile.likedClasses.push(id);
  saveProfile(profile);
  renderGroupClasses();
}

function renderGroupClasses() {
  const el = document.getElementById('workout-group-classes');
  if (!el) return;
  const profile = getProfile();
  const liked = profile.likedClasses || [];
  const activeMuscles = workoutSelectedMuscles.length ? workoutSelectedMuscles :
    (profile.weeklyPlan[new Date().getDay()] || []);

  const scored = GROUP_CLASSES.map(c => ({
    ...c,
    isLiked: liked.includes(c.id),
    matchCount: c.muscles.filter(m => activeMuscles.includes(m)).length,
    isRecommended: c.muscles.some(m => activeMuscles.includes(m))
  })).sort((a, b) => {
    if (a.isLiked !== b.isLiked) return b.isLiked - a.isLiked;
    return b.matchCount - a.matchCount;
  });

  const toShow = groupClassesShowAll ? scored : scored.filter(c => c.isLiked || c.isRecommended || activeMuscles.length === 0).slice(0, 6);

  if (!toShow.length) {
    el.innerHTML = `<div style="text-align:center; padding:16px; color:var(--muted); font-size:0.85rem;">
      Seleciona músculos acima para ver aulas recomendadas.
    </div>`;
    return;
  }

  // Build injury risk notes for each class based on the user's active injuries
  const hp = getHealthProfile();
  const userInjuryIds = new Set([
    ...(hp.injuries || []),
    // map custom injury names to IDs if they partially match known IDs (best effort)
  ]);

  el.innerHTML = toShow.map(c => {
    // Collect relevant risk notes for this user
    const riskNotes = (c.risks || [])
      .filter(r => r.ids.some(id => userInjuryIds.has(id)))
      .map(r => r.note);

    const riskBanner = riskNotes.length
      ? `<div style="background:rgba(255,71,87,.07); border:1px solid rgba(255,71,87,.3); border-radius:var(--radius-sm); padding:8px 10px; margin-top:6px;">
          <div style="font-size:0.68rem; color:#ff4757; font-weight:800; text-transform:uppercase; letter-spacing:.5px; margin-bottom:4px;">⚠️ Atenção — lesão no teu perfil</div>
          ${riskNotes.map(n => `<div style="font-size:0.75rem; color:var(--text); line-height:1.5; margin-bottom:3px;">• ${n}</div>`).join('')}
        </div>`
      : '';

    return `
    <div style="background:var(--card2); border:1px solid ${c.isRecommended ? 'rgba(212,175,55,.3)' : 'var(--border)'}; border-radius:var(--radius-sm); padding:12px 14px; margin-bottom:10px; display:flex; gap:12px; align-items:flex-start;">
      <div style="font-size:1.8rem; line-height:1; margin-top:2px;">${c.icon}</div>
      <div style="flex:1; min-width:0;">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:4px;">
          <span style="font-size:0.9rem; font-weight:800; color:var(--text);">${c.name}</span>
          ${c.isRecommended ? '<span style="font-size:0.62rem; background:rgba(212,175,55,.15); color:var(--orange); border:1px solid rgba(212,175,55,.3); border-radius:20px; padding:1px 7px; font-weight:700; text-transform:uppercase; letter-spacing:.4px;">Recomendado</span>' : ''}
          ${riskNotes.length ? '<span style="font-size:0.62rem; background:rgba(255,71,87,.12); color:#ff4757; border:1px solid rgba(255,71,87,.3); border-radius:20px; padding:1px 7px; font-weight:700; text-transform:uppercase; letter-spacing:.4px;">⚠ Risco</span>' : ''}
        </div>
        <div style="display:flex; gap:8px; margin-bottom:6px; flex-wrap:wrap;">
          <span style="font-size:0.72rem; color:var(--muted);">⏱ ${c.duration}</span>
          <span style="font-size:0.72rem; color:${c.intensityColor}; font-weight:600;">● ${c.intensity}</span>
        </div>
        <div style="font-size:0.8rem; color:var(--muted); line-height:1.45; margin-bottom:6px;">${c.desc}</div>
        ${c.isRecommended ? `<div style="font-size:0.75rem; color:var(--orange); font-style:italic;">💡 ${c.tip}</div>` : ''}
        ${riskBanner}
      </div>
      <button onclick="toggleLikeClass('${c.id}')"
        style="background:none; border:none; font-size:1.3rem; cursor:pointer; padding:0; flex-shrink:0; line-height:1;"
        title="${c.isLiked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
        ${c.isLiked ? '❤️' : '🤍'}
      </button>
    </div>`;
  }).join('');
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

function renderWorkoutSuggestion() {
  const el = document.getElementById('workout-next-suggestion');
  if (!el) return;
  const suggested = getSuggestedNextTemplate();
  if (!suggested) { el.innerHTML = ''; return; }

  el.innerHTML = `
    <div onclick="loadWorkoutTemplate('${suggested.id}')"
      style="display:flex; align-items:center; justify-content:space-between; padding:10px 12px; margin-bottom:10px;
             border:1px solid rgba(201,162,39,.3); border-radius:var(--radius-sm); cursor:pointer; transition:background .2s;">
      <div>
        <span style="font-size:0.65rem; color:var(--green); font-weight:700; text-transform:uppercase; letter-spacing:.5px;">Sugerido ·</span>
        <span style="font-size:0.85rem; font-weight:700; color:var(--text); margin-left:4px;">${suggested.label}</span>
      </div>
      <span style="color:var(--green); font-size:1rem; opacity:.7;">→</span>
    </div>`;
}

function scrollTemplates(dir) {
  const el = document.getElementById('workout-template-scroll');
  if (el) el.scrollBy({ left: dir * 160, behavior: 'smooth' });
}
function updateTemplateArrows() {} // reserved for future fade logic

function renderWorkoutTemplatePills() {
  const el = document.getElementById('workout-template-pills');
  const suggested = getSuggestedNextTemplate();
  const profile = getProfile();
  const userGender = profile ? profile.gender : null; // 'm' or 'f'

  // Sort: gender-matched first (including 'all'), then other-gender last
  const sorted = [...WORKOUT_TEMPLATES].sort((a, b) => {
    const aMatch = !userGender || a.gender === userGender || a.gender === 'all';
    const bMatch = !userGender || b.gender === userGender || b.gender === 'all';
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  let shownDivider = false;
  el.innerHTML = sorted.map(t => {
    const isActive    = activeTemplateId === t.id;
    const isSuggested = suggested && suggested.id === t.id && !isActive;
    const isMatch     = !userGender || t.gender === userGender || t.gender === 'all';
    const isOther     = userGender && !isMatch;

    // Divider before first other-gender template
    let divider = '';
    if (isOther && !shownDivider) {
      shownDivider = true;
      divider = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 6px;opacity:.45;min-width:24px;">
        <div style="flex:1;width:1px;background:var(--border);"></div>
        <span style="font-size:0.55rem;color:var(--muted);writing-mode:vertical-rl;text-orientation:mixed;padding:4px 0;white-space:nowrap;">outros</span>
        <div style="flex:1;width:1px;background:var(--border);"></div>
      </div>`;
    }

    const bg     = isActive ? 'rgba(212,175,55,.2)' : isSuggested ? 'rgba(201,162,39,.1)' : 'var(--card2)';
    const border = isActive ? 'var(--orange)' : isSuggested ? 'var(--green)' : 'var(--border)';
    const color  = isActive ? 'var(--orange)' : isSuggested ? 'var(--green)' : 'var(--text)';
    const opacity = isOther ? 'opacity:.55;' : '';

    return divider + `
    <div onclick="loadWorkoutTemplate('${t.id}')"
      style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 14px;
             background:${bg}; border:1px solid ${border};
             border-radius:var(--radius-sm); cursor:pointer; transition:all .2s; min-width:110px; text-align:center; ${opacity}">
      <span style="font-size:0.85rem; font-weight:700; white-space:nowrap; color:${color};">${t.label}</span>
      <span style="font-size:0.7rem; color:var(--muted);">${t.exercises.length} exercícios</span>
      ${isSuggested ? '<span style="font-size:0.62rem; color:var(--green); font-weight:700; text-transform:uppercase; letter-spacing:.4px;">sugerido</span>' : ''}
    </div>`;
  }).join('');
}

function loadWorkoutTemplate(templateId) {
  const tpl = WORKOUT_TEMPLATES.find(t => t.id === templateId);
  if (!tpl) return;
  activeTemplateId = templateId;
  const profile = getProfile();
  // Deep copy exercises and adapt to goal
  const base = tpl.exercises.map(e => ({ name: e.name, muscle: e.muscle, sets: e.sets.map(s => ({ ...s })) }));
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
  showToast(`✔ ${tpl.label} carregado!`);
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

function showExerciseVideo(name) {
  const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent('como fazer ' + name + ' academia');
  window.open(url, '_blank', 'noopener');
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
    label: 'Perda de Gordura', emoji: '🔥',
    color: '#C9A227', bg: 'rgba(201,162,39,.07)', border: 'rgba(201,162,39,.3)',
    sets: 3, repsPattern: [20, 18, 15],
    rest: '30–45 seg',
    technique: 'Superséries & Circuito',
    keyPoints: [
      '🔁 15–20 reps com peso moderado — prioriza volume',
      '⚡ Faz superséries: 2 exercícios seguidos sem pausa',
      '⏱ Descanso curto: 30–45 seg entre superséries',
      '🚴 Termina com 15–20 min de cardio moderado',
    ],
    restNote: '30–45 seg',
    techniqueHint: (isLast) => isLast ? '🔁 Última série — tenta não parar' : null,
  },
  bulk: {
    label: 'Ganho Muscular', emoji: '💪',
    color: '#D4AF37', bg: 'rgba(212,175,55,.07)', border: 'rgba(212,175,55,.3)',
    sets: 4, repsPattern: [12, 10, 8, 6],
    rest: '90–120 seg',
    technique: 'Hipertrofia & Sobrecarga Progressiva',
    keyPoints: [
      '🏋️ 6–12 reps — últimas 2 devem ser difíceis',
      '📈 Aumenta o peso quando completares todas as reps',
      '⏱ Descanso completo: 90–120 seg entre séries',
      '🔻 Última série em drop-set: reduz 20% do peso e vai até à falha',
    ],
    restNote: '90–120 seg',
    techniqueHint: (isLast) => isLast ? '🔻 Drop-set: reduz 20% do peso e continua até à falha' : null,
  },
  maintain: {
    label: 'Manutenção', emoji: '⚖️',
    color: '#A0842A', bg: 'rgba(160,132,42,.07)', border: 'rgba(160,132,42,.3)',
    sets: 3, repsPattern: [15, 12, 10],
    rest: '60–90 seg',
    technique: 'Resistência & Tonificação',
    keyPoints: [
      '🎯 10–15 reps com boa técnica e controlo',
      '🔺 Pirâmide: aumenta peso e diminui reps a cada série',
      '⏱ Descanso moderado: 60–90 seg entre séries',
      '⚖️ Equilíbrio entre força e resistência em cada sessão',
    ],
    restNote: '60–90 seg',
    techniqueHint: (isLast) => isLast ? '🔺 Última série em pirâmide — máximo de carga com boa técnica' : null,
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

function renderGoalBanner() {
  const el = document.getElementById('workout-goal-banner');
  if (!el) return;
  const profile = getProfile();
  if (!profile || !profile.goal) { el.innerHTML = ''; return; }
  const config = GOAL_WORKOUT_CONFIG[profile.goal];
  if (!config) { el.innerHTML = ''; return; }

  el.innerHTML = `
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px; flex-wrap:wrap;">
      <span style="font-size:0.75rem; color:${config.color}; font-weight:700;">${config.emoji} ${config.label}</span>
      <span style="font-size:0.72rem; color:var(--muted);">·</span>
      <span style="font-size:0.72rem; color:var(--muted);">${config.technique}</span>
      <span style="font-size:0.72rem; color:var(--muted);">·</span>
      <span style="font-size:0.72rem; color:var(--muted);">⏱ ${config.rest}</span>
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

  document.getElementById('workout-day-label').textContent = DAYS_FULL[currentDay];

  // Init selected muscles from plan (or keep existing selection)
  if (workoutSelectedMuscles.length === 0) {
    workoutSelectedMuscles = planMuscles.length > 0 ? [...planMuscles] : [];
  }

  renderGoalBanner();
  renderInjuryWarning();
  renderAgeAdaptedWorkout(getAgeCategory(profile.age));
  renderWorkoutSuggestion();
  renderWorkoutTemplatePills();
  renderWorkoutMuscleChips(profile);
  renderExerciseBrowser(profile);
  renderWorkoutList();
  updateWorkoutSummary();
  renderGroupClasses();
}

function renderWorkoutMuscleChips(profile) {
  const filterEl = document.getElementById('workout-muscle-filter');
  filterEl.innerHTML = MUSCLES.map(m => `
    <div class="muscle-chip ${workoutSelectedMuscles.includes(m) ? 'selected' : ''}"
         onclick="toggleWorkoutMuscle('${m}')">${m}</div>
  `).join('');
}

function toggleWorkoutMuscle(muscle) {
  const idx = workoutSelectedMuscles.indexOf(muscle);
  if (idx >= 0) workoutSelectedMuscles.splice(idx, 1);
  else workoutSelectedMuscles.push(muscle);
  const profile = getProfile();
  renderWorkoutMuscleChips(profile);
  renderExerciseBrowser(profile);
  renderGroupClasses();
}

function renderExerciseBrowser(profile) {
  const browser = document.getElementById('workout-ex-browser');
  if (workoutSelectedMuscles.length === 0) {
    browser.innerHTML = `<div style="text-align:center; padding:20px; color:var(--muted); font-size:0.85rem;">
      👆 Seleciona um ou mais grupos musculares acima para ver os exercícios
    </div>`;
    return;
  }

  const hp2 = getHealthProfile();
  const activeInjuries = HEALTH_INJURIES.filter(i => hp2.injuries.includes(i.id));
  const avoidSet = new Set(activeInjuries.flatMap(i => i.avoid));

  browser.innerHTML = workoutSelectedMuscles.map(muscle => {
    const profile2 = getProfile();
    const custom = (profile2.customExercises || {})[muscle] || [];
    const allEx = [...(EXERCISE_LIBRARY[muscle] || []), ...custom];
    const cards = allEx.map(name => {
      const isAdded = !!workoutExercises.find(e => e.name === name);
      const isRisky = avoidSet.has(name);
      const safeName = name.replace(/'/g, "\\'");
      const riskyStyle = isRisky ? 'border-color:rgba(255,71,87,.5); background:rgba(255,71,87,.06);' : '';
      const riskyBadge = isRisky ? `<span style="font-size:0.62rem; color:#ff4757; background:rgba(255,71,87,.15); border:1px solid rgba(255,71,87,.3); border-radius:20px; padding:1px 7px; font-weight:700; margin-top:4px; display:inline-block;">⚠ Lesão</span>` : '';
      return `<div class="ex-card ${isAdded ? 'added' : ''}" onclick="toggleExerciseCard('${safeName}', '${muscle}', this)" style="${riskyStyle}">
        <div style="flex:1; min-width:0;">
          <div class="ex-card-name">${name}</div>
          ${riskyBadge}
          <button onclick="event.stopPropagation(); showExerciseVideo('${name.replace(/'/g, "\\'")}')"
            style="background:none; border:none; font-size:0.68rem; color:var(--muted); cursor:pointer; padding:0; margin-top:3px; display:inline-flex; align-items:center; gap:3px;">
            ▶ ver vídeo
          </button>
        </div>
        <span class="ex-card-btn ${isAdded ? '' : 'add'}">${isAdded ? '✔' : '+'}</span>
      </div>`;
    }).join('');
    return `<div class="ex-browser-section">
      <div class="ex-browser-title">${muscle}</div>
      <div class="ex-card-grid">${cards}</div>
    </div>`;
  }).join('');
}

function toggleExerciseCard(name, muscle, cardEl) {
  const idx = workoutExercises.findIndex(e => e.name === name);
  if (idx >= 0) {
    workoutExercises.splice(idx, 1);
    cardEl.classList.remove('added');
    cardEl.querySelector('.ex-card-btn').textContent = '+';
    cardEl.querySelector('.ex-card-btn').classList.add('add');
  } else {
    workoutExercises.push({ name, muscle, sets: [{ reps: 12, weight: 0 }] });
    cardEl.classList.add('added');
    cardEl.querySelector('.ex-card-btn').textContent = '✔';
    cardEl.querySelector('.ex-card-btn').classList.remove('add');
  }
  renderWorkoutList();
  updateWorkoutSummary();
}

function updateWorkoutSummary() {
  const el = document.getElementById('workout-summary');
  const n = workoutExercises.length;
  const sets = workoutExercises.reduce((a, e) => a + e.sets.length, 0);
  el.textContent = n > 0 ? `${n} exercício${n>1?'s':''} · ${sets} série${sets!==1?'s':''}` : 'Toca nos exercícios abaixo para adicionar';
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
      style="padding:6px 14px; border-radius:20px; font-size:0.8rem; font-weight:600; cursor:pointer; white-space:nowrap; border:1px solid ${isActive ? 'var(--orange)' : 'var(--border)'}; background:${isActive ? 'rgba(212,175,55,.15)' : 'rgba(255,255,255,.04)'}; color:${isActive ? 'var(--orange)' : 'var(--muted)'}; transition:all .15s;">${m}</div>`;
  }).join('');

  const exList = exercises.map(name => {
    const isAdded = !!workoutExercises.find(e => e.name === name);
    const isRisky = avoidSet.has(name);
    const safeName = name.replace(/'/g, "\\'");
    return `<div onclick="addExFromPicker('${safeName}','${_pickerMuscle}')"
      style="display:flex; justify-content:space-between; align-items:center; padding:11px 14px;
             background:${isAdded ? 'rgba(201,162,39,.07)' : 'rgba(255,255,255,.03)'};
             border:1px solid ${isAdded ? 'rgba(201,162,39,.3)' : isRisky ? 'rgba(255,71,87,.25)' : 'var(--border)'};
             border-radius:var(--radius-sm); cursor:pointer; transition:all .15s; margin-bottom:6px;">
      <div>
        <span style="font-size:0.88rem; font-weight:600; color:${isAdded ? 'var(--green)' : 'var(--text)'};">${name}</span>
        ${isRisky ? '<span style="margin-left:8px; font-size:0.65rem; color:#ff4757;">⚠ lesão</span>' : ''}
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
      <input id="custom-ex-name" type="text" placeholder="Outro (escreve o nome)…"
        style="flex:1; background:rgba(255,255,255,.05); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text); padding:9px 12px; font-size:0.88rem; outline:none;">
      <button onclick="addCustomExFromPicker()"
        style="background:rgba(212,175,55,.15); color:var(--orange); border:1px solid rgba(212,175,55,.3); border-radius:var(--radius-sm); padding:9px 14px; cursor:pointer; font-weight:700; font-size:0.9rem; white-space:nowrap;">+ Adicionar</button>
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
    workoutExercises.push({ name, muscle, sets });
    if (!workoutSelectedMuscles.includes(muscle)) workoutSelectedMuscles.push(muscle);
  }
  renderExPicker();
  renderWorkoutList();
  updateWorkoutSummary();
}

function addCustomExFromPicker() {
  const name = document.getElementById('custom-ex-name').value.trim();
  if (!name) { showToast('Escreve o nome do exercício'); return; }
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
  showToast('✔ ' + name + ' adicionado');
}


// ─── Link types config ────────────────────────────────
const LINK_TYPES = {
  superset: { icon: '⚡', label: 'Supersérie',  color: '#D4AF37', note: 'Sem pausa — executa de seguida' },
  biset:    { icon: '🔁', label: 'Bi-set',      color: '#C9A227', note: 'Mesmo músculo — pausa mínima' },
  dropset:  { icon: '🔻', label: 'Drop-set',    color: '#A0842A', note: 'Reduz o peso e continua' },
  giant:    { icon: '💥', label: 'Giant Set',   color: '#F5D060', note: 'Encadeia com o próximo' },
};

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
        <span style="font-size:0.72rem; color:var(--muted); margin-left:8px;">${ex.muscle}</span>
      </div>
      <span style="font-size:1rem; color:${isSelected ? cfg.color : 'rgba(255,255,255,.15)'};">${isSelected ? '✔' : '○'}</span>
    </div>`;
  }).join('');

  const canConfirm = _linkTargetIdx !== null;
  const cfg = LINK_TYPES[_linkSelectedType];

  document.getElementById('link-picker-body').innerHTML = `
    <p style="font-size:0.78rem; color:var(--muted); margin-bottom:12px;">Escolhe o tipo de combinação e o exercício para emparelhar.</p>
    <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px;">${typeChips}</div>
    <div style="font-size:0.72rem; color:var(--muted); text-transform:uppercase; letter-spacing:.5px; font-weight:700; margin-bottom:8px;">Emparelhar com</div>
    <div style="max-height:40vh; overflow-y:auto; margin-bottom:14px;">${exList || '<p style="color:var(--muted);font-size:0.85rem;">Adiciona mais exercícios ao treino primeiro.</p>'}</div>
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
  showToast(cfg.icon + ' ' + cfg.label + ' criada!');
}

function removeExerciseLink(exIdx) {
  workoutExercises[exIdx].linkNext = null;
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

  const profile = getProfile();
  const goal = profile ? profile.goal : 'maintain';
  const goalConfig = GOAL_WORKOUT_CONFIG[goal] || GOAL_WORKOUT_CONFIG.maintain;

  const cards = [];

  workoutExercises.forEach((ex, i) => {
    const link = ex.linkNext;                           // manual link to next exercise
    const lt = link ? (LINK_TYPES[link] || LINK_TYPES.superset) : null;

    // Compute display values up front (no nested template literals)
    const vol = ex.sets.reduce((a, s) => a + (s.reps * s.weight), 0);
    const volBadge = vol > 0 ? `<span style="font-size:0.75rem; color:var(--green); font-weight:700;">${vol}kg</span>` : '';
    const tip = getExTip(ex.name);
    const tipHtml = tip ? `<div style="border-left:2px solid rgba(255,215,0,.4); padding:6px 10px; margin-bottom:8px; font-size:0.78rem; color:var(--muted); line-height:1.5;">💡 ${tip}</div>` : '';

    const lastSetHint = goalConfig.techniqueHint ? goalConfig.techniqueHint(true) : null;
    const hintHtml = lastSetHint ? `<div style="border-left:2px solid ${goalConfig.border}; padding:5px 10px; margin-bottom:8px; font-size:0.73rem; color:${goalConfig.color}; line-height:1.4;">${lastSetHint}</div>` : '';

    // Left border color: linked exercise gets the link color
    const prevLink = i > 0 ? workoutExercises[i - 1].linkNext : null;
    const prevLt = prevLink ? (LINK_TYPES[prevLink] || LINK_TYPES.superset) : null;
    const borderColor = lt ? lt.color : (prevLt ? prevLt.color : 'var(--orange)');
    const borderStyle = (lt || prevLt) ? `border-left:2px solid ${borderColor};` : 'border-left:2px solid rgba(212,175,55,.4);';

    // Rest note
    const restNote = lt ? (lt.label === 'Supersérie' || lt.label === 'Bi-set' ? 'sem pausa →' : lt.note) : goalConfig.restNote;
    const restColor = lt ? lt.color : goalConfig.color;
    const restBadge = `<span style="font-size:0.66rem; color:${restColor}; border:1px solid ${restColor}40; border-radius:20px; padding:1px 7px; font-weight:700;">⏱ ${restNote}</span>`;

    const rows = ex.sets.map((s, si) => {
      const isLast = si === ex.sets.length - 1;
      const techHint = goalConfig.techniqueHint ? goalConfig.techniqueHint(isLast) : null;
      const hintIcon = techHint && isLast ? `<span title="${techHint}" style="cursor:help; font-size:0.75rem;">${lt && lt.icon === '🔻' ? '🔻' : '💡'}</span>` : '';
      return `<tr>
        <td style="color:var(--muted); font-size:0.8rem;">${si + 1}</td>
        <td><input type="number" value="${s.reps}" min="1" max="100" onchange="updateSet(${i},${si},'reps',+this.value)" placeholder="12"></td>
        <td><input type="number" value="${s.weight}" min="0" step="0.5" onchange="updateSet(${i},${si},'weight',+this.value)" placeholder="0"></td>
        <td style="font-size:0.65rem; color:var(--muted);">${hintIcon}</td>
        <td><button onclick="removeSet(${i},${si})" style="background:none;border:none;color:#ff4757;cursor:pointer;font-size:1rem;padding:2px 6px;">×</button></td>
      </tr>`;
    }).join('');

    cards.push(`
      <div class="session-ex" style="${borderStyle}">
        <div class="session-ex-header">
          <div>
            <div class="session-ex-name">${ex.name}</div>
            <div style="display:flex; gap:6px; align-items:center; margin-top:3px; flex-wrap:wrap;">
              <span class="session-ex-muscle">${ex.muscle}</span>
              ${restBadge}
              <button onclick="showExerciseVideo('${ex.name.replace(/'/g, "\\'")}')"
                style="background:none; border:none; font-size:0.7rem; color:#ff4757; cursor:pointer; padding:0; font-weight:600;">▶ ver vídeo</button>
            </div>
          </div>
          <div style="display:flex; gap:6px; align-items:center;">
            ${volBadge}
            <button onclick="removeExercise(${i})"
              style="background:rgba(255,71,87,.1);color:#ff4757;border:1px solid rgba(255,71,87,.2);border-radius:6px;padding:5px 9px;cursor:pointer;font-size:0.8rem;">✕</button>
          </div>
        </div>
        ${tipHtml}${hintHtml}
        <table class="sets-table">
          <thead><tr><th>Série</th><th>Reps</th><th>Kg</th><th></th><th></th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <button onclick="addSetInline(${i})"
          style="background:rgba(212,175,55,.08);color:var(--orange);border:1px dashed rgba(212,175,55,.3);border-radius:6px;padding:6px;width:100%;cursor:pointer;font-size:0.8rem;font-weight:600; margin-top:4px;">
          + série
        </button>
      </div>`);

    // ── Connector between this and next exercise ──────────────────
    if (i < workoutExercises.length - 1) {
      if (lt) {
        // Active link — show connector badge
        cards.push(`
          <div style="display:flex; align-items:center; gap:8px; margin:2px 0; padding:0 4px;">
            <div style="flex:1; height:1px; background:${lt.color}; opacity:.35;"></div>
            <span style="font-size:0.7rem; color:${lt.color}; font-weight:700; white-space:nowrap;">${lt.icon} ${lt.label}</span>
            <span style="font-size:0.65rem; color:var(--muted); white-space:nowrap;">${lt.note}</span>
            <button onclick="removeExerciseLink(${i})" title="Remover ligação"
              style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:0.75rem;padding:0 2px;line-height:1; opacity:.6;">✕</button>
            <div style="flex:1; height:1px; background:${lt.color}; opacity:.35;"></div>
          </div>`);
      } else {
        // No link — small button to open the link picker modal
        cards.push(`
          <div style="display:flex; justify-content:center; margin:2px 0;">
            <button onclick="openLinkPicker(${i})"
              style="background:none; border:none; color:var(--muted); cursor:pointer; font-size:0.65rem; padding:4px 12px; opacity:.4; transition:opacity .2s; letter-spacing:.3px; border-radius:20px;"
              onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='.4'">
              ⚡ ligar
            </button>
          </div>`);
      }
    }
  });

  el.innerHTML = cards.join('');
  updateWorkoutSummary();
}


function updateSet(exIdx, setIdx, field, val) {
  workoutExercises[exIdx].sets[setIdx][field] = val;
  updateWorkoutSummary();
  // Re-render just the volume badge without full re-render
  const vol = workoutExercises[exIdx].sets.reduce((a, s) => a + (s.reps * s.weight), 0);
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
      <input type="number" value="${s.reps}" placeholder="Reps" onchange="tempSets[${i}].reps=+this.value" style="background:var(--card2);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text);padding:8px;font-size:0.9rem;width:70px;text-align:center;">
      <span class="sep">reps ×</span>
      <input type="number" value="${s.weight}" placeholder="kg" onchange="tempSets[${i}].weight=+this.value" style="background:var(--card2);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text);padding:8px;font-size:0.9rem;width:70px;text-align:center;">
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
  showToast('Séries guardadas! ✔');
}

function finishWorkout() {
  if (!workoutExercises.length) { showToast('Adicione pelo menos um exercício!'); return; }
  const profile = getProfile();
  const entry = {
    date: new Date().toISOString(),
    day: currentDay,
    templateId: activeTemplateId,
    muscles: [...workoutSelectedMuscles],
    exercises: workoutExercises.map(e => ({ name: e.name, muscle: e.muscle, sets: e.sets }))
  };
  if (!profile.workoutHistory) profile.workoutHistory = [];
  profile.workoutHistory.unshift(entry);
  // keep last 100
  profile.workoutHistory = profile.workoutHistory.slice(0, 100);
  saveProfile(profile);
  workoutExercises = [];
  workoutSelectedMuscles = [];
  activeTemplateId = null;
  renderWorkoutList();
  renderDashboard();
  showToast('🎉 Treino concluído!');
  navigate('dashboard', document.querySelector('[data-screen="dashboard"]'));
}

// ═══════════════════════════════════════════════════════
//  HISTORY
// ═══════════════════════════════════════════════════════

function renderHistory() {
  const profile = getProfile();
  const history = profile.workoutHistory || [];
  const el = document.getElementById('history-list');

  if (!history.length) {
    el.innerHTML = '<div class="empty"><div class="icon">📊</div><p>Nenhum treino registado ainda.<br>Complete o primeiro treino!</p></div>';
    return;
  }
  el.innerHTML = history.map(w => {
    const d = new Date(w.date);
    const muscles = [...new Set(w.exercises.map(e => e.muscle))];
    const totalSets = w.exercises.reduce((a, e) => a + e.sets.length, 0);
    return `<div class="history-item">
      <div>
        <div style="font-weight:700;">${d.toLocaleDateString('pt-PT', {weekday:'long', day:'numeric', month:'short'})}</div>
        <div style="font-size:0.78rem; color:var(--muted); margin:4px 0;">${w.exercises.length} exercícios · ${totalSets} séries</div>
        <div class="chip-row" style="margin-top:6px;">${muscles.map(m => `<span class="badge badge-orange">${m}</span>`).join('')}</div>
      </div>
      <div style="text-align:right; font-size:0.75rem; color:var(--muted);">${d.toLocaleTimeString('pt-PT', {hour:'2-digit', minute:'2-digit'})}</div>
    </div>`;
  }).join('');
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
      <span style="display:inline-flex; align-items:center; gap:5px; padding:6px 12px; border-radius:20px; background:rgba(160,132,42,.15); border:1px solid rgba(160,132,42,.35); color:var(--cyan); font-size:0.82rem; font-weight:600; margin:0 4px 4px 0;">
        ${c}
        <button onclick="removeCustomHealthItem('${customKey}',${i})" style="background:none;border:none;color:var(--cyan);cursor:pointer;font-size:0.9rem;padding:0;line-height:1;">✕</button>
      </span>`).join('');
    const dotsChip = customKey ? `
      <div class="muscle-chip" onclick="toggleCustomHealthInput('${customKey}')"
           style="display:flex; align-items:center; gap:4px; letter-spacing:2px; opacity:0.7; font-size:1rem; padding:6px 14px;">···</div>` : '';
    const inlineInput = customKey ? `
      <div id="custom-input-row-${customKey}" style="display:none; margin-top:8px;">
        <div style="display:flex; gap:8px; align-items:center;">
          <input id="custom-input-${customKey}" type="text" placeholder="Escreve e prime Enter ou +"
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
    <div style="font-size:0.72rem; color:var(--muted); text-transform:uppercase; letter-spacing:.6px; font-weight:700; margin-bottom:10px;">🏥 Condições de Saúde / Doenças</div>

    <!-- Search filter -->
    <div style="position:relative; margin-bottom:10px;">
      <input id="cond-search" type="text" placeholder="🔍 Pesquisar condição..."
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
           style="display:flex; align-items:center; gap:4px; letter-spacing:2px; opacity:0.65; font-size:1rem; padding:6px 14px;" title="Adicionar outra condição">···</div>
    </div>

    <!-- Custom conditions added by user -->
    <div id="custom-cond-chips" style="margin-bottom:10px;">
      ${custom.map((c, i) => `
        <span style="display:inline-flex; align-items:center; gap:5px; padding:6px 12px; border-radius:20px; background:rgba(160,132,42,.15); border:1px solid rgba(160,132,42,.35); color:var(--cyan); font-size:0.82rem; font-weight:600; margin:0 4px 4px 0;">
          ${c}
          <button onclick="removeCustomCondition(${i})" style="background:none;border:none;color:var(--cyan);cursor:pointer;font-size:0.9rem;padding:0;line-height:1;">✕</button>
        </span>`).join('')}
    </div>

    <!-- Add custom condition -->
    <div style="position:relative;">
      <div style="font-size:0.72rem; color:var(--muted); font-weight:600; margin-bottom:6px;">➕ Adicionar condição personalizada</div>
      <div style="display:flex; gap:8px; align-items:flex-start;">
        <div style="flex:1; position:relative;">
          <input id="custom-cond-input" type="text" placeholder="Ex: Fibromialgia, Lúpus, Enxaqueca..."
            oninput="showCondSuggestions(this.value)"
            onkeydown="if(event.key==='Enter'){addCustomCondition();event.preventDefault();}"
            style="width:100%; background:rgba(255,255,255,0.06); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text); padding:9px 12px; font-size:0.88rem; outline:none; transition:border-color .2s;"
            onfocus="this.style.borderColor='var(--orange)'; showCondSuggestions(this.value)"
            onblur="setTimeout(hideCondSuggestions,200)">
          <div id="cond-suggestions" style="display:none; position:absolute; top:100%; left:0; right:0; z-index:99; background:rgba(15,15,35,0.97); border:1px solid var(--border); border-radius:var(--radius-sm); margin-top:4px; max-height:180px; overflow-y:auto; box-shadow:0 8px 24px rgba(0,0,0,0.5);"></div>
        </div>
        <button onclick="addCustomCondition()" class="btn btn-secondary btn-sm" style="white-space:nowrap; flex-shrink:0;">+ Adicionar</button>
      </div>
    </div>
  </div>`;

  document.getElementById('health-modal-body').innerHTML =
    simpleSection('🤧 Alergias / Intolerâncias', HEALTH_ALLERGIES, 'allergies', 'customAllergies') +
    conditionsSection +
    simpleSection('🩹 Lesões / Patologias', HEALTH_INJURIES, 'injuries', 'customInjuries') +
    `<div style="margin-bottom:20px;">
      <div style="font-size:0.72rem; color:var(--muted); text-transform:uppercase; letter-spacing:.6px; font-weight:700; margin-bottom:8px;">📝 Outras observações</div>
      <textarea id="health-notes" rows="3" placeholder="Medicações, observações do médico, outras notas relevantes..."
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
      onmouseover="this.style.background='rgba(212,175,55,0.12)'"
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
  if (alreadyPreset || alreadyCustom) { showToast('Condição já adicionada!'); input.value = ''; return; }
  profile.healthProfile.customConditions.push(val);
  saveProfile(profile);
  input.value = '';
  hideCondSuggestions();
  // Re-render just the custom chips
  const chipsEl = document.getElementById('custom-cond-chips');
  if (chipsEl) {
    const custom = profile.healthProfile.customConditions;
    chipsEl.innerHTML = custom.map((c, i) => `
      <span style="display:inline-flex; align-items:center; gap:5px; padding:6px 12px; border-radius:20px; background:rgba(160,132,42,.15); border:1px solid rgba(160,132,42,.35); color:var(--cyan); font-size:0.82rem; font-weight:600; margin:0 4px 4px 0;">
        ${c}
        <button onclick="removeCustomCondition(${i})" style="background:none;border:none;color:var(--cyan);cursor:pointer;font-size:0.9rem;padding:0;line-height:1;">✕</button>
      </span>`).join('');
  }
  showToast(`"${val}" adicionado ✔`);
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
      <span style="display:inline-flex; align-items:center; gap:5px; padding:6px 12px; border-radius:20px; background:rgba(160,132,42,.15); border:1px solid rgba(160,132,42,.35); color:var(--cyan); font-size:0.82rem; font-weight:600; margin:0 4px 4px 0;">
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
    showToast('Já adicionado!');
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
      <span style="display:inline-flex; align-items:center; gap:5px; padding:6px 12px; border-radius:20px; background:rgba(160,132,42,.15); border:1px solid rgba(160,132,42,.35); color:var(--cyan); font-size:0.82rem; font-weight:600; margin:0 4px 4px 0;">
        ${c}
        <button onclick="removeCustomHealthItem('${key}',${i})" style="background:none;border:none;color:var(--cyan);cursor:pointer;font-size:0.9rem;padding:0;line-height:1;">✕</button>
      </span>`).join('');
  }
  showToast('Adicionado ✔');
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
      <span style="display:inline-flex; align-items:center; gap:5px; padding:6px 12px; border-radius:20px; background:rgba(160,132,42,.15); border:1px solid rgba(160,132,42,.35); color:var(--cyan); font-size:0.82rem; font-weight:600; margin:0 4px 4px 0;">
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

function renderInjuryWarning() {
  const el = document.getElementById('workout-injury-warning');
  if (!el) return;
  const hp = getHealthProfile();
  const injuries = HEALTH_INJURIES.filter(i => hp.injuries.includes(i.id));
  const customInjuries = hp.customInjuries || [];
  if (!injuries.length && !customInjuries.length) { el.innerHTML = ''; return; }

  const allLabels = [
    ...injuries.map(i => `${i.icon} ${i.label}`),
    ...customInjuries.map(n => `🩹 ${n}`),
  ];

  el.innerHTML = `
    <details style="margin-bottom:10px; border:1px solid rgba(212,175,55,.25); border-radius:var(--radius-sm); padding:8px 12px;">
      <summary style="cursor:pointer; font-size:0.78rem; color:var(--orange); font-weight:700; list-style:none; display:flex; justify-content:space-between; align-items:center;">
        <span>⚠️ Lesões activas (${allLabels.length})</span>
        <span style="font-size:0.65rem; color:var(--muted); font-weight:400;">ver detalhes</span>
      </summary>
      <div style="margin-top:8px; display:flex; flex-direction:column; gap:8px;">
        ${injuries.map(i => `
          <div>
            <div style="font-size:0.82rem; font-weight:700;">${i.icon} ${i.label}</div>
            <div style="font-size:0.75rem; color:var(--muted); margin-top:2px; line-height:1.4;">${i.note}</div>
            <div style="margin-top:4px; display:flex; flex-wrap:wrap; gap:4px;">
              ${i.avoid.map(e => `<span style="font-size:0.66rem; color:#ff4757; border:1px solid rgba(255,71,87,.3); border-radius:20px; padding:1px 7px;">⚠ ${e}</span>`).join('')}
            </div>
          </div>`).join('')}
        ${customInjuries.map(n => `
          <div>
            <div style="font-size:0.82rem; font-weight:700;">🩹 ${n}</div>
            <div style="font-size:0.75rem; color:var(--muted); margin-top:2px;">Consulta o teu profissional de saúde ou exercício físico sobre como adaptar o treino.</div>
          </div>`).join('')}
      </div>
    </details>`;
}

// ═══════════════════════════════════════════════════════
//  NUTRITION
// ═══════════════════════════════════════════════════════

function populateNutritionForm() {
  const profile = getProfile();
  if (!profile) return;
  if (profile.weight) document.getElementById('nut-weight').value = profile.weight;
  if (profile.height) document.getElementById('nut-height').value = profile.height;
  if (profile.age) document.getElementById('nut-age').value = profile.age;
  if (profile.gender) document.getElementById('nut-gender').value = profile.gender;
  if (profile.goal) document.getElementById('nut-goal').value = profile.goal;
}

function calcNutrition() {
  const weight = parseFloat(document.getElementById('nut-weight').value);
  const height = parseFloat(document.getElementById('nut-height').value);
  const age = parseInt(document.getElementById('nut-age').value);
  const gender = document.getElementById('nut-gender').value;
  const activity = parseFloat(document.getElementById('nut-activity').value);
  const goal = document.getElementById('nut-goal').value;

  if (!weight || !height || !age) { showToast('Preencha todos os campos!'); return; }

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
  const profile = getProfile();
  profile.weight = weight; profile.height = height; profile.age = age;
  profile.gender = gender; profile.goal = goal;
  saveProfile(profile);

  // Display
  document.getElementById('nut-cal').textContent = Math.round(targetCal) + ' kcal';
  document.getElementById('nut-bmr-info').textContent = `TMB: ${Math.round(bmr)} kcal · TDEE: ${Math.round(tdee)} kcal`;

  document.getElementById('nut-macros').innerHTML = `
    <div class="macro-card">
      <div class="macro-val" style="color:#D4AF37">${Math.round(protein)}g</div>
      <div class="macro-label">Proteína</div>
    </div>
    <div class="macro-card">
      <div class="macro-val" style="color:#C9A227">${Math.round(carbs)}g</div>
      <div class="macro-label">Carboidratos</div>
    </div>
    <div class="macro-card">
      <div class="macro-val" style="color:#F5D060">${Math.round(fat)}g</div>
      <div class="macro-label">Gorduras</div>
    </div>`;

  // Health profile (needed before building meals)
  const hp = getHealthProfile();

  // Reset meal selections on new calculation so day-seed is applied fresh
  Object.keys(mealSelections).forEach(k => delete mealSelections[k]);

  // Store state for cycleMeal
  _nutState = { goal, cal: Math.round(targetCal), hp };

  // Meals
  document.getElementById('nut-meals').innerHTML = getMealPlan(goal, Math.round(targetCal), Math.round(protein), hp);

  // Supplements
  document.getElementById('nut-supps').innerHTML = getSupplements(goal, age, hp);

  // Age & health warning banner
  const ageWarningEl = document.getElementById('nut-age-warning');
  const warnings = [];

  if (age < 14) {
    warnings.push({ color:'var(--pink)', bg:'rgba(212,175,55,.1)',
      msg:`⛔ <strong>Criança (${age} anos)</strong> — Este plano foi gerado com base nos dados inseridos, mas é concebido para adultos. Consulta obrigatoriamente um médico pediatra ou nutricionista pediátrico.` });
  } else if (age < 18) {
    warnings.push({ color:'var(--yellow)', bg:'rgba(255,215,0,.08)',
      msg:`⚠️ <strong>Adolescente (${age} anos)</strong> — Recomenda-se supervisão de médico ou nutricionista antes de seguir qualquer regime alimentar ou de suplementação.` });
  } else if (age >= 70) {
    warnings.push({ color:'var(--cyan)', bg:'rgba(160,132,42,.08)',
      msg:`🧓 <strong>Perfil sénior (${age} anos)</strong> — O plano foi ajustado para a 3.ª idade. Consulta o teu médico ou nutricionista antes de iniciar qualquer dieta ou suplementação.` });
  }

  if (hp.conditions && hp.conditions.length) {
    const condLabels = hp.conditions.map(c => HEALTH_CONDITIONS.find(x=>x.id===c)?.label||c).join(', ');
    warnings.push({ color:'var(--green)', bg:'rgba(201,162,39,.08)',
      msg:`🏥 <strong>Condições de saúde registadas:</strong> ${condLabels}. O plano de suplementação foi ajustado. Consulta sempre o teu médico.` });
  }

  const allAllergyLabels = [
    ...(hp.allergies || []).map(a => HEALTH_ALLERGIES.find(x=>x.id===a)?.label||a),
    ...(hp.customAllergies || [])
  ];
  if (allAllergyLabels.length) {
    warnings.push({ color:'var(--orange)', bg:'rgba(212,175,55,.08)',
      msg:`🤧 <strong>Alergias / Intolerâncias:</strong> ${allAllergyLabels.join(', ')}. As sugestões de refeição foram filtradas para excluir estes alergénios automaticamente.` });
  }

  ageWarningEl.innerHTML = warnings.map(w =>
    `<div style="background:${w.bg}; border:1.5px solid ${w.color}; border-radius:var(--radius-sm); padding:12px 14px; margin-bottom:10px; font-size:0.82rem; line-height:1.6; color:var(--text);">${w.msg}</div>`
  ).join('');

  document.getElementById('nutrition-results').style.display = 'block';
  document.getElementById('nutrition-results').scrollIntoView({ behavior: 'smooth' });
  showToast('Plano calculado! ✔');
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

function getMealPlan(goal, cal, protein, hp) {
  hp = hp || {};
  // Seed based on day of year × profile id so each client + each day gets different meals
  const now = new Date();
  const daySeed = Math.floor(now.getTime() / 86400000);

  // calFactor: multiplier applied to slot's % of daily total for each specific option.
  const slots = {
    cut: [
      {
        time: 'Pequeno-almoço', hour: '7h', pct: 0.22,
        opts: [
          { name: 'Ovos mexidos + Aveia + Banana',              desc: '3 ovos mexidos · 50g aveia c/ leite · 1 banana',                             calFactor: 1.03 },
          { name: 'Panquecas de aveia proteicas',               desc: '80g aveia · 2 ovos · 1 clara · canela · mel q.b.',                           calFactor: 1.07 },
          { name: 'Iogurte grego + Granola + Frutos vermelhos', desc: '200g iogurte grego 0% · 30g granola · punhado de morangos',                  calFactor: 0.90 },
          { name: 'Tofu mexido + Pão integral + Tomate',        desc: '150g tofu firme temperado · 2 fatias pão integral · tomate + espinafres',    calFactor: 0.95 },
          { name: 'Papas de aveia + Sementes de chia + Fruta',  desc: '60g aveia cozida em água · 1 c.s. sementes de chia · 1 maçã fatiada',       calFactor: 0.86 }
        ]
      },
      {
        time: 'Lanche manhã', hour: '10h', pct: 0.10,
        opts: [
          { name: 'Iogurte grego + Amêndoas',             desc: '200g iogurte grego 0% · 15g amêndoas torradas',                   calFactor: 1.08 },
          { name: 'Maçã + Queijo cottage',                 desc: '1 maçã média · 100g queijo cottage magro',                        calFactor: 0.87 },
          { name: 'Batido de proteína c/ fruta',           desc: '1 dose whey · 150ml água · 1 kiwi ou meia banana',                calFactor: 1.05 },
          { name: 'Cenoura + Hummus + Pepino',             desc: '1 cenoura grande em palitos · 60g hummus · 1/2 pepino fatiado',   calFactor: 0.82 },
          { name: 'Fruta + Sementes de abóbora',           desc: '1 laranja ou pera · 15g sementes de abóbora tostadas sem sal',    calFactor: 0.78 }
        ]
      },
      {
        time: 'Almoço', hour: '13h', pct: 0.30,
        opts: [
          { name: 'Frango grelhado + Arroz integral + Salada',  desc: '180g peito de frango · 80g arroz integral · salada verde à vontade',   calFactor: 0.97 },
          { name: 'Atum + Batata-doce + Brócolos',              desc: '2 latas atum ao natural · 150g batata-doce cozida · 100g brócolos',    calFactor: 0.89 },
          { name: 'Bacalhau assado + Legumes + Grão',           desc: '200g bacalhau · esparregado de espinafres · 60g grão cozido',          calFactor: 1.00 },
          { name: 'Peru + Quinoa + Espinafres salteados',       desc: '180g peito de peru grelhado · 80g quinoa cozida · espinafres c/ alho', calFactor: 0.94 },
          { name: 'Lentilhas + Arroz + Legumes salteados',      desc: '120g lentilhas cozidas · 70g arroz · courgette + pimento + tomate',    calFactor: 0.91 }
        ]
      },
      {
        time: 'Lanche tarde', hour: '16h', pct: 0.12,
        opts: [
          { name: 'Batido de proteína',                      desc: '1 dose whey protein · 200ml leite de aveia sem açúcar',         calFactor: 0.93 },
          { name: 'Ovo cozido + Palitos de cenoura',         desc: '2 ovos cozidos · 1 cenoura média em palitos',                   calFactor: 0.81 },
          { name: 'Torrada integral + Manteiga de amendoim', desc: '1 fatia pão integral · 15g manteiga de amendoim natural',       calFactor: 1.02 },
          { name: 'Edamame + Laranja',                       desc: '80g edamame cozido com flor de sal · 1 laranja',                calFactor: 0.79 },
          { name: 'Queijo fresco + Tomate + Oregãos',        desc: '100g queijo fresco magro · 1 tomate fatiado · oregãos + azeite', calFactor: 0.84 }
        ]
      },
      {
        time: 'Jantar', hour: '19h30', pct: 0.26,
        opts: [
          { name: 'Salmão + Batata-doce + Brócolos',      desc: '200g salmão grelhado · 120g batata-doce · 100g brócolos a vapor',      calFactor: 1.03 },
          { name: 'Frango no forno + Legumes assados',     desc: '200g frango · courgette, pimento, beringela assados · azeite q.b.',   calFactor: 0.94 },
          { name: 'Omelete de claras + Salada completa',   desc: '5 claras + 1 ovo inteiro · alface, tomate, pepino, azeitonas',        calFactor: 0.81 },
          { name: 'Tofu + Legumes salteados + Arroz',      desc: '180g tofu firme · brócolos + cogumelos + pimento · 70g arroz basmati', calFactor: 0.89 },
          { name: 'Pescada grelhada + Legumes a vapor',    desc: '220g pescada · cenoura + feijão verde + couve-flor a vapor',          calFactor: 0.87 }
        ]
      }
    ],
    bulk: [
      {
        time: 'Pequeno-almoço', hour: '7h', pct: 0.22,
        opts: [
          { name: 'Aveia + Ovos + Manteiga de amendoim + Banana', desc: '100g aveia · 4 ovos mexidos · 30g manteiga de amendoim · 1 banana',       calFactor: 1.10 },
          { name: 'Tosta integral + Ovos + Abacate',              desc: '3 fatias pão integral · 3 ovos estrelados · meio abacate · tomate',        calFactor: 1.00 },
          { name: 'Granola + Iogurte grego gordo + Frutos secos', desc: '80g granola · 200g iogurte grego gordo · 20g nozes · 1 banana',            calFactor: 0.96 },
          { name: 'Arroz de leite proteico + Fruta',              desc: '100g arroz cozido em 300ml leite gordo · 1 dose whey misturada · 1 manga', calFactor: 1.05 },
          { name: 'Wrap integral + Ovos + Queijo + Peru',         desc: '2 wraps integrais · 3 ovos mexidos · 30g queijo curado · 60g peru',        calFactor: 1.02 }
        ]
      },
      {
        time: 'Lanche manhã', hour: '10h', pct: 0.15,
        opts: [
          { name: 'Batido hipercalórico',                           desc: '1 dose whey · 1 banana · 30g aveia · 200ml leite gordo · 15g amendoim',  calFactor: 1.14 },
          { name: 'Pão integral + Queijo + Ovo cozido',             desc: '2 fatias pão · 2 fatias queijo flamengo · 2 ovos cozidos',               calFactor: 0.93 },
          { name: 'Iogurte grego gordo + Fruta + Mel + Oleaginosas',desc: '200g iogurte gordo · 1 maçã · 1 c.s. mel · 20g mix de oleaginosas',     calFactor: 0.98 },
          { name: 'Batata-doce + Frango desfiado + Azeite',         desc: '150g batata-doce cozida · 120g frango desfiado · fio de azeite + sal',   calFactor: 1.00 },
          { name: 'Fruta + Pasta de amendoim + Biscoitos aveia',    desc: '1 banana · 25g pasta de amendoim · 3 biscoitos de aveia integrais',      calFactor: 1.08 }
        ]
      },
      {
        time: 'Almoço', hour: '13h', pct: 0.28,
        opts: [
          { name: 'Arroz + Frango + Feijão + Legumes',           desc: '200g frango · 150g arroz branco · 60g feijão · legumes salteados',     calFactor: 1.02 },
          { name: 'Massa integral + Carne picada + Molho tomate', desc: '150g massa integral · 200g carne picada magra · molho caseiro',       calFactor: 0.97 },
          { name: 'Bife de vaca + Batata cozida + Salada',        desc: '200g bife de vaca · 200g batata cozida · salada colorida com azeite', calFactor: 1.01 },
          { name: 'Salmão + Arroz basmati + Legumes',             desc: '220g salmão no forno · 150g arroz basmati · brócolos + cenoura',      calFactor: 1.04 },
          { name: 'Frango + Massa + Pesto + Espinafres',          desc: '200g frango grelhado · 150g massa integral · 2 c.s. pesto · espinafres', calFactor: 1.03 }
        ]
      },
      {
        time: 'Lanche tarde', hour: '16h', pct: 0.12,
        opts: [
          { name: 'Pão integral + Atum + Fruta',     desc: '2 fatias pão integral · 1 lata atum ao natural · 1 maçã grande',   calFactor: 1.04 },
          { name: 'Batido de massa muscular',         desc: '1 dose mass gainer · 300ml leite gordo · 1 banana',               calFactor: 1.19 },
          { name: 'Crepioca + Queijo + Peru',         desc: '2 crepiocas (ovo + tapioca) · queijo flamengo · fiambre de peru',  calFactor: 0.92 },
          { name: 'Arroz + Ovo estrelado + Legumes',  desc: '120g arroz branco · 2 ovos estrelados em azeite · feijão verde',  calFactor: 1.00 },
          { name: 'Queijo cottage + Frutos vermelhos + Mel', desc: '200g queijo cottage · 100g mirtilos ou morangos · 1 c.s. mel', calFactor: 0.90 }
        ]
      },
      {
        time: 'Jantar', hour: '19h30', pct: 0.23,
        opts: [
          { name: 'Massa + Carne moída + Salada',       desc: '150g massa · 200g carne moída magra · molho tomate · salada',           calFactor: 1.03 },
          { name: 'Arroz + Salmão + Batata-doce',       desc: '120g arroz · 200g salmão · 150g batata-doce · brócolos',                calFactor: 1.00 },
          { name: 'Wrap integral + Frango + Legumes',   desc: '2 wraps integrais · 180g frango desfiado · legumes grelhados · hummus', calFactor: 0.97 },
          { name: 'Bife de peru + Batata-doce + Grão',  desc: '200g bife de peru · 150g batata-doce assada · 60g grão temperado',     calFactor: 1.02 },
          { name: 'Ovos + Arroz integral + Legumes',    desc: '3 ovos mexidos · 100g arroz integral · espinafres + cogumelos salteados', calFactor: 0.94 }
        ]
      }
    ],
    maintain: [
      {
        time: 'Pequeno-almoço', hour: '7h', pct: 0.22,
        opts: [
          { name: 'Ovos mexidos + Torradas integrais + Fruta',  desc: '3 ovos · 2 torradas integrais · 1 peça de fruta à escolha',                        calFactor: 0.95 },
          { name: 'Smoothie bowl proteico',                      desc: '1 dose whey · 150ml leite · 1 banana congelada · 30g granola · frutos vermelhos',   calFactor: 1.04 },
          { name: 'Iogurte natural + Aveia + Banana + Canela',   desc: '180g iogurte natural · 50g aveia · 1 banana fatiada · canela a gosto',             calFactor: 0.98 },
          { name: 'Tosta de abacate + Ovo escalfado',            desc: '2 fatias pão integral · 1/2 abacate amassado · 2 ovos escalfados · limão',         calFactor: 1.03 },
          { name: 'Fruta fresca + Sementes + Chá verde',         desc: '1 tigela de melão, kiwi e morangos · 10g sementes mistas · 1 chá verde',           calFactor: 0.80 }
        ]
      },
      {
        time: 'Lanche manhã', hour: '10h', pct: 0.10,
        opts: [
          { name: 'Iogurte + Frutos secos',              desc: '150g iogurte natural · 20g mix de frutos secos (nozes, amêndoas)',  calFactor: 0.96 },
          { name: 'Fruta + Queijo fresco',               desc: '1 pêra ou maçã · 100g queijo fresco magro',                        calFactor: 0.87 },
          { name: 'Barrinha proteica',                   desc: '1 barrinha proteica (min. 15g proteína, max. 200 kcal)',            calFactor: 1.04 },
          { name: 'Cenoura + Pepino + Hummus',           desc: '1 cenoura + 1/2 pepino em palitos · 50g hummus caseiro',           calFactor: 0.82 },
          { name: 'Peça de fruta + Proteína em pó',      desc: '1 banana ou maçã · 1 scoop proteína diluído em 150ml água',        calFactor: 0.90 }
        ]
      },
      {
        time: 'Almoço', hour: '13h', pct: 0.30,
        opts: [
          { name: 'Frango + Arroz integral + Vegetais',   desc: '180g frango grelhado · 100g arroz integral · legumes variados + salada', calFactor: 0.99 },
          { name: 'Sopa de legumes + Omelete + Salada',   desc: 'Sopa caseira · omelete 3 ovos com legumes · salada verde',               calFactor: 0.93 },
          { name: 'Quinoa + Atum + Legumes salteados',    desc: '80g quinoa · 1 lata atum ao natural · espinafres, tomate cherry, pepino', calFactor: 1.02 },
          { name: 'Bife de peru + Batata-doce + Salada',  desc: '180g bife de peru · 120g batata-doce assada · salada de folhas verdes', calFactor: 0.98 },
          { name: 'Lentilhas + Legumes + Arroz',          desc: '120g lentilhas · cenoura + courgette salteados · 70g arroz basmati',     calFactor: 0.95 }
        ]
      },
      {
        time: 'Lanche tarde', hour: '16h', pct: 0.10,
        opts: [
          { name: 'Batido proteico + Fruta',       desc: '1 dose proteína · 200ml água ou leite vegetal · 1 peça de fruta',  calFactor: 0.96 },
          { name: 'Torrada integral + Abacate',    desc: '1 fatia pão integral · 1/4 abacate amassado · sal · limão',        calFactor: 1.09 },
          { name: 'Requeijão + Mel + Nozes',       desc: '150g requeijão · 1 c.c. mel · 10g nozes picadas',                  calFactor: 1.00 },
          { name: 'Ovo cozido + Palitos de cenoura', desc: '2 ovos cozidos · 1 cenoura em palitos · sal e pimenta q.b.',    calFactor: 0.82 },
          { name: 'Frutos vermelhos + Iogurte grego', desc: '100g mirtilos ou morangos · 150g iogurte grego natural',        calFactor: 0.88 }
        ]
      },
      {
        time: 'Jantar', hour: '20h', pct: 0.28,
        opts: [
          { name: 'Peixe grelhado + Legumes + Salada',       desc: '200g peixe branco ou gordo · legumes a vapor · salada verde c/ azeite', calFactor: 0.96 },
          { name: 'Frango no forno + Arroz + Cenoura',       desc: '180g frango · 80g arroz · 100g cenoura assada · azeite',               calFactor: 1.01 },
          { name: 'Sopa creme + Ovo cozido + Pão integral',  desc: 'Sopa creme de legumes · 2 ovos cozidos · 1 fatia pão integral',         calFactor: 0.90 },
          { name: 'Tofu + Legumes no wok + Arroz integral',  desc: '180g tofu firme salteado · brócolos + pimento + cogumelos · 80g arroz', calFactor: 0.93 },
          { name: 'Salmão + Esparguete integral + Brócolos', desc: '180g salmão · 100g esparguete integral · brócolos cozidos · limão',    calFactor: 1.02 }
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
          <div class="meal-time">${slot.time} · ${slot.hour}</div>
        </div>
        <div style="background:rgba(212,175,55,.1); border:1px solid rgba(212,175,55,.35); border-radius:var(--radius-sm); padding:10px 12px; font-size:0.82rem; line-height:1.5; color:var(--text);">
          ⚠️ Todas as opções para esta refeição contêm alergénios registados no teu perfil.<br>
          <span style="color:var(--muted);">Consulta um nutricionista para uma alternativa personalizada.</span>
        </div>
      </div>`;
    }

    // Initialise with day-based seed (once per calcNutrition; cycleMeal just increments the raw counter)
    if (mealSelections[key] === undefined) {
      mealSelections[key] = daySeed + si * 3;
    }
    const idx = ((mealSelections[key] % safeOpts.length) + safeOpts.length) % safeOpts.length;
    const opt = safeOpts[idx];
    const optCal = Math.round(cal * slot.pct * opt.calFactor);

    return `
    <div class="meal-card" id="mealcard_${si}">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <div class="meal-time">${slot.time} · ${slot.hour}</div>
        <div style="font-size:0.75rem; color:var(--orange); font-weight:700;">${optCal} kcal</div>
      </div>
      <div class="meal-name" style="margin-bottom:4px;">${opt.name}</div>
      <div class="meal-cal" style="margin-bottom:10px;">${opt.desc}</div>
      <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid var(--border); padding-top:8px;">
        <button onclick="cycleMeal(${si},-1)" style="background:var(--card);border:1px solid var(--border);color:var(--text);padding:5px 10px;border-radius:var(--radius-sm);cursor:pointer;font-size:0.8rem;">◀</button>
        <div style="font-size:0.75rem; color:var(--muted);">
          ${safeOpts.map((_,i) => `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;margin:0 2px;background:${i===idx ? 'var(--orange)' : 'var(--border)'}"></span>`).join('')}
          <span style="margin-left:6px;">Opção ${idx+1} de ${safeOpts.length}</span>
        </div>
        <button onclick="cycleMeal(${si},1)" style="background:var(--card);border:1px solid var(--border);color:var(--text);padding:5px 10px;border-radius:var(--radius-sm);cursor:pointer;font-size:0.8rem;">▶</button>
      </div>
    </div>`;
  }).join('');
}

function cycleMeal(slotIdx, dir) {
  const key = `meal_${slotIdx}`;
  mealSelections[key] = (mealSelections[key] || 0) + dir;
  const { goal, cal, hp } = _nutState;
  document.getElementById('nut-meals').innerHTML = getMealPlan(goal, cal, 0, hp);
}

function getSupplements(goal, age, hp) {
  hp = hp || { allergies: [], conditions: [], injuries: [] };
  const conditions = hp.conditions || [];

  const isChild   = age && age < 14;
  const isTeen    = age && age >= 14 && age < 18;
  const isElderly = age && age >= 70;

  // Children: no supplements
  if (isChild) {
    return `<div style="background:rgba(212,175,55,.1); border:1.5px solid var(--pink); border-radius:var(--radius-sm); padding:14px 16px; font-size:0.85rem; line-height:1.6; color:var(--text);">
      ⛔ <strong>Criança (${age} anos)</strong><br>
      Nesta faixa etária <strong>não são recomendados suplementos desportivos</strong>. As necessidades devem ser cobertas exclusivamente por alimentação equilibrada e variada.<br><br>
      Consulta um médico pediatra ou nutricionista pediátrico.
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
        <div><div class="supp-name">${s.name}</div><div class="supp-desc">${s.desc}</div><div class="supp-dose">📌 ${s.dose}</div></div>
      </div>`).join('');

    const condWarnings = conditions.length ? `<div style="font-size:0.78rem; color:var(--muted); margin-top:6px;">Condições registadas: ${conditions.map(c => HEALTH_CONDITIONS.find(x=>x.id===c)?.label||c).join(', ')}. Consulta o teu médico antes de iniciar qualquer suplemento.</div>` : '';

    return `<div style="background:rgba(160,132,42,.08); border:1.5px solid var(--cyan); border-radius:var(--radius-sm); padding:12px 14px; margin-bottom:14px; font-size:0.82rem; line-height:1.6; color:var(--text);">
      🧓 <strong>Perfil sénior (${age} anos)</strong> — Plano de suplementação adaptado à 3.ª idade. Evita estimulantes e suplementos de alta intensidade.${condWarnings}
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
    <div style="background:rgba(201,162,39,.08); border:1.5px solid var(--green); border-radius:var(--radius-sm); padding:10px 13px; margin-bottom:12px; font-size:0.8rem; line-height:1.5; color:var(--text);">
      🏥 Condições registadas: <strong>${conditions.map(c => HEALTH_CONDITIONS.find(x=>x.id===c)?.label||c).join(', ')}</strong>. Alguns suplementos foram ajustados. Consulta sempre o teu médico.
    </div>` : '';

  const teenBanner = isTeen ? `
    <div style="background:rgba(255,215,0,.08); border:1.5px solid var(--yellow); border-radius:var(--radius-sm); padding:10px 13px; margin-bottom:12px; font-size:0.8rem; line-height:1.5; color:var(--text);">
      ⚠️ <strong>Adolescente (${age} anos)</strong> — Suplementos assinalados não são recomendados para menores de 18 anos.
    </div>` : '';

  const cards = all.map(s => {
    const blockedTeen = isTeen && adultOnlyNames.has(s.name);
    const blockedCond = condBlocked.has(s.name);
    const blocked = blockedTeen || blockedCond;
    const reason = blockedCond
      ? `Não recomendado para: ${conditions.filter(c => (CONDITION_SUPP_BLOCK[c]||[]).includes(s.name)).map(c => HEALTH_CONDITIONS.find(x=>x.id===c)?.label||c).join(', ')}`
      : 'Não recomendado para menores de 18 anos';
    return `
    <div class="supp-card" style="${blocked ? 'opacity:0.45;' : ''}">
      <div class="supp-icon">${s.icon}</div>
      <div style="flex:1;">
        <div class="supp-name">${s.name}${blocked ? ` <span style="font-size:0.65rem; background:rgba(255,71,87,.2); color:#ff4757; border-radius:20px; padding:1px 7px; font-weight:700; vertical-align:middle;">⚠ Restrito</span>` : ''}</div>
        <div class="supp-desc">${blocked ? `⚠️ ${reason}. Consulta um profissional de saúde.` : s.desc}</div>
        ${!blocked ? `<div class="supp-dose">📌 ${s.dose}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  return teenBanner + condWarnBanner + cards;
}

// ═══════════════════════════════════════════════════════
//  PRESET PLANS
// ═══════════════════════════════════════════════════════

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
  }
];

const DAY_SHORT = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

function renderPresetPlans() {
  const el = document.getElementById('preset-plans-list');
  el.innerHTML = PRESET_PLANS.map(plan => {
    const diffClass = `diff-${plan.difficulty}`;
    const rows = DAY_SHORT.map((d, i) => {
      const muscles = plan.weekly[i] || [];
      return `<div class="preset-day-row">
        <span class="preset-day-name">${d}</span>
        <span class="${muscles.length ? 'preset-day-muscles' : 'preset-day-rest'}">${muscles.length ? muscles.join(', ') : 'Descanso'}</span>
      </div>`;
    }).join('');
    return `
      <div class="preset-card" onclick="showPresetDetail('${plan.id}')">
        <div class="preset-name">${plan.icon} ${plan.name}</div>
        <div class="preset-meta">
          <span class="difficulty-badge ${diffClass}">${plan.diffLabel}</span>
          <span>${plan.days}</span>
        </div>
        <div class="preset-days">${rows}</div>
      </div>`;
  }).join('');
}

function showPresetDetail(planId) {
  const plan = PRESET_PLANS.find(p => p.id === planId);
  if (!plan) return;
  const diffClass = `diff-${plan.difficulty}`;
  const rows = DAY_SHORT.map((d, i) => {
    const muscles = plan.weekly[i] || [];
    return `<div class="preset-day-row" style="padding:10px 0; border-bottom:1px solid var(--border);">
      <span class="preset-day-name" style="width:36px; font-size:0.82rem;">${d}</span>
      <span class="${muscles.length ? 'preset-day-muscles' : 'preset-day-rest'}" style="font-size:0.85rem; flex:1;">${muscles.length ? muscles.join(' · ') : '🛌 Descanso'}</span>
    </div>`;
  }).join('');

  document.getElementById('preset-detail-content').innerHTML = `
    <div style="font-size:1.2rem; font-weight:800; margin-bottom:6px;">${plan.icon} ${plan.name}</div>
    <div style="margin-bottom:10px;">
      <span class="difficulty-badge ${diffClass}">${plan.diffLabel}</span>
      <span style="font-size:0.8rem; color:var(--muted);">${plan.days}</span>
    </div>
    <p style="font-size:0.85rem; color:var(--muted); margin-bottom:16px; line-height:1.5;">${plan.desc}</p>
    <div style="font-size:0.72rem; color:var(--muted); text-transform:uppercase; letter-spacing:.5px; margin-bottom:8px; font-weight:700;">Divisão semanal</div>
    <div style="margin-bottom:20px;">${rows}</div>
    <div style="display:flex; gap:10px;">
      <button class="btn btn-secondary btn-full" onclick="closeModal('modal-preset-detail')">Voltar</button>
      <button class="btn btn-primary btn-full" onclick="applyPresetPlan('${plan.id}')">✔ Aplicar este plano</button>
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
  showToast(`✔ Plano "${plan.name}" aplicado!`);
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

// ═══════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════

(function init() {
  renderProfileScreen();
  const d = getData();
  if (d.activeProfile && d.profiles.find(p => p.id === d.activeProfile)) {
    launchApp();
  }
})();
