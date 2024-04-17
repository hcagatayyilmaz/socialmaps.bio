import prisma from "@/lib/db"
import {LinkType} from "@prisma/client"

export async function POST(request: Request, {params}: {params: {username: string}}) {
    const data = await request.json()
    const username = params.username
    console.log(username)
    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    })

    if (!user) {
        return new Response("User not found.", {status: 404})
    }
    console.log(data)

    try {
        const result = await prisma.links.create({
            data: {
                ...data,
                userId: user.id,
                LinkType: LinkType.LINK
            }
        })
        return new Response(JSON.stringify(result), {status: 200})
    } catch (error) {
        console.error("Failed to create link:", error)
        return new Response("Failed to create link.", {status: 500})
    }
}
