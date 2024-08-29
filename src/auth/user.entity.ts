import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./user-role.enum";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({ unique: true }) // 이메일은 중복되지 않도록 한다.
    email: string;

    @Column()
    role: UserRole;
}