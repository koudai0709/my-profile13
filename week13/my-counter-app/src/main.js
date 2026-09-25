import './style.css'
import template from './app.html?raw'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = template
setupCounter(document.querySelector('.counter-card'))

