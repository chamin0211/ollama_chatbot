import { useEffect, useState } from 'react'
import './App.css'
import SettingsPanel from './components/SettingsPanel'
import ChatWindow from './components/ChatWindow'
import { fetchModels, sendChatMessage } from './api/chatApi'

function App() {
  const [messages, setMessages] = useState([])
  const [model, setModel] = useState("exaone3.5:7.8b")
  const [systemPrompt, setSystemPrompt] = useState("너는 초보자를 돕는 친절한 AI 강사다.")
  const [temperature, setTemperature] = useState(0.6)
  const [topP, setTopP] = useState(0.7)
  const [numPredict, setNumPredict] = useState(256)
  const [modelOptions, setModelOptions] = useState([])

  useEffect(() => {
    let ignore = false

    async function loadModels() {
      try {
        const models = await fetchModels()
        if (!ignore) {
          setModelOptions(models)
        }
      } catch (error) {
        if (!ignore) {
          console.error(error)
        }
      }
    }

    loadModels()
    return () => {
      ignore = true
    }
  }, [])

  async function handleSendMessage(content) {
    setMessages((prev) => [...prev, { role: "user", content }])

    try {
      const response = await sendChatMessage({
        message: content,
        model,
        systemPrompt,
        temperature,
        topP,
        numPredict,
      })
      setMessages((prev) => [...prev, { role: "assistant", content: response.message }])
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="app">
      <SettingsPanel
        model={model}
        systemPrompt={systemPrompt}
        temperature={temperature}
        topP={topP}
        numPredict={numPredict}
        modelOptions={modelOptions}
        onModelChange={setModel}
        onSystemPromptChange={setSystemPrompt}
        onTemperatureChange={setTemperature}
        onTopPChange={setTopP}
        onNumPredictChange={setNumPredict}
      />
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        onReset={() => setMessages([])}
        isLoading={false}
      />
    </div>
  )
}

export default App
