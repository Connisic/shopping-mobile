const fs = require('fs');
const path = require('path');

// 需要处理的目录
const viewsDir = path.join(__dirname, 'src/views');

// 递归获取所有Vue文件
const getVueFiles = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // 递归处理子目录
      results = results.concat(getVueFiles(filePath));
    } else if (path.extname(file) === '.vue') {
      // 只处理Vue文件
      results.push(filePath);
    }
  });
  
  return results;
};

// 转换文件内容
const transformFileContent = (content) => {
  // 1. 将 import { useStore } from 'vuex' 替换为相应的Pinia引用
  let newContent = content.replace(
    /import\s+{\s*useStore\s*}\s+from\s+['"]vuex['"]/g, 
    // 根据组件中使用的store类型替换为对应的引用
    (match) => {
      // 判断使用了哪些store
      const usesUser = /store\.dispatch\(['"]user\//.test(content) || /store\.getters\['"]user\//.test(content);
      const usesCart = /store\.dispatch\(['"]cart\//.test(content) || /store\.getters\['"]cart\//.test(content);
      const usesProduct = /store\.dispatch\(['"]product\//.test(content) || /store\.getters\['"]product\//.test(content);
      const usesOrder = /store\.dispatch\(['"]order\//.test(content) || /store\.getters\['"]order\//.test(content);
      const usesSeckill = /store\.dispatch\(['"]seckill\//.test(content) || /store\.getters\['"]seckill\//.test(content);
      const usesSearch = /store\.dispatch\(['"]search\//.test(content) || /store\.getters\['"]search\//.test(content);
      const usesAddress = /store\.dispatch\(['"]address\//.test(content) || /store\.getters\['"]address\//.test(content);
      
      let imports = [];
      
      if (usesUser) imports.push('useUserStore');
      if (usesCart) imports.push('useCartStore');
      if (usesProduct) imports.push('useProductStore');
      if (usesOrder) imports.push('useOrderStore');
      if (usesSeckill) imports.push('useSeckillStore');
      if (usesSearch) imports.push('useSearchStore');
      if (usesAddress) imports.push('useAddressStore');
      
      // 如果没有明确使用特定store，则默认使用userStore和cartStore
      if (imports.length === 0) {
        imports = ['useUserStore', 'useCartStore'];
      }
      
      return `import { ${imports.join(', ')} } from '@/stores'`;
    }
  );
  
  // 2. 将 const store = useStore() 替换为对应的Pinia store实例
  newContent = newContent.replace(
    /const\s+store\s*=\s*useStore\(\)/g,
    (match) => {
      // 判断使用了哪些store
      const usesUser = /store\.dispatch\(['"]user\//.test(content) || /store\.getters\['"]user\//.test(content);
      const usesCart = /store\.dispatch\(['"]cart\//.test(content) || /store\.getters\['"]cart\//.test(content);
      const usesProduct = /store\.dispatch\(['"]product\//.test(content) || /store\.getters\['"]product\//.test(content);
      const usesOrder = /store\.dispatch\(['"]order\//.test(content) || /store\.getters\['"]order\//.test(content);
      const usesSeckill = /store\.dispatch\(['"]seckill\//.test(content) || /store\.getters\['"]seckill\//.test(content);
      const usesSearch = /store\.dispatch\(['"]search\//.test(content) || /store\.getters\['"]search\//.test(content);
      const usesAddress = /state\.address\./.test(content);
      
      let storeDeclarations = [];
      
      if (usesUser) storeDeclarations.push('const userStore = useUserStore()');
      if (usesCart) storeDeclarations.push('const cartStore = useCartStore()');
      if (usesProduct) storeDeclarations.push('const productStore = useProductStore()');
      if (usesOrder) storeDeclarations.push('const orderStore = useOrderStore()');
      if (usesSeckill) storeDeclarations.push('const seckillStore = useSeckillStore()');
      if (usesSearch) storeDeclarations.push('const searchStore = useSearchStore()');
      if (usesAddress) storeDeclarations.push('const addressStore = useAddressStore()');
      
      // 如果没有明确使用特定store，则默认使用userStore和cartStore
      if (storeDeclarations.length === 0) {
        storeDeclarations = ['const userStore = useUserStore()', 'const cartStore = useCartStore()'];
      }
      
      return storeDeclarations.join('\n    ');
    }
  );
  
  // 3. 替换dispatch调用
  newContent = newContent.replace(
    /store\.dispatch\(['"](\w+)\/([^'"]+)['"](,\s*([^)]+))?\)/g,
    (match, namespace, action, extraParams, params) => {
      const storeNameMap = {
        user: 'userStore',
        cart: 'cartStore',
        product: 'productStore',
        order: 'orderStore',
        seckill: 'seckillStore',
        search: 'searchStore'
      };
      
      const storeName = storeNameMap[namespace] || namespace + 'Store';
      
      // 处理参数
      let actionParams = params ? params.trim() : '';
      
      return `${storeName}.${action}(${actionParams})`;
    }
  );
  
  // 4. 替换getters调用
  newContent = newContent.replace(
    /store\.getters\['"](\w+)\/([^'"]+)['"]\)/g,
    (match, namespace, getter) => {
      const storeNameMap = {
        user: 'userStore',
        cart: 'cartStore',
        product: 'productStore',
        order: 'orderStore',
        seckill: 'seckillStore',
        search: 'searchStore'
      };
      
      const storeName = storeNameMap[namespace] || namespace + 'Store';
      
      return `${storeName}.${getter}`;
    }
  );
  
  // 5. 替换state引用
  newContent = newContent.replace(
    /state\.(\w+)\.(\w+)/g,
    (match, namespace, prop) => {
      if (namespace === 'user') return `userStore.${prop}`;
      if (namespace === 'cart') return `cartStore.${prop}`;
      if (namespace === 'product') return `productStore.${prop}`;
      if (namespace === 'order') return `orderStore.${prop}`;
      if (namespace === 'seckill') return `seckillStore.${prop}`;
      if (namespace === 'search') return `searchStore.${prop}`;
      if (namespace === 'address') return `addressStore.${prop}`;
      
      return match;
    }
  );
  
  return newContent;
};

// 处理所有Vue文件
const processVueFiles = () => {
  const vueFiles = getVueFiles(viewsDir);
  
  vueFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 检查文件是否使用了Vuex
    if (content.includes('useStore') && content.includes('vuex')) {
      console.log(`处理文件: ${filePath}`);
      
      const newContent = transformFileContent(content);
      
      // 保存修改后的内容
      fs.writeFileSync(filePath, newContent, 'utf8');
    }
  });
  
  console.log('所有文件处理完成');
};

// 执行转换
processVueFiles(); 