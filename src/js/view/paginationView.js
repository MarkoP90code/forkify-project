import View from "./View.js";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
    _parentElement = document.querySelector(".pagination");

    addHandlerClick(handler) {
        this._parentElement.addEventListener("click", function(e) {     //Ovde radimo event delegation.
            const btn = e.target.closest(".btn--inline");       //Da sam stavio samo e.target onda bi recimo ako kliknemo na svg to dodelio u btn. Ili ako cliknemo na icon to bi bobelio btn-u. Ovako hvata najblizi parent element od svig tih.
            if (!btn) return;       //Ovo je u slucaju da kliknem recimo na prazan prostor unutar parent elementa onda nece uhvatiti nista. vraca valjda null.

            const goToPage = +btn.dataset.goto;      //Ovde uzimam data koje je u tom dugmetu.
            
            handler(goToPage);      //Ovo je funkcija sa kojom smo pozvali addHandlerClick.
        })
    }

    _generateMarkup() {                     //Ovde _data dobijamo iza View.js kad pozovemo render sa data. onda to data postane _data.
        const curPage = this._data.page;        //current page.
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        
        // Page 1 and there are other pages
        if (curPage === 1 && numPages > 1) {
            return `
                <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `
        }

        // Last page
        if (curPage === numPages && numPages > 1) {
            return `
                <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                <span>Page ${curPage - 1}</span>
                </button>
            `
        }
        
        // Other page
        if (curPage < numPages) {
            return `
                <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                <span>Page ${curPage - 1}</span>
                </button>
                <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `
        }
        // Page 1 and there are NOT other pages
        return ``
    }
}

export default new PaginationView();