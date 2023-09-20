<template>
  <div style="height: var(--content-height);display: flex;flex-direction: column;">
    <NText style="margin: 10px;" type="primary">生成v2内网穿透配置</NText>
    <div style="display: flex;align-items: stretch;flex: 1;overflow: hidden;">
      <NScrollbar style="flex: 1;">
        <NSpace vertical style="padding: 10px;">
          <NFormItem label="代理通信域名，不需要为真实存在的域名">
            <NInput placeholder="代理通信域名" v-model:value="clientConfig.fakeDomain"></NInput>
          </NFormItem>
          <NFormItem label="客户端反向代理标签（接收服务端数据的通道）">
            <NInput placeholder="客户端反向代理标签" v-model:value="clientConfig.bridgeTag"></NInput>
          </NFormItem>
          <NFormItem label="客户端出口标签（数据去往服务器的通道）">
            <NInput placeholder="客户端出口标签" v-model:value="clientConfig.tunnelTag"></NInput>
          </NFormItem>
          <NFormItem label="客户端被代理端口">
            <NInputNumber placeholder="客户端被代理端口" v-model:value="clientConfig.targetPort"></NInputNumber>
          </NFormItem>
          <NFormItem label="客户端目标标签（数据去往被代理的端口的通道）">
            <NInput placeholder="客户端目标标签" v-model:value="clientConfig.targetTag"></NInput>
          </NFormItem>
          <NFormItem label="服务端 host">
            <NInput placeholder="服务端 host" v-model:value="serverConfig.ip"></NInput>
          </NFormItem>
          <NFormItem label="服务端端口">
            <NInputNumber placeholder="服务端端口" v-model:value="serverConfig.port"></NInputNumber>
          </NFormItem>
          <NFormItem label="服务端入口协议">
            <NInput placeholder="服务端入口协议" v-model:value="serverConfig.protocol" disabled></NInput>
          </NFormItem>
          <NFormItem label="vmess user id">
            <NInput placeholder="vmess user id" v-model:value="serverConfig.vmess.id" />
          </NFormItem>
          <NFormItem label="vmess alterId（-1则没有）">
            <NInputNumber placeholder="vmess alterId" v-model:value="serverConfig.vmess.alterId" />
          </NFormItem>
          <NFormItem label="服务端反向代理标签（数据回客户端的通道）">
            <NInput placeholder="服务端反向代理标签" v-model:value="serverConfig.portalTag"></NInput>
          </NFormItem>
          <NFormItem label="服务端外部入口标签（接收外界数据的通道）">
            <NInput placeholder="服务端外部入口标签" v-model:value="serverConfig.externalTag"></NInput>
          </NFormItem>
          <NFormItem label="客户端代理入口标签（接收客户端数据的通道）">
            <NInput placeholder="客户端代理入口标签" v-model:value="serverConfig.clientPortalTag"></NInput>
          </NFormItem>
        </NSpace>
      </NScrollbar>
      <NDivider vertical style="height: auto;" />
      <div style="flex: 1;display: flex;flex-direction: column;">
        <NScrollbar style="flex: 1;">
          <NText>客户端配置</NText>
          <NButton size="tiny" style="margin-left: 10px;" @click="copy('client')">复制</NButton>
          <NCode :code="clientCode" :hljs="hljs" language="json"></NCode>
        </NScrollbar>
        <NDivider />
        <NScrollbar style="flex: 1;">
          <NText>服务端配置</NText>
          <NButton size="tiny" style="margin-left: 10px;" @click="copy('server')">复制</NButton>
          <NCode :code="serverCode" :hljs="hljs" language="json"></NCode>
        </NScrollbar>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { NSpace, NInput, NCode, NScrollbar, NInputNumber, NDivider, NText, NButton, NFormItem, useMessage } from 'naive-ui'
import { ref, reactive, watchEffect, readonly } from 'vue'

import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'

