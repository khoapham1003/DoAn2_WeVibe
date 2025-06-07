import { UserModule } from './../user/user.module';
import { AuthController } from './Controller/auth.controller';
import { Module } from '@nestjs/common';
import { AuthService } from './Service/auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { jwtConstants } from 'src/shared/constants/constants';
import { CartModule } from '../cart/cart.module';
import { AuthProxyService } from './Service/auth.proxy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    CartModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      global: true,
      signOptions: {
        expiresIn: '1 hour',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthProxyService, LocalStrategy, JwtStrategy],
  exports: [AuthService, AuthProxyService],
})
export class AuthModule {}
