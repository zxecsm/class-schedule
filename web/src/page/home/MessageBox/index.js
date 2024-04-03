import { createApp } from "vue";
import MessageBoxComponent from './MessageBox.vue'

export default function MessageBox(options) {
  const box = document.createElement('div')

  const app = createApp(MessageBoxComponent, {
    ...options,
    close() {
      app.unmount()
      document.body.removeChild(box)
    }
  })
  document.body.appendChild(box)
  app.mount(box)
}