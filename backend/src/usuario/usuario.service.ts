import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordService } from '../auth/password.service';
import { TokenService } from '../auth/token.service';
import { JsonDatabaseService } from '../database/json-database.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';
const digits=(v:any)=>String(v||'').replace(/\D/g,''); const mail=(v:any)=>String(v||'').trim().toLowerCase();
type TipoLogin = 'empresa'|'usina'|'pessoa_fisica';
@Injectable()
export class UsuarioService { constructor(private db:JsonDatabaseService,private passwords:PasswordService,private tokens:TokenService) {}
  private safe(u:any){ if(!u)return u; const { senhaHash, senha, confirmarSenha, confirmar_senha, ...safe } = u; return safe; }
  buscarPorId(idUsuario:any){ return this.db.findOne<any>('usuarios',u=>String(u.idUsuario)===String(idUsuario)).then(u=>u&&this.safe(u)); }
  buscarPorEmail(email:string){ return this.db.findOne<any>('usuarios',u=>u.email===mail(email)).then(u=>u&&this.safe(u)); }
  buscarPorTipo(tipoUsuario:string){ return this.db.filter<any>('usuarios',u=>u.tipoUsuario===tipoUsuario).then(r=>r.map(u=>this.safe(u))); }
  buscarPorStatus(status:string){ return this.db.filter<any>('usuarios',u=>u.status===status).then(r=>r.map(u=>this.safe(u))); }
  buscarEmailComSenha(email:string){ return this.db.findOne<any>('usuarios',u=>u.email===mail(email)); }
  async cadastrar(dto:CreateUsuarioDto,tipoUsuario:TipoLogin){
    const email=mail(dto.email), cnpj=digits((dto as any).cnpj), cpf=digits((dto as any).cpf), telefone=digits((dto as any).telefone), senha=String((dto as any).senha||''), confirmar=String((dto as any).confirmarSenha||(dto as any).confirmar_senha||'');
    if(!email||!senha||senha.length<6) throw new BadRequestException('E-mail e senha com no minimo 6 caracteres sao obrigatorios.');
    if(confirmar && senha!==confirmar) throw new BadRequestException('Senha e confirmacao devem ser iguais.');
    if(tipoUsuario==='pessoa_fisica'){ if(!String((dto as any).nome||'').trim()) throw new BadRequestException('Nome e obrigatorio.'); if(cpf.length!==11) throw new BadRequestException('CPF invalido.'); } else if(cnpj.length!==14) throw new BadRequestException('CNPJ invalido.');
    if(await this.db.findOne<any>('usuarios',u=>u.email===email)) throw new ConflictException('E-mail já cadastrado.');
    if(tipoUsuario==='empresa' && await this.db.findOne<any>('empresas',e=>e.cnpj===cnpj)) throw new ConflictException('CNPJ já cadastrado.');
    if(tipoUsuario==='usina' && await this.db.findOne<any>('usinas',e=>e.cnpj===cnpj)) throw new ConflictException('CNPJ já cadastrado.');
    if(tipoUsuario==='pessoa_fisica' && await this.db.findOne<any>('pessoas-fisicas',p=>p.cpf===cpf)) throw new ConflictException('CPF já cadastrado.');
    const now=new Date().toISOString(); const usuario:any={id:this.db.newId(),idUsuario:this.db.newId(),nome:(dto as any).nome||(dto as any).razaoSocial,email,senhaHash:await this.passwords.hash(senha),tipoUsuario,status:'ativo',criadoEm:now,atualizadoEm:now};
    const usuarios=await this.db.readAll<any>('usuarios'); usuarios.push(usuario);
    if(tipoUsuario==='pessoa_fisica'){ const pessoas=await this.db.readAll<any>('pessoas-fisicas'); const pf={id:this.db.newId(),idPessoaFisica:this.db.newId(),idUsuario:usuario.idUsuario,nome:usuario.nome,cpf,email,telefone,criadoEm:now,atualizadoEm:now}; usuario.pessoaFisicaId=pf.idPessoaFisica; pessoas.push(pf); await this.db.transaction([{collection:'usuarios',data:usuarios},{collection:'pessoas-fisicas',data:pessoas}]); return { message:'Cadastro realizado com sucesso.', usuario:this.safe(usuario) }; }
    const base={id:this.db.newId(),cnpj,email,telefone,razaoSocial:(dto as any).razaoSocial||(dto as any).nome,nomeFantasia:(dto as any).nomeFantasia||(dto as any).nome,responsavel:(dto as any).responsavel,statusValidacao:'pendente',criadoEm:now,atualizadoEm:now};
    if(tipoUsuario==='empresa'){ const empresas=await this.db.readAll<any>('empresas'); const empresa={...base,idEmpresa:this.db.newId(),idUsuario:usuario.idUsuario,cargoResponsavel:(dto as any).cargo}; usuario.empresaId=empresa.idEmpresa; empresas.push(empresa); await this.db.transaction([{collection:'usuarios',data:usuarios},{collection:'empresas',data:empresas}]); }
    if(tipoUsuario==='usina'){ const usinas=await this.db.readAll<any>('usinas'); const usina={...base,idUsina:this.db.newId(),idUsuario:usuario.idUsuario,especialidade:(dto as any).especialidade}; usuario.usinaId=usina.idUsina; usinas.push(usina); await this.db.transaction([{collection:'usuarios',data:usuarios},{collection:'usinas',data:usinas}]); }
    return { message:'Cadastro realizado com sucesso.', usuario:this.safe(usuario) };
  }
  private mensagemTipo(tipoUsuario:string){ if(tipoUsuario==='empresa') return 'Esta conta pertence a uma empresa.'; if(tipoUsuario==='usina') return 'Esta conta pertence a uma usina.'; if(tipoUsuario==='pessoa_fisica') return 'Esta conta pertence a uma pessoa fisica.'; return 'Esta conta nao pertence a esta area de login.'; }
  async loginArea(dto:LoginDto, area:TipoLogin){ const usuario=await this.buscarEmailComSenha(dto.email); if(!usuario) throw new UnauthorizedException('Usuário não encontrado.'); if(usuario.status&&usuario.status!=='ativo') throw new ForbiddenException('Usuario inativo.'); if(!await this.passwords.compare(String(dto.senha||''), usuario.senhaHash)) throw new UnauthorizedException('E-mail ou senha inválidos.'); let vinculo:any=null; if(area==='pessoa_fisica'){ if(usuario.tipoUsuario!=='pessoa_fisica') throw new ForbiddenException(this.mensagemTipo(usuario.tipoUsuario)); vinculo=await this.db.findOne<any>('pessoas-fisicas',p=>String(p.idUsuario)===String(usuario.idUsuario)); } else { if(usuario.tipoUsuario===area) vinculo= area==='empresa'? await this.db.findOne<any>('empresas',e=>String(e.idUsuario)===String(usuario.idUsuario)):await this.db.findOne<any>('usinas',u=>String(u.idUsuario)===String(usuario.idUsuario)); if(!vinculo){ const f=await this.db.findOne<any>('funcionarios',f=>String(f.idUsuario)===String(usuario.idUsuario)&&String(f.status).toLowerCase()==='ativo'); if(f && ((area==='empresa'&&f.idEmpresa)||(area==='usina'&&f.idUsina))) vinculo=f; } if(!vinculo) throw new ForbiddenException(this.mensagemTipo(usuario.tipoUsuario)); if(area==='usina' && await this.db.findOne<any>('bloqueios-usina',b=>String(b.idUsina)===String(vinculo.idUsina)&&b.ativo)) throw new ForbiddenException('Usina bloqueada.'); }
    const accessToken=this.tokens.sign({sub:usuario.idUsuario,tipoUsuario:usuario.tipoUsuario}); const response:any={accessToken,access_token:accessToken,tipoUsuario:usuario.tipoUsuario,nome:usuario.nome,usuario:this.safe(usuario)}; if(area!=='pessoa_fisica') response[area]=vinculo; return response; }
}
