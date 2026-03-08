import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SessionInfo {
    timezone: string;
    loginTime: bigint;
    token: string;
    ipHint: string;
    deviceInfo: string;
}
export type Time = bigint;
export interface NewsletterSubscription {
    subscribedAt: Time;
    email: string;
}
export interface CustomerUser {
    id: bigint;
    country: string;
    city: string;
    createdAt: Time;
    fullName: string;
    email: string;
    state: string;
    addressLine: string;
    passwordHash: string;
    phone: string;
    pincode: string;
}
export interface ConsultationRequest {
    id: bigint;
    status: Status;
    sunlightExposure: SunlightExposure;
    stylePreference: StylePreference;
    balconySize: BalconySize;
    name: string;
    email: string;
    message: string;
    timestamp: Time;
    priority: Priority;
    phone?: string;
}
export interface UserProfile {
    name: string;
}
export enum BalconySize {
    large = "large",
    small = "small",
    medium = "medium"
}
export enum Priority {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum Status {
    new_ = "new",
    completed = "completed",
    inProgress = "inProgress"
}
export enum StylePreference {
    tropical = "tropical",
    minimalist = "minimalist",
    natural = "natural",
    modern = "modern"
}
export enum SunlightExposure {
    partialShade = "partialShade",
    fullSun = "fullSun",
    fullShade = "fullShade"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    blockSession(token: string): Promise<boolean>;
    changeCustomerPassword(token: string, oldPassword: string, newPassword: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteConsultationRequest(id: bigint): Promise<boolean>;
    getAllAdminSessions(): Promise<Array<SessionInfo>>;
    getAllConsultationRequests(): Promise<Array<ConsultationRequest>>;
    getBlockedSessions(): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConsultationRequestCount(): Promise<bigint>;
    getCustomerProfile(token: string): Promise<CustomerUser | null>;
    getNewsletterSubscribers(): Promise<Array<NewsletterSubscription>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isSessionBlocked(token: string): Promise<boolean>;
    loginCustomer(email: string, password: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    logoutCustomer(token: string): Promise<boolean>;
    registerAdminSession(token: string, deviceInfo: string, timezone: string, ipHint: string): Promise<boolean>;
    removeAdminSession(token: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    signupCustomer(fullName: string, email: string, password: string, phone: string, addressLine: string, city: string, state: string, country: string, pincode: string): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    submitConsultationRequest(name: string, email: string, phone: string | null, balconySize: BalconySize, sunlightExposure: SunlightExposure, stylePreference: StylePreference, message: string): Promise<boolean>;
    subscribeNewsletter(email: string): Promise<boolean>;
    unblockSession(token: string): Promise<boolean>;
    unsubscribeNewsletter(email: string): Promise<boolean>;
    updateCustomerProfile(token: string, fullName: string, phone: string, addressLine: string, city: string, state: string, country: string, pincode: string): Promise<boolean>;
    updateRequestPriority(id: bigint, priority: Priority): Promise<boolean>;
    updateRequestStatus(id: bigint, status: Status): Promise<boolean>;
}
