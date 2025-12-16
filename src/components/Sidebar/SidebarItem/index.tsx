import "./sidebar-item.scss";

import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ConditionalRender } from "@/components";
import { handleDisabledClick } from "@/shared/lib";

import { SidebarItemProps } from "./types";

const SidebarItem: React.FC<SidebarItemProps> = ({
  name,
  link,
  activeItem,
  collapsed,
  setActiveItem,
  setCollapsed,
  disabled,
}) => {
  const { t } = useTranslation();

  const isActive = activeItem === link;

  const handleClick = () => {
    if (link) {
      setActiveItem(link);
      if (!collapsed) {
        setCollapsed(true);
      }
    }
  };

  return (
    <div className="sidebar__nav-item__wrapper">
      {!link || disabled ? (
        <span
          className={`sidebar__nav-item sidebar__nav-item--disabled`}
          onClick={() => handleDisabledClick(t)}
        >
          <ConditionalRender value={!collapsed}>
            <span className="sidebar__nav-label">{t(`${name}`)}</span>
          </ConditionalRender>
        </span>
      ) : (
        <Link
          to={link || ""}
          className={`sidebar__nav-item ${isActive ? "sidebar__nav-item--active" : ""}`}
          onClick={handleClick}
        >
          {!collapsed && (
            <span className="sidebar__nav-label">{t(`${name}`)}</span>
          )}
        </Link>
      )}
    </div>
  );
};

export default SidebarItem;
