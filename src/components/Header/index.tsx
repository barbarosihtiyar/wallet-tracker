import "./header.scss";

import { LanguageSelector } from "@/components";

const Header = () => {
  return (
    <header className="header">
      <div className="header__brand">A1 Dashboard</div>
      <LanguageSelector />
    </header>
  );
};

export default Header;
