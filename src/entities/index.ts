/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: clientmetrics
 * Interface for ClientMetrics
 */
export interface ClientMetrics {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  clientName?: string;
  /** @wixFieldType text */
  clientEmail?: string;
  /** @wixFieldType image */
  clientProfilePicture?: string;
  /** @wixFieldType number */
  reliabilityRating?: number;
  /** @wixFieldType number */
  fairnessRating?: number;
  /** @wixFieldType number */
  paymentPunctualityRating?: number;
  /** @wixFieldType number */
  disputeCount?: number;
  /** @wixFieldType datetime */
  registrationDate?: Date | string;
}


/**
 * Collection ID: freelancers
 * Interface for Freelancers
 */
export interface Freelancers {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  fullName?: string;
  /** @wixFieldType image */
  profilePicture?: string;
  /** @wixFieldType text */
  headline?: string;
  /** @wixFieldType text */
  skills?: string;
  /** @wixFieldType url */
  portfolioUrl?: string;
  /** @wixFieldType number */
  credibilityScore?: number;
  /** @wixFieldType text */
  credentialBadges?: string;
  /** @wixFieldType number */
  hourlyRate?: number;
  /** @wixFieldType text */
  bio?: string;
}


/**
 * Collection ID: jobpostings
 * Interface for JobPostings
 */
export interface JobPostings {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  jobTitle?: string;
  /** @wixFieldType text */
  jobDescription?: string;
  /** @wixFieldType number */
  budgetAmount?: number;
  /** @wixFieldType text */
  paymentModel?: string;
  /** @wixFieldType text */
  requiredSkills?: string;
  /** @wixFieldType date */
  projectDeadline?: Date | string;
  /** @wixFieldType boolean */
  isRemote?: boolean;
  /** @wixFieldType text */
  aiStructuredRequirements?: string;
}


/**
 * Collection ID: projectmilestones
 * Interface for ProjectMilestones
 */
export interface ProjectMilestones {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  milestoneName?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType date */
  dueDate?: Date | string;
  /** @wixFieldType number */
  amount?: number;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType text */
  paymentStatus?: string;
  /** @wixFieldType datetime */
  completionDate?: Date | string;
}


/**
 * Collection ID: proposals
 * Interface for Proposals
 */
export interface Proposals {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  proposalTitle?: string;
  /** @wixFieldType text */
  proposalDetails?: string;
  /** @wixFieldType text */
  pricingModel?: string;
  /** @wixFieldType number */
  proposedAmount?: number;
  /** @wixFieldType datetime */
  submissionDate?: Date | string;
  /** @wixFieldType text */
  proposalStatus?: string;
}


/**
 * Collection ID: reputationledger
 * Interface for ReputationLedger
 */
export interface ReputationLedger {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  reviewContent?: string;
  /** @wixFieldType number */
  ratingScore?: number;
  /** @wixFieldType text */
  achievementTitle?: string;
  /** @wixFieldType text */
  achievementDescription?: string;
  /** @wixFieldType boolean */
  isVerifiedAchievement?: boolean;
  /** @wixFieldType date */
  achievementDate?: Date | string;
  /** @wixFieldType text */
  jobTitle?: string;
  /** @wixFieldType text */
  clientName?: string;
  /** @wixFieldType date */
  reviewDate?: Date | string;
  /** @wixFieldType url */
  exportLink?: string;
}
