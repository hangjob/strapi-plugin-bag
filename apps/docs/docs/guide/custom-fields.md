# 自定义字段类型 (Custom Fields)

当 Strapi 原生的字段（如文本、数字、布尔值）无法满足复杂的业务 UI 需求时，您可以通过 **自定义字段 (Custom Fields)** 来扩展内容管理器的能力。

例如：

- **图标选择器**：让用户在 FontAwesome 或 Strapi Icons 中可视化选择图标。
- **颜色拾取器**：直接选择十六进制颜色值。
- **高德/百度地图**：在后台点击地图获取经纬度。

## 1. 注册自定义字段

自定义字段的注册主要在插件的 **Admin** 端完成。

### 在 `admin/src/index.js` 中注册

```javascript
// admin/src/index.js
import { PLUGIN_ID } from "./pluginId";
import MyCustomIcon from "./components/MyCustomIcon";

export default {
  register(app) {
    app.customFields.register({
      name: "icon-picker", // 字段唯一标识
      pluginId: PLUGIN_ID, // 插件 ID
      type: "string", // 存入数据库的底层数据类型
      intlLabel: {
        id: `${PLUGIN_ID}.custom-fields.icon-picker.label`,
        defaultMessage: "图标选择器",
      },
      intlDescription: {
        id: `${PLUGIN_ID}.custom-fields.icon-picker.description`,
        defaultMessage: "可视化选择网站导航图标",
      },
      // 核心：定义该字段在后台渲染的组件
      components: {
        Input: async () => import("./components/IconPickerInput"),
      },
      // 可选：定义字段的配置项（在内容类型生成器中可见）
      options: {
        base: [
          {
            sectionTitle: {
              id: "icon-picker.options.section.title",
              defaultMessage: "配置选项",
            },
            items: [
              {
                intlLabel: {
                  id: "icon-picker.options.is-active.label",
                  defaultMessage: "是否开启预览",
                },
                name: "options.showPreview",
                type: "checkbox",
              },
            ],
          },
        ],
      },
    });
  },
};
```

## 2. 编写 Input 组件

Input 组件负责在内容编辑页面展示 UI 并与数据库进行交互。它会接收 `name`、`value`、`onChange` 等原生 Props。

```jsx
// admin/src/components/IconPickerInput/index.jsx
import React from "react";
import { useIntl } from "react-intl";
import {
  Box,
  Flex,
  Typography,
  SingleSelect,
  SingleSelectOption,
} from "@strapi/design-system";
import * as Icons from "@strapi/icons";

const IconPickerInput = ({
  name,
  value,
  onChange,
  intlLabel,
  disabled,
  error,
  description,
}) => {
  const { formatMessage } = useIntl();

  const handleChange = (newValue) => {
    onChange({ target: { name, value: newValue, type: "string" } });
  };

  return (
    <Box>
      <Typography variant="pi" fontWeight="bold">
        {formatMessage(intlLabel)}
      </Typography>
      <SingleSelect
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        error={error}
        hint={description}
      >
        <SingleSelectOption value="BulletList">列表图标</SingleSelectOption>
        <SingleSelectOption value="House">首页图标</SingleSelectOption>
        <SingleSelectOption value="Settings">设置图标</SingleSelectOption>
      </SingleSelect>
      {value && (
        <Box marginTop={2}>
          <Typography variant="sigma">预览：</Typography>
          {/* 动态渲染图标 */}
          {React.createElement(Icons[value] || Icons.EmptyState)}
        </Box>
      )}
    </Box>
  );
};

export default IconPickerInput;
```

## 3. 在内容类型中使用

注册成功后，当您在 Strapi 后台使用 **Content-Type Builder** 创建或编辑模型时：

1. 点击 **Add another field**。
2. 切换到 **Custom** 选项卡。
3. 您会看到刚才注册的 **图标选择器**。

## 4. 进阶：服务端校验 (可选)

如果您需要对自定义字段存入的数据进行服务端校验，可以在插件的 `server/src/register.js` 中声明：

```javascript
// server/src/register.js
export default ({ strapi }) => {
  strapi.customFields.register({
    name: "icon-picker",
    plugin: "strapi-plugin-bag",
    type: "string",
  });
};
```

## 5. 最佳实践建议

1.  **复用组件**：尽量使用 `@strapi/design-system` 的组件，确保后台风格高度统一。
2.  **按需加载**：使用 `async () => import(...)` 动态导入组件，优化后台首屏加载速度。
3.  **国际化**：务必为字段的 Label 和 Description 提供国际化配置。

> [!TIP]
> 详细的 API 参数和更多高级用法（如自定义设置项），请参考 [Strapi 官方文档 - Custom Fields](https://docs.strapi.io/developer-docs/latest/development/custom-fields.html)。
