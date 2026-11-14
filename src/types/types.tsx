export type Role = 'SUPER_ADMIN' | 'INSTITUTION_ADMIN' | 'STUDENT';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type InterestLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'מנהל ראשי',
  INSTITUTION_ADMIN: 'מנהל מוסד',
  STUDENT: 'תלמיד',
};
export interface JobRoleOption {
  id: number;
  name: string;
}
export const INTEREST_LEVEL_LABELS: Record<InterestLevel, string> = {
    LOW: 'נמוכה',
    MEDIUM: 'בינונית',
    HIGH: 'גבוהה',
};
export type ActionStatus = 'OPEN' | 'DONE';

export const ACTION_STATUS_LABELS: Record<ActionStatus, string> = {
    OPEN: 'לביצוע',
    DONE: 'בוצעה',
};
export interface User {
    id: number;
    fullName: string;
    email: string;
    role: Role,
    approvalStatus: ApprovalStatus
    isActive: boolean;
    institution: { id: number; name: string } | null;
    desiredJobRoles: { id: number; name: string; isActive: boolean }[];
    approvedAt: string | null;
    createdAt: string;
}
export interface LoginPayload {
    email: string,
    password: string
}
export interface LoginResponse {
    token: string,
    user: User
}
export interface JobRole {
  id: number;
  institutionId: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicInstitution {
    id: number,
    name: string,
    city: string | null
}


export interface Institution {
    id: number;
    name: string;
    city: string | null;
    contactEmail: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface InstitutionWithCounts extends Institution {
    adminsCount: number;
    studentsCount: number;
}
export interface InstitutionInput {
    name: string;
    city?: string | null;
    contactEmail?: string | null;
}
export interface NewUserPayload {
    fullName: string,
    email: string,
    password: string,
    institutionId: number,
    jobRoleIds: number[]
}

export interface CreateUser {
    message: string,
    user: User
}
export interface ApiErrorBody {
    error: {
        code: string;
        message: string;
        details?: { field: string; message: string }[];
    }
}
export interface Page<T> {
    items: T[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}
export interface UserFilters {
    search?: string;
    role?: Role;
    institutionId?: number;
    isActive?: boolean;
    approvalStatus?: ApprovalStatus;
    jobRoleId?: number;
    page?: number;
    pageSize?: number;
}
export interface UpdateUserPayload {
    fullName?: string;
    isActive?: boolean;
}
export interface CreateUserPayload {
    fullName: string;
    email: string;
    password: string;
    institutionId: number;
    role?: 'INSTITUTION_ADMIN' | 'STUDENT';
}
export interface CatalogFilters {
    includeInactive?: boolean;
    institutionId?: number;
}
export interface CreateStatusPayload {
    name: string;
    isFinal?: boolean;
    suggestedAction?: string | null;
    suggestedDays?: number | null;
    sortOrder?: number;
    institutionId?: number;
}
export interface UpdateStatusPayload {
    name?: string;
    isFinal?: boolean;
    suggestedAction?: string | null;
    suggestedDays?: number | null;
    sortOrder?: number;
    isActive?: boolean;
}

export interface Status {
    id: number;
    name: string;
    isBase: boolean;
    institutionId: number | null;
    isFinal: boolean;
    suggestedAction: string | null;
    suggestedDays: number | null;
    sortOrder: number;
    isActive: boolean;
}
export interface Action {
    id: number;
    applicationId: number;
    title: string;
    dueOn: string;
    status: ActionStatus;
    notes: string | null;
    completedAt: string | null;
    createdById: number;
    createdAt: string;
    updatedAt: string;
}
export interface Ref { id: number; name: string }
export interface UserRef { id: number; fullName: string }
export interface StatusRef { id: number; name: string; isFinal: boolean }
export interface ApplicationSummary {
    id: number;
    companyName: string;
    jobTitle: string;
    status: StatusRef;
    jobRole: Ref | null;
    interestLevel: InterestLevel | null;
    submittedOn: string;
    interviewAt: string | null;
    nextAction: { id: number; title: string; dueOn: string } | null;
    openActionsCount: number;
    user: UserRef;
    updatedAt: string;
}
export interface ApplicationFilters {
    search?: string;
    statusId?: number;
    interestLevel?: InterestLevel;
    jobRoleId?: number;
    isOpen?: boolean;
    userId?: number;
    institutionId?: number;
    sortBy?: 'submittedOn' | 'companyName' | 'updatedAt' | 'interestLevel';
    order?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
}
export interface ApplicationDetail {
    id: number;
    user: UserRef;
    createdBy: UserRef;
    companyName: string;
    jobTitle: string;
    jobRole: Ref | null;
    submittedOn: string;
    status: StatusRef;
    jobUrl: string | null;
    contactName: string | null;
    interestLevel: InterestLevel | null;
    jobAttractions: string | null;
    pointsToClarify: string | null;
    notes: string | null;
    interviewAt: string | null;
    interviewLocation: string | null;
    interviewPreparation: string | null;
    interviewQuestions: string | null;
    actions: Action[];
    createdAt: string;
    updatedAt: string;
}

export interface Suggestion {
    title: string;
    dueOn: string;
}
export interface CreateApplicationPayload {
    companyName: string;
    jobTitle: string;
    submittedOn: string;
    statusId: number;
    userId?: number;
    jobRoleId?: number | null;
    jobUrl?: string | null;
    contactName?: string | null;
    interestLevel?: InterestLevel | null;
    jobAttractions?: string | null;
    pointsToClarify?: string | null;
    notes?: string | null;
    interviewAt?: string | null;
    interviewLocation?: string | null;
    interviewPreparation?: string | null;
    interviewQuestions?: string | null;
}
export type UpdateApplicationPayload = Partial<Omit<CreateApplicationPayload, 'userId'>>;

export interface CreateApplicationResponse {
    application: ApplicationDetail;
    suggestedAction: Suggestion | null;
}

export interface UpdateApplicationResponse {
    application: ApplicationDetail;
    statusChanged: boolean;
    suggestedAction: Suggestion | null;
}
export interface CreateActionPayload {
    title: string;
    dueOn: string;
    notes?: string | null;
}


export interface UpdateActionPayload {
    title?: string;
    dueOn?: string;
    notes?: string | null;
    status?: ActionStatus;
}
export type NotificationType = 'APPLICATION_CREATED' | 'STATUS_CHANGED' | 'ACTION_ADDED';

export interface Notification {
    id: number;
    type: NotificationType;
    isRead: boolean;
    title: string;
    message: string;
    suggestedAction: string | null;
    suggestedDueOn: string | null;
    application: { id: number; companyName: string; jobTitle: string };
    actor: UserRef;
    createdAt: string;
}


export interface NotificationPage extends Page<Notification> {
    unreadCount: number;
}

export interface NotificationFilters {
    unreadOnly?: boolean;
    page?: number;
    pageSize?: number;
}
export interface ApplicationRef {
    id: number;
    companyName: string;
    jobTitle: string;
    user: UserRef;
}
export interface DashboardAction extends Action {
    application: ApplicationRef;
}
export interface Dashboard {
    today: string;
    overdue: DashboardAction[];
    dueToday: DashboardAction[];
    upcoming: DashboardAction[];
    upcomingInterviews: (ApplicationRef & {
        interviewAt: string;
        interviewLocation: string | null;
    })[];
    needsNextStep: (ApplicationRef & {
        status: StatusRef;
        updatedAt: string;
    })[];
    unreadNotifications: number;
}
