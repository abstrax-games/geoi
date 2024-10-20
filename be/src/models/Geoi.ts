import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Geoi {
    // 主键，自增
    @PrimaryGeneratedColumn()
    id: number;

    // 内容
    @Column()
    content: string;

    // 类型
    @Index()
    @Column()
    type: string;

    // 来源
    @Column()
    source: string;

    // 来源作者
    @Column({ default: "" })
    source_author: string;

    // 创建者
    @ManyToOne(() => User)
    creator: User;

    // 修改时间
    @UpdateDateColumn({ type: "timestamp" })
    update_time: Date;

    // 创建时间
    @CreateDateColumn({ type: "timestamp" })
    create_time: Date;

    // 喜欢人数
    @Column({ default: 0 })
    like_count: number;
}
