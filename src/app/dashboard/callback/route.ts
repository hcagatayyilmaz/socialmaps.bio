import {NextResponse} from "next/server"
import axios from "axios"
import {cookies} from "next/headers"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const {searchParams} = requestUrl
  const code = searchParams.get("code")
  console.log(code)

  if (!code) {
    return NextResponse.redirect("/auth/auth-code-error")
  }

  const clientSecret = "6fc4741df4a1106c29f8bf9b0a1548a8"
  const clientId = "378544838190288"
  const redirectUri =
    "https://popular-rapidly-joey.ngrok-free.app/dashboard/callback"

  try {
    const tokenResponse = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code
      })
    )

    const accessToken = tokenResponse.data.access_token

    // Set accessToken in cookie http-only and secure
    const response = NextResponse.redirect(
      "https://popular-rapidly-joey.ngrok-free.app/dashboard"
    )
    // Set accessToken in a cookie using the 'cookies()' utility
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 90 * 24 * 60 * 60 // 90 days
    }

    cookies().set("instagram-access-token", accessToken, cookieOptions)
    return response
  } catch (error) {
    console.error("Error in Instagram OAuth flow:", error)
    return NextResponse.redirect("/auth/auth-code-error")
  }
}
