import { Config } from '@/app/router/config';

export const sidebarList = [
  { name: 'ui.sidebar.dashboard', link: Config.HOMEPAGE },
];

export const menuItems = [
  { icon: 'settings', text: 'ui.sidebar.footer.settings', disabled: true },
  { icon: 'id-sign', text: 'ui.sidebar.footer.audit', disabled: true },
  { icon: 'at-sign', text: 'ui.sidebar.footer.alerts', disabled: true },
];

export { mockCustomers, mockTransactions } from './dashboard';
