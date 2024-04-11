import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server"
import prisma from "@/lib/db"
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

export default function Profile() {
    const {getUser} = getKindeServerSession()
    const user = getUser()

    return <p>Test</p>
}
