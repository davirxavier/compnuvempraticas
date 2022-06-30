import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

export enum AWSService {
    S3 = 0,
    CLOUDWATCH = 1,
    LAMBDA = 2,
    EC2 = 3,
    ECS = 4
}

const metadataKey = 'rightAnswerList';
export function RightAnswer(s: AWSService) {
    return (target: any, key: string) => {
        let md = Reflect.getMetadata(metadataKey, target);
        if (!md) {
            md = {};
        }

        md[key] = s;
        Reflect.defineMetadata(metadataKey, md, target);
    };
}

@Entity()
export class Answer {

    public constructor(init?:Partial<Answer>) {
        Object.assign(this, init);
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @RightAnswer(AWSService.EC2)
    @Column()
    compute: number

    @RightAnswer(AWSService.S3)
    @Column()
    storage: number

    @RightAnswer(AWSService.ECS)
    @Column()
    filestore: number

    @RightAnswer(AWSService.LAMBDA)
    @Column()
    functions: number

    @RightAnswer(AWSService.CLOUDWATCH)
    @Column()
    monitoring: number

    get_right_answer_count(): number {
        const md = Reflect.getMetadata(metadataKey, this);
        return Object.keys(md).map(k => this[k] == md[k] ? 1 : 0).filter(r => r == 1).length;
    }

}
