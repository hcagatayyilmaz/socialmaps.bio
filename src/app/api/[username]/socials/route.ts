import prisma from "@/lib/db"
import {LinkType, SocialType} from "@prisma/client"

export async function POST(request: Request, {params}: {params: {username: string}}) {
    const {username} = params
    const data = await request.json()
    console.log("Received data:", data)

    const user = await prisma.user.findUnique({
        where: {username: username}
    })

    if (!user) {
        console.log("User not found")
        return new Response("User not found.", {status: 404})
    }

    console.log("User found:", user)

    const promises = []
    for (const type in data) {
        if (data.hasOwnProperty(type)) {
            const url = data[type]
            const socialType = type.toUpperCase() as SocialType
            console.log("Processing:", type, socialType, url)

            if (!Object.values(SocialType).includes(socialType as SocialType)) {
                console.log("Invalid type:", socialType)
                continue
            }

            try {
                const promise = prisma.links.upsert({
                    where: {
                        userId_SocialType: {
                            userId: user.id,
                            SocialType: socialType as SocialType
                        }
                    },
                    update: {
                        link: url
                    },
                    create: {
                        userId: user.id,
                        SocialType: socialType as SocialType,
                        link: url,
                        LinkType: LinkType.SOCIAL
                    }
                })
                promises.push(promise)
            } catch (error) {
                console.log(error)
            }
        }
    }

    console.log("Promises array:", promises)

    try {
        await Promise.all(promises)
        return new Response("All links updated successfully.", {status: 200})
    } catch (error) {
        console.error("Failed to update links:", error)
        return new Response("Failed to update links.", {status: 500})
    }
}
