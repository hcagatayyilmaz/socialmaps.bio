import {redirect} from "next/navigation"
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server"
import prisma from "../../../lib/db"
import {revalidatePath} from "next/cache"

async function Onboarding({username}: {username: string}) {
    const {getUser} = await getKindeServerSession()
    const user = await getUser()

    const connectInstagramAccount = async () => {
        "use server"
        const instagramClientID = "378544838190288"
        const redirectUri = "https://popular-rapidly-joey.ngrok-free.app/dashboard/callback"
        const scope = "user_profile,user_media"
        const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${instagramClientID}&redirect_uri=${encodeURIComponent(
            redirectUri
        )}&scope=${encodeURIComponent(scope)}&response_type=code`
        redirect(instagramAuthUrl)
    }

    async function claimUsername(formData: FormData) {
        "use server"
        await prisma.user.update({
            where: {
                id: user?.id
            },
            data: {
                username: formData.get("username") as string
            }
        })
        revalidatePath("/dashboard")
    }

    return (
        <div className=' border border-black  rounded-lg shadow-lg w-full md:w-1/2 mx-auto my-auto p-4'>
            {username === "" ? (
                <div>
                    <p className='mb-6 text-center text-3xl'>
                        <p>Claim your</p>
                        <span className='bg-gradient-to-r from-green-500 via-blue-900  to-pink-500 bg-clip-text text-transparent'>
                            SocialMaps!
                        </span>
                    </p>
                    <form action={claimUsername} className='flex flex-col gap-6'>
                        <input
                            type='text'
                            name='username'
                            placeholder='Enter username'
                            className='px-4 py-2 rounded-md border-2 border-gray-300 focus:outline-none focus:border-indigo-500 transition-colors'
                        />
                        <button
                            type='submit'
                            className='py-2 px-4 bg-gradient-to-r from-green-400 via-blue-800  to-pink-400 text-white rounded-md shadow-md hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-colors'
                        >
                            Claim
                        </button>
                    </form>
                </div>
            ) : (
                <div>
                    <h1>Securely connect your Instagram Account</h1>
                    <form action={connectInstagramAccount}>
                        <button
                            type='submit'
                            className='py-4 px-8 bg-gradient-to-r from-green-500 via-blue-900  to-pink-500 text-white rounded-md shadow-md hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-colors w-full'
                        >
                            Connect
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Onboarding
