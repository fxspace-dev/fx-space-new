const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Load logo as base64
const logoPath = path.join(__dirname, 'img', 'fxspace-logo-horizontal.png');
const logoBase64 = fs.readFileSync(logoPath).toString('base64');

// Generate candlestick shapes for background
function generateCandles() {
  const candles = [];
  const colors = { up: '#22c55e', down: '#ef4444' };
  let price = 300;
  for (let i = 0; i < 40; i++) {
    const x = 30 + i * 29;
    const change = (Math.random() - 0.48) * 60;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * 30;
    const low = Math.min(open, close) - Math.random() * 30;
    const isUp = close > open;
    const color = isUp ? colors.up : colors.down;
    const bodyTop = Math.min(open, close);
    const bodyBottom = Math.max(open, close);
    const bodyHeight = Math.max(bodyBottom - bodyTop, 2);
    // Wick
    candles.push(`<line x1="${x}" y1="${high}" x2="${x}" y2="${low}" stroke="${color}" stroke-width="1.5" opacity="0.5"/>`);
    // Body
    candles.push(`<rect x="${x - 5}" y="${bodyTop}" width="10" height="${bodyHeight}" fill="${color}" opacity="0.5" rx="1"/>`);
    price = close;
  }
  return candles.join('\n    ');
}

const svgWidth = 1200;
const svgHeight = 630;

const svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4338ca"/>
      <stop offset="100%" stop-color="#312e81"/>
    </linearGradient>
    <linearGradient id="glow" x1="0.5" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="#818cf8" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#4338ca" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bg)"/>

  <!-- Subtle glow -->
  <ellipse cx="600" cy="280" rx="500" ry="250" fill="url(#glow)"/>

  <!-- Candlestick chart background -->
  <g transform="translate(0, 50)">
    ${generateCandles()}
  </g>

  <!-- Logo -->
  <image href="data:image/png;base64,${logoBase64}" x="300" y="100" width="600" height="113" opacity="0.95"/>

  <!-- Main heading -->
  <text x="600" y="310" text-anchor="middle" font-family="'Noto Sans JP', 'Hiragino Sans', sans-serif" font-weight="900" font-size="72" fill="white" letter-spacing="4">
    経験ゼロから 最短プロへ
  </text>

  <!-- Underline decoration -->
  <rect x="200" y="325" width="800" height="3" rx="1.5" fill="#facc15" opacity="0.7"/>

  <!-- Subtitle -->
  <text x="600" y="390" text-anchor="middle" font-family="'Noto Sans JP', 'Hiragino Sans', sans-serif" font-weight="500" font-size="30" fill="rgba(255,255,255,0.85)">
    学ぶだけで終わらせない、稼げるトレーダーになる
  </text>

  <!-- Stats bar -->
  <rect x="200" y="430" width="800" height="80" rx="16" fill="rgba(79,70,229,0.5)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>

  <text x="370" y="465" text-anchor="middle" font-family="'Noto Sans JP', sans-serif" font-weight="700" font-size="28" fill="#facc15">100+</text>
  <text x="370" y="495" text-anchor="middle" font-family="'Noto Sans JP', sans-serif" font-weight="400" font-size="14" fill="rgba(255,255,255,0.7)">コンテンツ数</text>

  <text x="600" y="465" text-anchor="middle" font-family="'Noto Sans JP', sans-serif" font-weight="700" font-size="28" fill="#facc15">24/7</text>
  <text x="600" y="495" text-anchor="middle" font-family="'Noto Sans JP', sans-serif" font-weight="400" font-size="14" fill="rgba(255,255,255,0.7)">サポート体制</text>

  <text x="830" y="465" text-anchor="middle" font-family="'Noto Sans JP', sans-serif" font-weight="700" font-size="28" fill="#facc15">90日</text>
  <text x="830" y="495" text-anchor="middle" font-family="'Noto Sans JP', sans-serif" font-weight="400" font-size="14" fill="rgba(255,255,255,0.7)">プロ育成プログラム</text>

  <!-- Bottom accent -->
  <text x="600" y="570" text-anchor="middle" font-family="'Noto Sans JP', sans-serif" font-weight="600" font-size="20" fill="rgba(255,255,255,0.6)">
    FX SPACEを最大限活用しよう
  </text>
</svg>`;

(async () => {
  const outputPath = path.join(__dirname, 'img', 'ogp.png');
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);
  console.log(`OGP image generated: ${outputPath}`);

  // Verify
  const meta = await sharp(outputPath).metadata();
  console.log(`Size: ${meta.width}x${meta.height}, Format: ${meta.format}`);
})();
