import React, { Suspense } from "react";

import { Loader } from "@/components";

import type { SuspenseLayoutProps } from "./types";

const SuspenseLayout: React.FC<SuspenseLayoutProps> = ({
  children,
  fallback = <Loader fullScreen />,
}) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default SuspenseLayout;
