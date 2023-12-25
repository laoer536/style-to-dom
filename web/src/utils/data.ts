export const selfClosingTags = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]

export enum Parser {
  tsx = 'babel-ts',
  jsx = 'babel',
  vue = 'vue',
  html = 'html',
}

export const defaultCode = `.input-card {
    width: 60%;
    height: 70%;
    flex-shrink: 0;
    border-radius: 21.44px;
    background: rgba(217, 217, 217, 0.31);
    backdrop-filter: blur(10px);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    .title {
      color: #fff;
      font-size: 29.829px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      text-align: center;
    }
  }`
