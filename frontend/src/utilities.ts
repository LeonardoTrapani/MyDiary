interface CustomRequestInit extends RequestInit {
  requestBody: Record<string, unknown>;
}

export const myFetch = async (url: string, options?: CustomRequestInit) => {
  if (options) {
    options.body = JSON.stringify(options.requestBody);
    options.headers = {
      ...options.headers,
      'Content-Type': 'application/json',
    };
  }
  console.log('GOING TO FETCH');
  const result = await fetch(url, {
    ...options,
  });
  const data = await result.json();
  if (!result.ok) {
    throw new Error(data.message);
  }
  console.log(data);
  return data;
};
