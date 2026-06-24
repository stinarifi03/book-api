import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne} from 'typeorm';
import {Users} from '../users/user.entity';

@Entity()
export class Book{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column({nullable: true})
    description: string;

    @Column({default: false})
    published: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(()=> Users, (user) => user.books, {eager: true})
    owner: Users;

    
}