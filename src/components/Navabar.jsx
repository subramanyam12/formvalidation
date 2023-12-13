import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Navabar = () => {
    let hashlocation = window.location.hash==='#/listofusers' ? 1 : 0
    const [menuindex, setmenuindex] = useState(hashlocation)
    const data =useSelector(state=>state.Profile)
   
    useEffect(()=>{
    setmenuindex(hashlocation)
    },[data])
    
    const menu = ['user form', 'list of users']
    return (
        <>
            <div className='flex h-fit pt-5 gap-10 ml-5'>
                {
                    menu.map((nav,i) => (
                        <Link to={nav==='user form' ? '/' :'listofusers'} key={nav} onClick={()=>setmenuindex(i)} className={`${menuindex===i && 'bg-gray-500 text-white rounded-t-lg'} duration-200 py-1 px-4 text-xl font-bold capitalize`}>{nav}</Link>
                    ))
                }
            </div>

            <div className='h-[3px] w-full bg-gray-500' />
        </>
    )
}

export default Navabar