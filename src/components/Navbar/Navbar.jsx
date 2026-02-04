import { Link, useLocation } from "react-router";
import { useCollection } from "../../context/CollectionContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
    const location = useLocation();
    const { collection } = useCollection();

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <h1 className={styles.logo}>GameVault</h1>
                <div className={styles.navLinks}>
                    <Link
                        to="/"
                        className={`${styles.navLink} ${location.pathname === "/" ? styles.active : ""}`}
                    >
                        Explorer
                    </Link>
                    <Link
                        to="/collection"
                        className={`${styles.navLink} ${location.pathname === "/collection" ? styles.active : ""}`}
                    >
                        Ma collection
                        {collection.length > 0 && (
                            <span className={styles.badge}>{collection.length}</span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
