import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { api } from '../Services/api'
import styles from '../styles/Home.module.css'

interface accountInfo {
  username: string;
  password: string;
  confirmPassword: string;
  country: string;

}

const SignUp: NextPage = () => {
  const [errors, setErrors] = useState<string[]>([])
  const [countries, setCountries] = useState<string[]>([])
  const [accountInfo, setAccountInfo] = useState<accountInfo>({
    username: '',
    password: '',
    confirmPassword: '',
    country: ''
  })
  const route = useRouter()
  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>, key: string) => {
    setAccountInfo(s => ({ ...s, [key]: e.target.value }));
  }, []);

  useEffect(() => {
    api.get('/countries').then(res => {
      setCountries(res.data.map(e => e.name))
    }
    )
  }, [])

  const validateAccountInfo = useCallback((): boolean => {
    const errors: string[] = [];
    if (accountInfo.username.length < 5) {
      errors.push('Username must be at least 5 characters long')
    }
    if (accountInfo.password.length < 4) {
      errors.push('Password must be at least 4 characters long')
    }
    if (accountInfo.password !== accountInfo.confirmPassword) {
      errors.push('Passwords do not match')
    }
    if (accountInfo.country === '') {
      errors.push('Please select a country')
    }

    setErrors(errors);

    if (errors.length === 0) {
      return true;
    }
    return false
  }
    , [accountInfo])
  const onSubmitHandler = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (validateAccountInfo()) {
      api.post('/auth', accountInfo).then(res => {
        route.replace('/game')
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('username', res.data.username)
      }
      ).catch(err => {
        setErrors([err.response?.data?.message] || ['An error occurred'])
      })

    }
  }
    , [accountInfo, route, validateAccountInfo]);

  return (
    <div className={styles.container}>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <span className={styles.gameNameTitle}>SPACE {"LOKO'S"}</span>
        </h1>
        <div className={styles.inputContainer}>
          <input placeholder='Username' onChange={(e) => { onChangeHandler(e, 'username') }} value={accountInfo.username} />
          <select onChange={(e) => { onChangeHandler(e, 'country') }} value={accountInfo.country}>
            <option value=''>Select Country</option>
            {countries.map((c, index) => {
              return <option key={index} value={c}>{c}</option>
            }
            )}
          </select>

          <input type='password' placeholder='Password' onChange={(e) => { onChangeHandler(e, 'password') }} value={accountInfo.password} />
          <input type='password' placeholder='Confirm Password' onChange={(e) => { onChangeHandler(e, 'confirmPassword') }} value={accountInfo.confirmPassword} />
        </div>
        {errors.length > 0 && <div className={styles.errorContainer}>
          {errors.sort((a, b) => (a.length - b.length)).map((error, index) => {
            return <div className={styles.errorText} key={index}>{error}</div>
          }
          )}
        </div>}
        <button onClick={onSubmitHandler}>
          Create
        </button>

        <span>Already have an account?
          <Link href='/'>
            <span className={styles.hyperLink}>
              Login now!
            </span>
          </Link>
        </span>
        <Link href='/guest'>
          <span className={styles.hyperLink}>Login as guest</span>
        </Link>

      </main>

    </div>
  )
}

export default SignUp
