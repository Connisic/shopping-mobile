<template>
  <div class="login-page">
    <!-- 导航栏 -->
    <van-nav-bar
      title="登录"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    
    <div class="content">
      <!-- 标题 -->
      <div class="header">
        <img src="/logo.svg" alt="Logo" class="logo" />
        <h2 class="title">YY购物商城</h2>
      </div>
      
      <!-- 登录方式切换 -->
      <van-tabs v-model:active="activeTab" animated>
        <!-- 密码登录 -->
        <van-tab title="密码登录">
          <van-form @submit="onPasswordSubmit">
            <van-cell-group inset>
              <van-field
                v-model="passwordForm.username"
                name="username"
                label="用户名"
                placeholder="请输入用户名/手机号"
                :rules="[{ required: true, message: '请输入用户名/手机号' }]"
              />
              <van-field
                v-model="passwordForm.password"
                type="password"
                name="password"
                label="密码"
                placeholder="请输入密码"
                :rules="[{ required: true, message: '请输入密码' }]"
              />
            </van-cell-group>
            <div class="form-actions">
              <div class="form-action-links">
                <span class="action-link" @click="goToRegister">注册账号</span>
                <span class="action-link" @click="goToForgetPassword">忘记密码</span>
              </div>
            </div>
            <div class="submit-btn-wrapper">
              <van-button 
                round 
                block 
                type="primary" 
                native-type="submit"
                :loading="passwordLoginLoading"
              >
                登录
              </van-button>
            </div>
          </van-form>
        </van-tab>
        
        <!-- 验证码登录 -->
        <van-tab title="验证码登录">
          <van-form @submit="onSmsSubmit">
            <van-cell-group inset>
              <van-field
                v-model="smsForm.phone"
                name="phone"
                label="手机号"
                placeholder="请输入手机号"
                :rules="[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
                ]"
              />
              <van-field
                v-model="smsForm.checkCode"
                name="checkCode"
                label="验证码"
                placeholder="请输入验证码"
                :rules="[{ required: true, message: '请输入验证码' }]"
              >
                <template #button>
                  <van-button 
                    size="small" 
                    type="primary" 
                    :disabled="countDown > 0" 
                    @click="sendVerifyCode"
                  >
                    {{ countDown > 0 ? `${countDown}秒后重新获取` : '获取验证码' }}
                  </van-button>
                </template>
              </van-field>
            </van-cell-group>
            <div class="form-actions">
              <div class="form-action-links">
                <span class="action-link" @click="goToRegister">注册账号</span>
              </div>
            </div>
            <div class="submit-btn-wrapper">
              <van-button 
                round 
                block 
                type="primary" 
                native-type="submit"
                :loading="smsLoginLoading"
              >
                登录
              </van-button>
            </div>
          </van-form>
        </van-tab>
      </van-tabs>
      
      <!-- 其他登录方式 -->
      <div class="other-login">
        <div class="divider">
          <span class="divider-text">其他登录方式</span>
        </div>
        <div class="social-login">
          <div class="social-item">
            <van-icon name="wechat" size="24" color="#07C160" />
            <span>微信</span>
          </div>
          <div class="social-item">
            <van-icon name="weibo" size="24" color="#E6162D" />
            <span>微博</span>
          </div>
          <div class="social-item">
            <van-icon name="qq" size="24" color="#0085FF" />
            <span>QQ</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Toast } from 'vant'
