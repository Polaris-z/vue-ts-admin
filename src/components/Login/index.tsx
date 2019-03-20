import { Component, Vue, Watch } from 'vue-property-decorator';
import './style.less'
import GlobalStore from '@/store/global';
import { setStorage } from '@/utils/storage';

@Component({})
export default class Login extends Vue {

  username: string = ''
  password: string = ''

  @Watch('username')
  wusername(v) {
    this.styleChange(v, 'username')
  }

  @Watch('password')
  wpwd(v) {
    this.styleChange(v, 'pwd')
  }

  styleChange(v, ref: string) {
    const style = (this.$refs[ref] as any).style
    if (v === '') {
      style.top = '27px'
      style.color = '#ccc'

    } else {
      style.top = '5px'
      style.color = '#000'
    }
  }

  login() {
    const { username, password } = this
    this.Axios.get('/login', { params: { username, password } }).then(
      ({ message, errorCode, data }: any) => {
        if (!errorCode) {
          this.$message.success(message)
          GlobalStore.saveAsyncRoutes(data.role)
          this.$router.push('/system/user')
        } else {
          this.$message.error(message)
        }
      })
  }

  render() {

    return (
      <a-row type='flex'>
        <a-col lg={{ span: 4 }} md={{ span: 13 }} sm={{ span: 22 }} id='login'>
          <div onKeydown={(e) => e.keyCode === 13 && this.login()} >
            <p>
              <span class='bold'> Design by </span>Village barber <span style='color:#000' >Tony</span> &
              <a-icon type='heart' theme='twoTone' twoToneColor='#eb2f96' />
            </p>
            <div class='input' >
              <input autofocus='autofocus' v-model={this.username} ></input>
              <div class='bottom'></div>
              <div ref='username' class='label'>Username</div>
            </div>
            <div class='input' >
              <input v-model={this.password} ></input>
              <div class='bottom'></div>
              <div ref='pwd' class='label'>Password</div>
            </div>
            <a-button onClick={this.login} class='button'>登录</a-button>
          </div>
        </a-col>
      </a-row>
    )
  }
}