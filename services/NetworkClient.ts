import Log from "../utils/Log";

export type NetworkRequest = {
  baseUrl: string;
  path: string;
  headers: Headers;
  method: string;
  body?: any;
};

const NetworkClient = {
  makeRequest: async (networkRequest: NetworkRequest) => {
    const url = networkRequest.baseUrl + networkRequest.path;
    Log.debug("REQUEST URL: " + url);
    // console.debug("REQUEST HEADERS: " + JSON.stringify(networkRequest.headers));
    // console.debug("REQUEST METHOD: " + networkRequest.method);
    // console.debug("REQUEST BODY: " + JSON.stringify(networkRequest.body));

    const response = await fetch(url, {
      headers: networkRequest.headers,
      method: networkRequest.method,
      body: networkRequest.body,
    });

    Log.debug(`RESPONSE STATUS CODE: ${response.status}`);

    if (response.status == 200) {
      const data = await response.json();
      // console.debug(`RESPONSE DATA: ${JSON.stringify(data)}`);
      return data;
    } else {
      return null;
    }
  },
};

export default NetworkClient;
