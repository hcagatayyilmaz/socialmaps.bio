import Link from "next/link"
import {Button} from "./ui/button"
import {RegisterLink, LoginLink, LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components"
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server"

export default async function Navbar() {
    const {isAuthenticated, getUser} = getKindeServerSession()
    const authenticationStatus = await isAuthenticated()
    return (
        <nav className=' bg-background h-[10vh] flex items-center py-4'>
            <div className='w-full flex justify-between items-center'>
                <Link href='/'>
                    <h1 className='inline-block bg-gradient-to-r from-green-500 via-blue-900  to-pink-500 bg-clip-text text-4xl text-transparent absolute left-4 top-4 '>
                        socialmaps.bio
                    </h1>
                </Link>

                <div className='flex justify-between gap-x-5'>
                    <div className=''>
                        {!authenticationStatus ? (
                            <div className='flex items-center gap-x-5'>
                                <LoginLink>
                                    <Button>Login</Button>
                                </LoginLink>
                                <RegisterLink>
                                    <Button>Sign Up</Button>
                                </RegisterLink>
                            </div>
                        ) : (
                            <div className='flex items-center gap-x-5'>
                                <Button>
                                    <Link href={"profile"}>Profile</Link>
                                </Button>
                                <LogoutLink>
                                    <Button>Logout</Button>
                                </LogoutLink>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
