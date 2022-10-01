let regular_customer = true;

function checkFile(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}

function checkMemberPrice(regularCustomer, index) {
    let currentPrice;
    if (regularCustomer) {
        return inventory[index][2];
    }
    else {
        return inventory[index][3];
    }
}

function getTotal(price_selected, qty) {
    debugger;
    let price_formated = price_selected.split('$');
    let my_price = Number(price_formated[price_formated.length - 1])
    let totalPrice = my_price * Number(qty);
    totalPrice = Math.round((totalPrice + Number.EPSILON) * 100) / 100
    return totalPrice;
}

let my_inventory_file = "/deft-consulting/inventory.txt";

if (!checkFile(my_inventory_file)) {
    my_inventory_file = "../inventory.txt";
 }

const modal_membership = document.getElementById("modal");
const modal_cart = document.getElementById("modal_prod");
const btn_cancel_cart = document.getElementById("modal_cancel");
const btn_save_cart = document.getElementById("save_to_cart");
const btn_confirm_payment = document.getElementById("confirm_btn");

btn_cancel_cart.addEventListener("click", () => {
    modal_cart.classList.remove("modal-visible");
})

btn_save_cart.addEventListener("click", () => {
    modal_cart.classList.remove("modal-visible");
    const current_cart_obj = populate_cart_obj(product_id);
    populate_cart_tbl(current_cart_obj);
})

btn_confirm_payment.addEventListener("click", () => {
    let user_cash = document.getElementById("my_cash");
    let to_pay = total_amount_toPay;
    if (user_cash.value !== "") {
        if (Number(user_cash.value) !== NaN) {
            if (Number(user_cash.value) >= to_pay) {
                let change = Number(user_cash.value) - to_pay
                console.log(change)
            }
            else {
                alert("They quantity entered should be greater than the total amount to pay.")
            }
        }
        else {
            alert("Please enter a valid number")
        }
    }
    else {
        alert("Please enter a value for the payment")
    }
})

const prod_container = document.getElementById("products_avilable");

const home_menu = document.getElementById("home_menu");

const cart_menu = document.getElementById("cart_menu");

const cart_section = document.getElementById("my_cart");

const checkout_section = document.getElementById("my_checkout");

const checkout_menu = document.getElementById("checkout_menu");

const tBody_cart = document.getElementById("my_cart_tbl").tBodies[0];

home_menu.addEventListener("click", () => {
    let target_menu = "";
    if (cart_menu.classList.contains("active-opt-menu")) {
        target_menu = cart_menu;
    }
    if (checkout_menu.classList.contains("active-opt-menu")) {
        target_menu = checkout_menu
    }

    if (target_menu !== "") {
        if (target_menu.id === "cart_menu") {
            cart_section.classList.remove("active-section");
            cart_menu.classList.remove("active-opt-menu");
        }
        else {
            checkout_section.classList.remove("active-section");
            checkout_menu.classList.remove("active-opt-menu");
        }
        prod_container.parentElement.classList.add("active-section");
        home_menu.classList.add("active-opt-menu");
    }
})

cart_menu.addEventListener("click", () => {
    let target_menu = "";
    if (home_menu.classList.contains("active-opt-menu")) {
        target_menu = home_menu;
    }
    if (checkout_menu.classList.contains("active-opt-menu")) {
        target_menu = cart_menu
    }

    if (target_menu !== "") {
        if (target_menu.id === "home_menu") {
            prod_container.parentElement.classList.remove("active-section");
            home_menu.classList.remove("active-opt-menu");
        }
        else {
            checkout_section.classList.remove("active-section");
            checkout_menu.classList.remove("active-opt-menu");
        }
        cart_section.classList.add("active-section");
        cart_menu.classList.add("active-opt-menu");
    }
})

