///createcurl.sh

import fs from 'fs';

// Sample JSON data for demonstration
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
            "params": "{\"token\":\"YOUR_TOKEN_HERE\"}"
        }
    },
    // Add more API calls as needed
};

// Function to generate cURL commands
function generateCurlCommands(apiCalls) {
    const curlCommands = Object.entries(apiCalls).map(([key, value]) => {
        const body = new URLSearchParams(value.body).toString();
        return `curl -X ${value.method} '${value.url}' \\\n` +
               `-H '${Object.entries(value.headers).map(([k, v]) => `${k}: ${v}`).join("' -H '")}' \\\n` +
               `--data '${body}'`;
    });
    return curlCommands;
}

// Write cURL commands to a file
const curlCommands = generateCurlCommands(apiCalls);
fs.writeFileSync('curl_commands.txt', curlCommands.join('\n\n'), 'utf-8');
console.log('✅ cURL commands generated and saved to curl_commands.txt');
