import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../models';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { mockedUser, mockedUserParams } from '../../../common/mocks';
import { BadRequestException } from '@nestjs/common';
import { ErrorCodes } from '../../../common/utils';

describe('AuthService', () => {
  let service: AuthService;

  const bcryptHash = jest.fn();
  const bcryptCompare = jest.fn();
  const createUser = jest.fn();
  const saveUser = jest.fn();
  const findUser = jest.fn();

  beforeEach(async () => {
    (bcrypt.hash as jest.Mock) = bcryptHash;
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const userRepositoryMock = {
      create: createUser,
      save: saveUser,
      findOne: findUser,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new user', async () => {
    bcryptHash.mockResolvedValue('password');
    createUser.mockReturnValue(mockedUserParams);
    saveUser.mockResolvedValue(mockedUser(mockedUserParams));

    const createdUser = await service.createUser(mockedUserParams);
    expect(createdUser.email).toEqual(mockedUserParams.email);
  });

  it('fail to create new user ', async () => {
    createUser.mockRejectedValue({ code: ErrorCodes.DUPLICATE });

    try {
      await service.createUser(mockedUserParams);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });
});
