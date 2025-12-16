import React from "react";

import { formatLocalNumber } from "@/shared/lib";

type FormatLocalNumberProps = React.ComponentProps<"span"> & {
  value: number | string;
  currency?: string;
};

const FormatLocalNumber: React.FC<FormatLocalNumberProps> = ({
  value,
  currency,
  ...props
}) => {
  return (
    <span {...props}>
      {formatLocalNumber(Number(value))} {currency}
    </span>
  );
};

export default FormatLocalNumber;
