import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { api } from '../Services/api'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const route = useRouter();
  const onSubmitHandler = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (username.length > 0 && password.length > 0) {
      setErrors([])
      api.get('/auth', { params: { username, password } })
        .then(res => {
          if (res.status === 200) {
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('username', res.data.username)
            route.replace('/game')
          } else {
            setErrors(['Invalid username or password'])
          }
        }
        )
        .catch(err => {
          setErrors(['Invalid username or password'])
        }
        )
    } else {
      setErrors(['Please enter a username and password'])
    }
  }
    , [username, password, route])
  return (
    <div className={styles.container}>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Welcome to <span className={styles.gameNameTitle}>{"SPACE LOKO'S"}</span>
          </h1>
        </div>
        <div className={styles.inputContainer}>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
          <input value={password} type='password' onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
        </div>
        <button onClick={onSubmitHandler}>
          Login
        </button>
        {errors.length > 0 &&
          <div className={styles.errorContainer}>
            {errors.sort((a, b) => (a.length - b.length)).map((error, index) => {
              return <div className={styles.errorText} key={index}>{error}</div>
            }
            )}
          </div>}
        <Link href='/guest'>
          <span className={styles.hyperLink}>Login as guest</span>
        </Link>
        <span>{"Don't"} have an account?
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

export default Home
