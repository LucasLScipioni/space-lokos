import type {  NextPage } from 'next'
import { useState } from 'react'
import Leaderboard from '../../components/leaderboard'
import styles from '../../styles/Game.module.css'

const Game: NextPage = () => {

  const [modal,setModal] = useState(false)
  return (
    <div className={styles.container}>
      <Leaderboard setModal={setModal} modal={modal}/>
      <div className={styles.gameHeader}>
        <div style={{width:150}}></div>
        <h1 className={styles.title}><span className={styles.gameNameTitle}>{"SPACE LOKO'S"}</span></h1>
      
        <div className={styles.buttonContainer}>
          <button  className={styles.button}  onClick={()=>{ setModal(true)}}>
            Show Leaderboard
          </button>
        </div>
      </div>
    </div>
  )
}
export default Game
