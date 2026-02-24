export type ContactSubmission = {
    id: string;
    name: string;
    email: string;
    subject: string;
    date: string;
    status: "Unread" | "Read" | "Resolved";
};

export type ColumnKey<T> = Extract<keyof T, string>;

export type CustomError = Error & { statusCode?: number };

export type ErrorResponseData = {
    message?: string;
    error?: { message: string; code?: string };
    success?: boolean;
};

export type AdminAuth = {
    token: string;
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
};

export type FilterStatus = "all" | "published" | "draft";

export type TabType = "profile" | "security";

export type InboxFilterStatus = "all" | "unread" | "read" | "resolved";

export type FilterYear = "all" | 1 | 2 | 3 | 4 | 5;

export type CourseFilterStatus = "all" | "true" | "false";

export type CommentFilterStatus = "all" | "pending" | "approved";