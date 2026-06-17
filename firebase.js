// Firebase config
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDv9AO_Hk6qIX4J7AB8AMwC7I5Wg8FwuUs",
  authDomain: "prkh4u.firebaseapp.com",
  projectId: "prkh4u",
  storageBucket: "prkh4u.firebasestorage.app",
  messagingSenderId: "633581057268",
  appId: "1:633581057268:web:8b3210af2615f39c769aa1"
};

firebase.initializeApp(FIREBASE_CONFIG);

const _fbAuth = firebase.auth();
const _fbDb = firebase.firestore();

window.currentUid = null;

// Sync local data to Firestore (fire & forget)
window.fbSyncToCloud = function(data) {
  if (!window.currentUid) return;
  _fbDb.collection('users').doc(window.currentUid)
    .set({ data: JSON.stringify(data) })
    .catch(e => console.warn('[PRKH] sync error:', e));
};

// Auth state — main entry point
_fbAuth.onAuthStateChanged(async (user) => {
  if (user) {
    window.currentUid = user.uid;

    // Load cloud data into localStorage
    try {
      const doc = await _fbDb.collection('users').doc(user.uid).get();
      if (doc.exists && doc.data().data) {
        localStorage.setItem('fitpro_data_' + user.uid, doc.data().data);
      }
    } catch(e) {
      console.warn('[PRKH] load error:', e);
    }

    document.getElementById('auth-overlay').style.display = 'none';

    if (typeof window.initAppAfterAuth === 'function') {
      window.initAppAfterAuth();
    }
  } else {
    window.currentUid = null;
    _showAuthScreen('login');
  }
});

// ── Auth UI ──────────────────────────────────────────────

let _authMode = 'login';

function _showAuthScreen(mode) {
  _authMode = mode || 'login';
  const overlay = document.getElementById('auth-overlay');
  if (overlay) overlay.style.display = 'flex';
  _updateAuthUI();
}

function _updateAuthUI() {
  const btn = document.getElementById('auth-submit-btn');
  const toggle = document.getElementById('auth-toggle-link');
  const title = document.getElementById('auth-title');
  if (btn) btn.textContent = _authMode === 'login' ? 'Entrar' : 'Criar conta';
  if (toggle) toggle.textContent = _authMode === 'login'
    ? 'Ainda não tens conta? Registar'
    : 'Já tens conta? Entrar';
  if (title) title.textContent = _authMode === 'login' ? 'Entrar' : 'Criar conta';
}

window.toggleAuthMode = function() {
  _authMode = _authMode === 'login' ? 'register' : 'login';
  _updateAuthUI();
  document.getElementById('auth-error').textContent = '';
};

window.fbSubmitAuth = async function() {
  const email = document.getElementById('auth-email').value.trim();
  const pass = document.getElementById('auth-pass').value;
  const err = document.getElementById('auth-error');
  const btn = document.getElementById('auth-submit-btn');
  err.textContent = '';

  if (!email || !pass) { err.textContent = 'Preenche todos os campos.'; return; }
  if (_authMode === 'register' && pass.length < 6) {
    err.textContent = 'A password deve ter pelo menos 6 caracteres.';
    return;
  }

  btn.disabled = true;
  btn.textContent = _authMode === 'login' ? 'A entrar...' : 'A criar conta...';

  const MSGS = {
    'auth/user-not-found': 'Email não encontrado.',
    'auth/wrong-password': 'Password incorreta.',
    'auth/invalid-credential': 'Email ou password incorretos.',
    'auth/invalid-email': 'Email inválido.',
    'auth/email-already-in-use': 'Este email já está em uso.',
    'auth/weak-password': 'Password demasiado fraca (mínimo 6 caracteres).',
    'auth/too-many-requests': 'Demasiadas tentativas. Tenta mais tarde.',
  };

  try {
    if (_authMode === 'login') {
      await _fbAuth.signInWithEmailAndPassword(email, pass);
    } else {
      await _fbAuth.createUserWithEmailAndPassword(email, pass);
    }
  } catch(e) {
    err.textContent = MSGS[e.code] || 'Erro: ' + e.message;
    btn.disabled = false;
    btn.textContent = _authMode === 'login' ? 'Entrar' : 'Criar conta';
  }
};

window.fbLogout = async function() {
  await _fbAuth.signOut();
  window.location.reload();
};

// Allow submit on Enter key
document.addEventListener('keydown', function(e) {
  const overlay = document.getElementById('auth-overlay');
  if (e.key === 'Enter' && overlay && overlay.style.display !== 'none') {
    window.fbSubmitAuth();
  }
});
