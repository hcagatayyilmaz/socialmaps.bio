"use client"
import React, {useState} from "react"
import {IoMdAddCircle} from "react-icons/io"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import Link from "next/link"
import axios from "axios"

const linkData = [
    {title: "Link Descriptive Content 1", url: "https://www.google.com"},
    {title: "Link Descriptive Content 2", url: "https://www.google.com"},
    {title: "Link Descriptive Content 3", url: "https://www.google.com"},
    {title: "Link Descriptive Content 4", url: "https://www.google.com"}
]
interface LinksProps {
    username: string | null | undefined
}

function Links(props: LinksProps) {
    const {username} = props
    const [instagram, setInstagram] = useState("")
    const [tiktok, setTiktok] = useState("")
    const [facebook, setFacebook] = useState("")
    const [twitter, setTwitter] = useState("")
    const [website, setWebsite] = useState("")

    const [link, setLink] = useState("")
    const [title, setTitle] = useState("")

    const handleLinks = async (event: React.FormEvent) => {
        event.preventDefault()
        const data = {
            title: title,
            link: link
        }
        console.log("Submitting Data:", data)
        const response = await axios.post(`/api/${username}/links`, data)

        if (response.status === 200) {
            console.log("Links submitted successfully!")
        } else {
            console.error("Failed to submit links")
        }
    }

    const handleSocials = async (event: React.FormEvent) => {
        event.preventDefault()
        const data = {
            instagram: instagram,
            tiktok: tiktok,
            facebook: facebook,
            twitter: twitter,
            website: website
        }
        console.log("Submitting Data:", data)
        const response = await axios.post(`/api/${username}/socials`, data)

        if (response.status) {
            console.log("Links submitted successfully!")
        } else {
            console.error("Failed to submit links")
        }
    }

    return (
        <div className='flex flex-col justify-center items-center w-full gap-4 border-t-2 mt-4 border-black'>
            <div className='w-full flex-flex-col'>
                <form onSubmit={handleSocials}>
                    <Sheet>
                        <SheetTrigger asChild>
                            <div className='flex flex-col justify-center items-center mt-4 cursor-pointer '>
                                <IoMdAddCircle className='text-4xl fill-black ' />
                                <h1>Add Socials</h1>
                            </div>
                        </SheetTrigger>
                        <SheetContent>
                            <form onSubmit={handleSocials}>
                                <SheetHeader>
                                    <SheetTitle>Add Your Social Accounts</SheetTitle>
                                    <SheetDescription>
                                        You can add your social media accounts to your page.
                                    </SheetDescription>
                                </SheetHeader>

                                <div className='grid gap-4 py-4'>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor='name' className='text-right'>
                                            Instagram
                                        </Label>
                                        <Input
                                            type='text'
                                            id='name'
                                            className='col-span-3'
                                            onChange={(e) => setInstagram(e.target.value)}
                                        />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor='username' className='text-right'>
                                            Tiktok
                                        </Label>
                                        <Input
                                            type='text'
                                            id='username'
                                            className='col-span-3'
                                            onChange={(e) => setTiktok(e.target.value)}
                                        />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor='username' className='text-right'>
                                            Facebook
                                        </Label>
                                        <Input
                                            type='text'
                                            id='username'
                                            className='col-span-3'
                                            onChange={(e) => setFacebook(e.target.value)}
                                        />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor='username' className='text-right'>
                                            X
                                        </Label>
                                        <Input
                                            type='text'
                                            id='username'
                                            className='col-span-3'
                                            onChange={(e) => setTwitter(e.target.value)}
                                        />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor='username' className='text-right'>
                                            Website
                                        </Label>
                                        <Input
                                            type='text'
                                            id='username'
                                            className='col-span-3'
                                            onChange={(e) => setWebsite(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <SheetFooter>
                                    <SheetClose asChild>
                                        <Button type='submit'>Save changes</Button>
                                    </SheetClose>
                                </SheetFooter>
                            </form>
                        </SheetContent>
                    </Sheet>
                </form>
            </div>
            <div className='w-full flex flex-col gap-4 border-t-2 border-black'>
                <Sheet>
                    <SheetTrigger asChild>
                        <div className='flex flex-col justify-center items-center mt-4 cursor-pointer '>
                            <IoMdAddCircle className='text-4xl fill-black ' />
                            <h1>Add Link</h1>
                        </div>
                    </SheetTrigger>
                    <SheetContent>
                        <form onSubmit={handleLinks}>
                            <SheetHeader>
                                <SheetTitle>Edit profile</SheetTitle>
                                <SheetDescription>
                                    Make changes to your profile here. Click save when you're done.
                                </SheetDescription>
                            </SheetHeader>
                            <div className='grid gap-4 py-4'>
                                <div className='grid grid-cols-4 items-center gap-4'>
                                    <Label htmlFor='name' className='text-right'>
                                        Title
                                    </Label>
                                    <Input
                                        type='text'
                                        id='title'
                                        className='col-span-3'
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className='grid grid-cols-4 items-center gap-4'>
                                    <Label htmlFor='link' className='text-right'>
                                        Link URL
                                    </Label>
                                    <Input
                                        type='text'
                                        id='link'
                                        className='col-span-3'
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                    />
                                </div>
                            </div>
                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button type='submit'>Save changes</Button>
                                </SheetClose>
                            </SheetFooter>
                        </form>
                    </SheetContent>
                </Sheet>

                <div className='w-full grid grid-cols-2 gap-4'>
                    {linkData.map((item) => (
                        <Link href={item.url}>
                            <div className='border-solid border-2 border-black rounded overflow-hidden p-2 flex items-center justify-center cursor-pointer'>
                                <h1>{item.title}</h1>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Links
