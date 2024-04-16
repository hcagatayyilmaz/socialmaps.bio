import prisma from "@/lib/db"
export async function POST(request: Request, {params}: {params: {username: string}}) {
    const data = await request.json()

    if (!(data.linkType in LinkType)) {
        return new Response("Invalid link type provided.", {status: 400})
    }

    // Find the user ID based on the username provided in parameters
    const user = await prisma.user.findUnique({
        where: {
            username: params.username
        }
    })
    // Find the user ID based on the username provided in parameters
    const user = await prisma.user.findUnique({
        where: {
            username: params.username
        }
    })

    if (!user) {
        return new Response("User not found.", {status: 404})
    }
    const result = await prisma.user.create({
        data: {
            ...data,
            id: user.id // Assuming the ID is meant to be the same (might need adjustment based on actual requirements)
        }
    })
}
