import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { normalizeEmail, normalizeTipo } from '../services/validators';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly db: DatabaseService) {}

  @Post('login')
  login(@Body() body: any) {
    const email = normalizeEmail(body.email);
    const senha = String(body.senha || '');
    const tipo = normalizeTipo(body.tipo);

    if (!email || !senha || !tipo) throw new HttpException({ message: 'E-mail, senha e tipo sao obrigatorios.' }, HttpStatus.BAD_REQUEST);

    const user = this.db.getUsuarios().find((item: any) => item.email === email);
    if (!user) throw new HttpException({ message: 'Usuario nao encontrado' }, HttpStatus.NOT_FOUND);
    if (user.senha !== senha) throw new HttpException({ message: 'Senha incorreta' }, HttpStatus.UNAUTHORIZED);
    if (user.tipo !== tipo) throw new HttpException({ message: 'Esta conta nao pertence a esta area de login' }, HttpStatus.FORBIDDEN);

    const { senha: _senha, ...safeUser } = user;
    return { message: 'Login realizado com sucesso.', user: safeUser };
  }
}
