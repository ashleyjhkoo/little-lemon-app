import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollToSection(targetPathname) {
  const ref = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === targetPathname && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location, targetPathname]);

  return ref;
}