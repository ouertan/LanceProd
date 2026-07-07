import React, { useState } from 'react';
import { LogOut, Lock } from 'lucide-react';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';
import StatusPill from './StatusPill';
import { safeGet } from '../utils/storage';

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

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid #E1E9F2',
      borderRadius: 10,
      padding: '14px 16px',
      textAlign: 'center'
    }}>
      <div style={{
        fontFamily: Fonts.display,
        fontWeight: 700,
        fontSize: 22,
        color: color || Colors.navy
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: Fonts.body,
        fontSize: 11,
        color: Colors.ink,
        marginTop: 2
      }}>
        {label}
      </div>
    </div>
  );
}

function ClientSpace() {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const rec = await safeGet(`client-record:${code.trim().toUpperCase()}`);
    setLoading(false);
    if (!rec) {
      setError('Code client introuvable. Essayez DEMO-SHOP ou DEMO-PERSO.');
      return;
    }
    if (rec.profile.password && rec.profile.password !== password) {
      setError('Mot de passe incorrect.');
      return;
    }
    setClient(rec);
  };

  if (!client) {
    return (
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
      }}>
        <form onSubmit={login} style={{
          background: 'white',
          border: '1px solid #E1E9F2',
          borderRadius: 14,
          padding: 36,
          width: 380,
          boxShadow: '0 20px 50px rgba(11,37,69,0.1)'
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: Colors.ice,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18,
            color: Colors.blueMid
          }}>
            <Lock size={20} />
          </div>
          <h2 style={{
            fontFamily: Fonts.display,
            fontWeight: 700,
            fontSize: 22,
            color: Colors.navy,
            margin: '0 0 8px'
          }}>
            Espace client
          </h2>
          <p style={{
            fontFamily: Fonts.body,
            fontSize: 13,
            color: Colors.ink,
            marginBottom: 20
          }}>
            Entrez votre code client et votre mot de passe pour suivre vos commandes ou collaborations.
          </p>
          <label style={{
            fontFamily: Fonts.body,
            fontSize: 12,
            color: Colors.ink,
            marginBottom: 4,
            display: 'block'
          }}>
            Code client
          </label>
          <input placeholder="Ex : DEMO-SHOP" value={code} onChange={(e) => setCode(e.target.value)} style={{
            ...inputStyle,
            marginBottom: 12,
            textTransform: 'uppercase'
          }} />
          <label style={{
            fontFamily: Fonts.body,
            fontSize: 12,
            color: Colors.ink,
            marginBottom: 4,
            display: 'block'
          }}>
            Mot de passe
          </label>
          <input type="password" placeholder="••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{
            ...inputStyle,
            marginBottom: 12
          }} />
          {error && <div style={{
            color: Colors.red,
            fontFamily: Fonts.body,
            fontSize: 12.5,
            marginBottom: 12
          }}>
            {error}
          </div>}
          <button type="submit" disabled={loading} className="btn-anim" style={{
            width: '100%',
            background: Colors.amber,
            color: Colors.navy,
            fontWeight: 700,
            fontSize: 14,
            padding: '13px 20px',
            borderRadius: 9,
            border: 'none'
          }}>
            {loading ? 'Connexion...' : 'Voir mon suivi'}
          </button>
          <div style={{
            marginTop: 16,
            padding: 12,
            background: Colors.ice,
            borderRadius: 8,
            fontFamily: Fonts.mono,
            fontSize: 11,
            color: Colors.blueDeep,
            lineHeight: 1.6
          }}>
            Démo : <b>DEMO-SHOP</b> ou <b>DEMO-PERSO</b> · mot de passe <b>1234</b>
          </div>
        </form>
      </div>
    );
  }

  const isShop = client.profile.type === 'ecommerce';
  const list = isShop ? client.orders : client.collabs;
  const counts = list.reduce((acc, it) => { acc[it.status] = (acc[it.status] || 0) + 1; return acc; }, {});
  const stats = isShop
    ? [
        { label: 'Livrées', value: counts.livre || 0, color: Colors.green },
        { label: 'En cours', value: counts.cours || 0, color: '#D98A2B' },
        { label: 'Annulées', value: counts.annule || 0, color: Colors.red },
      ]
    : [
        { label: 'Acceptées', value: counts.acceptee || 0, color: Colors.green },
        { label: 'En attente', value: counts.attente || 0, color: '#D98A2B' },
        { label: 'Refusées', value: counts.refusee || 0, color: Colors.red },
      ];

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div>
          <div style={{
            fontFamily: Fonts.mono,
            fontSize: 11,
            color: Colors.ink,
            marginBottom: 4
          }}>
            BIENVENUE
          </div>
          <h2 style={{
            fontFamily: Fonts.display,
            fontWeight: 700,
            fontSize: 26,
            color: Colors.navy,
            margin: 0
          }}>
            {client.profile.name}
          </h2>
        </div>
        <button
          onClick={() => { setClient(null); setCode(''); setPassword(''); }}
          className="btn-anim"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: '1px solid #D7E2EE',
            color: Colors.ink,
            fontSize: 13,
            padding: '9px 14px',
            borderRadius: 8
          }}
        >
          <LogOut size={14} /> Déconnexion
        </button>
      </div>

      <div className="stat-grid" style={{
        display: 'grid',
        gap: 12,
        marginBottom: 20
      }}>
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div style={{
        background: 'white',
        border: '1px solid #E1E9F2',
        borderRadius: 12,
        padding: '20px 22px'
      }}>
        <div style={{
          fontFamily: Fonts.display,
          fontWeight: 700,
          fontSize: 14,
          color: Colors.navy,
          marginBottom: 14
        }}>
          {isShop ? 'Historique des commandes' : 'Demandes de collaboration'}
        </div>
        {list.length === 0 && (
          <div style={{
            fontFamily: Fonts.body,
            fontSize: 13,
            color: Colors.ink,
            padding: '20px 0',
            textAlign: 'center'
          }}>
            Aucune entrée pour le moment.
          </div>
        )}
        {list.map((item, i) => (
          <div key={item.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '13px 2px',
            borderBottom: i < list.length - 1 ? '1px solid #F1F5FA' : 'none'
          }}>
            <div>
              <div style={{
                fontFamily: Fonts.body,
                fontWeight: 600,
                fontSize: 13.5,
                color: Colors.navy
              }}>
                {item.label}
              </div>
              <div style={{
                fontFamily: Fonts.mono,
                fontSize: 11,
                color: Colors.ink,
                marginTop: 2
              }}>
                {item.date}{item.total ? ` · ${item.total}` : ''}
              </div>
            </div>
            <StatusPill status={item.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClientSpace;