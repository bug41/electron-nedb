// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const {remote} = require('electron');

const dbInstance = remote.getGlobal('db');

function createTodoItemView(content, _id) {
    const liNode = document.createElement('li');

    liNode.onclick = function() {
        console.log("1111"+ _id)
    }

    // close button
    const span = document.createElement("span");
    span.className = 'close';
    span.setAttribute('data-id', _id);
    span.onclick = function () {
        dbInstance.delete(_id).then(result => {            
            //document.getElementById('myInput').value = null;            
            updateView();
        });
    }
    const txt = document.createTextNode("\u00D7");
    span.appendChild(txt);

    // update button
    const span_u = document.createElement("span");
    span_u.textContent = "수정";
    span_u.className = 'update';
    span_u.setAttribute('data-id', _id);

    let flag = false;    
    span_u.onclick = function () {

        if (!flag) {
             let input = document.createElement("input");
            input.type = "text";
            input.name = "name_" + _id;
            input.setAttribute('value', content);
            input.onkeydown = function (event) {
                 if (window.event.keyCode == 13) {            
                     alert("여기서 수정되게끔");
                }
            }

            /*
            dbInstance.archive(_id).then(result => {
                //document.getElementById('myInput').value = null;            
                updateView();
            });
            */
            console.log(liNode.childNodes[0].textContent.length + '길이') ;

            liNode.childNodes[0].textContent = "";
            console.log(liNode.childNodes[0] + "콘솔 테스트 ");
            liNode.appendChild(input);
            input.focus();

            flag = true;
        }

       
    }
    

    liNode.textContent = content;
    liNode.appendChild(span_u);
    liNode.appendChild(span);
    return liNode;
}

function updateView() {    
    const todolistNode = document.getElementById('todolist');
    todolistNode.innerHTML = '';

    dbInstance.readAll()
        .then(
        allTodolists => {
            allTodolists.forEach(item => {
            const liNode = createTodoItemView(item.content, item._id);
            todolistNode.appendChild(liNode);
        });
    })
}

document.getElementById('addBtn').addEventListener('click', () => {
    const inputValue = document.getElementById('myInput').value;
    if (inputValue) {
        dbInstance.create({ content: inputValue })
            .then(result => {
            document.getElementById('myInput').value = null;
            updateView();
        })
    }
})

updateView();