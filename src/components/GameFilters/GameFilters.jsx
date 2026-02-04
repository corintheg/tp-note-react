import { useEffect, useState } from "react";
import styles from "./GameFilters.module.css";

const GameFilters = ({ genre, setGenre, platform, setPlatform, ordering, setOrdering }) => {
    const [genres, setGenres] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await fetch(`https://api.rawg.io/api/genres?key=${API_KEY}`);
                const data = await res.json();
                setGenres(data.results || []);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        const fetchPlatforms = async () => {
            try {
                const res = await fetch(`https://api.rawg.io/api/platforms?key=${API_KEY}`);
                const data = await res.json();
                setPlatforms(data.results || []);
            } catch (error) {
                console.error('Error fetching platforms:', error);
            }
        };

        fetchGenres();
        fetchPlatforms();
    }, [API_KEY]);

    return (
        <div className={styles.filters}>
            <div className={styles.filterGroup}>
                <label htmlFor="genre" className={styles.label}>Genre</label>
                <select
                    id="genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className={styles.select}
                >
                    <option value="">Tous les genres</option>
                    {genres.map((g) => (
                        <option key={g.id} value={g.id}>
                            {g.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.filterGroup}>
                <label htmlFor="platform" className={styles.label}>Plateforme</label>
                <select
                    id="platform"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className={styles.select}
                >
                    <option value="">Toutes les plateformes</option>
                    {platforms.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.filterGroup}>
                <label htmlFor="ordering" className={styles.label}>Trier par</label>
                <select
                    id="ordering"
                    value={ordering}
                    onChange={(e) => setOrdering(e.target.value)}
                    className={styles.select}
                >
                    <option value="-added">Popularité</option>
                    <option value="-rating">Note</option>
                    <option value="-released">Date de sortie</option>
                    <option value="name">Nom (A-Z)</option>
                </select>
            </div>
        </div>
    );
};

export default GameFilters;
