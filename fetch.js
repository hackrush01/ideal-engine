const { ipcRenderer } = require('electron')
//const names = ["hackrush01"]
let $ = require('jquery')
// let handle
// let repo

async function fetch_data_for_single_user(handle,repo){
    str = "https://api.github.com/users/" + handle + "/events?per_page=100"
    console.log(str)
    const response = await fetch(str);
    const myJson = await response.json();
    console.log(myJson)
    add_table_row(handle, myJson,repo)
    
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

function add_table_row(handle, json,repo){

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
        console.log("hello")
        //const array = message.split(',')
        //console.log(array, "here")
        // const handle1 = array[0]
        // const repo1 = array[1]
        // console.log(repo1)
        // handle = handle1
        // repo = repo1

        console.log(message)
        group=window.localStorage.getItem(message);
        // console.log("helllo")
        group2=JSON.parse(group)
        //console.log(group2)

         for (var i = 0; i < group2.length; i++){
      var handle=group2[i].gh_handle;
     var repo=group2[i].gh_handle+"/"+group2[i].repository;
fetch_data_for_single_user(handle,repo) 

   }
           
    })
}

document.addEventListener("DOMContentLoaded", do_magic())
