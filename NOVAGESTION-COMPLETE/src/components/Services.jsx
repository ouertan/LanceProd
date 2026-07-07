import React from 'react';
import { Package, Calendar, CheckCircle2 } from 'lucide-react';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';

function ServiceCard({ icon, title, items, accent }) {
  return (
    <div className="card-hover" style={{
      background: 'white',
      border: `1px solid #E1E9F2`,
      borderRadius: 14,
      padding: 28,
      flex: 1,
      minWidth: 280
    }}>
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        background: Colors.ice,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        color: accent
      }}>
        {icon}
      </div>
      <h3 style={{
        fontFamily: Fonts.display,
        fontWeight: 700,
        fontSize: 19,
        color: Colors.navy,
        margin: '0 0 12px'
      }}>
        {title}
      </h3>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {items.map((it, i) => (
          <li key={i} style={{
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
            marginBottom: 10,
            fontFamily: Fonts.body,
            fontSize: 13.5,
            color: Colors.ink,
            lineHeight: 1.5
          }}>
            <CheckCircle2 size={16} color={Colors.sky} style={{ flexShrink: 0, marginTop: 2 }} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Services() {
  return (
    <div id="services" style={{
      maxWidth: 1120,
      margin: '0 auto',
      padding: '72px 24px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 44 }}>
        <div style={{
          fontFamily: Fonts.mono,
          fontSize: 12,
          letterSpacing: 2.5,
          color: Colors.sky,
          textTransform: 'uppercase',
          marginBottom: 12
        }}>
          Nos services
        </div>
        <h2 style={{
          fontFamily: Fonts.display,
          fontWeight: 700,
          fontSize: 32,
          color: Colors.navy,
          margin: 0
        }}>
          Un service, deux mondes.
        </h2>
      </div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <ServiceCard
          icon={<Package size={20} />}
          title="E-commerce & boutiques"
          accent={Colors.blueMid}
          items={[
            'Dossier archive complet : statut, fidélité, historique par client',
            'Classification mensuelle et annuelle de votre activité',
            'Gestion des messages, commentaires et appels sur vos réseaux',
            'Zéro commande perdue, même aux heures de forte affluence',
          ]}
        />
        <ServiceCard
          icon={<Calendar size={20} />}
          title="Personnalités & indépendants"
          accent={Colors.sky}
          items={[
            'Gestion complète de votre emploi du temps',
            'Acceptation ou refus des collaborations selon vos critères',
            'Communication professionnelle avec vos clients et partenaires',
            'Gestion de vos réseaux sociaux au quotidien',
          ]}
        />
      </div>
    </div>
  );
}

export default Services;