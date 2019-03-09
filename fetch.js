const { ipcRenderer } = require('electron')
//const names = ["hackrush01"]
let $ = require('jquery')
let handle
let repo

async function fetch_data_for_single_user(handle){
    str = "https://api.github.com/users/" + handle + "/events?per_page=100"
    console.log(str)
    const response = await fetch(str);
    const myJson = await response.json();
    console.log(myJson)
    add_table_row(handle, myJson)
    
}

function get_no_of_commits_to_repo(json, repo){

    count = 0
    for (key in json){
        if (json[key].type === "PushEvent" && json[key].repo.name === repo){
            count++
        }
    }
    return count
}

function add_table_row(handle, json){

    console.log("herehereherhe")
    const tbody = document.getElementById('tbody')
    console.log(repo)
    number_of_commits = get_no_of_commits_to_repo(json, repo)
    let something = "<tr>" + "<td>" + handle + "</td>" +"<td>" + number_of_commits + "</td>" +"<td>"+repo+"</td></tr>"
    $('#some-table').append(something)

    
}

async function do_magic(){
    ipcRenderer.on('get-it', (event,message) =>
    {
        const array = message.split(',')
        console.log(array, "here")
        const handle1 = array[0]
        const repo1 = array[1]
        handle = handle1
        repo = repo1
        console.log(handle,repo)
        fetch_data_for_single_user(handle)    
    })
}

document.addEventListener("DOMContentLoaded", do_magic())
