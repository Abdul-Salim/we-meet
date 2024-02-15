interface UserState {
  isAuthenticated: boolean;
  userData?: {
    name: string;
    email: string;
  };
}

interface AppState {
  userState: UserState;
}
