import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
} from "typeorm";

@Entity("DataSession")
export default class DataSession {
  @PrimaryGeneratedColumn({ name: "Identifier" })
  identifier!: number;

  @Column({ name: "UserName" })
  userName!: string;

  @Column({ name: "StartTime", type: "datetime" })
  startTime!: Date;

  @Column({ name: "SessionTime" })
  sessionTime!: string;

  @Column({ name: "DataUsed" })
  dataUsed!: string;

  @Column({ name: "CalledStation" })
  calledStation!: string;

  @Column({ name: "CallingStation" })
  callingStation!: string;

  @Column({ name: "LocationId" })
  locationId!: string;

  @Column({ name: "StopTime", type: "datetime" })
  stopTime!: Date;

  @Column({ name: "TerminateCause" })
  terminateCause!: string;

  @Column({ name: "PlanId" })
  planId!: string;

  @Column({ name: "UserPlanId", type: "int", nullable: true })
  userPlanId!: number;

  @Column({ name: "Status", nullable: true })
  status!: string;

  @Column({ name: "XiKasuTokens", type: "int", nullable: true })
  xiKasuTokens!: number;

  @Column({ name: "XiKasuTokenBalance", type: "int", nullable: true })
  xiKasuTokenBalance!: number;

  @Column({ name: "Category", length: 50, nullable: true })
  category!: string;

  @CreateDateColumn({ name: "CreatedOn", type: "datetime" })
  createdOn!: Date;

  @Column({ name: "ModifiedOn", type: "datetime" })
  modifiedOn!: Date;

  @Column({ name: "CreatedBy", nullable: true })
  createdBy!: string;

  @Column({ name: "ModifiedBy", nullable: true })
  modifiedBy!: string;
}
