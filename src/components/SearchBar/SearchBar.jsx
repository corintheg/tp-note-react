import styles from "./SearchBar.module.css";

const SearchBar = ({ search, setSearch }) => {
    return (
        <div className={styles.searchBar}>
            <input
                type="text"
                placeholder="Rechercher un jeu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.input}
            />
        </div>
    );
};

export default SearchBar;
