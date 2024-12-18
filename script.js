const addCustomerBtn = document.querySelector("#addCutsomer");
const milkEntryBtn = document.querySelector("#makeEntry");
const selectCustomer = document.querySelector("#customers")
const entryTab = document.querySelector(".container");
const milkEntryContainer = document.querySelector(".milk-entry")
const customerCard = document.querySelector(".customer-card")
const insertEntryBtn = document.querySelector("#insertEntry");
const showTableBtn = document.querySelector("#show");
const priceInput = document.querySelector("#inititalPrice");
const paymentBtn = document.querySelector("#billsBtn");
// table 
const tableData = document.querySelector(".data")
const table = document.querySelector(".result")
const tbody = document.querySelector("#tbody")
const billcard = document.querySelector(".bill")
const prevBtn = document.querySelector("#prev")
const nextBtn = document.querySelector("#next")
const searchBtn = document.querySelector("#searchBtn")
const search = document.querySelector("#search");
const popups = document.querySelector(".pop-ups");

paymentBtn.disabled = true

const milkEntries = []
const customers = []
let customerId = 0;
let currIndex = 0;
let popupMsg = ""
let color = ""

function deletePopUp(el) {
    el.remove()
}


function createPopUp(msg,color) {
    const li = document.createElement("li")
    li.innerHTML = msg;
    li.style.color = color;
    console.log(li);
    
    popups.appendChild(li)
    li.classList.toggle("showPopup");


    setTimeout(() => deletePopUp(li),5000);
    
}



//++++++++++++++ this is for smooth typing animation ++++++++++++++++++
const text = document.querySelector("#text")
const textContainer = document.querySelector(".text")
window.onload = () => {
    let textIdx = 0
    let textMsg = "Welcome to dairy management app"
    const interval = setInterval(() => {
        text.innerHTML += `${textMsg[textIdx]}` 
        textIdx++;
        if(textIdx >= textMsg.length) {
            clearInterval(interval)
        }
    },50);
    const img = document.createElement("img");
    img.src = "fire.png";
    textContainer.appendChild(img)
}


// +++++++++ desablening buttons
if(customers.length === 0) {
    milkEntryBtn.disabled = true;
    // showBtn.disabled = true;
    showTableBtn.disabled = true

}


//function to check validation of the input fields
function checkFileds() {
    const customerName = document.querySelector("#name").value;
    const mobileNumber = document.querySelector("#mobile").value;
    const customerAddress = document.querySelector("#address").value;
    const milkPrice = priceInput.value;
        console.log(milkPrice);
        
    //checking the fields
    if (customerName && mobileNumber && customerAddress && milkPrice) {
        priceInput.disabled = true;
        if (mobileNumber.length === 10) {
            customers.push({ customerName, mobileNumber, customerAddress });
            popupMsg = "Customer added";
            color = "green";
            createPopUp(popupMsg,color);
            console.log(customers);
            addCustomer(customers);
            
            // Reset all input fields properly
            document.querySelector("#name").value = "";
            document.querySelector("#mobile").value = "";
            document.querySelector("#address").value = "";
            
        } else {
            popupMsg = "Mobile number must be 10 digits"
            color = "red"
            createPopUp(popupMsg,color)
        }
    } else {
        popupMsg = "Enter valid values for all fields"
        color = "red"
        createPopUp(popupMsg,color);
    }
}

//adding customers 
function addCustomer(arr) {
    milkEntryBtn.disabled = false;
    showTableBtn.disabled = false;
    // paymentBtn.disabled = false
    selectCustomer.innerHTML = ""
    document.querySelector("#fixPrice").value = priceInput.value;
    arr.forEach((customer) => {
        selectCustomer.innerHTML += `
            <option value="${customer.customerName}">${customer.customerName}</option>
        `;
    })
    console.log(selectCustomer);
    
}


// Entry tab
function toggleEntryTab() {
    entryTab.classList.toggle("show")
}


/// inserting the entry to the table
function insertEntry() {
    const selectedCustomer = document.querySelector("#customers").value;
    const selectedDay = document.querySelector("#days").value;
    const milkQuantity = parseFloat(document.querySelector("#milkquantity").value); // Convert quantity to a number
    
    if (!selectedCustomer || !selectedDay || isNaN(milkQuantity) || milkQuantity <= 0) {
        alert("Please enter valid milk quantity and select a customer and day.");
        return;
    }
    // Check if customer exists in the milkEntries array
    let customerEntry = milkEntries.find(entry => entry.name === selectedCustomer);

    if (customerEntry) {
        // Customer exists, update the quantity for the selected day
        customerEntry.days[selectedDay] += milkQuantity;
    } else {
        // Customer does not exist, create a new customer entry with all days initialized to 0
        milkEntries.push({
            customerId : customerId,
            name: selectedCustomer,
            amMilk: milkQuantity, // Assuming amMilk is total milk for the customer
            days: { 
                mon: 0, 
                tue: 0, 
                wed: 0, 
                thu: 0, 
                fri: 0, 
                sat: 0, 
                sun: 0 
            }
        });
    paymentBtn.disabled = false
        customerId++;
    document.querySelector("#milkquantity").value = ""

        // Update the newly added customer's day with the quantity
        customerEntry = milkEntries[milkEntries.length - 1]; // Get the last added customer
        customerEntry.days[selectedDay] = milkQuantity;
    }

    // Update the total milk quantity for the customer
    customerEntry.amMilk = Object.values(customerEntry.days).reduce((total, qty) => total + qty, 0);

    console.log(milkEntries);
    popupMsg = "Milk entry added successfully!"
    color = "green";
    createPopUp(popupMsg,color);
    createTable();

}


