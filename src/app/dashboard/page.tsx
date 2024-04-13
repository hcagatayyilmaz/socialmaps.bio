import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server"
import {redirect} from "next/navigation"
import prisma from "../../lib/db"
import Navbar from "../../components/Navbar"
import Onboarding from "@/app/dashboard/components/Onboarding"
import {cookies} from "next/headers"
import Dashboard from "./components/Dashboard"
import {unstable_noStore as noStore} from "next/cache"
import Map from "@/components/Map"
import {fetchInstagramPosts, fetchInstagramUser, createUser} from "@/app/dashboard/actions"
import axios from "axios"

async function getData(userId: string) {
    noStore()
    const data = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    return data
}

export default async function page() {
    const {getUser, isAuthenticated} = getKindeServerSession()
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

    if (instagram_access_token && data?.instagramUsername !== null && data?.instagramId !== null) {
        const {id, username} = await fetchInstagramUser(instagram_access_token)

        posts = await fetchInstagramPosts(id, instagram_access_token)

        if (!data?.onboardingCompleted) {
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    instagramUsername: username,
                    instagramId: id,
                    onboardingCompleted: true
                }
            })
        }
    }

    console.log(posts)

    return (
        <div className='h-screen'>
            <div className='h-screen flex flex-col-reverse md:flex-row '>
                <div className='w-1/2 flex flex-col container'>
                    <Navbar />

                    <div>
                        <h2>{data?.instagramUsername}</h2>
                    </div>

                    <div className='w-full h-full '>
                        <div className='w-full mx-auto'>{data?.instagramUsername}</div>
                        {posts && posts.data ? (
                            <Dashboard posts={posts} user={user} />
                        ) : (
                            <Onboarding username={data?.url || ""} />
                        )}
                    </div>
                </div>

                <div className='ml-2 w-1/2 h-full'>
                    {data?.onboardingCompleted ? (
                        <Map />
                    ) : (
                        <div className='w-full h-full bg-black'>
                            <h1 className='text-white font-mono text-large'>
                                There will be cool placeholder{" "}
                            </h1>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
