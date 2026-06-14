import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protege /admin con autenticación básica HTTP. Credenciales por entorno
// (ADMIN_USER / ADMIN_PASS). Si ADMIN_PASS no está definido, el panel queda
// abierto (cómodo en desarrollo); define la contraseña en el VPS para cerrarlo.
export const config = { matcher: ["/admin", "/admin/:path*"] };

export function middleware(req: NextRequest) {
  const pass = process.env.ADMIN_PASS;
  if (!pass) return NextResponse.next();

  const user = process.env.ADMIN_USER || "admin";
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    try {
      const [u, p] = atob(auth.slice(6)).split(":");
      if (u === user && p === pass) return NextResponse.next();
    } catch {
      /* cabecera malformada → 401 */
    }
  }
  return new NextResponse("Autenticación requerida", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="TuChat Admin"' },
  });
}
