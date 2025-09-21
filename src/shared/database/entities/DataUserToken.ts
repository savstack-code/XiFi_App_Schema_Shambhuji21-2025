import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne } from 'typeorm';

@Entity("DataUserToken")
export default class DataUserToken {

    @PrimaryGeneratedColumn({ name: "Identifier", type: "int" })
    identifier!: number;

    @Column({ name: "UserId", length: 50, nullable: true })
    userId!: string;

    @Column({ name: "Tokens", type: "float", nullable: true })
    tokens!: number;

    @Column({ name: "Balance", type: "float", nullable: true })
    balance!: number;

    @Column({ name: "TransactionType", length: 50, nullable: true })
    transactionType!: string;

    @Column({ name: "ReferenceNo", length: 50, nullable: true })
    referenceNo!: string;

    @Column({ name: "Status", length: 50, nullable: true })
    status!: string;

    @Column({ name: "Source", length: 50, nullable: true })
    source!: string;

    @CreateDateColumn({ name: "CreatedOn", type: 'datetime', nullable: true })
    createdOn!: Date;

    @Column({ name: "ModifiedOn", type: 'datetime', nullable: true })
    modifiedOn!: Date;

    @Column({ name: "CreatedBy", length: 50, nullable: true })
    createdBy!: string;

    @Column({ name: "ModifiedBy", length: 50, nullable: true })
    modifiedBy!: string;
}