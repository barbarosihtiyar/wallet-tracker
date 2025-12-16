import "./app-shell.scss";

import classNames from "classnames";
import React, { useState } from "react";

import { Header, Sidebar } from "@/components";
import { useScrollToTop } from "@/shared/hooks";

type AppShellProps = {
  children: React.ReactNode;
};

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  useScrollToTop();

  return (
    <div className={classNames("layout", { "layout--collapsed": collapsed })}>
      <div className="layout__rail">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className="layout__right">
        <header className="layout__headerbar">
          <Header />
        </header>

        <main className="layout__content">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
