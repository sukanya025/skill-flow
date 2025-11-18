// Mock Wix Members API for development
import { Member } from "../index";

// Mock members API
const members = {
  getCurrentMember: async (options?: { fieldsets?: string[] }): Promise<{ member: Member | null }> => {
    console.warn('Mock: Getting current member with options:', options);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock member data
    const mockMember: Member = {
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
    };
    
    return { member: mockMember };
  }
};

export const getCurrentMember = async (): Promise<Member | null> => {
  try {
    const member = await members.getCurrentMember({ fieldsets: ["FULL"] });
    if (!member) {
      console.log('==== No member found');
    }
    return member.member;
  } catch (error) {
    console.log(error);
    return null;
  }
};