import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server"
import prisma from "@/lib/db"
import {unstable_noStore as noStore} from "next/cache"
import {get} from "http"
import {Button} from "@/components/ui/button"
import {IoMdAddCircle} from "react-icons/io"
import Links from "./Links"

async function getData(userId: string) {
    noStore()
    const data = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    return data
}

export default async function Profile() {
    const {getUser} = getKindeServerSession()
    const user = await getUser()
    const data = await getData(user?.id as string)

    return (
        <div className='flex flex-col items-center justify-center'>
            <h1>{data?.link}</h1>
            <h1>{"@" + data?.instagramUsername}</h1>

            <Links />
        </div>
    )
}
