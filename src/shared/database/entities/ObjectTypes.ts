import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity("ObjectTypes")
export default class ObjectTypes {

    @PrimaryColumn({ name: "ObjectTypesId", length: 4 })
    objectTypesId!: string;

    @Column({ name: "ObjectTypeName", length: 20, nullable: true })
    objectTypename!: string;

    @Column({ name: "MaxLimit", type: 'bigint', nullable: true })
    maxLimit!: number;

    @Column({ name: "FollowupObject", type: 'int', nullable: true })
    followupObject!: number;
}