import { Button } from "@/components/ui/button";
import { useCustomToast } from "@/hooks/use-custom-toast";

export function ToastExamples() {
  const toast = useCustomToast();

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => toast.success('Task completed successfully', {
            description: 'Your task has been completed and saved.'
          })}
        >
          Success Toast
        </Button>
        
        <Button
          onClick={() => toast.error('Something went wrong', {
            description: 'There was an error completing your request.'
          })}
          variant="destructive"
        >
          Error Toast
        </Button>
        
        <Button
          onClick={() => toast.warning('Action required', {
            description: 'Please complete your profile to continue.'
          })}
          variant="outline"
        >
          Warning Toast
        </Button>
        
        <Button
          onClick={() => toast.info('New feature available', {
            description: 'Check out our latest features in the help section.'
          })}
          variant="secondary"
        >
          Info Toast
        </Button>

        <Button
          onClick={() => {
            const fakePromise = new Promise((resolve, reject) => {
              setTimeout(() => {
                Math.random() > 0.3 ? resolve({}) : reject(new Error('Failed to complete'));
              }, 2000);
            });

            toast.promise(fakePromise, {
              loading: 'Loading...',
              success: 'Operation completed!',
              error: (err) => `Error: ${err.message}`
            });
          }}
        >
          Promise Toast
        </Button>
      </div>
    </div>
  );
}
