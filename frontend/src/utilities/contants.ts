export const BACKEND_URL = 'http://localhost:3000';

export const SHOW_BURGER_MENU_PX = 768;

interface NavigationItem {
  name: string;
  to: string;
}
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    name: 'home',
    to: '/',
  },
  {
    name: 'Add homework',
    to: '/create-homework',
  },
];
