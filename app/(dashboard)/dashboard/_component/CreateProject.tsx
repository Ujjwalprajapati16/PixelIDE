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
import Loader from '@/components/ui/loader'

type TCreateProject = {
    buttonVarient?: "outline" | "default"
}

const CreateProject = ({ buttonVarient }: TCreateProject) => {
    const [projectName, setProjectName] = useState<string>();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleCreateProject = async (e: any) => {
        e.preventDefault();
        if (!(projectName)) {
            toast.error("Project name is required")
        }

        try {
            setIsLoading(true);
            const response = await Axios.post("api/project", {
                name: projectName,
            });

            if (response.status === 201) {
                toast.success("Project created successfully")
                setProjectName("");
                router.push(`/editor/${response.data?.projectId}?file=index.html`);
            }

        } catch (error: any) {
            toast.error(error?.response?.data?.message ?? "Error creating project")
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={buttonVarient ?? 'outline'} className='cursor-pointer my-4 mx-2'>Create Project</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                    <form className='my-4 grid gap-4'>
                        <Input
                            disabled={isLoading}
                            placeholder='Enter your project name'
                            value={projectName ?? ""}
                            onChange={(e) => setProjectName(e.target.value)}
                        />
                        <Button className='cursor-pointer' onClick={handleCreateProject}
                            disabled={isLoading}
                        >   
                            {isLoading && <Loader className="mr-2 h-4 w-4" />}
                            {isLoading ? "Creating..." : "Create Project"}
                        </Button>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}

export default CreateProject