// ../../types/LoadingProps.ts
import React from 'react';

export interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  text: string;
  type?: 'submit' | 'button' | 'reset';      // keep or expand as you wish
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';  // NEW ─ matches the map in the component
}
