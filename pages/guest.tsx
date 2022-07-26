import type { NextPage } from 'next'

import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChangeEvent, useCallback, useState } from 'react'
import Button from '../components/button'
import { api } from '../Services/api'
import styles from '../styles/Home.module.css'

const Guest: NextPage = () => {
  const [guestName, setGuestName] = useState<string>('')
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const route = useRouter();
  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setGuestName(e.target.value)
  }
    , [])
  const onSubmitHandler = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault()
    if (guestName.length > 0) {
      setErrors([])
      setLoading(true)
      api.get('/auth/guest', {
        params: {
          username: guestName
        }
      }).then(res => {
        setLoading(false)
        route.replace('/game')
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('username', res.data.username)
      }).catch(err => {
        setLoading(false)
      })
    }
    else {

      setErrors(['Please enter a guest name'])
    }
  }
    , [guestName, route])
  return (
    <div className={styles.container}>


      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Welcome to <span className={styles.gameNameTitle}>{"SPACE LOKO'S"}</span>
          </h1>
        </div>
        <div className={styles.inputContainer}>
          <input placeholder='Guest Name' value={guestName} onChange={onChangeHandler} />
        </div>
        <Button
          onClick={onSubmitHandler}
          text='Login'
          loading={loading}
        />
        {errors.length > 0 && <div className={styles.errorContainer}>
          {errors.sort((a, b) => (a.length - b.length)).map((error, index) => {
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
