"use server"

import prisma from "../../lib/db"
import {RequestCookie} from "next/dist/compiled/@edge-runtime/cookies"

export async function createUser({
    email,
    id,
    name,
    image
}: {
    email: string
    id: string
    name: string
    image: string
}) {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            stripeCustomerId: true
        }
    })
    if (!user) {
        await prisma.user.create({
            data: {
                id,
                email,
                name,
                image
            }
        })
    }
}

export async function fetchInstagramUser(instagram_access_token: RequestCookie) {
    const res = await fetch(
        `https://graph.instagram.com/v19.0/me?fields=id,username&access_token=${instagram_access_token.value}`
    )

    if (!res.ok) {
        console.error("Error fetching Instagram user:", res.statusText)
    }

    const {id, username} = await res.json()

    return {id, username}
}

export async function fetchInstagramPosts(id: any, instagram_access_token: RequestCookie) {
    const res = await fetch(
        `https://graph.instagram.com/${id}/media?fields=id,caption,media_type,media_url,permalink,timestamp,thumbnail_url&access_token=${instagram_access_token.value}`
    )
    if (!res.ok) {
        console.error("Error fetching Instagram posts:", res.statusText)
    }

    return res.json() // The posts are contained within the `data` field
}
