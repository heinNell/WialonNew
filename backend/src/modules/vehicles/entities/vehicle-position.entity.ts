import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity('vehicle_positions')
@Index(['vehicleId', 'timestamp'])
export class VehiclePosition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vehicleId: string;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  lng: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  speed: number;

  @Column({ type: 'smallint', default: 0 })
  course: number;

  @Column({ type: 'smallint', default: 0 })
  altitude: number;

  @Column({ type: 'smallint', default: 0 })
  satellites: number;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'jsonb', nullable: true })
  sensors: any;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.positions)
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  @CreateDateColumn()
  createdAt: Date;
}
