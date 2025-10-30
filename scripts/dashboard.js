#!/usr/bin/env node
/**
 * Real-time Fleet Dashboard
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

async function getFleetStatus() {
  const { WIALON_API_URL, WIALON_SESSION_ID } = process.env;

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

  try {
    const response = await fetch(WIALON_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        svc: 'core/search_items',
        params: JSON.stringify(params),
        sid: WIALON_SESSION_ID
      }).toString()
    });

    const data = await response.json();
    const items = data.items || [];

    // Dashboard Header
    console.clear();
    console.log(`
${colors.bright}${colors.blue}╔════════════════════════════════════════════════════════════╗${colors.reset}
${colors.bright}${colors.blue}║           🚗 FLEET MANAGEMENT DASHBOARD 🚗                 ║${colors.reset}
${colors.bright}${colors.blue}╚════════════════════════════════════════════════════════════╝${colors.reset}

${colors.bright}Total Vehicles: ${items.length}${colors.reset}
Updated: ${new Date().toLocaleTimeString()}

`);

    // Summary Stats
    let moving = 0;
    let idle = 0;
    let offline = 0;

    items.forEach(unit => {
      if (!unit.pos) {
        offline++;
      } else if (unit.pos.s > 5) {
        moving++;
      } else {
        idle++;
      }
    });

    console.log(`${colors.green}✓ Moving: ${moving}${colors.reset}  ${colors.yellow}⊘ Idle: ${idle}${colors.reset}  ${colors.red}✗ Offline: ${offline}${colors.reset}\n`);

    // Vehicle Table
    console.log(`${colors.bright}┌─ ID ─┬─ Name ─┬─ Status ─┬─ Speed ─┬─ Position ─┐${colors.reset}`);

    items.forEach(unit => {
      const status = !unit.pos 
        ? `${colors.red}OFFLINE${colors.reset}` 
        : unit.pos.s > 5 
          ? `${colors.green}MOVING${colors.reset}` 
          : `${colors.yellow}IDLE${colors.reset}`;

      const speed = unit.pos?.s || 0;
      const lat = unit.pos?.y.toFixed(2) || '-';
      const lon = unit.pos?.x.toFixed(2) || '-';

      console.log(`│ ${unit.id.toString().padEnd(3)} │ ${unit.nm.substring(0, 15).padEnd(15)} │ ${status} │ ${speed.toString().padStart(3)}km/h │ ${lat}, ${lon} │`);
    });

    console.log(`${colors.bright}└────────────────────────────────────────────────────────────┘${colors.reset}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Refresh every 30 seconds
getFleetStatus();
setInterval(getFleetStatus, 30000);