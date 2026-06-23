import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryColumn({ length: 64 }) id: string;
  @Column({ length: 30 }) tipo: string;
  @Column({ length: 180 }) nome: string;
  @Column({ unique: true, length: 180 }) email: string;
  @Column({ length: 255, select: false }) senha: string;
  @Column({ nullable: true, length: 64 }) empresaId?: string;
  @Column({ nullable: true, length: 64 }) usinaId?: string;
  @Column({ nullable: true, length: 64 }) pessoaFisicaId?: string;
  @Column({ nullable: true, unique: true, length: 11 }) cpf?: string;
  @Column({ nullable: true, unique: true, length: 14 }) cnpj?: string;
  @Column({ nullable: true, length: 20 }) telefone?: string;
}
