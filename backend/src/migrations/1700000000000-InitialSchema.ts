import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users table
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM('admin', 'manager', 'driver', 'viewer');
      
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" varchar NOT NULL UNIQUE,
        "password" varchar NOT NULL,
        "firstName" varchar NOT NULL,
        "lastName" varchar NOT NULL,
        "role" "user_role_enum" NOT NULL DEFAULT 'viewer',
        "phone" varchar,
        "avatar" varchar,
        "isActive" boolean NOT NULL DEFAULT true,
        "wialonUserId" varchar,
        "wialonAccountId" varchar,
        "lastLoginAt" timestamp,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now()
      );
      
      CREATE INDEX "IDX_users_email" ON "users" ("email");
      CREATE INDEX "IDX_users_role" ON "users" ("role");
    `);

    // Vehicles table
    await queryRunner.query(`
      CREATE TYPE "vehicle_status_enum" AS ENUM('active', 'inactive', 'maintenance', 'out_of_service');
      
      CREATE TABLE "vehicles" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "wialonId" integer NOT NULL UNIQUE,
        "name" varchar NOT NULL,
        "licensePlate" varchar,
        "vin" varchar,
        "brand" varchar,
        "model" varchar,
        "year" integer,
        "color" varchar,
        "status" "vehicle_status_enum" NOT NULL DEFAULT 'active',
        "currentLat" decimal(10,6),
        "currentLng" decimal(10,6),
        "currentSpeed" decimal(5,2),
        "currentCourse" smallint,
        "currentMileage" decimal(10,2),
        "fuelLevel" decimal(10,2),
        "driverId" varchar,
        "driverName" varchar,
        "isOnline" boolean NOT NULL DEFAULT true,
        "lastMessageTime" timestamp,
        "metadata" jsonb,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now()
      );
      
      CREATE INDEX "IDX_vehicles_wialonId" ON "vehicles" ("wialonId");
      CREATE INDEX "IDX_vehicles_status" ON "vehicles" ("status");
      CREATE INDEX "IDX_vehicles_isOnline" ON "vehicles" ("isOnline");
    `);

    // Vehicle positions table
    await queryRunner.query(`
      CREATE TABLE "vehicle_positions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "vehicleId" uuid NOT NULL,
        "lat" decimal(10,6) NOT NULL,
        "lng" decimal(10,6) NOT NULL,
        "speed" decimal(5,2) DEFAULT 0,
        "course" smallint DEFAULT 0,
        "altitude" smallint DEFAULT 0,
        "satellites" smallint DEFAULT 0,
        "timestamp" timestamp NOT NULL,
        "sensors" jsonb,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        
        CONSTRAINT "FK_vehicle_positions_vehicleId" FOREIGN KEY ("vehicleId") 
          REFERENCES "vehicles"("id") ON DELETE CASCADE
      );
      
      CREATE INDEX "IDX_positions_vehicleId" ON "vehicle_positions" ("vehicleId");
      CREATE INDEX "IDX_positions_timestamp" ON "vehicle_positions" ("timestamp");
      CREATE INDEX "IDX_positions_vehicleId_timestamp" ON "vehicle_positions" ("vehicleId", "timestamp");
    `);

    // Routes table
    await queryRunner.query(`
      CREATE TYPE "route_status_enum" AS ENUM('draft', 'planned', 'active', 'completed', 'cancelled');
      
      CREATE TABLE "routes" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "description" text,
        "status" "route_status_enum" NOT NULL DEFAULT 'draft',
        "vehicleId" varchar,
        "driverId" varchar,
        "driverName" varchar,
        "startLatitude" decimal(10,6),
        "startLongitude" decimal(10,6),
        "startAddress" varchar,
        "endLatitude" decimal(10,6),
        "endLongitude" decimal(10,6),
        "endAddress" varchar,
        "scheduledStartTime" timestamp,
        "scheduledEndTime" timestamp,
        "actualStartTime" timestamp,
        "actualEndTime" timestamp,
        "totalDistance" decimal(10,2) DEFAULT 0,
        "estimatedDuration" integer DEFAULT 0,
        "actualDuration" integer DEFAULT 0,
        "completedTasks" integer DEFAULT 0,
        "totalTasks" integer DEFAULT 0,
        "isOptimized" boolean DEFAULT false,
        "optimizationParams" jsonb,
        "metadata" jsonb,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now()
      );
      
      CREATE INDEX "IDX_routes_status" ON "routes" ("status");
      CREATE INDEX "IDX_routes_vehicleId" ON "routes" ("vehicleId");
      CREATE INDEX "IDX_routes_scheduledStartTime" ON "routes" ("scheduledStartTime");
    `);

    // Tasks table
    await queryRunner.query(`
      CREATE TYPE "task_type_enum" AS ENUM('delivery', 'pickup', 'service', 'maintenance');
      CREATE TYPE "task_status_enum" AS ENUM('pending', 'assigned', 'in_progress', 'completed', 'cancelled', 'failed');
      CREATE TYPE "task_priority_enum" AS ENUM('low', 'medium', 'high', 'urgent');
      
      CREATE TABLE "tasks" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title" varchar NOT NULL,
        "description" text,
        "type" "task_type_enum" NOT NULL DEFAULT 'delivery',
        "status" "task_status_enum" NOT NULL DEFAULT 'pending',
        "priority" "task_priority_enum" NOT NULL DEFAULT 'medium',
        "routeId" uuid,
        "vehicleId" varchar,
        "driverId" varchar,
        "driverName" varchar,
        "latitude" decimal(10,6) NOT NULL,
        "longitude" decimal(10,6) NOT NULL,
        "address" varchar,
        "contactName" varchar,
        "contactPhone" varchar,
        "contactEmail" varchar,
        "scheduledStartTime" timestamp,
        "scheduledEndTime" timestamp,
        "actualStartTime" timestamp,
        "actualEndTime" timestamp,
        "estimatedDuration" integer DEFAULT 30,
        "weight" decimal(10,2),
        "volume" decimal(10,2),
        "packageCount" integer,
        "orderNumber" varchar,
        "referenceNumber" varchar,
        "notes" text,
        "completionNotes" text,
        "attachments" jsonb,
        "metadata" jsonb,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        
        CONSTRAINT "FK_tasks_routeId" FOREIGN KEY ("routeId") 
          REFERENCES "routes"("id") ON DELETE SET NULL
      );
      
      CREATE INDEX "IDX_tasks_status" ON "tasks" ("status");
      CREATE INDEX "IDX_tasks_routeId" ON "tasks" ("routeId");
      CREATE INDEX "IDX_tasks_vehicleId" ON "tasks" ("vehicleId");
      CREATE INDEX "IDX_tasks_scheduledStartTime" ON "tasks" ("scheduledStartTime");
    `);

    // Checkpoints table
    await queryRunner.query(`
      CREATE TABLE "checkpoints" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "routeId" uuid NOT NULL,
        "taskId" varchar,
        "sequence" integer NOT NULL,
        "latitude" decimal(10,6) NOT NULL,
        "longitude" decimal(10,6) NOT NULL,
        "address" varchar,
        "estimatedArrival" timestamp,
        "actualArrival" timestamp,
        "isCompleted" boolean DEFAULT false,
        "metadata" jsonb,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        
        CONSTRAINT "FK_checkpoints_routeId" FOREIGN KEY ("routeId") 
          REFERENCES "routes"("id") ON DELETE CASCADE
      );
      
      CREATE INDEX "IDX_checkpoints_routeId" ON "checkpoints" ("routeId");
      CREATE INDEX "IDX_checkpoints_sequence" ON "checkpoints" ("routeId", "sequence");
    `);

    // Deliveries table
    await queryRunner.query(`
      CREATE TYPE "delivery_status_enum" AS ENUM('created', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned');
      
      CREATE TABLE "deliveries" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "taskId" varchar NOT NULL,
        "trackingNumber" varchar NOT NULL UNIQUE,
        "status" "delivery_status_enum" NOT NULL DEFAULT 'created',
        "recipientName" varchar,
        "recipientPhone" varchar,
        "recipientSignature" varchar,
        "photos" jsonb,
        "notes" text,
        "deliveredAt" timestamp,
        "proofOfDelivery" jsonb,
        "metadata" jsonb,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now()
      );
      
      CREATE INDEX "IDX_deliveries_taskId" ON "deliveries" ("taskId");
      CREATE INDEX "IDX_deliveries_trackingNumber" ON "deliveries" ("trackingNumber");
      CREATE INDEX "IDX_deliveries_status" ON "deliveries" ("status");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "deliveries"`);
    await queryRunner.query(`DROP TABLE "checkpoints"`);
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TABLE "routes"`);
    await queryRunner.query(`DROP TABLE "vehicle_positions"`);
    await queryRunner.query(`DROP TABLE "vehicles"`);
    await queryRunner.query(`DROP TABLE "users"`);

    await queryRunner.query(`DROP TYPE "delivery_status_enum"`);
    await queryRunner.query(`DROP TYPE "task_priority_enum"`);
    await queryRunner.query(`DROP TYPE "task_status_enum"`);
    await queryRunner.query(`DROP TYPE "task_type_enum"`);
    await queryRunner.query(`DROP TYPE "route_status_enum"`);
    await queryRunner.query(`DROP TYPE "vehicle_status_enum"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
}
