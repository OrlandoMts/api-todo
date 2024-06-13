import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guard';
import { ParseMongoIdPipe } from 'src/common/pipe';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req: any, @Body() createTodoDto: CreateTodoDto) {
    return await this.todoService.create(createTodoDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() request: any) {
    return await this.todoService.findAll(request.query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return await this.todoService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return await this.todoService.update(id, updateTodoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseMongoIdPipe) id: string) {
    return await this.todoService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('complete/:id')
  async toComplete(@Param('id', ParseMongoIdPipe) id: string) {
    return await this.todoService.toComplete(id);
  }
}
