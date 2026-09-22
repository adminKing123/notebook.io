export function calculateTypographyScale(availableWidth, charCount) {
  const measurer = document.createElement('span');
  measurer.style.fontFamily = "'Courier New', Courier, monospace";
  measurer.style.fontWeight = '500';
  measurer.style.fontSize = '100px';
  measurer.style.position = 'absolute';
  measurer.style.visibility = 'hidden';
  measurer.style.whiteSpace = 'pre';
  measurer.textContent = 'a'.repeat(charCount);
  document.body.appendChild(measurer);

  const widthAt100px = measurer.clientWidth;
  document.body.removeChild(measurer);

  const fontSize = (availableWidth / widthAt100px) * 100 * 0.995;

  return {
    fontSize,
    lineHeight: fontSize * 1.8,
  };
}
