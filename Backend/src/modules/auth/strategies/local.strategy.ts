import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../Service/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'mName',
    });
  }
  validate(mName: string, mPassword: string) {
    const user = this.authService.validateUserAndPassword(mName, mPassword);
    if (!user) {
      throw new UnauthorizedException(`User is not authorized`);
    }
    return user;
  }
}
