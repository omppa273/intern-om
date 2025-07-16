// src/modules/user/user.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { UserService, CreateUserDto, UpdateUserDto, LoginDto } from './user.service';
import { UserType } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    const { password, ...userWithoutPassword } = user;
    return {
      message: 'User registered successfully',
      user: userWithoutPassword
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userService.login(loginDto);
    const { password, ...userWithoutPassword } = user;
    return {
      message: 'Login successful',
      user: userWithoutPassword
    };
  }

  @Get()
  async findAll(@Query('user_type') userType?: UserType) {
    if (userType) {
      return await this.userService.findByUserType(userType);
    }
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto);
    return {
      message: 'User updated successfully',
      user
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.userService.remove(id);
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  async activate(@Param('id', ParseIntPipe) id: number) {
    await this.userService.activate(id);
    return {
      message: 'User activated successfully'
    };
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return await this.userService.findByEmail(email);
  }
}