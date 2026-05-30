const form = document.querySelector('form');
const inputName = document.querySelector('#elementName');
const listContainer = document.querySelector('.list-of-elements');
const emptyMsgContainer = document.querySelector('.empty-list-msg');

// --------------- pegar a lista de itens do localStore ----------
let listItems = localStorage.getItem('quicklist');
if (listItems) {
    listItems = JSON.parse(listItems);
} else {
    listItems = [];
};

// ------------- adicionar itens ao carregar a tela ------------
window.onload = () => {
    if (listItems.length != 0) {
        listItems.forEach((element) => {
        createElement(element.itemName, element.checked, element.id);
    });
    }
    emptyListMsg();
}

// ----------------- evento submit --------------
form.onsubmit = (event) => {
    event.preventDefault();
    const itemName = inputName.value.trim();
    const id = Date.now()
    listItems.push(
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
    listContainer.append(li);

    emptyListMsg();
}

// ----------------- salva a lista no localStorage -----------
function saveListToLocalStorage() {
    localStorage.setItem(
        'quicklist',
        JSON.stringify(listItems)
    );
};

// -------------- verifica e modifica o checked do item na lista ----------
listContainer.addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
        // coleta do id e do estado do checkbox
        const id = event.target.closest('li').dataset.id;
        const checked = event.target.checked;

        // acesso e modifico o item em listItems
        const item = listItems.find(element => element.id == id);
        item.checked = checked;

        saveListToLocalStorage();
    }
});

// --------------apaga o elemento ----------------------
listContainer.addEventListener('click', (event) => {
    const btn = event.target.closest('button'); // se não clicar na área do botão o closest não encontra nada e retorna null
    if (btn) {
        const item = btn.closest('li');
        const id = item.dataset.id;

        listItems = listItems.filter( item => item.id != id);
        saveListToLocalStorage();

        item.classList.add('remove-item')
        setTimeout(() => {
            item.remove()
        }, 350)

        emptyListMsg();
    };
});

// ------------------ mensagem informando lista vazia ------------
function emptyListMsg() {
    if (listItems.length) {
        emptyMsgContainer.style.display = 'none';
    } else {
        setTimeout( () => {
            emptyMsgContainer.style.display = 'block';
        }, 350)
    }
};