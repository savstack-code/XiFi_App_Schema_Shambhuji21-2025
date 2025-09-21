import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("PaymentGatewayConfig")
export default class PaymentGatewayConfig {
  @PrimaryGeneratedColumn({ name: "Id", type: "int" })
  id!: number;

  @Column({ name: "ProviderName", length: 256, nullable: true })
  providerName!: string;

  @Column({ name: "UrlScheme", length: 15, nullable: true })
  urlScheme!: string;

  @Column({ name: "BaseUrlSegment", length: 256, nullable: true })
  baseUrlSegment!: string;

  @Column({ name: "KeyId", length: 256, nullable: true })
  keyId!: string;

  @Column({ name: "KeySecret", length: 256, nullable: true })
  keySecret!: string;

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
}
