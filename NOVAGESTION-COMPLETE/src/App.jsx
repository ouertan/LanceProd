import React, { useState, useEffect } from 'react';
import { Colors } from './constants/colors';
import { Fonts } from './constants/fonts';
import GlobalStyle from './components/GlobalStyle';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import ContactSection from './components/ContactSection';
import ClientSpace from './components/ClientSpace';
import AgencySpace from './components/AgencySpace';
import Footer from './components/Footer';
import { ensureSeed } from './utils/seed';
import './styles/global.css';

export default function App() {
  const [page, setPage] = useState('home');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ensureSeed().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: Fonts.body,
        color: Colors.ink
      }}>
        Chargement...
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: Fonts.body,
      minHeight: '100vh',
      background: 'white'
    }}>
      <GlobalStyle />
      <Nav setPage={setPage} />
      {page === 'home' && (
        <>
          <Hero setPage={setPage} />
          <Services />
          <Testimonials />
          <ContactSection />
        </>
      )}
      {page === 'client' && <ClientSpace />}
      {page === 'agence' && <AgencySpace />}
      <Footer setPage={setPage} />
    </div>
  );
}