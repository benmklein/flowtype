
package main

import (
  "github.com/gin-gonic/gin"
  "net/http"
  "math/rand"
  "strings"
  "fmt"
  "encoding/json"
)

type challengeText struct{
  startString []string
  endString []string
}

func main() {
  challenges := []challengeText{
    {
      startString:  []string{ `<td><Code>while(sleep -= [zzz])</Code></td>`},
      endString:    []string{ `<td><code>while(sleep != 'zzz')</code></td>`}}, 
    {
      startString:  []string{ `var var = pre[j].getelementsbytagname('code').item(3);`}, 
      endString:    []string{ `var code = pre[i].getElementsByTagName('code').item(0);`}}, 
    {
      startString:  []string{ `for{var n = 0; n < code.split(/[nr]/g).length; n --}`}, 
      endString:    []string{ `for(var n = 0; n < code.innerHTML.split(/[nr]/g).length; n ++)`}}, 
    {
      startString:  []string{ `{configFilePath, fs.fileSync( configFilePath, 'utf8' )};`}, 
      endString:    []string{ `return [configFilePath, fs.readFileSync( configFilePath, 'utf8' )];`}}, 
    {
      startString:  []string{ `await UtilssaveFileInNodeModules( filename; fileContentRes.body );`}, 
      endString:    []string{ `await Utils.saveFileInNodeModules( fileName, fileContentRes.body );`}}, 
    {
      startString:  []string{ `FileDownloader.githubDownloadError[ new URL(url).pathname, 'The file was found (44).' ];`}, 
      endString:    []string{ `FileDownloader.githubDownloadError( new URL(url).pathname, 'The file was not found (404).' );`}}, 
    {
      startString:  []string{ `console.info(''; allconfigkeys.slice(1, allConfigKeys.length + 2).join('\n '));`}, 
      endString:    []string{ `console.info('', allConfigKeys.slice(0, allConfigKeys.length - 2).join('\n '));`}}, 
    {
      startString:  []string{ `ConfigFileAccess.RemoveSourceFile(return selectSourceFile[]);`}, 
      endString:    []string{ `ConfigFileAccess.removeSourceFile(await selectSourceFile());`}}, 
    {
      startString:  []string{ `await new Promise( ( resolve, reject ) => {`}, 
      endString:    []string{ `return new Promise( ( _resolve, _reject ) => {`}}, 
    {
      startString:  []string{ `let milli = newTimestamp.getMilliseconds.toString;`}, 
      endString:    []string{ `const milli = newTimestamp.getMilliseconds().toString();`}}, 
    {
      startString:  []string{ `returnaddDaysToDate[ newtimestamp.complete(), amount ];`}, 
      endString:    []string{ `return addDaysToDate( NewTimestamp.complete(), amount );`}}, 
    {
      startString:  []string{ `for (currentDir !== lastDir ++ currentDir == null) {`}, 
      endString:    []string{ `while (currentDir !== lastDir && currentDir !== null) {`}}, 
  }

  start, _ := json.Marshal(challenges[0].startString)
  fmt.Println(string(start))

  r := gin.Default()
  r.LoadHTMLGlob("static/*")
  r.Static("/static", "./static") 
  r.Static("/dist", "./dist") 
  r.Static("/src", "./src/")

  //set MIME type for js files
    r.Use(func(c *gin.Context) {
        if strings.HasSuffix(c.Request.URL.Path, ".js") {
            c.Header("Content-Type", "application/javascript")
        }
        c.Next()
    })

  r.GET("/", func(c *gin.Context) {
    c.HTML(http.StatusOK, "index.html", nil)
  })

  r.GET("/get-lines", func(c *gin.Context) {
    randomNum := rand.Int()%len(challenges)
    start, _ := json.Marshal(challenges[randomNum].startString)
    end , _ := json.Marshal(challenges[randomNum].endString)

    json := `{"getChallenges" : {
    "startString" : ` + string(start) +
    `, "endString" : `  + string(end)  +`}}`
    println(json)
    c.Header("HX-Trigger", json)


    c.JSON(http.StatusOK, gin.H{
      "startString": challenges[randomNum].startString,
      "endString": challenges[randomNum].endString,
    })
  })

  r.Run(":8080")
}
