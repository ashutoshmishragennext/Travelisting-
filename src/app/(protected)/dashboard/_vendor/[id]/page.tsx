// import CareersPage from '@/components/shared/Cardinner'
import { CircleUserRound } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

 const page = () => {
  return (
    <div>
        
        <nav className="flex items-center justify-between p-4 bg-blue-50">
        <div className="flex items-center space-x-2">
            <Link href={"/"}>
          <img src="/logo.png" alt="The Muse Logo" className="h-8" />
          </Link>
          {/* <span className="text-navy-900 font-bold text-xl">the muse</span> */}
        </div>
        
        <div className="flex items-center space-x-6">
          {/* <button className="hover:text-blue-600">JOBS</button>
          <button className="hover:text-blue-600">COMPANIES</button>
          <button className="hover:text-blue-600">ADVICE</button>
          <button className="hover:text-blue-600">COACHING</button>
          <button className="flex items-center space-x-1 hover:text-blue-600">
            <span>NEWSLETTER</span>
            <span className="transform rotate-45">✈</span>
          </button>
          <button className="px-4 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-50">
            EMPLOYERS
          </button> */}
          <button className="hover:text-blue-600"><CircleUserRound/></button>
        </div>
      </nav>
      
        {/* <CareersPage/> */}
        </div>
  )
}

export default page