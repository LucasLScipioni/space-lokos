import type { NextComponentType, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { ChangeEvent, useCallback, useState } from 'react'
import styles from '../../styles/Home.module.css'

const Leaderboard: NextPage = () => {

  return (
    <div className={styles.container}>

      <main className={styles.containerLeaderboard}>
     
        <span>Already have an account?
        <Link href='/'>
          <span className={styles.hyperLink}>
            Login
          </span>
        </Link>
        </span>
        <span>
        <Link href='/signup'>
          <span className={styles.hyperLink}>
           or Sign up now!
          </span>
        </Link>
        </span>
            <h1 className={styles.gameNameTitle}>Leaderboard</h1>
        <div className={styles.leaderboard}>
          <LeaderBoardRow player={{name:'Andrézin', country:'brazil'}} score={1000}/>
        </div>
      </main>

    </div>
  )
}
const LeaderBoardRow: React.FC<{player:any,score:number}> = ({player,score}) => {
    return (
       
        <div className={styles.leaderboardRow}>
                <div className={styles.row}>
                     <span  className={styles.leaderboardUsername}>
                       {player.name}
                     </span>
                     <Image alt=''  src={`https://countryflagsapi.com/png/${player.country}`} objectFit={'contain'} layout='intrinsic' width={20} height={20} />
                </div>  
                <span>
                    {score}
                </span>
            </div>
        
    )
}
export default Leaderboard
