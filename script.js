const form = document.querySelector('form');
const inputName = document.querySelector('#elementName');
const listOfElements = document.querySelector('.list-of-elements');

// pegar a lista de itens do localStore
let listOfItems = localStorage.getItem('quicklist');
if (listOfItems) {
    listOfItems = JSON.parse(listOfItems);
} else {
    listOfItems = [];
};

window.onload = () => {
    if (listOfItems.length != 0) {
        listOfItems.forEach((element) => {
        createElement(element.itemName, element.checked);
    });
    }
}

form.onsubmit = (event) => {
    event.preventDefault();
    const itemName = inputName.value.trim();
    listOfItems.push(
        {
            itemName: itemName,
            checked: false
        }
    );
    createElement(itemName, false);
    saveListToLocalStorage();
    inputName.value = ''
};

// ----------- adiciona um item no HTML ------------------------
function createElement(itemName, checked) {
    const li = document.createElement('li');
    const input = document.createElement('input');
    const span = document.createElement('span');
    const button = document.createElement('button');

    li.classList.add('element-list');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', 'verification');
    input.checked = checked;
    button.setAttribute('aria-label', 'remover  item da lista');
    
    span.innerText = itemName;
    
    li.append(input, span, button);
    listOfElements.append(li);
}

function saveListToLocalStorage() {
    localStorage.setItem(
        'quicklist',
        JSON.stringify(listOfItems)
    );
};