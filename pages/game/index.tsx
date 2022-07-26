import type { NextPage } from 'next'
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react'
import Leaderboard from '../../components/leaderboard'
import styles from '../../styles/Game.module.css'

const PhaserGame = dynamic<{}>(
  () => import('../../components/game'),
  { ssr: false }
)

const Game: NextPage = () => {

  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    window.setModal = setModal
  }, []);
  return (
    <div className={styles.container}>
      <Leaderboard setModal={setModal} modal={modal} />
      <div className={styles.gameHeader}>
        <div style={{ width: 150 }}>
          <img src="https://blaze.com/static/media/logo.e9e3db40.svg"></img>
        </div>
        <h1 className={styles.title}><span className={styles.gameNameTitle}>{"SPACE LOKO'S"}</span></h1>

        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={() => { setModal(true) }}>
            Show Leaderboard
          </button>
        </div>
      </div>
      <div id="game-div" style={{ display: 'flex', width: '100%', justifyContent: 'center', height: 'calc(100% - 180px)' }} />
      {loading ? <PhaserGame /> : null}
    </div>
  )
}
export default Game