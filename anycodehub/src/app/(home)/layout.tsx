import Sidebar from '@/components/layouts/sidebar'
import { AuthActions } from '@/components/common'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="wrapper grid grid-cols-[300px,1fr] h-screen">
            <Sidebar>
            </Sidebar>
            <main className='p-5'>
                <div className="flex justify-end mb-4">
                    <AuthActions />
                </div>
                {children}
            </main>
        </div>
    )
}

export default Layout;