import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('funcionarios')
export class Funcionario {
  @PrimaryColumn({ length: 64 }) id: string;
  @Column({ default: 'empresa', length: 30 }) contexto: string;
  @Column({ nullable: true, length: 64 }) ownerId?: string;
  @Column({ length: 180 }) nome: string;
  @Column({ length: 180 }) email: string;
  @Column({ nullable: true, length: 100 }) cargo?: string;
  @Column({ nullable: true, length: 100 }) tipo?: string;
  @Column({ nullable: true, unique: true, length: 64 }) conviteToken?: string;
  @Column({ default: 'Pendente', length: 30 }) status: string;
}
