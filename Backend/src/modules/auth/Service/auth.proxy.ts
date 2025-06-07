import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { ForgotPasswordDto } from '../dtos/forgotpassword.dto';

@Injectable()
export class AuthProxyService {
  constructor(private readonly authService: AuthService) {}

  async signIn(email: string, pass: string) {
    try {
    const startTime = new Date();
    console.log(`[Proxy] [${startTime.toISOString()}] Bắt đầu đăng nhập: ${email}`);
    const signIn = await this.authService.signIn(email, pass);
    const endTime = new Date();
    console.log(`[Proxy] [${endTime.toISOString()}] Đăng nhập thành công: ${email}`);
    return signIn;
    } catch (e) {
    const errorTime = new Date();
    console.error(`[Proxy] [${errorTime.toISOString()}] Đăng nhập thất bại: ${email} | Lỗi: ${e.message}`);
    throw e;
    }

  }

    async register(dto: RegisterDto) {
    const startTime = new Date();
    console.log(`[Proxy] [${startTime.toISOString()}] Bắt đầu đăng ký: ${dto.email}`);

    try {
        const result = await this.authService.register(dto);
        const endTime = new Date();
        console.log(`[Proxy] [${endTime.toISOString()}] Đăng ký thành công: ${dto.email}`);
        return result;
    } catch (e) {
        const errorTime = new Date();
        console.error(`[Proxy] [${errorTime.toISOString()}] Đăng ký thất bại: ${dto.email} | Lỗi: ${e.message}`);
        throw e;
    }
    }

    async forgotPassword(dto: ForgotPasswordDto) {
    const startTime = new Date();
    console.log(`[Proxy] [${startTime.toISOString()}] Yêu cầu quên mật khẩu: ${dto.Email}`);

    try {
        const result = await this.authService.forgotPassword(dto);
        const endTime = new Date();
        console.log(`[Proxy] [${endTime.toISOString()}] Đặt lại mật khẩu thành công cho: ${dto.Email}`);
        return result;
    } catch (e) {
        const errorTime = new Date();
        console.error(`[Proxy] [${errorTime.toISOString()}] Đặt lại mật khẩu thất bại: ${dto.Email} | Lỗi: ${e.message}`);
        throw e;
    }
    }

}