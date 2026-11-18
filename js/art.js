/* Иллюстрации-заглушки для товаров (пока нет реальных фото).
   Если у товара задано поле img — показывается фото. */
function productArt(p, colorIdx = 0, view = 0) {
  if (p.img) {
    const src = Array.isArray(p.img) ? (p.img[view] || p.img[0]) : p.img;
    return `<img src="${src}" alt="${p.name}" loading="lazy">`;
  }
  const col = p.colors[colorIdx] || p.colors[0];
  const c = col.c, a = col.a;
  const bgs = ['#f3f3f1', '#ecebe7', '#e9eef0', '#f1ece6'];
  const bg = bgs[view % bgs.length];
  const flip = view % 2 ? 'transform="translate(400 0) scale(-1 1)"' : '';
  const shapes = {
    footwear: `
      <path d="M70 250 C70 205 95 185 120 175 L175 160 C190 120 215 100 240 105 L265 112 C280 150 300 175 340 190 C365 200 335 255 320 262 L95 268 C80 268 70 262 70 250Z" fill="${c}"/>
      <path d="M68 252 L330 252 C328 268 318 278 300 280 L90 282 C76 282 66 270 68 252Z" fill="${a}"/>
      <path d="M72 266 L325 266" stroke="#000" stroke-opacity=".25" stroke-width="3"/>
      <circle cx="232" cy="150" r="10" fill="${a}"/><circle cx="232" cy="150" r="5" fill="#111"/>
      <path d="M185 165 L250 140 M178 182 L258 158 M172 199 L266 176" stroke="${a}" stroke-width="4" stroke-linecap="round" opacity=".85"/>
      <path d="M120 218 C170 205 230 205 300 222" stroke="#fff" stroke-opacity=".35" stroke-width="5" fill="none"/>`,
    jackets: `
      <path d="M150 85 C170 70 230 70 250 85 L320 115 L350 250 L315 258 L298 175 L298 320 L102 320 L102 175 L85 258 L50 250 L80 115 Z" fill="${c}"/>
      <path d="M160 82 C175 50 225 50 240 82 C228 100 172 100 160 82Z" fill="${c}" stroke="#000" stroke-opacity=".15" stroke-width="3"/>
      <path d="M200 92 L200 320" stroke="${a}" stroke-width="5"/>
      <path d="M120 200 L170 200 M230 200 L280 200" stroke="${a}" stroke-width="4" stroke-linecap="round"/>
      <path d="M102 290 L298 290" stroke="#000" stroke-opacity=".15" stroke-width="3"/>
      <path d="M112 130 C140 150 150 150 180 135" stroke="#fff" stroke-opacity=".25" stroke-width="6" fill="none"/>`,
    tops: `
      <path d="M150 80 C175 98 225 98 250 80 L330 115 L350 230 L315 236 L300 165 L300 320 L100 320 L100 165 L85 236 L50 230 L70 115 Z" fill="${c}"/>
      <path d="M150 80 C175 112 225 112 250 80" stroke="${a}" stroke-width="5" fill="none"/>
      <path d="M180 140 L220 140" stroke="${a}" stroke-width="6" stroke-linecap="round"/>
      <path d="M100 300 L300 300" stroke="#000" stroke-opacity=".12" stroke-width="3"/>`,
    pants: `
      <path d="M135 60 L265 60 L280 330 L222 330 L200 140 L178 330 L120 330 Z" fill="${c}"/>
      <path d="M135 60 L265 60 L266 82 L134 82 Z" fill="${a}"/>
      <path d="M150 120 L168 160 M250 120 L232 160" stroke="#000" stroke-opacity=".2" stroke-width="3"/>
      <path d="M125 300 L176 300 M224 300 L276 300" stroke="${a}" stroke-width="4"/>`,
    packs: `
      <rect x="120" y="75" width="160" height="240" rx="40" fill="${c}"/>
      <rect x="140" y="170" width="120" height="110" rx="22" fill="#000" fill-opacity=".14"/>
      <path d="M150 110 C170 92 230 92 250 110" stroke="${a}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M160 150 L240 150" stroke="${a}" stroke-width="5" stroke-linecap="round"/>
      <path d="M120 240 L95 270 M280 240 L305 270" stroke="${c}" stroke-width="12" stroke-linecap="round"/>
      <circle cx="200" cy="225" r="9" fill="${a}"/>`,
    climbing: `
      <path d="M110 120 C110 85 170 75 200 75 C230 75 290 85 290 120 L290 135 C255 125 145 125 110 135 Z" fill="${c}"/>
      <ellipse cx="200" cy="215" rx="100" ry="68" fill="none" stroke="${c}" stroke-width="22"/>
      <path d="M200 140 L200 285" stroke="${a}" stroke-width="10"/>
      <path d="M150 300 C160 330 240 330 250 300" stroke="${c}" stroke-width="14" fill="none" stroke-linecap="round"/>
      <rect x="182" y="190" width="36" height="46" rx="8" fill="${a}"/>`,
    accessories: `
      <path d="M110 230 C110 140 150 100 200 100 C250 100 290 140 290 230 Z" fill="${c}"/>
      <rect x="100" y="222" width="200" height="44" rx="10" fill="${a}"/>
      <circle cx="200" cy="92" r="22" fill="${a}"/>
      <path d="M140 150 L140 220 M170 120 L170 220 M200 112 L200 220 M230 120 L230 220 M260 150 L260 220" stroke="#000" stroke-opacity=".12" stroke-width="5"/>`
  };
  return `<svg viewBox="0 0 400 400" role="img" aria-label="${p.name}">
    <rect width="400" height="400" fill="${bg}"/>
    <ellipse cx="200" cy="345" rx="130" ry="10" fill="#000" opacity=".06"/>
    <g ${flip}>${shapes[p.cat] || shapes.accessories}</g>
    <text x="24" y="380" font-family="Oswald, sans-serif" font-size="13" letter-spacing="3" fill="#000" opacity=".25">KAILAS</text>
  </svg>`;
}
