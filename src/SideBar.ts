import * as vscode from "vscode";
import * as fs from 'fs'

export class SidebarProvider implements vscode.WebviewViewProvider {
    _view?: vscode.WebviewView;
    _doc?: vscode.TextDocument;

    constructor(private readonly _extensionUri: vscode.Uri) { }

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,

            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.command) {
                case "replace": {
                    vscode.commands.executeCommand('regexstash.replaceInFile', 
                    {
                        find: data.find,
                        replace: data.replace
                    });
                    break;
                }
            }
        });

    }

    public revive(panel: vscode.WebviewView) {
        this._view = panel;
    }

    private _getHtmlForWebview(webview: vscode.Webview) {

        const filePath = vscode.Uri.joinPath(this._extensionUri, "src", "index.html")
        const resetCssPath = vscode.Uri.joinPath(this._extensionUri, 'media/reset.css');
        const vscodeCssPath = vscode.Uri.joinPath(this._extensionUri, 'media/vscode.css');
        
        //const filePath: vscode.Uri = vscode.Uri.file(path.join(this._extensionUri, 'src', 'html', 'file.html'));
        var html = fs.readFileSync(filePath.fsPath, 'utf8');

        html = html.replace("{{resetStylesheet}}", String(webview.asWebviewUri(resetCssPath)));
        html = html.replace("{{vscodeStylesheet}}", String(webview.asWebviewUri(vscodeCssPath)));
        return html;
        // return `<!DOCTYPE html>
		// 	<html lang="en">
		// 	<head>
        //         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
		// 		<meta charset="UTF-8">
		// 	</head>
        //     <body>
        //         <h2>Regex Stash</h2>
        //         <div>
        //             <table id="regex_table">
        //                 <thead>
        //                     <tr>
        //                         <th>Find</th>
        //                         <th>Replace</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody>
        //                     <tr>
        //                         <td><input id="find_1" size="15" /></td>
        //                         <td><input id="replace_1" size="15" /></td>
        //                         <td><button class="btn" id="trigger_1" onClick="runRegex(1)"><i class="fa fa-exchange"></i></button></td>
        //                     </tr>
        //                 <tbody>
        //             </table>
        //         </div>
        //         <div>
        //             <button class="btn" id="add_option" onClick="addOption()"><i class="fa fa-plus-circle"></i></button>
        //         </div>


        //         <script>
        //             const vscode = acquireVsCodeApi();
        //             function runRegex(number) {
        //                 const findText = document.getElementById('find_' + number).value;
        //                 const replaceText = document.getElementById('replace_' + number).value;

        //                 console.log("Running Regex: " + number);

        //                 vscode.postMessage({
        //                     command: 'replace',
        //                     find: findText,
        //                     replace: replaceText
        //                 })
        //             }

        //             function addOption() {
        //                 var length = document.getElementById("regex_table").rows.length
        //                 var tbodyRef = document.getElementById('regex_table').getElementsByTagName('tbody')[0]
        //                 console.log(length);

        //                 // Insert a row at the end of table
        //                 var newRow = tbodyRef.insertRow();

        //                 // find input insertion
        //                 var findCell = newRow.insertCell();

        //                 var findInput = document.createElement("input");
        //                 findInput.setAttribute("id", "find_" + length);
        //                 findInput.setAttribute("size", "15px");

        //                 findCell.appendChild(findInput); 

        //                 // replace input insertion
        //                 var replaceCell = newRow.insertCell();

        //                 var replaceInput = document.createElement("input");
        //                 replaceInput.setAttribute("id", "replace_" + length); 
        //                 replaceInput.setAttribute("size", "15px");

        //                 replaceCell.appendChild(replaceInput);

        //                 // trigger insertion
        //                 var buttonCell = newRow.insertCell();

        //                 var iElement = document.createElement("i");
        //                 iElement.classList.add("fa");
        //                 iElement.classList.add("fa-exchange");

        //                 var button = document.createElement("button");
        //                 button.classList.add("btn");
        //                 button.setAttribute("id", "trigger_" + length);
        //                 button.setAttribute("onClick", "runRegex(" + length + ")");
        //                 button.appendChild(iElement);

        //                 buttonCell.appendChild(button);
        //             }
        //         </script>
		// 	</body>
		// 	</html>`;
    }
}