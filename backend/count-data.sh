#!/bin/bash

echo "📊 Database Record Counts"
echo "========================="

docker-compose exec -T postgres psql -U fleetuser -d fleetmanager << SQL
SELECT 'Users:    ' || COUNT(*) FROM users;
SELECT 'Vehicles: ' || COUNT(*) FROM vehicles;
SELECT 'Tasks:    ' || COUNT(*) FROM tasks;
SELECT 'Routes:   ' || COUNT(*) FROM routes;
SQL

echo ""
echo "✅ Query complete!"
