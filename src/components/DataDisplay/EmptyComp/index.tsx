import "./empty.scss";

import classNames from "classnames";
import React from "react";

import { Props } from "./types";

const EmptyComp: React.FC<Props> = ({
  img,
  type,
  text,
  className,
  ...rest
}) => {
  return (
    <div
      className={classNames("empty", { "empty--v2": type === "v2" }, className)}
    >
      <div className="empty__table">
        <div className="empty__table__row" />
        <div className="empty__table__row" />
        <div className="empty__table__row" />
        <div className="empty__table__row" />
      </div>

      <div className="empty__content" {...rest}>
        <figure>{img}</figure>
        {text && <span>{text}</span>}
      </div>
    </div>
  );
};

export default EmptyComp;