checkout_menu.addEventListener("click", () => {
    if (cart.length > 0) {
        let target_menu = "";
        if (home_menu.classList.contains("active-opt-menu")) {
            target_menu = home_menu;
        }
        if (cart_menu.classList.contains("active-opt-menu")) {
            target_menu = cart_menu
        }
    
        if (target_menu !== "") {
            if (target_menu.id === "home_menu") {
                prod_container.parentElement.classList.remove("active-section");
                home_menu.classList.remove("active-opt-menu");
            }
            else {
                cart_section.classList.remove("active-section");
                cart_menu.classList.remove("active-opt-menu");
            }
            checkout_section.classList.add("active-section");
            checkout_menu.classList.add("active-opt-menu");

            populate_checkout_page(cart);
        }
    }
    else {
        alert("Select at least one product to proceed with the checkout.")
    }

})

let inventory =  [];

let cart = [];

let total_amount_toPay = 0;

let product_id;

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

readTextFile1(my_inventory_file); //calling the function
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

function populate_qty_dropDown(qty) {
    debugger;
    const qty_drop_down = document.getElementById("qty_cmb");
    qty_drop_down.innerHTML = "";
    for (let _n = 1; _n <= qty; _n++) {
        debugger;
        let opt = document.createElement("option");
        opt.setAttribute('value', _n);
        opt.text = _n;
        qty_drop_down.appendChild(opt)
    }

}


function populate_cart_obj(id) {
    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i][5] === id) {
            let cart_obj = {
                "product": inventory[i][0],
                "stock": inventory[i][1],
                'qty': document.getElementById("qty_cmb").value,
                "price": checkMemberPrice(regular_customer, i),
                "tax": inventory[i][4],
                "id": id
            }
            cart.push(cart_obj)
        }
    }
    console.log(cart)
    return cart;
}

function populate_cart_tbl(obj) {
    tBody_cart.innerHTML = "";
    if (obj.length > 0) {
        for (let x = 0; x < obj.length; x++) {
            tBody_cart.innerHTML += `<tr><td>${obj[x].product}</td><td>${obj[x].price}</td><td>${obj[x].qty}</td><td>$${getTotal(obj[x].price, obj[x].qty)}</td><td><input type="hidden" value="${obj[x].id}"><button type="button" class="delete-btn">🗑️</button></td></tr>` 
        }

        const delete_prod = document.querySelectorAll(".delete-btn");
        delete_prod.forEach((prod) => {
            prod.addEventListener("click", (e) => {
                debugger
                let target_id = e.target.parentElement.firstChild.value;
                cart = cart.filter((item) => item.id !== target_id);
                e.target.parentElement.parentElement.remove();
            })
        })
    }    
}

function populate_checkout_page(myCart) {
    debugger;
    let subtotal = 0;
    for (let i = 0; i < myCart.length; i++) {
        debugger;
        let final_price = getTotal(myCart[i].price, myCart[i].qty)
        subtotal += final_price;
    }
    total_amount_toPay = subtotal;
    document.getElementById("total_amount_i").textContent = `$${parseFloat(subtotal).toFixed(2)}`;
}

function populate_modal_prod(id) {
    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i][5] === id) {
            document.getElementById("prod_title_i").textContent = inventory[i][0];
            document.getElementById("prod_price_i").textContent = checkMemberPrice(regular_customer, i);
            document.getElementById("prod_stock_i").textContent = inventory[i][1];
            populate_qty_dropDown(Number(inventory[i][1]));
        }
    }
}

function products_events() {
    let add_to_cart = document.querySelectorAll(".btn-add-cart");
    add_to_cart.forEach((prod) => {
        prod.addEventListener("click",(e) => {
        debugger;
        product_id = e.target.parentElement.parentElement.children[3].value;
        populate_modal_prod(product_id);
        modal_cart.classList.add("modal-visible")
        })
    })
}

function shopProducts(regularCustomer) {

    for (let i = 0; i < inventory.length; i++) {
        let currentPrice = checkMemberPrice(regularCustomer, i);
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

    modal_membership.classList.remove("modal-visible");

    shopProducts(regular_customer);
})