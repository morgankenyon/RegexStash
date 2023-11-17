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

        const filePath = vscode.Uri.joinPath(this._extensionUri, "media", "index.html")
        const resetCssPath = vscode.Uri.joinPath(this._extensionUri, 'media/reset.css');
        const vscodeCssPath = vscode.Uri.joinPath(this._extensionUri, 'media/vscode.css');
        
        var html = fs.readFileSync(filePath.fsPath, 'utf8');

        html = html.replace("{{resetStylesheet}}", String(webview.asWebviewUri(resetCssPath)));
        html = html.replace("{{vscodeStylesheet}}", String(webview.asWebviewUri(vscodeCssPath)));
        return html;
    }
}