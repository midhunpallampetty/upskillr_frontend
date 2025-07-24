export type AdminSection = 'welcome' | 'students' | 'schools' | 'content';

export interface AdminDashboardState {
  activeSection: AdminSection;
}

export type AdminDashboardAction =
  | { type: 'SET_SECTION'; payload: AdminSection }
  | { type: 'RESET' };

export const initialAdminDashboardState: AdminDashboardState = {
  activeSection: (localStorage.getItem('admin_active_section') as AdminSection) || 'welcome',
};

export const adminDashboardReducer = (
  state: AdminDashboardState,
  action: AdminDashboardAction
): AdminDashboardState => {
  switch (action.type) {
    case 'SET_SECTION':
      localStorage.setItem('admin_active_section', action.payload);
      return { ...state, activeSection: action.payload };
    case 'RESET':
      localStorage.removeItem('admin_active_section');
      return { ...state, activeSection: 'welcome' };
    default:
      return state;
  }
};
