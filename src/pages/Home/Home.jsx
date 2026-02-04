import {useEffect, useState} from "react";
import GameCard from "../../components/GameCard/GameCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import styles from "./Home.module.css";

const Home = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

    const fetchGames = async (searchTerm = "") => {
        try {
            setLoading(true);
            const searchParam = searchTerm ? `&search=${searchTerm}` : "";
            const API = `https://api.rawg.io/api/games?key=${API_KEY}&ordering=-added${searchParam}`;

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
            setLoading(false);
        } catch (error) {
            console.error('API Error:', error);
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames();
    },[]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchGames(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

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
            </div>
        </div>
    )
}
export default Home;