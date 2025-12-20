import React, { useState, useEffect } from 'react';
import {
  Main,
  Box,
  Button,
  Typography,
  TextInput,
  Flex,
  Loader,
  Switch,
  SingleSelect,
  SingleSelectOption,
  Textarea,
  NumberInput,
  Divider,
} from '@strapi/design-system';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { Check } from '@strapi/icons';
import { useIntl } from 'react-intl';

import { getTranslation } from '../utils/getTranslation';

const SettingsPage = () => {
  const { formatMessage } = useIntl();
  const { get, post } = useFetchClient();
  const toggleNotification = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    ipRestriction: {
      enabled: false,
      whitelist: [],
      blacklist: [],
    },
    login: {
      captcha: {
        enabled: false,
        type: 'image',
      },
    },
    register: {
      captcha: {
        enabled: true,
        type: 'email',
      },
    },
    auth: {
      refreshTokenExpiresIn: 30,
    },
    encryption: {
      rsa: {
        publicKey: '',
        privateKey: '',
      },
      aes: {
        secret: '',
      },
    },
  });

  useEffect(() => {
    get('/strapi-plugin-bag/settings')
      .then(({ data }) => {
        if (data) {
          setSettings((prev) => ({
            ...prev,
            ...data,
            ipRestriction: {
              ...prev.ipRestriction,
              ...(data.ipRestriction || {}),
            },
            login: {
              ...prev.login,
              ...(data.login || {}),
            },
            register: {
              ...prev.register,
              ...(data.register || {}),
            },
            auth: {
              ...prev.auth,
              ...(data.auth || {}),
            },
            encryption: {
              ...prev.encryption,
              ...(data.encryption || {}),
            },
          }));
        }
        setIsLoading(false);
      })
      .catch(() => {
        toggleNotification({
          type: 'warning',
          message: formatMessage({ id: getTranslation('settings.load.error') }),
        });
        setIsLoading(false);
      });
  }, [get, toggleNotification, formatMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await post('/strapi-plugin-bag/settings', settings);
      toggleNotification({
        type: 'success',
        message: formatMessage({ id: getTranslation('settings.save.success') }),
      });
    } catch (err) {
      toggleNotification({
        type: 'warning',
        message: formatMessage({ id: getTranslation('settings.save.error') }),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (section, name, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  const handleCaptchaChange = (section, name, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        captcha: {
          ...prev[section].captcha,
          [name]: value,
        },
      },
    }));
  };

  const handleRsaChange = (name, value) => {
    setSettings((prev) => ({
      ...prev,
      encryption: {
        ...prev.encryption,
        rsa: {
          ...prev.encryption.rsa,
          [name]: value,
        },
      },
    }));
  };

  const handleAesChange = (value) => {
    setSettings((prev) => ({
      ...prev,
      encryption: {
        ...prev.encryption,
        aes: {
          ...prev.encryption.aes,
          secret: value,
        },
      },
    }));
  };

  if (isLoading) {
    return (
      <Main aria-busy="true">
        <Flex justifyContent="center" paddingTop={10}>
          <Loader>{formatMessage({ id: getTranslation('settings.loading') })}</Loader>
        </Flex>
      </Main>
    );
  }

  return (
    <Main>
      <Box padding={8} background="neutral100">
        <Flex justifyContent="space-between">
          <Box>
            <Typography variant="alpha" as="h1">
              {formatMessage({ id: getTranslation('settings.title') })}
            </Typography>
            <Typography variant="epsilon" textColor="neutral600">
              {formatMessage({ id: getTranslation('settings.description') })}
            </Typography>
          </Box>
          <Button
            onClick={handleSubmit}
            startIcon={<Check />}
            loading={isSaving}
          >
            {formatMessage({ id: getTranslation('settings.save') })}
          </Button>
        </Flex>
      </Box>
      <Box paddingLeft={8} paddingRight={8} paddingTop={8} paddingBottom={12}>
        <Flex direction="column" alignItems="stretch" gap={10}>
          {/* IP Restriction Section */}
          <Box padding={4} hasRadius background="neutral0" shadow="filterShadow">
            <Typography variant="delta" as="h2" marginBottom={2}>
              {formatMessage({ id: getTranslation('settings.ip.title') })}
            </Typography>
            <Typography variant="pi" textColor="neutral600">
              {formatMessage({ id: getTranslation('settings.ip.description') })}
            </Typography>
            <Box paddingTop={4}>
              <Flex direction="column" alignItems="stretch" gap={4}>
                <Box>
                  <Flex direction="column" alignItems="stretch" gap={1}>
                    <Typography variant="sigma" textColor="neutral600" fontWeight="bold">
                      {formatMessage({ id: getTranslation('settings.ip.enabled.label') })}
                    </Typography>
                    <Switch
                      selected={settings.ipRestriction.enabled}
                      onChange={() => handleChange('ipRestriction', 'enabled', !settings.ipRestriction.enabled)}
                      visibleLabels
                      offLabel={formatMessage({ id: getTranslation('settings.switch.off') })}
                      onLabel={formatMessage({ id: getTranslation('settings.switch.on') })}
                    />
                    <Typography variant="pi" textColor="neutral600">
                      {formatMessage({ id: getTranslation('settings.ip.enabled.hint') })}
                    </Typography>
                  </Flex>
                </Box>

                <Box>
                  <Flex direction="column" alignItems="stretch" gap={1}>
                    <Typography variant="sigma" textColor="neutral600" fontWeight="bold">
                      {formatMessage({ id: getTranslation('settings.ip.whitelist.label') })}
                    </Typography>
                    <TextInput
                      placeholder={formatMessage({ id: getTranslation('settings.ip.whitelist.placeholder') })}
                      value={(settings.ipRestriction.whitelist || []).join(', ')}
                      onChange={(e) =>
                        handleChange(
                          'ipRestriction',
                          'whitelist',
                          e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                        )
                      }
                    />
                    <Typography variant="pi" textColor="neutral600">
                      {formatMessage({ id: getTranslation('settings.ip.whitelist.hint') })}
                    </Typography>
                  </Flex>
                </Box>

                <Box>
                  <Flex direction="column" alignItems="stretch" gap={1}>
                    <Typography variant="sigma" textColor="neutral600" fontWeight="bold">
                      {formatMessage({ id: getTranslation('settings.ip.blacklist.label') })}
                    </Typography>
                    <TextInput
                      placeholder={formatMessage({ id: getTranslation('settings.ip.blacklist.placeholder') })}
                      value={(settings.ipRestriction.blacklist || []).join(', ')}
                      onChange={(e) =>
                        handleChange(
                          'ipRestriction',
                          'blacklist',
                          e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                        )
                      }
                    />
                    <Typography variant="pi" textColor="neutral600">
                      {formatMessage({ id: getTranslation('settings.ip.blacklist.hint') })}
                    </Typography>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          </Box>

          {/* Auth & Authorization Section */}
          <Box padding={4} hasRadius background="neutral0" shadow="filterShadow">
            <Typography variant="delta" as="h2" marginBottom={4}>
              {formatMessage({ id: getTranslation('settings.auth.title') })}
            </Typography>
            <Flex direction="column" alignItems="stretch" gap={6}>
              <Box>
                <Box marginTop={2} marginBottom={4}>
                  <Typography variant="epsilon" as="h3" fontWeight="regular">
                    {formatMessage({ id: getTranslation('settings.auth.token.title') })}
                  </Typography>
                </Box>
                <Box maxWidth="400px">
                  <Flex direction="column" alignItems="stretch" gap={1}>
                    <Typography variant="sigma" textColor="neutral600" fontWeight="bold">
                      {formatMessage({ id: getTranslation('settings.auth.token.expiry.label') })}
                    </Typography>
                    <NumberInput
                      placeholder={formatMessage({ id: getTranslation('settings.auth.token.expiry.placeholder') })}
                      value={settings.auth.refreshTokenExpiresIn}
                      onValueChange={(value) => handleChange('auth', 'refreshTokenExpiresIn', value)}
                    />
                    <Typography variant="pi" textColor="neutral600">
                      {formatMessage({ id: getTranslation('settings.auth.token.expiry.hint') })}
                    </Typography>
                  </Flex>
                </Box>
              </Box>

              <Divider />

              <Flex gap={6} alignItems="flex-start">
                <Box flex="1">
                  <Box marginTop={2} marginBottom={4}>
                    <Typography variant="epsilon" as="h3" fontWeight="regular">
                      {formatMessage({ id: getTranslation('settings.auth.login.title') })}
                    </Typography>
                  </Box>
                  <Flex direction="column" alignItems="stretch" gap={4}>
                    <Box>
                      <Flex direction="column" alignItems="stretch" gap={1}>
                        <Typography variant="sigma" textColor="neutral600" fontWeight="bold">
                          {formatMessage({ id: getTranslation('settings.auth.login.enabled.label') })}
                        </Typography>
                        <Switch
                          selected={settings.login.captcha.enabled}
                          onChange={() => handleCaptchaChange('login', 'enabled', !settings.login.captcha.enabled)}
                          visibleLabels
                          offLabel="关闭"
                          onLabel="开启"
                        />
                      </Flex>
                    </Box>
                    <Box>
                      <Flex direction="column" alignItems="stretch" gap={1}>
                        <Typography variant="sigma" textColor="neutral600" fontWeight="bold">
                          {formatMessage({ id: getTranslation('settings.auth.captcha.type.label') })}
                        </Typography>
                        <SingleSelect
                          value={settings.login.captcha.type}
                          onChange={(value) => handleCaptchaChange('login', 'type', value)}
                        >
                          <SingleSelectOption value="image">
                            {formatMessage({ id: getTranslation('settings.auth.captcha.type.image') })}
                          </SingleSelectOption>
                          <SingleSelectOption value="email">
                            {formatMessage({ id: getTranslation('settings.auth.captcha.type.email') })}
                          </SingleSelectOption>
                          <SingleSelectOption value="any">
                            {formatMessage({ id: getTranslation('settings.auth.captcha.type.any') })}
                          </SingleSelectOption>
                        </SingleSelect>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>

                <Box flex="1">
                  <Box marginTop={2} marginBottom={4}>
                    <Typography variant="epsilon" as="h3" fontWeight="regular">
                      {formatMessage({ id: getTranslation('settings.auth.register.title') })}
                    </Typography>
                  </Box>
                  <Flex direction="column" alignItems="stretch" gap={4}>
                    <Box>
                      <Flex direction="column" alignItems="stretch" gap={1}>
                        <Typography variant="sigma" textColor="neutral600" fontWeight="bold">
                          {formatMessage({ id: getTranslation('settings.auth.register.enabled.label') })}
                        </Typography>
                        <Switch
                          selected={settings.register.captcha.enabled}
                          onChange={() => handleCaptchaChange('register', 'enabled', !settings.register.captcha.enabled)}
                          visibleLabels
                          offLabel="关闭"
                          onLabel="开启"
                        />
                      </Flex>
                    </Box>
                    <Box>
                      <Flex direction="column" alignItems="stretch" gap={1}>
                        <Typography variant="sigma" textColor="neutral600" fontWeight="bold">
                          {formatMessage({ id: getTranslation('settings.auth.captcha.type.label') })}
                        </Typography>
                        <SingleSelect
                          value={settings.register.captcha.type}
                          onChange={(value) => handleCaptchaChange('register', 'type', value)}
                        >
                          <SingleSelectOption value="image">
                            {formatMessage({ id: getTranslation('settings.auth.captcha.type.image') })}
                          </SingleSelectOption>
                          <SingleSelectOption value="email">
                            {formatMessage({ id: getTranslation('settings.auth.captcha.type.email') })}
                          </SingleSelectOption>
                          <SingleSelectOption value="any">
                            {formatMessage({ id: getTranslation('settings.auth.captcha.type.any') })}
                          </SingleSelectOption>
                        </SingleSelect>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          </Box>

          {/* RSA & AES Encryption Section */}
          <Box padding={4} hasRadius background="neutral0" shadow="filterShadow">
            <Typography variant="delta" as="h2" marginBottom={2}>
              {formatMessage({ id: getTranslation('settings.encryption.title') })}
            </Typography>
            <Typography variant="pi" textColor="neutral600">
              {formatMessage({ id: getTranslation('settings.encryption.description') })}
            </Typography>
            <Box paddingTop={4}>
              <Flex direction="column" alignItems="stretch" gap={6}>
                <Box>
                  <Typography variant="beta" as="h3" marginBottom={4}>
                    {formatMessage({ id: getTranslation('settings.encryption.rsa.title') })}
                  </Typography>
                  <Flex direction="column" alignItems="stretch" gap={4}>
                    <Box>
                      <Flex direction="column" alignItems="stretch" gap={1}>
                        <Typography variant="sigma" textColor="neutral600" fontWeight="bold">
                          {formatMessage({ id: getTranslation('settings.encryption.rsa.public.label') })}
                        </Typography>
                        <Textarea
                          placeholder={formatMessage({ id: getTranslation('settings.encryption.rsa.public.placeholder') })}
                          value={settings.encryption.rsa.publicKey}
                          onChange={(e) => handleRsaChange('publicKey', e.target.value)}
                          rows={4}
                        />
                      </Flex>
                    </Box>
                    <Box>
                      <Flex direction="column" alignItems="stretch" gap={1}>
                        <Typography variant="sigma" textColor="neutral600" fontWeight="bold">
                          {formatMessage({ id: getTranslation('settings.encryption.rsa.private.label') })}
                        </Typography>
                        <Textarea
                          placeholder={formatMessage({ id: getTranslation('settings.encryption.rsa.private.placeholder') })}
                          value={settings.encryption.rsa.privateKey}
                          onChange={(e) => handleRsaChange('privateKey', e.target.value)}
                          rows={6}
                        />
                      </Flex>
                    </Box>
                  </Flex>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="beta" as="h3" marginBottom={4}>
                    {formatMessage({ id: getTranslation('settings.encryption.aes.title') })}
                  </Typography>
                  <Box maxWidth="400px">
                    <Flex direction="column" alignItems="stretch" gap={1}>
                      <Typography variant="sigma" textColor="neutral600" fontWeight="bold">
                        {formatMessage({ id: getTranslation('settings.encryption.aes.secret.label') })}
                      </Typography>
                      <TextInput
                        type="text"
                        placeholder={formatMessage({ id: getTranslation('settings.encryption.aes.secret.placeholder') })}
                        value={settings.encryption.aes.secret}
                        onChange={(e) => handleAesChange(e.target.value)}
                      />
                      <Typography variant="pi" textColor="neutral600">
                        {formatMessage({ id: getTranslation('settings.encryption.aes.secret.hint') })}
                      </Typography>
                    </Flex>
                  </Box>
                </Box>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Main>
  );
};

export default SettingsPage;
