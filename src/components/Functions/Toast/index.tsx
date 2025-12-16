import { showNotification } from "@/redux/slices/Notifications/slice";
import { store } from "@/redux/store";

type NotificationType = "success" | "error" | "info" | "warning" | string;

const ToastFunction = (
  title: string,
  message: string,
  type: NotificationType,
) => {
  store.dispatch(showNotification({ title, message, type }));
};

export default ToastFunction;
