import { showGeneralModal } from '@/redux/slices/Notifications/slice';
import { store } from '@/redux/store';

type NotificationType = 'success' | 'error' | 'info' | 'warning' | string;

const GeneralModalFunction = (
  type: NotificationType,
  message: string,
  title: string | null = null,
) => {
  store.dispatch(showGeneralModal({ type, message, title }));
};

export default GeneralModalFunction;
