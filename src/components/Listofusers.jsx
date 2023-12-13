import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addprofile } from '../redux/profileslice'
import { useNavigate } from 'react-router-dom'

const Listofusers = () => {

    const [userdata, setuserdata] = useState([])
    const [loading, setloading] = useState(true)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(addprofile())
        fetch('https://siddu03.pythonanywhere.com/formvalid/')
            .then(res => res.json())
            .then(res =>{
            setuserdata(res)
            setTimeout(()=>setloading(false),500)
       })
    }, [])

   


    const updateclickhandler = (feilds) => {
        dispatch(addprofile(feilds))
        navigate('/')
    }

    const deleteuserfetch = (id) => {
        fetch(`https://siddu03.pythonanywhere.com/formvalid/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        }
        )
            .then(res => {
                setuserdata(userdata.filter(data => data.id !== id))
            })

    }

    return (
        <div className='w-full h-[90vh] p-10 flex flex-wrap justify-center gap-10 overflow-y-auto scroll_none'>
            {loading ? (
              <div className='w-10 h-10 border-black border-b-4 border-t-4 animate-spin rounded-full'></div>
            ):(
            userdata.length ? (
                userdata.map(({ id, firstname, lastname, email, address, state, country, zipcode, mobile }) => (

                    <div key={id} className='w-[350px] h-[300px] flex flex-col justify-between bg-gray-50  border-[1px] border-gray-300 text-whit rounded-xl shadow p-7 pb-5'>
                        <div className='flex flex-col gap-1 font-semibod'>

                            <div className='font-bold capitalize'>{firstname} {lastname}</div>
                            <div>{email}</div>
                            <div>{address}</div>
                            <div>{state} ,{zipcode}</div>
                            <div>{country} </div>

                            <div>phone no: {mobile} .</div>

                        </div>
                        <div className='flex gap-5 font-semibold justify-end'>
                            <button onClick={() => updateclickhandler({ id, firstname, lastname, email, address, state, country, zipcode, mobile })} className='bg-green-300 rounded-lg px-2 border-green-500 border-[1px] py-[2px]'>update</button>
                            <button onClick={() => deleteuserfetch(id)} className='bg-red-300 rounded-lg border-red-400 border-[1px] px-2 py-[2px]'>delete</button>
                        </div>
                    </div>


                ))
            ) : (
                <div className='font-bold text-xl'>No users...</div>
            ))
            }
        </div>
    )
}

export default Listofusers