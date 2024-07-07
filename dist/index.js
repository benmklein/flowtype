// import * as ace from "./ace-builds/src/ace.js"
// import "./ace-builds/src-noconflict/mode-javascript.js";
// import "./ace-builds/src-noconflict/theme-monokai.js"; 
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Ace from "ace-builds";
import htmx from 'htmx.org';
let editor;
let goaleditor;
let score = 0;
let scoreBox;
// TODO: diff_match_patch to highlight line diffs
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    editor = Ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/javascript");
    editor.setKeyboardHandler("ace/keyboard/vim");
    editor.setOptions({
        fontSize: "12pt"
    });
    goaleditor = Ace.edit("goaleditor");
    goaleditor.setTheme("ace/theme/monokai");
    goaleditor.session.setMode("ace/mode/javascript");
    goaleditor.setReadOnly(true);
    goaleditor.setOptions({
        fontSize: "12pt"
    });
    scoreBox = document === null || document === void 0 ? void 0 : document.getElementById('scoreBox');
    setInterval(getLines, 5000);
    (_a = document.getElementById('editor')) === null || _a === void 0 ? void 0 : _a.addEventListener('keyup', compareTextLines);
    htmx.on("htmx:afterRequest", function (evt) {
        if (evt.detail.elt.id === 'compareButton') {
            evt.detail.elt.setAttribute('disabled', true);
        }
    });
}));
document.body.addEventListener("getChallenges", function (e) {
    console.log("getChallenges trigged");
    const editUM = editor.session.getUndoManager();
    const goalUM = goaleditor.session.getUndoManager();
    editor.session.getDocument().insertFullLines(editor.session.getLength() + 1, e.detail.startString);
    goaleditor.session.getDocument().insertFullLines(goaleditor.session.getLength() + 1, e.detail.endString);
    editor.session.setUndoManager(editUM);
    goaleditor.session.setUndoManager(goalUM);
});
function normalizeText(text) {
    return text.replace(/\s+/g, ' ').trim();
}
function compareTextLines() {
    console.log('compareTextLines ran.');
    let min = Math.min(editor.session.getDocument().getLength(), goaleditor.session.getDocument().getLength());
    let editorLines = editor.session.getDocument().getLines(0, min);
    let goalLines = goaleditor.session.getDocument().getLines(0, min);
    let matchingList = [];
    for (let i = min - 1; i >= 0; i--) {
        if (normalizeText(editorLines[i]) == normalizeText(goalLines[i])) {
            matchingList.push(i);
        }
    }
    console.log("Matching lines:", ...matchingList);
    matchingList.forEach((e) => {
        editor.session.getDocument().removeFullLines(e, e);
        goaleditor.session.getDocument().removeFullLines(e, e);
        score++;
        if (scoreBox) {
            scoreBox.innerHTML = score.toString();
        }
    });
}
function getLines() {
    htmx.ajax("GET", "/get-lines", {
        swap: "none"
    });
}
