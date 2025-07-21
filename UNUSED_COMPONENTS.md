# Unused UI Components

The following UI components are not being used anywhere in the codebase and can be safely removed:

## Completely Unused Components:
- `src/components/ui/accordion.tsx` - No imports or usage found
- `src/components/ui/avatar.tsx` - No imports or usage found  
- `src/components/ui/badge.tsx` - No imports or usage found
- `src/components/ui/calendar.tsx` - No imports or usage found
- `src/components/ui/carousel.tsx` - No imports or usage found
- `src/components/ui/chart.tsx` - No imports or usage found
- `src/components/ui/checkbox.tsx` - No imports or usage found
- `src/components/ui/collapsible.tsx` - No imports or usage found
- `src/components/ui/dialog.tsx` - No imports or usage found (AlertDialog is used instead)
- `src/components/ui/form.tsx` - No imports or usage found
- `src/components/ui/menubar.tsx` - No imports or usage found
- `src/components/ui/popover.tsx` - No imports or usage found
- `src/components/ui/progress.tsx` - No imports or usage found
- `src/components/ui/radio-group.tsx` - No imports or usage found
- `src/components/ui/scroll-area.tsx` - No imports or usage found
- `src/components/ui/select.tsx` - No imports or usage found
- `src/components/ui/sheet.tsx` - Only used internally by sidebar component
- `src/components/ui/slider.tsx` - No imports or usage found
- `src/components/ui/switch.tsx` - No imports or usage found
- `src/components/ui/table.tsx` - No imports or usage found
- `src/components/ui/tabs.tsx` - No imports or usage found
- `src/components/ui/textarea.tsx` - No imports or usage found
- `src/components/ui/tooltip.tsx` - Only used internally by sidebar component

## Components Used Internally Only:
- `sheet.tsx` - Only used by sidebar.tsx
- `tooltip.tsx` - Only used by sidebar.tsx

## Recommendation:
Remove all unused components to reduce bundle size and improve maintainability.
Keep only the components that are actually used in the application. 