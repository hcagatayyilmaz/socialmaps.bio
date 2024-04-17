import prisma from "@/lib/db"
import {LinkType} from "@prisma/client"

export default async function POST(request: Request, {params}: {params: {username: string}}) {
    const {username} = params
    const data = await request.json()

    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    })

    if (!user) {
        return new Response("User not found.", {status: 404})
    }
    // Process each social link
    const updates = data.map(async (link: any) => {
        return prisma.links.upsert({
            where: {
                userId_SocialType: {
                    userId: user.id,
                    SocialType: link.type
                }
            },
            update: {
                link: link.url
            },
            create: {
                userId: user.id,
                SocialType: link.type,
                link: link.url,
                LinkType: LinkType.Social
            }
        })
    })
}
