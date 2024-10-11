import { UserService } from './../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { AdminService } from 'src/modules/admin/service/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private adminsService: AdminService,
  ) {}
  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);
    const isPasswordValid =
      user && (await bcrypt.compare(pass, user.mPassword));
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const payload = { sub: user.mUserId, username: user.mName, role: 'User' };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async signInAdmin(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.adminsService.findOne(username);
    const isPasswordValid =
      user && (await bcrypt.compare(pass, user.mPassword));
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const payload = { sub: user.mAdminId, username: user.mName, role: 'Admin' };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async register(registerDto: RegisterDto) {
    if (registerDto.mPassword !== registerDto.mComfirmPassword) {
      throw new UnauthorizedException('Passwords do not match');
    }

    if (!this.isValidEmail(registerDto.mEmail)) {
      throw new BadRequestException('Invalid email address');
    }
    const hashedPassword = await bcrypt.hash(registerDto.mPassword, 10);
    const user = await this.usersService.create({
      ...registerDto,
      mPassword: hashedPassword,
    });
    return {
      message: 'Register successfully',
      user,
    };
  }

  async validateUserAndPassword(mName: string, mPassword: string) {
    const user = await this.usersService.findOne(mName);
    if (user && (await bcrypt.compare(mPassword, user.mPassword))) {
      return user;
    }
    return null;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
