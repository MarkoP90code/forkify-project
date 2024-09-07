
import View from "./View.js";
import previewView from "./previewView.js";
import icons from "url:../../img/icons.svg";

class BookmarksView extends View {
    _parentElement = document.querySelector(".bookmarks__list");
    _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it ;)";
    _message = "";


    addHandlerRender(handler) {                         //Ovo smo dodali da renderujemo bookmarks odma. U controller.js ovde bookmarksView.update(model.state.bookmarks) pokusa da se radi update ali izbaci error jer kad uporedjuje newEl i curEl nema jos curEl.
        window.addEventListener("load", handler);
    }

    _generateMarkup () {                //_data se prosledjuje od render methode koja se nalazi u View.js sto je parent ove klase. A u render prosledjujem data od loadSearchResults koji se nalazi unutar model.js.
        // console.log(this._data);
        return this._data.map((bookmark) => previewView.render(bookmark, false)).join("");
    }

}

export default new BookmarksView();


// Kad pozovem BookmarksView.render() prosledjujem array sa bokmarkovima. Onda render uzima te podatke i 
// ubacuje ih u _data. Onda se poziva ovaj method generalMarkup iz bookmarksView. Unutar ovog metoda pozivamo 
// previewView.render() koji ce da da markup samo za jedan bookmark i pokusace da ga renderuje
// A nama treb da se vrati string za sve bookmarke zajedno. Zato imamo u View zadato kod render methode
// ovo render = true. Meni se kod BookmarksView.render(), kad pozovem zadacu samo array sa bookmarkovima
// i tu je render po defaultu true. Ali unutar te motode se poziva previewView.render i tu smo zadali false 
// da ne bi render pokusuao da radi insertAdjacentHTML. I onda kad zavrsi radi se join i sve to je onda markup.

// Ovde je valjda previewView kao child view od bookmarksView i resultsView.
// Morao sam da importujem i View i previewView da bi previewView radio.