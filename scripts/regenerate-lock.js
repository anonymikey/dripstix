#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const lockFilePath = path.join(projectRoot, 'package-lock.json');

// Check if lock file exists
if (fs.existsSync(lockFilePath)) {
  console.log('Removing existing package-lock.json...');
  fs.unlinkSync(lockFilePath);
}

console.log('Regenerating package-lock.json with npm install...');
try {
  execSync('npm install --legacy-peer-deps', {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  console.log('✓ Successfully regenerated package-lock.json');
} catch (error) {
  console.error('✗ Failed to regenerate lock file:', error.message);
  process.exit(1);
}
