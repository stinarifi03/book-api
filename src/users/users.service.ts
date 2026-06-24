import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService{
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
    ){}

    async create(dto: CreateUserDto): Promise<Omit<Users, 'password'>>{

        const existing = await this.usersRepository.findOneBy({email: dto.email});
        if(existing) throw new ConflictException("Email already exists");

        const hash = await bcrypt.hash(dto.password, 10);

        const user = this.usersRepository.create({email: dto.email, password: hash});
        const saved = await this.usersRepository.save(user);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {password: _, ...result} = saved;
        return result;
    }

    findByEmail(email: string): Promise<Users | null >{
        return this.usersRepository.findOneBy({email});
    }
}