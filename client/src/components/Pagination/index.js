import { Pagination as PaginationBootStrap } from "react-bootstrap"
function Pagination({totalPage, currentPage, onChangePage}) {

    const items = []

    if (currentPage > 1) {
        items.push(<PaginationBootStrap.Prev key="prev" onClick={() => onChangePage(currentPage -1)} />)
    }
    for (let page = 1; page <= totalPage; page++) {
        items.push(
            <PaginationBootStrap.Item onClick={() => onChangePage(page)} key={page} active={page === currentPage}>
                {page}
            </PaginationBootStrap.Item>,
        )
    }

    if (currentPage < totalPage) {
        items.push(<PaginationBootStrap.Next key="next" onClick={() => onChangePage(currentPage + 1)} />)
    }
  
    return (
        <PaginationBootStrap>{items}</PaginationBootStrap>
    )
}

export default Pagination