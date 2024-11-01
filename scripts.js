async function loadItems() {
  const response = await fetch("./data/items.json");
  const items = await response.json();
  const itemList = document.getElementById("item-list");

  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.price;
    option.textContent = `${item.name} $${item.price}`;
    itemList.appendChild(option);
  });
}

async function loadStateTaxes() {
  const response = await fetch("./data/stateTaxes.json");
  const states = await response.json();
  const stateList = document.getElementById("tax-input");

  states.forEach((state) => {
    const option = document.createElement("option");
    option.value = state.tax;
    option.textContent = `${state.state} - ${state.tax}%`;
    stateList.appendChild(option);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  loadItems();
  loadStateTaxes();
});

let selectedItems = [];

function clearBasket() {
  selectedItems = [];
  document.getElementById("total-discount").textContent = "";
  document.getElementById("tax-paid").textContent = "";
  document.getElementById("total").textContent = "";
  displayItems();
}
function addItem() {
  const itemSelect = document.getElementById("item-list");
  const quantityInput = document.getElementById("item-quantity");

  const price = parseFloat(itemSelect.value);
  const itemName = itemSelect.options[itemSelect.selectedIndex].text;
  const quantity = parseInt(quantityInput.value);

  if (quantity > 0) {
    selectedItems.push({ itemName, price, quantity });

    displayItems();
    quantityInput.value = "";
  } else {
    alert("Please enter a valid quantity.");
  }
}

function displayItems() {
  const container = document.getElementById("items-container");
  container.innerHTML = "";

  selectedItems.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.textContent = `${item.itemName} - Quantity: ${item.quantity} - Total price: $${item.price * item.quantity}`;
    container.appendChild(itemDiv);
  });
}

function getTotal() {
  const taxRate = parseFloat(document.getElementById("tax-input").value) / 100;

  let totalPrice = 0;

  selectedItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });

  let discount = 0;
  if (totalPrice >= 5000) discount = 0.15;
  else if (totalPrice >= 1000) discount = 0.1;
  else if (totalPrice >= 700) discount = 0.07;
  else if (totalPrice >= 500) discount = 0.05;
  else if (totalPrice >= 100) discount = 0.03;

  const discountedTotal = totalPrice * (1 - discount);
  const totalWithTax = (discountedTotal * (1 + taxRate)).toFixed(2);

  document.getElementById("total-discount").textContent = "Today you saved: $" + (totalPrice - discountedTotal).toFixed(2);
  document.getElementById("tax-paid").textContent = "Your tax was: $" + (totalWithTax - discountedTotal).toFixed(2);

  document.getElementById("total").textContent = "Your total is: $" + totalWithTax;
}
