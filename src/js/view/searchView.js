
class SearchView {
    _parentElement = document.querySelector(".search");         //Ovo je form element u html-u.

    getQuery() {
        const query = this._parentElement.querySelector(".search__field").value;
        this._clearInput();
        return query;
    }

    _clearInput() {
        this._parentElement.querySelector(".search__field").value = "";
    }

    addHandlerSearch (handler) {            //Ovo addHandlerSearch je puglisher (ima u wordu), a controlSearchResults subscriber.
        this._parentElement.addEventListener("submit", function(e) {         //submit je event izgleda koji radi i kad kliknemo na submit(button) i kad stisnemo enter.
            e.preventDefault();
            handler();
            // this.querySelector(".search__field").value = "";        //Ovo je moje resenje bilo kako da obrisemo input nakon sto stisnemo enter. Ovde je this ono na sta smo prikacili eventListener, a ne objekat. Zato ovako izgleda. Oni su uradili sa ovim cleatInput i onda to ubacili u getQuery.
        })         
    }
};

export default new SearchView();