
import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./view/recipeView.js";      //Ove stvari sto importujem videti gde je export u tom fajlu. Exportovao sam vec pozvanu clasu. Znaci exportovao sam instance. A na primer u View.js sam odma exportovao jer mi treba kao parent element. 
import searchView from "./view/searchView.js";      
import resultsView from "./view/resultsView.js";
import paginationView from "./view/paginationView.js";
import bookmarksView from "./view/bookmarksView.js";
import addRecipeView from "./view/addRecipeView.js";

import "core-js/stable";                      //Ima u wordu ova dva pod "core-js".
import "regenerator-runtime/runtime";   //Ovo je za polyfilling async await, a ovo iznad je za sve ostalo. OVO IZGLEDA VISE NE TREBA JER RADI I BEZ TOGA. MOZDA TREBA ZA STARIJE BROWSERE.

// if(module.hot) {        //Ovo je valjda da kad sacuvamo ne uradi refresh nego da promeni samo sto je promenjeno. Ima u wordu (module.hot)
//   module.hot.accept();     //Kad ovo imam upaljeno moze da zeza.
// }

// https://forkify-api.herokuapp.com/v2       //Ovo je API koji nam treba

///////////////////////////////////////



const controlRecipes = async function() {         //Ovo se zvalo showRecipe ali smo promenuli na controlRecipies jer se tako zove na onom dijagramu gde objasnjava kako ovo sve funkcionise.
  try {
    const id = window.location.hash.slice(1);      //window.location daje url a .hash daje hash koji je. Ima u wordu. Ovo slice uzima sve osim prvog simbole "#".
    // console.log(id);

    if (!id) return;    //Ovo je u slucaju da nemamo hash. Guard clause. Moderan nacin programiranja.
    
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search results.
    resultsView.update(model.getSearchResultsPage());       //addHandlerRender mi poziva dole contolRecipes. Morali smo ovde staviti. Nisam mogao ovde controlSearchResults jer to dole pozivam u searchView.addHandlerSearch(controlSearchResults); a u searchView ni nemam importovam View.js tako da ni nemam ni render nu update.
    
    // 1) Updating bookmarks view.
    bookmarksView.update(model.state.bookmarks);
    
    // 2) Loading recipe.
    await model.loadRecipe(id);     //Ovde je model ono sto smo importovali gore. I posto smo importovali sva sa * onda je to objekar i zato je loadRecipe u stvari method. A pisem await zato sto je loadRecipe async funkcija i returnuje promise zato moramo sacekati da se izvrsi da bi se kod dalje odvijao. Ne dodeljuje ovde promenljivoj nista je loadRecipe samo modifikuje podatke unutar state unutar model.js.
    
    // 3) Rendering recipe.
    recipeView.render(model.state.recipe);            // const recipeView = new recipeView(model.state.recipe);    //Da smo exportovali celu klasu unutar recipeVies.js onda bi ovako nesto imao. Ali sam exportovao vec pozvanu klasu.
    

  } catch (err) {
    recipeView.renderError();      //err je throw-ovan od getJSON do loadRecipe i onda od loadRecipe do controlRecipe. I sa tim pozivamo renderError.
    console.error(err);   //logovali smo jer smo imali gresku. Ovde izbaci sta je pravi error, a ne poruku sto smo mi napravili.
  }
};    //OVDE AKO NE STAVIM ";" OVO ISPOD NECE RADITI JER PARCEL NE PREPOZNAJE STA SE IZNAD DESAVA.


const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. Get search query.
    const query = searchView.getQuery();      //Ovde cemo nesto menjati verovatno posto imam vec query u modal pa ne znam sto bi ovde pravio novu konstantu.
    if (!query) return

    // 2. Load search results
    await model.loadSearchResults(query);

    // 3. Render results.
    // resultsView.render(model.state.search.results);    //Ovo daje sve rezultate.
    resultsView.render(model.getSearchResultsPage());       //Ovde smo podelili na stranice. Da ne budu svi rezultati na stanici nego da treba da listam.

    // 4. Render initial pagination buttons.
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
}


const controlPagination = function(goToPage) {        //Ovo mislim da ne mora da se zove goToPage, moze kako hocemo jer se goToPage prosledi u paginationView.js handler(goToPage).
  // 3. Render NEW results.
    resultsView.render(model.getSearchResultsPage(goToPage));       //Ovde smo podelili na stranice. Da ne budu svi rezultati na stanici nego da treba da listam.

    // 4. Render NEW pagination buttons.
    paginationView.render(model.state.search);
}

