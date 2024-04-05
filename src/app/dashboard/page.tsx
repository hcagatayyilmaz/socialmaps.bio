import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server"
import {redirect} from "next/navigation"
import prisma from "../../lib/db"
import Navbar from "../../components/Navbar"
import Onboarding from "@/app/dashboard/components/Onboarding"
import {cookies} from "next/headers"
import {RequestCookie} from "next/dist/compiled/@edge-runtime/cookies"

async function createUser({
  email,
  id,
  name,
  image
}: {
  email: string
  id: string
  name: string
  image: string
}) {
  const user = await prisma.user.findUnique({
    where: {
      id: id
    },
    select: {
      id: true,
      stripeCustomerId: true
    }
  })
  if (!user) {
    await prisma.user.create({
      data: {
        id,
        email,
        name,
        image
      }
    })
  }
}

async function fetchInstagramUserId(instagram_access_token: RequestCookie) {
  console.log(instagram_access_token?.value)
  const res = await fetch(
    `https://graph.instagram.com/v19.0/me?fields=id&access_token=${instagram_access_token.value}`
  )
  if (!res.ok) {
    throw new Error("Failed to fetch Instagram user ID")
  }
  return res.json()
}

async function fetchInstagramPosts(
  userId: string,
  instagram_access_token: RequestCookie
) {
  console.log("POMPA", userId)
  const res = await fetch(
    `https://graph.instagram.com/${userId.id}/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${instagram_access_token.value}`
  )
  if (!res.ok) {
    throw new Error("Failed to fetch Instagram posts")
  }

  return res.json() // The posts are contained within the `data` field
}

export default async function Page() {
  const {getUser} = await getKindeServerSession()
  const user = await getUser()
  const cookieStore = cookies()
  const instagram_access_token = cookieStore.get("instagram-access-token")

  if (!user) {
    return redirect("/")
  }

  await createUser({
    email: user.email as string,
    name: user.given_name as string,
    id: user.id as string,
    image: user.picture as string
  })

  let posts = null

  if (instagram_access_token) {
    const userId = await fetchInstagramUserId(instagram_access_token)
    posts = await fetchInstagramPosts(userId, instagram_access_token)
  }

  return (
    <div className='container mx-auto px-4'>
      <Navbar />
      <h1 className='text-3xl font-bold mt-10 mb-8'>Dashboard</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {posts && posts.data ? (
          posts.data.map((post: any) => (
            <div key={post.id} className='relative'>
              <video src={post.media_url} className='w-full h-auto' controls />
              <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <svg
                  className='w-12 h-12 text-white opacity-75'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </div>
            </div>
          ))
        ) : (
          <Onboarding />
        )}
      </div>
    </div>
  )
}
