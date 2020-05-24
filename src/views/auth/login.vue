<template>
  <v-container class="fill-height"
               fluid>
    <v-row align="center"
           justify="center">
      <v-col cols="12"
             sm="8"
             md="4">

        <transition name="scroll-y-transition"
                    mode="out-in">
          <v-card v-if="status === 'login'"
                  key="box1"
                  class="elevation-12">
            <v-toolbar color="primary"
                       dark
                       flat>
              <v-toolbar-title>Login</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn text
                     large
                     @click="status = 'reg'">
                注册
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field v-model.trim="loginForm.account"
                              label="Account"
                              prepend-icon="person"
                              type="text" />

                <v-text-field v-model.trim="loginForm.password"
                              label="Password"
                              prepend-icon="lock"
                              type="password" />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary"
                     @click="submit">登录</v-btn>
            </v-card-actions>
          </v-card>

          <v-card v-else
                  key="box2"
                  class="elevation-12">
            <v-toolbar color="#0D47A1"
                       dark
                       flat>
              <v-toolbar-title>Register</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn text
                     large
                     @click="status = 'login'">
                登录
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field v-model.trim="regForm.account"
                              label="Account"
                              prepend-icon="person"
                              type="text"></v-text-field>

                <v-text-field v-model.trim="regForm.password"
                              label="Password"
                              prepend-icon="lock"
                              type="password"></v-text-field>
                <v-text-field v-model.trim="regForm.password2"
                              label="Password Confirm"
                              prepend-icon="lock"
                              type="password"></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="#0D47A1"
                     dark
                     @click="submit">注册</v-btn>
            </v-card-actions>
          </v-card>
        </transition>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  data () {
    return {
      status: 'login',
      loginForm: {
        account: '',
        password: ''
      },
      regForm: {
        account: '',
        password: '',
        password2: ''
      }
    }
  },
  created () {
    if (this.$store.getters.session.uid > 0) {
      this.$router.push({ path: '/' })
    }
    this.loginForm.account = localStorage.getItem('app-lastloginname') || ''
  },
  methods: {
    submit () {
      const account = this.status === 'login' ? this.loginForm.account : this.regForm.account
      const pwd = this.status === 'login' ? this.loginForm.password : this.regForm.password
      if (account === '') {
        this.$msgbox.error('账号不能为空')
        return
      }
      if (pwd === '') {
        this.$msgbox.error('密码不能为空')
        return
      }
      if (this.status === 'reg' && pwd !== this.regForm.password2) {
        this.$msgbox.error('两次密码输入不一至')
        return
      }

      this.$Ajax({
        method: 'post',
        url: `/auth/${this.status}`,
        data: { account, pwd }
      }).then(res => {
        if (res.ret > 0) {
          this.$msgbox.success({
            msg: res.msg,
            callback: () => {
              const session = {
                uid: res.uid,
                nickname: res.nickname,
                avatar: res.avatar,
                token: res.token,
                refreshtoken: res.refreshtoken
              }
              localStorage.setItem("app-lastloginname", account);
              this.$store.commit("setSession", session)
              this.$router.push({ path: '/' })
            }
          })
        }
      })
    }
  }
}
</script>
