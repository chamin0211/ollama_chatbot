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
  const [isModelLoading, setIsModelLoading] = useState(true)
  const [modelError, setModelError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    async function loadModels() {
      setIsModelLoading(true)
      setModelError(null)
      try {
        const models = await fetchModels()
        if (!ignore) {
          setModelOptions(models)
        }
      } catch (error) {
        if (!ignore) {
          setModelError(error.message)
        }
      } finally {
        if (!ignore) {
          setIsModelLoading(false)
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
    setIsLoading(true)
    setError(null)

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
    } catch (sendError) {
      setError(sendError.message)
    } finally {
      setIsLoading(false)
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
        isModelLoading={isModelLoading}
        modelError={modelError}
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
        isLoading={isLoading}
        error={error}
      />
    </div>
  )
}

export default App
