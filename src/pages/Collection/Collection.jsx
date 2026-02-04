import { useState } from "react";
import { useCollection } from "../../context/CollectionContext";
import GameCard from "../../components/GameCard/GameCard";
import styles from "./Collection.module.css";

const Collection = () => {
    const { collection, updateGameStatus, removeFromCollection } = useCollection();
    const [filterStatus, setFilterStatus] = useState("all");

    const statusLabels = {
        to_play: "À jouer",
        playing: "En cours",
        completed: "Terminé",
        abandoned: "Abandonné"
    };


    const handleStatusChange = (gameId, newStatus) => {
        updateGameStatus(gameId, newStatus);
    };

    const handleRemove = (gameId) => {
        if (window.confirm("Êtes-vous sûr de vouloir retirer ce jeu de votre collection ?")) {
            removeFromCollection(gameId);
        }
    };

    const filteredGames = filterStatus === "all"
        ? collection
        : collection.filter(game => game.status === filterStatus);

    const totalPlaytime = collection.reduce((total, game) => total + (game.playtime || 0), 0);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Ma collection</h1>
            <div className={styles.stats}>
                <p className={styles.subtitle}>
                    {collection.length > 0
                        ? `${collection.length} jeu${collection.length > 1 ? "x" : ""}`
                        : "Vos jeux favoris apparaîtront ici"}
                </p>
                {collection.length > 0 && (
                    <p className={styles.subtitle}>
                        {totalPlaytime} heure{totalPlaytime > 1 ? "s" : ""}
                    </p>
                )}
            </div>

            {collection.length > 0 && (
                <>
                    <div className={styles.filters}>
                        <button
                            onClick={() => setFilterStatus("all")}
                            className={`${styles.filterButton} ${filterStatus === "all" ? styles.active : ""}`}
                        >
                            Tous ({collection.length})
                        </button>
                        <button
                            onClick={() => setFilterStatus("to_play")}
                            className={`${styles.filterButton} ${filterStatus === "to_play" ? styles.active : ""}`}
                        >
                            À jouer ({collection.filter(g => g.status === "to_play").length})
                        </button>
                        <button
                            onClick={() => setFilterStatus("playing")}
                            className={`${styles.filterButton} ${filterStatus === "playing" ? styles.active : ""}`}
                        >
                            En cours ({collection.filter(g => g.status === "playing").length})
                        </button>
                        <button
                            onClick={() => setFilterStatus("completed")}
                            className={`${styles.filterButton} ${filterStatus === "completed" ? styles.active : ""}`}
                        >
                            Terminés ({collection.filter(g => g.status === "completed").length})
                        </button>
                        <button
                            onClick={() => setFilterStatus("abandoned")}
                            className={`${styles.filterButton} ${filterStatus === "abandoned" ? styles.active : ""}`}
                        >
                            Abandonnés ({collection.filter(g => g.status === "abandoned").length})
                        </button>
                    </div>

                    {filteredGames.length > 0 ? (
                        <div className={styles.gamesGrid}>
                            {filteredGames.map((game) => (
                                <div key={game.id} className={styles.gameWrapper}>
                                    <div className={styles.gameActions}>
                                        <select
                                            value={game.status}
                                            onChange={(e) => handleStatusChange(game.id, e.target.value)}
                                            className={styles.statusSelect}
                                        >
                                            <option value="to_play">{statusLabels.to_play}</option>
                                            <option value="playing">{statusLabels.playing}</option>
                                            <option value="completed">{statusLabels.completed}</option>
                                            <option value="abandoned">{statusLabels.abandoned}</option>
                                        </select>
                                        <button
                                            onClick={() => handleRemove(game.id)}
                                            className={styles.removeButton}
                                            title="Retirer de la collection"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <GameCard game={game} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.noResults}>Aucun jeu dans cette catégorie</p>
                    )}
                </>
            )}
        </div>
    );
};

export default Collection;
