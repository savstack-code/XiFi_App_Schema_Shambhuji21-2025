import { Entity, PrimaryColumn, CreateDateColumn, Column } from "typeorm";

@Entity("User")
export default class User {
  @PrimaryColumn({ name: "UserId", length: 15 })
  userID!: string;

  @Column({ name: "ObjectType", length: 4, nullable: true })
  objectType!: string;

  @Column({ name: "FirstName", length: 50, nullable: true })
  firstName!: string;

  @Column({ name: "LastName", length: 50, nullable: true })
  lastName!: string;

  @Column({ name: "Password", length: 50, nullable: true })
  password!: string;

  @Column({ name: "DeviceId", length: 50, nullable: true })
  deviceID!: string;

  @Column({ name: "ValidFrom", type: "datetime", nullable: true })
  validFrom!: Date;

  @Column({ name: "ValidTo", type: "datetime", nullable: true })
  validTo!: Date;

  @Column({ name: "Status", length: 50, nullable: true })
  status!: string;

  @Column({ name: "UserType", length: 50, nullable: true })
  userType!: string;

  @Column({ name: "MobileNumber", length: 50, nullable: true })
  mobileNumber!: string;

  @Column({ name: "LogonName", length: 15, nullable: true })
  logonName!: string;

  @Column({ name: "EmailId", length: 50, nullable: true })
  emailID?: string;

  @Column({ name: "ReportingUserId", length: 15, nullable: true })
  reportingUserID!: string;

  @Column({ name: "Image", length: 4000, nullable: true })
  image!: string;

  @Column({ name: "Address", length: 500, nullable: true })
  address!: string;

  @Column({ name: "PinCode", type: "int", nullable: true })
  pincode!: number;

  @Column({ name: "ApUserName", length: 50, nullable: true })
  apUserName!: string;

  @Column({ name: "ApPassword", length: 50, nullable: true })
  apPassword!: string;

  @Column({ name: "CurrentPlanId", length: 50, nullable: true })
  currentPlanId!: string;

  @CreateDateColumn({ name: "CreatedOn", type: "datetime", nullable: true })
  createdOn!: Date;

  @Column({ name: "ModifiedOn", type: "datetime", nullable: true })
  modifiedOn!: Date;

  @Column({ name: "CreatedBy", length: 50, nullable: true })
  createdBy!: string;

  @Column({ name: "ModifiedBy", length: 50, nullable: true })
  modifiedBy!: string;

  @Column({ name: "Gender", length: 10, nullable: true })
  gender!: string;

  @Column({ name: "EmailValidationFlag", length: 10, nullable: true })
  emailValidationFlag!: string;

  @Column({ name: "PasswordExpiryDate", type: "datetime", nullable: true })
  passwordExpiryDate!: Date;

  @Column({ name: "UserCode", length: 20, nullable: true })
  userCode!: string;

  @Column({ name: "ReferralCode", type: "varchar", length: 20, nullable: true })
  referralCode!: any;

  @Column({ name: "ReferralExpired", type: "bit" })
  referralExpired!: boolean;

  /** Active session device id */
  @Column({ name: "asDeviceId", length: 512, nullable: true })
  asDeviceId?: string;

  /** will store on activateInternet method call */
  @Column({ name: "railTelOrgNo", type: "int", nullable: true })
  railTelOrgNo?: number;

  /** RailTel accounting last session id on */
  @Column({ name: "railTelLastSessId", type: "int", nullable: true })
  railTelLastSessId?: number;
}
