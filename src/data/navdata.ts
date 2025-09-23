export interface NavItem {
  id: string;
  path: string;
}

const navData: NavItem[] = [
  {
    id: 'nav.about',
    path: '/about',
  },
  {
    id: 'nav.project',
    path: '/project',
  },
  {
    id: 'nav.blog',
    path: '/blog',
  },
  {
    id: 'nav.contact',
    path: '/contact',
  },
];

export default navData;