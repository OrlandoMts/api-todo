import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { DataHttpItf } from 'src/common/interface';
import { APIFeatures } from 'src/common/utils/api-features.util';
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

  async create(createTodoDto: CreateTodoDto, req: any): Promise<Todo> {
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

  async findAll(query?: any): Promise<DataHttpItf<Todo>> {
    try {
      const response = new APIFeatures(
        this.todoMod.find().populate('author', 'username email'),
        query,
      )
        .filter()
        .sort()
        .limit()
        .pagination();

      const [todo, count] = await Promise.all([
        response.mongooseQuery,
        this.todoMod.countDocuments(response.mongooseQuery),
      ]);
      const res = {
        data: todo,
        count,
        message: 'All todo results',
      };
      return res;
    } catch (error) {
      this._handleError(error);
    }
  }

  async findOne(id: string): Promise<Todo> {
    const data = await this.todoMod
      .findById(id)
      .populate('author', 'username email')
      .exec();

    if (!data) throw new NotFoundException(`Not found todo with that id`);

    return data;
  }

  async update(
    id: string,
    updateTodoDto: UpdateTodoDto,
  ): Promise<DataHttpItf<Todo>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { author, ...rest } = updateTodoDto;
    const todo = await this.todoMod.findByIdAndUpdate(
      id,
      { ...rest },
      { new: true },
    );
    if (!todo) throw new NotFoundException(`Not found todo with that id`);

    return {
      data: todo,
      message: 'Updated successfully',
    };
  }

  async remove(id: string): Promise<DataHttpItf<any>> {
    const todo = await this.todoMod.findByIdAndUpdate(id, { status: false });
    if (!todo) throw new NotFoundException(`Not found todo with that id`);

    return {
      data: [],
      message: 'Delete successfully',
    };
  }

  async toComplete(id: string): Promise<DataHttpItf<Todo>> {
    const todo = await this.todoMod.findByIdAndUpdate(
      id,
      { completed: true },
      { new: true },
    );
    if (!todo) throw new NotFoundException(`Not found todo with that id`);
    return {
      data: todo,
      message: 'The todo was completed',
    };
  }
}
