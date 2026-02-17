import { AdminAuth } from '@/types';
import { parse } from 'cookie';
import { NextApiRequest } from 'next';

export const isLoggedIn = (req: NextApiRequest): boolean | AdminAuth => {
    if (!req || !req.headers || !req.headers.cookie) {
        return false;
    }

    const cookies = parse(req.headers.cookie || '');

    if (cookies && cookies.soshsa_admin) return JSON.parse(cookies.soshsa_admin) as AdminAuth;

    return false;
};