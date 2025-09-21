import { Entity, PrimaryGeneratedColumn, PrimaryColumn, CreateDateColumn, Column, ManyToOne } from 'typeorm';

@Entity("XifiVoucher")
export default class XifiVoucher {

    @PrimaryGeneratedColumn({ name: "Identifier", type: "int" })
    identifier!: number;

    @Column({ name: "Code", length: 50, nullable: true })
    code!: string;

    @Column({ name: "Description", length: 100, nullable: true })
    description!: string;

    @Column({ name: "Status", length: 50, nullable: true })
    status!: string;

    @Column({ name: "ExpiryTime", type: 'datetime', nullable: true })
    expiryTime!: Date;

    @Column({ name: "AllowCount", type: "int", nullable: true })
    allowCount!: number;

    @Column({ name: "RedeemCount", type: "int", nullable: true })
    redeemCount!: number;

    @Column({ name: "XiKasuTokens", type: "int", nullable: true })
    xiKasuTokens!: number;

    @CreateDateColumn({ name: "CreatedOn", type: 'datetime', nullable: true })
    createdOn!: Date;

    @Column({ name: "ModifiedOn", type: 'datetime', nullable: true })
    modifiedOn!: Date;

    @Column({ name: "CreatedBy", length: 50, nullable: true })
    createdBy!: string;

    @Column({ name: "ModifiedBy", length: 50, nullable: true })
    modifiedBy!: string;
}