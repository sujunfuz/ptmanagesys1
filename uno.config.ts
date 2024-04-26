import { defineConfig, toEscapedSelector as e, presetUno } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'

export default defineConfig({
  // ...UnoCSS options
  theme: {
    colors: {
      colorMain: 'var(--el-color-primary)',
      color579: '#F5F7F9',
      colorGray: '#797979',
      colorBlack: '#14181f',
      green1: '#00C068',
      green2: '#E5F9EF',
      red1: '#F45057',
      red2: '#FEEDEE',
      colorf025: '#F0F2F5',
      colorfff: '#fff',
      blue1: '#EBF3FD'
    }
  },
  shortcuts: {
    'flex-w': 'flex flex-wrap',
    'flex-a': 'flex justify-around',
    'flex-b': 'flex justify-between',
    'flex-cb': 'flex justify-between items-center',
    'flex-cc': 'flex justify-center items-center',
    'flex-c': 'flex items-center',
    'sel-unit': 'border-rd-4px border-(1px solid #C7C7C7) w-78px h-38px line-height-38px flex-cb',
    'unit-l': 'text-center w-45px',
    'unit-r': 'w-34px h-100% border-l-(1px solid #C7C7C7) bg-#F0F2F5 flex-cc',
    tag1: 'bg-#F0F2F5 pl-13px pr-13px border-rd-4px color-colorGray border-(1px solid #F0F2F5)',
    tag2: 'pl-13px pr-13px border-rd-4px color-colorBlack border-(1px solid #000)',
    tag3: 'pl-13px pr-13px border-rd-4px color-colorMain border-(1px solid color-colorMain)',
    clickAction: 'color-colorMain cursor-pointer',
    aCustomBtn:
      'ml-10px w-50px h-28px bg-white border-rd-4px font-size-14px border-(1px solid #797979) box-border text-center line-height-26px cursor-pointer',
    customBtnHover: '!border-colorMain !color-colorMain'
  },
  rules: [
    [
      /^custom-hover$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector} {
  display: flex;
  height: 100%;
  padding: 1px 10px 0;
  cursor: pointer;
  align-items: center;
  transition: background var(--transition-time-02);
}
/* you can have multiple rules */
${selector}:hover {
  background-color: var(--top-header-hover-color);
}
.dark ${selector}:hover {
  background-color: var(--el-bg-color-overlay);
}
`
      }
    ],
    [
      /^layout-border__left$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector}:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 100%;
  background-color: var(--el-border-color);
  z-index: 3;
}
`
      }
    ],
    [
      /^layout-border__right$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector}:after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background-color: var(--el-border-color);
  z-index: 3;
}
`
      }
    ],
    [
      /^layout-border__top$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector}:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--el-border-color);
  z-index: 3;
}
`
      }
    ],
    [
      /^layout-border__bottom$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector}:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--el-border-color);
  z-index: 3;
}
`
      }
    ]
  ],
  presets: [presetUno({ dark: 'class', attributify: false })],
  transformers: [transformerVariantGroup()]
})
