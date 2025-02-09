import Link from "next/link";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="font-bold text-8xl">404</h1>
            <h2 className="mb-5">Page not found</h2>
            <Link className="flex items-center gap-2 hover:text-primary transition-all" href='/'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>


                Quay về trang chủ
            </Link>
        </div>
    )
}

export default NotFound;