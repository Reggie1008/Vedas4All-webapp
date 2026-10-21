// Bump when the caching rules change, so old caches are cleared on activate.
const VERSION = "v2";
const PAGE_CACHE = `v4a-pages-${VERSION}`;
const ASSET_CACHE = `v4a-assets-${VERSION}`;
const AUDIO_CACHE = "v4a-audio-v1"; // audio is immutable; keep it across versions

const KEEP = [PAGE_CACHE, ASSET_CACHE, AUDIO_CACHE];

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !KEEP.includes(k)).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

const isAudio = (url) => url.pathname.startsWith("/audio/") && url.pathname.endsWith(".mp3");

// Next puts a content hash in these filenames, so a given URL never changes
// meaning. Safe to serve from cache forever.
const isHashedAsset = (url) => url.pathname.startsWith("/_next/static/");

const isPage = (request) =>
  request.mode === "navigate" ||
  (request.headers.get("accept") || "").includes("text/html");

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (isAudio(url)) {
    // Only ever cached once the student has actually played it.
    event.respondWith(
      caches.open(AUDIO_CACHE).then(async (cache) => {
        const hit = await cache.match(request);
        if (hit) return hit;
        const res = await fetch(request);
        if (res.ok) cache.put(request, res.clone());
        return res;
      })
    );
    return;
  }

  if (isHashedAsset(url)) {
    event.respondWith(
      caches.open(ASSET_CACHE).then(async (cache) => {
        const hit = await cache.match(request);
        if (hit) return hit;
        const res = await fetch(request);
        if (res.ok) cache.put(request, res.clone());
        return res;
      })
    );
    return;
  }

  if (isPage(request)) {
    // Network first. A page cached from an earlier deploy still names that
    // deploy's script bundles, and those are gone — serving it would leave a
    // page whose JavaScript 404s, so the cache is only a fallback for being
    // genuinely offline.
    event.respondWith(
      (async () => {
        const cache = await caches.open(PAGE_CACHE);
        try {
          const res = await fetch(request);
          if (res.ok) cache.put(request, res.clone());
          return res;
        } catch {
          const hit = await cache.match(request);
          if (hit) return hit;
          throw new Error("offline and not cached");
        }
      })()
    );
    return;
  }

  // Everything else — artwork, fonts, the manifest. Serve what we have and
  // refresh behind it, so a replaced image corrects itself next visit.
  event.respondWith(
    caches.open(ASSET_CACHE).then(async (cache) => {
      const hit = await cache.match(request);
      const network = fetch(request)
        .then((res) => {
          if (res.ok) cache.put(request, res.clone());
          return res;
        })
        .catch(() => hit);
      return hit || network;
    })
  );
});
