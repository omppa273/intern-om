// src/modules/patient/patient.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../user/user.entity';

export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-'
}

@Entity('patients')
@Index(['user_id'], { unique: true })
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  medical_history: string;

  @Column({ type: 'text', nullable: true })
  allergies: string;

  @Column({ type: 'text', nullable: true })
  current_medications: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: BloodType,
    nullable: true
  })
  blood_type: BloodType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emergency_contact_name: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  emergency_contact_phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emergency_contact_relation: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  insurance_provider: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  insurance_policy_number: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height: number; // in cm

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number; // in kg

  @Column({ type: 'json', nullable: true })
  chronic_conditions: string[]; // Array of chronic conditions

  @Column({ type: 'json', nullable: true })
  previous_surgeries: string[]; // Array of previous surgeries

  @Column({ type: 'boolean', default: false })
  is_smoker: boolean;

  @Column({ type: 'boolean', default: false })
  is_alcoholic: boolean;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relations
  @OneToOne(() => User, user => user.patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}