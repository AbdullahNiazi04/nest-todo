import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty({ message: 'Task cannot be empty' })
  @IsString({ message: 'Task must be a string' })
  @MinLength(1, { message: 'Task must have at least 1 character' })
  @MaxLength(500, { message: 'Task cannot exceed 500 characters' })
  task: string;
}