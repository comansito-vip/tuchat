"use client";

import { useEffect } from "react";

// El nick/canal solo hacen falta para el primer render (leen searchParams en
// el server component). Una vez montado el iframe, se limpia la barra de
// direcciones a /webchat con la History API: no dispara navegación ni
// remonta el iframe, a diferencia de router.replace.
export function CleanWebchatUrl() {
  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);
  return null;
}
