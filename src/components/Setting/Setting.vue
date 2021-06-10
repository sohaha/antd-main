<template>
  <div class="side-setting">
    <setting-item>
      <a-button type="primary" icon="save" @click="saveSetting">{{ $t('save') }}</a-button>
      <a-button type="dashed" icon="redo" style="float: right" @click="resetSetting">{{ $t('reset') }}</a-button>
    </setting-item>
    <setting-item :title="$t('theme.title')">
      <img-checkbox-group :default-values="[theme.mode]" @change="values => setTheme({ ...theme, mode: values[0] })">
        <img-checkbox
          :title="$t('theme.dark')"
          img="/img/dark.svg"
          value="dark"
        />
        <img-checkbox
          :title="$t('theme.light')"
          img="/img/light.svg"
          value="light"
        />
        <img-checkbox
          :title="$t('theme.night')"
          img="/img/night.svg"
          value="night"
        />
      </img-checkbox-group>
    </setting-item>
    <setting-item :title="$t('theme.color')">
      <color-checkbox-group
        :default-values="[palettes.indexOf(theme.color)]"
        :multiple="false"
        @change="(values, colors) => setTheme({ ...theme, color: colors[0] })"
      >
        <color-checkbox v-for="(color, index) in palettes" :key="index" :color="color" :value="index" />
      </color-checkbox-group>
    </setting-item>
    <a-divider />
    <setting-item :title="$t('navigate.title')">
      <img-checkbox-group :default-values="[layout]" @change="values => setLayout(values[0])">
        <img-checkbox
          :title="$t('navigate.side')"
          img="/img/side.svg"
          value="side"
        />
        <img-checkbox
          :title="$t('navigate.head')"
          img="/img/head.svg"
          value="head"
        />
        <img-checkbox
          :title="$t('navigate.mix')"
          img="/img/mix.svg"
          value="mix"
        />
      </img-checkbox-group>
    </setting-item>
    <setting-item>
      <a-list :split="false">
        <a-list-item>
          {{ $t('navigate.content.title') }}

          <template v-slot:actions>
            <a-select
              :get-popup-container="getPopupContainer"
              :value="pageWidth"
              class="select-item"
              size="small"
              @change="setPageWidth"
            >
              <a-select-option value="fluid">{{ $t('navigate.content.fluid') }}</a-select-option>
              <a-select-option value="fixed">{{ $t('navigate.content.fixed') }}</a-select-option>
            </a-select>
          </template>
        </a-list-item>
        <a-list-item>
          {{ $t('navigate.fixedHeader') }}
          <template v-slot:actions>
            <a-switch :checked="fixedHeader" size="small" @change="setFixedHeader" />
          </template>
        </a-list-item>
        <a-list-item>
          {{ $t('navigate.fixedSideBar') }}
          <template v-slot:actions>
            <a-switch :checked="fixedSideBar" size="small" @change="setFixedSideBar" />
          </template>
        </a-list-item>
      </a-list>
    </setting-item>
    <a-divider />
    <setting-item :title="$t('other.title')">
      <a-list :split="false">
        <a-list-item>
          {{ $t('other.weekMode') }}
          <template v-slot:actions>
            <a-switch :checked="weekMode" size="small" @change="setWeekMode" />
          </template>
        </a-list-item>
        <a-list-item>
          {{ $t('other.hideSetting') }}
          <template v-slot:actions>
            <a-switch :checked="hideSetting" size="small" @change="setHideSetting" />
          </template>
        </a-list-item>
      </a-list>
    </setting-item>
    <a-divider />
    <a-alert
      v-if="isDev"
      style="max-width: 240px; margin: -16px 0 8px; word-break: break-all"
      type="warning"
      :message="$t('alert')"
    />
    <a-button
      v-if="isDev"
      id="copyBtn"
      :data-clipboard-text="copyConfig"
      style="width: 100%"
      icon="copy"
      @click="copyCode"
      >{{ $t('copy') }}</a-button
    >
  </div>
</template>

<script>
import SettingItem from './SettingItem';
import ColorCheckbox from '@/components/Tools/ColorCheckbox';
import ImgCheckbox from '@/components/Tools/ImgCheckbox';
import Clipboard from 'clipboard';
import { mapState, mapMutations } from 'vuex';
import { formatConfig } from '@/utils/formatter';
import { setting } from '@/config/default';
import sysConfig from '@/config/config';
import fastEqual from 'fast-deep-equal';
import deepMerge from 'deepmerge';

const ColorCheckboxGroup = ColorCheckbox.Group;
const ImgCheckboxGroup = ImgCheckbox.Group;
export default {
  name: 'Setting',
  i18n: require('./i18n'),
  components: { ImgCheckboxGroup, ImgCheckbox, ColorCheckboxGroup, ColorCheckbox, SettingItem },
  data() {
    return {
      copyConfig: 'Sorry, you have copied nothing O(∩_∩)O~',
      isDev: process.env.NODE_ENV === 'development',
    };
  },
  computed: {
    ...mapState('setting', [
      'theme',
      'layout',
      'palettes',
      'weekMode',
      'fixedHeader',
      'fixedSideBar',
      'hideSetting',
      'pageWidth',
    ]),
  },
  methods: {
    getPopupContainer() {
      return this.$el.parentNode;
    },
    copyCode() {
      const config = this.extractConfig(false);
      this.copyConfig = `// 自定义配置，参考 ./default/setting.config.js，需要自定义的属性在这里配置即可
      module.exports = ${formatConfig(config)}
      `;
      const clipboard = new Clipboard('#copyBtn');
      clipboard.on('success', () => {
        this.$message.success(`复制成功，覆盖文件 src/config/config.js 然后重启项目即可生效`).then(() => {
          const localConfig = localStorage.getItem(process.env.VUE_APP_SETTING_KEY);
          if (localConfig) {
            console.warn('检测到本地有历史保存的主题配置，想要要拷贝的配置代码生效，您可能需要先重置配置');
            this.$message.warn('检测到本地有历史保存的主题配置，想要要拷贝的配置代码生效，您可能需要先重置配置', 5);
          }
        });
        clipboard.destroy();
      });
    },
    saveSetting() {
      const closeMessage = this.$message.loading('正在保存到本地，请稍后...', 0);
      const config = this.extractConfig(true);
      localStorage.setItem(process.env.VUE_APP_SETTING_KEY, JSON.stringify(config));
      setTimeout(closeMessage, 800);
    },
    resetSetting() {
      this.$confirm({
        title: '重置主题会刷新页面，当前页面内容不会保留，确认重置？',
        onOk() {
          localStorage.removeItem(process.env.VUE_APP_SETTING_KEY);
          window.location.reload();
        },
      });
    },
    // 提取配置
    extractConfig(local = false) {
      const config = {};
      const mySetting = this.$store.state.setting;
      const dftSetting = local ? deepMerge(setting, sysConfig) : setting;
      Object.keys(mySetting).forEach(key => {
        const dftValue = dftSetting[key];
        const myValue = mySetting[key];
        if (dftValue !== undefined && !fastEqual(dftValue, myValue)) {
          config[key] = myValue;
        }
      });
      return config;
    },
    ...mapMutations('setting', [
      'setTheme',
      'setLayout',
      'setWeekMode',
      'setFixedSideBar',
      'setFixedHeader',
      'setHideSetting',
      'setPageWidth',
    ]),
  },
};
</script>

<style lang="less" scoped>
.side-setting {
  min-height: 100%;
  background-color: @base-bg-color;
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  position: relative;
  .flex {
    display: flex;
  }
  .select-item {
    width: 80px;
  }
}
</style>
