export const STRIPE_CHECKOUT_PENDING_KEY = "repurposehub:stripe-checkout-pending";
export const STRIPE_CHECKOUT_RELOAD_KEY = "repurposehub:stripe-checkout-reload-once";
export const STRIPE_CHECKOUT_CANCELED_NOTICE_KEY = "repurposehub:stripe-checkout-canceled-notice";

export function getStripeReturnRecoveryScript(): string {
  return `
(() => {
  const pendingKey = ${JSON.stringify(STRIPE_CHECKOUT_PENDING_KEY)};
  const reloadKey = ${JSON.stringify(STRIPE_CHECKOUT_RELOAD_KEY)};
  const canceledNoticeKey = ${JSON.stringify(STRIPE_CHECKOUT_CANCELED_NOTICE_KEY)};
  const debug = location.hostname === "localhost" || location.hostname === "127.0.0.1";

  function log(message, details) {
    if (!debug) return;
    try {
      console.info("[StripeReturnRecovery]", message, details ?? null);
    } catch {}
  }

  function readPendingState() {
    try {
      const raw = sessionStorage.getItem(pendingKey);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") {
        sessionStorage.removeItem(pendingKey);
        return null;
      }

      return parsed;
    } catch {
      try {
        sessionStorage.removeItem(pendingKey);
        sessionStorage.removeItem(reloadKey);
      } catch {}
      return null;
    }
  }

  function clearPendingState() {
    try {
      sessionStorage.removeItem(pendingKey);
      sessionStorage.removeItem(reloadKey);
    } catch {}
  }

  function shouldRecover() {
    const pathname = location.pathname;
    if (!pathname.startsWith("/dashboard")) {
      return null;
    }

    const search = new URLSearchParams(location.search);
    const pendingState = readPendingState();
    const isCanceledReturn = search.get("checkout") === "canceled";

    if (search.get("upgraded") === "true") {
      clearPendingState();
      return null;
    }

    const navigationEntry =
      typeof performance.getEntriesByType === "function"
        ? performance.getEntriesByType("navigation")[0]
        : null;
    const navigationType =
      navigationEntry && "type" in navigationEntry ? navigationEntry.type : null;
    const referrer = document.referrer || "";
    const cameFromStripe = referrer.includes("stripe.com");
    const isHistoryRestore = navigationType === "back_forward";

    if (!isCanceledReturn && !pendingState) {
      return null;
    }

    if (!isCanceledReturn && !cameFromStripe && !isHistoryRestore) {
      return null;
    }

    return {
      cameFromStripe,
      isCanceledReturn,
      isHistoryRestore,
      navigationType,
      pathname,
      pendingState,
    };
  }

  function maybeRecover(reason) {
    const recovery = shouldRecover();
    if (!recovery) return;

    const currentUrl = location.href;
    const targetUrl = recovery.isCanceledReturn
      ? location.origin + location.pathname
      : currentUrl;

    try {
      if (sessionStorage.getItem(reloadKey) === currentUrl) {
        log("recovery already attempted", { reason, currentUrl, targetUrl });
        return;
      }

      if (recovery.isCanceledReturn) {
        sessionStorage.setItem(canceledNoticeKey, "1");
      }

      sessionStorage.setItem(reloadKey, currentUrl);
    } catch {
      return;
    }

    log("reloading after Stripe return", { reason, ...recovery, currentUrl, targetUrl });
    location.replace(targetUrl);
  }

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      maybeRecover("pageshow-persisted");
      return;
    }

    maybeRecover("pageshow");
  });

  if (document.readyState === "complete") {
    maybeRecover("boot-complete");
    return;
  }

  window.addEventListener(
    "load",
    () => {
      maybeRecover("window-load");
    },
    { once: true }
  );
})();
`;
}
