import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('propostas')
export class Proposta {
  @PrimaryColumn({ length: 64 }) id: string;
  @Column({ length: 64 }) pedidoId: string;
  @Column({ length: 64 }) solicitacaoId: string;
  @Column({ length: 64 }) usinaId: string;
  @Column({ length: 64 }) empresaId: string;
  @Column({ length: 180 }) usina: string;
  @Column({ length: 180 }) cliente: string;
  @Column({ length: 180 }) peca: string;
  @Column({ length: 100 }) valor: string;
  @Column({ length: 100 }) prazo: string;
  @Column({ nullable: true, length: 100 }) frete?: string;
  @Column({ nullable: true, length: 30 }) avaliacao?: string;
  @Column({ type: 'text', nullable: true }) observacao?: string;
  @Column({ nullable: true, length: 180 }) material?: string;
  @Column({ nullable: true, length: 100 }) quantidade?: string;
  @Column({ nullable: true, length: 80 }) regiao?: string;
  @Column({ nullable: true, length: 255 }) arquivo?: string;
  @Column({ default: 'Enviada', length: 50 }) status: string;
  @Column({ length: 20 }) dataEnvio: string;
}
