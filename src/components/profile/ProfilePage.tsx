import { useState } from 'react';
import { User, Save, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/lib/store';
import { authAPI } from '@/lib/api';

const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfilePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, updateUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      await authAPI.updateProfile({
        name: data.name,
      });

      // Update the user in the store
      updateUser({
        ...user,
        name: data.name,
        initials: data.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase(),
      });

      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-serif text-muted-foreground">
            Please sign in to view your profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 panel-transition-in">
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <h2 className="text-3xl font-serif tracking-tight text-foreground font-medium">
          Profile
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border border-border/70 rounded-sm shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="font-serif text-lg">Account Information</CardTitle>
            <CardDescription className="text-muted-foreground">
              Update your personal details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium font-body block">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    {...register('name')}
                    className="pl-10 h-10 font-body bg-transparent dark:bg-background/50 border-border/60
                     hover:border-primary/40 hover:bg-background/60 dark:hover:bg-background/80 rounded-sm"
                    placeholder="Your name"
                  />
                </div>
                {errors.name && (
                  <p className="text-destructive text-xs mt-1 font-body">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium font-body block">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="h-10 font-body bg-muted/50 border-border/40 text-muted-foreground rounded-sm"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-primary hover:bg-primary/80 dark:hover:bg-primary/70 text-primary-foreground 
                 font-body text-sm rounded-sm transition-all duration-300 relative overflow-hidden"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border/70 rounded-sm shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="font-serif text-lg">Profile Overview</CardTitle>
            <CardDescription className="text-muted-foreground">
              Your account details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="text-lg font-medium text-primary">{user.initials}</span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Member since</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Theme</span>
                <span className="font-medium capitalize">{user.preferences.theme}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Default view</span>
                <span className="font-medium capitalize">{user.preferences.defaultView}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
