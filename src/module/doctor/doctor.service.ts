// src/modules/doctor/doctor.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';

export interface CreateDoctorDto {
  name: string;
  specialization: string;
  years_of_experience: number;
  email: string;
  phone: string;
  bio?: string;
  profile_pic?: string;
  consultation_fee?: number;
  clinic_address?: string;
  qualifications?: string[];
  languages?: string[];
  user_id: number;
}

export interface UpdateDoctorDto {
  name?: string;
  specialization?: string;
  years_of_experience?: number;
  phone?: string;
  bio?: string;
  profile_pic?: string;
  consultation_fee?: number;
  clinic_address?: string;
  qualifications?: string[];
  languages?: string[];
  is_available?: boolean;
}

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    // Check if doctor already exists with this email or user_id
    const existingDoctor = await this.doctorRepository.findOne({
      where: [
        { email: createDoctorDto.email },
        { user_id: createDoctorDto.user_id }
      ]
    });

    if (existingDoctor) {
      throw new ConflictException('Doctor with this email or user_id already exists');
    }

    const doctor = this.doctorRepository.create(createDoctorDto);
    return await this.doctorRepository.save(doctor);
  }

  async findAll(): Promise<Doctor[]> {
    return await this.doctorRepository.find({
      where: { is_active: true },
      relations: ['user']
    });
  }

  async findOne(id: number): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }

  async findByUserId(userId: number): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { user_id: userId },
      relations: ['user']
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }

  async findBySpecialization(specialization: string): Promise<Doctor[]> {
    return await this.doctorRepository.find({
      where: { 
        specialization: specialization,
        is_active: true,
        is_available: true
      },
      relations: ['user']
    });
  }

  async findAvailableDoctors(): Promise<Doctor[]> {
    return await this.doctorRepository.find({
      where: { 
        is_available: true,
        is_active: true
      },
      relations: ['user']
    });
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.findOne(id);

    await this.doctorRepository.update(id, updateDoctorDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const doctor = await this.findOne(id);
    await this.doctorRepository.update(id, { is_active: false });
  }

  async activate(id: number): Promise<void> {
    const doctor = await this.findOne(id);
    await this.doctorRepository.update(id, { is_active: true });
  }

  async toggleAvailability(id: number): Promise<Doctor> {
    const doctor = await this.findOne(id);
    await this.doctorRepository.update(id, { is_available: !doctor.is_available });
    return await this.findOne(id);
  }

  async searchDoctors(query: string): Promise<Doctor[]> {
    return await this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .where('doctor.is_active = :active', { active: true })
      .andWhere('doctor.is_available = :available', { available: true })
      .andWhere(
        '(doctor.name ILIKE :query OR doctor.specialization ILIKE :query OR doctor.bio ILIKE :query)',
        { query: `%${query}%` }
      )
      .getMany();
  }
}