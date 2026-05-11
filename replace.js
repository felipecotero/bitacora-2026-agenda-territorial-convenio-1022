const fs = require('fs');
const files = ['README.md', 'data.json', 'index.html', 'styles.css', 'view-cronograma.jsx', 'view-procesos.jsx', 'view-tablero.jsx', 'view-telar.jsx'];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/Carriles/g, 'Caminos');
  content = content.replace(/carriles/g, 'caminos');
  content = content.replace(/Carril/g, 'Camino');
  content = content.replace(/carril/g, 'camino');
  content = content.replace(/CARRIL/g, 'CAMINO');
  fs.writeFileSync(f, content);
  console.log(`Updated ${f}`);
});
