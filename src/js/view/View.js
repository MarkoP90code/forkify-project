//OVO PRAVIMO DA BUDE PARENT CLASS ZA SVE VIEW-s.

import icons from "url:../../img/icons.svg";        //Ovde pisem url kranuvsi od recipeView.js. Zato prvo idem dva levela iznad pa onda ulazim u img. Ovo radi u parcel2. Ovo url treba za slike videe muziku... za ono sto nije programming file.

export default class View {                 //Ovo odma exportujemo jer nece koristiti instances. Samo cemo koristiti ovo kao parent clas za ove druge child views.
    _data;

    /**
     * Render the recieved object to the DOM
     * @param {Object | Object[]} data The data to be rendered (e.g. recipe) 
     * @param {boolean} [render=true] if false create markup string instead of rendering to the DOM 
     * @returns {undefined | string} A markup string is returned i render=false
     * @this {Object} View instances
     * @author Marko P
     * @todo Finish implemenation
     */
    render(data, render = true) {
        console.log(data);
        if (!data || Array.isArray(data) && data.length === 0) return this.renderError();   //Ovde ne moramo da zadajemo nista u renderError. Imam dole zadat default this._errorMessage.  (!data) Ovo samo radi za undefined ili null, a mi dobijamo prazan array. Zato imam i druge uslove. Array.isArray(data) Ovo je helper function sto je na array construktoru. to po defaultu imamo.

        this._data = data;
        const markup = this._generateMarkup();

        if(!render) return markup;

        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }


    update(data) {              //Ovde cemo napraviti novi markup ali necemo renderovati i onda cemo uporediti taj tekst sa trenutnim tekstom i ono sto je drugacije samo cemo to zamenuti.
        
        this._data = data;
        const newMarkup = this._generateMarkup();       //Ovo ce dati ceo novi markup da bi mogli da ga uporedimo sa starim. Ali ovo ce i biti samo string. Zato ovo ispod radimo koliko sam skontao.

        const newDOM = document.createRange().createContextualFragment(newMarkup);  //Ovo ce da pretvori newMarkup sto je u stvari string u virtualni DOM objekat. Ne pojavlju je na stranici ali je sacuvan u memoriji.  Slajd 303.
        const newElements = Array.from(newDOM.querySelectorAll("*"));           //Da smo render method koristili dobili bi sve ovo na stranici, a ovako samo u konzoli vidimo node list. * selektuje sve. 
        const curElements = Array.from(this._parentElement.querySelectorAll("*"));   //Ovde selektujem trenutni DOM. Array.from ovde pravi array od node liste pa cu da uporedim ta dva array-a.
        // console.log(newElements);
        // console.log(curElements);

        newElements.forEach((newEl, i) => {         //Ovde uporedjujemo clanove i ako nisu isti onda trenutni tekst menjamo sa novim. Tako menjamo samo sta je novo, a ne sve.
            const curEl = curElements[i];
            // console.log(curEl, newEl.isEqualNode(curEl))        //Ovde izbaci false ako je ceo kontejner drugaciji pa onda unutar kontejnera sta je razlicito pokazuje odakle false dolazi.
            
        //Updates changed TEXT.    
        if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== "") {     //newEl.firstChild.nodeValue vraca tekst ako imam neki tekst i to je razlicito od praznog stringa. https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeValue A trim ubacujem jer ce recimo ovde <div> <p></p></div> da uhvati ovaj prvi razmak (white space) kao tekst valjda. I onda to nije prazan string. Zato trimujem white space. Stavljam optional chaining u slucaju da nema firstChild.
            // console.log(newEl.firstChild?.nodeValue.trim());
            curEl.textContent = newEl.textContent;
        }

        //Update changed ATTRIBUTES. Ovde treba data atribut da promenim.
        if(!newEl.isEqualNode(curEl)) {
            Array.from(newEl.attributes).forEach((attr) => {
                curEl.setAttribute(attr.name, attr.value);              //Ovde menjam na curEl vrednost atributu sa imanom attr.name na vrednost attr.value. od newEl.
            });
        }
        })
    }


    _clear() {
        this._parentElement.innerHTML = "";
    }

    renderSpinner () {
        const markup =`
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
      };


    renderError(message = this._errorMessage) {     //Ostavili smo da mose da se prosledi message ali ako se nista ne prosledi onda je this._errorMessage default vrednost. Tako u renerError unutar controller.js nismo prosledili nista i onda se uzima default vrednost.
        const markup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `
        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }


    renderMessage(message = this._message) {       //Ovo je kad je success. Gore u renderError je objasnjeno da je ovo this._message default vrednost.
        const markup = `
            <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
            <p>${message}</p>
            </div>
        `
        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }
}