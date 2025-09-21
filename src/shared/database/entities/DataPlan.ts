import {
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
} from "typeorm";

@Entity("DataPlan")
export default class DataPlan {
  @PrimaryGeneratedColumn({ name: "Identifier", type: "int" })
  identifier!: number;

  @Column({ name: "PlanName", length: 50, nullable: true })
  planName!: string;

  @Column({ name: "Description", length: 100, nullable: true })
  description!: string;

  @Column({ name: "PlanId", length: 50, nullable: true })
  planId!: string;

  @Column({ name: "PlanType", length: 50, nullable: true })
  planType!: string;

  @Column({ name: "BandwidthLimit", length: 50, nullable: true })
  bandwidthLimit!: string;

  @Column({ name: "TimeLimit", length: 50, nullable: true })
  timeLimit!: string;

  @Column({ name: "RenewalTime", length: 50, nullable: true })
  renewalTime!: string;

  @Column({ name: "Status", length: 50, nullable: true })
  status!: string;

  @Column({ name: "ExpiryDate", type: "datetime", nullable: true })
  expiryDate!: Date;

  @Column({ name: "TokenQuantity", type: "int", nullable: true })
  tokenQuantity!: number;

  @Column({ name: "TokenValue", type: "float", nullable: true })
  tokenValue!: number;

  @Column({ name: "MaximumAdsPerDay", type: "int", nullable: true })
  maximumAdsPerDay!: number;

  @Column({ name: "Validity", type: "int", nullable: true })
  validity!: number;

  @Column({ name: "UOT", length: 50, nullable: true })
  uot!: string;

  @Column({
    name: "PriceInRupees",
    type: "decimal",
    precision: 18,
    scale: 6,
    nullable: true,
  })
  priceInRupees!: number;

  @Column({ name: "XiKasuTokens", type: "int", nullable: true })
  xiKasuTokens!: number;

  @CreateDateColumn({ name: "CreatedOn", type: "datetime", nullable: true })
  createdOn!: Date;

  @Column({ name: "ModifiedOn", type: "datetime", nullable: true })
  modifiedOn!: Date;

  @Column({ name: "CreatedBy", length: 50, nullable: true })
  createdBy!: string;

  @Column({ name: "ModifiedBy", length: 50, nullable: true })
  modifiedBy!: string;
}
