import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Book } from '../books/book.entity';
import { Member } from '../members/member.entity';

export enum BorrowingStatus {
  BORROWED = 'borrowed',
  RETURNED = 'returned',
  OVERDUE = 'overdue',
}

@Entity({ name: 'borrowings' })
export class Borrowing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Book, { eager: true })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @Column()
  bookId: string;

  @ManyToOne(() => Member, { eager: true })
  @JoinColumn({ name: 'memberId' })
  member: Member;

  @Column()
  memberId: string;

  @Column({ type: 'datetime' })
  borrowDate: Date;

  @Column({ type: 'datetime' })
  dueDate: Date;

  @Column({ type: 'datetime', nullable: true })
  returnDate: Date | null;

  @Column({
    type: 'text',
    default: BorrowingStatus.BORROWED,
  })
  status: BorrowingStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
