import * as Ace from "ace-builds/ace"
import htmx from 'htmx.org'

let editor : Ace.Ace.Editor
let goaleditor : Ace.Ace.Editor;
let score = 0;
let scoreBox : HTMLElement | null;
// TODO: diff_match_patch to highlight line diffs

document.addEventListener('DOMContentLoaded', async () => {

  editor = Ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/javascript");
  editor.setKeyboardHandler("ace/keyboard/vim");
  editor.setOptions({
    fontSize: "12pt"
  })

  goaleditor = Ace.edit("goaleditor")
  goaleditor.setTheme("ace/theme/monokai")
  goaleditor.session.setMode("ace/mode/javascript")
  goaleditor.setReadOnly(true)
  goaleditor.setOptions({
    fontSize: "12pt"
  })
  
  scoreBox = document?.getElementById('scoreBox')

  setInterval(getLines, 5000)

  document.getElementById('editor')?.addEventListener('keyup', compareTextLines);
  htmx.on("htmx:afterRequest", function(evt) {
    if ((<CustomEvent>evt).detail.elt.id === 'compareButton') {
      (<CustomEvent>evt).detail.elt.setAttribute('disabled', true);
    }
  })
});

document.body.addEventListener("getChallenges", function(e){
    console.log("getChallenges trigged")
    const editUM = editor.session.getUndoManager()
    const goalUM = goaleditor.session.getUndoManager()

    editor.session.getDocument().insertFullLines(editor.session.getLength() + 1, (<CustomEvent>e).detail.startString)
    goaleditor.session.getDocument().insertFullLines(goaleditor.session.getLength() + 1, (<CustomEvent>e).detail.endString)

    editor.session.setUndoManager(editUM)
    goaleditor.session.setUndoManager(goalUM)
})

function normalizeText(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

function compareTextLines() {
  console.log('compareTextLines ran.')
  let min = Math.min(editor.session.getDocument().getLength(), goaleditor.session.getDocument().getLength())
  let editorLines = editor.session.getDocument().getLines(0, min)
  let goalLines = goaleditor.session.getDocument().getLines(0, min)
  let matchingList = [];
  for (let i=min-1; i>=0; i--) {
    if (normalizeText(editorLines[i]) == normalizeText(goalLines[i])){
      matchingList.push((<never>i))
    }
  }
  console.log("Matching lines:", ...matchingList)
  matchingList.forEach( (e)=> {
    editor.session.getDocument().removeFullLines(e, e)
    goaleditor.session.getDocument().removeFullLines(e, e)
    score++
    if (scoreBox){
      scoreBox.innerHTML = score.toString()
    }
  })
}

function getLines() {
    htmx.ajax("GET", "/get-lines", {
      swap: "none"
    })
}
