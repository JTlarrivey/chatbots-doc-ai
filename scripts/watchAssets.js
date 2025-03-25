const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '../assets');
const destination = path.join(__dirname, '../dist/assets');

function copyAssets() {
  if (fs.existsSync(source)) {
    fs.cpSync(source, destination, { recursive: true });
    console.log('📂 Carpeta "assets" copiada a "dist/assets"');
  }
}

// Observar la carpeta "dist"
fs.watch(
  path.join(__dirname, '../dist'),
  { recursive: false },
  (eventType, filename) => {
    if (eventType === 'rename' && filename === 'dist') {
      setTimeout(copyAssets, 500); // Espera un poco para asegurarse de que dist/ se haya recreado
    }
  },
);

// Copiar al inicio
copyAssets();
