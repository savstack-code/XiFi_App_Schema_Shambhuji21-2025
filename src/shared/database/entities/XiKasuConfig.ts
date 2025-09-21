import {
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  Code,
} from "typeorm";

@Entity("XiKasuConfig")
export default class XiKasuConfig {
  @PrimaryGeneratedColumn({ name: "Id", type: "int" })
  id!: number;

  @Column({ name: "Code", length: 50, nullable: true })
  code!: string;

  @Column({ name: "Description", length: 50, nullable: true })
  description!: string;

  @Column({ name: "XiKasuTokens", type: "int", nullable: true })
  xiKasuTokens!: number;

  @Column({ name: "Bandwidth", length: 50, nullable: true })
  bandwidth!: string;

  @Column({ name: "Time", type: "int", nullable: true })
  time!: number;

  @Column({ name: "Category", length: 50, nullable: true })
  category!: string;

  @Column({ name: "Status", length: 50, nullable: true })
  status!: string;

  @CreateDateColumn({ name: "CreatedOn", type: "datetime", nullable: true })
  createdOn!: Date;

  @Column({ name: "modifiedOn", type: "datetime", nullable: true })
  modifiedOn!: Date;

  @Column({ name: "CreatedBy", length: 50, nullable: true })
  createdBy!: string;

  @Column({ name: "ModifiedBy", length: 50, nullable: true })
  modifiedBy!: string;
}
