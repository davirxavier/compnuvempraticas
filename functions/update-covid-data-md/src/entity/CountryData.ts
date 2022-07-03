import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn} from "typeorm"

@Entity()
export class CountryData {

    public constructor(init?:Partial<CountryData>) {
        Object.assign(this, init);
    }

    @PrimaryColumn()
    country: string;

    @Column()
    cases: number;

    @Column()
    deaths: number;

}
