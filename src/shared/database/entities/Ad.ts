import { Entity, PrimaryGeneratedColumn, PrimaryColumn, CreateDateColumn, Column, OneToMany, Generated } from 'typeorm';

@Entity("Ad")
export default class Ad {

    @PrimaryColumn({ name: "Identifier", type: "uuid", default: () => 'uuid()' })
    @Generated("uuid")
    identifier!: string;

    @Column({ name: "Url", length: 500, nullable: true })
    url!: string;

    @Column({ name: "SkipTime", length: 50, nullable: true })
    skipTime!: string;

    @Column({ name: "PlanId", length: 50, nullable: true })
    planId!: string;

    @Column({ name: "AdViewedOn", type: "datetime", nullable: true })
    adViewedOn!: Date;

    @Column({ name: "UserId", length: 50, nullable: true })
    userId!: string;

    @Column({ name: "Status", length: 50, nullable: true })
    status!: string;

    @CreateDateColumn({ name: "CreatedOn", type: 'datetime', nullable: true })
    createdOn!: Date;

    @Column({ name: "ModifiedOn", type: "datetime", nullable: true })
    modifiedOn!: Date;

    @Column({ name: "CreatedBy", length: 50, nullable: true })
    createdBy!: string;

    @Column({ name: "ModifiedBy", length: 50, nullable: true })
    modifiedBy!: string;

    @Column({ name: "PdoaId", length: 50, nullable: true })
    pdoaId!: string;


}