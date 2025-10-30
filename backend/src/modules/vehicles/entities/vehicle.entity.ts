import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { VehiclePosition } from './vehicle-position.entity';

export enum VehicleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  OUT_OF_SERVICE = 'out_of_service',
}

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  wialonId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  licensePlate: string;

  @Column({ nullable: true })
  vin: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  year: number;

  @Column({ nullable: true })
  color: string;

  @Column({
    type: 'enum',
    enum: VehicleStatus,
    default: VehicleStatus.ACTIVE,
  })
  status: VehicleStatus;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  currentLat: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  currentLng: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  currentSpeed: number;

  @Column({ type: 'smallint', nullable: true })
  currentCourse: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  currentMileage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fuelLevel: number;

  @Column({ nullable: true })
  driverId: string;

  @Column({ nullable: true })
  driverName: string;

  @Column({ default: true })
  isOnline: boolean;

  @Column({ nullable: true })
  lastMessageTime: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @OneToMany(() => VehiclePosition, (position) => position.vehicle)
  positions: VehiclePosition[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
