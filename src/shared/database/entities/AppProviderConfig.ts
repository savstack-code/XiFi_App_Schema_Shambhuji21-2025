import { Entity, PrimaryColumn, CreateDateColumn, Column } from 'typeorm';

@Entity("AppProviderConfig")
export default class AppProviderConfig {

  @PrimaryColumn({ name: "Id", type: "int" })
  id!: number;

  @Column({ name: "AppProviderId", type: 'uuid', nullable: false })
  appProviderId!: string;

  @Column({ name: "PublicKey", type: "ntext", nullable: true })
  publicKey!: string;

  @Column({ name: "PrivateKey", type: "ntext", nullable: true })
  privateKey!: string;

  @Column({ name: "Expiration", length: 50, nullable: true })
  expiration!: string;

  @CreateDateColumn({ name: "CreatedOn", type: 'datetime', nullable: true })
  createdOn!: Date;

  @Column({ name: "ModifiedOn", type: 'datetime', nullable: true })
  modifiedOn!: Date;

  @Column({ name: "CreatedBy", length: 50, nullable: true })
  createdBy!: string;

  @Column({ name: "ModifiedBy", length: 50, nullable: true })
  modifiedBy!: string;

}