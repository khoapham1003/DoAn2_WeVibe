import {  ForgotPasswordDto } from './../dtos/forgotpassword.dto';
import { UserService } from './../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { CartService } from 'src/modules/cart/service/cart.service';
import { CreateCartDto } from 'src/modules/cart/dto/create-cart.dto';
import { CART_STATUS } from 'src/shared/constants/status.const';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private cartService: CartService,
    private jwtService: JwtService,
  ) {}
  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);
    const isPasswordValid =
      user && (await bcrypt.compare(pass, user.passwordHash));
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    await this.usersService.updateLastLogin(user.UserId);
    const cartId = this.cartService.findbyUserId(user.UserId);

    const payload = { UserId: user.UserId, email: user.email, role: user.admin == true ? 'admin' : 'user', CartId: (await cartId).id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  
  // async signInAdmin(
  //   username: string,
  //   pass: string,
  // ): Promise<{ access_token: string }> {
  //   const user = await this.adminsService.findOne(username);
  //   const isPasswordValid =
  //     user && (await bcrypt.compare(pass, user.mPassword));
  //   if (!isPasswordValid) {
  //     throw new UnauthorizedException('Invalid username or password');
  //   }
  //   const payload = { sub: user.mAdminId, username: user.mName, role: 'Admin' };
  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //   };
  // }
  async register(registerDto: RegisterDto) {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new UnauthorizedException('Passwords do not match');
    }

    if (!this.isValidEmail(registerDto.email)) {
      throw new BadRequestException('Invalid email address');
    }

    const existingUser = await this.usersService.findbyEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      passwordHash: hashedPassword,
    });
    const createCartDto: CreateCartDto = {
      userId: user.UserId,
      status: CART_STATUS.EMPTY,
    };

    await this.cartService.create(createCartDto);
    return {
      message: 'Register successfully',
    };
  }

  async validateUserAndPassword(mName: string, mPassword: string) {
    const user = await this.usersService.findOne(mName);
    if (user && (await bcrypt.compare(mPassword, user.passwordHash))) {
      return user;
    }
    return null;
  }

  async  forgotPassword(ForgotPasswordDto: ForgotPasswordDto) {
    const { Email, Password, confirmPassword } = ForgotPasswordDto;

    if (Password !== confirmPassword) {
      throw new UnauthorizedException('Passwords do not match');
    }
  
    if (!this.isValidEmail(Email)) {
      throw new BadRequestException('Invalid email address');
    }
  
    const existingUser = await this.usersService.findByEmail(Email);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Truyền đúng tham số vào usersService
    await this.usersService.forgotPassword(Email, hashedPassword);
  
    return { message: 'Password reset successfully' };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
