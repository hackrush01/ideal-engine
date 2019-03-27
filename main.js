const { app, BrowserWindow, ipcMain} = require('electron')
const url = require('url')
const path = require('path')

let win
let newwin
let all_newwin

function createWindow()
{
	win = new BrowserWindow({width: 1024, height: 768})
	//win.loadFile('index.html')
	//win.webContents.openDevTools()
	win.loadURL(url.format ({
		pathname: path.join(__dirname, 'page1.html'),
		protocol: 'file:',
		slashes: true
	}))
	win.on('closed', () => {
		win = null
	})

	ipcMain.on('show-popup', (event,message) => 
	{
		if(!newwin)
		{
			newwin = new BrowserWindow({width: 800, height: 600, parent: win})
			//newwin.webContents.openDevTools()
			newwin.loadURL(url.format({
				pathname: path.join(__dirname,'page2.html'),
				protocol: 'file',
				slashes: true
		}))
			
			newwin.webContents.on('did-finish-load', () => {
    		newwin.webContents.send('get-it', message)
    		console.log(message)
  			})

			newwin.on('closed',() =>
			{
				newwin = null
			})
		}
	})
	ipcMain.on('show-popup-all', () => 
	{
		if(!all_newwin)
		{
			all_newwin = new BrowserWindow({width: 800, height: 600, parent: win})
			//all_newwin.webContents.openDevTools()
			all_newwin.loadURL(url.format({
				pathname: path.join(__dirname,'page2_all.html'),
				protocol: 'file',
				slashes: true
		}))
			all_newwin.webContents.on('did-finish-load', () => {
    		all_newwin.webContents.send('get-it')
  			})

			all_newwin.on('closed',() =>
			{
				all_newwin = null
			})
		}
	})

}



app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin')
	{
		app.quit()
	}
})



app.on('activate', ()=> {
	if(win === null)
	{
		createWindow()
	}
})