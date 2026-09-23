async function fetchOrThrowConnectionError(url, options) {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인해주세요.",
        { cause: error }
      );
    }
    throw error;
  }
}

async function parseErrorResponse(response) {
  let detail;
  try {
    const data = await response.json();
    detail = data.detail;
  } catch {
    throw new Error(`요청이 실패했습니다. (status: ${response.status})`);
  }

  if (Array.isArray(detail)) {
    return new Error(detail.map((item) => item.msg).join(" "));
  }
  if (typeof detail === "string") {
    return new Error(detail);
  }
  return new Error(`요청이 실패했습니다. (status: ${response.status})`);
}

export async function sendChatMessage({
  message,
  model,
  systemPrompt,
  temperature,
  topP,
  numPredict,
}) {
  const response = await fetchOrThrowConnectionError("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      model,
      system_prompt: systemPrompt,
      temperature,
      top_p: topP,
      num_predict: numPredict,
    }),
  });

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  const data = await response.json();
  return {
    model: data.model,
    message: data.message,
    elapsedTime: data.elapsed_time,
  };
}

export async function fetchModels() {
  const response = await fetchOrThrowConnectionError("/models");

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  const data = await response.json();
  return data.models;
}
