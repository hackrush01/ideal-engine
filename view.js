let $ = require('jquery')
let fs = require('fs')
let filename = 'contacts'
let sno = 0
const { ipcRenderer } = require('electron')

$('#add-to-list').on('click', () => {
   let name = $('#Name').val()
   let email = $('#Email').val()
   console.log(name,email)

   localStorage.setItem(name, email)

   // fs.appendFile(filename,name + ',' + email+'\n',(err) => {
   //       if(err)
   //          console.log(err)
   //    })

   addEntry(name, email)
   //loadAndDisplayContacts()
})



$('#add-to-list-from-csv').on('click', () => {

 var fileUpload = document.getElementById("fileUpload");

    if (!fileUpload.value.endsWith(".csv") && !fileUpload.value.endsWith(".txt")){
        alert("Please upload a valid CSV file.");
    } else if (typeof(FileReader) == "undefined" && typeof(Storage) == "undefined"){
        alert("This browser does not support HTML5.");
    } else {
        do_upload(fileUpload);
    }
})


function do_upload(file){
    var reader = new FileReader();
    reader.readAsText(fileUpload.files[0]);
    
    reader.onload = (e) => {
        var rows = e.target.result.split("\r\n");
        var groups = {};

        if (rows.length < 1) {
            alert("Empty csv file");
            return
        }

        for (var i = 0; i < rows.length; i++) {
            if(rows[i] == "") continue
         
            const cells = rows[i].split(",");
          if(cells[0] == "") continue
            const group_number = cells[3];
            const student_detail = {name: cells[0], gh_handle: cells[1], repository: cells[2]};

            if (group_number in groups){
                groups[group_number].push(student_detail)
            } else {
                groups[group_number] = [student_detail];
            }
        }

        for (var key in groups) {
            localStorage.setItem(key, JSON.stringify(groups[key]));
        }
    }
    document.getElementById("fileUpload").value = "";
}



$('#del-from-list').on('click', () => {
	// fs.unlink(filename, function(err)
	// {
	// 	if(err)
	// 	{
	// 		return console.error(err)
	// 	}
	// 	console.log("file deleted")
	// 	sno=0
	// 	$('#contact-table td').remove()
	// })
  console.log("file deleted")
    sno=0
    $('#contact-table tr').remove()
    localStorage.clear();
	//loadAndDisplayContacts()
})



function addEntry(name, email) {

   if(name && email) {
      sno++
      // let updateString = '<tr><td>'+ sno + '</td><td>'+ name +'</td><td>' 
      //    + email +'</td>'+ '<td><button class = "btn btn-primary" name = '+name+' id = "take-from-list">Details</button></td></tr>'
      // $('#contact-table').append(updateString)
      const table = document.getElementById('contact-table')
      const arr = [name,email]
      table.innerHTML += "<tr>" + 
                   "<td>" + sno + "</td>" +
                   "<td>" + name + "</td>" +
                   "<td>" + email + "</td>" +
                   "<td><button class = 'btn btn-primary' name = "+arr+" id = 'take-from-list' onclick = 'clickit(name)'>Details</button></td>" +
                   "</tr>"
   }
}

function clickit(name)
{
	document.getElementById('take-from-list').style.color = "red"
	console.log(name)
	ipcRenderer.send('show-popup', name)
}



$('#take-from-list-all').on('click', ()=> 
{
	console.log("click")
	ipcRenderer.send('show-popup-all')

})

function loadAndDisplayContacts() {  
   

   for (var i = 0; i < localStorage.length; i++){
      name = localStorage.key(i)
      email = localStorage.getItem(name)
      addEntry(name,email)
   }
   //Check if file exists
   // if(fs.existsSync(filename)) {
   //    let data = fs.readFileSync(filename, 'utf8').split('\n')
      
   //    data.forEach((contact, index) => {
   //       let [ name, email ] = contact.split(',')
   //       addEntry(name, email)
   //    })
   
   // } else {
   //    console.log("File Doesn\'t Exist. Creating new file.")
   //    fs.writeFile(filename, '', (err) => {
   //       if(err)
   //          console.log(err)
   //    })
   // }
}

loadAndDisplayContacts()
