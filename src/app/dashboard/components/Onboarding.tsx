import axios from "axios"
import {redirect} from "next/navigation"

function Onboarding() {
  // Connect Instagram Account Function
  const connectInstagramAccount = async () => {
    "use server"
    const instagramClientID = "378544838190288"
    const redirectUri =
      "https://popular-rapidly-joey.ngrok-free.app/dashboard/callback"
    const scope = "user_profile,user_media"
    const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${instagramClientID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}&response_type=code`
    redirect(instagramAuthUrl)
  }

  return (
    <div>
      <form action={connectInstagramAccount}>
        <button type='submit'>Connect</button>
      </form>
    </div>
  )
}

export default Onboarding
