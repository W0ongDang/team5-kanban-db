/**
 * Original card artwork, registered in its own pixel coordinate system.
 *
 * Only the surrounding screenshot/white canvas is masked. The photographs,
 * lettering and complete gold outlines remain pixels from the original files.
 * A shared CSS canvas can align their visible heights without stretching them.
 */
export const CARD_ART = Object.freeze({
  taewoong: Object.freeze({
    name: '엄태웅',
    file: './assets/바르샤태웅카드.png',
    width: 1086,
    height: 1448,
    viewBox: '32 0 1022 1448',
    outlinePath: [
      'M 543 0',
      'C 575 27 622 49 663 54',
      'C 682 57 687 48 690 35',
      'C 757 47 848 94 925 104',
      'C 942 143 975 161 1028 166',
      'L 1028 330 L 1052 353 L 1052 1125 L 1028 1150',
      'L 1028 1269',
      'C 989 1299 957 1324 954 1362',
      'C 824 1384 654 1400 543 1448',
      'C 432 1400 262 1384 130 1362',
      'C 129 1324 98 1299 57 1269',
      'L 57 1150 L 33 1125 L 33 353 L 57 329',
      'L 57 166',
      'C 112 160 142 140 158 104',
      'C 237 94 327 47 393 35',
      'C 397 48 401 57 420 54',
      'C 460 49 507 27 543 0 Z',
    ].join(' '),
  }),
  younggwang: Object.freeze({
    name: '김영광',
    file: './assets/첼시영광카드.png',
    width: 1672,
    height: 941,
    viewBox: '596 79 478 702',
    outlinePath: [
      'M 835 80',
      'C 866 92 895 98 930 109',
      'C 961 119 994 125 1026 126',
      'C 1036 140 1048 150 1069 147',
      'L 1074 725',
      'C 1053 737 1039 751 1028 765',
      'C 963 768 887 771 835 780',
      'C 781 771 709 768 640 765',
      'C 629 748 614 734 596 724',
      'L 599 147',
      'C 618 150 633 139 642 126',
      'C 677 124 708 120 738 111',
      'C 772 100 804 93 835 80 Z',
    ].join(' '),
  }),
  yejin: Object.freeze({
    name: '한예진',
    file: './assets/유벤예진카드.png',
    width: 1122,
    height: 1402,
    viewBox: '170 27 782 1213',
    outlinePath: [
      'M 561 27',
      'C 586 49 618 67 647 70',
      'C 663 71 668 65 670 54',
      'C 736 64 798 91 866 111',
      'C 875 141 902 160 950 170',
      'L 951 1110',
      'C 934 1130 923 1151 912 1175',
      'C 881 1185 854 1199 837 1212',
      'C 751 1221 654 1224 561 1239',
      'C 468 1224 371 1221 286 1212',
      'C 263 1196 239 1187 210 1176',
      'C 198 1149 187 1128 171 1111',
      'L 173 170',
      'C 219 161 247 142 254 111',
      'C 322 89 385 65 451 54',
      'C 453 66 459 72 475 70',
      'C 504 67 537 49 561 27 Z',
    ].join(' '),
  }),
});

const SVG_NS = 'http://www.w3.org/2000/svg';
let nextArtworkId = 0;

/** Return an accessible, independently masked copy of an original card. */
export function createCardArt(memberId, { decorative = false } = {}) {
  const artwork = CARD_ART[memberId];
  if (!artwork) throw new RangeError(`Unknown card artwork: ${memberId}`);

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'card-art');
  svg.setAttribute('viewBox', artwork.viewBox);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('focusable', 'false');
  svg.dataset.member = memberId;

  if (decorative) {
    svg.setAttribute('aria-hidden', 'true');
  } else {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', `${artwork.name} 원본 얼굴 카드`);
  }

  const clipId = `original-card-${memberId}-${++nextArtworkId}`;
  const definitions = document.createElementNS(SVG_NS, 'defs');
  const clip = document.createElementNS(SVG_NS, 'clipPath');
  clip.setAttribute('id', clipId);
  clip.setAttribute('clipPathUnits', 'userSpaceOnUse');
  const outline = document.createElementNS(SVG_NS, 'path');
  outline.setAttribute('d', artwork.outlinePath);
  clip.append(outline);
  definitions.append(clip);

  const original = document.createElementNS(SVG_NS, 'image');
  original.setAttribute('href', new URL(artwork.file, import.meta.url).href);
  original.setAttribute('x', '0');
  original.setAttribute('y', '0');
  original.setAttribute('width', String(artwork.width));
  original.setAttribute('height', String(artwork.height));
  original.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  original.setAttribute('clip-path', `url(#${clipId})`);
  svg.append(definitions, original);
  return svg;
}
