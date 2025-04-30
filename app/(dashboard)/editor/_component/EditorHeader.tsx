"use client"
import { Button } from '@/components/ui/button'
import UserAvatar from '@/components/UserAvatar'
import Axios from '@/lib/Axios'
import { ArrowLeft, Database, Play, PlayCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const EditorHeader = () => {
    const router = useRouter();
    const { projectId } = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>({
        name: "",
    });

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await Axios({
                url: "/api/project",
                params: {
                    projectId: projectId
                }
            });

            if (response.status === 200) {
                const projects = response?.data?.data;

                if (projects && projects.length > 0) {
                    setData(projects[0]); 
                } else {
                    setData(null); 
                    toast.error("Project not found");
                }
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if(projectId){
            fetchData();
        }
    }, [projectId]);


    return (
        <header className='bg-white h-14 sticky top-0 z-40 flex items-center px-4'>
            {/* left side */}
            <div className='flex items-center gap-4 max-w-sm'>
                <Button
                    onClick={() => { router.back() }}
                    className='cursor-pointer'
                >
                    <ArrowLeft />
                </Button>
                <h2 className='font-semibold'>
                    {
                        isLoading ? "Loading..." : data?.name ?? "-"
                    }
                </h2>
                <div className='flex items-center gap-1'>
                    <Database size={16} />
                    Saving / Save
                </div>
            </div>
            {/* right side */}
            <div className='ml-auto w-fit flex items-center gap-6'>
                <div className='bg-primary/70 hover:bg-primary p-1 cursor-pointer rounded-full'>
                    <Play />
                </div>
                <UserAvatar />
            </div>
        </header>
    )
}

export default EditorHeader