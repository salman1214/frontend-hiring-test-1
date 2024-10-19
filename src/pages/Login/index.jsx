import React, { useState } from 'react'
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import Alert from '@mui/material/Alert';
import { userLogin } from '../../services';
import { useAuth } from '../../Context/AuthContext';
import Button from '../../components/Button';

const Login = () => {
  const [errorState, setErrorState] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth();

  const handleError = (msg) => {
    setErrorState(msg)
    setTimeout(() => {
      setErrorState("")
    }, 2000)
  }

  const handleSubmit = (data) => {
    setLoading(true)
    userLogin(data)
      .then(res => {
        // console.log(res.data)
        login(res.data)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => setLoading(false))
  }

  const validate = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (!email && !password) {
      handleError("Please fill all the fields")
      return;
    } else if (!email) {
      handleError("Please fill the email field")
      return;
    } else if (!password) {
      handleError("Please fill the password field")
      return;
    }
    handleSubmit({ username: email, password })
  }
  return (
    <div className='bg-[#f4eeed] h-[90vh] flex flex-col justify-center items-center'>

      <div className='bg-white w-96 p-4 shadow-sm'>
        <form onSubmit={validate}
          className='flex flex-col gap-3'>
          <label htmlFor="email"><span className='text-red-500'>* </span >User Name</label>
          <span className='relative' id='email'>
            <PersonOutlineTwoToneIcon sx={{ fontSize: 25 }} className='absolute left-2 top-2 text-gray-500' />
            <input name='email' type='email' placeholder='Email' className='w-full py-2 pl-9 border border-gray-300 mb-2' />
          </span>


          <label htmlFor="pass"><span className='text-red-500'>* </span >Password</label>
          <span className='relative' id='pass'>
            <LockTwoToneIcon sx={{ fontSize: 20 }} className='absolute left-2 top-2 text-gray-500' />
            <input name='password' type='password' placeholder='Password' className='w-full py-2 pl-9 border border-gray-300 mb-2' />
          </span>
          {/* <button disabled={loading} type='submit' className='w-24 bg-blue-500 text-white p-2 rounded-sm'>{loading ? "Loading..." : "Login"}</button> */}
          <Button disabled={loading} type='submit'>{loading ? "Loading..." : "Login"}</Button>
        </form>

        {errorState && <Alert severity="error" className='mt-2'>{errorState}.</Alert>}
      </div>

    </div>
  )
}

export default Login