const { execSync } = require('child_process');
try {
  console.log('Running npm install...');
  execSync('npm.cmd install framer-motion lucide-react --no-audit --no-fund', { stdio: 'inherit' });
  console.log('Done.');
} catch (e) {
  console.error('Error:', e);
}
