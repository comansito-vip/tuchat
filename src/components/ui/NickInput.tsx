"use client";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { saveNick, useSavedNick } from "@/lib/nick-storage";
import { ChatIcon } from "@/components/ui/icons";

type Variant = "default" | "onColor";

export function NickInput({
  canal,
  variant = "default",
  placeholder = "Tu nick...",
  className,
}: {
  canal: string;
  variant?: Variant;
  placeholder?: string;
  className?: string;
}) {
  // Un único nick compartido por todos los NickInput/EnterButton de la
  // página (y entre páginas, vía localStorage): sin useEffect+setState.
  const nick = useSavedNick();
  const router = useRouter();

  const enter = () => {
    const n = nick.trim() || "Invitado";
    router.push(`/webchat?canal=${canal}&nick=${encodeURIComponent(n)}`);
  };

  return (
    <div className={clsx("flex gap-2", className)}>
      <input
        type="text"
        value={nick}
        onChange={(e) => saveNick(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && enter()}
        aria-label={placeholder}
        placeholder={placeholder}
        maxLength={20}
        className={clsx(
          // text-base en móvil: iOS Safari hace zoom (y no lo deshace) al
          // enfocar inputs con fuente menor de 16px. Sin ring propio: usa el
          // :focus-visible global (globals.css) como el resto del sitio.
          "min-h-[44px] min-w-0 flex-1 rounded-xl border px-4 py-2.5 text-base sm:text-sm",
          variant === "onColor"
            ? "border-white/30 bg-white/15 text-white placeholder:text-white/60 backdrop-blur-sm"
            : "border-line bg-card text-ink placeholder:text-muted",
        )}
      />
      <button
        type="button"
        onClick={enter}
        className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl bg-cta px-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-cta-dark active:scale-[.98]"
      >
        <ChatIcon />
        Entrar
      </button>
    </div>
  );
}
