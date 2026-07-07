import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';
import StatusPill from './StatusPill';

function Hero({ setPage }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${Colors.navy} 0%, ${Colors.blueDeep} 55%, ${Colors.blueMid} 100%)`,
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }} id="home">
      <div style={{
        position: 'absolute',
        right: -100,
        top: -100,
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, rgba(62,146,204,0.45), transparent 70%)`
      }} />
      <div className="hero-grid" style={{
        maxWidth: 1120,
        margin: '0 auto',
        padding: '56px 24px 80px',
        position: 'relative',
        zIndex: 2,
        display: 'grid',
        gap: 40,
        alignItems: 'center'
      }}>
        <div>
          <div style={{
            fontFamily: Fonts.mono,
            fontSize: 12,
            letterSpacing: 2.5,
            color: Colors.sky,
            textTransform: 'uppercase',
            marginBottom: 18
          }}>
            Gestion à distance, tout compris
          </div>
          <h1 className="hero-h1" style={{
            fontFamily: Fonts.display,
            fontSize: 44,
            lineHeight: 1.14,
            fontWeight: 700,
            margin: '0 0 20px'
          }}>
            Vos commandes, votre agenda,<br /><span style={{ color: Colors.sky }}>sous contrôle total.</span>
          </h1>
          <p style={{
            fontFamily: Fonts.body,
            fontSize: 16,
            color: '#C7D8EC',
            maxWidth: 460,
            lineHeight: 1.6,
            marginBottom: 30
          }}>
            Une équipe professionnelle gère vos commandes, vos réseaux sociaux et vos collaborations — avec un suivi accessible à tout moment depuis votre espace client.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                const el = document.getElementById('contact');
                el && el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-anim"
              style={{
                background: Colors.amber,
                color: Colors.navy,
                fontWeight: 700,
                fontSize: 14,
                padding: '14px 24px',
                borderRadius: 9,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              Demander un devis <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setPage('client')}
              className="btn-anim"
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: 'white',
                fontWeight: 600,
                fontSize: 14,
                padding: '14px 24px',
                borderRadius: 9,
                border: '1px solid rgba(255,255,255,0.25)'
              }}
            >
              Accéder à mon espace
            </button>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '20px 22px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{
              fontFamily: Fonts.display,
              fontWeight: 700,
              fontSize: 14,
              color: Colors.navy
            }}>
              Suivi en direct
            </span>
            <span style={{
              fontFamily: Fonts.mono,
              fontSize: 9.5,
              color: Colors.ink
            }}>
              DÉMO EN TEMPS RÉEL
            </span>
          </div>
          {[
            { name: 'S. Amrani', sub: 'Commande #4821', status: 'livre' },
            { name: 'K. Haddad', sub: 'Commande #4907', status: 'cours' },
            { name: 'Salon Horizon Business', sub: 'Demande de collaboration', status: 'attente' },
          ].map((r, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '11px 2px',
              borderBottom: i < 2 ? '1px solid #F1F5FA' : 'none'
            }}>
              <div>
                <div style={{
                  fontFamily: Fonts.body,
                  fontWeight: 600,
                  fontSize: 13,
                  color: Colors.navy
                }}>
                  {r.name}
                </div>
                <div style={{
                  fontFamily: Fonts.body,
                  fontSize: 11,
                  color: Colors.ink
                }}>
                  {r.sub}
                </div>
              </div>
              <StatusPill status={r.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hero;