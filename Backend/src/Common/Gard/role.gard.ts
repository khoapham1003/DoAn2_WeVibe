import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // Không yêu cầu vai trò, cho phép truy cập
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Middleware JWT đã gắn `user` vào `request`
    console.log(user);
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have permission to access this resource.');
    }

    return true; // Vai trò hợp lệ, cho phép truy cập
  }

  
}
