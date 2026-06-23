import { ForbiddenException, Injectable } from '@nestjs/common';
import { JsonDatabaseService } from '../database/json-database.service';
@Injectable()
export class ContextoUsuarioService { constructor(private readonly db: JsonDatabaseService) {}
  async obterEmpresaId(idUsuario: any) { const empresa:any = await this.db.findOne('empresas', (e:any)=>String(e.idUsuario)===String(idUsuario)); if (empresa) return empresa.idEmpresa; const f:any = await this.db.findOne('funcionarios',(x:any)=>String(x.idUsuario)===String(idUsuario)&&String(x.status).toLowerCase()==='ativo'); if (f?.idEmpresa) return f.idEmpresa; throw new ForbiddenException('Usuario sem vinculo ativo com empresa.'); }
  async obterUsinaId(idUsuario: any) { const usina:any = await this.db.findOne('usinas', (u:any)=>String(u.idUsuario)===String(idUsuario)); if (usina) return usina.idUsina; const f:any = await this.db.findOne('funcionarios',(x:any)=>String(x.idUsuario)===String(idUsuario)&&String(x.status).toLowerCase()==='ativo'); if (f?.idUsina) return f.idUsina; throw new ForbiddenException('Usuario sem vinculo ativo com usina.'); }
}
