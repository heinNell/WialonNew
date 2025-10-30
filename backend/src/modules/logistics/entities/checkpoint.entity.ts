import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Route } from './route.entity';

@Entity('checkpoints')
export class Checkpoint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  routeId: string;

  @Column({ nullable: true })
  taskId: string;

  @Column()
  sequence: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  longitude: number;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'timestamp', nullable: true })
  estimatedArrival: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualArrival: Date;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @ManyToOne(() => Route, (route) => route.checkpoints)
  @JoinColumn({ name: 'routeId' })
  route: Route;

  @CreateDateColumn()
  createdAt: Date;
}
