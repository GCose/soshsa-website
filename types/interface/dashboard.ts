import { InputHTMLAttributes, ReactNode } from "react";
import { ColumnKey } from "..";

export interface DashboardLayoutProps {
    children: ReactNode
    pageTitle: string
}

export interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export interface SearchBarProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    onSearch?: (value: string) => void;
}

export interface TableColumn<T> {
    key: ColumnKey<T>;
    label: string;
    render?: (
        value: T[ColumnKey<T>],
        row: T,
        index?: number
    ) => React.ReactNode;
}


export interface TableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    onRowClick?: (row: T) => void;
    emptyMessage?: string;
    loading?: boolean;
    pagination?: {
        page: number;
        totalPages: number;
        total?: number;
        onPageChange: (page: number) => void;
    };
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
}

export interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: "danger" | "warning" | "info";
}

export interface Executive {
    id: string;
    name: string;
    position: string;
    image: string;
    isActive: boolean;
    createdAt: string;
}

export interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    type: string;
    isPublished: boolean;
    isFeatured: boolean;
    createdAt: string;
}

export interface MagazineIssue {
    id: string;
    title: string;
    year: string;
    articlesCount: number;
    isPublished: boolean;
    publishedAt: string;
    createdAt: string;
}

export interface Comment {
    id: string;
    author: string;
    email: string;
    content: string;
    articleTitle: string;
    isApproved: boolean;
    createdAt: string;
}

export interface Course {
    id: string;
    code: string;
    title: string;
    department: string;
    year: number;
    creditHours: number;
    isActive: boolean;
    createdAt: string;
}

export interface Resource {
    id: string;
    title: string;
    description: string;
    url: string;
    category: string;
    order: number;
    createdAt: string;
}