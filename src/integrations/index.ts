// Mock integrations for development
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Mock Member type
export interface Member {
  _id?: string;
  loginEmail?: string;
  profile?: {
    nickname?: string;
    slug?: string;
  };
  contactDetails?: {
    firstName?: string;
    lastName?: string;
  };
}

// Mock Member Context
const MemberContext = createContext<{
  member: Member | null;
  loading: boolean;
}>({
  member: null,
  loading: true,
});

// Mock Member Provider
export function MemberProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock loading delay
    const timer = setTimeout(() => {
      setMember({
        _id: 'mock-member-id',
        loginEmail: 'user@example.com',
        profile: {
          nickname: 'Mock User',
          slug: 'mock-user'
        },
        contactDetails: {
          firstName: 'Mock',
          lastName: 'User'
        }
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <MemberContext.Provider value={{ member, loading }}>
      {children}
    </MemberContext.Provider>
  );
}

// Mock useMember hook
export function useMember() {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMember must be used within a MemberProvider');
  }
  return context;
}

// Mock CMS types
export interface WixDataItem {
  _id?: string;
  [key: string]: any;
}

export interface WixDataResult<T> {
  items: T[];
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}