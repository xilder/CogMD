'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { CLIENT } from '@/lib/routes';
import { BarChart3, BookOpen, Home, LogOut, Settings, X } from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { clientLogout } = useAuth();

  const navItems = [
    { icon: Home, label: 'Dashboard', href: CLIENT.DASHBOARD },
    { icon: BookOpen, label: 'Study Materials', href: CLIENT.STUDY },
    { icon: BarChart3, label: 'Progress', href: CLIENT.PROGRESS },
    { icon: Settings, label: 'Settings', href: CLIENT.SETTINGS },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className='hidden md:flex w-64 bg-sidebar border-r border-sidebar-border flex-col'>
        <div className='p-6 border-b border-sidebar-border'>
          <Link href='/' className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center'>
              <span className='text-sidebar-primary-foreground font-bold'>
                C
              </span>
            </div>
            <span className='font-bold text-lg text-sidebar-foreground'>
              CognitoMD
            </span>
          </Link>
        </div>

        <nav className='flex-1 p-4 space-y-2'>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant='ghost'
                  className='w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                >
                  <Icon className='w-5 h-5 mr-3' />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className='p-4 border-t border-sidebar-border'>
          <Button
            variant='ghost'
            className='w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent'
            onClick={clientLogout}
          >
            <LogOut className='w-5 h-5 mr-3' />
            Logout
          </Button>
        </div>
      </aside>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 md:hidden`}
          aria-hidden={!isOpen}
        >
          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              isOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0'
            }`}
            onClick={onToggle}
          />

          {/* Sidebar Panel */}
          <aside
            className={`absolute left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transform transition-transform duration-300 ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className='p-6 border-b border-sidebar-border flex items-center justify-between'>
              <Link href='/' className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center'>
                  <span className='text-sidebar-primary-foreground font-bold'>
                    C
                  </span>
                </div>
                <span className='font-bold text-lg text-sidebar-foreground'>
                  CognitoMD
                </span>
              </Link>
              <Button variant='ghost' size='icon' onClick={onToggle}>
                <X className='w-6 h-6' />
              </Button>
            </div>

            <nav className='flex-1 p-4 space-y-2'>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant='ghost'
                      className='w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      onClick={onToggle} // close after click
                    >
                      <Icon className='w-5 h-5 mr-3' />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            <div className='p-4 border-t border-sidebar-border'>
              <Button
                variant='ghost'
                className='w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent'
                onClick={() => {
                  onToggle();
                  clientLogout();
                }}
              >
                <LogOut className='w-5 h-5 mr-3' />
                Logout
              </Button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
