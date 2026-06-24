import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {Users} from '../users/user.entity';
import { QueryBookDto } from './dto/query-book.dto';
import { Role } from '../auth/role.enum';

@Injectable()
export class BooksService{
    constructor(
        @InjectRepository(Book)
        private readonly booksRepository: Repository<Book>,
    ){}

    async findAll(query: QueryBookDto){
        const {page = 1, limit = 10, author, published} = query;
        const skip = (page - 1) * limit;

        const qb = this.booksRepository.createQueryBuilder('book')
        .leftJoinAndSelect('book.owner', 'owner')
        .skip(skip)
        .take(limit)
        .orderBy('book.createdAt', 'DESC');

        if(author){
            qb.andWhere('LOWER(book.author) LIKE LOWER(:author)', { author: `%${author}%`})
        }

        if(published !== undefined){
            qb.andWhere('book.published = :published', {published});
        }

        const [data, total] = await qb.getManyAndCount();

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }
    }

    async findOne(id: number): Promise<Book> {
        const book = await this.booksRepository.findOneBy({ id });
        if (!book) throw new NotFoundException(`Book #${id} not found`);
        return book;
    }


    create(dto: CreateBookDto, owner: Users): Promise<Book>{
        const book = this.booksRepository.create({...dto, owner});
        return this.booksRepository.save(book);
    }

    async update(id: number, dto: UpdateBookDto, userId: number): Promise<Book>{
        const book = await this.findOne(id);

        if(book.owner.id !== userId) throw new ForbiddenException("You are not the owner of this book");

        Object.assign(book, dto);
        return this.booksRepository.save(book);
    }

    async remove(id: number, userId: number, userRole: Role): Promise<void>{
        const book = await this.findOne(id);

        const isAdmin = userRole === Role.Admin;
        const isOwner = book.owner?.id === userId;

        if(!isAdmin && !isOwner) throw new ForbiddenException("You are not the owner of this book");

        await this.booksRepository.remove(book);
    }
}