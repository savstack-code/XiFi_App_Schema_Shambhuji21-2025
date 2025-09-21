import { Entity, PrimaryGeneratedColumn, PrimaryColumn, CreateDateColumn, Column, OneToMany, Generated } from 'typeorm';

@Entity("AdStore")
export default class AdStore {

    @PrimaryColumn({ name: "Identifier", type: "uuid", default: () => 'uuid()' })
    @Generated("uuid")
    identifier!: string;

    @Column({ name: "Name", length: 50, nullable: true })
    name!: string;

    @Column({ name: "Url", length: 500, nullable: true })
    url!: string;

    @Column({ name: "AdId", type: 'int', nullable: true })
    adId!: number;

    @Column({ name: "MediaType", length: 50, nullable: true })
    mediaType!: string;

    @Column({ name: "SkipTime", length: 50, nullable: true })
    skipTime!: string;

    @Column({ name: "Duration", length: 50, nullable: true })
    duration!: string;

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

}