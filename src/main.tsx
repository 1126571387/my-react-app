import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'
import './index.css' // 导入全局样式

// 创建根节点
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

// 渲染应用
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)