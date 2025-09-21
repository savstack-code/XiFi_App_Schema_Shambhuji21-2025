import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
} from "typeorm";

@Entity("DataAccounting")
export default class DataAccounting {
  @PrimaryGeneratedColumn({ name: "Identifier", type: "int" })
  identifier!: number;

  @Column({ name: "UserName", length: 50, nullable: true })
  userName!: string;

  @Column({ name: "StartTime", type: "datetime", nullable: true })
  startTime!: Date;

  @Column({ name: "SessionTime", length: 50, nullable: true })
  sessionTime!: string;

  @Column({ name: "DataUsed", length: 50, nullable: true })
  dataUsed!: string;

  @Column({ name: "CalledStation", length: 50, nullable: true })
  calledStation!: string;

  @Column({ name: "CallingStation", length: 50, nullable: true })
  callingStation!: string;

  @Column({ name: "LocationId", length: 50, nullable: true })
  locationId!: string;

  @Column({ name: "StopTime", type: "datetime", nullable: true })
  stopTime!: Date;

  @Column({ name: "TerminateCause", length: 250, nullable: true })
  terminateCause!: string;

  @Column({ name: "PlanId", length: 50, nullable: true })
  planId!: string;

  @Column({ name: "Status", length: 50, nullable: true })
  status!: string;

  @Column({ name: "UserPlanId", type: "int", nullable: true })
  userPlanId!: number;

  @Column({ name: "Category", length: 50, nullable: true })
  category!: string;

  @Column({ name: "ReferenceId", length: 50, nullable: true })
  referenceId!: string;

  @Column({ name: "SessionStatus", length: 50, nullable: true })
  sessionStatus!: string;

  @CreateDateColumn({ name: "CreatedOn", type: "datetime", nullable: true })
  createdOn!: Date;

  @Column({ name: "ModifiedOn", type: "datetime", nullable: true })
  modifiedOn!: Date;

  @Column({ name: "CreatedBy", length: 50, nullable: true })
  createdBy!: string;

  @Column({ name: "ModifiedBy", length: 50, nullable: true })
  modifiedBy!: string;
}