// +++++++++++++ used  to delete the table entry +++++++++++++
function deleteRecord(idx) {
    const deletedCustomerName = milkEntries[idx].name;
    const customerIndex = customers.findIndex(customer => customer.customerName === deletedCustomerName);

    if (customerIndex !== -1) {
        customers.splice(customerIndex, 1); // Remove from customers array
    }

    addCustomer(customers);

    milkEntries.splice(idx,1);
    popupMsg = "Entry deleted successfully";
    color = "green";
    createPopUp(popupMsg,color)
    if(milkEntries.length < 1) {
        priceInput.disabled = true;
        paymentBtn.disabled = true;
    }   else {
        priceInput.disabled = false;
        paymentBtn.disabled = false;
    }
    createTable()
    showBillcard()
}



// ++++++++++++ render the table to the user +++++++++++++++++
function createTable() {
    tbody.innerHTML = ""
   milkEntries.forEach((entry,idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${entry.customerId}</td>
            <td>${entry.name}</td>
            <td>${entry.amMilk} ltr</td>
            <td>${entry.days.mon} ltr</td>
            <td>${entry.days.tue} ltr</td>
            <td>${entry.days.wed} ltr</td>
            <td>${entry.days.thu} ltr</td>
            <td>${entry.days.fri} ltr</td>
            <td>${entry.days.sat} ltr</td>
            <td>${entry.days.sun} ltr</td>
            <td>
                <button onclick="deleteRecord(${idx})" id="removeRecord">&times;</button>
            </td>
        `;
        tbody.appendChild(tr)
   })
}


//+++++++++++++ render bill section to the user ++++++++++++++++
function showBillcard() {

    if(milkEntries.length >0) {
        const name = document.querySelector("#customer-name")
        const totalQunt  = document.querySelector("#totalQnt")
        const price = document.querySelector("#total-price")
        const payBtn = document.querySelector("#pay")

        name.innerHTML = `${milkEntries[currIndex].customerId} : ${milkEntries[currIndex].name}`; 
        totalQunt.innerHTML = `${milkEntries[currIndex].amMilk} ltr`;
        price.innerHTML =(milkEntries[currIndex].amMilk * priceInput.value).toFixed(2);
    
        payBtn.innerHTML = `Pay : ${(milkEntries[currIndex].amMilk * priceInput.value).toFixed(2)}`
        
    }   else {
        // document.querySelector(".details").innerHTML = ""
        return;
    }

}




// tringer event on addCustomer btn
addCustomerBtn.addEventListener("click", checkFileds);

//click on addEntries btn
milkEntryBtn.addEventListener("click", () => {
    milkEntryContainer.style.display = "block"
    customerCard.style.display = "none"
    table.style.display = "none"
    billcard.style.display = "none"

    toggleEntryTab();
})

//++++++++++++ toggle the entry tab ++++++++++++
document.querySelector("#close").addEventListener("click", toggleEntryTab)

// +++++++ show the add customer container +++++++++++++++
document.querySelector("#showCustomer").addEventListener("click", () =>{
    toggleEntryTab()
    milkEntryContainer.style.display = "none"
    table.style.display = "none"
    customerCard.style.display = "flex"
    billcard.style.display = "none"

})

// ++++++++++++ triggerd event on inserentry button in milk entry section ++++++++++++++++
insertEntryBtn.addEventListener("click", insertEntry);

showTableBtn.addEventListener("click", () => {
    milkEntryContainer.style.display = "none"
    table.style.display = "flex"
    customerCard.style.display = "none"
    billcard.style.display = "none"
    toggleEntryTab()

})


/// ++++++++++++++ home payment button to display the payment cards +++++++++++++
paymentBtn.addEventListener("click", () => {
    billcard.style.display = "flex"
    milkEntryContainer.style.display = "none"
    table.style.display = "none"
    customerCard.style.display = "none"
    toggleEntryTab()
    showBillcard()
})


// ++++++++++++ render the previous customer payment card ++++++++++++++
prevBtn.addEventListener("click", () => {
    if(currIndex < 1) {
        prevBtn.disabled = true

    }   else {
    currIndex--
        showBillcard()

    }
})


// ++++++++++++ render the next customer payment card ++++++++++++++
nextBtn.addEventListener("click", () => {
    if(currIndex === milkEntries.length -1) {
        nextBtn.disabled = true

    }   else {
    currIndex++;
        showBillcard()
    }
})

// +++++++++++++ used to search the cutomer payment card via customer id
searchBtn.addEventListener("click", () => {
    const searchId = parseInt(search.value)
    if(searchId > milkEntries.length-1 && searchId < 0) {
        console.log("no entry");
        return;

    } else {
    for (const entry of milkEntries) {
        if(searchId === entry.customerId) {
            currIndex = searchId
            showBillcard()
        }
    }
}
document.querySelector("#search").value = ""
})

