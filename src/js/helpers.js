
import {async}  from "regenerator-runtime";      //SAD JE REKAO LIK DA MISLI DA JE OVO PARCEL SAM URADIO JER ON NIJE. //Ovo on ima ali ne znam kad je dodao i nisam siguran da mi treba ovde. U controller.js vidim da je slicno importovao ali tamo sam isto napisao da izgleda ne treba ali da mozda radimo to zbog starijih browsera.
import { TIMEOUT_SEC } from "./config.js"

const timeout = function (s) {              //Ovo smo vec radili. Returnuje promise koji ce da reject posle koliko sekundi zadamo.
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  };

export const AJAX = async function(url, uploadData = undefined){        //Imam ispod dok nisam sredjivao kako je izgledalo.
  try {
    const fetchPro = uploadData ? fetch(url, {    //Ovo je turnary operator. Imam ovo prvo fets ako je uploadData definisano, a ako nije onda je samo ono fetch(url).
      method: "POST",
      headers: {
        "Content-Type": "application/json",     //Ovde je headers neki snipetsi. Ispod je pravo data. Ovde preciziramo da ce data od tih snipetsa koje posaljemo da budu u json formatu. Tako API moze da prihvati te podatke.
      },
      body: JSON.stringify(uploadData),         //Ovde u data koji saljemo u API.
    }) : fetch(url);

      
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);       //Ovo radim u slucaju da recimo internet ne radi kako treba ne radi fetch u nedogled. Nego kad stavim race onda prvi promise koje je resolved to je returnovano. A ovde imam ovo timeout sto ce rejectovati posle koliko sekundi zadamo.
    const data = await res.json();

    if(!res.ok) throw new Error(`${data.message} ${res.status}`);
    return data;
    } catch (err) {
      throw err;      //Ovo radimo jer ce u model.js izbaciti error onaj koji smo zadali ali zbog ovog errora ovde. A da bi tamo izbacio ovaj error zato radimo ovo throw. Tako de promise od getJSON unutar model.js biti rejected. Tako smo propagirali error iz jedne async funkcije u drugu.
}
};

/*
export const getJSON = async function (url) {
    try {
        const fetchPro = fetch(url);
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);       //Ovo radim u slucaju da recimo internet ne radi kako treba ne radi fetch u nedogled. Nego kad stavim race onda prvi promise koje je resolved to je returnovano. A ovde imam ovo timeout sto ce rejectovati posle koliko sekundi zadamo.
        const data = await res.json();

        if(!res.ok) throw new Error(`${data.message} ${res.status}`);
        return data;
    }catch (err) {
        throw err;      //Ovo radimo jer ce u model.js izbaciti error onaj koji smo zadali ali zbog ovog errora ovde. A da bi tamo izbacio ovaj error zato radimo ovo throw. Tako de promise od getJSON unutar model.js biti rejected. Tako smo propagirali error iz jedne async funkcije u drugu.
    }
};

//Ovo gore kad trazimo stvari iz API-a to je GET request. A kad saljemo podatke trebace nam POST request.
// Vidim da prosledjujem options object u fetch.
// Ovo posle fetcha ostaje isObject. Cak i ovo 
// const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);   //Ovo ostaje da u slucaju nesto ne radi kako treba da se request zaustavi posle nekog vremena tj pozvace se ovaj timeout.
// const data = await res.json();        //Ovo isto ostaje. To ce nam vratiti podatke koje smo poslali. Tj tu cemo dobiti podatke pa na kraju funkcije imam return.



export const sendJSON = async function (url, uploadData) {        
  try {
      const fetchPro = fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",     //Ovde je headers neki snipetsi. Ispod je pravo data. Ovde preciziramo da ce data od tih snipetsa koje posaljemo da budu u json formatu. Tako API moze da prihvati te podatke.
        },
        body: JSON.stringify(uploadData),         //Ovde u data koji saljemo u API.
      });

      const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);       //Ovo radim u slucaju da recimo internet ne radi kako treba ne radi fetch u nedogled. Nego kad stavim race onda prvi promise koje je resolved to je returnovano. A ovde imam ovo timeout sto ce rejectovati posle koliko sekundi zadamo.
      const data = await res.json();

      if(!res.ok) throw new Error(`${data.message} ${res.status}`);
      return data;
  }catch (err) {
      throw err;      //Ovo radimo jer ce u model.js izbaciti error onaj koji smo zadali ali zbog ovog errora ovde. A da bi tamo izbacio ovaj error zato radimo ovo throw. Tako de promise od getJSON unutar model.js biti rejected. Tako smo propagirali error iz jedne async funkcije u drugu.
  }
};
*/