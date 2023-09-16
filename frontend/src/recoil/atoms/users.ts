import { atom } from 'recoil';
interface User {
  name: string;
}
export const usersAtom = atom<User[]>({
  key: 'users',
  default: [
    {
      name: 'Guest1',
    },
  ],
});
