import { lazy } from 'react';

// Basic Components
export { default as Avatar } from './Avatar';
export { default as ConditionalRender } from './ConditionalRender';
export { default as FormatLocalNumber } from './FormatLocalNumber';
export { default as FormattedNumber } from './FormattedNumber';
export { default as Icon } from './Icon';
export { default as Image } from './Image';
export { default as Backlink } from './BackLink';
export { default as LanguageSelector } from './LanguageSelector';
export { default as Loader } from './Loader';

// Functions
export { default as GeneralModalFunction } from './Functions/GeneralModal';
export { default as ToastFunction } from './Functions/Toast';

// Modals (Lazy Loaded)
export const CustomModalV1 = lazy(
  () => import('./Modals/CustomModal/CustomModalV1')
);
export const GeneralModal = lazy(() => import('./Modals/GeneralModal'));

// Other Lazy Components
export const SuspenseLayout = lazy(() => import('./SuspenseLayout'));

export { EmptyComp, NewTable, PaginationWrapper } from './DataDisplay/index';
export { default as ErrorBoundary } from './ErrorBoundary';
export {
  Checkbox,
  DatePicker,
  FormattedAmountInput,
  Input,
  SelectV1,
  SelectV2,
  TimePicker,
} from './Form/index';
export { default as Header } from './Header';
export { AntNotificationLayout, AppShell, Router } from './Layouts/index';
export { default as Sidebar } from './Sidebar';
export { default as SidebarItem } from './Sidebar/SidebarItem';
export { BalanceCardSkeleton, Button, DynamicLabelSkeleton } from './Ui/index';
