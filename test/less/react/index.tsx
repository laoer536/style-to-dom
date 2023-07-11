import Style from './index.module.less'
export default function Sss() {
  return (
    <div className={Style['root']}>
      <div className={Style['home']}>
        <div className={Style['title']}>
          <img className="img">##</img>
          <h2 className="h2">
            <div className={Style['h2-sub-title']}>
              <div className={Style['sss']}>##</div>
            </div>
          </h2>
        </div>
        <input className="input">##</input>
      </div>
    </div>
  )
}
