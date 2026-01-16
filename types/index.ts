export type ContactSubmission = {
    id: string;
    name: string;
    email: string;
    subject: string;
    date: string;
    status: "Unread" | "Read" | "Resolved";
};

export type ColumnKey<T> = Extract<keyof T, string>;
