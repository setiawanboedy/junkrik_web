// Custom hook to get user role from cookie (client-side only, fallback to undefined if SSR)
import { useEffect, useState } from 'react';

export function useUserCookie() {
  const [role, setRole] = useState<string | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('document.cookie:', document.cookie); // DEBUG
      const matchRole = document.cookie.match(/(?:^|; )role=([^;]*)/);
      const matchToken = document.cookie.match(/(?:^|; )token=([^;]*)/);
      console.log('matchRole:', matchRole ? decodeURIComponent(matchRole[1]) : undefined); // DEBUG
      console.log('matchToken:', matchToken ? decodeURIComponent(matchToken[1]) : undefined); // DEBUG
      setRole(matchRole ? decodeURIComponent(matchRole[1]) : undefined);
      setToken(matchToken ? decodeURIComponent(matchToken[1]) : undefined);
    }
  }, []);
  console.log(role);
  console.log(token);
  
  return { role, token };
}
