<template>
  <div class="register-page">
    <!-- 导航栏 -->
    <van-nav-bar
      title="注册"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    
    <div class="content">
      <!-- 标题 -->
      <div class="header">
        <img src="/logo.svg" alt="Logo" class="logo" />
        <h2 class="title">欢迎注册YY购物商城</h2>
      </div>
      
      <!-- 注册表单 -->
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="form.username"
            name="username"
            label="用户名"
            placeholder="请设置登录用户名"
            :rules="[{ required: true, message: '请输入用户名' }]"
          />
          <van-field
            v-model="form.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请设置6-20位登录密码"
            :rules="[
              { required: true, message: '请输入密码' },
              { min: 6, max: 20, message: '密码长度为6-20位' }
            ]"
          />
          <van-field
            v-model="form.confirmPassword"
            type="password"
            name="confirmPassword"
            label="确认密码"
            placeholder="请再次输入密码"
            :rules="[
              { required: true, message: '请确认密码' },
              { validator: validateConfirmPassword, message: '两次输入的密码不一致' }
            ]"
          />
          <van-field
            v-model="form.phone"
            name="phone"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
            ]"
          />
          <van-field
            v-model="form.checkCode"
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
        
        <!-- 协议勾选 -->
        <div class="agreement">
          <van-checkbox v-model="form.agreement" shape="square" checked-color="#e53e3e">
            <span class="agreement-text">
              我已阅读并同意
              <span class="link" @click.stop="showAgreement('user')">《用户协议》</span>
              和
              <span class="link" @click.stop="showAgreement('privacy')">《隐私政策》</span>
            </span>
          </van-checkbox>
        </div>
        
        <div class="submit-btn-wrapper">
          <van-button 
            round 
            block 
            type="primary" 
            native-type="submit"
            :loading="loading"
            :disabled="!form.agreement"
          >
            注册
          </van-button>
        </div>
      </van-form>
      
      <div class="login-link">
        已有账号？<span class="link" @click="goToLogin">立即登录</span>
      </div>
    </div>
    
    <!-- 协议弹窗 -->
    <van-popup
      v-model:show="showAgreementPopup"
      round
      position="bottom"
      :style="{ height: '80%' }"
    >
      <div class="agreement-popup">
        <div class="agreement-header">
          <div class="title">{{ agreementTitle }}</div>
          <van-icon name="cross" @click="showAgreementPopup = false" />
        </div>
        <div class="agreement-content">
          <template v-if="currentAgreement === 'user'">
            <h3>用户协议</h3>
            <p>
              欢迎使用YY购物商城！本协议是您与YY购物商城之间关于使用YY购物商城服务所订立的协议。
            </p>
            <p>
              一、服务内容<br>
              YY购物商城是一个在线购物平台，为用户提供商品浏览、购买、支付、售后等服务。
            </p>
            <p>
              二、用户账号<br>
              1. 用户在注册时应提供真实、准确、完整的个人资料；<br>
              2. 用户应妥善保管账号密码，不得将账号提供给他人使用；<br>
              3. 用户对账号下的所有行为负责。
            </p>
            <p>
              三、用户行为规范<br>
              1. 用户应遵守法律法规，不得利用YY购物商城从事违法活动；<br>
              2. 用户不得干扰YY购物商城的正常运营；<br>
              3. 用户不得侵犯他人合法权益。
            </p>
          </template>
          <template v-else>
            <h3>隐私政策</h3>
            <p>
              YY购物商城非常重视用户隐私保护，我们承诺将按照本隐私政策的规定使用和保护您的个人信息。
            </p>
            <p>
              一、信息收集<br>
              1. 注册信息：用户名、密码、手机号等注册必要信息；<br>
              2. 订单信息：收货地址、支付信息等订单相关信息；<br>
              3. 浏览信息：浏览记录、搜索记录等使用服务时产生的信息。
            </p>
            <p>
              二、信息使用<br>
              1. 向您提供商品和服务；<br>
              2. 改进和优化服务体验；<br>
              3. 向您推送可能感兴趣的商品信息。
            </p>
            <p>
              三、信息保护<br>
              1. 我们采取严格的安全措施保护您的个人信息；<br>
              2. 未经您的同意，我们不会向第三方披露您的个人信息；<br>
              3. 我们只在必要的时间内保留您的个人信息。
            </p>
          </template>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import { useUserStore } from '@/stores'
