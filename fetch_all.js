let $ = require('jquery')
let fs = require('fs')
let filename = 'contacts'
let sno = 0
const { ipcRenderer } = require('electron')
let handle
let repo

async function fetch_data_for_single_user(handle,repo){
    str = "https://api.github.com/users/" + handle + "/events?per_page=100"
    console.log(str)
    const response = await fetch(str);
    const myJson = await response.json();
    console.log(myJson)
    add_table_row(handle, myJson, repo)
    
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

function add_table_row(handle, json, repo){

    console.log("herehereherhe")
    const tbody = document.getElementById('tbody')
    console.log(repo)
    number_of_commits = get_no_of_commits_to_repo(json, repo)
    let something = "<tr>" + "<td>" + handle + "</td>" +"<td>" + number_of_commits + "</td>" +"<td>"+repo+"</td></tr>"
    $('#some-table').append(something)

    
}

async function do_magic(){
    ipcRenderer.on('get-it', (event) =>
    {
        for (var i = 0; i < localStorage.length; i++){
            handle = localStorage.key(i)
            repo = localStorage.getItem(handle)
            console.log(handle,repo)
            fetch_data_for_single_user(handle, repo)
        }
        // if(fs.existsSync(filename)) {
        //     let data = fs.readFileSync(filename, 'utf8').split('\n')
            
        //     data.forEach((contact, index) => {
        //        [ handle, repo ] = contact.split(',')
        //        console.log(handle,repo)
        //        fetch_data_for_single_user(handle, repo)
        //     })
         
        //  } else {
        //     console.log("File Doesn\'t Exist.")
        //  }
    })
}

document.addEventListener("DOMContentLoaded", do_magic(handle,repo))
