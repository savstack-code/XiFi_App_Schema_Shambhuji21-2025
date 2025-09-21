import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("PdoaConfig")
export default class PdoaConfig {
  @PrimaryGeneratedColumn({ name: "Id", type: "int" })
  id!: number;

  @Column({ name: "PdoaId", length: 100, nullable: true })
  pdoaId!: string;

  @Column({ name: "PdoaPublicKey", length: 3000, nullable: true })
  pdoaPublicKey!: string;

  @Column({ name: "UpdateDataPolicyUrl", length: 250, nullable: true })
  updateDataPolicyUrl!: string;

  @Column({ name: "stopUserSessionUrl", length: 250, nullable: true })
  stopUserSessionUrl!: string;

  @Column({ name: "apiBasePath", length: 250, nullable: true })
  apiBasePath!: string;

  @Column({ name: "KeyExp", length: 8, nullable: true })
  keyExp!: string;

  @Column({ name: "CreatedOn", type: "datetime", nullable: true })
  createdOn!: Date;

  @Column({ name: "ModifiedOn", type: "datetime", nullable: true })
  modifiedOn!: Date;

  @Column({ name: "CreatedBy", length: 50, nullable: true })
  createdBy!: string;

  @Column({ name: "ModifiedBy", length: 50, nullable: true })
  modifiedBy!: string;

  @Column({ name: "PdoaName", length: 100, nullable: true })
  pdoaName!: string;

  @Column({ name: "ImageUrl", length: 2000, nullable: true })
  imageUrl!: string;
}
