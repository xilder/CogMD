'use client';

import StatusScreen from '@/components/status-screen';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { changePassword, toggleSendEmail, toggleSendNotification } from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SettingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient()
  const router = useRouter();
  const [statusConfig, setStatusConfig] = useState<React.ComponentProps<
    typeof StatusScreen
  > | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [cannotEditPassword, setCannotEditPassword] = useState(true);
  const [sendNotification, setSendNotification] = useState(user?.send_notification);
  const [sendEmail, setSendEmail] = useState(user?.send_email);
  const refreshPage = () => {
    setNewPassword('');
    setStatusConfig(null);
    router.refresh();
  };
  const changePasswordMutation = useMutation({
    mutationFn: (new_password: string) => changePassword(new_password),
    onSuccess: (_) => {
      setStatusConfig({
        variant: 'success',
        title: 'Password changed!',
        message: 'Password change successful. Go back to the Settings Screen',
        actions: [
          {
            label: 'Go back',
            onClick: refreshPage,
            variant: 'default',
          },
        ],
      });
    },
    onError: (_, variables) => {
      setStatusConfig({
        variant: 'error',
        title: 'Password change failed!',
        message:
          'Password change successful. Try again or go back to the Settings Screen',
        actions: [
          {
            label: 'Go back',
            onClick: refreshPage,
            variant: 'link',
          },
          {
            label: 'Try again',
            onClick: () => {
              setStatusConfig(null);
              changePasswordMutation.mutate(variables);
            },
            variant: 'default',
          },
        ],
      });
    },
  });

const sendEmailMutation = useMutation({
  mutationFn: (val: boolean) => toggleSendEmail(val),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userProfile'] }),
  onError: () => setSendEmail((prev) => !prev), 
});

const sendNotificationMutation = useMutation({
  mutationFn: (val: boolean) => toggleSendNotification(val),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userProfile'] }),
  onError: () => setSendNotification((prev) => !prev),
});

  if (statusConfig) return <StatusScreen {...statusConfig} />;

  return (
    <>
      <main className='flex-1 overflow-auto'>
        <div className='p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto'>
          <h1 className='text-3xl font-bold text-foreground mb-2'>Settings</h1>
          <p className='text-muted-foreground mb-8'>
            Manage your account preferences
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2 flex flex-col'>
              <div>
                <label className='text-sm font-medium text-foreground'>
                  Full Name
                </label>
                <Input
                  placeholder={`Dr. ${user ? user.full_name : 'Ahmed Hassan'}`}
                  className='mt-2'
                  disabled={true}
                />
              </div>
              <div>
                <label className='text-sm font-medium text-foreground'>
                  Email
                </label>
                <Input
                  placeholder={`${user ? user.email : 'ahmed@example.com'}`}
                  type='email'
                  className='mt-2'
                  disabled={true}
                />
              </div>
              <div>
                <label className='text-sm font-medium text-foreground'>
                  Username
                </label>
                <Input
                  placeholder={`${user ? user.username : 'ahmed@example.com'}`}
                  className='mt-2'
                  disabled={true}
                />
              </div>
              <div>
                <div>
                  <label className='text-sm font-medium text-foreground'>
                    New Password
                  </label>
                  <div className='flex w-full items-center gap-2 mt-2'>
                    <div className='flex w-full flex-1 items-center border border-input bg-background rounded-md'>
                      <Input
                        placeholder={
                          showPassword
                            ? 'Enter new password'
                            : `••••• ••• ••••••••`
                        }
                        type={showPassword ? 'text' : 'password'}
                        className='flex-1 outline-none border-none focus-visible:border-none'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={cannotEditPassword}
                      />
                      <Button
                        onClick={() => setShowPassword((prev) => !prev)}
                        className='border-none  border-l-2 border-red'
                        variant={showPassword ? 'outline' : 'default'}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                    <Button
                      onClick={() => setCannotEditPassword((prev) => !prev)}
                      variant={cannotEditPassword ? 'default' : 'outline'}
                    >
                      { cannotEditPassword ? 'Edit' : 'Cancel'}
                    </Button>
                  </div>
                </div>
                {newPassword.length < 8 && newPassword !== '' && (
                  <p className='text-xs text-[#FF383C] mt-1'>
                    Password should have at least 8 characters
                  </p>
                )}
              </div>
              <Button className='self-end mt-2'
                onClick={() => changePasswordMutation.mutate(newPassword)}
                disabled={newPassword.length < 8}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className='mt-6'>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize your learning experience
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
             <div className='flex items-center justify-between'>
    <label className='text-sm font-medium text-foreground'>
      Email Notifications
    </label>
    <input
      type='checkbox'
      checked={sendEmail} 
      onChange={(e) => {
        const newValue = e.target.checked;
        setSendEmail(newValue); 
        sendEmailMutation.mutate(newValue);
      }}
      className='w-4 h-4 accent-blue-600' 
      disabled={sendEmailMutation.isPending} 
    />
  </div>

  <div className='flex items-center justify-between'>
    <label className='text-sm font-medium text-foreground'>
      Daily Reminders
    </label>
    <input
      type='checkbox'
      checked={sendNotification}
      onChange={(e) => {
        const newValue = e.target.checked;
        setSendNotification(newValue);
        sendNotificationMutation.mutate(newValue);
      }}
      className='w-4 h-4 accent-blue-600'
      disabled={sendNotificationMutation.isPending}
    />
  </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
