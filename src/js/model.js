import {async}  from "regenerator-runtime";    ////SAD JE REKAO LIK DA MISLI DA JE OVO PARCEL SAM URADIO JER ON NIJE.  //Ovo on ima ali ne znam kad je dodao i nisam siguran da mi treba ovde. U controller.js vidim da je slicno importovao ali tamo sam isto napisao da izgleda ne treba ali da mozda radimo to zbog starijih browsera.
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
// import { getJSON, sendJSON } from "./helpers.js"
import { AJAX } from "./helpers.js"

export const state = {          //Ovde u state se nalaze podaci koji nam trebaju za aplikaciju.
    recipe: {},
    search: {
        query: "",
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
}

const createRecipeObject = function(data) {
    const {recipe} = data.data;             //Ovde smo destructuring uradili. Isto kao let recipe = data.data.recipe. Prvo data je Ova promenljiva iznad, drugo data je properti unutar toga i onda je recipe properti unutar toga.  //Ovo smo valjda uradili da bi preimenovali neki propertije. Tako da sad npr image pozivam sa recipe.image, a ne sa recipe.image_url.
    return {                              
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrc: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      ...(recipe.key && {key: recipe.key}),         //Nece svaki api da ima key zato radimo ovo. Ovde imam short circuiting. Ako recipe.key ne postoji nista se ne desava, a ako postoji vraca ovaj objekat i kad uradimo spread daje key: recipe.key.
    }
}

export const loadRecipe = async function (id) {             //Ova funkcija ne returnuje nista samo menja ovaj stete objekat iznad. Tj ubacuje recipe properti sto je takodje objekat.
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`)       //Ovde je ovaj key deo dodat da bi mogao da pristupim i svom receptu kad searchujem. To je key od ovog sto drzi kurs.
    state.recipe = createRecipeObject(data);
   

    if(state.bookmarks.some((bookmark) => bookmark.id === id)) {        //Ako bookmarks array ima nesto u sebi (Pokrenuta funkcija dole addBookmark) onda proveravamo da li recept koji loadujemo se nalazi u tom array i ako se nalazi dodelimo mu properti bookmarked = true. Bez ovoga ako stisnem bookmark pa odem na drugi recept pa se opet vratim nece biti bookmarkovan. To je valjda zato sto kad god stisnem recept on se trazi od api-a, a taj recept nema properti bookmarked. I onva ovako te sto sam sacuvao u array-u koristim da izvrsim proveru.
        state.recipe.bookmarked = true;
    } else {
        state.recipe.bookmarked = false;    //Ovde onome sto nije u bookmarks array-u dodeljujem false. Za sada to jos ne koristimo al mozda ce posle trebati.
    }

    // console.log(state.recipe);
    } catch (err) {
        console.error(`${err} #####`);      //Ovaj error je propagiran iz gerJSON async funkcije.
        throw err;
    }
};



// Implementing search results.
export const loadSearchResults = async function (query) {                     //constroller.js ce reci ovoj funkciji sta da trazi sa AJAX call.
    try {
        state.search.query = query;                         
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);           //Ovde je api zadat u config i zavrsavs se sa / sto znaci da u imati /?search=..., a te prve kose crte nema u adresi ali izgleda mu ne smeta, probao sam i sa i bez.
        // console.log(data);              //OVDE U DATA NEMA MNOGO PODATAKA JER OVO KORISTIMO SAMO DA BI IZBACILI SPISAK JELA I JOS PAR PODATAKA. A u loadRecipe imamo detaljmo jer tako radimo AJAX call sa `${API_URL}${id}`.
    
        state.search.results = data.data.recipes.map((rec) => {        //Ovo ce returnovati isto array samo cemo imati malo promenjena imena propertija.
            return {
            id: rec.id,
            title: rec.title,
            publisher: rec.publisher,
            image: rec.image_url,
            ...(rec.key && {key: rec.key})
            }
        });
        state.search.page = 1;        //Kad trazimo pizza recimo pa odemo na npr trecu stranu pa ako hocemo da trazimo pasta onda ce izbaciti opet prvu stranu.
    } catch (err) {
        console.error(`${err} #####`);      
        throw err;
    }
}

export const getSearchResultsPage = function (page = state.search.page) {           //Ova nije async jer u momentu kad je zovemo vec imamo podatke koji nam trebaju.    Ovde u zagradi imam i default vrednost.
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage;      //0;    kad je page 1 daje 0, kad je page 2 daje 10... 
    const end = page * state.search.resultsPerPage;        //to ce biti do pozicije 9 u array-u sto je 10 clan jer krecemo od 0;          

    return state.search.results.slice(start, end)       //OVO RETURNUJE OVA FUNKCIJA!!!
}


