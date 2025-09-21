import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("SMSError")
export default class SMSError {
  @PrimaryGeneratedColumn({ name: "Identifier", type: "int" })
  identifier!: number;

  @Column({ name: "receiver", length: 15, nullable: false })
  receiver!: string;

  @Column({ name: "isInternational" })
  isInternational!: boolean;

  @Column({ name: "errorsTxt", length: 200, nullable: true })
  errorsTxt!: string;

  @CreateDateColumn({ name: "CreatedOn", type: "datetime", nullable: true })
  createdOn!: Date;
}
