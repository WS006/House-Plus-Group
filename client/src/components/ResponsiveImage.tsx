/**
 * Responsive image.
 *
 * Source JPEGs are optimised by tools/optimize-images.mjs into WebP variants at
 * 480/768/1200/1800px. This component wires those into a <picture> so browsers
 * pick the smallest usable file, and always emits intrinsic width/height to
 * reserve layout space (the previous markup had none, causing CLS).
 */

interface ResponsiveImageProps {
  /** Original JPEG path, e.g. /images/hero-solar.jpg */
  src: string;
  alt: string;
  /**
   * Intrinsic aspect ratio of the source file. Used to emit width/height so the
   * browser reserves space before the bytes arrive.
   */
  width: number;
  height: number;
  className?: string;
  /** Above-the-fold art should be eager + high priority. */
  priority?: boolean;
  sizes?: string;
  /** Extra classes applied to the <picture> wrapper. */
  pictureClassName?: string;
}

const WIDTHS = [480, 768, 1200, 1800];

function variants(src: string) {
  const base = src.replace(/\.jpe?g$/i, '');
  return WIDTHS.map((w) => ({ w, url: `${base}-${w}.webp` }));
}

export default function ResponsiveImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  pictureClassName = '',
}: ResponsiveImageProps) {
  const list = variants(src);
  const srcSet = list.map((v) => `${v.url} ${v.w}w`).join(', ');
  const fallback = src.replace(/\.jpe?g$/i, '.webp');

  return (
    <picture className={pictureClassName}>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      <img
        src={fallback}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
      />
    </picture>
  );
}
