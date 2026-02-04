import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import GameCard from "../../components/GameCard/GameCard";
import styles from "./DeveloperDetails.module.css";

const DeveloperDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [developer, setDeveloper] = useState(null);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

    useEffect(() => {
        const fetchDeveloperDetails = async () => {
            try {
                setLoading(true);

                const devRes = await fetch(
                    `https://api.rawg.io/api/developers/${id}?key=${API_KEY}`
                );
                const devData = await devRes.json();

                if (devData.error) {
                    throw new Error(devData.error);
                }

                setDeveloper(devData);

                const gamesRes = await fetch(
                    `https://api.rawg.io/api/games?key=${API_KEY}&developers=${id}`
                );
                const gamesData = await gamesRes.json();
                setGames(gamesData.results || []);

                setLoading(false);
            } catch (error) {
                console.error('API Error:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchDeveloperDetails();
    }, [id, API_KEY]);

    if (loading) {
        return (
            <div className={styles.loading}>
                <span>Loading...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.error}>
                <h1 className={styles.errorMsg}>
                    Error! Could not load developer details
                </h1>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
                ← Retour
            </button>

            <div className={styles.header}>
                {developer.image_background && (
                    <img
                        src={developer.image_background}
                        alt={developer.name}
                        className={styles.headerImage}
                    />
                )}
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>{developer.name}</h1>
                    <p className={styles.gamesCount}>
                        {developer.games_count} jeux développés
                    </p>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.mainInfo}>
                    {developer.description && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>À propos</h2>
                            <div
                                className={styles.description}
                                dangerouslySetInnerHTML={{ __html: developer.description }}
                            />
                        </div>
                    )}

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            Jeux développés ({games.length})
                        </h2>
                        <div className={styles.gamesGrid}>
                            {games.map((game) => (
                                <GameCard key={game.id} game={game} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeveloperDetails;
