import View from "./View.js";
import icons from "url:../../img/icons.svg";    //Ovde pisem url kranuvsi od recipeView.js. Zato prvo idem dva levela iznad pa onda ulazim u img. Ovo radi u parcel2. Ovo url treba za slike videe muziku... za ono sto nije programming file.

class addRecipeView extends View {
    _parentElement = document.querySelector(".upload");
    _message = "Recipe was succesfully uploaded :)"

    _window = document.querySelector(".add-recipe-window");
    _overlay = document.querySelector(".overlay");
    _btnOpen = document. querySelector(".nav__btn--add-recipe");
    _btnClose = document. querySelector(".btn--close-modal");

    constructor() {
        super();            //da bi mogao da koristim this. Posto je ovo child class.
        this._addHandlerShowWindow();           //Ovo smo uradili da vi ovaj method bio odma pozvan i znaci da je onda event listener zakacen.
        this._addHandlerHideWindow();           //Ovo smo uradili da vi ovaj method bio odma pozvan i znaci da je onda event listener zakacen.
        
    }

    toggleWindow() {        //da sam ova dva this-a ispod ubacio direkt ispod u callback funkciju ne bi radilo jer this je onda ovo za sta je zakacen event listener. Zto sam napravio metho pa sam ispod uradio bind.
        this._overlay.classList.toggle("hidden");
        this._window.classList.toggle("hidden");
    }   

    _addHandlerShowWindow() {
        this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));       //Ovde dajem do znanja da je ovo prvo this vezano za this u zagradi, a to je ova clasa AddRecipeView.
    }

    _addHandlerHideWindow() {
        this._btnClose.addEventListener("click", this.toggleWindow.bind(this));       //Ovde dajem do znanja da je ovo prvo this vezano za this u zagradi, a to je ova clasa AddRecipeView.
        this._overlay.addEventListener("click", this.toggleWindow.bind(this));          //Ovde sam morao i na overlay da zakacim event listener jer kad kliknem negde van modala sto je ovelay(ovo sto se bluruje) da i onda zatvori modal. A ne samo kad stisnem x.
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener("submit", function(e) {             //Mislim da ovde submit radi zato sto je btn unutar form elementa.
            e.preventDefault();
            const dataArr = [...new FormData(this)];                     //U FormData() konstruktor prosledjujem element koji je form. U ovom slucaju je this parentElement sto je gore zadato da je "upload" sto je form element u HTML-u. Koristimo spread jer ovo FormData returnuje objekat koji nam bas nije od koristi. Imacemo onda parove [field name, field value];
            const data = Object.fromEntries(dataArr);       //Ovo nam daje podatke na bolji nacin unutar objekta. Kao sto imamo u model.state.recipe. convertuje array etries-a i konvertuje u objekat.   Ovo je suprotno od Object.entries().
            handler(data);                  //Ovo data cemo hteti da uploadujemo n API. To uploadovanje je api call, a to radimo o model.js. Zato nam treba nacin da dostavimo ovo data u model. Napravicemo funkciju unutar controller koja ce biti handler ovog eventa.
        })
    }

   
    _generateMarkup() {                     
        
    }
}

export default new addRecipeView();