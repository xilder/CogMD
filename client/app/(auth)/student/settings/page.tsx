'use client';

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

export default function SettingsPage() {
  const { user } = useAuth();

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
            <CardContent className='space-y-4'>
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
              <Button>Save Changes</Button>
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
                <input type='checkbox' defaultChecked className='w-4 h-4' />
              </div>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-medium text-foreground'>
                  Daily Reminders
                </label>
                <input type='checkbox' defaultChecked className='w-4 h-4' />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
