// src/modules/user/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, Index } from 'typeorm';
import { Doctor } from '../doctor/doctor.entity';
import { Patient } from '../patient/patient.entity';

export enum UserType {
  PATIENT = 'patient',
  DOCTOR = 'doctor'
}

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  gender: string;

  @Column({ type: 'date', nullable: false })
  dob: Date;

  @Column({ type: 'varchar', length: 15, nullable: false })
  phone: string;

  @Column({ type: 'text', nullable: false })
  address: string;

  @Column({
    type: 'enum',
    enum: UserType,
    nullable: false
  })
  user_type: UserType;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relations
  @OneToOne(() => Doctor, doctor => doctor.user, { cascade: true })
  doctor: Doctor;

  @OneToOne(() => Patient, patient => patient.user, { cascade: true })
  patient: Patient;
}