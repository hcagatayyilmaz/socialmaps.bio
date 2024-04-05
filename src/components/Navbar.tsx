import Link from "next/link"
import {Button} from "./ui/button"
import {
  RegisterLink,
  LoginLink,
  LogoutLink
} from "@kinde-oss/kinde-auth-nextjs/components"
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server"
import {cn} from "../lib/utils"

export default async function Navbar() {
  const {isAuthenticated, getUser} = getKindeServerSession()
  const authenticationStatus = await isAuthenticated()
  return (
    <nav className='border-b bg-background h-[10vh] flex items-center'>
      <div className='container flex items-center justify-between'>
        <Link href='/'>
          <h1 className='font-bold text-3xl'>Logo</h1>
        </Link>

        <div className='flex items-center gap-x-5'>
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
              <LogoutLink>
                <Button>Logout</Button>
              </LogoutLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
