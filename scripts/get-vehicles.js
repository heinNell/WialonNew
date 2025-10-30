#!/usr/bin/env node
/**
 * Get all vehicles from your Wialon account
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

async function getVehicles() {
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

  const body = new URLSearchParams({
    svc: 'core/search_items',
    params: JSON.stringify(params),
    sid: WIALON_SESSION_ID
  });

  try {
    console.log('📡 Fetching vehicles...\n');
    
    const response = await fetch(WIALON_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    const data = await response.json();

    if (data.error) {
      console.error(`❌ Error: ${data.error}`);
      return;
    }

    const items = data.items || [];
    
    console.log(`✅ Found ${items.length} vehicles\n`);
    console.log('━'.repeat(80));
    
    items.forEach((unit, index) => {
      const position = unit.pos;
      const lastMessage = unit.lastMessage;
      
      console.log(`\n${index + 1}. ${unit.nm} (ID: ${unit.id})`);
      console.log(`   Device: ${unit.iconResId || 'N/A'}`);
      
      if (position) {
        console.log(`   Position: ${position.y.toFixed(4)}, ${position.x.toFixed(4)}`);
        console.log(`   Speed: ${position.s || 0} km/h`);
        console.log(`   Course: ${position.c || 0}°`);
      }
      
      if (lastMessage) {
        const timestamp = new Date(lastMessage.t * 1000).toLocaleString();
        console.log(`   Last message: ${timestamp}`);
      }
    });
    
    console.log('\n' + '━'.repeat(80));

  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

getVehicles();