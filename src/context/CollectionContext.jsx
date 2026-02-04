import { createContext, useContext, useState, useEffect } from "react";

const CollectionContext = createContext();

export const CollectionProvider = ({ children }) => {
    const [collection, setCollection] = useState(() => {
        const saved = localStorage.getItem("gameCollection");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("gameCollection", JSON.stringify(collection));
    }, [collection]);

    const addToCollection = (game) => {
        setCollection((prev) => {
            if (prev.some((g) => g.id === game.id)) {
                return prev;
            }

            const collectionItem = {
                ...game,
                status: "to_play",
                addedAt: new Date().toISOString(),
                playtime: game.playtime || 0
            };

            return [...prev, collectionItem];
        });
    };

    const removeFromCollection = (gameId) => {
        setCollection((prev) => prev.filter((g) => g.id !== gameId));
    };

    const updateGameStatus = (gameId, status) => {
        setCollection((prev) =>
            prev.map((g) =>
                g.id === gameId ? { ...g, status } : g
            )
        );
    };

    const updatePlaytime = (gameId, playtime) => {
        setCollection((prev) =>
            prev.map((g) =>
                g.id === gameId ? { ...g, playtime } : g
            )
        );
    };

    const isInCollection = (gameId) => {
        return collection.some((g) => g.id === gameId);
    };

    const getGameFromCollection = (gameId) => {
        return collection.find((g) => g.id === gameId);
    };

    return (
        <CollectionContext.Provider
            value={{
                collection,
                addToCollection,
                removeFromCollection,
                updateGameStatus,
                updatePlaytime,
                isInCollection,
                getGameFromCollection
            }}
        >
            {children}
        </CollectionContext.Provider>
    );
};

export const useCollection = () => {
    const context = useContext(CollectionContext);
    if (!context) {
        throw new Error("Erreur");
    }
    return context;
};
