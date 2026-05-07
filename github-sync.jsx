/* ===== Sincronización con GitHub =====
   Permite que el Telar guarde cambios de data.json directamente
   en un repositorio de GitHub, sin descargas manuales.

   Configuración guardada en localStorage:
     {
       token: 'ghp_xxx',
       owner: 'usuario',
       repo: 'agenda-territorial',
       branch: 'main',
       path: 'data.json',
       autor: 'Catalina Pérez',
       email: 'cata@correo.com'
     }
*/

const GH_CONFIG_KEY = 'github-sync-config';
const GH_STATUS_EVENT = 'github-sync-status';

window.GitHubSync = {
  cargarConfig() {
    try {
      const raw = localStorage.getItem(GH_CONFIG_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  guardarConfig(cfg) {
    localStorage.setItem(GH_CONFIG_KEY, JSON.stringify(cfg));
  },

  borrarConfig() {
    localStorage.removeItem(GH_CONFIG_KEY);
  },

  estaConfigurado() {
    const c = this.cargarConfig();
    return !!(c && c.token && c.owner && c.repo);
  },

  emitirEstado(estado, mensaje) {
    window.dispatchEvent(new CustomEvent(GH_STATUS_EVENT, {
      detail: { estado, mensaje, ts: Date.now() }
    }));
  },

  async getCurrentSha(cfg) {
    const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(cfg.path)}?ref=${encodeURIComponent(cfg.branch || 'main')}`;
    const r = await fetch(url, {
      headers: {
        'Authorization': `token ${cfg.token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    if (r.status === 404) return null; // archivo no existe aún
    if (!r.ok) {
      const txt = await r.text();
      throw new Error(`GitHub ${r.status}: ${txt.slice(0, 200)}`);
    }
    const j = await r.json();
    return j.sha;
  },

  async commit(cfg, contenido, mensaje) {
    // 1. obtener SHA actual
    const sha = await this.getCurrentSha(cfg);

    // 2. preparar contenido en base64 (UTF-8 safe)
    const utf8 = new TextEncoder().encode(contenido);
    let bin = '';
    for (let i = 0; i < utf8.length; i++) bin += String.fromCharCode(utf8[i]);
    const b64 = btoa(bin);

    // 3. PUT al endpoint de contents
    const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(cfg.path)}`;
    const body = {
      message: mensaje || 'Actualización del Telar',
      content: b64,
      branch: cfg.branch || 'main',
    };
    if (sha) body.sha = sha;
    if (cfg.autor || cfg.email) {
      body.committer = {
        name: cfg.autor || 'Telar',
        email: cfg.email || 'telar@noreply',
      };
    }

    const r = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${cfg.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const txt = await r.text();
      let humano = txt;
      try {
        const j = JSON.parse(txt);
        humano = j.message || txt;
      } catch (e) {}
      throw new Error(`GitHub ${r.status}: ${humano}`);
    }
    return await r.json();
  },

  async probarToken(cfg) {
    // verifica que el token funciona y el repo existe
    const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}`;
    const r = await fetch(url, {
      headers: {
        'Authorization': `token ${cfg.token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    if (!r.ok) {
      const txt = await r.text();
      let humano = txt;
      try {
        humano = JSON.parse(txt).message || txt;
      } catch (e) {}
      if (r.status === 401) throw new Error('Token inválido o expirado.');
      if (r.status === 404) throw new Error('Repositorio no encontrado o el token no tiene acceso.');
      throw new Error(`GitHub ${r.status}: ${humano}`);
    }
    return await r.json();
  },
};

/* ===== Modal de configuración ===== */
function ModalConfigGitHub({ onClose, onGuardado }) {
  const cfg = window.GitHubSync.cargarConfig() || {};
  const [form, setForm] = React.useState({
    token: cfg.token || '',
    owner: cfg.owner || '',
    repo: cfg.repo || '',
    branch: cfg.branch || 'main',
    path: cfg.path || 'data.json',
    autor: cfg.autor || '',
    email: cfg.email || '',
  });
  const [estado, setEstado] = React.useState('idle'); // idle | probando | ok | error
  const [mensaje, setMensaje] = React.useState('');

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const probar = async () => {
    setEstado('probando');
    setMensaje('Verificando token con GitHub…');
    try {
      const repo = await window.GitHubSync.probarToken(form);
      setEstado('ok');
      setMensaje(`✓ Conectado a ${repo.full_name} (rama ${repo.default_branch})`);
    } catch (e) {
      setEstado('error');
      setMensaje(e.message);
    }
  };

  const guardar = () => {
    window.GitHubSync.guardarConfig(form);
    onGuardado?.(form);
    onClose();
  };

  const desconectar = () => {
    if (!confirm('¿Borrar la configuración de GitHub? Tendrás que volver a pegar el token.')) return;
    window.GitHubSync.borrarConfig();
    onGuardado?.(null);
    onClose();
  };

  return (
    <div className="telar-modal-overlay" onClick={onClose}>
      <div className="telar-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <div className="telar-modal-head">
          <div className="eyebrow" style={{ color: 'var(--violeta)' }}>Conexión con GitHub</div>
          <h3 style={{ fontFamily: 'var(--display)', margin: '4px 0 0', fontSize: 24 }}>
            Guardar cambios automáticamente
          </h3>
          <button className="telar-modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        <div className="telar-modal-body">
          <p style={{ marginTop: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--tinta-2)' }}>
            Configura una sola vez y los cambios del Telar se guardarán al instante en el repositorio. ¿Primera vez?
            {' '}
            <a href="guia-github.html" target="_blank" style={{ color: 'var(--violeta)', fontWeight: 600 }}>
              Lee la guía paso a paso →
            </a>
          </p>

          <div className="ed-grupo">
            <label className="ed-label">Token personal de GitHub</label>
            <input
              className="ed-input"
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={form.token}
              onChange={e => update('token', e.target.value.trim())}
            />
            <div className="ed-ayuda">
              Solo se guarda en tu navegador. <a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noopener">Crear uno aquí ↗</a>
            </div>
          </div>

          <div className="ed-fila">
            <div className="ed-grupo">
              <label className="ed-label">Usuario u organización (owner)</label>
              <input
                className="ed-input"
                type="text"
                placeholder="mi-usuario"
                value={form.owner}
                onChange={e => update('owner', e.target.value.trim())}
              />
            </div>
            <div className="ed-grupo">
              <label className="ed-label">Nombre del repositorio</label>
              <input
                className="ed-input"
                type="text"
                placeholder="agenda-territorial"
                value={form.repo}
                onChange={e => update('repo', e.target.value.trim())}
              />
            </div>
          </div>

          <div className="ed-fila">
            <div className="ed-grupo">
              <label className="ed-label">Rama</label>
              <input
                className="ed-input"
                type="text"
                value={form.branch}
                onChange={e => update('branch', e.target.value.trim())}
              />
            </div>
            <div className="ed-grupo">
              <label className="ed-label">Ruta al archivo</label>
              <input
                className="ed-input"
                type="text"
                value={form.path}
                onChange={e => update('path', e.target.value.trim())}
              />
            </div>
          </div>

          <details style={{ marginTop: 8 }}>
            <summary style={{ cursor: 'pointer', fontSize: 13, color: 'var(--tinta-2)' }}>
              Identidad para los commits (opcional)
            </summary>
            <div className="ed-fila" style={{ marginTop: 12 }}>
              <div className="ed-grupo">
                <label className="ed-label">Nombre</label>
                <input
                  className="ed-input"
                  type="text"
                  placeholder="Tu nombre"
                  value={form.autor}
                  onChange={e => update('autor', e.target.value)}
                />
              </div>
              <div className="ed-grupo">
                <label className="ed-label">Email</label>
                <input
                  className="ed-input"
                  type="email"
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                />
              </div>
            </div>
          </details>

          {mensaje && (
            <div
              className="gh-mensaje"
              style={{
                marginTop: 14,
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 13,
                lineHeight: 1.5,
                background: estado === 'ok' ? '#E8F4EC' : estado === 'error' ? '#FBE6E0' : '#F4EFE2',
                border: `1px solid ${estado === 'ok' ? '#8BC9A2' : estado === 'error' ? '#E0A795' : '#D9CFB2'}`,
                color: estado === 'ok' ? '#1F5E36' : estado === 'error' ? '#7A2A14' : '#5D4F2A',
              }}
            >
              {mensaje}
            </div>
          )}
        </div>

        <div className="telar-modal-foot">
          {window.GitHubSync.estaConfigurado() && (
            <button className="btn-fantasma btn-peligro" onClick={desconectar}>
              Desconectar
            </button>
          )}
          <div style={{ flex: 1 }}></div>
          <button className="btn-fantasma" onClick={probar} disabled={!form.token || !form.owner || !form.repo || estado === 'probando'}>
            {estado === 'probando' ? 'Probando…' : 'Probar conexión'}
          </button>
          <button
            className="btn-solido"
            onClick={guardar}
            disabled={!form.token || !form.owner || !form.repo}
            style={{ background: 'var(--violeta)' }}
          >
            Guardar configuración
          </button>
        </div>
      </div>
    </div>
  );
}

window.ModalConfigGitHub = ModalConfigGitHub;

/* ===== Indicador de estado de sincronización ===== */
function GhStatusBadge({ onClick }) {
  const [config, setConfig] = React.useState(() => window.GitHubSync.cargarConfig());
  const [estado, setEstado] = React.useState('idle');
  const [mensaje, setMensaje] = React.useState('');

  React.useEffect(() => {
    const handler = (e) => {
      setEstado(e.detail.estado);
      setMensaje(e.detail.mensaje || '');
      if (e.detail.estado === 'ok') {
        setTimeout(() => setEstado('idle'), 2500);
      }
    };
    window.addEventListener(GH_STATUS_EVENT, handler);
    const refrescar = () => setConfig(window.GitHubSync.cargarConfig());
    window.addEventListener('github-config-changed', refrescar);
    return () => {
      window.removeEventListener(GH_STATUS_EVENT, handler);
      window.removeEventListener('github-config-changed', refrescar);
    };
  }, []);

  if (!config) {
    return (
      <button className="gh-badge gh-badge-off" onClick={onClick} title="GitHub no configurado">
        <span className="gh-dot"></span>
        <span>Configurar GitHub</span>
      </button>
    );
  }

  const labels = {
    idle: { txt: `${config.owner}/${config.repo}`, cls: 'on' },
    guardando: { txt: 'Guardando…', cls: 'sync' },
    ok: { txt: '✓ Guardado en GitHub', cls: 'on' },
    error: { txt: 'Error al guardar', cls: 'err' },
  };
  const l = labels[estado] || labels.idle;

  return (
    <button
      className={`gh-badge gh-badge-${l.cls}`}
      onClick={onClick}
      title={mensaje || `Conectado a ${config.owner}/${config.repo} · clic para configuración`}
    >
      <span className="gh-dot"></span>
      <span>{l.txt}</span>
    </button>
  );
}

window.GhStatusBadge = GhStatusBadge;
