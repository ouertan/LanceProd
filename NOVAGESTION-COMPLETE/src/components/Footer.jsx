import React from 'react';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';

function Footer({ setPage }) {
  return (
    <div style={{
      background: Colors.navy,
      color: 'white',
      padding: '30px 24px'
    }}>
      <div style={{
        maxWidth: 1120,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <span style={{
          fontFamily: Fonts.display,
          fontWeight: 700,
          fontSize: 14
        }}>
          NOVA<span style={{ color: Colors.sky }}>GESTION</span>
        </span>
        <button onClick={() => setPage('agence')} style={{
          background: 'none',
          border: 'none',
          color: '#7C93B0',
          fontFamily: Fonts.body,
          fontSize: 11.5,
          textDecoration: 'underline'
        }}>
          Accès agence (démo)
        </button>
      </div>
    </div>
  );
}

export default Footer;