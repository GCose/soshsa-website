import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
    const tokenCookie = serialize('soshsa_admin', JSON.stringify({}), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: -1,
    });

    res.setHeader('Set-Cookie', [tokenCookie]);
    res.redirect('/admin/auth/sign-in');
}