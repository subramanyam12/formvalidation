import { useEffect, useState } from 'react'
import phonecodesData from '../phonecodes.json'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Mainform() {
    const [value, setvalue] = useState({
        'first name': '',
        'last name': '',
        email: '',
        'address 1': '',
        'address 2 (optional)': '',
        country: '',
        state: '',
        mobile: '',
        zipcode: ''
    })

    const [error, seterror] = useState({
        'first name': '',
        'last name': '',
        email: '',
        'address 1': '',
        'address 2 (optional)': '',
        country: '',
        state: '',
        mobile: '',
        zipcode: ''
    })

    const [allcountry_states, setallcountry_states] = useState([])
    const [countries, setcountries] = useState()
    const [countrybool, setcountrybool] = useState(false)
    const [states, setstates] = useState([])
    const [searchstates, setsearchstates] = useState([])
    const [statesbool, setstatesbool] = useState(false)
    const [searchmobilecodes, setsearchmobilecodes] = useState(phonecodesData.countries)
    const [searchcodequery, setsearchcodequery] = useState('')
    const [mobilebool, setmobilebool] = useState(false)
    const [updatebool, setupdatebool] = useState(false)
    const [successbool, setsuccessbool] = useState(false)
    const [loading, setloading] = useState(false)

    const profiledata = useSelector(state=>state.Profile)
    const navigate = useNavigate()
    


    useEffect(() => {
        setsuccessbool(false)
        fetch('https://countriesnow.space/api/v0.1/countries/states')
            .then(res => res.json())
            .then(res => {
                setcountries(res?.data)
                setallcountry_states(res?.data)
            })
        if(profiledata.length){
            setupdatebool(true)
            let feilds = profiledata[0]
            let phone_num = feilds['mobile']?.split('-')
            setvalue({
                'first name':feilds.firstname ,
                'last name': feilds.lastname,
                 email:feilds.email ,
                'address 1':feilds.address,
                'address 2 (optional)': '',
                country: feilds.country,
                state: feilds.state,
                mobile: phone_num?.[1],
                zipcode: feilds.zipcode
            })
            setsearchcodequery(phone_num?.[0])
        }
    }, [])

    const inputhandle = (e) => {
        setvalue((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        if (e.target.name === 'country') {
            setcountries(e.target.value ? allcountry_states.filter(({ name }) => name.toLowerCase().includes(e.target.value.toLowerCase())) : allcountry_states)

        }

        if (e.target.name === 'state') {
            setsearchstates(e.target.value ? states.filter(({ name }) => name.toLowerCase().includes(e.target.value.toLowerCase())) : states)

        }
    }

    const postdatafetch = (body) => {
        fetch('https://siddu03.pythonanywhere.com/formvalid/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(res => {
                setTimeout(()=>{
                    resetclickhandle()
                    setloading(false)
                  setsuccessbool(true)
                },500)
            })
            .catch(err=>console.log(err))
    }
    
    const updatedatafetch = (id,body) => {
        fetch(`https://siddu03.pythonanywhere.com/formvalid/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(res => {
                navigate('/listofusers')
                resetclickhandle()
                setloading(false)
            })
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        const errordata = {
            'first name': !value['first name'] ? ' enter first name ' : value['first name'].length < 5 ? 'minimum five characters..' : '',
            'last name': !value['last name'] ? 'enter last name' : value['last name'].length < 5 ? 'minimum five characters..' : '',
            email: !value['email'] ? 'enter email' : !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value['email'])) ? 'email is invaild..' : '',
            'address 1': !value['address 1'] ? 'enter address ' : '',
            'address 2 (optional)': '',
            'country': !value['country'] ? 'enter country ' : '',
            'state': !value['state'] ? 'enter  state ' : '',
            'zipcode': !value['zipcode'] ? 'enter zipcode  ' : isNaN(Number(value['zipcode'])) ? 'zipcode has only numbers..' : '',
            'mobile': !value['mobile'] || !searchcodequery ? 'enter country code and phone no ' : isNaN(Number(value['mobile'])) || value['mobile'].length !== 10 ? 'number is not vaild..' : ''
        }

        seterror(errordata)

        let check = false;
        for (let item in errordata) {
            if (errordata[item]) {
                check = true
            }
        }

        if (check) return
        setloading(true)
        let formdata = {
            firstname: value['first name'],
            lastname: value['last name'],
            email: value.email,
            address: value['address 1'] + ' ' + value['address 2 (optional)'],
            mobile: searchcodequery +'-'+ value['mobile'],
            country: value['country'],
            state: value['state'],
            zipcode: value['zipcode']
        }

       if(updatebool){
        profiledata[0]?.id && updatedatafetch(profiledata[0]?.id,formdata) 
       }else{
         postdatafetch(formdata)
       }
       

    }


    const feilds = ['first name', 'last name', 'email', 'address 1', 'address 2 (optional)', 'zipcode']


    const countryclickhandle = (name) => {
        setvalue(prev => ({ ...prev, country: name }))
        setcountrybool(false)
    }

    const stateinputclickhandle = () => {
        let country_state = allcountry_states.filter(({ name }) => name === value['country'])?.[0]?.states
        setstates(country_state ? country_state : [])
        setsearchstates(country_state ? country_state : [])
        setstatesbool(true)
    }

    const stateclickhandle = (name) => {
        setvalue(prev => ({ ...prev, state: name }))
        setstatesbool(false)
    }

    const countrycodeinputclickhandle = (e) => {
        setsearchcodequery(e.target.value)
        setsearchmobilecodes(e.target.value ? phonecodesData.countries.filter(({ name, code }) => name.toLowerCase().includes(e.target.value.toLowerCase()) || code.toLowerCase().includes(e.target.value.toLowerCase())) : phonecodesData.countries)
    }
    const countrycodeclickhandle = (code) => {
        setsearchcodequery(code)

    }


    const resetclickhandle = () => {
        setsearchcodequery([])
        setvalue({ 'first name': '', 'last name': '', email: '', 'address 1': '', 'address 2 (optional)': '', country: '', state: '', mobile: '', zipcode: '' })
        seterror({ 'first name': '', 'last name': '', email: '', 'address 1': '', 'address 2 (optional)': '', country: '', state: '', mobile: '', zipcode: '' })
        setcountries(allcountry_states)
        setsearchmobilecodes(phonecodesData.countries)
    }





    return (
        <>

            <div className='py-16 h-[100svh] overflow-auto scroll_none'>
                <form onSubmit={handleSubmit} className='w-full flex flex-col'>
                    <div className='flex max-sm:flex-col justify-center items-center gap-[70px] max-sm:gap-[30px]'>
                        <div className='w-[55%] max-sm:w-full flex flex-wrap max-sm:flex-nowrap max-sm:flex-col justify-between max-sm:items-center gap-10 max-sm:gap-7'>

                            {/* 'first name', 'last name', 'email', 'address 1', 'address 2 (optional)', feilds */}
                            {feilds.map((name) => (
                                <div key={name} className='relative w-[45%] max-sm:w-[80%]'>
                                    <input id={name} type="text" name={name} value={value[name]} onChange={inputhandle} placeholder='' className='font-semibold peer bg-transparent input_placeholder focus:border-blue-500 focus:shadow-[0_3px_0_0_rgb(59,130,246)] pt-2 px-3 shadow-[0_2px_0_0_#0000004b] capitalize w-full outline-none mb-[2px]' />
                                    <label htmlFor={name} className='position_move'>{name}</label>
                                    <br />
                                    <span className={`text-sm text-red-500 ml-3`}>{error[name]}</span>
                                </div>
                            ))}
                        </div>


                        <div className='flex flex-col gap-10 max-sm:gap-8 w-[25%] max-sm:w-full max-sm:items-center'>

                            {/* country feild */}
                            <div className='relative w-full max-sm:w-[80%]'>
                                <input type="text" id='country' name='country' value={value['country']} onFocus={() => setcountrybool(true)} onBlur={() => setTimeout(() => setcountrybool(false), 250)} onChange={inputhandle} placeholder='' className='font-semibold peer bg-transparent input_placeholder focus:border-blue-500 focus:shadow-[0_3px_0_0_rgb(59,130,246)] pt-2 px-3 shadow-[0_2px_0_0_#0000004b] capitalize w-full outline-none mb-[2px]' />
                                <label htmlFor='country' className='position_move'>country</label>
                                <br />
                                <span className={`text-sm text-red-500 ml-3`}>{error['country']}</span>
                                {
                                    countrybool ? (
                                        <div className='absolute z-10 bg-white top-8  left-0 border-[1px] shadow-lg border-[#0000003a] mt-3 w-full py-3 rounded-xl max-h-[50vh] max-sm:h-[40vh] overflow-y-auto scroll_none'>
                                            {countries.length ? countries.map(({ name, iso3 }, i) => (
                                                <h1 key={iso3} onClick={() => countryclickhandle(name)} className='text-center py-[2px] hover:bg-[#b9b7b79d]'>{name}</h1>
                                            )) : (
                                                <h1 className='text-center text-red-500'>no countries...</h1>
                                            )}
                                        </div>) : null}
                            </div>


                            {/* state feild */}
                            <div className='relative w-full max-sm:w-[80%]'>
                                <input type="text" id='state' name='state' value={value['state']} onFocus={stateinputclickhandle} onBlur={() => setTimeout(() => setstatesbool(false), 250)} onChange={inputhandle} placeholder='' className='font-semibold peer bg-transparent input_placeholder focus:border-blue-500 focus:shadow-[0_3px_0_0_rgb(59,130,246)] pt-2 px-3 shadow-[0_2px_0_0_#0000004b] capitalize w-full outline-none mb-[2px]' />
                                <label htmlFor='state' className='position_move'>state</label>
                                <br />
                                <span className={`text-sm text-red-500 ml-3`}>{error['state']}</span>
                                {
                                    statesbool ? (
                                        <div className='absolute z-10 bg-white top-8  left-0 border-[1px] shadow-lg border-[#0000003a] mt-3 w-full py-3 rounded-xl max-h-[50vh] max-sm:max-h-[30vh] overflow-y-auto scroll_none'>
                                            {searchstates.length ? searchstates.map(({ name }) => (
                                                <h1 key={name} onClick={() => stateclickhandle(name)} className='text-center py-[2px] hover:bg-[#b9b7b79d]'>{name}</h1>
                                            )) : (
                                                <h1 className='text-center text-red-500'>{value['country'] ? 'no states...' : 'select country..'}</h1>
                                            )}
                                        </div>) : null}
                            </div>

                            {/* phone number feild */}
                            <div className='relative w-full max-sm:w-[80%] max-sm:justify-center flex mb-6'>
                                <div className='w-[37%]'>
                                    <input type="search" placeholder='code' value={searchcodequery} onChange={countrycodeinputclickhandle} onFocus={() => setmobilebool(true)} onBlur={() => setTimeout(() => setmobilebool(false), 250)} className='font-semibold bg-transparent input_placeholder focus:border-blue-500 focus:shadow-[0_3px_0_0_rgb(59,130,246)] py-1 px-3 shadow-[0_2px_0_0_#0000004b] border-r-[1px] border-r-[#0000004b] capitalize w-full outline-none mb-[2px]' />
                                </div>
                                <div className='absolute top-9 left-3 text-sm text-red-500'>{error['mobile']}</div>
                                {
                                    mobilebool ? (
                                        <div className='absolute z-10 bg-white top-8  left-0 border-[1px] shadow-lg border-[#0000003a] mt-3 w-[80%] max-sm:w-[90%] py-3 rounded-xl max-h-[37vh] max-sm:h-[20vh] overflow-y-auto scroll_none'>
                                            {searchmobilecodes.length ? searchmobilecodes.map(({ name, code }) => (
                                                <h1 key={name} onClick={() => countrycodeclickhandle(code)} className='flex gap-4 p-4 py-[2px] text-sm hover:bg-[#b9b7b79d]'>
                                                    <span>{name}</span>
                                                    <span>{code}</span>
                                                </h1>
                                            )) : (
                                                <h1 className='text-center text-red-500'>no country code...</h1>
                                            )}
                                        </div>) : null}

                                <div className='w-full'>
                                    <input type='text' id='mobile' name='mobile' value={value['mobile']} onChange={inputhandle} placeholder='' className='font-semibold peer bg-transparent phone_input_placeholder focus:border-blue-500 focus:shadow-[0_3px_0_0_rgb(59,130,246)] pt-2 px-3 shadow-[0_2px_0_0_#0000004b] capitalize w-full outline-none mb-[2px]' />
                                    <label htmlFor='mobile' className='absolute -z-0 top-1 left-[30%] max-sm:left-[40%] peer-focus:-top-4 peer-focus:text-[13px] duration-300 capitalize text-gray-500'>mobile</label>
                                </div>
                                <br />
                            </div>

                        </div>

                    </div>
                    <span className={`text-green-700 ${successbool ? 'visible' :'invisible' } mt-5 font-semibold flex justify-center`}>user is added successfully...</span>
                    <div className=' mt-5 w-full flex gap-10 justify-center items-center'>
                        <div className='flex gap-14 font-bold text-lg text-white'>
                            <button type='reset' onClick={resetclickhandle} className='px-10 rounded-lg py-1 bg-gray-400'>reset</button>  
                            <button type='submit' className={`w-32 flex justify-center items-center py-1 rounded-lg ${updatebool ? 'bg-green-400' : 'bg-blue-500' }`}>{loading ? <div className='w-5 h-5 rounded-full border-2 border-b-0 animate-spin border-white'></div> : <span>{updatebool ? 'update':'submit'}</span>}</button>
                        </div>
                    </div>
                </form>

            </div>
        </>

    )
}

export default Mainform


