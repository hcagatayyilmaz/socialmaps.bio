import prisma from "@/lib/db"
export async function POST(request: Request, {params}: {params: {username: string}}) {
    const {username} = params // 'a

    try {
        const data = await request.json() // Expecting { username, locationJson, postDetails }
        const {locationJson, postDetails} = data

        // Find the user by username
        const user = await prisma.user.findUnique({
            where: {username: username[0]},
            include: {posts: true} // Include posts to count them
        })

        if (!user) {
            return Response.json({error: "User not found"}, {status: 404})
        }

        // Check how many posts the user has
        if (user.posts.length > 4) {
            return Response.json({message: "Not capacity"}, {status: 403})
        }

        await prisma.post.upsert({
            where: {
                instagram_post_id: postDetails.instagram_id // This assumes 'instagram_id' is the unique identifier for posts
            },
            update: {
                // Fields to update if the post exists
                title: postDetails.title,
                content: postDetails.content,
                location: postDetails.location, // Make sure to convert location to JSON if it's not already
                link: postDetails.link,
                media_url: postDetails.media_url,
                userId: user.id // Include authorId if it might change, otherwise it can be omitted here
            },
            create: {
                // Data to use if the post does not exist
                title: postDetails.title,
                content: postDetails.content,
                location: postDetails.location, // Assuming location needs to be stored as JSON
                link: postDetails.link,
                media_url: postDetails.media_url,
                instagram_post_id: postDetails.instagram_id, // Corrected field name to match Prisma schema
                userId: user.id
            }
        })

        return Response.json({message: "Update successful"}, {status: 200})
    } catch (error) {
        console.error("Failed to update user and post data:", error)
        return Response.json({slug: username[0]})
    }
}
