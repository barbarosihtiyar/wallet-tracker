import { lazy } from "react";

export { default as AntNotificationLayout } from "./AntNotificationLayout/index";
export { default as AppShell } from "./AppShell/index";
export const Router = lazy(() => import("./Router"));
