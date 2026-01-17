import { NextResponse } from 'next/server'

export function middleware(request) {
    const token = request.cookies.get('auth-token')?.value

    // If trying to access dashboard without auth, redirect to login
    if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/dashboard/:path*'
}