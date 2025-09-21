import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("SSID")
export default class SSID {
  @PrimaryGeneratedColumn({ name: "Identifier", type: "int" })
  identifier!: number;

  @Column({ name: "ProviderID", length: 100, nullable: true })
  providerID!: string;

  @Column({ name: "LocationName", length: 100, nullable: true })
  locationName!: string;

  @Column({ name: "State", length: 100, nullable: true })
  state!: string;

  @Column({ name: "Type", length: 50, nullable: true })
  type!: string;

  @Column({ name: "CPURL", length: 2000, nullable: true })
  cPURL!: string;

  @Column({ name: "Latitude", length: 100, nullable: true })
  latitude!: string;

  @Column({ name: "Langitude", length: 100, nullable: true })
  langitude!: string;

  @Column({ name: "Address", type: "ntext", nullable: true })
  address!: string;

  @Column({ name: "DeviceId", length: 50, nullable: true })
  deviceID!: string;

  @Column({ name: "Status", length: 50, nullable: true })
  status!: string;

  @Column({ name: "SSID", length: 100, nullable: true })
  sSID!: string;

  @Column()
  openBetween!: string;

  @Column({ name: "AvgSpeed", nullable: true, type: "float" })
  avgSpeed!: number;

  @Column({ name: "FreeBand", nullable: true, type: "float" })
  freeBand!: number;

  @Column({ name: "PaymentModes", length: 50, nullable: true })
  paymentModes!: string;

  @CreateDateColumn({ name: "CreatedOn", type: "datetime", nullable: true })
  createdOn!: Date;

  @Column({ name: "ModifiedOn", type: "datetime", nullable: true })
  modifiedOn!: Date;

  @Column({ name: "CreatedBy", length: 50, nullable: true })
  createdBy!: string;

  @Column({ name: "ModifiedBy", length: 50, nullable: true })
  modifiedBy!: string;

  @Column({ name: "LoginScheme", length: 50, nullable: true })
  loginScheme!: string;

  @Column({ name: "Description", length: 100, nullable: true })
  description!: string;
}
