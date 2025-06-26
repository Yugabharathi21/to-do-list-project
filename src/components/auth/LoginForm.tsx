import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Mail, LockIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onToggleMode: () => void;
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      
      const response = await authAPI.login(data);
      const { token, user } = response.data;
      
      setAuth(user, token);
      toast.success('Welcome back!');
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 text-destructive rounded-sm py-2">
          <AlertDescription className="font-body text-sm">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium font-body block text-foreground">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              autoComplete="email"
              {...register('email')}
              className={cn(
                "pl-10 h-10 font-body bg-background border-border/60",
                "focus:border-primary/60 focus:ring-1 focus:ring-primary/20",
                "rounded-sm transition-all duration-300",
                errors.email && "border-destructive/50 focus:border-destructive/50 focus:ring-destructive/20"
              )}
            />
          </div>
          {errors.email && (
            <p className="text-destructive text-xs mt-1 font-body">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium font-body block text-foreground">
            Password
          </Label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password')}
              className={cn(
                "pl-10 h-10 pr-10 font-body bg-background border-border/60",
                "focus:border-primary/60 focus:ring-1 focus:ring-primary/20",
                "rounded-sm transition-all duration-300",
                errors.password && "border-destructive/50 focus:border-destructive/50 focus:ring-destructive/20"
              )}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-destructive text-xs mt-1 font-body">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="remember" 
              className="pro-checkbox h-4 w-4" 
            />
            <label 
              htmlFor="remember" 
              className="ml-2 text-sm font-body text-muted-foreground"
            >
              Remember me
            </label>
          </div>
          <a href="#" className="text-sm font-body text-primary hover:underline">
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-body text-sm rounded-sm transition-all duration-300 relative overflow-hidden"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
      
      {/* Sign up link */}
      <div className="pt-2 text-center border-t border-border/30 mt-6">
        <p className="text-sm font-body text-muted-foreground">
          Don't have an account yet?{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-primary hover:underline font-medium transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}