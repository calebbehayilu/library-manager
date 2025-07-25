import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Borrowing, BorrowingStatus } from './borrowing.entity';
import { BooksService } from '../books/books.service';
import { MembersService } from '../members/members.service';

@Injectable()
export class BorrowingsService {
  constructor(
    @InjectRepository(Borrowing)
    private borrowingsRepository: Repository<Borrowing>,
    private booksService: BooksService,
    private membersService: MembersService,
  ) {}

  findAll(): Promise<Borrowing[]> {
    return this.borrowingsRepository.find();
  }

  findOne(id: string): Promise<Borrowing | null> {
    return this.borrowingsRepository.findOne({ where: { id } });
  }

  findByMember(memberId: string): Promise<Borrowing[]> {
    return this.borrowingsRepository.find({ where: { memberId } });
  }

  findByBook(bookId: string): Promise<Borrowing[]> {
    return this.borrowingsRepository.find({ where: { bookId } });
  }

  findOverdueBooks(): Promise<Borrowing[]> {
    const today = new Date();
    return this.borrowingsRepository
      .createQueryBuilder('borrowing')
      .where('borrowing.dueDate < :today', { today })
      .andWhere('borrowing.status = :status', { status: BorrowingStatus.BORROWED })
      .getMany();
  }

  async borrowBook(bookId: string, memberId: string, dueDate: Date): Promise<Borrowing> {
    // Check if book exists and is available
    const book = await this.booksService.findOne(bookId);
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
    
    if (book.availableCopies <= 0) {
      throw new HttpException('Book not available for borrowing', HttpStatus.BAD_REQUEST);
    }

    // Check if member exists
    const member = await this.membersService.findOne(memberId);
    if (!member) {
      throw new HttpException('Member not found', HttpStatus.NOT_FOUND);
    }

    if (!member.isActive) {
      throw new HttpException('Member is not active', HttpStatus.BAD_REQUEST);
    }

    // Create borrowing record
    const borrowing = this.borrowingsRepository.create({
      bookId,
      memberId,
      borrowDate: new Date(),
      dueDate,
      status: BorrowingStatus.BORROWED,
    });

    const savedBorrowing = await this.borrowingsRepository.save(borrowing);

    // Update book availability
    await this.booksService.update(bookId, {
      availableCopies: book.availableCopies - 1,
    });

    return savedBorrowing;
  }

  async returnBook(borrowingId: string): Promise<Borrowing> {
    const borrowing = await this.findOne(borrowingId);
    if (!borrowing) {
      throw new HttpException('Borrowing record not found', HttpStatus.NOT_FOUND);
    }

    if (borrowing.status === BorrowingStatus.RETURNED) {
      throw new HttpException('Book already returned', HttpStatus.BAD_REQUEST);
    }

    // Update borrowing record
    borrowing.returnDate = new Date();
    borrowing.status = BorrowingStatus.RETURNED;
    const updatedBorrowing = await this.borrowingsRepository.save(borrowing);

    // Update book availability
    const book = await this.booksService.findOne(borrowing.bookId);
    if (book) {
      await this.booksService.update(borrowing.bookId, {
        availableCopies: book.availableCopies + 1,
      });
    }

    return updatedBorrowing;
  }

  async markOverdue(): Promise<void> {
    const overdueBooks = await this.findOverdueBooks();
    
    for (const borrowing of overdueBooks) {
      borrowing.status = BorrowingStatus.OVERDUE;
      await this.borrowingsRepository.save(borrowing);
    }
  }

  async remove(id: string): Promise<void> {
    await this.borrowingsRepository.delete(id);
  }
}
