import './sidebar.scss';

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Icon, SidebarItem } from '@/components';
import { Icons } from '@/shared/constants';
import { sidebarList } from '@/shared/dummy';

import type { Props } from './types';

const Sidebar: React.FC<Props> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        <Icon
          onClick={() => setCollapsed(v => !v)}
          className="sidebar__toggle"
          name={Icons.SIDE_SIGN}
        />
      </div>

      <nav className="sidebar__nav">
        {sidebarList.map(item => (
          <SidebarItem
            key={item.name}
            name={item.name}
            link={item.link}
            activeItem={activeItem}
            collapsed={collapsed}
            setActiveItem={setActiveItem}
            setCollapsed={setCollapsed}
          />
        ))}
      </nav>

      {!collapsed && (
        <p className="version">
          <span>Version:</span>
          {process.env.APP_VERSION}
        </p>
      )}
    </aside>
  );
};

export default Sidebar;
