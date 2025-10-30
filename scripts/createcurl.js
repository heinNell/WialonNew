#!/usr/bin/env node
/**
 * createcurl.js
 * Generates cURL commands from Wialon API call definitions
 * Usage: node scripts/createcurl.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Wialon API Calls Collection
const apiCalls = {
  "01_token_login": {
    "description": "Login with token authentication",
    "url": "https://hst-api.wialon.com/wialon/ajax.html",
    "method": "POST",
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    "body": {
      "svc": "token/login",
      "params": JSON.stringify({ token: "c1099bc37c906fd0832d8e783b60ae0dE2C80EB58DEEB2A487AD4B848C2FBDAF9858A67D" })
    }
  },
  
  "02_search_items": {
    "description": "Search for items (units, resources, etc.)",
    "url": "https://hst-api.wialon.com/wialon/ajax.html",
    "method": "POST",
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    "body": {
      "svc": "core/search_items",
      "params": JSON.stringify({
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
      }),
      "sid": "YOUR_SESSION_ID"
    }
  },

  "03_get_unit_messages": {
    "description": "Get messages from a unit",
    "url": "https://hst-api.wialon.com/wialon/ajax.html",
    "method": "POST",
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    "body": {
      "svc": "messages/load_interval",
      "params": JSON.stringify({
        itemId: 123456,
        timeFrom: Math.floor(Date.now() / 1000) - 86400, // Last 24h
        timeTo: Math.floor(Date.now() / 1000),
        flags: 0,
        flagsMask: 0,
        loadCount: 100
      }),
      "sid": "YOUR_SESSION_ID"
    }
  },

  "04_create_geofence": {
    "description": "Create a new geofence",
    "url": "https://hst-api.wialon.com/wialon/ajax.html",
    "method": "POST",
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    "body": {
      "svc": "resource/update_zone",
      "params": JSON.stringify({
        itemId: 123456,
        id: 0,
        callMode: "create",
        n: "New Geofence",
        d: "Created via API",
        t: 3, // polygon
        w: 100,
        f: 0,
        c: 0xFF0000,
        tc: 0,
        ts: 0,
        min: 0,
        max: 0,
        p: [
          { x: 37.6173, y: 55.7558 },
          { x: 37.6273, y: 55.7558 },
          { x: 37.6273, y: 55.7658 },
          { x: 37.6173, y: 55.7658 }
        ]
      }),
      "sid": "YOUR_SESSION_ID"
    }
  },

  "05_exec_report": {
    "description": "Execute a report",
    "url": "https://hst-api.wialon.com/wialon/ajax.html",
    "method": "POST",
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    "body": {
      "svc": "report/exec_report",
      "params": JSON.stringify({
        reportResourceId: 123456,
        reportTemplateId: 1,
        reportObjectId: 789,
        reportObjectSecId: 0,
        interval: {
          from: Math.floor(Date.now() / 1000) - 86400,
          to: Math.floor(Date.now() / 1000),
          flags: 0
        }
      }),
      "sid": "YOUR_SESSION_ID"
    }
  },

  "06_logout": {
    "description": "Logout and end session",
    "url": "https://hst-api.wialon.com/wialon/ajax.html",
    "method": "POST",
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    "body": {
      "svc": "core/logout",
      "sid": "YOUR_SESSION_ID"
    }
  }
};

// ✅ Function to generate cURL commands
function generateCurlCommands(apiCalls) {
  const curlCommands = [];
  
  for (const [key, call] of Object.entries(apiCalls)) {
    const { description, url, method, headers, body } = call;
    
    // Build headers
    const headerLines = Object.entries(headers)
      .map(([k, v]) => `-H '${k}: ${v}'`)
      .join(' \\\n  ');
    
    // Build body
    const bodyString = new URLSearchParams(body).toString();
    
    // Build cURL command
    const curlCommand = `
# ${key}: ${description}
curl -X ${method} '${url}' \\
  ${headerLines} \\
  --data '${bodyString}'
`.trim();
    
    curlCommands.push(curlCommand);
  }
  
  return curlCommands;
}

// ✅ Function to generate Postman collection
function generatePostmanCollection(apiCalls) {
  const collection = {
    info: {
      name: "Wialon API Calls",
      description: "Auto-generated collection of Wialon API endpoints",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: []
  };

  for (const [key, call] of Object.entries(apiCalls)) {
    const { description, url, method, headers, body } = call;
    
    collection.item.push({
      name: `${key}: ${description}`,
      request: {
        method: method,
        header: Object.entries(headers).map(([k, v]) => ({ key: k, value: v })),
        body: {
          mode: "urlencoded",
          urlencoded: Object.entries(body).map(([key, value]) => ({
            key,
            value,
            type: "text"
          }))
        },
        url: {
          raw: url,
          protocol: url.split('://')[0],
          host: url.split('://')[1].split('/')[0].split('.'),
          path: url.split('://')[1].split('/').slice(1)
        }
      }
    });
  }

  return collection;
}

// ✅ Main execution
function main() {
  try {
    console.log('🚀 Generating API documentation...\n');

    // Generate cURL commands
    const curlCommands = generateCurlCommands(apiCalls);
    const curlOutput = curlCommands.join('\n\n');
    
    // Write cURL commands
    const curlPath = path.join(__dirname, '..', 'docs', 'curl_commands.sh');
    fs.mkdirSync(path.dirname(curlPath), { recursive: true });
    fs.writeFileSync(curlPath, `#!/bin/bash\n# Wialon API cURL Commands\n# Generated: ${new Date().toISOString()}\n\n${curlOutput}\n`, 'utf-8');
    
    // Make executable
    fs.chmodSync(curlPath, '755');
    
    console.log(`✅ cURL commands saved to: ${curlPath}`);

    // Generate Postman collection
    const postmanCollection = generatePostmanCollection(apiCalls);
    const postmanPath = path.join(__dirname, '..', 'docs', 'wialon_api.postman_collection.json');
    fs.writeFileSync(postmanPath, JSON.stringify(postmanCollection, null, 2), 'utf-8');
    
    console.log(`✅ Postman collection saved to: ${postmanPath}`);

    // Generate markdown documentation
    const markdownPath = path.join(__dirname, '..', 'docs', 'api_reference.md');
    const markdown = generateMarkdownDocs(apiCalls);
    fs.writeFileSync(markdownPath, markdown, 'utf-8');
    
    console.log(`✅ Markdown docs saved to: ${markdownPath}`);

    console.log('\n🎉 All API documentation generated successfully!');
  } catch (error) {
    console.error('❌ Error generating documentation:', error);
    process.exit(1);
  }
}

// ✅ Generate markdown documentation
function generateMarkdownDocs(apiCalls) {
  let markdown = `# Wialon API Reference\n\n`;
  markdown += `Generated: ${new Date().toISOString()}\n\n`;
  markdown += `## Table of Contents\n\n`;
  
  // TOC
  for (const [key, call] of Object.entries(apiCalls)) {
    markdown += `- [${key}](#${key.replace(/_/g,'-')}): ${call.description}\n`;
  }
  
  markdown += `\n---\n\n`;
  
  // Details
  for (const [key, call] of Object.entries(apiCalls)) {
    markdown += `## ${key}\n\n`;
    markdown += `**Description:** ${call.description}\n\n`;
    markdown += `**Method:** \`${call.method}\`\n\n`;
    markdown += `**URL:** \`${call.url}\`\n\n`;
    
    markdown += `### Headers\n\n\`\`\`json\n${JSON.stringify(call.headers, null, 2)}\n\`\`\`\n\n`;
    
    markdown += `### Body Parameters\n\n\`\`\`json\n${JSON.stringify(call.body, null, 2)}\n\`\`\`\n\n`;
    
    markdown += `### cURL Example\n\n\`\`\`bash\n`;
    const bodyString = new URLSearchParams(call.body).toString();
    markdown += `curl -X ${call.method} '${call.url}' \\\n`;
    for (const [k, v] of Object.entries(call.headers)) {
      markdown += `  -H '${k}: ${v}' \\\n`;
    }
    markdown += `  --data '${bodyString}'\n`;
    markdown += `\`\`\`\n\n`;
    
    markdown += `---\n\n`;
  }
  
  return markdown;
}

// Run the script
main();