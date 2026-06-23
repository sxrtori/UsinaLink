import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { PasswordService } from '../auth/password.service';
import { TokenService } from '../auth/token.service';
import { Usuario, Empresa, Usina, Funcionario, BloqueioUsina } from '../common/entities/core.entities';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';
const digits=(v:any)=>String(v||'').replace(/\D/g,''); const mail=(v:any)=>String(v||'').trim().toLowerCase();
type TipoLogin = 'empresa'|'usina'|'pessoa_fisica';
@Injectable()
export class UsuarioService { 
  constructor(
    @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
    @InjectRepository(Empresa) private empresaRepo: Repository<Empresa>,
    @InjectRepository(Usina) private usinaRepo: Repository<Usina>,
    @InjectRepository(Funcionario) private funcionarioRepo: Repository<Funcionario>,
    @InjectRepository(BloqueioUsina) private bloqueioRepo: Repository<BloqueioUsina>,
    private passwords: PasswordService,
    private tokens: TokenService
  ) {}
  private safe(u: any){ if(!u)return u; const { senhaHash, senha, confirmarSenha, confirmar_senha, ...safe } = u; return safe; }
  async buscarPorId(idUsuario: number){ const usuario = await this.usuarioRepo.findOne({ where: { idUsuario } }); return usuario ? this.safe(usuario) : null; }
  async buscarPorEmail(email: string){ const usuario = await this.usuarioRepo.findOne({ where: { email: mail(email) } }); return usuario ? this.safe(usuario) : null; }
  async buscarPorTipo(tipoUsuario: string){ const usuarios = await this.usuarioRepo.find({ where: { tipoUsuario } }); return usuarios.map(u => this.safe(u)); }
  async buscarPorStatus(status: string){ const usuarios = await this.usuarioRepo.find({ where: { status } }); return usuarios.map(u => this.safe(u)); }
  async buscarEmailComSenha(email: string){ return await this.usuarioRepo.findOne({ where: { email: mail(email) }, select: ['idUsuario', 'email', 'senhaHash', 'tipoUsuario', 'status', 'nome'] }); }
  async cadastrar(dto: CreateUsuarioDto, tipoUsuario: TipoLogin) {
    const email = mail(dto.email), cnpj = digits((dto as any).cnpj), cpf = digits((dto as any).cpf), telefone = digits((dto as any).telefone), senha = String((dto as any).senha || ''), confirmar = String((dto as any).confirmarSenha || (dto as any).confirmar_senha || '');
    if (!email || !senha || senha.length < 6) throw new BadRequestException('E-mail e senha com no minimo 6 caracteres sao obrigatorios.');
    if (confirmar && senha !== confirmar) throw new BadRequestException('Senha e confirmacao devem ser iguais.');
    if (tipoUsuario === 'pessoa_fisica') { if (!String((dto as any).nome || '').trim()) throw new BadRequestException('Nome e obrigatorio.'); if (cpf.length !== 11) throw new BadRequestException('CPF invalido.'); } else if (cnpj.length !== 14) throw new BadRequestException('CNPJ invalido.');
    
    if (await this.usuarioRepo.findOne({ where: { email } })) throw new ConflictException('E-mail já cadastrado.');
    if (tipoUsuario === 'empresa' && await this.empresaRepo.findOne({ where: { cnpj } })) throw new ConflictException('CNPJ já cadastrado.');
    if (tipoUsuario === 'usina' && await this.usinaRepo.findOne({ where: { cnpj } })) throw new ConflictException('CNPJ já cadastrado.');
    
    const usuario = this.usuarioRepo.create({
      nome: (dto as any).nome || (dto as any).razaoSocial,
      email,
      senhaHash: await this.passwords.hash(senha),
      tipoUsuario,
      status: 'ativo'
    });
    
    const savedUsuario = await this.usuarioRepo.save(usuario);
    
    if (tipoUsuario === 'pessoa_fisica') {
      // Implementar pessoa física se necessário
      return { message: 'Cadastro realizado com sucesso.', usuario: this.safe(savedUsuario) };
    }
    
    const baseData = {
      cnpj,
      email,
      telefone,
      razaoSocial: (dto as any).razaoSocial || (dto as any).nome,
      nomeFantasia: (dto as any).nomeFantasia || (dto as any).nome,
      responsavel: (dto as any).responsavel,
      statusValidacao: 'pendente'
    };
    
    if (tipoUsuario === 'empresa') {
      const empresa = this.empresaRepo.create({
        ...baseData,
        idUsuario: savedUsuario.idUsuario,
        cargoResponsavel: (dto as any).cargo
      });
      await this.empresaRepo.save(empresa);
    }
    
    if (tipoUsuario === 'usina') {
      const usina = this.usinaRepo.create({
        ...baseData,
        idUsuario: savedUsuario.idUsuario,
        especialidade: (dto as any).especialidade
      });
      await this.usinaRepo.save(usina);
    }
    
    return { message: 'Cadastro realizado com sucesso.', usuario: this.safe(savedUsuario) };
  }
  private mensagemTipo(tipoUsuario: string){ 
    if(tipoUsuario === 'empresa') return 'Esta conta pertence a uma empresa.'; 
    if(tipoUsuario === 'usina') return 'Esta conta pertence a uma usina.'; 
    if(tipoUsuario === 'pessoa_fisica') return 'Esta conta pertence a uma pessoa fisica.'; 
    return 'Esta conta nao pertence a esta area de login.'; 
  }
  
