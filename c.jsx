import React, { useState, useEffect, useCallback } from "react";
import {
  Package, Calendar, CheckCircle2, LogOut, Lock, ArrowRight, Menu, X as XIcon,
  LayoutDashboard, ShieldCheck, Plus, Trash2, Search, TrendingUp, KeyRound,
} from "lucide-react";

/* ---------------------------------------------------------
   BRAND TOKENS
--------------------------------------------------------- */
const C = {
  navy: "#0B2545",
  blueDeep: "#13315C",
  blueMid: "#2C5F9E",
  sky: "#3E92CC",
  ice: "#EAF2FB",
  white: "#FFFFFF",
  amber: "#E8A33D",
  green: "#2E9E6B",
  red: "#C0455B",
  ink: "#5B7089",
};

const fontDisplay = "'Space Grotesk', sans-serif";
const fontBody = "'Inter', sans-serif";
const fontMono = "'IBM Plex Mono', monospace";

/* Global responsive + accessibility styles (media queries need a real
   <style> tag — inline styles can't express breakpoints or :focus-visible) */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');

    * { box-sizing: border-box; }
    button, input, select, textarea { font-family: inherit; }
    button { cursor: pointer; }
    button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, a:focus-visible {
      outline: 2px solid ${C.sky};
      outline-offset: 2px;
    }
    input:focus, select:focus, textarea:focus {
      border-color: ${C.sky} !important;
    }
    .btn-anim { transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease; }
    .btn-anim:hover { transform: translateY(-1px); }
    .btn-anim:active { transform: translateY(0); }
    .card-hover { transition: box-shadow 0.2s ease, transform 0.2s ease; }
    .card-hover:hover { box-shadow: 0 16px 40px rgba(11,37,69,0.12); transform: translateY(-2px); }

    .nav-desktop { display: flex; }
    .nav-toggle { display: none; }
    .nav-mobile-panel { display: none; }

    .hero-grid { grid-template-columns: 1.1fr 0.9fr; }
    .agency-grid { grid-template-columns: 280px 1fr; }
    .stat-grid { grid-template-columns: repeat(3, 1fr); }

    @media (max-width: 860px) {
      .hero-grid { grid-template-columns: 1fr !important; }
      .hero-h1 { font-size: 34px !important; }
    }
    @media (max-width: 760px) {
      .nav-desktop { display: none !important; }
      .nav-toggle { display: flex !important; }
      .nav-mobile-panel.open { display: flex !important; }
      .agency-grid { grid-template-columns: 1fr !important; }
      .stat-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important; }
    }

    @media (prefers-reduced-motion: reduce) {
      .btn-anim, .card-hover { transition: none !important; }
    }
  `}</style>
);

/* ---------------------------------------------------------
   STORAGE HELPERS  (shared = true -> visible to every visitor
   of this site — this is a shared demo database)
--------------------------------------------------------- */
const safeGet = async (key, shared = true) => {
  try {
    const r = await window.storage.get(key, shared);
    return r ? JSON.parse(r.value) : null;
  } catch {
    return null;
  }
};
const safeSet = async (key, value, shared = true) => {
  try {
    await window.storage.set(key, JSON.stringify(value), shared);
    return true;
  } catch {
    return false;
  }
};

const STATUS_STYLES = {
  livre: { bg: "rgba(46,158,107,0.12)", color: C.green, label: "Livré" },
  cours: { bg: "rgba(217,138,43,0.12)", color: "#D98A2B", label: "En cours" },
  annule: { bg: "rgba(192,69,91,0.12)", color: C.red, label: "Annulé" },
  acceptee: { bg: "rgba(46,158,107,0.12)", color: C.green, label: "Acceptée" },
  attente: { bg: "rgba(217,138,43,0.12)", color: "#D98A2B", label: "En attente" },
  refusee: { bg: "rgba(192,69,91,0.12)", color: C.red, label: "Refusée" },
};

const StatusPill = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES.attente;
  return (
    <span style={{ background: s.bg, color: s.color, fontFamily: fontBody, fontWeight: 600, fontSize: 11, padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
};

const inputStyle = {
  fontFamily: fontBody,
  fontSize: 14,
  padding: "12px 14px",
  borderRadius: 8,
  border: "1px solid #D7E2EE",
  outline: "none",
  color: C.navy,
  width: "100%",
};

/* ---------------------------------------------------------
   SEED DEMO DATA  (now with a demo password per client)
--------------------------------------------------------- */
async function ensureSeed() {
  let index = await safeGet("client-index");
  if (index && index.length) return;

  index = [
    { code: "DEMO-SHOP", name: "S. Amrani", type: "ecommerce" },
    { code: "DEMO-PERSO", name: "Yasmine M.", type: "personnalite" },
  ];
  await safeSet("client-index", index);

  await safeSet("client-record:DEMO-SHOP", {
    profile: { code: "DEMO-SHOP", name: "S. Amrani", type: "ecommerce", password: "1234" },
    orders: [
      { id: "1", date: "2026-06-28", label: "Commande #4821", status: "livre", total: "890 MAD" },
      { id: "2", date: "2026-07-03", label: "Commande #4907", status: "cours", total: "340 MAD" },
      { id: "3", date: "2026-06-29", label: "Commande #4790", status: "annule", total: "150 MAD" },
    ],
    collabs: [],
  });

  await safeSet("client-record:DEMO-PERSO", {
    profile: { code: "DEMO-PERSO", name: "Yasmine M.", type: "personnalite", password: "1234" },
    orders: [],
    collabs: [
      { id: "1", date: "Lun. 10h", label: "Marque Atlas Sport — Partenariat produit, 3 mois", status: "acceptee" },
      { id: "2", date: "Mer. 14h", label: "Salon Horizon Business — Intervention conférence", status: "attente" },
      { id: "3", date: "Ven. 09h", label: "Studio Nova Media — Conflit d'horaire", status: "refusee" },
    ],
  });
}

/* ---------------------------------------------------------
   NAV  (real mobile hamburger menu)
--------------------------------------------------------- */
function Nav({ setPage }) {
  const [open, setOpen] = useState(false);
  const links = [
    { id: "home", label: "Accueil" },
    { id: "services", label: "Services" },
    { id: "temoignages", label: "Témoignages" },
    { id: "contact", label: "Contact" },
  ];
  const go = (id) => {
    setOpen(false);
    setPage("home");
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 30);
  };
  return (
    <div style={{ background: C.navy, position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => go("home")}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.sky}, ${C.blueMid})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LayoutDashboard size={16} color="white" />
          </div>
          <span style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 16, color: "white" }}>
            NOVA<span style={{ color: C.sky }}>GESTION</span>
          </span>
        </div>

        <nav className="nav-desktop" style={{ gap: 26, alignItems: "center" }}>
          {links.map((l) => (
            <button key={l.id} onClick={() => go(l.id)} style={{ background: "none", border: "none", color: "#C7D8EC", fontSize: 14 }}>
              {l.label}
            </button>
          ))}
          <button
            onClick={() => setPage("client")}
            className="btn-anim"
            style={{ background: C.amber, color: C.navy, fontWeight: 700, fontSize: 13.5, padding: "10px 18px", borderRadius: 8, border: "none" }}
          >
            Espace Client
          </button>
        </nav>

        <button
          className="nav-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Ouvrir le menu"
          style={{ background: "none", border: "none", color: "white", alignItems: "center", justifyContent: "center" }}
        >
          {open ? <XIcon size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className={`nav-mobile-panel ${open ? "open" : ""}`} style={{ flexDirection: "column", padding: "0 24px 20px", gap: 4 }}>
        {links.map((l) => (
          <button key={l.id} onClick={() => go(l.id)} style={{ background: "none", border: "none", color: "#C7D8EC", fontSize: 15, textAlign: "left", padding: "10px 0" }}>
            {l.label}
          </button>
        ))}
        <button
          onClick={() => { setOpen(false); setPage("client"); }}
          style={{ background: C.amber, color: C.navy, fontWeight: 700, fontSize: 14, padding: "12px 18px", borderRadius: 8, border: "none", marginTop: 8 }}
        >
          Espace Client
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   HOME PAGE
--------------------------------------------------------- */
function Hero({ setPage }) {
  return (
    <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.blueDeep} 55%, ${C.blueMid} 100%)`, color: "white", position: "relative", overflow: "hidden" }} id="home">
      <div style={{ position: "absolute", right: -100, top: -100, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle at 30% 30%, rgba(62,146,204,0.45), transparent 70%)` }} />
      <div className="hero-grid" style={{ maxWidth: 1120, margin: "0 auto", padding: "56px 24px 80px", position: "relative", zIndex: 2, display: "grid", gap: 40, alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: fontMono, fontSize: 12, letterSpacing: 2.5, color: C.sky, textTransform: "uppercase", marginBottom: 18 }}>
            Gestion à distance, tout compris
          </div>
          <h1 className="hero-h1" style={{ fontFamily: fontDisplay, fontSize: 44, lineHeight: 1.14, fontWeight: 700, margin: "0 0 20px" }}>
            Vos commandes, votre agenda,<br /><span style={{ color: C.sky }}>sous contrôle total.</span>
          </h1>
          <p style={{ fontFamily: fontBody, fontSize: 16, color: "#C7D8EC", maxWidth: 460, lineHeight: 1.6, marginBottom: 30 }}>
            Une équipe professionnelle gère vos commandes, vos réseaux sociaux et vos collaborations —
            avec un suivi accessible à tout moment depuis votre espace client.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button
              onClick={() => { const el = document.getElementById("contact"); el && el.scrollIntoView({ behavior: "smooth" }); }}
              className="btn-anim"
              style={{ background: C.amber, color: C.navy, fontWeight: 700, fontSize: 14, padding: "14px 24px", borderRadius: 9, border: "none", display: "flex", alignItems: "center", gap: 8 }}
            >
              Demander un devis <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setPage("client")}
              className="btn-anim"
              style={{ background: "rgba(255,255,255,0.08)", color: "white", fontWeight: 600, fontSize: 14, padding: "14px 24px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.25)" }}
            >
              Accéder à mon espace
            </button>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 12, padding: "20px 22px", boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 14, color: C.navy }}>Suivi en direct</span>
            <span style={{ fontFamily: fontMono, fontSize: 9.5, color: C.ink }}>DÉMO EN TEMPS RÉEL</span>
          </div>
          {[
            { name: "S. Amrani", sub: "Commande #4821", status: "livre" },
            { name: "K. Haddad", sub: "Commande #4907", status: "cours" },
            { name: "Salon Horizon Business", sub: "Demande de collaboration", status: "attente" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 2px", borderBottom: i < 2 ? "1px solid #F1F5FA" : "none" }}>
              <div>
                <div style={{ fontFamily: fontBody, fontWeight: 600, fontSize: 13, color: C.navy }}>{r.name}</div>
                <div style={{ fontFamily: fontBody, fontSize: 11, color: C.ink }}>{r.sub}</div>
              </div>
              <StatusPill status={r.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ icon, title, items, accent }) {
  return (
    <div className="card-hover" style={{ background: "white", border: `1px solid #E1E9F2`, borderRadius: 14, padding: 28, flex: 1, minWidth: 280 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: C.ice, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: accent }}>
        {icon}
      </div>
      <h3 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 19, color: C.navy, margin: "0 0 12px" }}>{title}</h3>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {items.map((it, i) => (
          <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, fontFamily: fontBody, fontSize: 13.5, color: C.ink, lineHeight: 1.5 }}>
            <CheckCircle2 size={16} color={C.sky} style={{ flexShrink: 0, marginTop: 2 }} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Services() {
  return (
    <div id="services" style={{ maxWidth: 1120, margin: "0 auto", padding: "72px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <div style={{ fontFamily: fontMono, fontSize: 12, letterSpacing: 2.5, color: C.sky, textTransform: "uppercase", marginBottom: 12 }}>Nos services</div>
        <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 32, color: C.navy, margin: 0 }}>Un service, deux mondes.</h2>
      </div>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <ServiceCard
          icon={<Package size={20} />}
          title="E-commerce & boutiques"
          accent={C.blueMid}
          items={[
            "Dossier archive complet : statut, fidélité, historique par client",
            "Classification mensuelle et annuelle de votre activité",
            "Gestion des messages, commentaires et appels sur vos réseaux",
            "Zéro commande perdue, même aux heures de forte affluence",
          ]}
        />
        <ServiceCard
          icon={<Calendar size={20} />}
          title="Personnalités & indépendants"
          accent={C.sky}
          items={[
            "Gestion complète de votre emploi du temps",
            "Acceptation ou refus des collaborations selon vos critères",
            "Communication professionnelle avec vos clients et partenaires",
            "Gestion de vos réseaux sociaux au quotidien",
          ]}
        />
      </div>
    </div>
  );
}

function Testimonials() {
  const items = [
    { initials: "SR", quote: "Depuis qu'on a délégué le suivi des commandes, on ne rate plus aucun client. Un vrai gain de temps chaque semaine.", author: "Sara R., propriétaire d'une boutique en ligne" },
    { initials: "YM", quote: "Mon agenda était ingérable entre les demandes de partenariat et les messages. Maintenant tout est filtré, je ne vois que l'essentiel.", author: "Yasmine M., formatrice indépendante" },
  ];
  return (
    <div id="temoignages" style={{ background: C.ice, padding: "64px 24px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: fontMono, fontSize: 12, letterSpacing: 2.5, color: C.blueMid, textTransform: "uppercase", marginBottom: 12 }}>Ils nous font confiance</div>
          <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 32, color: C.navy, margin: 0 }}>Ce qu'ils en disent</h2>
        </div>
        <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
          {items.map((t, i) => (
            <div key={i} className="card-hover" style={{ background: "white", borderRadius: 12, padding: 24, flex: 1, minWidth: 280 }}>
              <div style={{ color: C.amber, fontSize: 13, marginBottom: 10, letterSpacing: 2 }}>★★★★★</div>
              <p style={{ fontFamily: fontBody, fontStyle: "italic", fontSize: 14, color: C.navy, lineHeight: 1.55, marginBottom: 14 }}>"{t.quote}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${C.sky}, ${C.navy})`, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontDisplay, fontWeight: 700, fontSize: 12 }}>
                  {t.initials}
                </div>
                <span style={{ fontFamily: fontBody, fontSize: 12, color: C.ink }}>{t.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", contact: "", type: "ecommerce", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Votre nom est requis.";
    const c = form.contact.trim();
    const looksLikeEmail = /\S+@\S+\.\S+/.test(c);
    const looksLikePhone = /^[+0-9 .-]{6,}$/.test(c);
    if (!c) e.contact = "Un email ou téléphone est requis.";
    else if (!looksLikeEmail && !looksLikePhone) e.contact = "Entrez un email ou un numéro de téléphone valide.";
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;
    setSending(true);
    const leads = (await safeGet("leads")) || [];
    leads.push({ ...form, id: Date.now().toString(), date: new Date().toISOString() });
    await safeSet("leads", leads);
    setSending(false);
    setSent(true);
    setForm({ name: "", contact: "", type: "ecommerce", message: "" });
    setErrors({});
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 480, margin: "0 auto" }}>
      {sent && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(46,158,107,0.1)", color: C.green, padding: "12px 14px", borderRadius: 8, fontFamily: fontBody, fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>
          <CheckCircle2 size={18} />
          Demande envoyée — nous revenons vers vous sous 24h.
        </div>
      )}
      <div>
        <input
          placeholder="Votre nom"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ ...inputStyle, borderColor: errors.name ? C.red : "#D7E2EE" }}
          aria-invalid={!!errors.name}
        />
        {errors.name && <div style={{ color: C.red, fontSize: 12, marginTop: 4, fontFamily: fontBody }}>{errors.name}</div>}
      </div>
      <div style={{ marginTop: 8 }}>
        <input
          placeholder="Email ou téléphone"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          style={{ ...inputStyle, borderColor: errors.contact ? C.red : "#D7E2EE" }}
          aria-invalid={!!errors.contact}
        />
        {errors.contact && <div style={{ color: C.red, fontSize: 12, marginTop: 4, fontFamily: fontBody }}>{errors.contact}</div>}
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
        style={{ ...inputStyle, resize: "vertical", marginTop: 8 }}
      />
      <button type="submit" disabled={sending} className="btn-anim" style={{ background: C.amber, color: C.navy, fontWeight: 700, fontSize: 14, padding: "14px 20px", borderRadius: 9, border: "none", marginTop: 8 }}>
        {sending ? "Envoi..." : "Demander un devis gratuit"}
      </button>
    </form>
  );
}

