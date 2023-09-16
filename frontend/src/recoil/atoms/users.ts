import { atom } from 'recoil';
interface User {
  name: string;
  topic?: string | undefined;
  senryu?: string | undefined;
}
export const usersAtom = atom<User[]>({
  key: 'users',
  default: [
    {
      name: 'Guest1',
    },
  ],
});
