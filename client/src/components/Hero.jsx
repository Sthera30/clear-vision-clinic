import React from 'react'
import '../css/hero.css'
import vid from '../../public/5241181-hd_1920_1080_25fps.mp4'
import { NavLink } from 'react-router-dom';

function Hero() {

    const styles = {
        heroContainer: {
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
        },
        videoBackground: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
        },
        videoContent: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          transform: 'translateX(-50%) translateY(-50%)',
          objectFit: 'cover',
        },
        videoOverlay: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
        },
        heroContent: {
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
        },
        heroTitle: {
          fontSize: '3.5rem',
          fontWeight: 'bold',
          marginBottom: '20px',
          lineHeight: 1.2,
          marginTop: '10rem'
        },
        heroSubtitle: {
          fontSize: '1.2rem',
          marginBottom: '30px',
          opacity: 0.9,
        },
        heroButtons: {
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '40px',
        },
        btn: {
          padding: '12px 25px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
          textTransform: 'uppercase',
        },
        btnPrimary: {
          backgroundColor: '#4a90e2',
          color: 'white',
        },
        btnSecondary: {
          backgroundColor: 'transparent',
          color: 'white',
          border: '2px solid white',
        },
        heroFeatures: {
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          marginTop: '20px',
        },
        featureItem: {
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '1rem',
          opacity: 0.9,
        },
        featureIcon: {
          fontSize: '1.2rem',
          fontWeight: 'bold',
        },
      };


        return (
            <div style={styles.heroContainer}>
              <div style={styles.videoBackground}>
                <video 
                  style={styles.videoContent}
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source 
                    src={vid} 
                    type="video/mp4" 
                  />
                  Your browser does not support the video tag.
                </video>
                <div style={styles.videoOverlay}></div>
              </div>
        
              <div className='hero-content' style={styles.heroContent}>
                <div>
                  <h1 style={styles.heroTitle}>
                    Precision Eye Care & Advanced Diagnostics
                  </h1>
                  <p className='hero-subtitle' style={styles.heroSubtitle}>
                    Comprehensive eye examinations with cutting-edge technology
                    and personalized patient care
                  </p>
                  
                  <div style={styles.heroButtons}>
                    <NavLink to={'/doctors/'} style={{...styles.btn, ...styles.btnPrimary}}>
                      Book Appointment
                    </NavLink>
                  </div>
                </div>
        
                <div style={styles.heroFeatures}>
                  <div style={styles.featureItem}>
                    <span style={{...styles.featureIcon, color: '#2ecc71'}}>✓</span>
                    Advanced Diagnostic Tools
                  </div>
                  <div style={styles.featureItem}>
                    <span style={{...styles.featureIcon, color: '#3498db'}}>✓</span>
                    Comprehensive Eye Health
                  </div>
                  <div style={styles.featureItem}>
                    <span style={{...styles.featureIcon, color: '#9b59b6'}}>✓</span>
                    Flexible Scheduling
                  </div>
                </div>
              </div>
            </div>
        )
    }

export default Hero
