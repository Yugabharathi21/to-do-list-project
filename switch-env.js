#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mode = process.argv[2];

if (!mode || !['development', 'production'].includes(mode)) {
    console.log('❌ Usage: node switch-env.js [development|production]');
    console.log('');
    console.log('Examples:');
    console.log('  node switch-env.js development');
    console.log('  node switch-env.js production');
    process.exit(1);
}

const sourceFile = path.join(__dirname, `.env.${mode}`);
const targetFile = path.join(__dirname, '.env');

try {
    if (!fs.existsSync(sourceFile)) {
        console.log(`❌ Environment file .env.${mode} not found!`);
        process.exit(1);
    }

    // Copy the environment file
    fs.copyFileSync(sourceFile, targetFile);
    
    console.log(`✅ Successfully switched to ${mode.toUpperCase()} mode`);
    console.log(`📁 Copied .env.${mode} → .env`);
    
    // Show some key values
    const content = fs.readFileSync(targetFile, 'utf8');
    const nodeEnv = content.match(/NODE_ENV=(.+)/)?.[1];
    const apiUrl = content.match(/VITE_API_URL=(.+)/)?.[1];
    const clientUrl = content.match(/CLIENT_URL=(.+)/)?.[1];
    
    console.log('');
    console.log('📋 Current configuration:');
    console.log(`   NODE_ENV: ${nodeEnv}`);
    console.log(`   API URL: ${apiUrl}`);
    console.log(`   CLIENT URL: ${clientUrl}`);
    console.log('');
    console.log('🚀 You can now run your application with the selected environment!');
    
} catch (error) {
    console.log(`❌ Error switching environment: ${error.message}`);
    process.exit(1);
}
