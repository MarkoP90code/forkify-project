
import View from "./View.js";
import previewView from "./previewView.js";
import icons from "url:../../img/icons.svg";

class ResultsView extends View {
    _parentElement = document.querySelector(".results");
    _errorMessage = "No recipes found for your query! Please try again ;)";
    _message = "";

    _generateMarkup () {                //_data se prosledjuje od render methode koja se nalazi u View.js sto je parent ove klase. A u render prosledjujem data od loadSearchResults koji se nalazi unutar model.js.
        // console.log(this._data);
        return this._data.map((results) => previewView.render(results, false)).join("");
    }
}

export default new ResultsView();