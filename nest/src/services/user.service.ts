import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Document,
  Model,
  ObjectId,
  RootFilterQuery,
  UpdateQuery,
} from 'mongoose';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import { User, UserDocument } from 'src/schemas/user.schemas';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUsers() {
    return this.userModel.find();
  }

  async createUser(createUserDto: CreateUserDto) {
    console.log('create user dto', createUserDto);
    const newUser = await this.userModel.create(createUserDto);
    await newUser.save()
    return newUser.toObject()
  }

  async getUserById(id: string) {
    console.log('this.userModel.findById(id)', this.userModel.findById(id))
    return this.userModel.findById(id);
  }

  async deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async updateUser(id: ObjectId, updateUserDto: UpdateQuery<UpdateUserDto>) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto);
  }

  async findUser(query) {
    return this.userModel.findOne(query);
  }

  async findUserBy(query: RootFilterQuery<User>): Promise<UserDocument | null> {
    console.log('await this.userModel.findOne(query).exec();', await this.userModel.findOne(query).exec())
    return await this.userModel.findOne(query).exec();
  }

  // create a general query for finding a user with all possible queries
  // create a general query for finding and updating
}
