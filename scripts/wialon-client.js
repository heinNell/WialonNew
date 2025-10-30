#!/usr/bin/env node
/**
 * Secure Wialon API Client - Fixed Version
 * Handles session management properly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Wialon error codes
const ERROR_CODES = {
  0: 'Success',
  1: 'Invalid session',
  2: 'Invalid service',
  3: 'Invalid result',
  4: 'Invalid input',
  5: 'Error performing request',
  6: 'Unknown error',
  7: 'Access denied',
  8: 'Invalid user name or password',
  9: 'Authorization server is unavailable',
  1001: 'No messages for selected interval',
  1002: 'Item with such unique property already exists',
  1003: 'Only one request is allowed at the moment',
  1004: 'Limit of concurrent requests exceeded',
  1005: 'Execution time exceeded',
  1006: 'Unexpected error',
  1011: 'Your IP has been blocked'
};

// Validate environment variables
const requiredEnvVars = ['WIALON_TOKEN', 'WIALON_API_URL'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    console.error(`   Please add it to your .env file`);
    process.exit(1);
  }
}

// API Configuration
const API_URL = process.env.WIALON_API_URL;
const TOKEN = process.env.WIALON_TOKEN;
let SESSION_ID = process.env.WIALON_SESSION_ID || null;

// Helper function to make API calls
async function callWialonAPI(service, params = {}, useSid = false) {
  const body = new URLSearchParams({
    svc: service,
    params: JSON.stringify(params)
  });

  if (useSid && SESSION_ID) {
    body.append('sid', SESSION_ID);
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    const data = await response.json();

    if (data.error) {
      const errorMsg = ERROR_CODES[data.error] || 'Unknown error';
      throw new Error(`Wialon API Error ${data.error}: ${errorMsg}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// API Methods
async function login() {
  console.log('🔐 Logging in to Wialon...\n');

  try {
    const data = await callWialonAPI('token/login', { token: TOKEN });

    SESSION_ID = data.eid;
    
    console.log('✅ Login successful!\n');
    console.log(`📋 Account: ${data.au}`);
    console.log(`👤 User ID: ${data.user.id}`);
    console.log(`🏢 Account ID: ${data.user.bact}`);
    console.log(`🌍 Base URL: ${data.base_url}`);
    console.log(`\n💡 Session ID: ${SESSION_ID}`);
    console.log(`   Add this to your .env file as:\n   WIALON_SESSION_ID=${SESSION_ID}\n`);

    // Update .env file automatically
    updateEnvFile('WIALON_SESSION_ID', SESSION_ID);

    return data;
  } catch (error) {
    console.error(`❌ Login failed: ${error.message}`);
    process.exit(1);
  }
}

async function searchUnits() {
  console.log('🔍 Searching for units...\n');

  if (!SESSION_ID) {
    console.error('❌ No active session. Please run: npm run wialon:login');
    process.exit(1);
  }

  try {
    const params = {
      spec: {
        itemsType: 'avl_unit',
        propName: 'sys_name',
        propValueMask: '*',
        sortType: 'sys_name'
      },
      force: 1,
      flags: 1,
      from: 0,
      to: 0
    };

    const data = await callWialonAPI('core/search_items', params, true);

    const items = data.items || [];
    console.log(`✅ Found ${items.length} units\n`);

    items.slice(0, 10).forEach((unit, index) => {
      console.log(`${index + 1}. ${unit.nm} (ID: ${unit.id})`);
      
      if (unit.pos) {
        console.log(`   📍 Lat: ${unit.pos.y.toFixed(4)}, Lon: ${unit.pos.x.toFixed(4)}`);
        console.log(`   🚗 Speed: ${unit.pos.s || 0} km/h`);
      } else {
        console.log(`   ⚠️  No position data`);
      }
      console.log('');
    });

    if (items.length > 10) {
      console.log(`... and ${items.length - 10} more units\n`);
    }

    return data;
  } catch (error) {
    if (error.message.includes('Error 1')) {
      console.error('❌ Session expired. Please run: npm run wialon:login');
    } else {
      console.error(`❌ Search failed: ${error.message}`);
    }
    process.exit(1);
  }
}

async function getAccountInfo() {
  console.log('📊 Getting account information...\n');

  if (!SESSION_ID) {
    console.error('❌ No active session. Please run: npm run wialon:login');
    process.exit(1);
  }

  try {
    const data = await callWialonAPI('core/get_account_data', {}, true);

    console.log('✅ Account Information:\n');
    console.log(JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error(`❌ Failed to get account info: ${error.message}`);
    process.exit(1);
  }
}

async function logout() {
  console.log('👋 Logging out...\n');

  if (!SESSION_ID) {
    console.log('⚠️  No active session to logout from');
    return;
  }

  try {
    await callWialonAPI('core/logout', {}, true);
    
    console.log('✅ Logged out successfully');
    
    // Clear session from .env
    updateEnvFile('WIALON_SESSION_ID', '');
    SESSION_ID = null;

  } catch (error) {
    console.error(`❌ Logout failed: ${error.message}`);
    // Clear session anyway
    updateEnvFile('WIALON_SESSION_ID', '');
    SESSION_ID = null;
  }
}

async function checkSession() {
  console.log('🔍 Checking session status...\n');

  if (!SESSION_ID) {
    console.log('❌ No session ID found in .env file');
    console.log('   Run: npm run wialon:login\n');
    return false;
  }

  try {
    const data = await callWialonAPI('core/duplicate', {}, true);
    
    console.log('✅ Session is valid');
    console.log(`   Session ID: ${SESSION_ID}`);
    console.log(`   New Session ID: ${data.eid}\n`);
    
    return true;
  } catch (error) {
    console.log('❌ Session is invalid or expired');
    console.log('   Run: npm run wialon:login\n');
    return false;
  }
}

// Helper: Update .env file
function updateEnvFile(key, value) {
  const envPath = path.join(__dirname, '..', '.env');
  
  try {
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    const lines = envContent.split('\n');
    let found = false;

    const newLines = lines.map(line => {
      if (line.startsWith(`${key}=`)) {
        found = true;
        return `${key}=${value}`;
      }
      return line;
    });

    if (!found) {
      newLines.push(`${key}=${value}`);
    }

    fs.writeFileSync(envPath, newLines.join('\n'), 'utf-8');
  } catch (error) {
    console.warn(`⚠️  Could not update .env file: ${error.message}`);
  }
}

// Generate documentation
async function generateDocs() {
  console.log('📝 Generating API documentation...\n');

  const apiExamples = {
    "01_token_login": {
      description: "Login with token",
      service: "token/login",
      params: { token: "${WIALON_TOKEN}" }
    },
    "02_search_units": {
      description: "Search all units",
      service: "core/search_items",
      params: {
        spec: {
          itemsType: "avl_unit",
          propName: "sys_name",
          propValueMask: "*",
          sortType: "sys_name"
        },
        force: 1,
        flags: 1,
        from: 0,
        to: 0
      },
      needsSession: true
    },
    "03_get_unit_data": {
      description: "Get unit details",
      service: "core/search_item",
      params: {
        id: "UNIT_ID",
        flags: 1
      },
      needsSession: true
    },
    "04_get_messages": {
      description: "Get unit messages",
      service: "messages/load_interval",
      params: {
        itemId: "UNIT_ID",
        timeFrom: Math.floor(Date.now() / 1000) - 86400,
        timeTo: Math.floor(Date.now() / 1000),
        flags: 0,
        flagsMask: 0,
        loadCount: 100
      },
      needsSession: true
    },
    "05_logout": {
      description: "Logout",
      service: "core/logout",
      params: {},
      needsSession: true
    }
  };

  let markdown = `# Wialon API Examples\n\n`;
  markdown += `Generated: ${new Date().toISOString()}\n\n`;
  markdown += `## Quick Start\n\n`;
  markdown += `1. Login: \`npm run wialon:login\`\n`;
  markdown += `2. Search: \`npm run wialon:search\`\n`;
  markdown += `3. Logout: \`npm run wialon:logout\`\n\n`;
  markdown += `## Available Commands\n\n`;

  for (const [key, example] of Object.entries(apiExamples)) {
    markdown += `### ${key}: ${example.description}\n\n`;
    markdown += `**Service:** \`${example.service}\`\n\n`;
    markdown += `**Needs Session:** ${example.needsSession ? 'Yes' : 'No'}\n\n`;
    markdown += `**Parameters:**\n\`\`\`json\n${JSON.stringify(example.params, null, 2)}\n\`\`\`\n\n`;
    
    const body = new URLSearchParams({
      svc: example.service,
      params: JSON.stringify(example.params)
    });
    
    if (example.needsSession) {
      body.append('sid', '${WIALON_SESSION_ID}');
    }
    
    markdown += `**cURL Example:**\n\`\`\`bash\n`;
    markdown += `curl -X POST '${API_URL}' \\\n`;
    markdown += `  -H 'Content-Type: application/x-www-form-urlencoded' \\\n`;
    markdown += `  --data '${body.toString()}'\n`;
    markdown += `\`\`\`\n\n---\n\n`;
  }

  const outputPath = path.join(__dirname, '..', 'docs', 'wialon_api_reference.md');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, markdown, 'utf-8');

  console.log(`✅ Documentation saved to: ${outputPath}\n`);
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🔐 Wialon API Client

Usage: node scripts/wialon-client.js <command>

Commands:
  login          Login with token and get session ID
  search         Search for all units
  account        Get account information
  logout         Logout and clear session
  check          Check if session is still valid
  generate-docs  Generate API documentation
  list           Show this help

Examples:
  npm run wialon:login
  npm run wialon:search
  npm run wialon:account
  npm run wialon:logout
`);
    return;
  }

  const command = args[0];

  try {
    switch (command) {
      case 'login':
        await login();
        break;
      
      case 'search':
        await searchUnits();
        break;
      
      case 'account':
        await getAccountInfo();
        break;
      
      case 'logout':
        await logout();
        break;
      
      case 'check':
        await checkSession();
        break;
      
      case 'generate-docs':
        await generateDocs();
        break;
      
      case 'list':
        main();
        break;
      
      default:
        console.error(`❌ Unknown command: ${command}`);
        console.log('   Run without arguments to see usage\n');
        process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();