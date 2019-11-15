import axios from 'axios'
import config from '@/.config.js'
import atob from 'atob'

export default class Api {
  constructor(auth) {
    this.auth = auth
  }

  async createTheme(theme) {
    return axios.post("http://localhost:8000/themes/" + theme.name, theme).then(res=> {
      console.log(res)
      return res.data
    })
    .catch(()=>{return null})
  }
}
