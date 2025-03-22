"use client"
import Home2 from '@/components/Hero2';
import ProfilePage from '@/components/shared/Profile'
import { useCurrentRole, useCurrentUser } from '@/hooks/auth';
import React from 'react'

const Page = () => {
    const user = useCurrentUser();

    
  return (
   <div><Home2/></div>
  )
}

export default Page