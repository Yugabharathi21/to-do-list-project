import { Menu, Moon, Sun, User, Settings, LogOut, CheckSquare } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore, useUIStore } from '@/lib/store';
import { toast } from 'sonner';
import { AuthMenu } from '@/components/auth/AuthMenu';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, clearAuth } = useAuthStore();
  const { setSidebarOpen } = useUIStore();

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="sticky top-0 z-40 px-4 py-3 bg-background/80 backdrop-blur-[2px] border-b border-border/50 shadow-sm transition-all duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-foreground hover:bg-secondary/70"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="app-logo">
            <div className="flex items-center justify-center h-8 w-8 bg-card rounded-sm border border-border/80 shadow-sm">
              <CheckSquare className="h-4 w-4 text-primary" strokeWidth={2.5} />
            </div>
            <div>
              <span className="app-logo-text">
                <span className="font-display text-primary">E</span>-Tasks
              </span>
              <div className="text-[10px] -mt-1 text-muted-foreground font-medium font-mono">
                professional task management
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary/70"
          >
            {theme === 'dark' ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-sm">
                  <Avatar className="h-9 w-9 rounded-sm border border-border/80">
                    <AvatarImage src={user.avatar || ''} alt={user.name} />
                    <AvatarFallback className="rounded-sm bg-primary/10 text-primary text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card border-border/80 rounded-sm shadow-md" align="end" forceMount>
                <DropdownMenuLabel className="font-heading">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="hover:bg-secondary/70 focus:bg-secondary/70 text-sm cursor-pointer font-body"
                  onClick={() => {}}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="hover:bg-secondary/70 focus:bg-secondary/70 text-sm cursor-pointer font-body"
                  onClick={() => {}}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="hover:bg-secondary/70 focus:bg-secondary/70 text-sm cursor-pointer font-body"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthMenu defaultTab="login" />
          )}
        </div>
      </div>
    </nav>
  );
}