
export type IUserActivity = {
  id: string;
  title: string;
  date: Date | null;
  category: string;
};

export class UserActivity implements IUserActivity {
  id: string = '';
  title: string = '';
  date: Date | null = null;
  category: string = '';
}
