import { Link } from "react-router";
import styles from "./GameCard.module.css";

const GameCard = ({ game }) => {
    return (
        <Link to={`/games/${game.id}`} className={styles.card}>
            <img
                src={game.background_image}
                alt={game.name}
                className={styles.image}
            />
            <div className={styles.content}>
                <h2 className={styles.title}>{game.name}</h2>

                <div className={styles.rating}>
                    <span className={styles.star}>⭐</span>
                    <span>{game.rating}</span>
                </div>

                <div className={styles.genres}>
                    {game.genres?.slice(0, 2).map((genre) => (
                        <span key={genre.id} className={styles.badge}>
                            {genre.name}
                        </span>
                    ))}
                </div>

                <div className={styles.info}>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Released</span>
                        <p className={styles.value}>{game.released}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Metacritic</span>
                        <p className={styles.value}>{game.metacritic || 'N/A'}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default GameCard;
