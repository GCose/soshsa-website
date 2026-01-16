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
