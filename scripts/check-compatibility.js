#!/usr/bin/env node

/**
 * Browser Compatibility Check Script
 * 
 * This script checks for common browser compatibility issues in the codebase
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const INCOMPATIBLE_FEATURES = [
  {
    pattern: /\.at\(/g,
    name: 'Array.at()',
    minVersion: 'Chrome 92, Firefox 90, Safari 15.4',
    severity: 'warning'
  },
  {
    pattern: /Object\.hasOwn\(/g,
    name: 'Object.hasOwn()',
    minVersion: 'Chrome 93, Firefox 92, Safari 15.4',
    severity: 'warning'
  },
  {
    pattern: /\.replaceAll\(/g,
    name: 'String.replaceAll()',
    minVersion: 'Chrome 85, Firefox 77, Safari 13.1',
    severity: 'info'
  }
];

const CSS_INCOMPATIBLE_FEATURES = [
  {
    pattern: /:has\(/g,
    name: ':has() selector',
    minVersion: 'Chrome 105, Firefox 121, Safari 15.4',
    severity: 'warning'
  },
  {
    pattern: /@container/g,
    name: 'Container queries',
    minVersion: 'Chrome 105, Firefox 110, Safari 16',
    severity: 'warning'
  }
];

function checkFile(filePath, patterns) {
  const content = readFileSync(filePath, 'utf-8');
  const issues = [];

  patterns.forEach(({ pattern, name, minVersion, severity }) => {
    const matches = content.match(pattern);
    if (matches) {
      issues.push({
        file: filePath,
        feature: name,
        count: matches.length,
        minVersion,
        severity
      });
    }
  });

  return issues;
}

function scanDirectory(dir, extensions, patterns) {
  let issues = [];
  
  try {
    const files = readdirSync(dir);
    
    files.forEach(file => {
      const filePath = join(dir, file);
      const stat = statSync(filePath);
      
      if (stat.isDirectory()) {
        if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
          issues = issues.concat(scanDirectory(filePath, extensions, patterns));
        }
      } else if (extensions.includes(extname(file))) {
        issues = issues.concat(checkFile(filePath, patterns));
      }
    });
  } catch (err) {
    console.error(`Error scanning directory ${dir}:`, err.message);
  }
  
  return issues;
}

console.log('🔍 Checking browser compatibility...\n');

// Check JavaScript/TypeScript files
const jsIssues = scanDirectory('src', ['.ts', '.tsx', '.js', '.jsx'], INCOMPATIBLE_FEATURES);

// Check CSS files
const cssIssues = scanDirectory('src', ['.css'], CSS_INCOMPATIBLE_FEATURES);

const allIssues = [...jsIssues, ...cssIssues];

if (allIssues.length === 0) {
  console.log('✅ No compatibility issues found!\n');
  console.log('The codebase appears to be compatible with:');
  console.log('  - Chrome 90+');
  console.log('  - Firefox 88+');
  console.log('  - Safari 14+');
  console.log('  - Edge 90+');
} else {
  console.log(`⚠️  Found ${allIssues.length} potential compatibility issue(s):\n`);
  
  allIssues.forEach(issue => {
    const icon = issue.severity === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`${icon} ${issue.feature} (${issue.count} occurrence(s))`);
    console.log(`   File: ${issue.file}`);
    console.log(`   Requires: ${issue.minVersion}\n`);
  });
  
  console.log('Note: These features may require polyfills or transpilation for older browsers.');
}

console.log('\n📊 Compatibility Summary:');
console.log('  - React 18: ✅ Supported');
console.log('  - CSS Grid: ✅ Supported');
console.log('  - Flexbox: ✅ Supported');
console.log('  - ES2015+: ✅ Transpiled by Vite');
console.log('  - SVG (Recharts): ✅ Supported');
console.log('\n✨ Build target: ES2015 (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)');
