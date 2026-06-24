import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { Book } from '../books/book.entity';
import { Exclude } from 'class-transformer';
import{Role } from '../auth/role.enum';

@Entity()
export class Users{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Column()
    @Exclude()
    password: string;

    @OneToMany(() => Book, (book) => book.owner)
    books: Book[];

    @Column({type: 'enum', enum: Role, default: Role.User})
    role: Role;
}