export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach((ing) => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;

    })

    state.recipe.servings = newServings;        //Ovo je zato jer recimo da hocemo dva puta da menjamo sevings. U prvom slucaju ce uzeti ovo state.recipe.servings i dobicemo novi ingrediants quantity, asli servings ce ostati isti. Zato radimo ovo jer u slucaju da i drugi put menjamo servings onda ce opet uzati onaj isti servings a ne update-ovani.
};

const persistBookmarks = function() {           //Ovo je funkcija koju pozivamo ispod kad dodajemo nesto u bookmarks i kad brisemo.
    localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe) {
    // Add bookmark.
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmark.
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks();
}


export const deleteBookmark = function(id) {        //Praksa u programiranju je kad nesto dodajemo da sve podatke koristimo, kao ovde iznad recipe. A kad brisemo u funkciju zadajem samo id.
    // Delete bookmark.
    const index = state.bookmarks.findIndex((el) => el.id === id);
    state.bookmarks.splice(index, 1);
console.log(id);
console.log(state.recipe.id);
    // Mark current recipe as NOT bookmark.
    if (id === state.recipe.id) state.recipe.bookmarked = false;
    
    persistBookmarks();
};


const init = function() {
    const storage = localStorage.getItem("bookmarks");       //ne storujem odma u state promenljivu jer ako je localStorage prazan onda necu imati nista. Mada nije mi najjasnije sto bi to bio problem.
    if (storage) state.bookmarks = JSON.parse(storage);         //parese valjda pretvara string nazad u objekat.
};

init();     //Odma pozivamo funkciju jer na ovma trebaju bookmarks.

// console.log(state.bookmarks);


const clearBookmarks = function() {         //Ovo koristimo dok smo u procesu rada jos. Ako nam treba da izbrisemo sve iz local storedza da mozemo da pozovemo ovu funkciju.
    localStorage.clear("bookmarks");
    state.bookmarks = [];
}

// clearBookmarks();



export const uploadRecipe = async function(newRecipe) {                   //Sluzice da posalje recipe data u forkify api. Posto ce requestovato api imamo async.                 
    try {
    const ingredients = Object.entries(newRecipe)
    .filter((entry) => entry[0]
    .startsWith("ingredient") && entry[1] !== "")
    .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim());            //Npr ako zadam 0.5,kg,   tomato sauce.   Napravice array ["0.5", "kg", "tomato sauce"]. Tripovan je prostor pre tomato sauce.   A ispod posto provo uradim replace all dobicu tomatosauce.
        // const ingArr = ing[1].replaceAll(" ", "").split(",");       //Sa replace all zamenuo sva white space sa nista i splitovao gde je zarez.
        if (ingArr.length !== 3) throw new Error("wrong ingredient format! Please use correct format");
        
        const[quantity, unit, description] = ingArr;           //Uradjen destructurin. 
        return {quantity: quantity ? +quantity : null, unit, description}             //Ovo je ono kad je u objektu quantity:quantity, unit:unit, description:description}. A ovo kod quantity... ako postoji pretvori se u broj, a ako ne onda je null (tako je zadato u sastojcima sa api-a pa i mi pravimo isto).
    });
    
    const recipe = {            //Gore smo podatke koje smo dobili od API menjali da nam odgovara kad ih koristimo. A ovde smo podatke sto dobijemo iz formulara prtvorili u ono kako treba da bude u API-u. RECIPE U OVAKVOM FORMATU JE SPREMAN DA SE POSALJE U API.
        title: newRecipe.title,
        source_url: newRecipe.sourceUrl,
        image_url: newRecipe.image, 
        publisher: newRecipe.publisher,
        cooking_time: +newRecipe.cookingTime,
        servings: +newRecipe.servings,
        ingredients,                //Ovde je igredients: ingredients al ne moramo da pisemo.
    }
    // console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);      //Ovo ? je jer ovde https://forkify-api.herokuapp.com/v2 u example URL(ovom gornjem) vidim da ima znak pitanja. Ali sad nam search ne treba pa pisemo samo key. Ali nije mi jasno sto gore kad trazimo podatke nemamo "?".
    console.log(data);      //Kad posaljemo podatke logujemo ovo data i vidimo da su se dodali neki propetiji u ovaj recipe objekat. imamo createdAt, id i key.
    state.recipe = createRecipeObject(data);        //Ova funkcija (gore je zadata) nam pretvara podatke da mozemo da ih koristimo lakse. Pogledati gore tu funkciju.
    addBookmark(state.recipe);          
    
    } catch(err) {
      throw err;
    }

    

}