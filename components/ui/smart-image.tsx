import Image, { type ImageProps } from "next/image";

/**
 * next/image for admin-supplied sources. Files in /public go through the
 * optimizer; remote URLs are rendered as-is so the optimizer never has to
 * fetch arbitrary third-party hosts. Lazy loading and sizing still apply.
 */
export function SmartImage(props: ImageProps & { src: string }) {
  const local = props.src.startsWith("/") && !props.src.startsWith("//");
  return <Image {...props} unoptimized={!local} alt={props.alt} />;
}
