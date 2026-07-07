import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';
import { safeGet, safeSet } from '../utils/storage';

const inputStyle = {
  fontFamily: Fonts.body,
  fontSize: 14,
  padding: '12px 14px',
  borderRadius: 8,
  border: '1px solid #D7E2EE',
  outline: 'none',
  color: Colors.navy,
  width: '100%',
};

function ContactForm() {
  const [form, setForm] = useState({ name: '', contact: '', type: 'ecommerce', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Votre nom est requis.';
    const c = form.contact.trim();
    const looksLikeEmail = /\S+@\S+\.\S+/.test(c);
    const looksLikePhone = /^[+0-9 .-]{6,}$/.test(c);
    if (!c) e.contact = 'Un email ou téléphone est requis.';
    else if (!looksLikeEmail && !looksLikePhone) e.contact = 'Entrez un email ou un numéro de téléphone valide.';
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;
    setSending(true);
    const leads = (await safeGet('leads')) || [];
    leads.push({ ...form, id: Date.now().toString(), date: new Date().toISOString() });
    await safeSet('leads', leads);
    setSending(false);
    setSent(true);
    setForm({ name: '', contact: '', type: 'ecommerce', message: '' });
    setErrors({});
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <form onSubmit={submit} noValidate style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      maxWidth: 480,
      margin: '0 auto'
    }}>
      {sent && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(46,158,107,0.1)',
          color: Colors.green,
          padding: '12px 14px',
          borderRadius: 8,
          fontFamily: Fonts.body,
          fontSize: 13.5,
          fontWeight: 600,
          marginBottom: 6
        }}>
          <CheckCircle2 size={18} />
          Demande envoyée — nous revenons vers vous sous 24h.
        </div>
      )}
      <div>
        <input
          placeholder="Votre nom"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ ...inputStyle, borderColor: errors.name ? Colors.red : '#D7E2EE' }}
          aria-invalid={!!errors.name}
        />
        {errors.name && <div style={{ color: Colors.red, fontSize: 12, marginTop: 4, fontFamily: Fonts.body }}>{errors.name}</div>}
      </div>
      <div style={{ marginTop: 8 }}>
        <input
          placeholder="Email ou téléphone"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          style={{ ...inputStyle, borderColor: errors.contact ? Colors.red : '#D7E2EE' }}
          aria-invalid={!!errors.contact}
        />
        {errors.contact && <div style={{ color: Colors.red, fontSize: 12, marginTop: 4, fontFamily: Fonts.body }}>{errors.contact}</div>}
      </div>
      <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ ...inputStyle, marginTop: 8 }}>
        <option value="ecommerce">Je gère un e-commerce / boutique</option>
        <option value="personnalite">Je suis indépendant(e) / personnalité</option>
      </select>
      <textarea
        placeholder="Décrivez votre besoin"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        rows={4}
        style={{ ...inputStyle, resize: 'vertical', marginTop: 8 }}
      />
      <button type="submit" disabled={sending} className="btn-anim" style={{
        background: Colors.amber,
        color: Colors.navy,
        fontWeight: 700,
        fontSize: 14,
        padding: '14px 20px',
        borderRadius: 9,
        border: 'none',
        marginTop: 8
      }}>
        {sending ? 'Envoi...' : 'Demander un devis gratuit'}
      </button>
    </form>
  );
}

export default ContactForm;