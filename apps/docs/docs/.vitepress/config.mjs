import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Strapi Plugin Bag",
  description: "一站式 Strapi 综合增强工具包使用手册",
  head: [
    ['link', {rel: 'icon', href: '/public/logo-min.png'}]
  ],
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/introduction' },
      { text: 'API 参考', link: '/guide/ip-restriction' }
    ],
    // ...
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present Bag Plugin Team'
    },

    sidebar: [
      {
        text: '入门',
        items: [
          { text: '简介', link: '/guide/introduction' },
          { text: '安装', link: '/guide/installation' }
        ]
      },
      {
        text: '功能特性',
        items: [
          { text: '认证系统', link: '/guide/authentication' },
          { text: '加密工具', link: '/guide/encryption' },
          { text: 'IP 访问限制', link: '/guide/ip-restriction' },
          { text: '内容发布系统', link: '/guide/content-management' },
          { text: '单页管理系统', link: '/guide/page-system' },
          { text: '留言板管理系统', link: '/guide/message-board' },
          { text: '系统升级日志', link: '/guide/upgrade-log' },
          { text: '菜单导航系统', link: '/guide/menu-system' },
          { text: '幻灯片管理系统', link: '/guide/banner-system' },
          { text: '友情链接管理', link: '/guide/friend-link' },
          { text: '评论互动系统', link: '/guide/comment-system' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hangjob/strapi-plugin-bag' }
    ],

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    }
  }
})