  async loginArea(dto: LoginDto, area: TipoLogin) {
    const usuario = await this.buscarEmailComSenha(dto.email);
    if(!usuario) throw new UnauthorizedException('Usuário não encontrado.');
    if(usuario.status && usuario.status !== 'ativo') throw new ForbiddenException('Usuario inativo.');
    if(!await this.passwords.compare(String(dto.senha || ''), usuario.senhaHash)) throw new UnauthorizedException('E-mail ou senha inválidos.');
    
    let vinculo: any = null;
    
    if(area === 'pessoa_fisica') {
      if(usuario.tipoUsuario !== 'pessoa_fisica') throw new ForbiddenException(this.mensagemTipo(usuario.tipoUsuario));
      // Implementar pessoa física se necessário
    } else {
      if(usuario.tipoUsuario === area) {
        vinculo = area === 'empresa' 
          ? await this.empresaRepo.findOne({ where: { idUsuario: usuario.idUsuario } })
          : await this.usinaRepo.findOne({ where: { idUsuario: usuario.idUsuario } });
      }
      
      if(!vinculo) {
        const funcionario = await this.funcionarioRepo.findOne({ 
          where: { 
            idUsuario: usuario.idUsuario, 
            status: 'ativo',
            ...(area === 'empresa' ? { idEmpresa: Not(IsNull()) } : { idUsina: Not(IsNull()) })
          }
        });
        if(funcionario && ((area === 'empresa' && funcionario.idEmpresa) || (area === 'usina' && funcionario.idUsina))) {
          vinculo = funcionario;
        }
      }
      
      if(!vinculo) throw new ForbiddenException(this.mensagemTipo(usuario.tipoUsuario));
      
      if(area === 'usina') {
        const bloqueio = await this.bloqueioRepo.findOne({ 
          where: { idUsina: vinculo.idUsina, ativo: true } 
        });
        if(bloqueio) throw new ForbiddenException('Usina bloqueada.');
      }
    }
    
    const accessToken = this.tokens.sign({ sub: usuario.idUsuario, tipoUsuario: usuario.tipoUsuario });
    const response: any = {
      accessToken, 
      access_token: accessToken, 
      tipoUsuario: usuario.tipoUsuario, 
      nome: usuario.nome, 
      usuario: this.safe(usuario)
    };
    
    if(area !== 'pessoa_fisica') response[area] = vinculo;
    return response;
  }

  async listarUsuarios() {
    const usuarios = await this.usuarioRepo.find();
    return usuarios.map(u => this.safe(u));
  }
  
}
