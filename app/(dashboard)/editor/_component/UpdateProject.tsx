import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import Axios from '@/lib/Axios'
import { useRouter } from 'next/navigation'
import { Pencil } from 'lucide-react'
import { fetchData } from 'next-auth/client/_utils'

type TUpdateProject = {
    projectId: string
    name: string
    fetchData : () => void
}

const UpdateProject = ({ projectId, name, fetchData }: TUpdateProject) => {
    const [projectName, setProjectName] = useState<string>(name);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [open, setOpen ] = useState<boolean>(false);
    const handleUpdateProject = async (e: any) => {
        e.preventDefault();
        if (!(projectName)) {
            toast.error("Project name is required")
        }

        try {
            setIsLoading(true);
            const response = await Axios.put("api/project", {
                name: projectName,
                projectId : projectId
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                setProjectName("");
                setOpen(false);
                if(fetchData){
                    fetchData();
                }
            }

        } catch (error: any) {
            toast.error(error?.response?.data?.error ?? "Error creating project")
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button variant={'ghost'} size={'icon'} className='invisible group-hover:visible'>
                    <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Project</DialogTitle>
                    <form className='my-4 grid gap-4'>
                        <Input
                            disabled={isLoading}
                            placeholder='Enter your project name'
                            value={projectName ?? ""}
                            onChange={(e) => setProjectName(e.target.value)}
                        />
                        <Button className='cursor-pointer' onClick={handleUpdateProject}
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating..." : "Update Project"}
                        </Button>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}

export default UpdateProject