import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server"
import {redirect} from "next/navigation"
import prisma from "../../lib/db"
import Navbar from "../../components/Navbar"
import Profile from "./components/Profile"
import Onboarding from "@/app/dashboard/components/Onboarding"
import {cookies} from "next/headers"
import Dashboard from "./components/Dashboard"
import {unstable_noStore as noStore} from "next/cache"
import Map from "@/components/Map"
import {fetchInstagramPosts, fetchInstagramUser, createUser} from "@/app/dashboard/actions"
import {FaStar} from "react-icons/fa"
import {IoMdStar} from "react-icons/io"
import {BsStars} from "react-icons/bs"
import {SiFsecure} from "react-icons/si"
import {FaMapMarkedAlt} from "react-icons/fa"

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
                    username: username,
                    instagramId: id,
                    onboardingCompleted: true
                }
            })
        }
    }

    console.log(posts)

    return (
        <>
            {data?.onboardingCompleted ? (
                <div className='h-screen w-screen flex flex-col md:flex-row '>
                    <div className='w-full h-full md:w-1/2 container flex flex-col'>
                        <Navbar />
                        <div className='flex flex-col items-center justify-center w-full'>
                            <Profile />
                        </div>

                        <div className='hidden w-full md:h-1/2  md:flex flex-col items-center justify-center'>
                            {data?.onboardingCompleted ? (
                                <Map />
                            ) : (
                                <div className='w-full h-full bg-black flex items-center justify-center'>
                                    <h1 className='text-white font-mono text-large'>
                                        There will be cool placeholder!
                                    </h1>
                                </div>
                            )}
                        </div>

                        <div className='hidden w-full md:h-1/2  md:flex flex-col items-center justify-center'>
                            {data?.onboardingCompleted ? (
                                <>
                                    <div className='flex flex-col items-center justify-center w-full h-full'>
                                        {posts && posts.data ? (
                                            <Dashboard posts={posts} user={user} />
                                        ) : null}
                                    </div>
                                </>
                            ) : (
                                <Onboarding username={data?.url || ""} />
                            )}
                        </div>
                    </div>

                    <div className='ml-2 w-full md:w-1/2'>
                        {data?.onboardingCompleted ? (
                            <div className='w-full pb-4-8'>
                                <Map />
                            </div>
                        ) : (
                            <div className='w-full md:w-1/2 h-1/2 md:h-full bg-black'>
                                <div className='p-4 text-sm md:text-base overflow-hidden text-white flex flex-col gap-8 justify-center items-center md:h-full md:pt-0'>
                                    <div className='flex gap-4 items-center bg-gradient-to-r from-green-400 via-pink-400  to-blue-200 bg-clip-text text-transparent'>
                                        <SiFsecure className='text-yellow-300 text-3xl' />
                                        <div>
                                            <h1 className='text-2xl'>
                                                Join millions of businesses
                                            </h1>
                                            <p className='text-white'>
                                                Integrate with developer-friendly APIs or choose
                                                low-code.
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex gap-4 items-center bg-gradient-to-r from-green-400 via-pink-400  to-blue-200 bg-clip-text text-transparent'>
                                        <BsStars className='text-yellow-300 text-3xl' />
                                        <div>
                                            <h1 className='text-2xl'>
                                                Join millions of businesses
                                            </h1>
                                            <p className='text-white'>
                                                Integrate with developer-friendly APIs or choose
                                                low-code.
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex gap-4 items-center bg-gradient-to-r from-green-400 via-pink-400  to-blue-200 bg-clip-text text-transparent'>
                                        <FaMapMarkedAlt className='text-yellow-300 text-3xl' />
                                        <div>
                                            <h1 className='text-2xl'>
                                                Join millions of businesses
                                            </h1>
                                            <p className='text-white'>
                                                Integrate with developer-friendly APIs or choose
                                                low-code.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className='h-screen w-screen flex flex-col md:flex-row justify-between'>
                    <div className='container h-1/2 md:h-[90vh] w-full md:w-1/2  flex flex-col items-stretch '>
                        <Navbar />
                        <div className='flex-grow flex items-center justify-center'>
                            <Onboarding username={data?.username || ""} />
                        </div>
                    </div>
                    <div className='w-full md:w-1/2 h-1/2 md:h-full bg-black'>
                        <div className='p-4 text-sm md:text-base overflow-hidden text-white flex flex-col gap-8 justify-center items-center md:h-full md:pt-0'>
                            <div className='flex gap-4 items-center bg-gradient-to-r from-green-400 via-pink-400  to-blue-200 bg-clip-text text-transparent'>
                                <SiFsecure className='text-yellow-300 text-3xl' />
                                <div>
                                    <h1 className='text-2xl'>Join millions of businesses</h1>
                                    <p className='text-white'>
                                        Integrate with developer-friendly APIs or choose low-code.
                                    </p>
                                </div>
                            </div>
                            <div className='flex gap-4 items-center bg-gradient-to-r from-green-400 via-pink-400  to-blue-200 bg-clip-text text-transparent'>
                                <BsStars className='text-yellow-300 text-3xl' />
                                <div>
                                    <h1 className='text-2xl'>Join millions of businesses</h1>
                                    <p className='text-white'>
                                        Integrate with developer-friendly APIs or choose low-code.
                                    </p>
                                </div>
                            </div>
                            <div className='flex gap-4 items-center bg-gradient-to-r from-green-400 via-pink-400  to-blue-200 bg-clip-text text-transparent'>
                                <FaMapMarkedAlt className='text-yellow-300 text-3xl' />
                                <div>
                                    <h1 className='text-2xl'>Join millions of businesses</h1>
                                    <p className='text-white'>
                                        Integrate with developer-friendly APIs or choose low-code.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
