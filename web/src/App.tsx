import { useState } from 'react'
import './App.scss'
import { MdEditor } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
import { defaultCode } from './utils/data.ts'

function InputCard() {
  const [textareaCode, setTextareaCode] = useState(defaultCode)
  return (
    <div className={'input-card'}>
      <div className={'title'}>Please enter your style code</div>
      <textarea value={textareaCode} spellCheck={false} autoFocus={true} />
    </div>
  )
}

function ResultCard() {
  return <div className={'result-card'}>ResultCard</div>
}

function App() {
  const [text, setText] = useState('# Hello Editor')
  const [isShowEdit, setIsShowEdit] = useState(false)

  return (
    <div className="app">
      <ResultCard />
      {isShowEdit ? <MdEditor modelValue={text} onChange={setText} /> : <InputCard />}
    </div>
  )
}

export default App
