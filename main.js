let products = document.querySelector(".product__catalog");
let arr = Array.from(products.children);
console.log(arr)

function selectButtonValue () {
  const selectButton = document.getElementById("sort-by-price")
  selectButton.addEventListener('change', (e) => {
    console.log(e.target.value)
  });
}
 
selectButtonValue()

