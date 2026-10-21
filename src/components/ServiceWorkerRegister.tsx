"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Whether a worker was already in charge when this page loaded. On a
    // first ever visit there is none, and the handover below is not a sign
    // that anything went stale.
    const hadController = Boolean(navigator.serviceWorker.controller);
    let reloaded = false;

    function onControllerChange() {
      // A new worker has taken over a page that an older one served. That
      // page may name script bundles from a previous deploy, so load it
      // again now that the new worker is answering.
      if (!hadController || reloaded) return;
      reloaded = true;
      window.location.reload();
    }

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    navigator.serviceWorker
      // Never answer the worker script itself from the HTTP cache, or a new
      // one can take up to a day to be noticed.
      .register("/sw.js", { updateViaCache: "none" })
      .then((reg) => reg.update())
      .catch(() => {
        // Offline caching is a progressive enhancement — safe to ignore failures.
      });

    return () =>
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
  }, []);

  return null;
}
