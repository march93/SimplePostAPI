import { User } from '.././models';

export const mockedUserParams = {
  username: 'test',
  email: 'test@test.com',
  password: 'password',
};

export const mockedPostUserParams = {
  username: 'testing',
  email: 'testing@test.com',
  password: 'password',
};

export const mockedUser = (params: {
  username: string;
  email: string;
  password: string;
}) => {
  const user = new User();
  user.username = params.username;
  user.email = params.email;
  user.password = params.password;

  return user;
};
