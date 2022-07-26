import styles from '../styles/Leaderboard.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api } from '../Services/api'

interface leaderboardItem {
    username: string;
    country: string;
    score: number;
}

const Leaderboard: React.FC<{
    setModal: (modal: boolean) => void
    modal: boolean
}> = ({ setModal, modal }) => {
    const [leaderboard, setLeaderboard] = useState<leaderboardItem[]>([])
    api.get<leaderboardItem[]>('/leaderboard').then(
        res => {
            setLeaderboard(res.data)
        }
    )

    if (modal)
        return (
            <div className={styles.container}>
                <div className={styles.modal}>
                    <span onClick={() => setModal(false)} className={styles.close} >X</span>
                    <main className={styles.containerLeaderboard}>
                        <h1 className={styles.gameNameTitle}>Leaderboard</h1>
                        <div className={styles.leaderboard}>
                            {leaderboard.length > 0 ? leaderboard.map((item, index) =>
                                <LeaderBoardRow key={index} player={item} score={item.score} />
                            ) :
                                <div className={styles.noLeaderboard}>
                                    <h1>No Leaderboard yet</h1>
                                </div>
                            }
                        </div>
                    </main>
                    <button onClick={() => window.restartGame()}> Play again </button>
                </div>
            </div>
        )
    return null
}
const LeaderBoardRow: React.FC<{ player: any, score: number }> = ({ player, score }) => {
    return (

        <div className={styles.leaderboardRow}>
            <div className={styles.row}>
                <span className={styles.leaderboardUsername}>
                    {player.username}
                </span>
                <Image alt='' src={`https://countryflagsapi.com/png/${player.country}`} objectFit={'contain'} layout='intrinsic' width={20} height={20} />
            </div>
            <span>
                {score}
            </span>
        </div>

    )
}
export default Leaderboard
