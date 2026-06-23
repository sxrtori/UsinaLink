import { Injectable, OnModuleInit } from '@nestjs/common';
import { PasswordService } from '../auth/password.service';
import { JsonDatabaseService } from './json-database.service';

@Injectable()
export class SeedDemoService implements OnModuleInit {
  constructor(private readonly db: JsonDatabaseService, private readonly passwords: PasswordService) {}
  async onModuleInit() {
    await this.db.ensureDatabase();
    const cols = ['usuarios','empresas','usinas','pessoas-fisicas','funcionarios','pedidos','propostas','avaliacoes','pagamentos','notificacoes','solicitacoes-bloqueio-usina'];
    const sizes = await Promise.all(cols.map(c => this.db.readAll(c).then(r => r.length)));
    if (sizes.some(Boolean)) return;
    const now = new Date().toISOString();
    const senhaHash = await this.passwords.hash('Demo@123');
    const empresaUsuario:any = { id: this.db.newId(), idUsuario: this.db.newId(), nome:'Metal Forte Ltda.', email:'empresa@demo.com', senhaHash, tipoUsuario:'empresa', status:'ativo', criadoEm:now, atualizadoEm:now };
    const usinaUsuario:any = { id: this.db.newId(), idUsuario: this.db.newId(), nome:'Atlas Metais', email:'usina@demo.com', senhaHash, tipoUsuario:'usina', status:'ativo', criadoEm:now, atualizadoEm:now };
    const pessoaUsuario:any = { id: this.db.newId(), idUsuario: this.db.newId(), nome:'Joao Demo', email:'pessoa@demo.com', senhaHash, tipoUsuario:'pessoa_fisica', status:'ativo', criadoEm:now, atualizadoEm:now };
    const empresa:any = { id:this.db.newId(), idEmpresa:this.db.newId(), idUsuario:empresaUsuario.idUsuario, razaoSocial:'Metal Forte Ltda.', nomeFantasia:'Metal Forte', cnpj:'11222333000181', email:empresaUsuario.email, telefone:'11999990000', responsavel:'Maria Compras', cargoResponsavel:'Gerente', statusValidacao:'aprovado', criadoEm:now, atualizadoEm:now };
    const usina:any = { id:this.db.newId(), idUsina:this.db.newId(), idUsuario:usinaUsuario.idUsuario, razaoSocial:'Atlas Metais Ltda.', nomeFantasia:'Atlas Metais', cnpj:'22333444000191', email:usinaUsuario.email, telefone:'21999990000', responsavel:'Carlos Tecnico', especialidade:'Usinagem de precisao', statusValidacao:'aprovado', criadoEm:now, atualizadoEm:now };
    const pessoa:any = { id:this.db.newId(), idPessoaFisica:this.db.newId(), idUsuario:pessoaUsuario.idUsuario, nome:pessoaUsuario.nome, cpf:'12345678909', email:pessoaUsuario.email, telefone:'31999990000', criadoEm:now, atualizadoEm:now };
    const funcionario:any = { id:this.db.newId(), idFuncionario:this.db.newId(), idEmpresa:empresa.idEmpresa, nome:'Funcionario Demo', email:'funcionario@demo.com', cargo:'Comprador', tipoAcesso:'operador', status:'ativo', criadoEm:now, atualizadoEm:now };
    const pedido1:any = { id:this.db.newId(), idPedido:this.db.newId(), idEmpresaCompradora:empresa.idEmpresa, idUsuarioSolicitante:empresaUsuario.idUsuario, numeroPedido:'PED-DEMO-001', urgencia:'media', status:'em_negociacao', observacoes:'Eixo em aço carbono para demonstração', dataPedido:now, criadoEm:now, atualizadoEm:now, itens:[{nome:'Eixo aço carbono', quantidade:10, material:'Aço 1045'}], arquivos:[] };
    const pedido2:any = { id:this.db.newId(), idPedido:this.db.newId(), idEmpresaCompradora:empresa.idEmpresa, idUsuarioSolicitante:empresaUsuario.idUsuario, numeroPedido:'PED-DEMO-002', urgencia:'alta', status:'aberto', observacoes:'Flange inox para apresentação', dataPedido:now, criadoEm:now, atualizadoEm:now, itens:[{nome:'Flange inox', quantidade:4, material:'Inox 304'}], arquivos:[] };
    const proposta:any = { id:this.db.newId(), idProposta:this.db.newId(), idPedido:pedido1.idPedido, idUsina:usina.idUsina, idUsuarioResponsavel:usinaUsuario.idUsuario, valor:2500, prazo:'10 dias', observacao:'Entrega rápida para demo', status:'enviada', dataEnvio:now, criadoEm:now, atualizadoEm:now };
    await this.db.replaceAll('usuarios',[empresaUsuario,usinaUsuario,pessoaUsuario]);
    await this.db.replaceAll('empresas',[empresa]); await this.db.replaceAll('usinas',[usina]); await this.db.replaceAll('pessoas-fisicas',[pessoa]); await this.db.replaceAll('funcionarios',[funcionario]); await this.db.replaceAll('pedidos',[pedido1,pedido2]); await this.db.replaceAll('propostas',[proposta]); await this.db.replaceAll('avaliacoes',[{id:this.db.newId(),idAvaliacao:this.db.newId(),idPedido:pedido1.idPedido,idEmpresaAvaliadora:empresa.idEmpresa,idUsinaAvaliada:usina.idUsina,nota:5,comentario:'Excelente atendimento.',criadoEm:now,atualizadoEm:now}]); await this.db.replaceAll('pagamentos',[{id:this.db.newId(),idPagamento:this.db.newId(),idPedido:pedido1.idPedido,idProposta:proposta.idProposta,idEmpresaPagadora:empresa.idEmpresa,idUsinaRecebedora:usina.idUsina,valor:2500,status:'pendente',criadoEm:now,atualizadoEm:now}]); await this.db.replaceAll('notificacoes',[{id:this.db.newId(),idNotificacao:this.db.newId(),idUsuario:empresaUsuario.idUsuario,titulo:'Proposta recebida',mensagem:'Atlas Metais enviou uma proposta.',lida:false,dataCriacao:now,criadoEm:now,atualizadoEm:now}]);
  }
}
