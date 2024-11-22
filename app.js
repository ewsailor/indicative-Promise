const http = require('http') // 用於建立 HTTP 伺服器
const https = require('https') // 用於向 https://webdev.alphacamp.io/api/dogs/random 發送 GET 請求
let imgPath = '' // 用來存放從 API 獲取的狗狗圖片的 URL

const requestData = () => {
  // write your resolve / reject to complete this promise
  // 用 Promise 包裝了 https.get，確保在接收到完整的 API 響應後，通過 resolve 返回解析的結果。
  // 如果請求發生錯誤（如網路問題），則透過 reject 傳遞錯誤。
  return new Promise((resolve, reject) => { 
    https.get('https://webdev.alphacamp.io/api/dogs/random', (body) => {
      let data = ''
      
      // program is getting data：當接收數據時，持續累加到 `data`
      body.on('data', (chunk) => {
        data += chunk
      })

      // program is done with data：當數據接收完畢時，解析 JSON，然後 resolve 結果
      body.on('end', () => {
        console.log(JSON.parse(data))        
        return resolve(JSON.parse(data)) // 新增
      })
    })
    .on('error', (e) => {
      console.warn(e) // 捕捉錯誤並打印到控制台
      return reject(e) // 新增：將錯誤傳遞到 Promise 的 catch 中 
    })
  })
}

// 建立 HTTP 伺服器
http.createServer((req, res) => {
  // write promise chain here
  requestData() // requestData 的呼叫：伺服器啟動時，伺服器接收到用戶請求時，呼叫 requestData 發送 API 請求。
  .then((data) => { // 新增：如果 API 請求成功，將圖片 URL 插入到 HTML 並回應用戶端
    imgPath = data.message // 提取 API 回應中的圖片 URL
    res.end(`<h1>DOG PAGE</h1><img src='${imgPath}' >`) // 將圖片顯示在網頁上：因是非同步流程，故需確保 res.end 僅在 API 響應完成後執行，否則可能出現空白頁面。
  }) 
  .catch((e) => { // 新增：如果 API 請求失敗，記錄錯誤
    console.warn(e) // 捕捉錯誤並記錄到控制台
  })

  // this will return data to client. put it in the proper position.
  // res.end(`<h1>DOG PAGE</h1><img src='${imgPath}' >`)
  
}).listen(3000) // 啟動伺服器並監聽 3000 埠，當用戶瀏覽 http://127.0.0.1:3000 時觸發伺服器事件。伺服器發送 HTTPS 請求到 https://webdev.alphacamp.io/api/dogs/random，透過 API 獲取狗狗圖片 URL。

console.log('Server start: http://127.0.0.1:3000')