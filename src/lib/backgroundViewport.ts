export interface BackgroundViewport {
  width: number;
  height: number;
  isMobile: boolean;
}

const MOBILE_OVERSCAN = 180;

export function getBackgroundViewport(previous?: BackgroundViewport | null): BackgroundViewport {
  const width = Math.ceil(window.innerWidth);
  const visualHeight = Math.ceil(window.visualViewport?.height ?? window.innerHeight);
  const rawHeight = Math.ceil(Math.max(window.innerHeight, visualHeight));
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const measuredHeight = rawHeight + (isMobile ? MOBILE_OVERSCAN : 0);
  const height = isMobile && previous?.width === width
    ? Math.max(previous.height, measuredHeight)
    : measuredHeight;

  return { width, height, isMobile };
}

export function applyCanvasViewport(
  canvas: HTMLCanvasElement,
  viewport: BackgroundViewport,
  dpr: number,
) {
  canvas.width = Math.floor(viewport.width * dpr);
  canvas.height = Math.floor(viewport.height * dpr);
  canvas.style.width = `${viewport.width}px`;
  canvas.style.height = `${viewport.height}px`;
}
