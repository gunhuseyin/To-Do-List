const itemForm=document.getElementById('item-form');
const formInput=document.getElementById("text-input");
const formBtn=itemForm.querySelector('button');
const allBtn=document.querySelector('.selections button:nth-child(1)');
const complatedBtn=document.querySelector('.selections button:nth-child(2)');
const unComplatedBtn=document.querySelector('.selections button:nth-child(3)');
const listItem=document.getElementById('list');
const clearBtn= document.querySelector('.btn-clear');
const filterInput= document.getElementById('filter');
let activeBtn = allBtn;
let isEditMode=false;

function displayItemsFromStorage(){
    const itemsFromStorage=getItemFromStorage();

    for (let i in itemsFromStorage) {
        addItemToDom(itemsFromStorage[i][0]);
    
    }


}

function onAddItemSubmit(e){
    e.preventDefault();

    let newItem =formInput.value;

    if (newItem===''){
        alert("Please add something")
        return;
    }

    if (isEditMode){
        const editItem= listItem.querySelector('.edit-mode');

        removeItemFromStorge(editItem.textContent);
        editItem.remove();

        isEditMode=false;

    }else {
        if (checkIteIfExist(newItem)) {
            alert("That Item alerady exist!")
            return;
        }
    }
    //add Item to Local Storage
    addItemToStorage(newItem);

    //add Item to DO
    addItemToDom(newItem);

    

}

function checkIteIfExist(item){
    const itemsFromStorage=getItemFromStorage();                                  
    return Object.keys(itemsFromStorage).includes(item);
}

function addItemToDom(item){
    let itemsFromStorage= getItemFromStorage();

    //We will create elemnt and add list so i will do it with a few function
    const li =document.createElement('li');

    const checkBox= createCheckBox('check');
    if (itemsFromStorage[item][1]=== true){
        checkBox.checked = true;
        
    }else {
        checkBox.checked = false;
    }
    li.appendChild(checkBox);
    const label=document.createElement('label');
    label.textContent=item;
    li.appendChild(label);
    
    const icon= createIcon('fas fa-close');

    const button = createButton('btn-link');
    button.appendChild(icon);
    li.appendChild(button);

    listItem.appendChild(li);

    checkBoxStateChenged(checkBox);

    checkUI()


}

function createCheckBox(classes){
    const checkBox= document.createElement('input');
    checkBox.type='checkbox';
    checkBox.className=classes;
    return checkBox;
}

function createIcon(classes){
    const icon= document.createElement('i');
    icon.className=classes;
    return icon;
}
function createButton(classes){
    const button = document.createElement('button');
    button.className=classes;
    return button;
}

function addItemToStorage(item){
    // we will use localStorage e few time so getLocalstorage function can be more usefull
    let itemsFromStorage=getItemFromStorage();
    itemsFromStorage[item]=[item,false];
    localStorage.setItem('items',JSON.stringify(itemsFromStorage));
    
}

function getItemFromStorage(){
    let itemsFromStorage;

    if (localStorage.getItem('items')===null){
        itemsFromStorage={};
    }else {
        itemsFromStorage=JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}

function onClickListItem(e){
    if (e.target.parentElement.classList.contains('btn-link')){
        removeItem(e.target.parentElement.parentElement)
    }else if (e.target.tagName==='INPUT'){
        checkBoxStateChenged(e.target)
    }else if (e.target.tagName==='LABEL'){
        setItemToEdit(e.target);
    }
}

function removeItem(item){

    if (confirm('Are You Sure?')){
        // remove from DOM
        item.remove();

        // remove from local stroge
        removeItemFromStorge(item.textContent)
    }

    checkUI()
}

function removeItemFromStorge(item){
    let itemsFromStorage = getItemFromStorage();

    delete itemsFromStorage[item];

    localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}

function checkBoxStateChenged(checkBox){
    const itemsFromStorage= getItemFromStorage();
    const li = checkBox.parentElement
    const item =  checkBox.parentElement.textContent
    if (checkBox.checked) {
        li.style.textDecoration='line-through';
        itemsFromStorage[item][1]= true;

    }else {
        li.style.textDecoration='none';
        itemsFromStorage[item][1]=false;
        
    }
    localStorage.setItem('items',JSON.stringify(itemsFromStorage));
    activeBtn.click();
}

function setItemToEdit(item){
    isEditMode=true;
    listItem.querySelectorAll('li').forEach(item => item.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    formBtn.innerHTML='<i class="fas fa-solid fa-plus"></i> Update İtem'
    formBtn.style.backgroundColor='#228B22';
    formInput.value=item.textContent;
}

function clearItems(){
    if (confirm("Are you sure? All will delete!")){
        
        while (listItem.firstChild){
            listItem.removeChild(listItem.firstChild);
        
        }

        localStorage.removeItem('items');

        checkUI()
    }
}

function filterItems(e){
    const items = document.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach(item => {
        const itemName= item.textContent.toLowerCase();
        if (itemName.indexOf(text) != -1 || text=== ''){
            item.style.display='grid';
        }else {
            item.style.display='none';

        }
    })

}

function reLoadItems(e){
    activeBtn=e.target;
    const text=e.target.textContent;
    const btns =document.querySelectorAll('.selections button');

    btns.forEach(item => {
        if (item.textContent=== text){
            item.classList.add('border-line');
        }else {
            item.classList.remove('border-line');
        }
    })
    const itemsFromStorage= getItemFromStorage();
    while (listItem.firstChild){
        listItem.removeChild(listItem.firstChild);
    }
        
    if (text === 'All'){
        displayItemsFromStorage();
    }else if (text === 'Complated'){

        for( let i in itemsFromStorage){
            if (itemsFromStorage[i][1]=== true){
                addItemToDom(itemsFromStorage[i][0]);

            }
        }

    }else if (text==='Uncomplated'){

        for( let i in itemsFromStorage){
            if (itemsFromStorage[i][1]=== false){
                addItemToDom(itemsFromStorage[i][0]);

            }
        }

    }else {
        displayItemsFromStorage();
    }
    
}

function checkUI(){
    formInput.value='';
    const selectionsDiv=document.querySelector('.selections');
    const items=document.querySelectorAll('li');
    if (items.length=== 0){
        filterInput.style.display='none';
        clearBtn.style.display='none';
        selectionsDiv.style.display='none';
        
    }else {
        filterInput.style.display='block';
        clearBtn.style.display='block';
        selectionsDiv.style.display='grid';
    }

    formBtn.innerHTML='<i class="fas fa-solid fa-plus"></i> Add İtem'
    formBtn.style.backgroundColor='#333';
}

function init(){
    itemForm.addEventListener('submit',onAddItemSubmit);
    listItem.addEventListener('click',onClickListItem);
    clearBtn.addEventListener('click',clearItems);
    filterInput.addEventListener('input',filterItems);
    allBtn.addEventListener('click',reLoadItems);
    complatedBtn.addEventListener('click',reLoadItems);
    unComplatedBtn.addEventListener('click',reLoadItems);
    document.addEventListener('DOMContentLoaded',displayItemsFromStorage);
    checkUI();

}

init()
