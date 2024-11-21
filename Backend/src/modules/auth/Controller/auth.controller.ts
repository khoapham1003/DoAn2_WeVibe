import { ForgotPasswordDto } from './../dtos/forgotpassword.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/gruards';
import { AuthService } from '../Service/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService
    
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto.Email, loginDto.Password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgotPassword')
  ForgotPassword(@Body() ForgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(ForgotPasswordDto);
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('login-admin')
  // signInAdmin(@Body() loginDto: LoginDto) {
  //   return this.authService.signInAdmin(loginDto.Email, loginDto.Password);
  // }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
