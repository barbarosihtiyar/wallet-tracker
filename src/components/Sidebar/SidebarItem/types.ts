export interface SubMenuItem {
  name: string;
  link?: string;
  disabled?: boolean;
}

export interface SidebarItemProps {
  name: string;
  link: string;
  activeItem: string;
  collapsed: boolean;
  setActiveItem: (link: string) => void;
  setCollapsed: (value: boolean) => void;
  disabled?: boolean;
}
