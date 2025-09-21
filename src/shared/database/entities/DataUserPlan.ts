import {
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
} from "typeorm";

@Entity("DataUserPlan")
export default class DataUserPlan {
  @PrimaryGeneratedColumn({ name: "Id", type: "int" })
  id!: number;

  @Column({ name: "UserId", length: 50, nullable: true })
  userId!: string;

  @Column({ name: "Status", length: 50, nullable: true })
  status!: string;

  @Column({ name: "PlanId", length: 50, nullable: true })
  planId!: string;

  @Column({ name: "BandwidthLimit", length: 50, nullable: true })
  bandwidthLimit!: string;

  @Column({ name: "RemainingData", length: 50, nullable: true })
  remainingData!: string;

  @Column({ name: "PlanExpiryDate", type: "datetime", nullable: true })
  planExpiryDate!: Date;

  @CreateDateColumn({ name: "CreatedOn", type: "datetime", nullable: true })
  createdOn!: Date;

  @Column({ name: "ModifiedOn", type: "datetime", nullable: true })
  modifiedOn!: Date;

  @Column({ name: "CreatedBy", length: 50, nullable: true })
  createdBy!: string;

  @Column({ name: "ModifiedBy", length: 50, nullable: true })
  modifiedBy!: string;
}
