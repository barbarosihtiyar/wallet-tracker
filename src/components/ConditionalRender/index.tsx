import type { ConditionalRenderProps } from "./types";

const ConditionalRender = ({
  value = false,
  children,
}: ConditionalRenderProps) => {
  return value ? <>{children}</> : null;
};

export default ConditionalRender;
