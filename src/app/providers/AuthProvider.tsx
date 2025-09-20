import { useAppDispatch } from '@/store/hooks'
import { login } from '@/store/slices/userSlice';
import React, { useEffect } from 'react'

function AuthProvider( {children}  : {children: React.ReactNode} ) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      dispatch(login(JSON.parse(user)))
    }
  }, [])

  return <>{children}</>
}

export default AuthProvider
