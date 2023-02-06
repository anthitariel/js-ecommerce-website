function sortList() {

	//choose "sort by price" button value
	const selectButton = document.getElementById("sort-by-price")
	selectButton.addEventListener('change', (e) => {

		let i, shouldSwitch, switchcount = 0;
		let direction = e.target.value;
		const productCatalog = document.querySelector(".product__catalog");
		const productList = productCatalog.getElementsByClassName("product");
		let switching = true;
		
		// Make a loop that will continue until no switching has been done:
		while (switching) {
		// Start by saying: no switching is done:
		switching = false;
		// Loop through all list-items:
		for (i = 0; i < (productList.length - 1); i++) {
		  // Start by saying there should be no switching:
		  shouldSwitch = false;
		  /* Check if the next item should switch place with the current item,
		  based on the sorting directionection (asc or desc): */
		  if (direction == "Ascending") {
			  if (Number(productList[i].value) > Number(productList[i + 1].value)) {
			  /* If next item is alphabetically lower than current item,
			  mark as a switch and break the loop: */
			  shouldSwitch = true;
			  break;
			}
		  } else if (direction == "Descending") {
			  if (Number(productList[i].value) < Number(productList[i + 1].value)) {
			  /* If next item is alphabetically higher than current item,
			  mark as a switch and break the loop: */
			  shouldSwitch= true;
			  break;
			}
		  }
		}
		if (shouldSwitch) {
		  /* If a switch has been marked, make the switch
		  and mark that a switch has been done: */
		  productList[i].parentNode.insertBefore(productList[i + 1], productList[i]);		
		  switching = true;
		  // Each time a switch is done, increase switchcount by 1:
		  switchcount ++;
		} else {
		  /* If no switching has been done AND the direction is "asc", 
		  set the direction to "desc" and run the while loop again. */
		  if (switchcount == 0 && direction == "Ascending") {
			direction = "Descending";
			switching = true;
		  }
		}
	  }
  	});
  }

sortList()


function addToCart() {

	let cart = document.querySelector(".icon__add-to-cart")
	let addToCartBtn = document.getElementsByClassName("button__add-to-cart")

  	for(let btn of addToCartBtn) {
		btn.onclick = e=> {
			let item = Number(cart.getAttribute('data-count') || 0);
			cart.setAttribute('data-count', item + 1)
			cart.classList.add('on')
			console.log('1')
		}
	}
}

addToCart()

// Search on the homepage

//  get the input by id and all product list items 
let searchInput = document.getElementById("searchInput");
let items = document.querySelectorAll(".product");

// add an event handler to the input field
searchInput.addEventListener("input", function (e) {
  showResult(false);
  let isResult = false;
  const input = e.target;
  if (input.value) {
    const toMatch = input.value.toLowerCase().trim();
    for (let i = 0; i < items.length; i++) {
      const match = items[i].innerHTML.toLowerCase().includes(toMatch);
      items[i].style.display = match ? "block" : "none";
      if (match) isResult = true;
    }
	//  show results
    if (!isResult) showResult(true)
  } else clear();
});

// clear any previous results from the page and looping through the search results list
function clearList() {
     for (let i = 0; i < items.length; i++) items[i].style.display = "block";
}

// receive a not found message with a search value 
function showResult(item) {
	let notFound = document.getElementById("no-result");
  	notFound.style.display = item ? "block" : "none";
	document.getElementById("search-value").innerHTML = searchInput.value;
  	}
showResult(false);

