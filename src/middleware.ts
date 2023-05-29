import { clerkClient, getAuth, withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { api } from "./utils/api";
import TE_Routes from "TE_Routes";

const publicPaths = ['/', '/sign-in*', '/sign-up*', 
'/api/trpc*', 
'/api/PostComment*',
'/api/User*',
TE_Routes.Index.path + '*',
TE_Routes.ProfessorVideos.path + '*',
TE_Routes.RedPillAcademy.path + '*',
TE_Routes.FAQ.path + '*',
TE_Routes.postbyid.path + '*',
TE_Routes.NewAccountSetup.path + '*',
TE_Routes.Register.path + '*',
TE_Routes.PrepareNewUser.path + '*',
'.*\\.(png|jpg|jpeg|gif|svg|ico)'];

const isPublic = (path: string) => {
  return publicPaths.find(x => {
    const result = path.match(new RegExp(`^${x}`.replace('*$', '($|/).*')))
    return result;
  }
  )
}
 
export default withClerkMiddleware((request: NextRequest) => {
  const result = isPublic(request.nextUrl.pathname)
  if (result) {
    return NextResponse.next()
  }
  // if the user is not signed in redirect them to the sign in page.
  const { userId } = getAuth(request)

  if (!userId) {
    // redirect the users to /pages/sign-in/[[...index]].ts
    const signInUrl = new URL(process.env.NEXT_PUBLIC_BASE_URL!)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
});
 
export const config = { matcher:'/((?!_next/image|_next/static|favicon.ico).*)'};

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