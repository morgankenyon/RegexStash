// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SidebarProvider } from './SideBar';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "regexstash" is now active!');

		// Register the Sidebar Panel
	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			"myextension-sidebar",
			sidebarProvider
		)
	);

	let replaceInFile = vscode.commands.registerCommand('regexstash.replaceInFile', (args: any) => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage("Editor Does Not Exist");
			return;
		}
		var m;
		let fullText = editor.document.getText();

		const regex = new RegExp(args.find, "gm");// /find/gm; // 'g' flag is for global search & 'm' flag is for multiline.

		//searching for previously declared xxx in regex and replacing it with 'yyyy'.
		let textReplace = fullText.replace(regex, args.replace);

		//Creating a new range with startLine, startCharacter & endLine, endCharacter.
		let invalidRange = new vscode.Range(0, 0, editor.document.lineCount, 0);

		// To ensure that above range is completely contained in this document.
		let validFullRange = editor.document.validateRange(invalidRange);

		while ((m = regex.exec(fullText)) !== null) {
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === regex.lastIndex) {
				regex.lastIndex++;
			}

			editor.edit(editBuilder => {
				editBuilder.replace(validFullRange, textReplace);
			})
			//.catch(err => console.log(err));
		}
	})

	context.subscriptions.push(replaceInFile);
}

// This method is called when your extension is deactivated
export function deactivate() {}
