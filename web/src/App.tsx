import { useState } from 'react'
import './App.scss'
import { MdEditor } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'

function InputCard() {
  return (
    <div className={'input-card'}>
      <div className={'title'}>Please enter your style code</div>
      <textarea spellCheck={false} autoFocus={true} />
    </div>
  )
}

function App() {
  const [text, setText] = useState('# Hello Editor')
  const [isShowEdit, setIsShowEdit] = useState(false)

  return <div className="app">{isShowEdit ? <MdEditor modelValue={text} onChange={setText} /> : <InputCard />}</div>
}

export default App
