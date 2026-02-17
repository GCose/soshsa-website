import { serialize } from 'cookie';
import { BASE_URL } from '@/utils/url';
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '@/utils/error';
import { NextApiRequest, NextApiResponse } from 'next';
import { CustomError, ErrorResponseData } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { email, password } = req.body;

    try {
        const { data } = await axios.post(`${BASE_URL}/admin/auth/login`, { email, password });

        const cookieData = {
            token: data.data.token,
            userId: data.data.user.id,
            email: data.data.user.email,
            firstName: data.data.user.firstName,
            lastName: data.data.user.lastName,
        };

        const tokenCookie = serialize('soshsa_admin', JSON.stringify(cookieData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30,
            sameSite: 'strict',
            path: '/',
        });

        res.setHeader('Set-Cookie', [tokenCookie]);
        res.json({ success: true });
    } catch (error: unknown) {
        const { message, statusCode } = getErrorMessage(
            error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        res.status(statusCode).json({ message });
    }
}