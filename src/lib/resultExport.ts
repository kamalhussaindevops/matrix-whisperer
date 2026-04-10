export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function serializeSvg(svgElement: SVGSVGElement) {
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svgElement);

  if (!source.includes("xmlns=")) {
    source = source.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  return source;
}

export function downloadSvgFile(svgElement: SVGSVGElement, filename: string) {
  const source = serializeSvg(svgElement);
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function shareTextOrCopy(text: string, title = "Destiny Matrix Result") {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return true;
    } catch {
      // fall back to clipboard
    }
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  return false;
}
