import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface EventInput {
    title: string;
    date: bigint;
    description: string;
    location: string;
}
export interface Event {
    id: bigint;
    organizer: Principal;
    title: string;
    date: bigint;
    description: string;
    location: string;
}
export interface AnnouncementInput {
    title: string;
    body: string;
    category: string;
}
export interface Announcement {
    id: bigint;
    title: string;
    body: string;
    author: Principal;
    timestamp: bigint;
    category: string;
}
export interface UserProfile {
    bio: string;
    name: string;
    role: UserRole;
    department: string;
}
export enum UserRole {
    staff = "staff",
    faculty = "faculty",
    student = "student"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    assignUserRole(user: Principal, role: UserRole__1): Promise<void>;
    createAnnouncement(input: AnnouncementInput): Promise<bigint>;
    createEvent(input: EventInput): Promise<bigint>;
    deleteAnnouncement(id: bigint): Promise<void>;
    deleteEvent(id: bigint): Promise<void>;
    getAnnouncement(id: bigint): Promise<Announcement | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getEvent(id: bigint): Promise<Event | null>;
    getMyRole(): Promise<UserRole__1>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAnnouncements(): Promise<Array<Announcement>>;
    listEvents(): Promise<Array<Event>>;
    listProfiles(): Promise<Array<[Principal, UserProfile]>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
