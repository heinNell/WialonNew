import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Task } from './task.entity';
import { Checkpoint } from './checkpoint.entity';

export enum RouteStatus {
  DRAFT = 'draft',
  PLANNED = 'planned',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: RouteStatus,
    default: RouteStatus.DRAFT,
  })
  status: RouteStatus;

  @Column({ nullable: true })
  vehicleId: string;

  @Column({ nullable: true })
  driverId: string;

  @Column({ nullable: true })
  driverName: string;

  // Start location
  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  startLatitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  startLongitude: number;

  @Column({ nullable: true })
  startAddress: string;

  // End location
  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  endLatitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  endLongitude: number;

  @Column({ nullable: true })
  endAddress: string;

  // Timing
  @Column({ type: 'timestamp', nullable: true })
  scheduledStartTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduledEndTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualStartTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualEndTime: Date;

  // Statistics
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalDistance: number; // km

  @Column({ type: 'int', default: 0 })
  estimatedDuration: number; // minutes

  @Column({ type: 'int', default: 0 })
  actualDuration: number; // minutes

  @Column({ type: 'int', default: 0 })
  completedTasks: number;

  @Column({ type: 'int', default: 0 })
  totalTasks: number;

  // Optimization
  @Column({ default: false })
  isOptimized: boolean;

  @Column({ type: 'jsonb', nullable: true })
  optimizationParams: any;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @OneToMany(() => Task, (task) => task.route)
  tasks: Task[];

  @OneToMany(() => Checkpoint, (checkpoint) => checkpoint.route)
  checkpoints: Checkpoint[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
