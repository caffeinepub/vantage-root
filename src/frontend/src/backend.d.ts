import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
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
    deleteConsultationRequest(id: bigint): Promise<boolean>;
    getAllConsultationRequests(): Promise<Array<ConsultationRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConsultationRequestCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitConsultationRequest(name: string, email: string, phone: string | null, balconySize: BalconySize, sunlightExposure: SunlightExposure, stylePreference: StylePreference, message: string): Promise<boolean>;
    updateRequestPriority(id: bigint, priority: Priority): Promise<boolean>;
    updateRequestStatus(id: bigint, status: Status): Promise<boolean>;
}
