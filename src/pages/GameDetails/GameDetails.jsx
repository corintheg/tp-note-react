import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useCollection } from "../../context/CollectionContext";
import styles from "./GameDetails.module.css";

const GameDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCollection, removeFromCollection, isInCollection, getGameFromCollection, updateGameStatus } = useCollection();
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

    const inCollection = isInCollection(parseInt(id));
    const gameInCollection = getGameFromCollection(parseInt(id));

    const handleCollectionToggle = () => {
        if (inCollection) {
            removeFromCollection(parseInt(id));
        } else {
            addToCollection(game);
        }
    };

    const handleStatusChange = (e) => {
        updateGameStatus(parseInt(id), e.target.value);
    };

    const statusLabels = {
        to_play: "À jouer",
        playing: "En cours",
        completed: "Terminé",
        abandoned: "Abandonné"
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerButtons}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    ← Retour
                </button>
                <div className={styles.collectionActions}>
                    <button
                        onClick={handleCollectionToggle}
                        className={`${styles.collectionButton} ${inCollection ? styles.inCollection : ""}`}
                    >
                        {inCollection ? "✓ Dans ma collection" : "+ Ajouter à ma collection"}
                    </button>
                    {inCollection && (
                        <select
                            value={gameInCollection?.status || "to_play"}
                            onChange={handleStatusChange}
                            className={styles.statusSelect}
                        >
                            <option value="to_play">{statusLabels.to_play}</option>
                            <option value="playing">{statusLabels.playing}</option>
                            <option value="completed">{statusLabels.completed}</option>
                            <option value="abandoned">{statusLabels.abandoned}</option>
                        </select>
                    )}
                </div>
            </div>

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
                                    <Link
                                        key={dev.id}
                                        to={`/developers/${dev.id}`}
                                        className={styles.tagLink}
                                    >
                                        {dev.name}
                                    </Link>
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
