import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './book.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Book> {
    const book = await this.booksService.findOne(id);
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
    return book;
  }

  @Post()
  create(@Body() book: Partial<Book>): Promise<Book> {
    return this.booksService.create(book);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() book: Partial<Book>): Promise<Book> {
    const updatedBook = await this.booksService.update(id, book);
    if (!updatedBook) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
    return updatedBook;
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.booksService.remove(id);
  }
}