import type { ComponentType, SVGProps } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type SvgModule = {
  default?: IconComponent;
  ReactComponent?: IconComponent;
};

const modules = import.meta.glob<SvgModule>("@/assets/icons/*.svg", {
  eager: true,
  query: "?react",
});

const iconRegistry: Record<string, IconComponent> = {};

Object.entries(modules).forEach(([path, module]) => {
  const fileName = path.split("/").pop() || "";
  const iconName = fileName.replace(".svg", "");

  const Component = module.default ?? module.ReactComponent;

  if (Component) {
    iconRegistry[iconName] = Component;
  }
});

export type IconName = keyof typeof iconRegistry;

export const getIconComponent = (name: IconName) => iconRegistry[name];

export const getAvailableIcons = (): IconName[] => {
  return Object.keys(iconRegistry) as IconName[];
};

export { iconRegistry };
