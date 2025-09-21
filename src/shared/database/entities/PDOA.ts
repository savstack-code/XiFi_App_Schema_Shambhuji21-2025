import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("TAB_PDOA")
export default class PDOA {
  @PrimaryGeneratedColumn({ name: "Identifier", type: "int" })
  identifier!: number;

  @Column({ name: "AppUrl", type: "ntext", nullable: true })
  appUrl!: string;

  @Column({ name: "EmailId", length: 100, nullable: true })
  emailID!: string;

  @Column({ name: "ProviderId", length: 100, nullable: true })
  providerID!: string;

  @Column({ name: "Name", length: 150, nullable: true })
  name!: string;

  @Column({ name: "MobilePhone", length: 30, nullable: true })
  mobilePhone!: string;

  @Column({ name: "Status", length: 50, nullable: true })
  status!: string;

  @Column({ name: "IKey", length: 50, nullable: true })
  iKey!: string;

  @Column({ name: "KeyCode", type: "ntext", nullable: true })
  keyCode!: string;

  @Column({ name: "CreatedOn", type: "datetime", nullable: true })
  createdOn!: Date;

  @Column({ name: "ModifiedOn", type: "datetime", nullable: true })
  modifiedOn!: Date;

  @Column({ name: "CreatedBy", length: 50, nullable: true })
  createdBy!: string;

  @Column({ name: "ModifiedBy", length: 50, nullable: true })
  modifiedBy!: string;

  @Column({ name: "Description", length: 500, nullable: true })
  description!: string;
}
