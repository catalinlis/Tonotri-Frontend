interface MapLibreWindow extends Window {
  maplibregl?: any;
  __tonotriMapLibrePromise?: Promise<any>;
}

export function loadMapLibreFromWeb(): Promise<any> {
  const browserWindow = window as MapLibreWindow;
  if (browserWindow.maplibregl) return Promise.resolve(browserWindow.maplibregl);
  if (browserWindow.__tonotriMapLibrePromise) return browserWindow.__tonotriMapLibrePromise;

  const stylesheetUrl = 'https://unpkg.com/maplibre-gl@5.6.1/dist/maplibre-gl.css';
  if (!document.querySelector(`link[href="${stylesheetUrl}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = stylesheetUrl;
    document.head.appendChild(link);
  }

  browserWindow.__tonotriMapLibrePromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-tonotri-maplibre]');
    if (existing) {
      existing.addEventListener('load', () => resolve(browserWindow.maplibregl));
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/maplibre-gl@5.6.1/dist/maplibre-gl.js';
    script.async = true;
    script.dataset['tonotriMaplibre'] = 'true';
    script.onload = () => resolve(browserWindow.maplibregl);
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return browserWindow.__tonotriMapLibrePromise;
}
