import { Entity, PrimaryColumn, Column, Generated } from "typeorm";

@Entity("UserDevice")
export default class UserDevice {
  @PrimaryColumn({ name: "Identifier", type: "uuid", default: () => "uuid()" })
  @Generated("uuid")
  identifier!: string;

  @Column({ name: "UserId", length: 15, nullable: true })
  userId!: string;

  @Column({ name: "DeviceId", length: 50, nullable: true })
  deviceId!: string;

  @Column({ name: "PlayerId", length: 50, nullable: true })
  playerId!: string;

  @Column({ name: "Status", length: 50, nullable: true })
  status!: string;

  @Column({ name: "DeviceType", length: 50, nullable: true })
  deviceType!: string;

  @Column({ name: "DeviceToken", length: 512, nullable: true })
  deviceToken!: string;

  @Column({ name: "CreatedOn", type: "datetime", nullable: true })
  createdOn!: Date;

  @Column({ name: "ModifiedOn", type: "datetime", nullable: true })
  modifiedOn!: Date;

  @Column({ name: "CreatedBy", length: 50, nullable: true })
  createdBy!: string;

  @Column({ name: "ModifiedBy", length: 50, nullable: true })
  modifiedBy!: string;

  @Column({ name: "PdoaId", length: 50, nullable: true })
  pdoaId!: string;

  @Column({ name: "OSType", length: 50, nullable: true })
  OSType?: string;

  @Column({ name: "OSVersion", length: 50, nullable: true })
  OSVersion?: string;

  @Column({ name: "deviceModel", length: 50, nullable: true })
  deviceModel?: string;

  @Column({ name: "lat", type: "nvarchar", length: 50, nullable: true })
  lat!: number;

  @Column({ name: "lng", type: "nvarchar", length: 50, nullable: true })
  lng!: number;

  @Column({ name: "locationUpdatedOn", type: "datetime", nullable: true })
  locationUpdatedOn!: Date;

  @Column({ name: "macAddr", length: 50, nullable: true })
  macAddr?: string;
}
