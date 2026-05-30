const form = document.querySelector('form');
const inputName = document.querySelector('#elementName');
const listOfElements = document.querySelector('.list-of-elements');

// --------------- pegar a lista de itens do localStore ----------
let listOfItems = localStorage.getItem('quicklist');
if (listOfItems) {
    listOfItems = JSON.parse(listOfItems);
} else {
    listOfItems = [];
};

// ------------- adicionar itens ao carregar a tela ------------
window.onload = () => {
    if (listOfItems.length != 0) {
        listOfItems.forEach((element) => {
        createElement(element.itemName, element.checked, element.id);
    });
    }
}

// ----------------- evento submit --------------
form.onsubmit = (event) => {
    event.preventDefault();
    const itemName = inputName.value.trim();
    const id = Date.now()
    listOfItems.push(
        {
            id: id,
            itemName: itemName,
            checked: false
        }
    );
    createElement(itemName, false, id);
    saveListToLocalStorage();
    inputName.value = ''
};

// ----------- adiciona um item no elements-area ------------------------
function createElement(itemName, checked, id) {
    const li = document.createElement('li');
    const input = document.createElement('input');
    const span = document.createElement('span');
    const button = document.createElement('button');

    li.classList.add('element-list');
    li.setAttribute('data-id', id);
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', 'verification');
    input.checked = checked;
    button.setAttribute('aria-label', 'remover  item da lista');
    
    span.innerText = itemName;
    
    li.append(input, span, button);
    listOfElements.append(li);
}

// ----------------- salva a lista no localStorage -----------
function saveListToLocalStorage() {
    localStorage.setItem(
        'quicklist',
        JSON.stringify(listOfItems)
    );
};

// -------------- verifica e modifica o checked do item na lista ----------
listOfElements.addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
        // coleta do id e do estado do checkbox
        const id = event.target.parentElement.dataset.id;
        const checked = event.target.checked;

        // acesso e modifico o item em listOfItems
        const item = listOfItems.find(element => element.id == id);
        item.checked = checked;
        
        saveListToLocalStorage();
    }
});