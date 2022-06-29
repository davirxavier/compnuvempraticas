import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Answer {

    public constructor(init?:Partial<Answer>) {
        Object.assign(this, init);
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    compute: number

    @Column()
    storage: number

    @Column()
    filestore: number

    @Column()
    functions: number

    @Column()
    monitoring: number

}
