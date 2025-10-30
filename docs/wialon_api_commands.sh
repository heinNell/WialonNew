#!/bin/bash
# Wialon API Commands
# Replace ${WIALON_TOKEN} and ${WIALON_SESSION_ID} with your values

# 01_token_login: Login with token authentication
curl -X POST 'https://hst-api.wialon.com/wialon/ajax.html' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data 'svc=token%2Flogin&params=%7B%22token%22%3A%22%24%7BWIALON_TOKEN%7D%22%7D'

# 02_search_units: Search for all units
curl -X POST 'https://hst-api.wialon.com/wialon/ajax.html' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data 'svc=core%2Fsearch_items&params=%7B%22spec%22%3A%7B%22itemsType%22%3A%22avl_unit%22%2C%22propName%22%3A%22sys_name%22%2C%22propValueMask%22%3A%22*%22%2C%22sortType%22%3A%22sys_name%22%7D%2C%22force%22%3A1%2C%22flags%22%3A1%2C%22from%22%3A0%2C%22to%22%3A0%7D&sid='

# 03_get_account_info: Get account information
curl -X POST 'https://hst-api.wialon.com/wialon/ajax.html' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data 'svc=core%2Fuse_auth_hash&params=%7B%22authHash%22%3A%22%24%7BWIALON_TOKEN%7D%22%7D'

# 04_logout: Logout from session
curl -X POST 'https://hst-api.wialon.com/wialon/ajax.html' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data 'svc=core%2Flogout&sid='
