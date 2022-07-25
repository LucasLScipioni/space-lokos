import type { NextPage } from 'next'

import Image from 'next/image'
import Link from 'next/link'
import { ChangeEvent, useCallback, useState } from 'react'
import styles from '../styles/Home.module.css'

const Guest: NextPage = () => {
  const [guestName, setGuestName] = useState<string>('')
  const [errors, setErrors] = useState<string[]>([])
  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setGuestName(e.target.value)
  }
  , [])
  const onSubmitHandler = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    
    e.preventDefault()
    if (guestName.length > 0) {
      setErrors([])
      window.location.href = `/game`
    }
    else {
      setErrors(['Please enter a guest name'])
    }
  }
  , [guestName])
  return (
    <div className={styles.container}>
      

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <span className={styles.gameNameTitle}>{"SPACE LOKO'S"}</span>
        </h1>
        <div className={styles.inputContainer}>
          <input placeholder='Guest Name' value={guestName} onChange={onChangeHandler}/>
        </div>
        <button onClick={onSubmitHandler}>
          Login
        </button>
        {errors.length > 0 && <div className={styles.errorContainer}>
          {errors.sort((a,b)=> (a.length - b.length)).map((error,index)=>{
            return <div className={styles.errorText} key={index}>{error}</div>
          }
          )}
        </div>}
        <span>Already have an account?
        <Link href='/'>
          <span className={styles.hyperLink}>
            Login now!
          </span>
        </Link>
        </span>
        <span>
        <Link href='/signup'>
          <span className={styles.hyperLink}>
            Sign up now!
          </span>
        </Link>
        </span>
     
      </main>

    </div>
  )
}

export default Guest
