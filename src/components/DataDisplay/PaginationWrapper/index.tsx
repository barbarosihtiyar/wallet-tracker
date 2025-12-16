import "./pagination.scss";

import React from "react";

import { Props } from "./types";

const PaginationWrapper: React.FC<Props> = ({ children }) => (
  <div className="pagination-wrapper">{children}</div>
);

export default PaginationWrapper;
