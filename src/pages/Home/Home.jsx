import {useEffect, useState} from "react";
import GameCard from "../../components/GameCard/GameCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import GameFilters from "../../components/GameFilters/GameFilters";
import styles from "./Home.module.css";

const Home = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [genre, setGenre] = useState("");
    const [platform, setPlatform] = useState("");
    const [ordering, setOrdering] = useState("-added");
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
    const pageSize = 20;
    const totalPages = Math.ceil(totalCount / pageSize);

    const fetchGames = async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams({
                key: API_KEY,
                ordering: ordering,
                page: page,
                page_size: pageSize
            });

            if (search) params.append('search', search);
            if (genre) params.append('genres', genre);
            if (platform) params.append('platforms', platform);

            const API = `https://api.rawg.io/api/games?${params.toString()}`;

            console.log('Fetching from:', API);
            const res = await fetch(API);
            const data = await res.json();

            if (data.error) {
                throw new Error(data.error);
            }

            if (!data.results) {
                throw new Error('No results found');
            }

            setGames(data.results);
            setTotalCount(data.count || 0);
            setLoading(false);
        } catch (error) {
            console.error('API Error:', error);
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
    }, [search, genre, platform, ordering]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchGames();
        }, 500);

        return () => clearTimeout(timer);
    }, [search, genre, platform, ordering, page]);

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
                    Error! Could not connect to API
                </h1>
            </div>
        );
    }

    return (
        <div className={styles.home}>
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>Découvrez nos jeux vidéos</h1>
                <p className={styles.pageSubtitle}>
                    Les jeux les plus populaires du moment
                </p>


                <SearchBar search={search} setSearch={setSearch} />

                <GameFilters
                    genre={genre}
                    setGenre={setGenre}
                    platform={platform}
                    setPlatform={setPlatform}
                    ordering={ordering}
                    setOrdering={setOrdering}
                />

                {games.length === 0 && search && !loading && (
                    <div className={styles.noResults}>
                        <p>Aucun jeu ne correspond à votre recherche : "{search}"</p>
                    </div>
                )}

                <div className={styles.gamesGrid}>
                    {games.map((game) => (
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            onClick={() => setPage(p => p - 1)}
                            disabled={page === 1}
                            className={styles.paginationButton}
                        >
                            Previous
                        </button>
                        <span className={styles.pageInfo}>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= totalPages}
                            className={styles.paginationButton}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
export default Home;