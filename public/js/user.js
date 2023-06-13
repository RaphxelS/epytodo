function handle_response_todo(response) {
        if (response.status >= 400) {
                console.warn("/todos returned code " + response.status);
                response.json().then((json) => {
                        console.warn("Exit message : " + json.msg)
                        alert("An error occured when creating this todo (" +
                                (response.status) + ") : " + json.msg)
                })
        } else {
                response.json().then((json) => {
                        create_dom_todo(json)
                })
        }
}

function add_todo() {
        console.log(document.getElementById("d_ttime").value)
        fetch("http://127.0.0.1:3000/todos", {
                method: "POST",
                body: JSON.stringify({
                        title: document.getElementById("i_tadd_title").value,
                        description: document.getElementById("i_tadd_desc").value,
                        due_time: document.getElementById("d_ttime").value,
                        user_id: document.getElementById("t_tuser").value,
                        status: document.getElementById("t_topt").value
                }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
        }).then((response) => handle_response_todo(response));
}

function handle_todo_remove(response, id) {
        if (response.status >= 400) {
                console.warn("/todos/:" + id + " returned code " + response.status);
                response.json().then((json) => {
                        console.warn("Exit message : " + json.msg)
                        alert("An error occured when deleting this todo (" + +
                                (response.status) + ") : " + json.msg)
                })
        } else {
                document.getElementById('todo_' + id).remove()
        }
}

function remove_todo(id) {
        fetch("http://127.0.0.1:3000/todos/" + id, {
                method: "DELETE",
                headers: { "Content-type": "application/json; charset=UTF-8" }
        }).then((response) => handle_todo_remove(response, id));
}

function update_todo_user(todo_id, response) {
        if (response.status >= 400) {
                console.warn("/user/:" + todo_id + " returned code " + response.status);
                response.json().then((json) => {
                        console.warn("Exit message : " + json.msg)
                })
        } else {
                response.json().then((json) => {
                        document.getElementById('todo_id_' + todo_id).innerHTML = json[0].email
                })
        }
}

function create_dom_todo(element) {
        const sdatet = new Date(element.created_at);
        const enddatet = new Date(element.due_time);
        const status = '<td class="status">' + element.status + '</td>'
        const desc = '<td class="desc">' + element.description + '</td>'
        const time = '<td class="due_dt">' + enddatet.toDateString() + '</td>'
        const s_time = '<td class="st_dy">' + sdatet.toDateString() + '</td>'
        const title = '<td class="title">' + element.title + '</td>'
        const del_btn = '<td class="action"><button class="d_button" onClick="remove_todo(' + element.id + ')">Delete</button></td>'
        const user = '<td id="todo_id_' + element.id + '" class="usr"></td>'
        const dom = '<tr id="todo_' + element.id + '">' + title + desc + s_time + time + user + status + del_btn + '</tr>'

        document.getElementById('todo_lst').innerHTML += dom
        fetch("http://127.0.0.1:3000/users/" + element.user_id, {
                method: "GET",
                headers: { "Content-type": "application/json; charset=UTF-8" }
        }).then((response) => update_todo_user(element.id, response));
        console.log(element)
}

function set_todos() {
        fetch("http://127.0.0.1:3000/todos", {
                method: "GET",
                headers: { "Content-type": "application/json; charset=UTF-8" }
        }).then(response => response.json()).then(json => json.forEach(element => {
                create_dom_todo(element)
        }))
}

function handle_user_remove(response, id) {
        if (response.status >= 400) {
                console.warn("/users/:" + id + " returned code " + response.status);
                response.json().then((json) => {
                        console.warn("Exit message : " + json.msg)
                        alert("An error occured when deleting this todo (" + +
                                (response.status) + ") : " + json.msg)
                })
        } else {
                location.reload();
        }
}

function remove_user(id) {
        fetch("http://127.0.0.1:3000/users/" + id, {
                method: "DELETE",
                headers: { "Content-type": "application/json; charset=UTF-8" }
        }).then((response) => handle_user_remove(response, id));
}

function create_dom_user(element) {
        const name = '<td class="name">' + element.name + '</td>'
        const lname = '<td class="fname">' + element.firstname + '</td>'
        const email = '<td class="email">' + element.email + '</td>'
        const del_btn = '<td class="action"><button class="d_button" onClick="remove_user(' + element.id + ')">Delete</button></td>'
        const dom = '<tr id="user_' + element.id + '">' + name + lname + email + del_btn + '</tr>'

        document.getElementById('user_lst').innerHTML += dom
}

function set_user_list() {
        fetch("http://127.0.0.1:3000/user", {
                method: "GET",
                headers: { "Content-type": "application/json; charset=UTF-8" }
        }).then(response => response.json()).then(json => json.forEach(element => {
                const st = '<option value="' + element.id + '">' + element.email + '</option>'
                document.getElementById('t_tuser').innerHTML += st
                create_dom_user(element)
        }))
}

function change_loc(response) {
        var date = new Date();
        if (response.status >= 400) {
                console.warn("User does not exist : " + response.status);
                response.json().then((json) => {
                        //id invalid
                        console.warn("Exit message : " + json.msg)
                        date.setTime(date.getTime() - 1);
                        document.cookie = "token=; expires=" + date.toGMTString();
                        document.cookie = "id=; expires=" + date.toGMTString();
                        document.getElementsByTagName("html")[0].innerHTML = "<title>Epytodo | Redirection</title>Not connected, redirecting in 3 seconds..."
                        window.setTimeout(function () {
                                window.location.href = "http://127.0.0.1:3000/login";
                        }, 3000);
                })
        } else {
                response.json().then((json) => {
                        document.getElementById('email_txt').innerHTML = json[0].email
                })
        }
}

function check_cookie() {
        const cookie_name = 'token';
        const cookie_id_name = 'id';
        var match_cookie = document.cookie.match(RegExp('(?:^|;\\s*)' + cookie_name + '=([^;]*)'))
        var id_cookie = document.cookie.match(RegExp('(?:^|;\\s*)' + cookie_id_name + '=([^;]*)'))
        var cookie = match_cookie ? match_cookie[1] : null
        var id_ck = id_cookie ? id_cookie[1] : null

        if (cookie != null) {
                fetch("http://127.0.0.1:3000/users/" + id_ck, {
                        method: "GET",
                        headers: { "Content-type": "application/json; charset=UTF-8" }
                }).then((response) => change_loc(response))
        }
}

function logout() {
        var mydate = new Date();
        mydate.setTime(mydate.getTime() - 1);
        document.cookie = "token=; expires=" + mydate.toGMTString();
        document.cookie = "id=; expires=" + mydate.toGMTString();
        window.location.href = "http://127.0.0.1:3000/login";
}

function init() {
        var date = new Date().toISOString().split("T")[0];

        document.getElementById('d_ttime').min = date
        document.getElementById('d_ttime').value = date
        set_user_list()
        set_todos()
}

check_cookie()
init()
document.getElementById("add_form").addEventListener('submit', (event) => {
        event.preventDefault()
        add_todo()
});