import { useStore } from 'vuex'
import userAPI from '@/services/user'

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    
    // 登录方式标签页
    const activeTab = ref(0)
    
    // 密码登录表单
    const passwordForm = ref({
      username: '',
      password: ''
    })
    
    // 验证码登录表单
    const smsForm = ref({
      phone: '',
      checkCode: ''
    })
    
    // 登录加载状态
    const passwordLoginLoading = ref(false)
    const smsLoginLoading = ref(false)
    
    // 验证码倒计时
    const countDown = ref(0)
    let timer = null
    
    // 返回上一页
    const onClickLeft = () => {
      router.back()
    }
    
    // 发送验证码
    const sendVerifyCode = async () => {
      // 验证手机号
      if (!smsForm.value.phone) {
        Toast('请输入手机号')
        return
      }
      
      if (!/^1[3-9]\d{9}$/.test(smsForm.value.phone)) {
        Toast('手机号格式不正确')
        return
      }
      
      // 发送验证码
      try {
        await store.dispatch('user/getVerifyCode', smsForm.value.phone)
        Toast.success('验证码已发送')
        
        // 开始倒计时
        countDown.value = 60
        timer = setInterval(() => {
          countDown.value--
          if (countDown.value <= 0) {
            clearInterval(timer)
          }
        }, 1000)
      } catch (error) {
        console.error('发送验证码失败', error)
      }
    }
    
    // 密码登录提交
    const onPasswordSubmit = async () => {
      try {
        passwordLoginLoading.value = true
        
        // 调用登录接口
        await store.dispatch('user/login', {
          username: passwordForm.value.username,
          password: passwordForm.value.password
        })
        
        Toast.success('登录成功')
        
        // 登录成功，跳转到指定页面
        const redirectUrl = route.query.redirect || '/profile'
        router.replace(redirectUrl)
      } catch (error) {
        console.error('登录失败', error)
      } finally {
        passwordLoginLoading.value = false
      }
    }
    
    // 验证码登录提交
    const onSmsSubmit = async () => {
      try {
        smsLoginLoading.value = true
        
        // 调用登录接口
        await store.dispatch('user/login', {
          phone: smsForm.value.phone,
          checkCode: smsForm.value.checkCode,
          loginType: 'sms'
        })
        
        Toast.success('登录成功')
        
        // 登录成功，跳转到指定页面
        const redirectUrl = route.query.redirect || '/profile'
        router.replace(redirectUrl)
      } catch (error) {
        console.error('登录失败', error)
      } finally {
        smsLoginLoading.value = false
      }
    }
    
    // 去注册
    const goToRegister = () => {
      router.push('/register')
    }
    
    // 去忘记密码
    const goToForgetPassword = () => {
      router.push('/forget-password')
    }
    
    return {
      activeTab,
      passwordForm,
      smsForm,
      passwordLoginLoading,
      smsLoginLoading,
      countDown,
      onClickLeft,
      sendVerifyCode,
      onPasswordSubmit,
      onSmsSubmit,
      goToRegister,
      goToForgetPassword
    }
  }
}
</script>

<style lang="less" scoped>
.login-page {
  background-color: #fff;
  min-height: 100vh;
  padding-bottom: 0; // 确保没有底部填充
  
  :deep(.van-nav-bar) {
    background-color: #fff;
    
    .van-nav-bar__title {
      color: #333;
    }
  }
  
  // 隐藏底部导航栏
  :deep(.van-tabbar) {
    display: none !important;
  }
  
  .content {
    padding: 90px 20px 40px;
    
    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 30px;
      
      .logo {
        width: 80px;
        height: 80px;
        margin-bottom: 15px;
      }
      
      .title {
        font-size: 20px;
        font-weight: bold;
        color: #333;
      }
    }
    
    .form-actions {
      margin: 15px 16px;
      
      .form-action-links {
        display: flex;
        justify-content: space-between;
        
        .action-link {
          color: #999;
          font-size: 14px;
        }
      }
    }
    
    .submit-btn-wrapper {
      margin: 20px 16px;
    }
    
    .other-login {
      margin-top: 40px;
      
      .divider {
        position: relative;
        text-align: center;
        margin-bottom: 25px;
        
        &::before,
        &::after {
          content: '';
          position: absolute;
          top: 50%;
          width: calc(50% - 80px);
          height: 1px;
          background-color: #ebedf0;
        }
        
        &::before {
          left: 0;
        }
        
        &::after {
          right: 0;
        }
        
        .divider-text {
          display: inline-block;
          padding: 0 16px;
          color: #969799;
          font-size: 14px;
        }
      }
      
      .social-login {
        display: flex;
        justify-content: space-around;
        
        .social-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          
          span {
            margin-top: 8px;
            font-size: 12px;
            color: #666;
          }
        }
      }
    }
  }
}
</style> 