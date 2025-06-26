import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-sm',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:hover:bg-primary/90 dark:group-[.toast]:hover:bg-primary/80',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-foreground group-[.toast]:hover:bg-muted/80',
          closeButton:
            'group-[.toast]:text-foreground/60 group-[.toast]:hover:text-foreground group-[.toast]:bg-transparent group-[.toast]:border-none group-[.toast]:hover:bg-secondary/50 group-[.toast]:rounded-sm'
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
