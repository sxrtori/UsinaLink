import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PasswordService } from '../auth/password.service';
import { TokenService } from '../auth/token.service';
import { BloqueioUsina, Empresa, EnderecoEmpresa, EnderecoUsina, Funcionario, Usuario, Usina } from '../common/entities/core.entities';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';
const digits=(v:any)=>String(v||'').replace(/\D/g,''); const mail=(v:any)=>String(v||'').trim().toLowerCase();
@Injectable()
export class UsuarioService {
  constructor(@InjectDataSource() private ds:DataSource,@InjectRepository(Usuario) private usuarios:Repository<Usuario>,@InjectRepository(Empresa) private empresas:Repository<Empresa>,@InjectRepository(Usina) private usinas:Repository<Usina>,@InjectRepository(Funcionario) private funcionarios:Repository<Funcionario>,@InjectRepository(BloqueioUsina) private bloqueios:Repository<BloqueioUsina>,private passwords:PasswordService,private tokens:TokenService) {}
  private safe(u:Usuario){ const { senhaHash, ...safe } = u as any; return safe; }
  buscarPorId(idUsuario:number){ return this.usuarios.findOne({ where:{ idUsuario } }).then(u=>u&&this.safe(u)); }
  buscarPorEmail(email:string){ return this.usuarios.findOne({ where:{ email:mail(email) } }).then(u=>u&&this.safe(u)); }
  buscarPorTipo(tipoUsuario:string){ return this.usuarios.find({ where:{ tipoUsuario } }).then(r=>r.map(u=>this.safe(u))); }
  buscarPorStatus(status:string){ return this.usuarios.find({ where:{ status } }).then(r=>r.map(u=>this.safe(u))); }
  buscarEmailComSenha(email:string){ return this.usuarios.createQueryBuilder('u').addSelect('u.senhaHash').where('u.email = :email',{email:mail(email)}).getOne(); }
  async cadastrar(dto:CreateUsuarioDto,tipoUsuario:string){
    const email=mail(dto.email), cnpj=digits((dto as any).cnpj), senha=String((dto as any).senha||''), confirmar=String((dto as any).confirmarSenha||(dto as any).confirmar_senha||'');
    if(!email||!senha||senha.length<6) throw new BadRequestException('E-mail e senha com no minimo 6 caracteres sao obrigatorios.');
    if(confirmar && senha!==confirmar) throw new BadRequestException('Senha e confirmacao devem ser iguais.');
    if(cnpj.length!==14) throw new BadRequestException('CNPJ invalido.');
    if(await this.usuarios.findOne({where:{email}})) throw new ConflictException('E-mail ja cadastrado.');
    if(tipoUsuario==='empresa' && await this.empresas.findOne({where:{cnpj}})) throw new ConflictException('CNPJ ja cadastrado.');
    if(tipoUsuario==='usina' && await this.usinas.findOne({where:{cnpj}})) throw new ConflictException('CNPJ ja cadastrado.');
    return this.ds.transaction(async m=>{
      const usuario=await m.save(Usuario,{nome:(dto as any).nome||(dto as any).razaoSocial,email,senhaHash:await this.passwords.hash(senha),tipoUsuario,status:'ativo'});
      const base={cnpj,email,telefone:digits((dto as any).telefone),razaoSocial:(dto as any).razaoSocial,nomeFantasia:(dto as any).nomeFantasia||(dto as any).nome,responsavel:(dto as any).responsavel};
      if(tipoUsuario==='empresa') { const empresa=await m.save(Empresa,{...base,idUsuario:usuario.idUsuario,cargoResponsavel:(dto as any).cargo}); await m.save(EnderecoEmpresa,{idEmpresa:empresa.idEmpresa,cep:(dto as any).cep,rua:(dto as any).rua,numero:(dto as any).numero,bairro:(dto as any).bairro,cidade:(dto as any).cidade,estado:(dto as any).estado,pais:(dto as any).pais||'Brasil'}); }
      if(tipoUsuario==='usina') { const usina=await m.save(Usina,{...base,idUsuario:usuario.idUsuario,especialidade:(dto as any).especialidade}); await m.save(EnderecoUsina,{idUsina:usina.idUsina,cep:(dto as any).cep,rua:(dto as any).rua,numero:(dto as any).numero,bairro:(dto as any).bairro,cidade:(dto as any).cidade,estado:(dto as any).estado,pais:(dto as any).pais||'Brasil'}); }
      return this.safe(usuario);
    });
  }
  async loginArea(dto:LoginDto, area:'empresa'|'usina'){
    const usuario=await this.buscarEmailComSenha(dto.email); if(!usuario) throw new UnauthorizedException('Credenciais invalidas.');
    if(usuario.status!=='ativo') throw new ForbiddenException('Usuario inativo.');
    if(!await this.passwords.compare(String(dto.senha||''), usuario.senhaHash)) throw new UnauthorizedException('Credenciais invalidas.');
    let vinculo:any=null;
    if(usuario.tipoUsuario===area) vinculo= area==='empresa'? await this.empresas.findOne({where:{idUsuario:usuario.idUsuario}}):await this.usinas.findOne({where:{idUsuario:usuario.idUsuario}});
    if(!vinculo){ const f=await this.funcionarios.findOne({where:{idUsuario:usuario.idUsuario,status:'ativo'}}); if(f && ((area==='empresa'&&f.idEmpresa)||(area==='usina'&&f.idUsina))) vinculo=f; }
    if(!vinculo) throw new ForbiddenException('Esta conta nao pertence a esta area de login.');
    if(area==='usina'){ const idUsina=vinculo.idUsina; if(await this.bloqueios.findOne({where:{idUsina,ativo:true}})) throw new ForbiddenException('Usina bloqueada.'); }
    const accessToken=this.tokens.sign({sub:usuario.idUsuario,tipoUsuario:usuario.tipoUsuario});
    return { accessToken, tipoUsuario: usuario.tipoUsuario, nome: usuario.nome, usuario: this.safe(usuario), [area]: vinculo };
  }
}
