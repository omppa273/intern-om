// src/modules/doctor/doctor.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { DoctorService, CreateDoctorDto, UpdateDoctorDto } from './doctor.service';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDoctorDto: CreateDoctorDto) {
    const doctor = await this.doctorService.create(createDoctorDto);
    return {
      message: 'Doctor profile created successfully',
      doctor
    };
  }

  @Get()
  async findAll(@Query('specialization') specialization?: string, @Query('available') available?: string) {
    if (specialization) {
      return await this.doctorService.findBySpecialization(specialization);
    }
    if (available === 'true') {
      return await this.doctorService.findAvailableDoctors();
    }
    return await this.doctorService.findAll();
  }

  @Get('search')
  async searchDoctors(@Query('q') query: string) {
    return await this.doctorService.searchDoctors(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.doctorService.findOne(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return await this.doctorService.findByUserId(userId);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDoctorDto: UpdateDoctorDto) {
    const doctor = await this.doctorService.update(id, updateDoctorDto);
    return {
      message: 'Doctor profile updated successfully',
      doctor
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.doctorService.remove(id);
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  async activate(@Param('id', ParseIntPipe) id: number) {
    await this.doctorService.activate(id);
    return {
      message: 'Doctor activated successfully'
    };
  }

  @Post(':id/toggle-availability')
  @HttpCode(HttpStatus.OK)
  async toggleAvailability(@Param('id', ParseIntPipe) id: number) {
    const doctor = await this.doctorService.toggleAvailability(id);
    return {
      message: 'Doctor availability toggled successfully',
      doctor
    };
  }
}