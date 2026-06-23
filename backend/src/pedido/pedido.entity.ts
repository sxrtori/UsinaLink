import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('pedidos')
export class Pedido {
  @PrimaryColumn({ length: 64 }) id: string;
  @Column({ length: 64 }) empresaId: string;
  @Column({ length: 180 }) empresa: string;
  @Column({ length: 180 }) peca: string;
  @Column({ nullable: true, length: 100 }) categoria?: string;
  @Column({ nullable: true, length: 180 }) material?: string;
  @Column({ nullable: true, length: 100 }) quantidade?: string;
  @Column({ nullable: true, length: 100 }) prazo?: string;
  @Column({ nullable: true, length: 80 }) regiao?: string;
  @Column({ nullable: true, length: 50 }) urgencia?: string;
  @Column({ type: 'text', nullable: true }) descricao?: string;
  @Column({ nullable: true, length: 255 }) arquivo?: string;
  @Column({ default: 'Aberta', length: 50 }) status: string;
}
