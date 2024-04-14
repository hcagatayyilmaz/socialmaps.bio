"use client"
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

const linkData = [
    {title: "Link Descriptive Content 1", url: "https://www.google.com"},
    {title: "Link Descriptive Content 2", url: "https://www.google.com"},
    {title: "Link Descriptive Content 3", url: "https://www.google.com"},
    {title: "Link Descriptive Content 4", url: "https://www.google.com"}
]

function Links() {
    return (
        <div className='flex flex-col justify-center items-center w-full gap-4 border-t-2 mt-4 border-black'>
            <Sheet>
                <SheetTrigger asChild>
                    <div className='flex flex-col justify-center items-center mt-4 cursor-pointer '>
                        <IoMdAddCircle className='text-4xl fill-black ' />
                        <h1>Add Link</h1>
                    </div>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Edit profile</SheetTitle>
                        <SheetDescription>
                            Make changes to your profile here. Click save when you're done.
                        </SheetDescription>
                    </SheetHeader>
                    <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='name' className='text-right'>
                                Name
                            </Label>
                            <Input type='text' id='name' className='col-span-3' />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='username' className='text-right'>
                                Username
                            </Label>
                            <Input type='text' id='username' className='col-span-3' />
                        </div>
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type='submit'>Save changes</Button>
                        </SheetClose>
                    </SheetFooter>
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
    )
}

export default Links
