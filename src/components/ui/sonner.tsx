import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();
  
  // Default options that can be overridden by props
  const defaultOptions = {
    duration: 5000,
    classNames: {
      toast:
        'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-md group-[.toaster]:pr-12 group-[.toaster]:py-3 group-[.toaster]:pl-4 group-[.toaster]:border-l-4 group-[.toaster]:border-l-primary',
      description: 'group-[.toast]:text-muted-foreground',
      actionButton:
        'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:hover:bg-primary/90 dark:group-[.toast]:hover:bg-primary/80',
      cancelButton:
        'group-[.toast]:bg-muted group-[.toast]:text-foreground group-[.toast]:hover:bg-muted/80',
      closeButton:
        'group-[.toast]:text-foreground/70 group-[.toast]:hover:text-foreground group-[.toast]:bg-transparent group-[.toast]:border-none group-[.toast]:hover:bg-secondary/50 group-[.toast]:rounded-sm group-[.toast]:p-2 group-[.toast]:opacity-100 group-[.toast]:transition-opacity group-[.toast]:flex group-[.toast]:items-center group-[.toast]:justify-center group-[.toast]:w-8 group-[.toast]:h-8 group-[.toast]:min-w-8 group-[.toast]:min-h-8'
    }
  };

  // Merge default options with any provided in props
  const toastOptions = {
    ...defaultOptions,
    ...props.toastOptions,
    classNames: {
      ...defaultOptions.classNames,
      ...(props.toastOptions?.classNames || {})
    }
  };

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      closeButton
      toastOptions={toastOptions}
      {...props}
    />
  );
};

export { Toaster };
