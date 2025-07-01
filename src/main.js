import './style.css'
import { Game } from './game.js'

// 建立 canvas 元素
const app = document.querySelector('#app')
app.innerHTML = `<canvas id="gameCanvas" width="480" height="640" style="background:#222;display:block;margin:0 auto;"></canvas>`

const canvas = document.getElementById('gameCanvas')
new Game(canvas)
