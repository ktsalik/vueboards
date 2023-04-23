import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCaretDown, faCaretUp, faCircleNotch, faCog, faEllipsisV, faPencil, faPlus, faSave, faTableColumns, faTimes } from '@fortawesome/free-solid-svg-icons'

library.add(faTimes)
library.add(faCircleNotch)
library.add(faPlus)
library.add(faCog)
library.add(faSave)
library.add(faTableColumns)
library.add(faEllipsisV)
library.add(faPencil)
library.add(faCaretDown)
library.add(faCaretUp)

const app = createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)

app.mount('#app')
