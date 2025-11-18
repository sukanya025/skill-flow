import React from 'react';
import { Button } from '@/components/ui/button';
import { useMember } from '@/integrations';

export default function HomePage() {
  const { member, isAuthenticated, actions } = useMember();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-[120rem] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-heading font-bold text-primary">
              My App
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-foreground">
                    Welcome, {member?.profile?.nickname || member?.contact?.firstName || 'User'}!
                  </span>
                  <Button variant="ghost" onClick={actions.logout}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button onClick={actions.login}>Sign In</Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[120rem] mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-6">
            Welcome to My App
          </h1>
          <p className="text-xl md:text-2xl font-paragraph text-gray-600 mb-8 max-w-3xl mx-auto">
            This is your starting point. Build something amazing!
          </p>
          
          {isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-lg font-paragraph text-gray-700">
                You're signed in and ready to go. What would you like to build?
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg font-paragraph text-gray-700">
                Sign in to get started with personalized features.
              </p>
              <Button onClick={actions.login} size="lg">
                Get Started
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}