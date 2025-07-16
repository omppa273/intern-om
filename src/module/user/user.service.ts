
// src/modules/user/user.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserType } from './user.entity';
import * as bcrypt from 'bcrypt';

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  gender: string;
  dob: string;
  phone: string;
  address: string;
  user_type: UserType;
}

export interface UpdateUserDto {
  name?: string;
  gender?: string;
  dob?: string;
  phone?: string;
  address?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    // Create user
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      dob: new Date(createUserDto.dob),
    });

    return await this.userRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid credentials');
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      where: { is_active: true },
      select: ['id', 'name', 'email', 'gender', 'dob', 'phone', 'address', 'user_type', 'is_active', 'created_at', 'updated_at']
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'gender', 'dob', 'phone', 'address', 'user_type', 'is_active', 'created_at', 'updated_at']
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    const updateData = {
      ...updateUserDto,
      dob: updateUserDto.dob ? new Date(updateUserDto.dob) : user.dob,
    };

    await this.userRepository.update(id, updateData);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.update(id, { is_active: false });
  }

  async activate(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.update(id, { is_active: true });
  }

  async findByUserType(userType: UserType): Promise<User[]> {
    return await this.userRepository.find({
      where: { user_type: userType, is_active: true },
      select: ['id', 'name', 'email', 'gender', 'dob', 'phone', 'address', 'user_type', 'is_active', 'created_at', 'updated_at']
    });
  }
}