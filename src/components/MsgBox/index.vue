<template>
  <div class="nij-gobal-dialog">
    <div class="overlayer"></div>
    <v-card class="content">
      <v-card-title class="headline lighten-2"
                    primary-title>
        <v-icon v-if="['error', 'warning'].includes(type)"
                :color="type">{{ type }}</v-icon>
        {{ tit }}
      </v-card-title>
      <v-card-text>
        <div class="msg">{{ msg }}</div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions style="margin:10px">
        <v-btn :color="type"
               block
               @click="ok_click">OK</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'nij-gobal-dialog',
  data () {
    return {
      tit: '',
      msg: '',
      type: 'primary',
      callback: null
    }
  },
  methods: {
    ok_click () {
      if (this.remove) {
        this.remove()
      }
      if (this.callback) {
        this.callback()
      }
      this.$destroy()
    }
  }
}
</script>

<style lang="scss">
.nij-gobal-dialog {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center; /*定义body的元素垂直居中*/
  justify-content: center; /*定义body的里的元素水平居中*/
  .overlayer {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: black;
    opacity: 0.5;
  }
  .content {
    width: 80vw;
    max-width: 400px;
    .msg {
      font-size: 1.2em;
      margin: 20px;
      text-align: center;
    }
  }
}
</style>