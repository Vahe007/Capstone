import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, RootFilterQuery, UpdateQuery } from 'mongoose';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import { User } from 'src/schemas/user.schemas';

@Injectable()
export class UserService {
  // constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  private userModel;

  constructor() {
    this.userModel = {
      find: () => {
        console.log('found');
      },
      create: () => {
        console.log('created');
      },
      createUser: () => {
        console.log('createUser');
      },
      findById: () => {
        console.log('findById');
      },
      findByIdAndDelete: () => {
        console.log('findByIdAndDelete');
      },
      findByIdAndUpdate: () => {
        console.log('findByIdAndUpdate');
      },
      findOne: () => {
        console.log('findOne');
      },
      save: () => {
        console.log('save');
      },
    };
  }

  async getUsers() {
    return this.userModel.find();
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.userModel.create(createUserDto);
    return newUser.save();
  }

  async getUserById(id: string) {
    return this.userModel.findById(id);
  }

  async deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async updateUser(id: string, updateUserDto: UpdateQuery<UpdateUserDto>) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto);
  }

  async findUser(query) {
    return this.userModel.findOne(query);
  }

  async findUserBy(query: RootFilterQuery<User>): Promise<User> {
    const user = await this.userModel.findOne(query).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // create a general query for finding a user with all possible queries
  // create a general query for finding and updating
}
