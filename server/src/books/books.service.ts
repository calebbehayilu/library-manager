import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  findAll(): Promise<Book[]> {
    return this.booksRepository.find();
  }

  findOne(id: string): Promise<Book | null> {
    return this.booksRepository.findOne({ where: { id } });
  }

  create(book: Partial<Book>): Promise<Book> {
    const newBook = this.booksRepository.create(book);
    return this.booksRepository.save(newBook);
  }

  async update(id: string, book: Partial<Book>): Promise<Book | null> {
    await this.booksRepository.update(id, book);
    return this.booksRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.booksRepository.delete(id);
  }
}