# 业务分析模块调试指南

## 问题描述
用户反馈：点击"业务分析"标签后看不到内容

## 已添加的调试功能

### 1. 控制台日志
在 `Dashboard.tsx` 的 `renderBusinessModule()` 函数中添加了日志：
```typescript
console.log('Rendering business module:', activeBusinessModule);
```

在 `OverallSalesModule.tsx` 中添加了日志：
```typescript
console.log('OverallSalesModule rendering');
```

### 2. 可视化调试信息
在业务模块内容区域添加了调试信息显示：
```tsx
<div style={{ padding: '10px', background: '#f0f0f0', marginBottom: '10px', borderRadius: '4px' }}>
  <small>当前模块: {activeBusinessModule}</small>
</div>
```

在 `OverallSalesModule` 顶部添加了明显的提示框：
```tsx
<div style={{ padding: '20px', background: '#e3f2fd', marginBottom: '20px', borderRadius: '8px' }}>
  <h3 style={{ margin: 0, color: '#1976d2' }}>✅ 整体销售分析模块已加载</h3>
  <p style={{ margin: '8px 0 0 0', color: '#666' }}>如果你看到这个消息，说明模块渲染成功！</p>
</div>
```

## 调试步骤

### 步骤 1: 启动开发服务器
```bash
npm run dev
```

### 步骤 2: 打开浏览器开发者工具
1. 打开浏览器（Chrome/Firefox/Edge）
2. 按 F12 打开开发者工具
3. 切换到 Console 标签页

### 步骤 3: 访问Dashboard
访问 http://localhost:5173

### 步骤 4: 点击业务分析标签
点击顶部的"📊 业务分析"标签

### 步骤 5: 检查控制台输出
查看控制台是否有以下日志：
- `Rendering business module: overall_sales`
- `OverallSalesModule rendering`

### 步骤 6: 检查页面显示
应该能看到：
1. 10个业务模块的导航标签
2. 灰色背景的调试信息：`当前模块: overall_sales`
3. 蓝色背景的提示框：`✅ 整体销售分析模块已加载`
4. 4个KPI卡片
5. 两个图表区域（可能是空的）

## 可能的问题和解决方案

### 问题 1: 看不到业务分析标签
**症状**: 顶部只有"财务分析"和"动作分析"，没有"业务分析"

**原因**: Dashboard组件可能没有正确更新

**解决方案**:
```bash
# 清除缓存并重新构建
rm -rf node_modules/.vite
npm run dev
```

### 问题 2: 点击业务分析后页面空白
**症状**: 点击标签后，页面变成空白

**检查**:
1. 打开浏览器控制台，查看是否有错误
2. 检查 Network 标签，看是否有加载失败的资源
3. 查看 Console 是否有 `Rendering business module` 日志

**可能原因**:
- 模块组件导入失败
- CSS样式问题导致内容不可见
- JavaScript错误阻止渲染

### 问题 3: 看到导航标签但看不到内容
**症状**: 能看到10个模块标签，但下方内容区域是空白的

**检查**:
1. 检查控制台是否有 `OverallSalesModule rendering` 日志
2. 使用浏览器开发者工具的 Elements 标签，检查 `.business-module-content` 元素
3. 查看该元素是否有内容，是否被CSS隐藏

**可能原因**:
- CSS样式问题（如 `display: none` 或 `visibility: hidden`）
- 内容高度为0
- z-index 层级问题

### 问题 4: 模块标签不响应点击
**症状**: 点击模块标签没有反应

**检查**:
1. 检查控制台是否有错误
2. 检查 `handleBusinessModuleChange` 函数是否被调用

**解决方案**:
```typescript
// 在 Dashboard.tsx 中添加日志
const handleBusinessModuleChange = useCallback((moduleId: BusinessModule) => {
  console.log('Changing module to:', moduleId);
  setActiveBusinessModule(moduleId);
}, []);
```

### 问题 5: KPI卡片不显示
**症状**: 能看到模块标题，但KPI卡片不显示

**检查**:
1. 检查 `KPICard` 组件是否正确导入
2. 检查 `.kpi-grid` 的CSS样式
3. 使用Elements工具检查DOM结构

**可能原因**:
- KPICard组件有错误
- CSS grid布局问题
- 数据格式不正确

## 使用浏览器开发者工具调试

### 检查DOM结构
1. 打开 Elements 标签
2. 找到 `.business-analysis-container` 元素
3. 展开查看子元素结构
4. 应该看到：
   ```html
   <div class="business-analysis-container">
     <nav class="business-module-navigation">
       <div class="business-module-tabs">
         <!-- 10个按钮 -->
       </div>
     </nav>
     <div class="business-module-content">
       <!-- 模块内容 -->
     </div>
   </div>
   ```

### 检查CSS样式
1. 选中 `.business-module-content` 元素
2. 查看 Styles 面板
3. 确认以下样式：
   - `display`: 不应该是 `none`
   - `visibility`: 不应该是 `hidden`
   - `height`: 应该有值（至少 500px）
   - `background`: 应该是白色
   - `padding`: 应该是 24px

### 检查JavaScript错误
1. 打开 Console 标签
2. 查看是否有红色错误信息
3. 常见错误：
   - `Cannot read property 'xxx' of undefined`
   - `Module not found`
   - `Unexpected token`

## 测试独立模块

如果Dashboard中看不到内容，可以测试模块是否能独立渲染：

### 创建测试页面
已创建 `src/test-modules.tsx` 文件

### 修改 App.tsx 临时使用测试页面
```typescript
import { TestModules } from './test-modules';

function App() {
  return <TestModules />;
}
```

### 查看测试结果
如果测试页面能正常显示模块内容，说明：
- 模块组件本身没问题
- 问题在于Dashboard的集成逻辑

如果测试页面也看不到内容，说明：
- 模块组件本身有问题
- 需要检查模块组件的代码

## 常用调试命令

```bash
# 清除缓存
rm -rf node_modules/.vite
rm -rf dist

# 重新安装依赖
npm install

# 检查TypeScript错误
npm run build

# 运行测试
npm run test

# 查看端口占用
lsof -i :5173

# 强制结束进程
kill -9 <PID>
```

## 联系支持

如果以上步骤都无法解决问题，请提供以下信息：

1. 浏览器控制台的完整错误信息（截图）
2. Network 标签的请求列表（截图）
3. Elements 标签中 `.business-analysis-container` 的HTML结构（截图）
4. 浏览器版本和操作系统信息
5. `npm run dev` 的完整输出

## 快速修复清单

- [ ] 清除浏览器缓存（Ctrl+Shift+Delete）
- [ ] 清除Vite缓存（`rm -rf node_modules/.vite`）
- [ ] 重启开发服务器
- [ ] 检查浏览器控制台错误
- [ ] 检查Network标签是否有404错误
- [ ] 使用无痕模式测试
- [ ] 尝试不同的浏览器
- [ ] 检查防火墙/代理设置
