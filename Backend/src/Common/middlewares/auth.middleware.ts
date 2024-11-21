import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { jwtConstants } from 'src/shared/constants/constants';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];

    // Kiểm tra nếu không có token hoặc token không hợp lệ
    if (!token || !this.validateToken(token)) {
      throw new UnauthorizedException('Invalid or missing token');
    }
    const user = this.getUserFromToken(token);
    // Gắn thông tin người dùng vào request (nếu cần)
    // Bạn có thể thay đổi thông tin người dùng dựa trên token đã xác thực
    req['user'] = user; // Đây là một ví dụ

    next();
  }
  private getUserFromToken(token: string): any {
    const secretKey = jwtConstants.secret;
    const formattedToken = token.replace('Bearer ', '');
    const decoded = jwt.verify(formattedToken, secretKey);

    // Trích xuất thông tin từ payload của token
    return {
      userId: decoded['sub'], // Lấy `sub` làm `userId`
      email: decoded['email'], // Lấy email
      role: decoded['role'], // Lấy vai trò (role)
    };
  }

  private validateToken(token: string): boolean {
    try {
      const secretKey = jwtConstants.secret;

      // Loại bỏ "Bearer " khỏi token (nếu có)
      const formattedToken = token.replace('Bearer ', '');

      const decoded = jwt.verify(formattedToken, secretKey);
      console.log('Decoded token:', decoded);

      return true; // Token hợp lệ
    } catch (error) {
      console.error('Token validation error:', error);
      return false; // Token không hợp lệ
    }
  }
}
