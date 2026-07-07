import React from 'react';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';

function Testimonials() {
  const items = [
    {
      initials: 'SR',
      quote: "Depuis qu'on a délégué le suivi des commandes, on ne rate plus aucun client. Un vrai gain de temps chaque semaine.",
      author: 'Sara R., propriétaire d\'une boutique en ligne'
    },
    {
      initials: 'YM',
      quote: 'Mon agenda était ingérable entre les demandes de partenariat et les messages. Maintenant tout est filtré, je ne vois que l\'essentiel.',
      author: 'Yasmine M., formatrice indépendante'
    },
  ];

  return (
    <div id="temoignages" style={{ background: Colors.ice, padding: '64px 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            fontFamily: Fonts.mono,
            fontSize: 12,
            letterSpacing: 2.5,
            color: Colors.blueMid,
            textTransform: 'uppercase',
            marginBottom: 12
          }}>
            Ils nous font confiance
          </div>
          <h2 style={{
            fontFamily: Fonts.display,
            fontWeight: 700,
            fontSize: 32,
            color: Colors.navy,
            margin: 0
          }}>
            Ce qu'ils en disent
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          {items.map((t, i) => (
            <div key={i} className="card-hover" style={{
              background: 'white',
              borderRadius: 12,
              padding: 24,
              flex: 1,
              minWidth: 280
            }}>
              <div style={{
                color: Colors.amber,
                fontSize: 13,
                marginBottom: 10,
                letterSpacing: 2
              }}>
                ★★★★★
              </div>
              <p style={{
                fontFamily: Fonts.body,
                fontStyle: 'italic',
                fontSize: 14,
                color: Colors.navy,
                lineHeight: 1.55,
                marginBottom: 14
              }}>
                "{t.quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${Colors.sky}, ${Colors.navy})`,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: Fonts.display,
                  fontWeight: 700,
                  fontSize: 12
                }}>
                  {t.initials}
                </div>
                <span style={{
                  fontFamily: Fonts.body,
                  fontSize: 12,
                  color: Colors.ink
                }}>
                  {t.author}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Testimonials;