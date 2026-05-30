interface NavItem {
  name: string;
  path: string;
}

const navData: NavItem[] = [
  {
    name: "About",
    path: "/about"
  },
  {
    name: "Project",
    path: "/project"
  },
  {
    name: "Blog",
    path: "/blog"
  },
  {
    name: "Contact",
    path: "/contact"
  }
]

export default navData;