const controlServings = function (newServings) {       //Ovo ce da nam modifikuje recept kad stisnemo + ili - kod servings.
  // Update the recipe servings (in state). Ovo state je u mudel.js
    model.updateServings(newServings);

  // Update the recipe view.
  // recipeView.render(model.state.recipe)  //ovde smo sve informacije ponovo renderovali.
  recipeView.update(model.state.recipe)       //Ovde hocemo da ponovo renderujemo samo sta se promenilo. Gore u 4 renderujem, a ovde samo update radim. Updejtovace text i atribute da ne mora da se renderuje iz pocetka.
}


const controlAddBookmark = function () {
  // 1. Add or remove bookmark.
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);    //U zagradi ima ! da obratim da ako je false onda se ova funkcija izvrsava. Ovde odma znamo da li je true ili false zato sto smo odma na pocetku u model.js loadRecipe() dodali sta je true, a sta false.
  else model.deleteBookmark(model.state.recipe.id);  //Ovo je moglo i sa else da se uradi.
 
  // 2. Update recipe view.
  recipeView.update(model.state.recipe);

  //3. Render bookmarks.
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function() {             //Ovo smo dodali da renderujemo bookmarks odma. U controller.js ovde bookmarksView.update(model.state.bookmarks) pokusa da se radi update ali izbaci error jer kad uporedjuje newEl i curEl nema jos curEl.
  bookmarksView.render(model.state.bookmarks);
};


const controlAddRecipe = async function(newRecipe) {
  try {
    //Show loading spinner.
    addRecipeView.renderSpinner();

    //Upload the new recipe data.
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe.
    recipeView.render(model.state.recipe);

    //Success message.
    addRecipeView.renderMessage();    //Ne prosledjujem poruku jer je vec zadata.

    //Render bookmark view.
    bookmarksView.render(model.state.bookmarks);    //Posto ubacujemo novi element ne koristimo update nego render.

    //Change ID in URL.
    window.history.pushState(null, "", `#${model.state.recipe.id}`)      //history je api. to je history browsera. I onda na history objektu zove pushState method. Tako cemo promenuti ULR bez da moramo da radimo reload. Ovo radimo jer kad dodamo recept trebalo bi da se promeni URL. Push state uzima tri argumenta. Prvi je state, nije bitam, stavljam null, drugi je title sto isto nije relevantno, treci je url.

    //Close form window.
    setTimeout(function() {       //Ova kad uploadujem recepat prvo ce da pokaze ovu poruku iznad i onda imam timeout za koliko da nestane modal.
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)

  } catch(err) {
    console.error("😒😒😒", err);
    addRecipeView.renderError(err.message);
  }
};


const init = function () {        //Ovo smo valjda mogli i bez ove init funkcije. Samo da smo ovo unutar stavili u global scope.
  bookmarksView.addHandlerRender(controlBookmarks);
  
  recipeView.addHandlerRender(controlRecipes);

  recipeView.addHandlerUpdateServings(controlServings);

  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);

  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlAddRecipe);
  // controlServings();        //Ovo ne radi ovde zbog async. Probavamo da radimo forEach(), a nisu stigli podaci. Init registruje ove handler funkcije i odma poziva i ovo.
};

init();





//ZA POSLE.
// const DeleteUpload = async function(url){        //Imam ispod dok nisam sredjivao kako je izgledalo.
//   try {
//     fetch(url, {    //Ovo je turnary operator. Imam ovo prvo fets ako je uploadData definisano, a ako nije onda je samo ono fetch(url).
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",     //Ovde je headers neki snipetsi. Ispod je pravo data. Ovde preciziramo da ce data od tih snipetsa koje posaljemo da budu u json formatu. Tako API moze da prihvati te podatke.
//       },
//                //Ovde u data koji saljemo u API.
//     }); 

      
//     // const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);       //Ovo radim u slucaju da recimo internet ne radi kako treba ne radi fetch u nedogled. Nego kad stavim race onda prvi promise koje je resolved to je returnovano. A ovde imam ovo timeout sto ce rejectovati posle koliko sekundi zadamo.
//     // const data = await res.json();

//     // if(!res.ok) throw new Error(`${data.message} ${res.status}`);
//     // return data;
//     } catch (err) {
//       throw err;      //Ovo radimo jer ce u model.js izbaciti error onaj koji smo zadali ali zbog ovog errora ovde. A da bi tamo izbacio ovaj error zato radimo ovo throw. Tako de promise od getJSON unutar model.js biti rejected. Tako smo propagirali error iz jedne async funkcije u drugu.
// }
// };

// DeleteUpload("https://forkify-api.herokuapp.com/api/v2/recipes/66d8d667c3b3e1001434fc84?key=1e43c806-d5d1-4675-a307-1be607748708");



// model.deleteBookmark("66daeb15895f8e00144aecaa");