import { useState, useEffect } from 'react';
import { LogIn, UserPlus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useAuthStore } from '@/lib/store';

interface AuthMenuProps {
  defaultTab?: 'login' | 'register';
}

export function AuthMenu({ defaultTab = 'login' }: AuthMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const { user } = useAuthStore();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'login' | 'register');
  };
  
  useEffect(() => {
    // Close the dialog when user is authenticated
    if (user && isOpen) {
      setIsOpen(false);
    }
  }, [user]);

  const openLogin = () => {
    setActiveTab('login');
    setIsOpen(true);
  };

  const openRegister = () => {
    setActiveTab('register');
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-sm hover:bg-secondary/70 text-sm font-body flex items-center gap-1.5"
          onClick={openLogin}
        >
          <LogIn className="h-3.5 w-3.5" />
          <span>Sign In</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-sm border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-body flex items-center gap-1.5"
          onClick={openRegister}
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>Sign Up</span>
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-card border-border/80 rounded-sm shadow-md max-w-md p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="font-heading text-lg mb-1 text-foreground">
                  {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
                </DialogTitle>
                <DialogDescription className="font-body text-sm text-muted-foreground">
                  {activeTab === 'login' 
                    ? 'Sign in to access your tasks and notes' 
                    : 'Register to start organizing your tasks'}
                </DialogDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-sm absolute right-4 top-4 text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <Tabs 
            defaultValue={activeTab} 
            value={activeTab} 
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="px-6 pt-4">
              <TabsList className="grid grid-cols-2 bg-background/80 border border-border/60 rounded-sm p-0.5">
                <TabsTrigger 
                  value="login" 
                  className="rounded-sm font-body text-sm py-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="rounded-sm font-body text-sm py-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="px-6 py-6">
              <TabsContent value="login" className="m-0">
                <LoginForm onToggleMode={() => handleTabChange('register')} />
              </TabsContent>
              <TabsContent value="register" className="m-0">
                <RegisterForm onToggleMode={() => handleTabChange('login')} />
              </TabsContent>
            </div>
          </Tabs>
          
          <div className="p-4 bg-secondary/30 flex justify-center border-t border-border/60">
            <p className="text-xs text-muted-foreground font-body">
              &copy; {new Date().getFullYear()} E-Tasks | <a href="#" className="text-primary hover:underline">Privacy</a> | <a href="#" className="text-primary hover:underline">Terms</a>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
