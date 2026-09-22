import './App.css'
import SettingsPanel from './components/SettingsPanel'
import ChatWindow from './components/ChatWindow'

const MOCK_MODEL_OPTIONS = ["gemma3:4b", "exaone3.5:7.8b"]

const MOCK_MESSAGES = [
  {
    role: "user",
    content: "React와 FastAPI를 연결해서 로컬 LLM 채팅 앱을 만드는 과정을 3단계로 설명해줘.",
  },
  {
    role: "assistant",
    content: "1단계: FastAPI로 /chat 엔드포인트를 만든다...",
  },
]

function App() {
  const model = "exaone3.5:7.8b"
  const systemPrompt = "너는 초보자를 돕는 친절한 AI 강사다."
  const temperature = 0.6
  const topP = 0.7
  const numPredict = 256

  return (
    <div className="app">
      <SettingsPanel
        model={model}
        systemPrompt={systemPrompt}
        temperature={temperature}
        topP={topP}
        numPredict={numPredict}
        modelOptions={MOCK_MODEL_OPTIONS}
        onModelChange={() => {}}
        onSystemPromptChange={() => {}}
        onTemperatureChange={() => {}}
        onTopPChange={() => {}}
        onNumPredictChange={() => {}}
      />
      <ChatWindow
        messages={MOCK_MESSAGES}
        onSendMessage={() => {}}
        onReset={() => {}}
        isLoading={false}
      />
    </div>
  )
}

export default App
