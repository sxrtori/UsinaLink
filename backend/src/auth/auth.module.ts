import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { JwtAuthGuard } from './jwt-auth.guard';
@Module({ providers: [PasswordService, TokenService, JwtAuthGuard], exports: [PasswordService, TokenService, JwtAuthGuard] })
export class AuthModule {}
