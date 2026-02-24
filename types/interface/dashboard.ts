import { AdminAuth, ColumnKey } from "..";
import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export interface SearchBarProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    onSearch?: (value: string) => void;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    children: ReactNode;
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
    size?: "sm" | "md" | "lg" | "xl" | "xxl";
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

export interface DashboardLayoutProps {
    children: ReactNode
    pageTitle: string
}

export interface DashboardPageProps {
    adminData: AdminAuth;
}

export interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
}

export interface DashboardStats {
    totalEvents: number;
    totalNews: number;
    totalMagazines: number;
    totalCourses: number;
}
export interface Council {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CouncilsResponse {
    data: Council[];
    meta: { total: number };
}

export interface Executive {
    id: string;
    fullName: string;
    position: string;
    biography?: string;
    profilePhoto?: string;
    isServing: boolean;
    council: {
        _id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface ExecutivesResponse {
    data: Executive[];
    meta: { total: number };
}

export interface Event {
    id: string;
    date: string;
    type: string;
    title: string;
    image: string;
    location: string;
    imageUrl: string;
    createdAt: string;
    description: string;
    isFeatured: boolean;
    isPublished: boolean;
}

export interface EventsResponse {
    data: Event[];
    meta: { total: number };
}

export interface NewsArticle {
    id: string;
    title: string;
    excerpt: string;
    content?: string;
    author: string;
    imageUrl: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface NewsResponse {
    data: NewsArticle[];
    meta: { total: number };
}

export interface Magazine {
    id: string;
    title: string;
    year: string;
    coverImageUrl: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface MagazinesResponse {
    data: Magazine[];
    meta: { total: number };
}

export interface MagazineArticle {
    id: string;
    title: string;
    author: string;
    content?: string;
    imageUrl?: string;
    magazine: {
        _id: string;
        title: string;
        year: string;
    };
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ArticlesResponse {
    data: MagazineArticle[];
    meta: { total: number };
}

export interface MagazineComment {
    id: string;
    fullName: string;
    email: string;
    comment: string;
    articleId: string;
    articleTitle: string;
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CommentsResponse {
    data: MagazineComment[];
    meta: {
        total: number;
    };
}

export interface Course {
    id: string;
    code: string;
    title: string;
    department: string;
    year: number;
    creditHours: number;
    brochureUrl?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CoursesResponse {
    data: Course[];
    meta: { total: number };
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

export interface SheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "full";
}

export interface Article {
    id: string;
    title: string;
    author: string;
    content: string;
    image: string;
    isPublished: boolean;
    createdAt: string;
}

export interface PortalGuideSection {
    id: string;
    heading: string;
    body: string;
    image: string | null;
    order: number;
}

export interface PortalGuide {
    id: string;
    title: string;
    sections: PortalGuideSection[];
    isPublished: boolean;
    updatedAt: string;
}

export interface AssociationIntro {
    id: string;
    videoUrl: string;
    title: string;
    description: string;
    imageUrls: string[];
    isPublished: boolean;
    createdAt: string;
}

export interface IntrosResponse {
    data: AssociationIntro[];
    meta: {
        total: number;
    };
}

export interface CitationFile {
    id: string;
    title: string;
    description: string;
    file: string;
    fileUrl: string;
    format: "PDF" | "DOCX" | "MP4";
    size: number;
    category: "APA" | "MLA" | "Chicago" | "Tutorial" | "Other";
    downloads: number;
    createdAt: string;
}
export interface InboxMessage {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: "unread" | "read" | "resolved";
    createdAt: string;
    updatedAt: string;
}

export interface InboxResponse {
    data: InboxMessage[];
    meta: { total: number };
}
export interface AdminProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}