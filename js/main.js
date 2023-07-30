//Example fetch using pokemonapi.co
document.querySelector('button').addEventListener('click', getFetch)

function getFetch(){
  const inputVal = document.querySelector('input').value;
  document.querySelector('#reader').classList.add('hide')
  // if(inputVal.length !== 12){
  //   alert(`Please ensure that barcode is 12 characters`);
  //   return;
  // }

  const url = `https://world.openfoodfacts.org/api/v2/product/${inputVal}.json`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        //code wrong/right
        if(data.status === 0){
          alert(`Product ${inputVal} not found. Please try another.`);
          return;
        }
        const item  = new ProductInfo(data.product);
        item.showInfo();
        item.listIngredients();
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

//737628064502


class ProductInfo{
  constructor(productData){ //passing in data.product
    this.name = productData.product_name;
    this.ingredients = productData.ingredients;
    this.image = productData.image_url;
  }

  showInfo(){ // name and image
    document.querySelector('#product-img').src = this.image;
    document.querySelector('#product-name').innerText = this.name;
  }
  //build table, loop over ingredients
  listIngredients(){
    let tableRef = document.querySelector('#ingredient-table');
    let isItVegan = true;
    //let isItVegetarian = false;
    let isItUnknown = false;

    for(let i = 1; i < tableRef.rows.length;){
      tableRef.deleteRow(i);
    }

    if(!(this.ingredients == null)){
      for( let key in this.ingredients){
        let newRow = tableRef.insertRow(-1);
        
        let newICell = newRow.insertCell(0);
        let newJCell = newRow.insertCell(1);
        let newKCell = newRow.insertCell(2);

        let newIText = document.createTextNode(this.ingredients[key].text);
        
        let vegStatus = this.ingredients[key].vegetarian == null ? "unknown" : this.ingredients[key].vegetarian;

        let veganStatus = this.ingredients[key].vegan ? this.ingredients[key].vegan :"unknown";
        
        let newJText = document.createTextNode(vegStatus);
        let newKText = document.createTextNode(veganStatus);
        
        newICell.appendChild(newIText);
        newJCell.appendChild(newJText);
        newKCell.appendChild(newKText);

        if(vegStatus === "no"){
          //turn item red
          newJCell.classList.add("non-veg-item");
        }else if(vegStatus === "unknown" || vegStatus === "maybe"){
          //turn item yellow
          newJCell.classList.add("unknown-maybe-item");
        }

        if(veganStatus === "no"){
          //turn item red
          isItVegan = false;
          newKCell.classList.add("non-veg-item");
        }else if(veganStatus === "unknown" || veganStatus === "maybe"){
          isItUnknown = true;
          //turn item yellow
          newKCell.classList.add("unknown-maybe-item");
        }
      }
    }
    //h3-result 
    console.log("Vegan " + isItVegan);
    console.log("unknown " + isItUnknown);
    if(!isItVegan){
      document.querySelector('#result').innerText = "No!";
      document.querySelector('#result').classList.add("non-veg-item");
      document.querySelector('#result').classList.remove("vegan");
      document.querySelector('#result').classList.remove("unknown-maybe-item");
    }else if(isItUnknown){
      document.querySelector('#result').innerText = "Unknown";

      document.querySelector('#result').classList.add("unknown-maybe-item");
      document.querySelector('#result').classList.remove("non-veg-item");
      document.querySelector('#result').classList.remove("vegan");
    }else{
      document.querySelector('#result').innerText = "Yes!🥳";

      document.querySelector('#result').classList.add("vegan");
      document.querySelector('#result').classList.remove("non-veg-item");
      document.querySelector('#result').classList.remove("unknown-maybe-item");
    }
  
  }

}

console.log(Html5QrcodeScanner);



function onScanSuccess(decodedText, decodedResult) {
  // handle the scanned code as you like, for example:
  console.log(`Code matched = ${decodedText}`, decodedResult);
  html5QrcodeScanner.clear()
  const url = `https://world.openfoodfacts.org/api/v2/product/${decodedText}.json`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        //code wrong/right
        if(data.status === 0){
          alert(`Product ${inputVal} not found. Please try another.`);
          return;
        }
        const item  = new ProductInfo(data.product);
        item.showInfo();
        item.listIngredients();
      })
      .catch(err => {
          console.log(`error ${err}`)
      });


}

function onScanFailure(error) {
  // handle scan failure, usually better to ignore and keep scanning.
  // for example:
  console.warn(`Code scan error = ${error}`);
}

// const formatsToSupport = [
//   //Html5QrcodeSupportedFormats.QR_CODE,
//   Html5QrcodeSupportedFormats.UPC_A,
//   Html5QrcodeSupportedFormats.UPC_E,
//   Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,
// ];

let html5QrcodeScanner = new Html5QrcodeScanner(
  "reader",
  { fps: 3, 
    qrbox: {width: 250, height: 250},
   
  },
  /* verbose= */ false);
html5QrcodeScanner.render(onScanSuccess, onScanFailure);

document.querySelector('#reload').addEventListener("click", reload);

function reload(){
  location.reload();
}