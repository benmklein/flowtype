
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
      startString:  []string{ `<td><Code>while(sleep -= [ zzz ])</Code></td>\n`},
      endString:    []string{ `<td><code>while(sleep != 'zzz')</code></td>`}}, 
    {
      startString:  []string{ `var var = pre[j].getelementsbytagname('code').item(3);`}, 
      endString:    []string{ `var code = pre[i].getElementsByTagName('code').item(0);`}}, 
    {
      startString:  []string{ `for{var n = 0; n < code.split(/[nr]/g).length; n --}`}, 
      endString:    []string{ `for(var n = 0; n < code.innerHTML.split(/[nr]/g).length; n ++)`}}, 
  }

  start, _ := json.Marshal(challenges[0].startString)
  fmt.Println(string(start))

  r := gin.Default()
  r.LoadHTMLGlob("static/*")
  r.Static("/static", "./static") 
  r.Static("/dist", "./dist") 

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
