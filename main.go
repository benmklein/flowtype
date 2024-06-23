
package main

import (
  "github.com/gin-gonic/gin"
  "net/http"
  "math/rand"
)

func main() {
  tasks := []string{
    `<td><code>while(sleep != "zzz")</code></td>`,
    `var code = pre[i].getElementsByTagName('code').item(0);`,
    `for(var n = 0; n < code.innerHTML.split(/[nr]/g).length; n ++)`,
  }

  r := gin.Default()
  r.LoadHTMLGlob("templates/*")
  r.Static("/static", "./static") 

  r.GET("/", func(c *gin.Context) {
    c.HTML(http.StatusOK, "index.html", nil)
  })

  r.GET("/next-task", func(c *gin.Context) {

    randomNum := rand.Int()%3
    c.JSON(http.StatusOK, gin.H{
      "next-task": tasks[randomNum],
    })
  })

  r.Run(":8080")
}

