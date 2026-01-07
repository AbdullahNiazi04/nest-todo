import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NeonDatabase } from 'drizzle-orm/neon-serverless';
import { DATABASE_CONNECTION } from '../database/database.module';
import * as schema from '../db/schema';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NeonDatabase<typeof schema>,
  ) {}

  async findAll() {
    return await this.db.select().from(schema.todos);
  }

  async findOne(id: number) {
    const [todo] = await this.db
      .select()
      .from(schema.todos)
      .where(eq(schema.todos.id, id));

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  async create(createTodoDto: CreateTodoDto) {
    const [newTodo] = await this.db
      .insert(schema.todos)
      .values({
        task: createTodoDto.task,
      })
      .returning();

    return newTodo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    // Check if todo exists first
    await this.findOne(id);

    const [updatedTodo] = await this.db
      .update(schema.todos)
      .set({
        isCompleted: updateTodoDto.isCompleted,
      })
      .where(eq(schema.todos.id, id))
      .returning();

    return updatedTodo;
  }

  async toggleComplete(id: number) {
    const todo = await this.findOne(id);

    const [updatedTodo] = await this.db
      .update(schema.todos)
      .set({
        isCompleted: !todo.isCompleted,
      })
      .where(eq(schema.todos.id, id))
      .returning();

    return updatedTodo;
  }

  async remove(id: number) {
    // Check if todo exists first
    await this.findOne(id);

    await this.db.delete(schema.todos).where(eq(schema.todos.id, id));

    return { message: `Todo with ID ${id} successfully deleted` };
  }
}