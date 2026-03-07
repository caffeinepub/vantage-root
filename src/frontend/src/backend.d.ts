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
    sunlightExposure: SunlightExposure;
    stylePreference: StylePreference;
    balconySize: BalconySize;
    name: string;
    email: string;
    message: string;
    timestamp: Time;
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
    getAllConsultationRequests(): Promise<Array<ConsultationRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConsultationRequestCount(): Promise<bigint>;
    getConsultationRequestCountAdmin(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitConsultationRequest(name: string, email: string, phone: string | null, balconySize: BalconySize, sunlightExposure: SunlightExposure, stylePreference: StylePreference, message: string): Promise<boolean>;
}
