import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtEmailGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const token = req.body?.token || req.query?.token;

    try {
      const secret = this.configService.get<string>('jwt_secret');
      const payload = this.jwtService.verify(token, { secret });
      // attaching the emailpayload for a later use
      (req as any).payload = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired email token');
    }
  }
}
