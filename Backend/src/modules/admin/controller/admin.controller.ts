import { Controller, Get, Post, Body } from '@nestjs/common';
import { AdminService } from '../service/admin.service';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { Admin } from '../entities/admin.entity';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/create-admin')
  async create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return await this.adminService.create(createAdminDto);
  }

  @Get('/get-all-admin')
  async findAll(): Promise<Admin[]> {
    return await this.adminService.findAll();
  }
}
