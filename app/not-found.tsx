"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import { House } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const notFound = () => {
    const router = useRouter()
    const onHome = () => {
        router.push('/')
    }
    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <Image src="/not_found.svg" alt="not found" width={500} height={500} />
            <h1 className='text-2xl font-bold text-center mt-5'>404 - Page Not Found</h1>
            <p className='text-center mt-5'>Sorry, the page you are looking for does not exist.</p>
            <Button className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-5' onClick={onHome}>
                <House className='inline mr-2' />
                Home</Button>
        </div>
    )
}

export default notFound