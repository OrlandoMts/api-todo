import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { JwtStrategy } from 'src/auth/service';
import { Todo, TodoSchema } from './entities/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  controllers: [TodoController],
  providers: [TodoService, JwtStrategy],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  ],
})
export class TodoModule {}
