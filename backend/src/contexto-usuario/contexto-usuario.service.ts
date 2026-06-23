import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa, Usina, Funcionario } from '../common/entities/core.entities';

@Injectable()
export class ContextoUsuarioService {
  constructor(
    @InjectRepository(Empresa) private empresaRepo: Repository<Empresa>,
    @InjectRepository(Usina) private usinaRepo: Repository<Usina>,
    @InjectRepository(Funcionario) private funcionarioRepo: Repository<Funcionario>
  ) {}

  async obterEmpresaId(idUsuario: any) {
    const empresa = await this.empresaRepo.findOne({ where: { idUsuario } });
    if (empresa) return empresa.idEmpresa;
    
    const funcionario = await this.funcionarioRepo.findOne({ 
      where: { idUsuario, status: 'ativo' } 
    });
    if (funcionario?.idEmpresa) return funcionario.idEmpresa;
    
    throw new ForbiddenException('Usuario sem vinculo ativo com empresa.');
  }

  async obterUsinaId(idUsuario: any) {
    const usina = await this.usinaRepo.findOne({ where: { idUsuario } });
    if (usina) return usina.idUsina;
    
    const funcionario = await this.funcionarioRepo.findOne({ 
      where: { idUsuario, status: 'ativo' } 
    });
    if (funcionario?.idUsina) return funcionario.idUsina;
    
    throw new ForbiddenException('Usuario sem vinculo ativo com usina.');
  }
}
