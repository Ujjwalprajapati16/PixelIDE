'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Sidebar, SidebarHeader } from '@/components/ui/sidebar'
import Axios from '@/lib/Axios'
import { File, FilePlus } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

const EditorSidebar = () => {
    const [fileName, setFileName] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openAddFile, setOpenAddFile] = useState<boolean>(false);
    const { projectId } = useParams();

    const handleCreateFile = async () => {
        const payload = {
            name : fileName,
            projectId : projectId
        }
        try {
            setIsLoading(true);
            const response = await Axios.post("api/project-file", payload);

            if(response.status === 201) {
                toast.success("File created successfully")
                setFileName("");
                setOpenAddFile(false);
            }
        } catch (error : any) {
            toast.error(error?.response?.data?.error || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Sidebar className='h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)] top-14'>
            <SidebarHeader className='bg-primary/10 flex flex-row items-center py-1'>
                <div >
                    <p>Files</p>
                </div>
                <div className='ml-auto'>
                    <Dialog
                        open={openAddFile}
                        onOpenChange={setOpenAddFile}
                    >
                        <DialogTrigger>
                            <Button size={'icon'} variant={'ghost'} className='cursor-pointer'>
                                <FilePlus />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Add File</DialogTitle>
                            <Input
                                disabled={isLoading}
                                value={fileName ?? ""}
                                placeholder='Enter file name'
                                onChange={(e) => setFileName(e.target.value)}
                            />
                            <Button
                                disabled={isLoading}
                                onClick={handleCreateFile}
                            >
                                {isLoading ? 'Adding...' : 'Add File'}
                            </Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </SidebarHeader>
        </Sidebar>
    )
}

export default EditorSidebar