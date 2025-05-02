import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token

        // if user is logged in and tries to access the login page, register page, redirect to home page
        if (token && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                if (pathname === '/login' || pathname === '/register') {
                    return true;
                }

                return !!token;
            }
        }
    }
);

export const config = {
    matcher: [
        '/login',
        '/register', 
        '/dashboard/:path*',
        '/editor/:path*'
    ]
}