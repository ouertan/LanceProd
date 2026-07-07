import React from 'react';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';
import ContactForm from './ContactForm';

function ContactSection() {
  return (
    <div id="contact" style={{
      maxWidth: 1120,
      margin: '0 auto',
      padding: '72px 24px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{
          fontFamily: Fonts.mono,
          fontSize: 12,
          letterSpacing: 2.5,
          color: Colors.sky,
          textTransform: 'uppercase',
          marginBottom: 12
        }}>
          Contact
        </div>
        <h2 style={{
          fontFamily: Fonts.display,
          fontWeight: 700,
          fontSize: 32,
          color: Colors.navy,
          margin: '0 0 10px'
        }}>
          Parlons de votre activité
        </h2>
        <p style={{
          fontFamily: Fonts.body,
          fontSize: 14,
          color: Colors.ink
        }}>
          Réponse sous 24h. Offre de lancement : -20% le premier mois.
        </p>
      </div>
      <ContactForm />
    </div>
  );
}

export default ContactSection;