'use client'
import React, { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import Axios from '@/lib/Axios'
import { toast } from 'sonner'
import Image from 'next/image'
import CreateProject from './_component/CreateProject'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

const Dashboard = () => {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await Axios({
        url: "/api/project",
        params: {
          page: page,
        }
      });

      if (response.status === 200) {
        setData(response.data.data || []);
        setTotalPages(response.data.totalPages);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleRedirectEditorpage = (projectId : string) => {
    router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/editor/${projectId}?file=index.html`)
  }

  return (
    <div>
      {
        isLoading ? (
          <p className='my-4 w-fit mx-auto'>Loading...</p>
        ) : (
          !(Array.isArray(data) && data.length > 0) ? (
            <div className='flex justify-center items-center flex-col min-h-[calc(100vh-3.5rem)]'>
              <Image
                src={"/project.svg"}
                width={300}
                height={300}
                alt='Create Project'
              />
              <p>Create Project effortlessly with our intuitive interface</p>
              <CreateProject buttonVarient="default" />
            </div>
          ) : (
            <div className='grid gap-6 lg:grid-cols-2 p-4 lg:p-6'>
              {
                data.map((items: any, index: any) => {
                  return (
                    <Card onClick={() => handleRedirectEditorpage(items._id)} key={items?._id} className='cursor-pointer overflow-hidden group max-h-60'>
                      <CardHeader>
                        <CardTitle>{items.name}</CardTitle>
                        <CardContent className='min-h-48'>
                          <div className='border rounded-lg top-15 group-hover:top-4 relative transition-all shadow drop-shadow-2xl'>
                            <iframe
                              title={items.name}
                              className='w-full h-full'
                              src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/file/${items._id}/index.html`}
                            />
                          </div>
                        </CardContent>
                      </CardHeader>
                    </Card>
                  )
                })
              }
            </div>
          )
        )
      }
    </div>
  )
}

export default Dashboard