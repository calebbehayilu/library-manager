import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './member.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}

  findAll(): Promise<Member[]> {
    return this.membersRepository.find();
  }

  findOne(id: string): Promise<Member | null> {
    return this.membersRepository.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<Member | null> {
    return this.membersRepository.findOne({ where: { email } });
  }

  findByMembershipNumber(membershipNumber: string): Promise<Member | null> {
    return this.membersRepository.findOne({ where: { membershipNumber } });
  }

  create(member: Partial<Member>): Promise<Member> {
    const newMember = this.membersRepository.create(member);
    return this.membersRepository.save(newMember);
  }

  async update(id: string, member: Partial<Member>): Promise<Member | null> {
    await this.membersRepository.update(id, member);
    return this.membersRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.membersRepository.delete(id);
  }

  async findActiveMembers(): Promise<Member[]> {
    return this.membersRepository.find({ where: { isActive: true } });
  }
}
