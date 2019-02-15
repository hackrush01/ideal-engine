const names = ["hackrush01", "jackrobison"]

async function fetch_data_for_single_user(name){
    str = "https://api.github.com/users/" + name + "/events?per_page=100"
    console.log(str)
    const response = await fetch(str);
    const myJson = await response.json();
    console.log(myJson)
    return myJson
}

async function fetch_data_for_all_users(){
    requests = []
    for (let index = 0; index < names.length; ++index){
        console.log(names[index])
        requests.push(fetch_data_for_single_user(names[index]))
    }

    results = []
    for (const request of requests){
        results.push(await request)
    }

    result_obj = {}
    for (let index = 0; index < names.length; ++index){
        result_obj[names[index]] = results[index]
    }
    console.log(result_obj)
    return result_obj
}

function get_no_of_commits_to_repo(json, repo_name){
    count = 0
    for (key in json){
        if (json[key].type === "PushEvent" && json[key].repo.name === repo_name){
            count++
        }
    }
    return count
}

function add_table_row(handle, json){
    const tbody = document.getElementById('tbody')
    number_of_commits = get_no_of_commits_to_repo(json, "lbryio/lbry")
    tbody.innerHTML += "<tr>" + 
                   "<td>" + handle + "</td>" +
                   "<td>" + number_of_commits + "</td>" +
                   "</tr>"
    
}

async function do_magic(){
    results = await fetch_data_for_all_users()

    for (key in results){
        add_table_row(key, results[key])
    }
}

document.addEventListener("DOMContentLoaded", do_magic())
