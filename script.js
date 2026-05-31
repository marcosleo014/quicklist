const form = document.querySelector('form');
const inputName = document.querySelector('#elementName');
const listContainer = document.querySelector('.list-of-elements');
const emptyMsgContainer = document.querySelector('.empty-list-msg');
const msgToastContainer = document.querySelector('.msg-toast');
const btnToast = document.querySelector('.close-toast');
const controlSelection = document.querySelector('#control-selection');
const btnCleanList = document.querySelector('.clean-list-container');
const listConstrolsContainer = document.querySelector('.list-controls');

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
    checkboxStatusVerification();
}

// ----------------- evento submit --------------
form.onsubmit = (event) => {
    event.preventDefault();
    const itemName = inputName.value.trim();
    if (!itemName) {
        toastMsg('Adicione uma descrição do item', true);
        inputName.value = ''
        return
    }
    const id = Date.now()
    listItems.push(
        {
            id: id,
            itemName: itemName,
            checked: false
        }
    );
    inputName.value = ''
    createElement(itemName, false, id);
    saveListToLocalStorage();
    toastMsg('Item adicionado com sucesso!', false);
    checkboxStatusVerification();
};

// ----------- adiciona um item no elements-area ------------------------
function createElement(itemName, checked, id) {
    const li = document.createElement('li');
    const input = document.createElement('input');
    const button = document.createElement('button');
    const label = document.createElement('label');

    li.classList.add('element-list');
    li.setAttribute('data-id', id);
    input.type = 'checkbox';
    input.name= 'verification';
    input.checked = checked;
    input.id = id
    label.setAttribute('for', id);
    button.setAttribute('aria-label', 'remover item da lista');
    
    label.innerText = itemName;
    
    li.append(input, label, button);
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
        checkboxStatusVerification();
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
        toastMsg('Item removido da lista', true)
    };
});

// ------------------ mensagem informando lista vazia ------------
function emptyListMsg() {
    if (listItems.length) {
        emptyMsgContainer.style.display = 'none';
        listConstrolsContainer.style.display = 'flex'
    } else {
        setTimeout( () => {
            emptyMsgContainer.style.display = 'block';
        }, 350)
        listConstrolsContainer.style.display = 'none'
    }
};

// -------------------- toast msg -----------------
let toastTimeout;

function toastMsg(msg, warning) {
    btnToast.closest('aside').style.display = 'flex';
    msgToastContainer.innerText = msg;
    const toastContainer = msgToastContainer.closest('.toast-notification');
    if (warning) {
        toastContainer.style.backgroundColor = '#C93847';
    } else {
        toastContainer.style.backgroundColor = '#2E7D32';
    }
    toastContainer.classList.remove('toast-off');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout( () => {
        toastContainer.classList.add('toast-off');
    }, 4000);
}

// --------------- button close of toast ----------------
btnToast.addEventListener('click', () => {
    btnToast.closest('aside').style.display = 'none'
})

// ---------------- seleção dos itens na lista ----------------
controlSelection.addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
        if (controlSelection.checked) {
            listItems.forEach( item => item.checked = true)
            toastMsg('Todos os itens foram marcados', false);
            saveListToLocalStorage();
            attCheckboxInViewerport(true);
        } else {
            listItems.forEach( item => item.checked = false)
            toastMsg('Todos os itens foram desmarcados', false)
            saveListToLocalStorage();
            attCheckboxInViewerport(false);
        }
    }
})

// função que atualiza os checkbox na tela
function attCheckboxInViewerport(checkedStatus) {
    document.querySelectorAll('.element-list>input[type="checkbox"]').forEach(
        checkbox => checkbox.checked = checkedStatus
    );
}

// verifica qual deve ser o status do boltão de controle de seleção
function checkboxStatusVerification() {
    if (listItems.find(item => item.checked == false)) {
        console.log('marcar todos');
        controlSelection.checked = false;
    } else {
        console.log('desmarcar todos');
        controlSelection.checked = true;
    }
}

// ---------------- esvaziar lista -----------------
btnCleanList.onclick = () => {
    document.querySelectorAll('.element-list').forEach((item) => {
        item.classList.add('remove-item');

        setTimeout(() => {
            item.remove();
        }, 350);
    });
    listItems = [];
    saveListToLocalStorage();
    toastMsg('Todos os itens foram removidos', true);
    emptyListMsg();
};