import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
} from "typeorm";

@Entity("DataUserTokenBalance")
export default class DataUserTokenBalance {
  @PrimaryGeneratedColumn({ name: "Identifier", type: "int" })
  identifier!: number;

  @Column({ name: "UserId", length: 50, nullable: true })
  userId!: string;

  @Column({ name: "Tokens", type: "float", nullable: true })
  tokens!: number;

  @Column({ name: "Status", length: 50, nullable: true })
  status!: string;

  @CreateDateColumn({ name: "CreatedOn", type: "datetime", nullable: true })
  createdOn!: Date;

  @Column({ name: "ModifiedOn", type: "datetime", nullable: true })
  modifiedOn!: Date;

  @Column({ name: "CreatedBy", length: 50, nullable: true })
  createdBy!: string;

  @Column({ name: "ModifiedBy", length: 50, nullable: true })
  modifiedBy!: string;

  @Column({ name: "previousSessionTime", type: "float", nullable: true })
  previousSessionTime!: number;

  @Column({ name: "previousUses", type: "float", nullable: true })
  previousUses!: number;
}
