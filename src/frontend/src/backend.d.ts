import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type EmailStatus = {
    __kind__: "failed";
    failed: string;
} | {
    __kind__: "sentSuccessfully";
    sentSuccessfully: null;
};
export type Time = bigint;
export interface EmailRecord {
    cc: Array<string>;
    id: bigint;
    to: Array<string>;
    bcc: Array<string>;
    status: EmailStatus;
    subject: string;
    body: string;
    timestamp: Time;
}
export interface backendInterface {
    getEmail(id: bigint): Promise<EmailRecord>;
    getEmailHistory(): Promise<Array<EmailRecord>>;
    sendAndRecordEmail(to: Array<string>, cc: Array<string>, bcc: Array<string>, subject: string, body: string): Promise<bigint>;
}
