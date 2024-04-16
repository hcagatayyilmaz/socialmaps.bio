import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server"
import prisma from "@/lib/db"
import {unstable_noStore as noStore} from "next/cache"
import {get} from "http"
import {Button} from "@/components/ui/button"
import {IoMdAddCircle} from "react-icons/io"
import Links from "./Links"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"

import Image from "next/image"

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
            <Avatar className='h-20 w-20'>
                <AvatarImage src='https://github.com/shadcn.png' />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <h1>{data?.username}</h1>
            <h1>{"@" + data?.instagramUsername}</h1>

            <Links />
        </div>
    )
}
