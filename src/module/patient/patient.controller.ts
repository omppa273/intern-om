// src/modules/patient/patient.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { PatientService, CreatePatientDto, UpdatePatientDto } from './patient.service';
import { BloodType } from './patient.entity';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPatientDto: CreatePatientDto) {
    const patient = await this.patientService.create(createPatientDto);
    return {
      message: 'Patient profile created successfully',
      patient
    };
  }

  @Get()
  async findAll(@Query('blood_type') bloodType?: BloodType) {
    if (bloodType) {
      return await this.patientService.findByBloodType(bloodType);
    }
    return await this.patientService.findAll();
  }

  @Get('search')
  async searchPatients(@Query('q') query: string) {
    return await this.patientService.searchPatients(query);
  }

  @Get('stats')
  async getPatientStats() {
    return await this.patientService.getPatientStats();
  }

  @Get('condition/:condition')
  async findByChronicCondition(@Param('condition') condition: string) {
    return await this.patientService.findByChronicCondition(condition);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.patientService.findOne(id);
  }

  @Get(':id/bmi')
  async calculateBMI(@Param('id', ParseIntPipe) id: number) {
    const bmi = await this.patientService.calculateBMI(id);
    return {
      patient_id: id,
      bmi: bmi,
      status: bmi ? this.getBMIStatus(bmi) : 'Cannot calculate - missing height or weight'
    };
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return await this.patientService.findByUserId(userId);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatePatientDto: UpdatePatientDto) {
    const patient = await this.patientService.update(id, updatePatientDto);
    return {
      message: 'Patient profile updated successfully',
      patient
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.patientService.remove(id);
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  async activate(@Param('id', ParseIntPipe) id: number) {
    await this.patientService.activate(id);
    return {
      message: 'Patient activated successfully'
    };
  }

  private getBMIStatus(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }
}