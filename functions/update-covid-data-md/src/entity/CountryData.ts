import {Entity, Column, PrimaryColumn, UpdateDateColumn} from "typeorm"

@Entity()
export class CountryData {

    public constructor(init?:Partial<CountryData>) {
        Object.assign(this, init);
        this.updated_at = new Date();
    }

    @PrimaryColumn()
    country: string;

    @Column()
    cases: number;

    @Column()
    deaths: number;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;
}
