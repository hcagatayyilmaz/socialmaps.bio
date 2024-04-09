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

    const shortLivedAccessToken = tokenResponse.data.access_token

    // Exchange the short-lived token for a long-lived token
    const longLivedTokenResponse = await axios.get(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${shortLivedAccessToken}`
    )

    const longLivedAccessToken = longLivedTokenResponse.data.access_token

    // Set longLivedAccessToken in cookie http-only and secure
    const response = NextResponse.redirect(
      "https://popular-rapidly-joey.ngrok-free.app/dashboard"
    )
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 24 * 60 * 60 // 60 days, as per the long-lived token's validity
    }

    cookies().set("instagram-access-token", longLivedAccessToken, cookieOptions)
    return response
  } catch (error) {
    console.error("Error in Instagram OAuth flow:", error)
    return NextResponse.redirect("/auth/auth-code-error")
  }
}
