import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('usinas')
export class Usina {
  @PrimaryColumn({ length: 64 }) id: string;
  @Column({ length: 180 }) nome: string;
  @Column({ nullable: true, length: 180 }) razaoSocial?: string;
  @Column({ unique: true, length: 14 }) cnpj: string;
  @Column({ length: 180 }) email: string;
  @Column({ nullable: true, length: 20 }) telefone?: string;
  @Column({ nullable: true, length: 180 }) responsavel?: string;
  @Column({ nullable: true, length: 180 }) especialidade?: string;
  @Column({ type: 'json', nullable: true }) endereco?: Record<string, unknown>;
}
