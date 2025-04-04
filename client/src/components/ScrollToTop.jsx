import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/ScrollToTop.css';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  
  // Show button when user scrolls down 300px
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  
  // Custom smooth scroll to top function with slow start, then accelerating
  const scrollToTop = () => {
    const duration = 1000; // Total duration in milliseconds
    const start = window.pageYOffset;
    const startTime = performance.now();
    
    const animateScroll = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      
      if (elapsedTime > duration) {
        window.scrollTo(0, 0);
        return;
      }
      
      // Use easeInQuad easing function for slow-to-fast effect
      // t: current time, b: start value, c: change in value, d: duration
      const easeInQuad = (t, b, c, d) => {
        t /= d;
        return c * t * t + b;
      };
      
      const scrollY = easeInQuad(elapsedTime, start, -start, duration);
      window.scrollTo(0, scrollY);
      requestAnimationFrame(animateScroll);
    };
    
    requestAnimationFrame(animateScroll);
  };
  
  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  // Scroll to top immediately when route changes (without animation)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return (
    <button 
      className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  );
};

export default ScrollToTop;