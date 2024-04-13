import React from "react"
import Post from "@/components/Post"

async function Dashboard({posts, user}: any) {
    return (
        <div>
            <div className='w-full grid grid-cols-3 gap-1 mt-4'>
                {posts && posts.data
                    ? posts.data.map((post: any) => <Post post={post} user={user} key={post.id} />)
                    : "No posts found."}
            </div>
        </div>
    )
}

export default Dashboard
