import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseGuards, Request, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBookDto } from './dto/query-book.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('books')
export class BooksController{
    constructor(private readonly booksService: BooksService){}

    @Get()
    findAll(@Query() query: QueryBookDto){
        return this.booksService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe)id: number){
        return this.booksService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateBookDto, @Request() req){
        return this.booksService.create(dto, req.user);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBookDto, @Request() req){
        return this.booksService.update(id, dto, req.user.id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id', ParseIntPipe) id: number, @Request() req){
        return this.booksService.remove(id, req.user.id, req.user.role);
    }
}