import userAPI from '@/services/user'

export default {
  name: 'RegisterPage',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    // 注册表单
    const form = ref({
      username: '',
      password: '',
      confirmPassword: '',
      phone: '',
      checkCode: '',
      agreement: false
    })
    
    // 加载状态
    const loading = ref(false)
    
    // 验证码倒计时
    const countDown = ref(0)
    let timer = null
    
    // 协议弹窗
    const showAgreementPopup = ref(false)
    const currentAgreement = ref('user')
    const agreementTitle = computed(() => {
      return currentAgreement.value === 'user' ? '用户协议' : '隐私政策'
    })
    
    // 确认密码验证
    const validateConfirmPassword = (val) => {
      return val === form.value.password
    }
    
    // 返回上一页
    const onClickLeft = () => {
      router.back()
    }
    
    // 发送验证码
    const sendVerifyCode = async () => {
      // 验证手机号
      if (!form.value.phone) {
        Toast('请输入手机号')
        return
      }
      
      if (!/^1[3-9]\d{9}$/.test(form.value.phone)) {
        Toast('手机号格式不正确')
        return
      }
      
      // 发送验证码
      try {
        await userStore.getVerifyCode(form.value.phone)
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
    
    // 显示协议
    const showAgreement = (type) => {
      currentAgreement.value = type
      showAgreementPopup.value = true
    }
    
    // 提交注册
    const onSubmit = async () => {
      // 验证协议勾选
      if (!form.value.agreement) {
        Toast('请阅读并同意用户协议和隐私政策')
        return
      }
      
      // 验证两次密码一致
      if (form.value.password !== form.value.confirmPassword) {
        Toast('两次输入的密码不一致')
        return
      }
      
      try {
        loading.value = true
        
        // 准备注册数据
        const registerData = {
          username: form.value.username,
          password: form.value.password,
          phone: form.value.phone,
          checkCode: form.value.checkCode
        }
        
        // 调用注册接口
        await userStore.register(registerData)
        
        Toast.success('注册成功，请登录')
        
        // 注册成功，跳转到登录页面
        router.replace('/login')
      } catch (error) {
        console.error('注册失败', error)
      } finally {
        loading.value = false
      }
    }
    
    // 去登录
    const goToLogin = () => {
      router.push('/login')
    }
    
    return {
      form,
      loading,
      countDown,
      showAgreementPopup,
      currentAgreement,
      agreementTitle,
      validateConfirmPassword,
      onClickLeft,
      sendVerifyCode,
      showAgreement,
      onSubmit,
      goToLogin
    }
  }
}
</script>

<style lang="less" scoped>
.register-page {
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
    
    .agreement {
      margin: 20px 16px;
      
      .agreement-text {
        font-size: 12px;
        color: #666;
        
        .link {
          color: #e53e3e;
        }
      }
    }
    
    .submit-btn-wrapper {
      margin: 20px 16px;
    }
    
    .login-link {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: #666;
      
      .link {
        color: #e53e3e;
      }
    }
  }
  
  .agreement-popup {
    height: 100%;
    display: flex;
    flex-direction: column;
    
    .agreement-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #f2f2f2;
      
      .title {
        font-size: 16px;
        font-weight: bold;
      }
    }
    
    .agreement-content {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      
      h3 {
        font-size: 16px;
        margin: 0 0 15px;
      }
      
      p {
        font-size: 14px;
        color: #666;
        line-height: 1.6;
        margin-bottom: 15px;
      }
    }
  }
}
</style> 