#!/bin/bash
# Wialon API Commands
# This script requires the WIALON_TOKEN environment variable to be set.
# Example: export WIALON_TOKEN="your_actual_token_here"
# It performs login first to obtain a session ID (sid), then uses it for subsequent calls.
# Requires 'jq' for JSON parsing. Install with: sudo apt update && sudo apt install jq

# Check if WIALON_TOKEN is set
if [ -z "$WIALON_TOKEN" ]; then
  echo "Error: WIALON_TOKEN environment variable is not set."
  echo "Set it with: export WIALON_TOKEN=\"your_token_here\""
  exit 1
fi

# 01_token_login: Login with token authentication and extract sid (eid)
echo "Performing login..."
LOGIN_RESPONSE=$(curl -s -X POST 'https://hst-api.wialon.com/wialon/ajax.html' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data "svc=token%2Flogin&params=%7B%22token%22%3A%22${WIALON_TOKEN}%22%7D")

echo "$LOGIN_RESPONSE"

# Parse sid (eid) from response
SID=$(echo "$LOGIN_RESPONSE" | jq -r '.eid // empty')
if [ -z "$SID" ]; then
  echo "Error: Failed to obtain session ID (sid) from login response."
  exit 1
fi

echo "Session ID obtained: $SID"

# Parse current user ID from login response for account info query
USER_ID=$(echo "$LOGIN_RESPONSE" | jq -r '.user.id // empty')
if [ -z "$USER_ID" ]; then
  echo "Error: Failed to obtain user ID from login response."
  exit 1
fi

echo "User ID obtained: $USER_ID"

# 02_search_units: Search for all units using sid
echo "Searching for units..."
curl -s -X POST 'https://hst-api.wialon.com/wialon/ajax.html' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data "svc=core%2Fsearch_items&params=%7B%22spec%22%3A%7B%22itemsType%22%3A%22avl_unit%22%2C%22propName%22%3A%22sys_name%22%2C%22propValueMask%22%3A%22*%22%2C%22sortType%22%3A%22sys_name%22%7D%2C%22force%22%3A1%2C%22flags%22%3A1%2C%22from%22%3A0%2C%22to%22%3A0%7D&sid=${SID}"

echo ""

# 03_get_account_info: Get current user/account information using core/search_item with user ID
echo "Getting account info..."
curl -s -X POST 'https://hst-api.wialon.com/wialon/ajax.html' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data "svc=core%2Fsearch_item&params=%7B%22id%22%3A${USER_ID}%2C%22flags%22%3A-1%7D&sid=${SID}"

echo ""

# 04_logout: Logout from session using sid (added empty params for safety)
echo "Logging out..."
curl -s -X POST 'https://hst-api.wialon.com/wialon/ajax.html' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data "svc=core%2Flogout&params=%7B%7D&sid=${SID}"

echo ""