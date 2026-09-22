function SettingsPanel({
  model,
  systemPrompt,
  temperature,
  topP,
  numPredict,
  modelOptions,
  onModelChange,
  onSystemPromptChange,
  onTemperatureChange,
  onTopPChange,
  onNumPredictChange,
}) {
  return (
    <div className="settings-panel">
      <h2 className="settings-panel__title">설정</h2>

      <div className="settings-panel__field">
        <label htmlFor="model-select">모델</label>
        <select
          id="model-select"
          value={model}
          onChange={(event) => onModelChange(event.target.value)}
        >
          {modelOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="settings-panel__field">
        <label htmlFor="system-prompt">시스템 프롬프트</label>
        <textarea
          id="system-prompt"
          value={systemPrompt}
          onChange={(event) => onSystemPromptChange(event.target.value)}
        />
      </div>

      <div className="settings-panel__field">
        <label htmlFor="temperature">Temperature ({temperature})</label>
        <input
          id="temperature"
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={temperature}
          onChange={(event) => onTemperatureChange(Number(event.target.value))}
        />
      </div>

      <div className="settings-panel__field">
        <label htmlFor="top-p">Top P ({topP})</label>
        <input
          id="top-p"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={topP}
          onChange={(event) => onTopPChange(Number(event.target.value))}
        />
      </div>

      <div className="settings-panel__field">
        <label htmlFor="num-predict">Num Predict</label>
        <input
          id="num-predict"
          type="number"
          min="1"
          max="2048"
          value={numPredict}
          onChange={(event) => onNumPredictChange(Number(event.target.value))}
        />
      </div>
    </div>
  )
}

export default SettingsPanel
