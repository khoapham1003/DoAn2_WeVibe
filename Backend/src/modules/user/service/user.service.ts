import { ForgotPasswordDto } from './../../auth/dtos/forgotpassword.dto';
import { ChangePasswordDto } from './../dto/changepassword-user.dto';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async find(UserId: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { UserId } });
    return user;
  }
  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findbyEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return;
    }
    return user;
  }
  async updateLastLogin(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { UserId: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const originalRegisteredAt = user.registeredAt;
    const originalLastLogin = user.lastLogin;

    user.lastLogin = new Date().toISOString();

    await this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.find(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (
      updateUserDto.firstName === undefined ||
      updateUserDto.middleName === undefined ||
      updateUserDto.lastName === undefined ||
      updateUserDto.phoneNumber === undefined
    ) {
      throw new UnauthorizedException('Update data is required');
    }
    const updatedUser = this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(updatedUser);
  }

  async forgotPassword(email: string, passwordHash: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    user.passwordHash = passwordHash;
    return this.userRepository.save(user);
  }

  async changepassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<User> {
    // Tìm người dùng theo ID
    const user = await this.find(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const isMatch = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.passwordHash,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu cũ không đúng!');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.password, 10);

    user.passwordHash = hashedPassword;

    await this.userRepository.save(user);

    return user;
  }

  async delete(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
