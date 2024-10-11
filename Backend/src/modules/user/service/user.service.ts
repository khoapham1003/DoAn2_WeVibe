import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto } from 'src/modules/auth/dtos/register.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { TYPE_STATUS } from 'src/shared/constants/status.const';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const user = new User();
    user.mName = registerDto.mName;
    user.mPassword = registerDto.mPassword;
    user.mEmail = registerDto.mEmail;
    user.mAddress = registerDto.mAddress;
    user.mPhone = registerDto.mPhone;
    user.mGender = registerDto.mGender;
    user.mStatus = TYPE_STATUS.ACTIVE;
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(mName: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { mName } });
    return user;
  }

  async find(mUserId: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { mUserId } });
    return user;
  }

  toUpdateUserDto(user: User): UpdateUserDto {
    const updateUserDto = new UpdateUserDto();
    updateUserDto.mName = user.mName;
    updateUserDto.mEmail = user.mEmail;
    updateUserDto.mGender = user.mGender;
    updateUserDto.mAddress = user.mAddress;
    updateUserDto.mPhone = user.mPhone;
    updateUserDto.mPassword = user.mPassword;
    updateUserDto.mStatus = user.mStatus;
    return updateUserDto;
  }
}
