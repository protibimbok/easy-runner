import * as vscode from 'vscode';
import {dirname, basename} from 'path';
var lastPath : string | null = null;

export function activate(context: vscode.ExtensionContext) {

	
	let disposable = vscode.commands.registerCommand('easyRunner.runCode', doJob);

	context.subscriptions.push(disposable);
}

function escapeSlashes(str : string) : string{
	return str.replace(/\\|\//g, function(a){
		return "\\"+a;
	});
}

function filter(str : string) : string{
	return str.replace(/([\\\/]+)/g, function(a){
		return a[0];
	});
}

function getTerminal(workSpace : boolean): vscode.Terminal{
	if(!workSpace){
		for(let i = 0;i<vscode.window.terminals.length;i++){
			if(vscode.window.terminals[i].name === 'easyRunnerSingle'){
				return vscode.window.terminals[i];
			}
		}
		lastPath = null;
		return vscode.window.createTerminal('easyRunnerSingle');
	}
	for(let i = 0;i<vscode.window.terminals.length;i++){
		if(vscode.window.terminals[i].name !== 'easyRunnerSingle'){
			return vscode.window.terminals[i];
		}
	}
	return vscode.window.createTerminal('Easy Runner');
}

function doJob(){
	let cfg = vscode.workspace.getConfiguration('easyRunner.fileTypes'), cmdStr="", workSpace = true;

	if(!vscode.window.activeTextEditor || !vscode.window.activeTextEditor.document){
		vscode.window.showInformationMessage("Please click in the editor you want to run");
		return;
	}
	let filePath = vscode.window.activeTextEditor.document.fileName,
		workSpacePath, ter : vscode.Terminal,
		fileBaseName = basename(filePath),
		ext = fileBaseName.substr(fileBaseName.lastIndexOf("."), fileBaseName.length - 1),
		fileDir = dirname(filePath);

	if(!filePath || !ext || typeof cfg[ext] !== 'string'){
		vscode.window.showInformationMessage("Go to setting to add support for "+ext+" files!");
		return;
	}


	if(vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0]){
		workSpacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
		if(!fileDir.startsWith(workSpacePath)){
			workSpacePath = fileDir;
			workSpace = false;
		}
	}else{
		workSpacePath = fileDir;
	}
	ter = getTerminal(workSpace);
	
	ter.show();
	let fileNameNoExt = fileBaseName.substr(0, fileBaseName.lastIndexOf(".")),
		fileDirWorkSpace = fileDir.replace(new RegExp("^"+escapeSlashes(workSpacePath)), "");
	
	
	try {
		eval("cmdStr = `"+escapeSlashes(cfg[ext])+"`");
		cmdStr = filter(cmdStr);

		if(!workSpace && lastPath !== workSpacePath){
			lastPath = workSpacePath;
			ter.sendText("cd "+workSpacePath, true);
		}
		if(vscode.workspace.getConfiguration('easyRunner').clear===true){
			ter.sendText("clear", true);
		}
		if(vscode.workspace.getConfiguration('easyRunner').executeCommanInOneLine!==true){
			cmdStr.split("&&").forEach(function(cmd){
				ter.sendText(cmd, true);
			});
		}else{
			ter.sendText(cmdStr, true);
		}

	} catch (error) {
		vscode.window.showInformationMessage("Some error occured!");
	}
}
export function deactivate() {}
