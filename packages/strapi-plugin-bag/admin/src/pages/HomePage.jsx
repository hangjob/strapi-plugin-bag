import React from 'react';
import {
  Main,
  Box,
  Typography,
  Flex,
  Divider,
  Button,
} from '@strapi/design-system';
import { 
  Shield, 
  Key, 
  Lock, 
  File, 
  ArrowRight,
  Briefcase,
  BulletList,
  Pencil,
  Magic
} from '@strapi/icons';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { getTranslation } from '../utils/getTranslation';
import { PLUGIN_ID } from '../pluginId';

const HomePage = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  return (
    <Main>
      {/* Hero Header Section */}
      <Box padding={10} background="primary600">
        <Flex direction="column" alignItems="flex-start" gap={2}>
          <Flex gap={3} alignItems="center">
            <Box padding={2} background="primary100" hasRadius>
              <Briefcase width="32px" height="32px" color="primary600" />
            </Box>
            <Typography variant="alpha" as="h1" textColor="neutral0">
              {formatMessage({ id: getTranslation('plugin.name') })}
            </Typography>
          </Flex>
          <Typography variant="epsilon" textColor="primary100" style={{ maxWidth: '600px' }}>
            {formatMessage({ id: getTranslation('homepage.hero.description') })}
          </Typography>
          <Box paddingTop={4}>
            <Button
              variant="secondary"
              onClick={() => navigate(`/plugins/${PLUGIN_ID}/settings`)}
            >
              {formatMessage({ id: getTranslation('homepage.hero.button') })}
            </Button>
          </Box>
        </Flex>
      </Box>

      {/* Main Content Area */}
      <Box padding={10} background="neutral100">
        <Flex direction="column" alignItems="stretch" gap={8}>
          
          {/* Feature Highlights Section */}
          <Box>
            <Box marginBottom={4}>
              <Typography variant="delta" as="h2">
                {formatMessage({ id: getTranslation('homepage.features.title') })}
              </Typography>
            </Box>
            <Flex wrap="wrap" gap={6} alignItems="stretch">
              {/* Security Card */}
              <Box 
                padding={6} 
                hasRadius 
                background="neutral0" 
                shadow="tableShadow" 
                flex="1" 
                minWidth="300px"
              >
                <Flex direction="column" alignItems="flex-start" gap={4}>
                  <Box padding={3} background="danger100" hasRadius>
                    <Shield color="danger600" />
                  </Box>
                  <Box>
                    <Typography variant="beta" as="h3">
                      {formatMessage({ id: getTranslation('homepage.security.title') })}
                    </Typography>
                    <Box paddingTop={2}>
                      <Typography textColor="neutral600">
                        {formatMessage({ id: getTranslation('homepage.security.description') })}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider unsetMargin={false} />
                  <Button
                    variant="ghost"
                    endIcon={<ArrowRight />}
                    onClick={() => navigate(`/plugins/${PLUGIN_ID}/settings`)}
                  >
                    {formatMessage({ id: getTranslation('homepage.security.button') })}
                  </Button>
                </Flex>
              </Box>

              {/* Auth Enhancement Card */}
              <Box 
                padding={6} 
                hasRadius 
                background="neutral0" 
                shadow="tableShadow" 
                flex="1" 
                minWidth="300px"
              >
                <Flex direction="column" alignItems="flex-start" gap={4}>
                  <Box padding={3} background="success100" hasRadius>
                    <Lock color="success600" />
                  </Box>
                  <Box>
                    <Typography variant="beta" as="h3">
                      {formatMessage({ id: getTranslation('homepage.auth.title') })}
                    </Typography>
                    <Box paddingTop={2}>
                      <Typography textColor="neutral600">
                        {formatMessage({ id: getTranslation('homepage.auth.description') })}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider unsetMargin={false} />
                  <Typography variant="pi" textColor="neutral500">
                    {formatMessage({ id: getTranslation('homepage.auth.footer') })}
                  </Typography>
                </Flex>
              </Box>

              {/* Utils Card */}
              <Box 
                padding={6} 
                hasRadius 
                background="neutral0" 
                shadow="tableShadow" 
                flex="1" 
                minWidth="300px"
              >
                <Flex direction="column" alignItems="flex-start" gap={4}>
                  <Box padding={3} background="secondary100" hasRadius>
                    <Key color="secondary600" />
                  </Box>
                  <Box>
                    <Typography variant="beta" as="h3">
                      {formatMessage({ id: getTranslation('homepage.encryption.title') })}
                    </Typography>
                    <Box paddingTop={2}>
                      <Typography textColor="neutral600">
                        {formatMessage({ id: getTranslation('homepage.encryption.description') })}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider unsetMargin={false} />
                  <Typography variant="pi" textColor="neutral500">
                    {formatMessage({ id: getTranslation('homepage.encryption.footer') })}
                  </Typography>
                </Flex>
              </Box>

              {/* Menu Management Card */}
              <Box 
                padding={6} 
                hasRadius 
                background="neutral0" 
                shadow="tableShadow" 
                flex="1" 
                minWidth="300px"
              >
                <Flex direction="column" alignItems="flex-start" gap={4}>
                  <Box padding={3} background="warning100" hasRadius>
                    <BulletList color="warning600" />
                  </Box>
                  <Box>
                    <Typography variant="beta" as="h3">
                      {formatMessage({ id: getTranslation('homepage.menu.title') })}
                    </Typography>
                    <Box paddingTop={2}>
                      <Typography textColor="neutral600">
                        {formatMessage({ id: getTranslation('homepage.menu.description') })}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider unsetMargin={false} />
                  <Button
                    variant="ghost"
                    endIcon={<ArrowRight />}
                    onClick={() => navigate('/content-manager/collection-types/plugin::strapi-plugin-bag.menu')}
                  >
                    {formatMessage({ id: getTranslation('homepage.menu.button') })}
                  </Button>
                </Flex>
              </Box>

              {/* CMS Content Card */}
              <Box 
                padding={6} 
                hasRadius 
                background="neutral0" 
                shadow="tableShadow" 
                flex="1" 
                minWidth="300px"
              >
                <Flex direction="column" alignItems="flex-start" gap={4}>
                  <Box padding={3} background="primary100" hasRadius>
                    <Pencil color="primary600" />
                  </Box>
                  <Box>
                    <Typography variant="beta" as="h3">
                      {formatMessage({ id: getTranslation('homepage.cms.title') })}
                    </Typography>
                    <Box paddingTop={2}>
                      <Typography textColor="neutral600">
                        {formatMessage({ id: getTranslation('homepage.cms.description') })}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider unsetMargin={false} />
                  <Button
                    variant="ghost"
                    endIcon={<ArrowRight />}
                    onClick={() => navigate('/content-manager/collection-types/plugin::strapi-plugin-bag.article')}
                  >
                    {formatMessage({ id: getTranslation('homepage.cms.button') })}
                  </Button>
                </Flex>
              </Box>

              {/* Comment Management Card */}
              <Box 
                padding={6} 
                hasRadius 
                background="neutral0" 
                shadow="tableShadow" 
                flex="1" 
                minWidth="300px"
              >
                <Flex direction="column" alignItems="flex-start" gap={4}>
                  <Box padding={3} background="secondary100" hasRadius>
                    <Key color="secondary600" />
                  </Box>
                  <Box>
                    <Typography variant="beta" as="h3">评论互动管理</Typography>
                    <Box paddingTop={2}>
                      <Typography textColor="neutral600">
                        管理文章评论与回复。支持内容审核、垃圾评论过滤及管理员回复标识，增强网站互动性。
                      </Typography>
                    </Box>
                  </Box>
                  <Divider unsetMargin={false} />
                  <Button
                    variant="ghost"
                    endIcon={<ArrowRight />}
                    onClick={() => navigate('/content-manager/collection-types/plugin::strapi-plugin-bag.comment')}
                  >
                    前往评论管理
                  </Button>
                </Flex>
              </Box>

              {/* Banner Management Card */}
              <Box 
                padding={6} 
                hasRadius 
                background="neutral0" 
                shadow="tableShadow" 
                flex="1" 
                minWidth="300px"
              >
                <Flex direction="column" alignItems="flex-start" gap={4}>
                  <Box padding={3} background="success100" hasRadius>
                    <Magic width="20px" height="20px" color="success600" />
                  </Box>
                  <Box>
                    <Typography variant="beta" as="h3">幻灯片与轮播图</Typography>
                    <Box paddingTop={2}>
                      <Typography textColor="neutral600">
                        管理首页及各页面的视觉焦点。支持分组管理、多图配置及点击跳转链接，提升网站表现力。
                      </Typography>
                    </Box>
                  </Box>
                  <Divider unsetMargin={false} />
                  <Button
                    variant="ghost"
                    endIcon={<ArrowRight />}
                    onClick={() => navigate('/content-manager/collection-types/plugin::strapi-plugin-bag.banner')}
                  >
                    去配置幻灯片
                  </Button>
                </Flex>
              </Box>

              {/* Friend Link Management Card */}
              <Box 
                padding={6} 
                hasRadius 
                background="neutral0" 
                shadow="tableShadow" 
                flex="1" 
                minWidth="300px"
              >
                <Flex direction="column" alignItems="flex-start" gap={4}>
                  <Box padding={3} background="secondary100" hasRadius>
                    <Key color="secondary600" />
                  </Box>
                  <Box>
                    <Typography variant="beta" as="h3">友情链接与合作伙伴</Typography>
                    <Box paddingTop={2}>
                      <Typography textColor="neutral600">
                        管理网站的友情链接、合作伙伴或技术大佬推荐。支持 Logo 展示、分类管理及 SEO 优化描述。
                      </Typography>
                    </Box>
                  </Box>
                  <Divider unsetMargin={false} />
                  <Button
                    variant="ghost"
                    endIcon={<ArrowRight />}
                    onClick={() => navigate('/content-manager/collection-types/plugin::strapi-plugin-bag.friend-link')}
                  >
                    去配置友情链接
                  </Button>
                </Flex>
              </Box>

              {/* Page Management Card */}
              <Box 
                padding={6} 
                hasRadius 
                background="neutral0" 
                shadow="tableShadow" 
                flex="1" 
                minWidth="300px"
              >
                <Flex direction="column" alignItems="flex-start" gap={4}>
                  <Box padding={3} background="primary100" hasRadius>
                    <File width="20px" height="20px" color="primary600" />
                  </Box>
                  <Box>
                    <Typography variant="beta" as="h3">单页内容管理</Typography>
                    <Box paddingTop={2}>
                      <Typography textColor="neutral600">
                        管理“关于我们”、“加入我们”、“服务条款”等固定单页面。支持富文本编辑、SEO 优化及阅读量统计。
                      </Typography>
                    </Box>
                  </Box>
                  <Divider unsetMargin={false} />
                  <Button
                    variant="ghost"
                    endIcon={<ArrowRight />}
                    onClick={() => navigate('/content-manager/collection-types/plugin::strapi-plugin-bag.page')}
                  >
                    去配置单页面
                  </Button>
                </Flex>
              </Box>

              {/* Message Board Card */}
              <Box 
                padding={6} 
                hasRadius 
                background="neutral0" 
                shadow="tableShadow" 
                flex="1" 
                minWidth="300px"
              >
                <Flex direction="column" alignItems="flex-start" gap={4}>
                  <Box padding={3} background="warning100" hasRadius>
                    <Key width="20px" height="20px" color="warning600" />
                  </Box>
                  <Box>
                    <Typography variant="beta" as="h3">留言板与反馈</Typography>
                    <Box paddingTop={2}>
                      <Typography textColor="neutral600">
                        收集并管理用户提交的在线留言、建议或投诉。支持状态跟踪（待处理、已回复、已关闭）及管理员内部备注。
                      </Typography>
                    </Box>
                  </Box>
                  <Divider unsetMargin={false} />
                  <Button
                    variant="ghost"
                    endIcon={<ArrowRight />}
                    onClick={() => navigate('/content-manager/collection-types/plugin::strapi-plugin-bag.message')}
                  >
                    管理用户留言
                  </Button>
                </Flex>
              </Box>

              {/* System Log Card */}
              <Box 
                padding={6} 
                hasRadius 
                background="neutral0" 
                shadow="tableShadow" 
                flex="1" 
                minWidth="300px"
              >
                <Flex direction="column" alignItems="flex-start" gap={4}>
                  <Box padding={3} background="neutral200" hasRadius>
                    <BulletList width="20px" height="20px" color="neutral600" />
                  </Box>
                  <Box>
                    <Typography variant="beta" as="h3">系统升级日志</Typography>
                    <Box paddingTop={2}>
                      <Typography textColor="neutral600">
                        记录系统的版本迭代、功能更新、Bug 修复及维护记录。支持 Markdown 格式，方便在前端展示美观的更新日志页面。
                      </Typography>
                    </Box>
                  </Box>
                  <Divider unsetMargin={false} />
                  <Button
                    variant="ghost"
                    endIcon={<ArrowRight />}
                    onClick={() => navigate('/content-manager/collection-types/plugin::strapi-plugin-bag.log')}
                  >
                    管理升级日志
                  </Button>
                </Flex>
              </Box>
            </Flex>
          </Box>

          {/* Resources & Links */}
          <Box padding={6} hasRadius background="neutral0" shadow="filterShadow">
            <Flex justifyContent="space-between" alignItems="center">
              <Flex gap={4} alignItems="center">
                <File color="neutral500" />
                <Box>
                  <Typography variant="delta">
                    {formatMessage({ id: getTranslation('homepage.docs.title') })}
                  </Typography>
                  <Typography variant="pi" textColor="neutral600">
                    {formatMessage({ id: getTranslation('homepage.docs.description') })}
                  </Typography>
                </Box>
              </Flex>
              <Button variant="secondary" onClick={() => window.open('/docs', '_blank')}>
                {formatMessage({ id: getTranslation('homepage.docs.button') })}
              </Button>
            </Flex>
          </Box>

        </Flex>
      </Box>
    </Main>
  );
};

export { HomePage };
