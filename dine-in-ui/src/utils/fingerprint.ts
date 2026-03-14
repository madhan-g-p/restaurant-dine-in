/**
 * Generates a simple SHA-256 fingerprint of the browser environment.
 * Includes user agent, screen resolution, timezone, and language.
 */
// export async function getBrowserFingerprint(): Promise<string> {
//   const raw = [
//     navigator.userAgent,
//     `${screen.width}x${screen.height}`,
//     Intl.DateTimeFormat().resolvedOptions().timeZone,
//     navigator.language,
//   ].join('|');

//   const encoder = new TextEncoder();
//   const data = encoder.encode(raw);
//   const hashBuffer = await crypto.subtle.digest('SHA-256', data);
//   const hashArray = Array.from(new Uint8Array(hashBuffer));
//   const hashHex = hashArray
//     .map((b) => b.toString(16).padStart(2, '0'))
//     .join('');
  
//   return hashHex;
// }

function getCanvasFingerprint(): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return "";

  ctx.textBaseline = "top";
  ctx.font = "14px Arial";
  ctx.fillText("browser-fingerprint", 2, 2);

  return canvas.toDataURL();
}

function getWebGLFingerprint(): string {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl");

  if (!gl) return "";

  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

  if (!debugInfo) return "";

  const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
  const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

  return `${vendor}-${renderer}`;
}
async function getAudioFingerprint(): Promise<string> {
  try {
    const ctx = new OfflineAudioContext(1, 44100, 44100);
    const oscillator = ctx.createOscillator();
    const compressor = ctx.createDynamicsCompressor();

    oscillator.type = "triangle";
    oscillator.frequency.value = 10000;

    oscillator.connect(compressor);
    compressor.connect(ctx.destination);

    oscillator.start(0);

    const buffer = await ctx.startRendering();

    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += Math.abs(buffer.getChannelData(0)[i]);
    }

    return sum.toString();
  } catch {
    return "";
  }
}
export async function getUltraFingerprint(): Promise<string> {
  const canvasFp = getCanvasFingerprint();
  const webglFp = getWebGLFingerprint();
  const audioFp = await getAudioFingerprint();

  const signals = [
    navigator.userAgent,
    navigator.language,
    navigator.languages?.join(","),
    navigator.platform,
    navigator.cookieEnabled,
    navigator.hardwareConcurrency,
    (navigator as any).deviceMemory || "unknown",

    screen.width,
    screen.height,
    screen.availWidth,
    screen.availHeight,
    screen.colorDepth,
    window.devicePixelRatio,

    Intl.DateTimeFormat().resolvedOptions().timeZone,
    new Date().getTimezoneOffset(),

    "ontouchstart" in window,
    navigator.maxTouchPoints,

    canvasFp,
    webglFp,
    audioFp,

    typeof localStorage !== "undefined",
    typeof sessionStorage !== "undefined",
    typeof indexedDB !== "undefined",

    navigator.doNotTrack,

    navigator.vendor,
    navigator.appVersion,
    navigator.appName,
  ];

  const raw = signals.join("|");

  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hash = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export const getBrowserFingerprint = getUltraFingerprint