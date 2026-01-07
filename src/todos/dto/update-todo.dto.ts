import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsBoolean({ message: 'isCompleted must be a boolean value' })
  isCompleted?: boolean;
}