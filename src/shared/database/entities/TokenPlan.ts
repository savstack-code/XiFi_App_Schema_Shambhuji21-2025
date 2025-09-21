import { Entity, PrimaryGeneratedColumn, PrimaryColumn, CreateDateColumn, Column, ManyToOne } from 'typeorm';

@Entity("TokenPlan")
export default class TokenPlan {

    @PrimaryGeneratedColumn({ name: "Identifier", type: "int" })
    identifier!: number;

    @Column({ name: "Name", length: 50, nullable: true })
    name!: string;

    @Column({ type: "decimal", precision: 18, scale: 6, nullable: true })
    amount!: number;

    @Column({ name: "XiKasuTokens", type: "int", nullable: true })
    xiKasuTokens!: number;

    @Column({ name: "Status", length: 50, nullable: true })
    status!: string;

    @Column({ name: "Currency", length: 50, nullable: true })
    currency!: string;

    @Column({ name: "Description", length: 100, nullable: true })
    description!: string;

    @CreateDateColumn({ name: "CreatedOn", type: 'datetime', nullable: true })
    createdOn!: Date;

    @Column({ name: "ModifiedOn", type: 'datetime', nullable: true })
    modifiedOn!: Date;

    @Column({ name: "CreatedBy", length: 50, nullable: true })
    createdBy!: string;

    @Column({ name: "ModifiedBy", length: 50, nullable: true })
    modifiedBy!: string;
}


