'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { Navbar } from '@/components/layout/navbar';
import { useUser } from '@/hooks/use-auth';
import { useUpdateName, useUpdatePassword } from '@/hooks/use-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';

const nameSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(6, 'New password must be at least 6 characters'),
  confirm_password: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type NameFormValues = z.infer<typeof nameSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { data: user } = useUser();
  const updateName = useUpdateName();
  const updatePassword = useUpdatePassword();

  const nameForm = useForm<NameFormValues>({
    resolver: zodResolver(nameSchema),
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (user?.name) {
      nameForm.reset({ name: user.name });
    }
  }, [user, nameForm]);

  const onNameSubmit = (data: NameFormValues) => {
    updateName.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    updatePassword.mutate({
      current_password: data.current_password,
      new_password: data.new_password,
    }, {
      onSuccess: () => {
        passwordForm.reset();
      }
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account details and security
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your display name
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={nameForm.handleSubmit(onNameSubmit)} className="flex items-end gap-4 max-w-md">
                  <div className="space-y-2 flex-1">
                    <label className="text-sm font-medium">Name</label>
                    <Input {...nameForm.register('name')} />
                    {nameForm.formState.errors.name && (
                      <p className="text-xs text-destructive">{nameForm.formState.errors.name.message}</p>
                    )}
                  </div>
                  <Button type="submit" disabled={updateName.isPending || !nameForm.formState.isDirty}>
                    {updateName.isPending ? 'Saving...' : 'Save Name'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Change your password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <Input type="password" {...passwordForm.register('current_password')} />
                    {passwordForm.formState.errors.current_password && (
                      <p className="text-xs text-destructive">{passwordForm.formState.errors.current_password.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <Input type="password" {...passwordForm.register('new_password')} />
                    {passwordForm.formState.errors.new_password && (
                      <p className="text-xs text-destructive">{passwordForm.formState.errors.new_password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <Input type="password" {...passwordForm.register('confirm_password')} />
                    {passwordForm.formState.errors.confirm_password && (
                      <p className="text-xs text-destructive">{passwordForm.formState.errors.confirm_password.message}</p>
                    )}
                  </div>

                  <Button type="submit" disabled={updatePassword.isPending}>
                    {updatePassword.isPending ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
