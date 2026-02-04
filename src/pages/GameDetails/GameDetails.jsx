import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import styles from "./GameDetails.module.css";

const GameDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [screenshots, setScreenshots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                setLoading(true);

                const gameRes = await fetch(
                    `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
                );
                const gameData = await gameRes.json();

                if (gameData.error) {
                    throw new Error(gameData.error);
                }

                setGame(gameData);

                const screenshotsRes = await fetch(
                    `https://api.rawg.io/api/games/${id}/screenshots?key=${API_KEY}`
                );
                const screenshotsData = await screenshotsRes.json();
                setScreenshots(screenshotsData.results || []);

                setLoading(false);
            } catch (error) {
                console.error('API Error:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchGameDetails();
    }, [id, API_KEY]);

    if (loading) {
        return (
            <div className={styles.loading}>
                <span>Loading...</span>
            </div>
        );
    }

    if (error || !game) {
        return (
            <div className={styles.error}>
                <h1 className={styles.errorMsg}>
                    Error! Could not load game details
                </h1>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
                ← Retour
            </button>

            <div className={styles.gameHeader}>
                <img
                    src={game.background_image}
                    alt={game.name}
                    className={styles.headerImage}
                />
                <div className={styles.headerOverlay}>
                    <h1 className={styles.title}>{game.name}</h1>
                    <div className={styles.rating}>
                        <span className={styles.star}>⭐</span>
                        <span>{game.rating} / 5</span>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.mainInfo}>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoCard}>
                            <span className={styles.label}>Date de sortie</span>
                            <p className={styles.value}>{game.released}</p>
                        </div>
                        <div className={styles.infoCard}>
                            <span className={styles.label}>METACRITIC</span>
                            <p className={styles.value}>{game.metacritic || 'N/A'}</p>
                        </div>
                        <div className={styles.infoCard}>
                            <span className={styles.label}>Temps de jeu</span>
                            <p className={styles.value}>{game.playtime} heures</p>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Genres</h2>
                        <div className={styles.tags}>
                            {game.genres?.map((genre) => (
                                <span key={genre.id} className={styles.tag}>
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Plateformes</h2>
                        <div className={styles.tags}>
                            {game.platforms?.map((platform) => (
                                <span key={platform.platform.id} className={styles.tag}>
                                    {platform.platform.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Description</h2>
                        <div
                            className={styles.description}
                            dangerouslySetInnerHTML={{ __html: game.description }}
                        />
                    </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Développeurs</h2>
                            <div className={styles.tags}>
                                {game.developers.map((dev) => (
                                    <span key={dev.id} className={styles.tag}>
                                        {dev.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Éditeurs</h2>
                            <div className={styles.tags}>
                                {game.publishers.map((pub) => (
                                    <span key={pub.id} className={styles.tag}>
                                        {pub.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Galerie</h2>
                            <div className={styles.gallery}>
                                {screenshots.map((screenshot) => (
                                    <img
                                        key={screenshot.id}
                                        src={screenshot.image}
                                        alt={`Screenshot ${screenshot.id}`}
                                        className={styles.screenshot}
                                    />
                                ))}
                            </div>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default GameDetails;
