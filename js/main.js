
const modal_cart = document.getElementById("modal_prod");
let regular_customer = true;
let inventory =  [];
var _status;
function readTextFile1(file)
{
    debugger;
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        debugger
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
               _status = rawFile.responseText;
               
            }
        }
    }
    rawFile.send(null);
}

readTextFile1("/deft-consulting/inventory.txt"); //calling the function
// console.log(status);

//time for looping >:D
let splitStatus=_status.split('\n')
for(let i=0;i<splitStatus.length;i++){
  let line=splitStatus[i];
  console.log(line);
  let split_line = line.split(/[:,]/);
  split_line.push(`${i}`);
  inventory.push(split_line);
  //whateverYouWannaDoNext
}

console.log(inventory)


function populate_modal_prod(id) {
    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i][5] === id) {
            document.getElementById("prod_title_i").textContent = inventory[i][0];
        }
    }
}

function products_events() {
    let add_to_cart = document.querySelectorAll(".btn-add-cart");
    add_to_cart.forEach((prod) => {
        prod.addEventListener("click",(e) => {
        debugger;
        let product_id = e.target.parentElement.parentElement.children[3].value;
        populate_modal_prod(product_id);
        modal_cart.classList.add("modal-visible")
        })
    })
}

function shopProducts(regularCustomer) {

    const prod_container = document.getElementById("products_avilable");

    for (let i = 0; i < inventory.length; i++) {
        let currentPrice;
        if (regularCustomer) {
            currentPrice = inventory[i][2];
        }
        else {
            currentPrice = inventory[i][3];
        }
        let product = document.createElement("div");
        product.classList.add("p-stock");
        product.innerHTML = `<div class="sub-container-prod"><div><h2 class="product-title">${inventory[i][0]}</h2></div><div><span>Quantity:</span><span>${inventory[i][1]}</span></div><div><span>Price:</span>${currentPrice}<span></span></div><input type="hidden" value=${inventory[i][5]} class="hidden-id"><div class="web-btn"><button type="button" class="btn-add-cart">Add to Cart</button></div></div>`
        prod_container.appendChild(product);
    }
    products_events();
}



const btn_member_continue = document.getElementById("continue_membership");

btn_member_continue.addEventListener("click", () => {
    let radio_options = document.getElementsByName("membership");
    let radio_value;
    for (let i = 0; i < radio_options.length; i++) {
        if(radio_options[i].checked === true) {
            radio_value = radio_options[i].value;
        }
    }

    if (radio_value === "rewards") {
        regular_customer = false;
    }

    document.getElementById("modal").classList.remove("modal-visible");

    shopProducts(regular_customer);
})