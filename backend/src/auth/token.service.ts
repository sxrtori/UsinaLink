import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';

const b64 = (data: unknown) => Buffer.from(JSON.stringify(data)).toString('base64url');
@Injectable()
export class TokenService {
  constructor(private readonly config: ConfigService) {}
  sign(payload: Record<string, unknown>) {
    const body = { ...payload, iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000)+86400 };
    const head = b64({ alg: 'HS256', typ: 'JWT' }); const pay = b64(body);
    const sig = createHmac('sha256', this.secret()).update(`${head}.${pay}`).digest('base64url');
    return `${head}.${pay}.${sig}`;
  }
  verify(token: string) {
    const [h,p,s] = token.split('.');
    const sig = createHmac('sha256', this.secret()).update(`${h}.${p}`).digest('base64url');
    if (sig !== s) throw new UnauthorizedException('Token invalido.');
    const payload = JSON.parse(Buffer.from(p, 'base64url').toString());
    if (payload.exp && payload.exp < Math.floor(Date.now()/1000)) throw new UnauthorizedException('Token expirado.');
    return payload;
  }
  private secret() { return this.config.get<string>('JWT_SECRET') || 'usinalink-dev-secret'; }
}
