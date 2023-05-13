import { clerkClient, getAuth, withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { api } from "./utils/api";

const publicPaths = ['/', '/sign-in*', '/sign-up*', '/api/trpc*', 
'/natural-healing*',
'/professor_videos*',
'/red-pill-academy*',
'/faq*',
'/post*',
'.*\\.(png|jpg|jpeg|gif|svg|ico)'];

const isPublic = (path: string) => {
  return publicPaths.find(x =>
    path.match(new RegExp(`^${x}$`.replace('*$', '($|/)')))
  )
}
 
export default withClerkMiddleware((request: NextRequest) => {
  if (isPublic(request.nextUrl.pathname)) {
    return NextResponse.next()
  }
  // if the user is not signed in redirect them to the sign in page.
  const { userId } = getAuth(request)

  if (!userId) {
    // redirect the users to /pages/sign-in/[[...index]].ts
    const signInUrl = new URL('/sign-in', process.env.NEXT_PUBLIC_BASE_URL)
    signInUrl.searchParams.set('redirect_url', process.env.NEXT_PUBLIC_BASE_URL!)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
});
 
export const config = { matcher:  '/((?!_next/image|_next/static|favicon.ico).*)'};

const PUBLIC_FILE = /\.(.*)$/


export function it8nMiddleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return
  }

  if (req.nextUrl.locale === 'default') {
    const locale = req.cookies.get('NEXT_LOCALE')?.value || 'ch-ZH'

    return NextResponse.redirect(
      new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    )
  }
}