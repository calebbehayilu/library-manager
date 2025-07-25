import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { BorrowingsService } from './borrowings.service';
import { Borrowing } from './borrowing.entity';

interface BorrowBookDto {
  bookId: string;
  memberId: string;
  dueDate: string;
}

@Controller('borrowings')
export class BorrowingsController {
  constructor(private readonly borrowingsService: BorrowingsService) {}

  @Post('borrow')
  async borrowBook(@Body() borrowBookDto: BorrowBookDto): Promise<Borrowing> {
    const { bookId, memberId, dueDate } = borrowBookDto;
    return this.borrowingsService.borrowBook(bookId, memberId, new Date(dueDate));
  }

  @Patch('return/:id')
  returnBook(@Param('id') id: string): Promise<Borrowing> {
    return this.borrowingsService.returnBook(id);
  }

  @Get()
  findAll(): Promise<Borrowing[]> {
    return this.borrowingsService.findAll();
  }

  @Get('overdue')
  findOverdueBooks(): Promise<Borrowing[]> {
    return this.borrowingsService.findOverdueBooks();
  }

  @Get('member/:memberId')
  findByMember(@Param('memberId') memberId: string): Promise<Borrowing[]> {
    return this.borrowingsService.findByMember(memberId);
  }

  @Get('book/:bookId')
  findByBook(@Param('bookId') bookId: string): Promise<Borrowing[]> {
    return this.borrowingsService.findByBook(bookId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Borrowing> {
    const borrowing = await this.borrowingsService.findOne(id);
    if (!borrowing) {
      throw new HttpException('Borrowing record not found', HttpStatus.NOT_FOUND);
    }
    return borrowing;
  }

  @Post('mark-overdue')
  async markOverdue(): Promise<{ message: string }> {
    await this.borrowingsService.markOverdue();
    return { message: 'Overdue books marked successfully' };
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.borrowingsService.remove(id);
  }
}
