import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { token, userId, email, firstName, lastName } = req.body;

    if (!token || !userId || !email || !firstName || !lastName) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const cookieData = {
        token,
        userId,
        email,
        firstName,
        lastName,
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
}