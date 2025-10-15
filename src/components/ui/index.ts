/**
 * V3 Design System - Core UI Components
 *
 * This barrel file exports all core UI components following the
 * V3 Design System specifications defined in V3-WIREFRAME-SPECIFICATIONS.md
 *
 * Components include:
 * - Button: Primary, secondary, and tertiary action buttons
 * - Input: Form input fields with error states
 * - Card: White card containers with variants
 * - Badge: Status indicators with semantic colors
 * - Modal: Accessible modal dialogs
 * - Tooltip: Hover hints and contextual help
 * - InfoPopover: Click-to-show detailed explanations
 */

// Button
export { Button } from './Button';
export type { ButtonProps } from './Button';

// Input
export { Input } from './Input';
export type { InputProps } from './Input';

// Card
export {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from './Card';
export type { CardProps } from './Card';

// Badge
export { Badge, StatusBadge } from './Badge';
export type { BadgeProps } from './Badge';

// Modal
export { Modal, ModalFooter } from './Modal';
export type { ModalProps } from './Modal';

// Tooltip
export { Tooltip, HelpIcon } from './Tooltip';
export type { TooltipProps, HelpIconProps } from './Tooltip';

// InfoPopover
export { InfoPopover, InfoIcon } from './InfoPopover';
export type { InfoPopoverProps, InfoIconProps } from './InfoPopover';

// Breadcrumbs
export { Breadcrumbs } from './Breadcrumbs';
export type { BreadcrumbsProps, BreadcrumbItem } from './Breadcrumbs';

// Toast
export { Toast, useToast } from './Toast';
export type { ToastProps, ToastVariant } from './Toast';

// ConfirmationModal
export { ConfirmationModal } from './ConfirmationModal';
export type { ConfirmationModalProps } from './ConfirmationModal';

// ProgressIndicator
export { ProgressIndicator } from './ProgressIndicator';
export type { ProgressIndicatorProps } from './ProgressIndicator';

// NavigationHeader
export { NavigationHeader, NavigationAction } from './NavigationHeader';
export type { NavigationHeaderProps } from './NavigationHeader';

// SidebarLayout
export { SidebarLayout, SidebarSettingsLayout, SidebarCompactLayout } from './SidebarLayout';
