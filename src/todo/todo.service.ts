import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name);
  constructor(
    @InjectModel(Todo.name)
    private readonly todoMod: Model<Todo>,
  ) {}

  private _handleError(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('Check logs', error.message);
  }

  async create(createTodoDto: CreateTodoDto, req: any) {
    const { user } = req;
    const body: CreateTodoDto = {
      ...createTodoDto,
      author: new Types.ObjectId(user?._id as string),
    };
    try {
      const data = await this.todoMod.create(body);
      return data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async findAll() {
    try {
      return await this.todoMod.find();
    } catch (error) {
      this._handleError(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} todo`;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
