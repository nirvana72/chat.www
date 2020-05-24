<template>
  <div class="home-index">
    <v-card class="room"
            :elevation="10">
      <div class="top nav-bar">
        <span class="userinfo">{{ session.nickname }}</span>
        <v-btn icon
               color="#ffffff"
               @click="logout"
               class="logout">
          <v-icon>close</v-icon>
        </v-btn>
      </div>
      <div class="side user-list">

        <v-list color="transparent">
          <v-list-item v-for="item in userlist"
                       :key="item.uid">
            <v-list-item-avatar>
              <v-img :src="`http://oss.mu78.com/avatar/${item.avatar}.png`"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="item.nickname"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

      </div>
      <div class="content msg-list"
           ref="msglist">
        <div class="msg-row"
             v-for="(row, index) in msglist"
             :key="index">
          <img :src="`http://oss.mu78.com/avatar/${row.avatar}.png`"
               class="avatar">
          <div class="msg">
            <div>{{ row.nickname }}:</div>
            <div :class="['msg-content', row.uid == session.uid ? 'self' : '']">{{ row.msg }}</div>
            <div class="msg-time">{{ row.time }}</div>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
      <div class="input">
        <textarea v-model="inputing"
                  @keyup.ctrl.enter="send"></textarea>
        <div class="cmd">
          <v-btn small
                 @click="send">send</v-btn>
          <span class="cmd-info">Ctrl+Enter</span>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ws: null,
      inputing: '',
      session: null,
      userlist: [],
      msglist: [],
      isServerDisConnect: true //是否主动退出
    }
  },
  created () {
    this.session = this.$store.getters.session
    this.connectWs2()

    this.getOnlineUsers()
  },
  methods: {
    getOnlineUsers () {
      this.$Ajax({ method: 'get', url: `/chat/users` })
        .then(res => {
          if (res.ret > 0) {
            this.userlist = res.list
          }
        })
    },
    connectWs2 () {
      this.ws = new WebSocket('ws://localhost:8891')

      // ----------------------------------------------

      this.ws.onerror = (event) => {
        console.log('------socket error occurred------')
        console.log('服务器连接失败')
        console.log(event)
        this.isServerDisConnect = false
        this.$msgbox.error({
          msg: '服务器连接失败',
          callback: () => {
            this.logout()
          }
        })
      }

      // ----------------------------------------------

      this.ws.onopen = () => {
        console.log('------ws open------')
        console.log('连接成功')
        // console.log(event)
        const data = {
          cmd: 'online',
          params: {
            uid: this.session.uid,
            nickname: this.session.nickname,
            avatar: this.session.avatar
          }
        }
        this.ws.send(JSON.stringify(data))
      }

      // ----------------------------------------------

      this.ws.onclose = () => {
        console.log('------ws onclose------')
        console.log('服务器端开连接，本地退出')
        if (this.isServerDisConnect) {
          this.$msgbox.error({
            msg: '服务器端开连接',
            callback: () => {
              this.logout()
            }
          })
        }
      }

      // ----------------------------------------------

      this.ws.onmessage = (event) => {
        console.log('------ws onmessage------')
        let data = JSON.parse(event.data)
        switch (data.cmd) {
          case 'message': {
            if (this.msglist.length > 100) {
              this.msglist.splice(0, 80)
            }
            this.msglist.push(data.params)
            this.inputing = ''
            setTimeout(() => {
              this.scrollBottom()
            }, 100);
            break
          }
          case 'online': {
            if (data.params.uid !== this.session.uid) {
              this.userlist.push(data.params)
            }
            break
          }
          case 'offline': {
            // 某个人下线， 会引发其它所有人刷新用户列表，并发严重
            this.getOnlineUsers()
            break
          }
          case 'error': {
            this.$msgbox.error({
              msg: data.params.msg,
              callback: () => {
                this.logout()
              }
            })
            break
          }
        }
      }
    },
    logout () {
      this.isServerDisConnect = false
      this.ws.close()
      this.$store.commit("clearSession")
      this.$router.push({ path: '/auth/login' })
    },
    send () {
      if (this.inputing === '') {
        return
      }
      const data = {
        cmd: 'message',
        params: {
          uid: this.session.uid,
          nickname: this.session.nickname,
          avatar: this.session.avatar,
          msg: this.inputing
        }
      }
      this.ws.send(JSON.stringify(data))
    },
    scrollBottom () {
      this.$refs.msglist.scrollTop = this.$refs.msglist.scrollHeight
    }
  }
}
</script>

<style lang="scss">
.home-index {
  $room-width: 1000px;
  $room-height: 800px;
  $top-height: 50px;
  $side-width: 200px;
  $input-height: 150px;
  $color1: #1e88e5;
  $color2: #bbdefb;
  $color3: #e3f2fd;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100vh;
  .room {
    width: $room-width;
    height: $room-height;
    .top {
      height: $top-height;
      background-color: $color1;
    }
    .side {
      width: $side-width;
      height: $room-height - $top-height;
      background-color: $color2;
      float: left;
    }
    .content {
      width: $room-width - $side-width;
      height: $room-height - $top-height - $input-height;
      background-color: $color3;
      float: right;
    }
    .input {
      width: $room-width - $side-width;
      height: $input-height;
      float: right;
    }
  }

  .nav-bar {
    text-align: center;
    .userinfo {
      display: block;
      padding-top: 8px;
      font-size: 1.5em;
      color: white;
    }
    .logout {
      position: absolute;
      right: 10px;
      top: 5px;
    }
  }

  .user-list {
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .input {
    textarea {
      width: $room-width - $side-width - 40;
      height: $input-height - 40;
      display: block;
      margin: 0 auto;
      padding-top: 20px;
      resize: none;
      outline: none;
    }
    .cmd {
      margin-right: 20px;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      .cmd-info {
        display: block;
        margin-right: 20px;
        font-size: 0.8em;
      }
    }
  }

  .msg-list {
    padding: 20px;
    overflow: auto;
    .msg-row {
      margin-bottom: 20px;
      .avatar {
        float: left;
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .msg {
        float: left;
        margin-left: 10px;
        .msg-content {
          display: inline-block;
          padding: 10px;
          border-radius: 10px;
          background-color: #ffffff;
          max-width: 500px;
        }
        .msg-time {
          display: inline-block;
          padding: 10px;
          color: #a0a0a0;
          font-size: 0.8em;
        }
        .self {
          background-color: $color1;
          color: #ffffff;
        }
      }
      .clearfix {
        clear: both;
      }
    }
  }
}
</style>
