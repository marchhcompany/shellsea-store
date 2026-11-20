import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import aboutPhoto from "@/assets/about-photo.jpg";
import { BIQUINI_FULL_PRICE, PROMO, applyPromo, isPromoLive } from "@/lib/promo";
import { formatBRL } from "@/data/products";
import { EASE_OUT } from "@/lib/motion";

const SHOW_DELAY_MS = 2000;
/** Versioned per campaign so a future promo shows again to everyone. */
const STORAGE_KEY = "shellsea_promo_popup_20off_dez2026";

function daysLeft(now: Date): number {
  const ms = PROMO.endsAt.getTime() - now.getTime();
  // Whole days left before the final day: on Dec 5 itself this is 0.
  return Math.max(0, Math.floor(ms / 86_400_000));
}

/**
 * Announcement modal for the site-wide biquíni promo. Shown once per browser
 * while the promo is live; closing it or tapping the CTA sets a flag so it
 * never reopens for this campaign.
 */
export function PromoPopup() {
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!isPromoLive()) return;
    try {
      if (window.localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // Storage blocked (private mode) — still show it once per page load.
    }
    setRemaining(daysLeft(new Date()));
    const timer = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  function close() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "seen");
    } catch {
      // ignore
    }
    setOpen(false);
  }

  function goShop() {
    close();
    document.getElementById("vitrine")?.scrollIntoView({ behavior: "smooth" });
  }

  const countdown =
    remaining === null
      ? null
      : remaining === 0
        ? "Último dia!"
        : remaining === 1
          ? "Termina amanhã"
          : `Faltam ${remaining} dias`;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${PROMO.label} em todos os biquínis até ${PROMO.endsLabel}`}
            className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-3xl bg-background shadow-2xl md:grid-cols-2"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Fechar"
              className="absolute top-4 right-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-background text-foreground shadow-md transition-transform hover:scale-105"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative h-44 md:h-auto">
              <img
                src={aboutPhoto}
                alt="Amigas curtindo o mar com biquínis SheLL Sea"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-foreground/45 via-transparent to-transparent" />
              {countdown ? (
                <span className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3 py-1 text-[0.65rem] font-bold tracking-[0.12em] text-foreground uppercase backdrop-blur-sm">
                  {countdown}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col justify-center px-6 py-8 text-center sm:px-10 sm:py-10">
              <p className="text-[0.7rem] font-bold tracking-[0.2em] text-brandblue uppercase">
                Promoção por tempo limitado
              </p>
              <p className="mt-2 font-heading text-6xl leading-none font-extrabold tracking-tight text-hotpink sm:text-7xl">
                20%
                <span className="ml-1 align-top text-2xl tracking-wide sm:text-3xl">OFF</span>
              </p>
              <p className="mt-2 font-heading text-lg font-bold tracking-wide text-foreground uppercase">
                em todos os biquínis
              </p>

              <div className="mx-auto mt-5 flex items-baseline gap-3 rounded-full bg-cream px-5 py-2">
                <span className="text-sm font-semibold text-muted-foreground line-through decoration-hotpink/70">
                  {formatBRL(BIQUINI_FULL_PRICE)}
                </span>
                <span className="text-xl font-extrabold text-hotpink">
                  {formatBRL(applyPromo(BIQUINI_FULL_PRICE))}
                </span>
              </div>

              <p className="mx-auto mt-4 max-w-xs text-sm text-muted-foreground">
                Desconto já aplicado no site, sem cupom. Válido até{" "}
                <strong className="text-foreground">{PROMO.endsLabel}</strong> e ainda em até 3x sem
                juros.
              </p>

              <button
                type="button"
                onClick={goShop}
                className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-bold tracking-[0.05em] text-primary-foreground uppercase transition-colors hover:bg-primary/90"
              >
                Quero o meu
              </button>
              <button
                type="button"
                onClick={close}
                className="mt-3 w-full text-center text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Agora não
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
