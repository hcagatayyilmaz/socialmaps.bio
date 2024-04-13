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
                url: formData.get("username") as string
            }
        })
        revalidatePath("/dashboard")
    }

    return (
        <div className=' bg-gray-100 rounded-lg shadow-lg '>
            {username === "" ? (
                <form action={claimUsername} className='flex flex-col gap-4'>
                    <input
                        type='text'
                        name='username'
                        placeholder='Enter username'
                        className='px-4 py-2 rounded-md border-2 border-gray-300 focus:outline-none focus:border-indigo-500 transition-colors'
                    />
                    <button
                        type='submit'
                        className='py-2 px-4 bg-gradient-to-r from-green-500 via-blue-900  to-pink-500 text-white rounded-md shadow-md hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-colors'
                    >
                        Claim
                    </button>
                </form>
            ) : (
                <form action={connectInstagramAccount}>
                    <button
                        type='submit'
                        className='py-2 px-4 bg-gradient-to-r from-green-500 via-blue-900  to-pink-500 text-white rounded-md shadow-md hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-colors'
                    >
                        Connect
                    </button>
                </form>
            )}
        </div>
    )
}

export default Onboarding
