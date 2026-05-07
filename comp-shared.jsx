/* Componentes compartidos: Avatar, Chip, fechas, glifos */
const { useState, useEffect, useMemo, useRef } = React;

const MESES_CORTO = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
const MESES_LARGO = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const DIAS_CORTO = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB'];
const DIAS_LARGO = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function formatFecha(iso, formato = 'larga') {
  const d = parseISO(iso);
  if (formato === 'larga') {
    return `${DIAS_LARGO[d.getDay()]} ${d.getDate()} de ${MESES_LARGO[d.getMonth()]}`;
  }
  if (formato === 'media') return `${d.getDate()} de ${MESES_LARGO[d.getMonth()]}`;
  return `${MESES_CORTO[d.getMonth()]} ${d.getDate()}`;
}
function diffDias(isoA, isoB) {
  const a = parseISO(isoA), b = parseISO(isoB);
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}
function getMember(id) { return window.AGENDA.TEAM.find(p => p.id === id); }

// Categorize task by responsable color
function tipoToColor(tipo) {
  return {
    reunion: 'azul',
    entrega: 'violeta',
    decision: 'naranja',
    gestion: 'verde',
    encuentro: 'naranja',
  }[tipo] || 'violeta';
}
function tipoLabel(tipo) {
  return {
    reunion: 'Reunión',
    entrega: 'Entrega',
    decision: 'Decisión',
    gestion: 'Gestión',
    encuentro: 'Encuentro',
  }[tipo] || tipo;
}

function Avatar({ id, size = 'md' }) {
  const m = getMember(id);
  if (!m) return null;
  const cls = size === 'lg' ? 'avatar avatar-lg' : size === 'sm' ? 'avatar avatar-sm' : 'avatar';
  return (
    <span className={cls} style={{ background: m.color }} title={m.nombre}>{m.inicial}</span>
  );
}

function AvatarStack({ ids, size = 'sm', max = 6 }) {
  const visible = ids.slice(0, max);
  const extra = ids.length - visible.length;
  return (
    <span className="avatar-stack">
      {visible.map(id => <Avatar key={id} id={id} size={size} />)}
      {extra > 0 && (
        <span
          className={size === 'sm' ? 'avatar avatar-sm' : 'avatar'}
          style={{ background: '#6B5C82' }}
        >+{extra}</span>
      )}
    </span>
  );
}

function DatePill({ iso, color = 'violeta' }) {
  const d = parseISO(iso);
  return (
    <div className={`date-pill ${color}`}>
      <div className="dp-month">{MESES_CORTO[d.getMonth()]}</div>
      <div className="dp-dow">{DIAS_CORTO[d.getDay()]}</div>
      <div className="dp-day">{d.getDate()}</div>
    </div>
  );
}

function SpiralGlyph({ size = 32, color = '#E8C535' }) {
  // Original spiral mark — does NOT recreate Ministerio logo
  return (
    <svg className="spiral-glyph" width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M 20 6
           A 14 14 0 1 1 6 20
           A 11 11 0 1 1 28 20
           A 8 8 0 1 1 14 20
           A 5 5 0 1 1 23 20"
        stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none"
      />
      <circle cx="20" cy="20" r="2" fill={color} />
    </svg>
  );
}

function WeaveGlyph({ size = 36, color = '#D97B3F' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M 4 12 Q 12 4 20 12 T 36 12" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 4 20 Q 12 12 20 20 T 36 20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 4 28 Q 12 20 20 28 T 36 28" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

Object.assign(window, {
  parseISO, formatFecha, diffDias, getMember,
  tipoToColor, tipoLabel,
  Avatar, AvatarStack, DatePill, SpiralGlyph, WeaveGlyph,
  MESES_CORTO, MESES_LARGO, DIAS_CORTO, DIAS_LARGO,
});
