import * as vscode from 'vscode';
import {parse} from 'path';
import {spawnSync} from 'child_process';
import {VTexec} from 'open-term';

var lastPath : string | null = null;

export function activate(context: vscode.ExtensionContext) {

	
	let disposable = vscode.commands.registerCommand('easyRunner.runCode', ()=>{
		runCode(false);
	}),
	disposable2 = vscode.commands.registerCommand('easyRunner.runCodeInWindow', ()=>{
		runCode(true);
	}),
	disposable3 = vscode.commands.registerCommand('easyRunner.runButton', ()=>{
		runCode(vscode.workspace.getConfiguration('easyRunner').runInSeparateWindow);
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
	context.subscriptions.push(disposable3);

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



function serCmd(cmd:string):{cmd:string, args:Array<string> | undefined} {
	let p:Array<string> = [];
	let x=cmd.split(" ");
	for(let i=1;i<x.length;i++){
		if(/[^\s]/.test(x[i])){
			p.push(x[i]);
		}
	}
	return {
		cmd: x[0],
		args: p
	};
}

async function ops(cmds:Array<string>, wp:string) {
	let i = 0, childProcess ;

	while(i<cmds.length-1 && cmds[i]){
		let cmd = serCmd(cmds[i]);
		spawnSync(cmd.cmd, cmd.args, {
			cwd: wp
		});
		i++;
	}
	VTexec(cmds[cmds.length-1].replace("./", wp+"/").replace(".\\", wp+"\\"));
}



async function runCode(inWindow:boolean){
	let cfg = vscode.workspace.getConfiguration('easyRunner.fileTypes'), cmdStr="", workSpace = true;

	if(!vscode.window.activeTextEditor || !vscode.window.activeTextEditor.document){
		vscode.window.showInformationMessage("Please click in the editor you want to run");
		return;
	}

	if(vscode.window.activeTextEditor.document.isDirty){
		await vscode.window.activeTextEditor.document.save();
	}

	let filePath = vscode.window.activeTextEditor.document.fileName,
	    filePathObj = parse(filePath),
		workSpacePath : string, ter : vscode.Terminal,
		fileBaseName = filePathObj.base,
		ext = filePathObj.ext,
		fileDir = filePathObj.dir;

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
	let fileNameNoExt = filePathObj.name,
		fileDirWorkSpace = fileDir.replace(new RegExp("^"+escapeSlashes(workSpacePath)), "");
	
	
	try {
		eval("cmdStr = `"+escapeSlashes(cfg[ext])+"`");
		cmdStr = filter(cmdStr);

		if(inWindow){
			vscode.window.withProgress({
				location: vscode.ProgressLocation.Window,
				cancellable: false,
				title: "Compiling file..."
			}, async (prb)=>{
				prb.report({increment: 0});
				await ops(cmdStr.split(" && "), workSpacePath);
				prb.report({increment: 100});
			});
			return;
		}

		if(!workSpace && lastPath !== workSpacePath){
			lastPath = workSpacePath;
			ter.sendText("cd "+workSpacePath, true);
		}
		if(vscode.workspace.getConfiguration('easyRunner').clearOnRun===true){
			ter.sendText("clear", true);
		}
		if(vscode.workspace.getConfiguration('easyRunner').executeCommandInOneLine!==true){
			cmdStr.split(" && ").forEach(function(cmd){
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
