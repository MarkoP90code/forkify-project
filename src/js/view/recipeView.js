
import View from "./View.js";           //Inheritance izmedju field in methods ne radi za private fields(#) zbog parcel i babel zato svaki private field i method koji ima ovo # ispred menjam sa _ (to je protected field i method). Ima u wordu (private i protected field).

// import icons from "../img/icons.svg";     //Ovo radi u parcel1
import icons from "url:../../img/icons.svg";        //Ovde pisem url kranuvsi od recipeView.js. Zato prvo idem dva levela iznad pa onda ulazim u img. Ovo radi u parcel2. Ovo url treba za slike videe muziku... za ono sto nije programming file.
import fracty from "fracty";                              // Ovde je ovo stajalo ali izbacuje error na netlifu pa sam promenuo     import {Fraction} from "fractional";      //Destructuring. Citaj do kraja. Ako uradio ovo var Fraction = require('fractional').Fraction onda njihova formula radi. Ali kad radim ovako sa import i logujem vidim da je Fraction unutar Fraction objekta tako da kad pozivam tu funkciju bitan mi je taj unutrasnji Function i stavljam new ispred jer je tako dato objasnjenje (Izgleda je to nutrasnje Fraction constructor funkcija, i ovo dalje da procitam iako mislim da nije tacno). To nije construktor funkcija nego samo je tako dato objasnjenje da se tako pokrece ta funksija. A posto imam destrukturing znaci odma sam dosao do tog unutrasnje Fraction i samo dodajem new posto je tako zadato. Ovo imam dole new Fraction(ing.quantity). To mi je da brojevi budu razlomci u receptu.
// console.log(Fraction); 

class RecipeView extends View {              //Ovo radimo jer cemo posle imate parent class view sto ce imati neke methode sto svaki child class treba da nasledi. I svaki view ce imati neke private methods i properties pa ovako to mozemo da uradimo sa klasama.
    _parentElement = document.querySelector('.recipe');         //Ovde ne pisemo const ispred posto je field. A _ znaci da je private.
    _errorMessage = "We could not find that recipe. Please try another one!";
    _message = "";   //Ovo je poruka kad je promise succes.
    
    
    addHandlerRender(handler) {
        ["hashchange", "load"].forEach((ev) => window.addEventListener(ev, handler));  //Ovo na zamenjuje ova dva reda    window.addEventListener("hashchange", controlRecipes); //Imam u wordu sta je hash. I kad god se promeni zovemo controlRecipes().    window.addEventListener("load", controlRecipes); //Ovo radimo jer se ovaj iznad eventListener aktivira samo kad imamo promenu hash-a. Sto znaci ako kopiramo url i hocemo da otvorimo u drugom prozoru nece otvoriti taj recept jer nije doslo do promene hash-a. Zato sto stavili i load event jer cim se loaduje stranica poziva se controlRecipes sa tim id koji nam treba.

    };

    addHandlerUpdateServings(handler) {
        this._parentElement.addEventListener("click", function(e) {
            const btn = e.target.closest(".btn--update-servings");              //Sta god stisnem unutar dugmeta. Da li je span ili svg ili sta vec, uhvatice to dugme.
            if(!btn) return;
            const {updateTo} = btn.dataset;      // Uradjen je destrukturin, mada ne znam sto kad ima jedan podatak samo al valjda je lepse. Ovako je bilo const updateTo = btn.dataset.updateTo;   //Dole pise update-to. Ali kad imam "-" onda se pretvori to u camel case (updateTo).
            if (+updateTo > 0) handler(+updateTo);          //Mora ova handler hunkcija biti pozvana. + pretvara u number. Data set returnuje string valjda.
        })
    }

    
    addHandlerAddBookmark(handler) {
        this._parentElement.addEventListener("click", function(e){
            const btn = e.target.closest(".btn--bookmark");
            if(!btn) return;
            handler();
        })
    }


    _generateMarkup() {             //Ovde _data dobijamo iza View.js kad pozovemo render sa data. onda to data postane _data.
        return `
    <figure class="recipe__fig">
          <img src="${this._data.image}" alt="${this._data.title}" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings - 1}">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings + 1}">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${this._data.key ? "" : "hidden"}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${this._data.bookmarked? "-fill" : ""}"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${this._data.ingredients.map(this._generateMarkupIngredient).join("")}

            
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
    `;

    }

    _generateMarkupIngredient (ing) {     //Ja sam ovde dodao toFixed(). Bez Toga kad sam menjao servings na super pizza na 9 izbaci error.
        return `
          <li class="recipe__ingredient">
          <svg class="recipe__icon">
            <use href="${icons}#icon-check"></use>
          </svg>
          <div class="recipe__quantity">${ing.quantity ? fracty(ing.quantity).toString() : ""}</div>
          <div class="recipe__description">
            <span class="recipe__unit">${ing.unit}</span>
            ${ing.description}
          </div>
          </li>
        `;
}};

export default new RecipeView();