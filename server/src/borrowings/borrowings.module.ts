import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowingsService } from './borrowings.service';
import { BorrowingsController } from './borrowings.controller';
import { Borrowing } from './borrowing.entity';
import { BooksModule } from '../books/books.module';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Borrowing]),
    BooksModule,
    MembersModule,
  ],
  controllers: [BorrowingsController],
  providers: [BorrowingsService],
  exports: [BorrowingsService],
})
export class BorrowingsModule {}
