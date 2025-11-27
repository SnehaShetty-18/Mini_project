export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  description: string;
  category?: 'primary' | 'secondary';
}

export const navigationConfig: NavigationItem[] = [
  { 
    name: 'Home', 
    href: '/homepage', 
    icon: 'HomeIcon',
    description: 'Overview and quick actions',
    category: 'primary'
  },
  { 
    name: 'Report Issue', 
    href: '/smart-reporting-center', 
    icon: 'ExclamationTriangleIcon',
    description: 'Submit community concerns',
    category: 'primary'
  },
  { 
    name: 'Community Map', 
    href: '/community-impact-map', 
    icon: 'MapIcon',
    description: 'Visualize local impact',
    category: 'primary'
  },
  { 
    name: 'Track Progress', 
    href: '/progress-tracker', 
    icon: 'ChartBarIcon',
    description: 'Monitor issue resolution',
    category: 'primary'
  },
  { 
    name: 'Civic Hub', 
    href: '/civic-engagement-hub', 
    icon: 'UserGroupIcon',
    description: 'Community engagement',
    category: 'primary'
  },
  { 
    name: 'Authority Portal', 
    href: '/authority-portal', 
    icon: 'BuildingOfficeIcon',
    description: 'Municipal dashboard',
    category: 'secondary'
  },
];

export const primaryNavItems = navigationConfig.filter(item => item.category === 'primary');
export const secondaryNavItems = navigationConfig.filter(item => item.category === 'secondary');

export interface QuickAction {
  name: string;
  icon: string;
  href?: string;
  action?: () => void;
}

export const quickActionsConfig: QuickAction[] = [
  { name: 'Quick Report', icon: 'PlusIcon', href: '/smart-reporting-center' },
  { name: 'View Notifications', icon: 'BellIcon' },
  { name: 'Settings', icon: 'CogIcon' },
];
