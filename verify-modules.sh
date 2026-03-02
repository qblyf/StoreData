#!/bin/bash

echo "======================================"
echo "业务模块验证脚本"
echo "======================================"
echo ""

echo "1. 检查模块文件是否存在..."
modules=(
  "OverallSalesModule"
  "MarketBrandModule"
  "MainBusinessModule"
  "OperatorModule"
  "MembershipModule"
  "RecycleModule"
  "SecondhandModule"
  "SmartProductsModule"
  "AccessoriesModule"
  "RepairModule"
)

all_exist=true
for module in "${modules[@]}"; do
  file="src/components/modules/${module}.tsx"
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file 不存在"
    all_exist=false
  fi
done

echo ""
echo "2. 检查导出文件..."
if [ -f "src/components/modules/index.ts" ]; then
  echo "✅ src/components/modules/index.ts"
else
  echo "❌ src/components/modules/index.ts 不存在"
  all_exist=false
fi

echo ""
echo "3. 检查类型定义..."
if [ -f "src/types/business-modules.ts" ]; then
  echo "✅ src/types/business-modules.ts"
else
  echo "❌ src/types/business-modules.ts 不存在"
  all_exist=false
fi

echo ""
echo "4. 检查Dashboard修改..."
if grep -q "BusinessModule" src/components/Dashboard.tsx; then
  echo "✅ Dashboard.tsx 包含 BusinessModule 导入"
else
  echo "❌ Dashboard.tsx 未导入 BusinessModule"
  all_exist=false
fi

if grep -q "renderBusinessModule" src/components/Dashboard.tsx; then
  echo "✅ Dashboard.tsx 包含 renderBusinessModule 函数"
else
  echo "❌ Dashboard.tsx 未包含 renderBusinessModule 函数"
  all_exist=false
fi

if grep -q "business-analysis-container" src/components/Dashboard.tsx; then
  echo "✅ Dashboard.tsx 包含业务分析容器"
else
  echo "❌ Dashboard.tsx 未包含业务分析容器"
  all_exist=false
fi

echo ""
echo "5. 检查CSS样式..."
if grep -q "business-module-navigation" src/components/Dashboard.css; then
  echo "✅ Dashboard.css 包含业务模块样式"
else
  echo "❌ Dashboard.css 未包含业务模块样式"
  all_exist=false
fi

echo ""
echo "======================================"
if [ "$all_exist" = true ]; then
  echo "✅ 所有检查通过！"
  echo ""
  echo "下一步："
  echo "1. 运行 npm run dev"
  echo "2. 访问 http://localhost:5173"
  echo "3. 点击'业务分析'标签"
  echo "4. 查看是否显示10个模块标签和内容"
else
  echo "❌ 有文件缺失或配置错误"
  echo ""
  echo "请检查上面标记为 ❌ 的项目"
fi
echo "======================================"
