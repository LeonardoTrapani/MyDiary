export const BACKEND_URL = "http://localhost:3000";

export const SHOW_BURGER_MENU_PX = 768;

interface NavigationItem {
  name: string;
  to: string;
}
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    name: "home",
    to: "/",
  },
  {
    name: "Add homework",
    to: "/create-homework",
  },
];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const BAR_OPACITY = 0.5;
