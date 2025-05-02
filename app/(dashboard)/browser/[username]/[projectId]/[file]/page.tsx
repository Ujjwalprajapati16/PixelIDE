'use client'
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
    const { username, projectId, file } = useParams();
    return (
        <iframe
            title={username as string}
            className='w-full h-screen'
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/file/${projectId}/${file}`}
        />
    )
}

export default page