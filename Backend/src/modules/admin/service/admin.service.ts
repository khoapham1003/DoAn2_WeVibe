import { Admin } from './../entities/admin.entity';
import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TYPE_STATUS } from 'src/shared/constants/status.const';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  create(createAdminDto: CreateAdminDto): Promise<Admin> {
    if (!createAdminDto.mStatus) {
      createAdminDto.mStatus = TYPE_STATUS.ACTIVE;
    }

    const admin = this.adminRepository.create(createAdminDto);
    return this.adminRepository.save(admin);
  }

  findAll(): Promise<Admin[]> {
    return this.adminRepository.find();
  }

  async findOne(mName: string): Promise<Admin | undefined> {
    const user = await this.adminRepository.findOne({ where: { mName } });
    return user;
  }

  async update(
    mAdminId: number,
    updateAdminDto: UpdateAdminDto,
  ): Promise<void> {
    updateAdminDto.mModified = new Date().toISOString();
    await this.adminRepository.update(mAdminId, updateAdminDto);
  }

  toUpdateAdminDto(admin: Admin): UpdateAdminDto {
    const updateAdminDto = new UpdateAdminDto();
    updateAdminDto.mName = admin.mName;
    updateAdminDto.mEmail = admin.mEmail;
    updateAdminDto.mPhone = admin.mPhone;
    updateAdminDto.mPassword = admin.mPassword;
    updateAdminDto.mStatus = admin.mStatus;
    updateAdminDto.mModified = admin.mModified;
    return updateAdminDto;
  }
}
