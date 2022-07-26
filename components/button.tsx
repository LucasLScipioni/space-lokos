import { useCallback } from "react";
import ReactLoading from "react-loading";

const Button: React.FC<{
    text: string,
    loading: boolean
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}> = ({ text, loading, onClick }) => {


    const onClickHandler = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        if (!loading) {
            onClick(e)
        }
    }
        , [loading, onClick])

    return (
        <button onClick={onClickHandler} style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }} disabled={loading}>
            {loading ? <ReactLoading type={'bubbles'} color={'#fff'} height={25} width={25} /> : text}
        </button>
    )


}
export default Button;