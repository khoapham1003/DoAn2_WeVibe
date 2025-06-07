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
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { AuthProxyService } from '../Service/auth.proxy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authProxyService: AuthProxyService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() loginDto: LoginDto) {
    return this.authProxyService.signIn(loginDto.Email, loginDto.Password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgotPassword')
  ForgotPassword(@Body() ForgotPasswordDto: ForgotPasswordDto) {
    return this.authProxyService.forgotPassword(ForgotPasswordDto);
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('login-admin')
  // signInAdmin(@Body() loginDto: LoginDto) {
  //   return this.authProxyService.signInAdmin(loginDto.Email, loginDto.Password);
  // }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authProxyService.register(registerDto);
  }
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
