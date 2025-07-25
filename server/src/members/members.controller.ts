import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { MembersService } from './members.service';
import { Member } from './member.entity';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  create(@Body() createMemberDto: Partial<Member>): Promise<Member> {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  findAll(): Promise<Member[]> {
    return this.membersService.findAll();
  }

  @Get('active')
  findActiveMembers(): Promise<Member[]> {
    return this.membersService.findActiveMembers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Member> {
    const member = await this.membersService.findOne(id);
    if (!member) {
      throw new HttpException('Member not found', HttpStatus.NOT_FOUND);
    }
    return member;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMemberDto: Partial<Member>): Promise<Member> {
    const member = await this.membersService.update(id, updateMemberDto);
    if (!member) {
      throw new HttpException('Member not found', HttpStatus.NOT_FOUND);
    }
    return member;
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.membersService.remove(id);
  }
}
