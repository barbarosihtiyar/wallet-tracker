import "./loader.scss";

import classNames from "classnames";
import React, { useEffect } from "react";

import { LoaderProps } from "./types";

const Loader: React.FC<LoaderProps> = ({
  fullScreen = false,
  type = "sm",
  flex = "start",
  theme = "dark",
}) => {
  useEffect(() => {
    if (fullScreen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [fullScreen]);

  return (
    <div
      className={classNames("loader", {
        "loader--full": fullScreen,
        [`loader--${flex}`]: !fullScreen,
        [`loader--${theme}`]: true,
      })}
    >
      <div
        className={classNames("loader__spinner", `loader__spinner--${type}`, {
          "loader__spinner--full": fullScreen,
        })}
      />
    </div>
  );
};

export default Loader;
