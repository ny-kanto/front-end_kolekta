/* eslint-disable react/prop-types */
import 'bootstrap/dist/css/bootstrap.min.css';

function Pagination({ noPage, totalPages, onPageChange }) {
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    onPageChange(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5;
    let startPage = Math.max(1, noPage - 2);
    let endPage = Math.min(totalPages, noPage + 2);

    if (totalPages > maxPageNumbersToShow) {
      if (noPage <= 3) {
        endPage = maxPageNumbersToShow;
      } else if (noPage >= totalPages - 2) {
        startPage = totalPages - (maxPageNumbersToShow - 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li key={i} className={`page-item ${i === noPage ? "active" : ""}`}>
          <button
            className={`page-link ${i === noPage ? "bg-success text-white border-success" : ""}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        </li>
      );
    }

    if (startPage > 1) {
      pageNumbers.unshift(
        <li key="start-ellipsis" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
      pageNumbers.unshift(
        <li key={1} className={`page-item ${noPage === 1 ? "active" : ""}`}>
          <button
            className={`page-link ${noPage === 1 ? "bg-success text-white border-success" : ""}`}
            onClick={() => handlePageChange(1)}
          >
            1
          </button>
        </li>
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(
        <li key="end-ellipsis" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
      pageNumbers.push(
        <li key={totalPages} className={`page-item ${noPage === totalPages ? "active" : ""}`}>
          <button
            className={`page-link ${noPage === totalPages ? "bg-success text-white border-success" : ""}`}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        </li>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="pagination-wrap d-flex justify-content-center align-items-center gap-2">
      {/* Bouton Précédent */}
      <button
        className={`btn btn-sm ${noPage === 1 ? "btn-secondary disabled" : "btn-success"}`}
        onClick={() => handlePageChange(noPage - 1)}
        disabled={noPage === 1}
      >
        <i className="bi bi-arrow-left"></i> Précédent
      </button>

      {/* Numéros de page */}
      <ul className="pagination mb-0">
        {renderPageNumbers()}
      </ul>

      {/* Bouton Suivant */}
      <button
        className={`btn btn-sm ${noPage === totalPages ? "btn-secondary disabled" : "btn-success"}`}
        onClick={() => handlePageChange(noPage + 1)}
        disabled={noPage === totalPages}
      >
        Suivant <i className="bi bi-arrow-right"></i>
      </button>
    </div>
  );
}

export default Pagination;
