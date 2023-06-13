function login_response(response) {
        if (response.status >= 400) {
                console.warn("User registration exited with code " + response.status);
                response.json().then((json) => {
                        console.warn("Exit message : " + json.msg)
                        alert("An error occurred while creating your account (" +
                                (response.status) + ") : " + json.msg)
                })
        } else {
                response.json().then((json) => {
                        window.location.href = "http://127.0.0.1:3000/user";
                })
        }
}

function login_user() {
        fetch("http://127.0.0.1:3000/login", {
                method: "POST",
                body: JSON.stringify({
                        email: document.getElementById("i_mail").value,
                        password: document.getElementById("i_pass").value
                }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
        }).then((response) => login_response(response))
}

function change_loc(response) {
        if (response.status >= 400) {
                console.warn("User does not exist : " + response.status);
                response.json().then((json) => {
                        //id invalid
                        console.warn("Exit message : " + json.msg)
                        var date = new Date();
                        date.setTime(date.getTime() - 1);
                        document.cookie = "token=; expires=" + date.toGMTString();
                        document.cookie = "id=; expires=" + date.toGMTString();
                })
        } else {
                //token and id valid
                document.getElementsByTagName("html")[0].innerHTML = "<title>Epytodo | Redirection</title>Already connected, redirecting in 3 seconds..."
                window.setTimeout(function () {
                        window.location.href = "http://127.0.0.1:3000/user";
                }, 3000);
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

document.getElementById("login_form").addEventListener('submit', (event) => {
        event.preventDefault()
        login_user()
});
check_cookie()