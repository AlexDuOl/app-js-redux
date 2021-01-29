//import * as Redux from 'redux';
import { createStore, combineReducers } from 'redux';

//nodes
let input = document.getElementById('input');
let addEmail = document.getElementById('addEmail');
let lista = document.getElementById('lista');
let emailsList = document.getElementById('emailsList')
let todos = {}; //Objeto vacío que recibira el id y valor del input

//Funciones
//Creando la lista de todos dinamicamente
function drawTodos(){
    lista.innerHTML = ''; //Lista vacía
    
    //Actualizar los todos antes de mostrarlos
    //Asignando lo que ya se encuentra en el store
    todos = store.getState().todos;

    for(let key in todos){
        let li = document.createElement('li');
        //li.id = key;
        let classDone = todos[key].done ? "done" : "";//Agregando clase si tiene marcada la llave done como true
        li.innerHTML = `
            <span id="${key}" class="${classDone}">${todos[key].text}</span>
            <span data-id=${key} data-action="delete">X</span>
        `;
        setListeners(li);//Pasando el span a la función del evento click
        lista.appendChild(li);
    }
}

//Creando lista de emails dinamicamente
function drawEmails(){
    emailsList.innerHTML = '';
    let emails = store.getState().emails;

    emails.map(email => {
        let li = document.createElement('li');
        li.innerHTML = `
            <span>${email}</span>
            <span id=${email}>X</span>
        `;
        setEmailClickListener(li)
        emailsList.appendChild(li)
    })
}

//Borrando correo
function setEmailClickListener(li){
    li.addEventListener('click', e => {
       let email = e.target.id;

       store.dispatch({
           type: 'DELETE_EMAIL',
           email
       })
    })
}

function setListeners(li){
    li.addEventListener('click', e => { //Escuchando el click en casa span del li
        
        if(e.target.getAttribute('data-action') === 'delete'){//Comprobando si el span de la X recibió el click y contiene el data-action
            let key = e.target.getAttribute('data-id');//Obteniendo el id del data-id
            //delete todos[key];//Borrando el todo según el id
            //drawTodos(); //Dibujando los todos
            //Disparando acción
            store.dispatch({
                type: 'DELETE_TODO',
                id: key
            })
            return //Para que no continue ejecuntando
        }

        let key = e.target.id;//Obteniendo el valor del id del span cliqueado
        todos[key].done = !todos[key].done;//Cambiando la llave done por lo contrario a lo que ya tiene
        //Disparando acción
        store.dispatch({
            type: 'UPDATE_TODO',
            todo: todos[key]
        })
        //drawTodos();
    });
}

//Listeners
input.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
        let text = e.target.value //Guardando valor del input
        let todo = { text, done:false }
        e.target.value = '';
        //Disparando acción
        store.dispatch({
            type: 'ADD_TODO',
            todo 
        })

        //let id = Object.keys(todos).length //Generando el id (medimos la cantidad de todos hay)
        //todos[id] = {text, done: false}; //Pasando el id como key, asignando el texto como valor y done como falso
        //drawTodos();
    }
});

addEmail.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
        let email = e.target.value;
        e.target.value = '';
        store.dispatch({
            type: 'ADD_EMAIL',
            email
        })
    }
});

//REDUX
//Reducer = Función pura que trabaja con los datos del store
//state: datos que manipula el reducer yq ue viven en el store. El state inicial depende de nuestra app
//action: tienen la información de como cambian los datos

//reducer emails
function emailsReducer(state = [], action){
    switch (action.type) {
        case 'ADD_EMAIL':
            return [...state, action.email]
        case 'DELETE_EMAIL':
            return [...state.filter(email => email !== action.email)]
        default:
            return state;
    }
}

//reducer todos
function todosReducer(state = {}, action){
    switch (action.type) {
        case 'ADD_TODO'://Tipo de acción y retorna lo que pasa en nuestro estado
            action.todo['id'] = Object.keys(state).length//Agregando el id al todo
            return { ...state, [Object.keys(state).length]: action.todo }//Se devuelve un nuevo objeto a partir de los keys 
                                                                        //que ya hay en el state y agregamos la nueva llave
        case 'UPDATE_TODO':
            return { ...state, [action.todo.id]:action.todo }//Se devuelve un nuevo objeto a partir de los keys
                                                            // que ya hay en el state y se actualiza un todo a partir de la key (id) del mismo todo
        case 'DELETE_TODO':
            delete state[action.id]//Borramos del state el todo con el id
            return { ...state } //Se devuelve un nuevo objeto a partir de los keys que ya hay en el state
        default:
            return state;//Estado por default
    }
}

//Combinando reducers
let rootReducer = combineReducers({
    todos: todosReducer,
    emails: emailsReducer
})

//Store
//Creando el store que recibe el reducer y un estado inicial. Guardandolo en variable
let store = createStore(rootReducer, {
    emails:['ejemplo2@ejemplo.com'],
    todos:{
        0:{
            text: 'crear store',
            done: true,
            id: 0
        }
    }
});

//sustituir los todos
//todos = store.getState();//Asignando lo que ya se encuentra en el store

//que hacer cuando hay cambios
//store.subscribe(drawTodos);//se envía cono callback
store.subscribe(()=> {
    drawTodos(),
    drawEmails()
});
//init
drawTodos();
drawEmails();