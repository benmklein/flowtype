document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
document.getElementById('editor').addEventListener('keyup', compareTextareas);
htmx.on("htmx:afterRequest", function(evt) {
      if (evt.detail.elt.id === 'compareButton') {
        evt.detail.elt.setAttribute('disabled', true);
      }
    })
});
function normalizeText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function compareTextareas() {
  var textarea1 = normalizeText(document.getElementById('editor').value);
  var textarea2 = normalizeText(document.getElementById('goaltext').value);
  var compareButton = document.getElementById('compareButton')
  if (textarea1 === textarea2) {
    compareButton.removeAttribute("disabled")
    console.log("text is the same now")
  } else {
    compareButton.setAttribute(`disabled`, "true")
    console.log("text is not the same")
  } 
}

console.log("test")
