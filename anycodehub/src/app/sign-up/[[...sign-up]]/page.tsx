import { SignUp } from '@clerk/nextjs'

export default function Page() {
    return <div className="p-10 flex justify-center items-center h-screen">
        <SignUp />
    </div>
}