export type User = {
  username: string;
};

export type AuthSession = {
  user: User;
  token: string;
};
