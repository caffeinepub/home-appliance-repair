import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Booking {
    id: bigint;
    status: BookingStatus;
    appliance: ApplianceType;
    issueDescription: string;
    customer: Principal;
    createdAt: Time;
    lastUpdated: Time;
    preferredDateTime: Time;
    contactPhone: string;
}
export type Time = bigint;
export enum ApplianceType {
    ac = "ac",
    ledTV = "ledTV",
    fridge = "fridge"
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    accepted = "accepted",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminCancelBooking(id: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelBooking(id: bigint): Promise<void>;
    createBooking(booking: {
        appliance: ApplianceType;
        issueDescription: string;
        preferredDateTime: Time;
        contactPhone: string;
    }): Promise<bigint>;
    getAllBookings(): Promise<Array<Booking>>;
    getBooking(id: bigint): Promise<Booking | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyBookings(): Promise<Array<Booking>>;
    isCallerAdmin(): Promise<boolean>;
    updateStatus(id: bigint, newStatus: BookingStatus): Promise<void>;
}
