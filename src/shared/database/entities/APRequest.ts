import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
@Entity("APRequest")
export default class APRequest {
  @PrimaryGeneratedColumn({ name: "Identifier", type: "int" })
  identifier!: number;

  @Column({ name: "latitude", type: "nvarchar" })
  latitude!: number;

  @Column({ name: "longitude", type: "nvarchar" })
  longitude!: number;

  @Column({ name: "deviceId" })
  deviceId!: string;

  @Column({ name: "message", type: "nvarchar" })
  message?: string;

  @CreateDateColumn({ name: "createdOn", type: "datetime", nullable: true })
  createdOn!: Date;
}