function ContactSection() {
  return (
    <div id="contact" style={{ maxWidth: 1120, margin: "0 auto", padding: "72px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontFamily: fontMono, fontSize: 12, letterSpacing: 2.5, color: C.sky, textTransform: "uppercase", marginBottom: 12 }}>Contact</div>
        <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 32, color: C.navy, margin: "0 0 10px" }}>Parlons de votre activité</h2>
        <p style={{ fontFamily: fontBody, fontSize: 14, color: C.ink }}>Réponse sous 24h. Offre de lancement : -20% le premier mois.</p>
      </div>
      <ContactForm />
    </div>
  );
}

function Footer({ setPage }) {
  return (
    <div style={{ background: C.navy, color: "white", padding: "30px 24px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 14 }}>NOVA<span style={{ color: C.sky }}>GESTION</span></span>
        <button onClick={() => setPage("agence")} style={{ background: "none", border: "none", color: "#7C93B0", fontFamily: fontBody, fontSize: 11.5, textDecoration: "underline" }}>
          Accès agence (démo)
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   CLIENT SPACE  (2-factor demo login: code + password)
--------------------------------------------------------- */
function StatCard({ label, value, color }) {
  return (
    <div style={{ background: "white", border: "1px solid #E1E9F2", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
      <div style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: color || C.navy }}>{value}</div>
      <div style={{ fontFamily: fontBody, fontSize: 11, color: C.ink, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function ClientSpace() {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const rec = await safeGet(`client-record:${code.trim().toUpperCase()}`);
    setLoading(false);
    if (!rec) {
      setError("Code client introuvable. Essayez DEMO-SHOP ou DEMO-PERSO.");
      return;
    }
    if (rec.profile.password && rec.profile.password !== password) {
      setError("Mot de passe incorrect.");
      return;
    }
    setClient(rec);
  };

  if (!client) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <form onSubmit={login} style={{ background: "white", border: "1px solid #E1E9F2", borderRadius: 14, padding: 36, width: 380, boxShadow: "0 20px 50px rgba(11,37,69,0.1)" }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: C.ice, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, color: C.blueMid }}>
            <Lock size={20} />
          </div>
          <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: C.navy, margin: "0 0 8px" }}>Espace client</h2>
          <p style={{ fontFamily: fontBody, fontSize: 13, color: C.ink, marginBottom: 20 }}>
            Entrez votre code client et votre mot de passe pour suivre vos commandes ou collaborations.
          </p>
          <label style={{ fontFamily: fontBody, fontSize: 12, color: C.ink, marginBottom: 4, display: "block" }}>Code client</label>
          <input placeholder="Ex : DEMO-SHOP" value={code} onChange={(e) => setCode(e.target.value)} style={{ ...inputStyle, marginBottom: 12, textTransform: "uppercase" }} />
          <label style={{ fontFamily: fontBody, fontSize: 12, color: C.ink, marginBottom: 4, display: "block" }}>Mot de passe</label>
          <input type="password" placeholder="••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ ...inputStyle, marginBottom: 12 }} />
          {error && <div style={{ color: C.red, fontFamily: fontBody, fontSize: 12.5, marginBottom: 12 }}>{error}</div>}
          <button type="submit" disabled={loading} className="btn-anim" style={{ width: "100%", background: C.amber, color: C.navy, fontWeight: 700, fontSize: 14, padding: "13px 20px", borderRadius: 9, border: "none" }}>
            {loading ? "Connexion..." : "Voir mon suivi"}
          </button>
          <div style={{ marginTop: 16, padding: 12, background: C.ice, borderRadius: 8, fontFamily: fontMono, fontSize: 11, color: C.blueDeep, lineHeight: 1.6 }}>
            Démo : <b>DEMO-SHOP</b> ou <b>DEMO-PERSO</b> · mot de passe <b>1234</b>
          </div>
        </form>
      </div>
    );
  }

  const isShop = client.profile.type === "ecommerce";
  const list = isShop ? client.orders : client.collabs;
  const counts = list.reduce((acc, it) => { acc[it.status] = (acc[it.status] || 0) + 1; return acc; }, {});
  const stats = isShop
    ? [
        { label: "Livrées", value: counts.livre || 0, color: C.green },
        { label: "En cours", value: counts.cours || 0, color: "#D98A2B" },
        { label: "Annulées", value: counts.annule || 0, color: C.red },
      ]
    : [
        { label: "Acceptées", value: counts.acceptee || 0, color: C.green },
        { label: "En attente", value: counts.attente || 0, color: "#D98A2B" },
        { label: "Refusées", value: counts.refusee || 0, color: C.red },
      ];

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: fontMono, fontSize: 11, color: C.ink, marginBottom: 4 }}>BIENVENUE</div>
          <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 26, color: C.navy, margin: 0 }}>{client.profile.name}</h2>
        </div>
        <button
          onClick={() => { setClient(null); setCode(""); setPassword(""); }}
          className="btn-anim"
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid #D7E2EE", color: C.ink, fontSize: 13, padding: "9px 14px", borderRadius: 8 }}
        >
          <LogOut size={14} /> Déconnexion
        </button>
      </div>

      <div className="stat-grid" style={{ display: "grid", gap: 12, marginBottom: 20 }}>
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div style={{ background: "white", border: "1px solid #E1E9F2", borderRadius: 12, padding: "20px 22px" }}>
        <div style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: 14 }}>
          {isShop ? "Historique des commandes" : "Demandes de collaboration"}
        </div>
        {list.length === 0 && (
          <div style={{ fontFamily: fontBody, fontSize: 13, color: C.ink, padding: "20px 0", textAlign: "center" }}>Aucune entrée pour le moment.</div>
        )}
        {list.map((item, i) => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 2px", borderBottom: i < list.length - 1 ? "1px solid #F1F5FA" : "none" }}>
            <div>
              <div style={{ fontFamily: fontBody, fontWeight: 600, fontSize: 13.5, color: C.navy }}>{item.label}</div>
              <div style={{ fontFamily: fontMono, fontSize: 11, color: C.ink, marginTop: 2 }}>{item.date}{item.total ? ` · ${item.total}` : ""}</div>
            </div>
            <StatusPill status={item.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   AGENCE (ADMIN) SPACE — demo only, now with search + edit
--------------------------------------------------------- */
const AGENCY_PASSWORD = "agence2026";

function AgencySpace() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [index, setIndex] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [leads, setLeads] = useState([]);
  const [newClient, setNewClient] = useState({ code: "", name: "", type: "ecommerce", password: "" });
  const [newEntry, setNewEntry] = useState({ label: "", date: "", status: "cours", total: "" });

  const refresh = useCallback(async () => {
    setIndex((await safeGet("client-index")) || []);
    setLeads(((await safeGet("leads")) || []).slice().reverse());
  }, []);

  useEffect(() => { if (authed) refresh(); }, [authed, refresh]);

  const openClient = async (code) => {
    const rec = await safeGet(`client-record:${code}`);
    setSelected(rec);
  };

  const addClient = async (e) => {
    e.preventDefault();
    if (!newClient.code || !newClient.name) return;
    const code = newClient.code.trim().toUpperCase();
    const idx = [...index, { code, name: newClient.name, type: newClient.type }];
    await safeSet("client-index", idx);
    await safeSet(`client-record:${code}`, {
      profile: { code, name: newClient.name, type: newClient.type, password: newClient.password || "1234" },
      orders: [],
      collabs: [],
    });
    setNewClient({ code: "", name: "", type: "ecommerce", password: "" });
    refresh();
  };

  const addEntry = async (e) => {
    e.preventDefault();
    if (!selected || !newEntry.label) return;
    const isShop = selected.profile.type === "ecommerce";
    const key = isShop ? "orders" : "collabs";
    const updated = { ...selected, [key]: [...selected[key], { id: Date.now().toString(), ...newEntry }] };
    await safeSet(`client-record:${selected.profile.code}`, updated);
    setSelected(updated);
    setNewEntry({ label: "", date: "", status: isShop ? "cours" : "attente", total: "" });
  };

  const removeEntry = async (id) => {
    const isShop = selected.profile.type === "ecommerce";
    const key = isShop ? "orders" : "collabs";
    const updated = { ...selected, [key]: selected[key].filter((x) => x.id !== id) };
    await safeSet(`client-record:${selected.profile.code}`, updated);
    setSelected(updated);
  };

  const filteredIndex = index.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()));

  if (!authed) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const clean = pwd.trim().toLowerCase();
            if (clean === AGENCY_PASSWORD.toLowerCase()) { setAuthed(true); setPwdError(""); }
            else setPwdError("Mot de passe incorrect. Vérifiez les espaces ou la casse.");
          }}
          style={{ background: "white", border: "1px solid #E1E9F2", borderRadius: 14, padding: 36, width: 360 }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 10, background: C.ice, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, color: C.blueMid }}>
            <ShieldCheck size={20} />
          </div>
          <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 20, color: C.navy, margin: "0 0 8px" }}>Espace agence</h2>
          <p style={{ fontFamily: fontBody, fontSize: 12.5, color: C.ink, marginBottom: 16 }}>
            Accès de démonstration — mot de passe : <b>{AGENCY_PASSWORD}</b>
          </p>
          <div style={{ position: "relative", marginBottom: 8 }}>
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Mot de passe"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              style={{ ...inputStyle, paddingRight: 70 }}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              style={{ position: "absolute", right: 8, top: 8, background: "none", border: "none", color: C.blueMid, fontSize: 11.5, fontFamily: fontBody, fontWeight: 600 }}
            >
              {showPwd ? "Masquer" : "Afficher"}
            </button>
          </div>
          {pwdError && <div style={{ color: C.red, fontSize: 12, marginBottom: 8, fontFamily: fontBody }}>{pwdError}</div>}
          <button type="submit" className="btn-anim" style={{ width: "100%", background: C.navy, color: "white", fontWeight: 700, fontSize: 14, padding: "12px 20px", borderRadius: 9, border: "none" }}>
            Entrer
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="agency-grid" style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 24px", display: "grid", gap: 24 }}>
      <div>
        <h3 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: C.navy, marginBottom: 12 }}>Clients ({filteredIndex.length})</h3>

        <div style={{ position: "relative", marginBottom: 12 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 12, color: C.ink }} />
          <input placeholder="Rechercher un client..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: 30, fontSize: 12.5 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20, maxHeight: 240, overflowY: "auto" }}>
          {filteredIndex.map((c) => (
            <button
              key={c.code}
              onClick={() => openClient(c.code)}
              className="btn-anim"
              style={{ textAlign: "left", background: selected?.profile.code === c.code ? C.ice : "white", border: "1px solid #E1E9F2", borderRadius: 8, padding: "10px 12px" }}
            >
              <div style={{ fontWeight: 600, fontSize: 13, color: C.navy, fontFamily: fontBody }}>{c.name}</div>
              <div style={{ fontSize: 11, color: C.ink, fontFamily: fontMono }}>{c.code}</div>
            </button>
          ))}
          {filteredIndex.length === 0 && <div style={{ fontSize: 12, color: C.ink, fontFamily: fontBody }}>Aucun résultat.</div>}
        </div>

        <h4 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: 8 }}>Ajouter un client</h4>
        <form onSubmit={addClient} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input placeholder="Code (ex: CL-001)" value={newClient.code} onChange={(e) => setNewClient({ ...newClient, code: e.target.value })} style={{ ...inputStyle, fontSize: 12.5 }} />
          <input placeholder="Nom du client" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} style={{ ...inputStyle, fontSize: 12.5 }} />
          <div style={{ position: "relative" }}>
            <KeyRound size={13} style={{ position: "absolute", left: 10, top: 11, color: C.ink }} />
            <input placeholder="Mot de passe (défaut: 1234)" value={newClient.password} onChange={(e) => setNewClient({ ...newClient, password: e.target.value })} style={{ ...inputStyle, fontSize: 12.5, paddingLeft: 30 }} />
          </div>
          <select value={newClient.type} onChange={(e) => setNewClient({ ...newClient, type: e.target.value })} style={{ ...inputStyle, fontSize: 12.5 }}>
            <option value="ecommerce">E-commerce</option>
            <option value="personnalite">Personnalité</option>
          </select>
          <button type="submit" className="btn-anim" style={{ background: C.blueMid, color: "white", fontWeight: 600, fontSize: 12.5, padding: "9px", borderRadius: 7, border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Plus size={14} /> Créer
          </button>
        </form>

        <h4 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 13, color: C.navy, margin: "22px 0 8px" }}>Demandes reçues ({leads.length})</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 240, overflowY: "auto" }}>
          {leads.map((l) => (
            <div key={l.id} style={{ border: "1px solid #E1E9F2", borderRadius: 8, padding: "8px 10px", fontFamily: fontBody }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{l.name}</div>
              <div style={{ fontSize: 11, color: C.ink }}>{l.contact}</div>
              <div style={{ fontSize: 11, color: C.ink, marginTop: 2 }}>{l.message}</div>
            </div>
          ))}
          {leads.length === 0 && <div style={{ fontSize: 12, color: C.ink, fontFamily: fontBody }}>Aucune demande reçue.</div>}
        </div>
      </div>

      <div>
        {!selected ? (
          <div style={{ fontFamily: fontBody, color: C.ink, fontSize: 14 }}>Sélectionnez un client à gauche pour gérer son suivi.</div>
        ) : (
          <div>
            <h3 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 18, color: C.navy, marginBottom: 4 }}>{selected.profile.name}</h3>
            <div style={{ fontFamily: fontMono, fontSize: 11, color: C.ink, marginBottom: 18 }}>
              Code : {selected.profile.code} · {selected.profile.type === "ecommerce" ? "E-commerce" : "Personnalité"} · Mot de passe : {selected.profile.password}
            </div>

            <div style={{ background: "white", border: "1px solid #E1E9F2", borderRadius: 12, padding: 18, marginBottom: 20 }}>
              {(selected.profile.type === "ecommerce" ? selected.orders : selected.collabs).map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 2px", borderBottom: "1px solid #F1F5FA" }}>
                  <div>
                    <div style={{ fontFamily: fontBody, fontWeight: 600, fontSize: 13, color: C.navy }}>{item.label}</div>
                    <div style={{ fontFamily: fontMono, fontSize: 10.5, color: C.ink }}>{item.date}{item.total ? ` · ${item.total}` : ""}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <StatusPill status={item.status} />
                    <button onClick={() => removeEntry(item.id)} style={{ background: "none", border: "none", color: C.red }} aria-label="Supprimer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {(selected.profile.type === "ecommerce" ? selected.orders : selected.collabs).length === 0 && (
                <div style={{ fontFamily: fontBody, fontSize: 13, color: C.ink, textAlign: "center", padding: "16px 0" }}>Aucune entrée.</div>
              )}
            </div>

            <h4 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: 8 }}>
              Ajouter {selected.profile.type === "ecommerce" ? "une commande" : "une collaboration"}
            </h4>
            <form onSubmit={addEntry} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input placeholder="Libellé" value={newEntry.label} onChange={(e) => setNewEntry({ ...newEntry, label: e.target.value })} style={{ ...inputStyle, flex: 2, minWidth: 140, width: "auto" }} />
              <input placeholder="Date" value={newEntry.date} onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })} style={{ ...inputStyle, flex: 1, minWidth: 100, width: "auto" }} />
              {selected.profile.type === "ecommerce" && (
                <input placeholder="Total" value={newEntry.total} onChange={(e) => setNewEntry({ ...newEntry, total: e.target.value })} style={{ ...inputStyle, flex: 1, minWidth: 90, width: "auto" }} />
              )}
              <select value={newEntry.status} onChange={(e) => setNewEntry({ ...newEntry, status: e.target.value })} style={{ ...inputStyle, flex: 1, minWidth: 120, width: "auto" }}>
                {selected.profile.type === "ecommerce" ? (
                  <>
                    <option value="cours">En cours</option>
                    <option value="livre">Livré</option>
                    <option value="annule">Annulé</option>
                  </>
                ) : (
                  <>
                    <option value="attente">En attente</option>
                    <option value="acceptee">Acceptée</option>
                    <option value="refusee">Refusée</option>
                  </>
                )}
              </select>
              <button type="submit" className="btn-anim" style={{ background: C.amber, color: C.navy, fontWeight: 700, fontSize: 13, padding: "10px 16px", borderRadius: 8, border: "none" }}>
                Ajouter
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   APP
--------------------------------------------------------- */
export default function App() {
  const [page, setPage] = useState("home");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ensureSeed().then(() => setReady(true));
  }, []);

  if (!ready) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontBody, color: C.ink }}>Chargement...</div>;
  }

  return (
    <div style={{ fontFamily: fontBody, minHeight: "100vh", background: "white" }}>
      <GlobalStyle />
      <Nav setPage={setPage} />
      {page === "home" && (
        <>
          <Hero setPage={setPage} />
          <Services />
          <Testimonials />
          <ContactSection />
        </>
      )}
      {page === "client" && <ClientSpace />}
      {page === "agence" && <AgencySpace />}
      <Footer setPage={setPage} />
    </div>
  );
}
