export type NotificationType =
  | "success"
  | "error"
  | "info"
  | "warning"
  | string;

export type NotificationItem = {
  id: number;
  title?: string;
  message: string;
  type: NotificationType;
};

export type GeneralModal = {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  display: boolean;
};

export interface AntNotificationsState {
  antNotificationsList: NotificationItem[];
  generalModal: GeneralModal;
}
