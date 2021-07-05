import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    const currPage = this._data.page;
    let markup = '';

    //single page
    if (numPages === 1) return markup;

    //if not last page
    if (currPage !== 1) {
      markup += `
          <button data-goto="${
            currPage - 1
          }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
          </button>
          `;
    }

    //if not first page
    if (currPage !== numPages) {
      markup += `
            <button data-goto="${
              currPage + 1
            }" class="btn--inline pagination__btn--next">
                <span>Page ${currPage + 1}</span>
             <svg class="search__icon">
                  <use href="${icons}#icon-arrow-right"></use>
             </svg>
          </button>
            `;
    }

    return markup;
  }
}

export default new PaginationView();

{
  /* <button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-left"></use>
            </svg>
            <span>Page 1</span>
          </button>
          <button class="btn--inline pagination__btn--next">
            <span>Page 3</span>
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
          </button> */
}
