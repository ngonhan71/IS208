import { memo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { BsSearch } from "react-icons/bs";
// import { IoClose } from "react-icons/io5";
// import { Spinner } from "react-bootstrap";

import styles from "./Header.module.css"

function Search() {

  const navigate = useNavigate()

  const [key, setKey] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [searchResult, setSearchResult] = useState([])
//   const [showResult, setShowResult] = useState(false)

  const handleSubmitSearch = (e) => {
    e.preventDefault()
    if (!key.trim()) {
      return
    }
    navigate({
      pathname: '/tim-kiem',
      search: `key=${key}`
    })
   
  }

  return (
    <form onSubmit={handleSubmitSearch}>
      <div className={styles.searchWrapper}>
        <button className={`bookstore-btn ${styles.searchBtn}`}>
          <BsSearch />
        </button>
        {/* <button type="button" onClick={() => setKey("")} className={`bookstore-btn ${styles.resetKey} ${key && !loading ? styles.active : ""}`}>
          <IoClose />
        </button> */}
        {/* {loading && <div className={styles.loading}>
          <Spinner animation="border" variant="success" size="sm" />
        </div>} */}
        <div className="form-group">
          <input
            type="text"
            className={`form-control ${styles.formControl}`}
            placeholder="Tìm kiếm tên phim..."
            value={key}
            onChange={(e) => setKey(e.target.value)}
            // onBlur={() => setShowResult(false)}
            // onFocus={() => setShowResult(true && searchResult.length > 0)}
          />
        </div>
      </div>
    </form>
  );
}

export default memo(Search);
