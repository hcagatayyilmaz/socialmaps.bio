import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server"
import {redirect} from "next/navigation"
import prisma from "../../lib/db"
import Navbar from "../../components/Navbar"
import Onboarding from "@/app/dashboard/components/Onboarding"
import {cookies} from "next/headers"
import {RequestCookie} from "next/dist/compiled/@edge-runtime/cookies"
import Dashboard from "./components/Dashboard"
import {unstable_noStore as noStore} from "next/cache"

async function getData(userId: string) {
  noStore()
  const data = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })
  return data
}

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
    `https://graph.instagram.com/v19.0/me?fields=id,username&access_token=${instagram_access_token.value}`
  )
  if (!res.ok) {
    console.log("Problem 1")
  }
  const {id} = await res.json()
  return {id}
}

async function fetchInstagramPosts(
  id: any,
  instagram_access_token: RequestCookie
) {
  const res = await fetch(
    `https://graph.instagram.com/${id}/media?fields=id,caption,media_type,media_url,permalink,timestamp,thumbnail_url&access_token=${instagram_access_token.value}`
  )
  if (!res.ok) {
    console.log("Problem 2")
  }

  return res.json() // The posts are contained within the `data` field
}

export default async function age() {
  const {getUser} = await getKindeServerSession()
  const user = await getUser()
  const cookieStore = cookies()
  const instagram_access_token = cookieStore.get("instagram-access-token")
  const data = await getData(user?.id as string)

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
    const {id} = await fetchInstagramUserId(instagram_access_token)

    posts = await fetchInstagramPosts(id, instagram_access_token)

    if (!data?.onboardingCompleted) {
      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          instagramId: id, // Just pass the username string here
          onboardingCompleted: true
        }
      })
    }
  }

  return (
    <div className='container mx-auto px-4'>
      <Navbar />
      <h1 className='text-3xl font-bold mt-10 mb-8'>Dashboard</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {posts && posts.data ? (
          <Dashboard posts={posts} />
        ) : (
          <Onboarding username={data?.username || ""} />
        )}
      </div>
    </div>
  )
}
