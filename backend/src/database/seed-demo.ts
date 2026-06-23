import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordService } from '../auth/password.service';
import { 
  Usuario, 
  Empresa, 
  Usina, 
  Funcionario, 
  Pedido, 
  Proposta, 
  AvaliacaoEntrega, 
  Pagamento, 
  Notificacao 
} from '../common/entities/core.entities';

@Injectable()
export class SeedDemoService implements OnModuleInit {
  constructor(
    @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
    @InjectRepository(Empresa) private empresaRepo: Repository<Empresa>,
    @InjectRepository(Usina) private usinaRepo: Repository<Usina>,
    @InjectRepository(Funcionario) private funcionarioRepo: Repository<Funcionario>,
    @InjectRepository(Pedido) private pedidoRepo: Repository<Pedido>,
    @InjectRepository(Proposta) private propostaRepo: Repository<Proposta>,
    @InjectRepository(AvaliacaoEntrega) private avaliacaoRepo: Repository<AvaliacaoEntrega>,
    @InjectRepository(Pagamento) private pagamentoRepo: Repository<Pagamento>,
    @InjectRepository(Notificacao) private notificacaoRepo: Repository<Notificacao>,
    private readonly passwords: PasswordService
  ) {}
  async onModuleInit() {
    // Verificar se já existem dados
    const usuarioCount = await this.usuarioRepo.count();
    if (usuarioCount > 0) return;

    const now = new Date();
    const senhaHash = await this.passwords.hash('Demo@123');

    // Criar usuários
    const empresaUsuario = this.usuarioRepo.create({
      nome: 'Metal Forte Ltda.',
      email: 'empresa@demo.com',
      senhaHash,
      tipoUsuario: 'empresa',
      status: 'ativo'
    });

    const usinaUsuario = this.usuarioRepo.create({
      nome: 'Atlas Metais',
      email: 'usina@demo.com',
      senhaHash,
      tipoUsuario: 'usina',
      status: 'ativo'
    });

    const pessoaUsuario = this.usuarioRepo.create({
      nome: 'Joao Demo',
      email: 'pessoa@demo.com',
      senhaHash,
      tipoUsuario: 'pessoa_fisica',
      status: 'ativo'
    });

    const savedUsuarios = await this.usuarioRepo.save([empresaUsuario, usinaUsuario, pessoaUsuario]);

    // Criar empresa
    const empresa = this.empresaRepo.create({
      idUsuario: savedUsuarios[0].idUsuario,
      razaoSocial: 'Metal Forte Ltda.',
      nomeFantasia: 'Metal Forte',
      cnpj: '11222333000181',
      email: savedUsuarios[0].email,
      telefone: '11999990000',
      responsavel: 'Maria Compras',
      cargoResponsavel: 'Gerente',
      statusValidacao: 'aprovado'
    });

    // Criar usina
    const usina = this.usinaRepo.create({
      idUsuario: savedUsuarios[1].idUsuario,
      razaoSocial: 'Atlas Metais Ltda.',
      nomeFantasia: 'Atlas Metais',
      cnpj: '22333444000191',
      email: savedUsuarios[1].email,
      telefone: '21999990000',
      responsavel: 'Carlos Tecnico',
      especialidade: 'Usinagem de precisao',
      statusValidacao: 'aprovado'
    });

    // Criar funcionário
    const funcionario = this.funcionarioRepo.create({
      idEmpresa: (await this.empresaRepo.save(empresa)).idEmpresa,
      nome: 'Funcionario Demo',
      email: 'funcionario@demo.com',
      cargo: 'Comprador',
      tipoAcesso: 'operador',
      status: 'ativo'
    });

    const savedEmpresa = await this.empresaRepo.save(empresa);
    const savedUsina = await this.usinaRepo.save(usina);
    await this.funcionarioRepo.save(funcionario);

    // Criar pedidos
    const pedido1 = this.pedidoRepo.create({
      idEmpresaCompradora: savedEmpresa.idEmpresa,
      idUsuarioSolicitante: savedUsuarios[0].idUsuario,
      numeroPedido: 'PED-DEMO-001',
      urgencia: 'media',
      status: 'em_negociacao',
      observacoes: 'Eixo em aço carbono para demonstração',
      dataPedido: now
    });

    const pedido2 = this.pedidoRepo.create({
      idEmpresaCompradora: savedEmpresa.idEmpresa,
      idUsuarioSolicitante: savedUsuarios[0].idUsuario,
      numeroPedido: 'PED-DEMO-002',
      urgencia: 'alta',
      status: 'aberto',
      observacoes: 'Flange inox para apresentação',
      dataPedido: now
    });

    const savedPedidos = await this.pedidoRepo.save([pedido1, pedido2]);

    // Criar proposta
    const proposta = this.propostaRepo.create({
      idPedido: savedPedidos[0].idPedido,
      idUsina: savedUsina.idUsina,
      idUsuarioResponsavel: savedUsuarios[1].idUsuario,
      valor: 2500,
      prazo: '10 dias',
      observacao: 'Entrega rápida para demo',
      status: 'enviada',
      dataEnvio: now
    });

    const savedProposta = await this.propostaRepo.save(proposta);

    // Criar avaliação
    const avaliacao = this.avaliacaoRepo.create({
      idPedido: savedPedidos[0].idPedido,
      idEmpresaAvaliadora: savedEmpresa.idEmpresa,
      idUsinaAvaliada: savedUsina.idUsina,
      nota: 5,
      comentario: 'Excelente atendimento.'
    });

    // Criar pagamento
    const pagamento = this.pagamentoRepo.create({
      idPedido: savedPedidos[0].idPedido,
      idProposta: savedProposta.idProposta,
      idEmpresaPagadora: savedEmpresa.idEmpresa,
      idUsinaRecebedora: savedUsina.idUsina,
      valor: 2500,
      status: 'pendente'
    });

    // Criar notificação
    const notificacao = this.notificacaoRepo.create({
      idUsuario: savedUsuarios[0].idUsuario,
      titulo: 'Proposta recebida',
      mensagem: 'Atlas Metais enviou uma proposta.',
      lida: false
    });

    await this.avaliacaoRepo.save(avaliacao);
    await this.pagamentoRepo.save(pagamento);
    await this.notificacaoRepo.save(notificacao);
  }
}