hljs.registerLanguage('json', json)
const message = useMessage()
const clientConfig = reactive({
  fakeDomain: '',
  bridgeTag: '',
  tunnelTag: '',
  targetPort: 0,
  targetTag: ''
})

const serverConfig = reactive({
  ip: '',
  port: 0,
  protocol: 'vmess',
  vmess: {
    id: '',
    alterId: -1,
  },
  portalTag: '',
  externalTag: '',
  clientPortalTag: ''
})
const clientConfigCopy = readonly(clientConfig),
  serverConfigCopy = readonly(serverConfig)
let clientCode = ref(''),
  serverCode = ref('')
watchEffect(() => {
  clientCode.value = JSON.stringify({
    reverse: {
      bridges: [
        {
          tag: clientConfigCopy.bridgeTag,
          domain: clientConfigCopy.fakeDomain
        }
      ]
    },
    outbounds: [
      {
        tag: clientConfigCopy.tunnelTag,
        protocol: "vmess",
        settings: {
          vnext: [
            {
              address: serverConfig.ip, // B 地址，IP 或 实际的域名
              port: serverConfig.port,
              users: [
                {
                  id: serverConfigCopy.vmess.id,
                  alterId: serverConfigCopy.vmess.alterId === -1 ? undefined : serverConfigCopy.vmess.alterId
                }
              ]
            }
          ]
        }
      },
      {
        protocol: "freedom",
        // settings: {
        //   redirect: `127.0.0.1:${clientConfigCopy.targetPort}`
        // },
        tag: clientConfigCopy.targetTag
      }
    ],
    routing: {
      rules: [
        {
          type: "field",
          inboundTag: [
            clientConfigCopy.bridgeTag
          ],
          domain: [
            `full:${clientConfigCopy.fakeDomain}`
          ],
          outboundTag: clientConfigCopy.tunnelTag
        },
        {
          type: "field",
          inboundTag: [
            clientConfigCopy.bridgeTag
          ],
          outboundTag: clientConfigCopy.targetTag
        }
      ]
    }
  }, null, 2)
  serverCode.value = JSON.stringify({
    reverse: {
      portals: [{
        tag: serverConfigCopy.portalTag,
        domain: clientConfigCopy.fakeDomain
      }]
    },
    inbounds: [{
      port: serverConfigCopy.port,
      tag: serverConfigCopy.clientPortalTag,
      protocol: serverConfigCopy.protocol,
      settings: {
        clients: [{
          id: serverConfigCopy.vmess.id,
          alterId: serverConfigCopy.vmess.alterId === -1 ? undefined : serverConfigCopy.vmess.alterId
        }]
      }
    }, {
      tag: serverConfigCopy.externalTag,
      port: clientConfigCopy.targetPort,
      protocol: "dokodemo-door",
      settings: {
        address: "127.0.0.1",
        port: clientConfigCopy.targetPort,
        network: "tcp,udp"
      }
    }],
    outbounds: [{
      protocol: "freedom",
      tag: "direct",
      settings: {}
    }],
    routing: {
      rules: [{
        type: "field",
        inboundTag: [
          serverConfigCopy.clientPortalTag
        ],
        domain: [
          `full:${clientConfigCopy.fakeDomain}`
        ],
        outboundTag: serverConfigCopy.portalTag
      }, {
        type: "field",
        inboundTag: [
          serverConfigCopy.clientPortalTag
        ],
        outboundTag: "direct"
      }, {
        type: "field",
        inboundTag: [serverConfigCopy.externalTag],
        outboundTag: serverConfigCopy.portalTag
      }]
    }
  }, null, 2)
})


function copy(str: 'client' | 'server') {
  if (str === 'client') {
    navigator.clipboard.writeText(clientCode.value).then(() => message.success('复制成功')).catch((err) => {
      console.error(err)
      message.warning('复制失败')
    })
  } else {
    navigator.clipboard.writeText(serverCode.value).then(() => message.success('复制成功')).catch((err) => {
      console.error(err)
      message.warning('复制失败')
    })
  }
}
</script>
<style lang="less"></style>